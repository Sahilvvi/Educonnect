import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { SchoolAdminSidebar } from '@/components/dashboard/SchoolAdminSidebar'

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Fetch admin profile or metadata
    // Assuming basic auth metadata for now
    const userName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Admin'

    return (
        <div className="flex h-screen overflow-hidden bg-gray-50">
            <aside className="hidden w-64 shrink-0 md:block">
                <SchoolAdminSidebar userName={userName} />
            </aside>
            <main className="flex-1 overflow-y-auto w-full">
                {children}
            </main>
        </div>
    )
}
