import { Check, CheckCheck, X } from "lucide-react";
import { Observer } from "mobx-react-lite";
import { notificationsStore } from "./NotificationsFrag";
import { Popover, PopoverContent, PopoverTrigger } from "~/ui/widgets/popover/Popover";

function formatTimeAgo(date: Date): string {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
}

export function NotificationsDialog({ children }: { children: React.ReactNode }) {
    return (
        <Popover
            open={notificationsStore.isOpen}
            onOpenChange={(open) => {
                if (open) {
                    notificationsStore.openDialog();
                } else {
                    notificationsStore.closeDialog();
                }
            }}
        >
            <PopoverTrigger asChild>
                <>{children}</>
            </PopoverTrigger>
            <PopoverContent
                className="w-full h-full max-w-none max-h-none bg-white dark:bg-gray-900 border-0 rounded-none md:rounded-lg md:border md:max-w-md md:max-h-96 md:h-auto md:w-96 z-50"
                side="bottom"
                align="end"
                sideOffset={8}
                collisionPadding={16}
            >
                <NotificationsContent />
            </PopoverContent>
        </Popover>
    );
}

function NotificationsContent() {
    return (
        <Observer>
            {() => (
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-2">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Notifications
                            </h2>
                            {notificationsStore.unreadCount > 0 && (
                                <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                    {notificationsStore.unreadCount}
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            {notificationsStore.unreadCount > 0 && (
                                <button
                                    onClick={() => notificationsStore.markAllAsRead()}
                                    className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
                                >
                                    <CheckCheck size={14} />
                                    Mark all read
                                </button>
                            )}
                            <button
                                onClick={() => notificationsStore.closeDialog()}
                                className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors md:hidden"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Notifications List */}
                    <div className="flex-1 overflow-y-auto">
                        {notificationsStore.notifications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                                <div className="text-4xl mb-4">🔔</div>
                                <p className="text-center">No notifications yet</p>
                                <p className="text-sm text-center mt-1">We'll notify you when something important happens</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-200 dark:divide-gray-700">
                                {notificationsStore.notifications.map((notification) => (
                                    <NotificationItem key={notification.id} notification={notification} />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-4 border-t border-gray-200 dark:border-gray-700 md:hidden">
                        <button
                            onClick={() => notificationsStore.closeDialog()}
                            className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </Observer>
    );
}

function NotificationItem({ notification }: { notification: typeof notificationsStore.notifications[0] }) {
    const getTypeStyles = (type: string) => {
        switch (type) {
            case 'success':
                return 'border-l-green-500 bg-green-50 dark:bg-green-900/20';
            case 'warning':
                return 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
            case 'error':
                return 'border-l-red-500 bg-red-50 dark:bg-red-900/20';
            default:
                return 'border-l-blue-500 bg-blue-50 dark:bg-blue-900/20';
        }
    };

    return (
        <div
            className={`p-4 border-l-4 ${getTypeStyles(notification.type)} ${!notification.read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
        >
            <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className={`text-sm font-medium ${notification.read ? 'text-gray-600 dark:text-gray-400' : 'text-gray-900 dark:text-white'}`}>
                            {notification.title}
                        </h3>
                        {!notification.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                        )}
                    </div>
                    <p className={`text-sm ${notification.read ? 'text-gray-500 dark:text-gray-400' : 'text-gray-700 dark:text-gray-300'}`}>
                        {notification.message}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        {formatTimeAgo(notification.timestamp)}
                    </p>
                </div>
                {!notification.read && (
                    <button
                        onClick={() => notificationsStore.markAsRead(notification.id)}
                        className="ml-2 p-1 text-blue-600 hover:text-blue-700 hover:bg-blue-100 rounded-md transition-colors"
                        title="Mark as read"
                    >
                        <Check size={14} />
                    </button>
                )}
            </div>
        </div>
    );
}