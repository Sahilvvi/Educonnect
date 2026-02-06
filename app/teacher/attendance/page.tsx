import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { TeacherNavbar } from '@/components/dashboard/TeacherNavbar'
import { AttendanceSheet } from '@/components/dashboard/AttendanceSheet'

export default async function TeacherAttendancePage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const { data: teacherProfile } = await supabase
        .from('teacher_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

    if (!teacherProfile) redirect('/login')

    // Fetch classes assigned to this teacher
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

    // Transform for client component
    const formattedClasses = classes?.map((c: any) => ({
        id: c.class_id,
        name: c.classes?.name,
        subject: c.subject,
        school_id: c.classes?.school_id
    })) || []

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <TeacherNavbar
                teacherName={teacherProfile.full_name}
                teacherEmail={user.email}
            />

            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Mark Attendance</h1>
                    <p className="text-gray-600">Select a class to record daily attendance</p>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <AttendanceSheet
                        classes={formattedClasses}
                        teacherId={teacherProfile.id}
                    />
                </div>
            </div>
        </div>
    )
}
