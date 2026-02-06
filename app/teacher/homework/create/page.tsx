import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { TeacherNavbar } from '@/components/dashboard/TeacherNavbar'
import { CreateHomeworkForm } from '@/components/dashboard/CreateHomeworkForm'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default async function CreateHomeworkPage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const { data: teacherProfile } = await supabase
        .from('teacher_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

    if (!teacherProfile) redirect('/login')

    // Fetch classes for dropdown
    const { data: classes } = await supabase
        .from('teacher_class_mapping')
        .select(`
            class_id,
            subject,
            classes (
                id,
                name,
                school_id
            )
        `)
        .eq('teacher_id', teacherProfile.id)

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <TeacherNavbar
                teacherName={teacherProfile.full_name}
                teacherEmail={user.email}
            />

            <div className="container mx-auto px-4 py-8">
                <div className="mb-6">
                    <Button variant="ghost" size="sm" asChild className="mb-2 pl-0">
                        <Link href="/teacher/homework">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to List
                        </Link>
                    </Button>
                    <h1 className="text-3xl font-bold text-gray-900">Create New Assignment</h1>
                    <p className="text-gray-600">Assign homework to your students</p>
                </div>

                <CreateHomeworkForm
                    teacherProfile={teacherProfile}
                    classes={classes || []}
                />
            </div>
        </div>
    )
}
