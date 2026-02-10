'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from '@/components/ui/dialog'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Loader2, Plus, Megaphone, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

export default function CommunicationPage() {
    const [announcements, setAnnouncements] = useState<any[]>([])
    const [classes, setClasses] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [newAnnouncement, setNewAnnouncement] = useState({
        title: '',
        content: '',
        target_audience: 'all',
        priority: 'normal',
        class_ids: [] as string[]
    })

    const supabase = createClient()

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            const { data: roleData } = await supabase
                .from('user_roles')
                .select('school_id')
                .eq('user_id', user.id)
                .single()

            const [announcementsData, classesData] = await Promise.all([
                supabase
                    .from('announcements')
                    .select('*')
                    .eq('school_id', roleData?.school_id)
                    .order('created_at', { ascending: false }),
                supabase
                    .from('classes')
                    .select('id, name')
                    .eq('school_id', roleData?.school_id)
            ])

            setAnnouncements(announcementsData.data || [])
            setClasses(classesData.data || [])
        } catch (error) {
            console.error('Error fetching data:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleCreateAnnouncement = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            const { data: roleData } = await supabase
                .from('user_roles')
                .select('school_id')
                .eq('user_id', user.id)
                .single()

            const targetAudience = newAnnouncement.target_audience === 'all'
                ? ['students', 'teachers', 'parents']
                : [newAnnouncement.target_audience]

            const { error } = await supabase
                .from('announcements')
                .insert([{
                    school_id: roleData?.school_id,
                    author_id: user.id,
                    title: newAnnouncement.title,
                    content: newAnnouncement.content,
                    target_audience: targetAudience,
                    priority: newAnnouncement.priority,
                    class_ids: newAnnouncement.class_ids.length > 0 ? newAnnouncement.class_ids : null,
                    is_published: true,
                    published_at: new Date().toISOString()
                }])

            if (error) throw error

            toast.success('Announcement created successfully')
            setIsDialogOpen(false)
            setNewAnnouncement({ title: '', content: '', target_audience: 'all', priority: 'normal', class_ids: [] })
            fetchData()
        } catch (error: any) {
            toast.error(error.message || 'Failed to create announcement')
        } finally {
            setIsSubmitting(false)
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
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Communication Center</h1>
                    <p className="text-gray-500">Send announcements to students, teachers, and parents</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-blue-600 hover:bg-blue-700">
                            <Megaphone className="mr-2 h-4 w-4" /> New Announcement
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Create Announcement</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleCreateAnnouncement} className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    id="title"
                                    placeholder="Announcement title"
                                    value={newAnnouncement.title}
                                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="content">Message</Label>
                                <Textarea
                                    id="content"
                                    placeholder="Write your announcement here..."
                                    rows={5}
                                    value={newAnnouncement.content}
                                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="audience">Target Audience</Label>
                                    <Select
                                        value={newAnnouncement.target_audience}
                                        onValueChange={(value) => setNewAnnouncement({ ...newAnnouncement, target_audience: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Everyone</SelectItem>
                                            <SelectItem value="students">Students Only</SelectItem>
                                            <SelectItem value="teachers">Teachers Only</SelectItem>
                                            <SelectItem value="parents">Parents Only</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="priority">Priority</Label>
                                    <Select
                                        value={newAnnouncement.priority}
                                        onValueChange={(value) => setNewAnnouncement({ ...newAnnouncement, priority: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="low">Low</SelectItem>
                                            <SelectItem value="normal">Normal</SelectItem>
                                            <SelectItem value="high">High</SelectItem>
                                            <SelectItem value="urgent">Urgent</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit" disabled={isSubmitting} className="w-full">
                                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Megaphone className="mr-2 h-4 w-4" />}
                                    Publish Announcement
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Announcements List */}
            <div className="space-y-4">
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                    </div>
                ) : announcements.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center h-64 text-gray-500">
                            <Megaphone className="h-12 w-12 mb-4 text-gray-400" />
                            <p>No announcements yet. Create your first announcement!</p>
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
                                                {announcement.priority.toUpperCase()}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                            <span>{new Date(announcement.created_at).toLocaleString()}</span>
                                            <Badge variant="outline">
                                                {Array.isArray(announcement.target_audience)
                                                    ? announcement.target_audience.join(', ')
                                                    : announcement.target_audience}
                                            </Badge>
                                        </div>
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
