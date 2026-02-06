'use client'

import { format } from 'date-fns'
import { User, School, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

interface Conversation {
    id: string
    contact: {
        id: string
        name: string
        role: string
        avatar_url?: string
        school_name?: string
    }
    lastMessage: {
        body: string
        created_at: string
        is_read: boolean
        sender_id: string
    }
}

interface MessageListProps {
    conversations: Conversation[]
    selectedId?: string
    onSelect: (id: string) => void
    userId: string
}

export function MessageList({ conversations, selectedId, onSelect, userId }: MessageListProps) {
    return (
        <div className="flex flex-col h-full bg-white border-r">
            <div className="p-4 border-b">
                <h2 className="text-xl font-semibold mb-4">Messages</h2>
                <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search messages..." className="pl-8" />
                </div>
            </div>
            <ScrollArea className="flex-1">
                <div className="flex flex-col">
                    {conversations.length === 0 ? (
                        <div className="p-8 text-center text-muted-foreground">
                            No messages yet
                        </div>
                    ) : (
                        conversations.map((conv) => (
                            <button
                                key={conv.id}
                                onClick={() => onSelect(conv.contact.id)}
                                className={`flex items-start gap-4 p-4 text-left hover:bg-slate-50 transition-colors ${selectedId === conv.contact.id ? 'bg-slate-100' : ''
                                    }`}
                            >
                                <Avatar>
                                    <AvatarImage src={conv.contact.avatar_url} />
                                    <AvatarFallback>
                                        {conv.contact.name.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="font-medium truncate">{conv.contact.name}</span>
                                        <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                                            {format(new Date(conv.lastMessage.created_at), 'MMM d, h:mm a')}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                                        <Badge variant="outline" className="text-[10px] px-1 py-0 h-4">
                                            {conv.contact.role}
                                        </Badge>
                                        {conv.contact.school_name && (
                                            <span className="truncate">• {conv.contact.school_name}</span>
                                        )}
                                    </div>
                                    <p className={`text-sm truncate ${!conv.lastMessage.is_read && conv.lastMessage.sender_id !== userId
                                            ? 'font-semibold text-foreground'
                                            : 'text-muted-foreground'
                                        }`}>
                                        {conv.lastMessage.sender_id === userId ? 'You: ' : ''}
                                        {conv.lastMessage.body}
                                    </p>
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </ScrollArea>
        </div>
    )
}
