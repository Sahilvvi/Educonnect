'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Loader2, Send, Mail, MessageSquare } from 'lucide-react'
import { toast } from 'sonner'

export default function ParentMessagesPage() {
    const [messages, setMessages] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [newMessage, setNewMessage] = useState({
        subject: '',
        body: ''
    })
    const [currentUser, setCurrentUser] = useState<any>(null)

    const supabase = createClient()

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            setCurrentUser(user)
        }
        getUser()
        fetchMessages()
    }, [])

    const fetchMessages = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            const { data } = await supabase
                .from('messages')
                .select('*')
                .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
                .order('created_at', { ascending: false })

            setMessages(data || [])
        } catch (error) {
            console.error('Error fetching messages:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            // Get parent's school admin to send message to
            const { data: parentProfile } = await supabase
                .from('parent_profiles')
                .select('school_id')
                .eq('user_id', user.id)
                .single()

            // Get school admin user_id
            const { data: adminRole } = await supabase
                .from('user_roles')
                .select('user_id')
                .eq('school_id', parentProfile?.school_id)
                .eq('role', 'admin')
                .limit(1)
                .single()

            const { error } = await supabase
                .from('messages')
                .insert([{
                    sender_id: user.id,
                    recipient_id: adminRole?.user_id,
                    school_id: parentProfile?.school_id,
                    subject: newMessage.subject,
                    body: newMessage.body
                }])

            if (error) throw error

            toast.success('Message sent successfully')
            setIsDialogOpen(false)
            setNewMessage({ subject: '', body: '' })
            fetchMessages()
        } catch (error: any) {
            toast.error(error.message || 'Failed to send message')
        } finally {
            setIsSubmitting(false)
        }
    }

    const markAsRead = async (messageId: string) => {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            await supabase
                .from('messages')
                .update({ is_read: true, read_at: new Date().toISOString() })
                .eq('id', messageId)
                .eq('recipient_id', user.id)

            fetchMessages()
        } catch (error) {
            console.error('Error marking message as read:', error)
        }
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Messages</h1>
                    <p className="text-gray-500">Communicate with teachers and school administration</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-blue-600">
                            <Send className="mr-2 h-4 w-4" /> New Message
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Send Message to School</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSendMessage} className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="subject">Subject</Label>
                                <Input
                                    id="subject"
                                    placeholder="Message subject"
                                    value={newMessage.subject}
                                    onChange={(e) => setNewMessage({ ...newMessage, subject: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="body">Message</Label>
                                <Textarea
                                    id="body"
                                    placeholder="Type your message here..."
                                    rows={6}
                                    value={newMessage.body}
                                    onChange={(e) => setNewMessage({ ...newMessage, body: e.target.value })}
                                    required
                                />
                            </div>
                            <DialogFooter>
                                <Button type="submit" disabled={isSubmitting} className="w-full">
                                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                                    Send Message
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="space-y-4">
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                    </div>
                ) : messages.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center h-64 text-gray-500">
                            <MessageSquare className="h-12 w-12 mb-4 text-gray-400" />
                            <p>No messages yet</p>
                        </CardContent>
                    </Card>
                ) : (
                    messages.map((message) => {
                        const isReceived = message.recipient_id === currentUser?.id

                        return (
                            <Card
                                key={message.id}
                                className={`cursor-pointer transition-colors ${!message.is_read && isReceived ? 'bg-blue-50 border-blue-200' : ''
                                    }`}
                                onClick={() => isReceived && !message.is_read && markAsRead(message.id)}
                            >
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                {isReceived ? (
                                                    <Mail className="h-4 w-4 text-blue-600" />
                                                ) : (
                                                    <Send className="h-4 w-4 text-green-600" />
                                                )}
                                                <CardTitle className="text-lg">{message.subject || 'No Subject'}</CardTitle>
                                                {!message.is_read && isReceived && (
                                                    <Badge className="bg-blue-600">New</Badge>
                                                )}
                                                <Badge variant="outline" className={isReceived ? 'bg-blue-50' : 'bg-green-50'}>
                                                    {isReceived ? 'Received' : 'Sent'}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                {new Date(message.created_at).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-700 whitespace-pre-wrap">{message.body}</p>
                                </CardContent>
                            </Card>
                        )
                    })
                )}
            </div>
        </div>
    )
}
