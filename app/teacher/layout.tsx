import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { TeacherSidebar } from '@/components/dashboard/TeacherSidebar' // Updated import

export default async function TeacherLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const { data: profile } = await supabase
        .from('teacher_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50">
            {/* Sidebar */}
            <aside className="hidden w-72 shrink-0 md:block">
                <TeacherSidebar
                    teacherName={profile?.full_name || 'Teacher'}
                    teacherEmail={user.email}
                />
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                {children}
            </main>
        </div>
    )
}
