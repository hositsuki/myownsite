import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheckCircle, FiAlertCircle, FiInfo, FiAlertTriangle } from 'react-icons/fi';
import { useUIStore } from '@/store';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

interface NotificationProps {
  type: NotificationType;
  title: string;
  message?: string;
  onClose?: () => void;
  duration?: number;
}

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
}

const icons: Record<NotificationType, typeof FiCheckCircle> = {
  success: FiCheckCircle,
  error: FiAlertCircle,
  info: FiInfo,
  warning: FiAlertTriangle,
};

const colors: Record<NotificationType, string> = {
  success: 'bg-green-500',
  error: 'bg-red-500',
  info: 'bg-blue-500',
  warning: 'bg-yellow-500',
};

export function Notifications() {
  const { notifications, removeNotification } = useUIStore();

  useEffect(() => {
    notifications.forEach((notification) => {
      const timer = setTimeout(() => {
        removeNotification(notification.id);
      }, 5000);

      return () => clearTimeout(timer);
    });
  }, [notifications, removeNotification]);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <AnimatePresence>
        {notifications.map((notification) => {
          const Icon = icons[notification.type];

          return (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 50, scale: 0.3 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
              className={`flex items-center justify-between w-96 px-4 py-3 mb-2 rounded-lg text-white shadow-lg ${
                colors[notification.type]
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className="w-6 h-6" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{notification.title}</p>
                  {notification.message && (
                    <p className="text-sm mt-1">{notification.message}</p>
                  )}
                </div>
              </div>
              <button
                onClick={() => removeNotification(notification.id)}
                className="p-1 hover:bg-white/20 rounded-full transition-colors"
              >
                <FiAlertTriangle className="w-5 h-5" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
