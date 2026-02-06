'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function sendMessage(formData: FormData) {
    const supabase = await createClient()
    const recipientId = formData.get('recipientId') as string
    const content = formData.get('content') as string
    const subject = formData.get('subject') as string
    const schoolId = formData.get('schoolId') as string

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    const { error } = await supabase.from('messages').insert({
        sender_id: user.id,
        recipient_id: recipientId,
        school_id: schoolId,
        subject: subject,
        body: content,
        is_read: false
    })

    if (error) {
        console.error('Error sending message:', error)
        throw new Error('Failed to send message')
    }

    revalidatePath('/parent/messages')
    return { success: true }
}

export async function markAsRead(messageId: string) {
    const supabase = await createClient()

    // Verify ownership or recipient
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase.from('messages')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('id', messageId)
        .eq('recipient_id', user.id)

    revalidatePath('/parent/messages')
}
