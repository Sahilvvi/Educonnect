'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Paperclip, MoreVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { format } from 'date-fns'
import { sendMessage } from '@/lib/actions/messaging'
import { toast } from 'sonner'

interface Message {
    id: string
    sender_id: string
    body: string
    created_at: string
    is_read: boolean
}

interface Contact {
    id: string
    name: string
    role: string
    school_name?: string
    school_id?: string
}

interface MessageThreadProps {
    contact?: Contact
    messages: Message[]
    currentUserId: string
}

export function MessageThread({ contact, messages, currentUserId }: MessageThreadProps) {
    const [newMessage, setNewMessage] = useState('')
    const [isSending, setIsSending] = useState(false)
    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        // Scroll to bottom on new messages
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' })
        }
    }, [messages])

    if (!contact) {
        return (
            <div className="h-full flex items-center justify-center bg-slate-50 text-muted-foreground">
                Select a conversation to start messaging
            </div>
        )
    }

    const handleSend = async () => {
        if (!newMessage.trim()) return

        setIsSending(true)
        try {
            const formData = new FormData()
            formData.append('recipientId', contact.id)
            formData.append('content', newMessage)
            formData.append('subject', 'Message') // Default subject
            if (contact.school_id) {
                formData.append('schoolId', contact.school_id)
            }

            await sendMessage(formData)
            setNewMessage('')
        } catch (error) {
            toast.error('Failed to send message')
        } finally {
            setIsSending(false)
        }
    }

    return (
        <div className="flex flex-col h-full bg-slate-50/50">
            {/* Thread Header */}
            <div className="p-4 bg-white border-b flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Avatar>
                        <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h3 className="font-semibold">{contact.name}</h3>
                        <p className="text-xs text-muted-foreground">
                            {contact.role} {contact.school_name ? `• ${contact.school_name}` : ''}
                        </p>
                    </div>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Profile</DropdownMenuItem>
                        <DropdownMenuItem>Mute Notifications</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                    {messages.map((message) => {
                        const isMe = message.sender_id === currentUserId
                        return (
                            <div
                                key={message.id}
                                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[70%] rounded-lg p-3 ${isMe
                                            ? 'bg-blue-600 text-white rounded-br-none'
                                            : 'bg-white border rounded-bl-none'
                                        }`}
                                >
                                    <p className="text-sm whitespace-pre-wrap">{message.body}</p>
                                    <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-blue-100' : 'text-muted-foreground'
                                        }`}>
                                        {format(new Date(message.created_at), 'h:mm a')}
                                    </p>
                                </div>
                            </div>
                        )
                    })}
                    <div ref={scrollRef} />
                </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="p-4 bg-white border-t">
                <div className="flex items-end gap-2">
                    <Button variant="ghost" size="icon" className="shrink-0">
                        <Paperclip className="h-4 w-4 text-muted-foreground" />
                    </Button>
                    <Textarea
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="min-h-[2.5rem] max-h-32 resize-none"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault()
                                handleSend()
                            }
                        }}
                    />
                    <Button
                        onClick={handleSend}
                        disabled={!newMessage.trim() || isSending}
                        size="icon"
                        className="shrink-0"
                    >
                        {isSending ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        ) : (
                            <Send className="h-4 w-4" />
                        )}
                    </Button>
                </div>
            </div>
        </div>
    )
}
