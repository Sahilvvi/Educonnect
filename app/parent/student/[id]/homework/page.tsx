import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ParentNavbar } from '@/components/dashboard/ParentNavbar'
import { HomeworkList } from '@/components/homework/HomeworkList'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface PageProps {
    params: {
        id: string
    }
}

export default async function StudentHomeworkPage({ params }: PageProps) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const { data: parentProfile } = await supabase
        .from('parent_profiles')
        .select('full_name')
        .eq('user_id', user.id)
        .single()

    const { data: student } = await supabase
        .from('students')
        .select('base:*, schools(name), classes(id, name)') // Rename wildcard to base to avoid conflict if needed, or structured access
        .select('*, schools(name), classes(id, name)')
        .eq('id', params.id)
        .single()

    if (!student) {
        return <div>Student not found</div>
    }

    // Fetch homework assignments for this student's class
    // Note: Since we might not have linked class_id in students table correctly in mock,
    // we'll try to fetch all homework for the school as fallback or mock it if empty

    let assignments = []

    if (student.class_id) {
        const { data } = await supabase
            .from('homework_assignments')
            .select('*, teacher_profiles(full_name)')
            .eq('class_id', student.class_id)
            .eq('is_published', true)
            .order('due_date', { ascending: true })

        assignments = data || []
    } else {
        // Fallback for MVP: fetch any homework for this student's school to show something
        // In real app, student.class_id MUST be set
        const { data } = await supabase
            .from('homework_assignments')
            .select('*, teacher_profiles(full_name)')
            .eq('school_id', student.school_id)
            .eq('is_published', true)
            .order('due_date', { ascending: true })

        assignments = data || []
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <ParentNavbar parentName={parentProfile?.full_name || 'Parent'} />

            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="mb-6">
                    <Button variant="ghost" size="sm" asChild className="mb-2 pl-0">
                        <Link href="/parent/dashboard">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Dashboard
                        </Link>
                    </Button>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Homework & Assignments
                    </h1>
                    <p className="text-gray-600">
                        for <span className="font-semibold text-blue-600">{student.full_name}</span>
                    </p>
                </div>

                <HomeworkList assignments={assignments} studentId={student.id} />
            </div>
        </div>
    )
}
