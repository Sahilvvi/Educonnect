import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, AlertTriangle, Info, Pin } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface Announcement {
    id: string
    title: string
    content: string
    announcement_type: 'general' | 'academic' | 'event' | 'emergency'
    priority: 'low' | 'normal' | 'high' | 'urgent'
    school_name: string
    created_at: string
    author_name: string
}

export function AnnouncementCard({ announcement }: { announcement: Announcement }) {
    const isEmergency = announcement.priority === 'urgent' || announcement.announcement_type === 'emergency'

    const getIcon = () => {
        if (isEmergency) return <AlertTriangle className="h-5 w-5 text-red-600" />
        if (announcement.announcement_type === 'event') return <Calendar className="h-5 w-5 text-blue-600" />
        return <Info className="h-5 w-5 text-gray-600" />
    }

    const getBorderColor = () => {
        if (isEmergency) return 'border-l-4 border-l-red-600'
        if (announcement.priority === 'high') return 'border-l-4 border-l-orange-500'
        return 'border-l-4 border-l-blue-500'
    }

    return (
        <Card className={`mb-4 hover:shadow-md transition-shadow ${getBorderColor()}`}>
            <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                        <div className={`mt-1 p-2 rounded-full ${isEmergency ? 'bg-red-100' : 'bg-gray-100'}`}>
                            {getIcon()}
                        </div>
                        <div>
                            <CardTitle className="text-lg font-semibold">{announcement.title}</CardTitle>
                            <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                                <span className="font-medium text-gray-700">{announcement.school_name}</span>
                                <span>•</span>
                                <span>{formatDistanceToNow(new Date(announcement.created_at), { addSuffix: true })}</span>
                            </div>
                        </div>
                    </div>
                    {announcement.priority === 'high' || isEmergency ? (
                        <Badge variant={isEmergency ? "destructive" : "default"}>
                            {announcement.priority.toUpperCase()}
                        </Badge>
                    ) : null}
                </div>
            </CardHeader>
            <CardContent>
                <p className="text-gray-700 whitespace-pre-wrap">{announcement.content}</p>
                <div className="mt-4 pt-4 border-t flex items-center justify-between text-xs text-gray-500">
                    <span>Posted by {announcement.author_name}</span>
                    <span className="capitalize">{announcement.announcement_type} Update</span>
                </div>
            </CardContent>
        </Card>
    )
}
