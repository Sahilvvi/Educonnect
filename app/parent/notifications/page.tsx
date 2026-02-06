import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ParentNavbar } from '@/components/dashboard/ParentNavbar'
import { NotificationCenter } from '@/components/dashboard/NotificationCenter'

export default async function NotificationsPage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const { data: parentProfile } = await supabase
        .from('parent_profiles')
        .select('full_name')
        .eq('user_id', user.id)
        .single()

    // Fetch real notifications
    const { data: notifications } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50)

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <ParentNavbar parentName={parentProfile?.full_name || 'Parent'} />

            <div className="container mx-auto px-4 py-8 max-w-3xl">
                <h1 className="text-3xl font-bold mb-6">Notifications</h1>
                <NotificationCenter notifications={notifications || []} />
            </div>
        </div>
    )
}
