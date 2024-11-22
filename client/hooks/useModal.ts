import { useState, useCallback } from 'react';

interface UseModalOptions {
  defaultVisible?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
}

export function useModal(options: UseModalOptions = {}) {
  const { defaultVisible = false, onOpen, onClose } = options;

  const [visible, setVisible] = useState(defaultVisible);
  const [data, setData] = useState<any>(null);

  const open = useCallback(
    (modalData?: any) => {
      setVisible(true);
      setData(modalData);
      onOpen?.();
    },
    [onOpen]
  );

  const close = useCallback(() => {
    setVisible(false);
    setData(null);
    onClose?.();
  }, [onClose]);

  const toggle = useCallback(() => {
    if (visible) {
      close();
    } else {
      open();
    }
  }, [visible, open, close]);

  return {
    visible,
    data,
    open,
    close,
    toggle,
  };
}
