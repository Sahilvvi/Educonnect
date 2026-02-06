import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { StudentNavbar } from '@/components/dashboard/StudentNavbar'
import { HomeworkList } from '@/components/homework/HomeworkList'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function StudentHomeworkPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const { data: student } = await supabase
        .from('students')
        .select('id, name, class_id')
        .eq('email', user.email)
        .single()

    if (!student) redirect('/student/dashboard')

    // Reuse the HomeworkList component we used for parents!
    // But we need to fetch assignments compatible with that component's interface.

    // Logic from parent/student/[id]/homework/page.tsx:
    const { data: assignments } = await supabase
        .from('homework_assignments')
        .select('*, teacher_profiles(full_name)')
        .eq('class_id', student.class_id)
        .eq('is_published', true)
        .order('due_date', { ascending: true })

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <StudentNavbar studentName={student.name} />

            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="mb-6">
                    <Button variant="ghost" size="sm" asChild className="mb-2 pl-0">
                        <Link href="/student/dashboard">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Dashboard
                        </Link>
                    </Button>
                    <h1 className="text-3xl font-bold text-gray-900">My Homework</h1>
                    <p className="text-gray-600">Upcoming assignments and tasks</p>
                </div>

                <HomeworkList
                    assignments={assignments || []}
                    studentId={student.id}
                />
            </div>
        </div>
    )
}
