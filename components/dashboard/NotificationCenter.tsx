'use client'

import { Bell, School, MessageSquare, Calendar } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDistanceToNow } from 'date-fns'

interface Notification {
    id: string
    notification_type: string
    title: string
    body: string
    student_name?: string
    school_name?: string
    is_read: boolean
    created_at: string
}

interface NotificationCenterProps {
    notifications: Notification[]
}

export function NotificationCenter({ notifications }: NotificationCenterProps) {
    const getIcon = (type: string) => {
        switch (type) {
            case 'absence':
                return <Calendar className="h-4 w-4" />
            case 'homework':
                return <School className="h-4 w-4" />
            case 'announcement':
                return <Bell className="h-4 w-4" />
            case 'message':
                return <MessageSquare className="h-4 w-4" />
            default:
                return <Bell className="h-4 w-4" />
        }
    }

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'absence':
                return 'text-red-600 bg-red-100'
            case 'homework':
                return 'text-blue-600 bg-blue-100'
            case 'announcement':
                return 'text-purple-600 bg-purple-100'
            case 'message':
                return 'text-green-600 bg-green-100'
            case 'fee':
                return 'text-orange-600 bg-orange-100'
            default:
                return 'text-gray-600 bg-gray-100'
        }
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        <Bell className="h-5 w-5" />
                        Recent Notifications
                    </CardTitle>
                    <Badge variant="secondary">{notifications.length} New</Badge>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <Bell className="h-12 w-12 mx-auto mb-2 opacity-20" />
                            <p>No notifications yet</p>
                        </div>
                    ) : (
                        notifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={`p-3 rounded-lg border transition-all hover:shadow-md cursor-pointer ${notification.is_read ? 'bg-white' : 'bg-blue-50 border-blue-200'
                                    }`}
                            >
                                <div className="flex items-start gap-3">
                                    <div
                                        className={`p-2 rounded-full ${getTypeColor(
                                            notification.notification_type
                                        )}`}
                                    >
                                        {getIcon(notification.notification_type)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2 mb-1">
                                            <h4 className="font-semibold text-sm">
                                                {notification.title}
                                            </h4>
                                            {!notification.is_read && (
                                                <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-1" />
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-600 mb-2">
                                            {notification.body}
                                        </p>
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                            {notification.student_name && (
                                                <span className="font-medium">
                                                    {notification.student_name}
                                                </span>
                                            )}
                                            {notification.school_name && (
                                                <>
                                                    <span>•</span>
                                                    <span>{notification.school_name}</span>
                                                </>
                                            )}
                                            <span>•</span>
                                            <span>
                                                {formatDistanceToNow(new Date(notification.created_at), {
                                                    addSuffix: true,
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
