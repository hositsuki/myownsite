import React, { useEffect, useState } from 'react';

interface AdProps {
  slot: string;
  format?: 'auto' | 'fluid' | 'rectangle' | 'vertical' | 'horizontal';
  style?: React.CSSProperties;
  className?: string;
  debug?: boolean;
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

export const Advertisement: React.FC<AdProps> = ({
  slot,
  format = 'auto',
  style,
  className,
  debug = process.env.NODE_ENV === 'development',
}) => {
  const [isClient, setIsClient] = useState(false);
  const [isAdBlockerDetected, setIsAdBlockerDetected] = useState(false);
  const [isDebug, setIsDebug] = useState(debug);

  useEffect(() => {
    setIsClient(true);
    checkAdBlocker();
  }, []);

  const checkAdBlocker = async () => {
    try {
      const response = await fetch('https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js', {
        method: 'HEAD',
        mode: 'no-cors'
      });
    } catch (error) {
      console.warn('AdBlocker detected:', error);
      setIsAdBlockerDetected(true);
    }
  };

  useEffect(() => {
    if (isClient && !isAdBlockerDetected) {
      try {
        const adsbygoogle = (window as any).adsbygoogle || [];
        adsbygoogle.push({});
      } catch (error) {
        console.error('Error loading advertisement:', error);
      }
    }
  }, [isClient, isAdBlockerDetected]);

  if (!isClient || !slot || isAdBlockerDetected) {
    if (isDebug) {
      return (
        <div 
          className={`advertisement-container debug ${className || ''} ${format}`}
          style={{
            border: '2px dashed #666',
            padding: '1rem',
            ...style,
          }}
        >
          <div className="text-center">
            {!isClient && <p>Client-side rendering not ready</p>}
            {!slot && <p>No ad slot provided</p>}
            {isAdBlockerDetected && <p>Ad blocker detected</p>}
          </div>
        </div>
      );
    }
    return null;
  }

  return (
    <div className={`advertisement-container ${className || ''} ${format}`}>
      <ins
        className="adsbygoogle"
        style={{
          display: 'block',
          textAlign: 'center',
          ...style,
        }}
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_ID}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
      {isDebug && (
        <div className="text-xs text-gray-500">
          <p>Ad Client: {process.env.NEXT_PUBLIC_ADSENSE_ID}</p>
          <p>Ad Slot: {slot}</p>
          <p>Format: {format}</p>
        </div>
      )}
    </div>
  );
};
