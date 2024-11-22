import { useUIStore } from '@/store';

type NotificationType = 'success' | 'error' | 'info' | 'warning';

class NotificationService {
  private static instance: NotificationService;

  private constructor() {}

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  showNotification(type: NotificationType, message: string) {
    useUIStore.getState().addNotification(type, message);
  }

  showSuccess(message: string) {
    this.showNotification('success', message);
  }

  showError(message: string) {
    this.showNotification('error', message);
  }

  showInfo(message: string) {
    this.showNotification('info', message);
  }

  showWarning(message: string) {
    this.showNotification('warning', message);
  }
}

export const notificationService = NotificationService.getInstance();
