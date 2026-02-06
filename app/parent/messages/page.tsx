import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import MessagesClient from '@/components/communication/MessagesClient'
import { ParentNavbar } from '@/components/dashboard/ParentNavbar'

export default async function MessagesPage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    // Fetch parent profile to pass name to navbar
    const { data: parentProfile } = await supabase
        .from('parent_profiles')
        .select('full_name')
        .eq('user_id', user.id)
        .single()

    // Fetch real conversations
    // Join messages with sender info. This is a simplified version for MVP
    // Ideally requires a distinct query for conversations
    const { data: messages } = await supabase
        .from('messages')
        .select(`
            *,
            sender:sender_id(
                email
            )
        `)
        .or(`recipient_id.eq.${user.id},sender_id.eq.${user.id}`)
        .order('created_at', { ascending: false })

    // Group messages into conversations manually (MVP approach)
    // In a production app, we would have a 'conversations' table
    const conversationsMap = new Map()

    messages?.forEach((msg: any) => {
        const otherUserId = msg.sender_id === user.id ? msg.recipient_id : msg.sender_id
        if (!conversationsMap.has(otherUserId)) {
            conversationsMap.set(otherUserId, {
                id: otherUserId,
                contact: {
                    id: otherUserId,
                    name: 'Teacher', // Helper to fetch name separately if needed
                    role: 'Teacher',
                    school_name: 'School',
                },
                lastMessage: msg
            })
        }
    })

    const realConversations = Array.from(conversationsMap.values())

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <ParentNavbar parentName={parentProfile?.full_name || 'Parent'} />
            <MessagesClient
                conversations={realConversations}
                currentUserId={user.id}
                initialMessages={messages || []}
            />
        </div>
    )
}
