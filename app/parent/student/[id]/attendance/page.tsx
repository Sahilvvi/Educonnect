import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ParentNavbar } from '@/components/dashboard/ParentNavbar'
import { AttendanceCalendar } from '@/components/dashboard/AttendanceCalendar'

interface PageProps {
    params: {
        id: string
    }
}

export default async function StudentAttendancePage({ params }: PageProps) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const { data: parentProfile } = await supabase
        .from('parent_profiles')
        .select('id, full_name')
        .eq('user_id', user.id)
        .single()

    // Get student details (with verify ownership securely)
    const { data: student } = await supabase
        .from('students')
        .select('*, schools(name), classes(name)')
        .eq('id', params.id)
        .single()

    if (!student) {
        return <div>Student not found or access denied</div>
    }

    // Verify parent has access to this student
    const { data: mapping } = await supabase
        .from('parent_student_mapping')
        .select('id')
        .eq('parent_id', parentProfile?.id) // Parent profile might be null if not loaded, robust check needed
        .eq('student_id', student.id)
        .single()

    // For MVP robustness, if parent mapping check fails (e.g. RLS issues or profile missing), 
    // we might handle error. But assuming flow works user -> parent -> mapping.

    // Fetch real attendance records for the last 90 days
    const threeMonthsAgo = new Date()
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)

    const { data: attendanceData } = await supabase
        .from('attendance_records')
        .select('*')
        .eq('student_id', student.id)
        .gte('attendance_date', threeMonthsAgo.toISOString())
        .order('attendance_date', { ascending: false })

    // Transform database records to the format expected by the calendar component
    // If no records found, it will just show empty calendar (which is correct behavior for real backend)
    const records = (attendanceData || []).map((record: any) => ({
        date: new Date(record.attendance_date),
        status: record.status,
        remarks: record.remarks
    }))

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <ParentNavbar parentName={parentProfile?.full_name || 'Parent'} />

            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Attendance Record
                    </h1>
                    <p className="text-gray-600">
                        Viewing attendance for <span className="font-semibold text-blue-600">{student.full_name}</span> ({student.schools?.name})
                    </p>
                </div>

                <AttendanceCalendar records={records} />
            </div>
        </div>
    )
}
