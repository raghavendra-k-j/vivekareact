import { makeAutoObservable } from "mobx";

export interface Notification {
    id: string;
    title: string;
    message: string;
    timestamp: Date;
    read: boolean;
    type: 'info' | 'success' | 'warning' | 'error';
}

class NotificationsDialogStore {
    notifications: Notification[] = [
        {
            id: '1',
            title: 'Welcome to the platform!',
            message: 'Your account has been successfully set up. Explore the features and get started.',
            timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
            read: false,
            type: 'success'
        },
        {
            id: '2',
            title: 'New feature available',
            message: 'Check out the new theme customization options in your settings.',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
            read: false,
            type: 'info'
        },
        {
            id: '3',
            title: 'System maintenance',
            message: 'Scheduled maintenance will occur tonight from 2-4 AM. Some features may be unavailable.',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
            read: true,
            type: 'warning'
        },
        {
            id: '4',
            title: 'Account security',
            message: 'Your password was changed successfully. If you didn\'t make this change, please contact support.',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
            read: true,
            type: 'error'
        }
    ];

    isOpen = false;

    constructor() {
        makeAutoObservable(this);
    }

    toggleDialog() {
        this.isOpen = !this.isOpen;
    }

    openDialog() {
        this.isOpen = true;
    }

    closeDialog() {
        this.isOpen = false;
    }

    markAsRead(notificationId: string) {
        const notification = this.notifications.find(n => n.id === notificationId);
        if (notification) {
            notification.read = true;
        }
    }

    markAllAsRead() {
        this.notifications.forEach(notification => {
            notification.read = true;
        });
    }

    get unreadCount() {
        return this.notifications.filter(n => !n.read).length;
    }

    get totalCount() {
        return this.notifications.length;
    }
}

export const notificationsStore = new NotificationsDialogStore();