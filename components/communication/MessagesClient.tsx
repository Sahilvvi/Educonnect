'use client'

import { useState } from 'react'
import { MessageList } from '@/components/communication/MessageList'
import { MessageThread } from '@/components/communication/MessageThread'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

interface MessagePageProps {
    conversations: any[]
    currentUserId: string
    initialMessages?: any[]
}

export default function MessagesClient({ conversations, currentUserId, initialMessages = [] }: MessagePageProps) {
    const [selectedId, setSelectedId] = useState<string | undefined>(undefined)
    const [mobileView, setMobileView] = useState<'list' | 'thread'>('list')

    // Find selected conversation
    const selectedConversation = conversations.find(c => c.contact.id === selectedId)

    // In a real app, we'd fetch messages for the selected thread here
    // For MVP, we'll just use initialMessages if it matches, or empty
    const messages = selectedId ? initialMessages : []

    const handleSelect = (id: string) => {
        setSelectedId(id)
        setMobileView('thread')
    }

    const handleBack = () => {
        setMobileView('list')
        setSelectedId(undefined)
    }

    return (
        <div className="flex h-[calc(100vh-4rem)] overflow-hidden bg-gray-50">
            {/* Sidebar List */}
            <div className={`
        w-full md:w-80 lg:w-96 bg-white border-r flex flex-col
        ${mobileView === 'thread' ? 'hidden md:flex' : 'flex'}
      `}>
                <MessageList
                    conversations={conversations}
                    selectedId={selectedId}
                    onSelect={handleSelect}
                    userId={currentUserId}
                />
            </div>

            {/* Main Thread View */}
            <div className={`
        flex-1 flex flex-col min-w-0 bg-white
        ${mobileView === 'list' ? 'hidden md:flex' : 'flex'}
      `}>
                {mobileView === 'thread' && (
                    <div className="md:hidden p-2 border-b flex items-center bg-white">
                        <Button variant="ghost" size="icon" onClick={handleBack}>
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <span className="font-semibold ml-2">Back to messages</span>
                    </div>
                )}

                {selectedId ? (
                    <MessageThread
                        contact={selectedConversation?.contact}
                        messages={messages}
                        currentUserId={currentUserId}
                    />
                ) : (
                    <div className="hidden md:flex flex-1 items-center justify-center text-gray-500 bg-gray-50">
                        <div className="text-center">
                            <h3 className="text-lg font-medium">Select a conversation</h3>
                            <p>Choose a teacher or school to start messaging</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
