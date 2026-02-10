'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, Megaphone, AlertCircle } from 'lucide-react'

export default function ParentAnnouncementsPage() {
    const [announcements, setAnnouncements] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    const supabase = createClient()

    useEffect(() => {
        fetchAnnouncements()
    }, [])

    const fetchAnnouncements = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            // Get parent profile
            const { data: parentProfile } = await supabase
                .from('parent_profiles')
                .select('id')
                .eq('user_id', user.id)
                .single()

            // Get children to find their schools
            const { data: children } = await supabase
                .from('parent_student_mapping')
                .select(`
                    students (
                        school_id
                    )
                `)
                .eq('parent_id', parentProfile?.id)

            const schoolIds = [...new Set((children as any)?.map((c: any) => c.students?.school_id).filter(Boolean))]

            // Fetch announcements for those schools targeting parents
            const { data } = await supabase
                .from('announcements')
                .select('*')
                .in('school_id', schoolIds)
                .contains('target_audience', ['parents'])
                .eq('is_published', true)
                .order('created_at', { ascending: false })

            setAnnouncements(data || [])
        } catch (error) {
            console.error('Error fetching announcements:', error)
        } finally {
            setLoading(false)
        }
    }

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'urgent': return 'bg-red-100 text-red-800 border-red-200'
            case 'high': return 'bg-orange-100 text-orange-800 border-orange-200'
            case 'normal': return 'bg-blue-100 text-blue-800 border-blue-200'
            case 'low': return 'bg-gray-100 text-gray-800 border-gray-200'
            default: return 'bg-gray-100 text-gray-800 border-gray-200'
        }
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">School Announcements</h1>
                <p className="text-gray-500">Important updates and announcements from the school</p>
            </div>

            <div className="space-y-4">
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                    </div>
                ) : announcements.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center h-64 text-gray-500">
                            <Megaphone className="h-12 w-12 mb-4 text-gray-400" />
                            <p>No announcements available at the moment</p>
                        </CardContent>
                    </Card>
                ) : (
                    announcements.map((announcement) => (
                        <Card key={announcement.id}>
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <CardTitle className="text-xl">{announcement.title}</CardTitle>
                                            <Badge className={getPriorityColor(announcement.priority)}>
                                                {announcement.priority === 'urgent' && <AlertCircle className="h-3 w-3 mr-1" />}
                                                {announcement.priority.toUpperCase()}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            {new Date(announcement.created_at).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-700 whitespace-pre-wrap">{announcement.content}</p>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}
