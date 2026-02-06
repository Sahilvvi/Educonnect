import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { StudentNavbar } from '@/components/dashboard/StudentNavbar'
import { AttendanceCalendar } from '@/components/dashboard/AttendanceCalendar'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function StudentAttendancePage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const { data: student } = await supabase
        .from('students')
        .select('id, name')
        .eq('email', user.email)
        .single()

    if (!student) redirect('/student/dashboard')

    // Reuse logic from parent/student/[id]/attendance/page.tsx
    // Fetch last 6 months records
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

    const { data: attendanceData } = await supabase
        .from('attendance_records')
        .select('*')
        .eq('student_id', student.id)
        .gte('attendance_date', sixMonthsAgo.toISOString())
        .order('attendance_date', { ascending: false })

    const records = (attendanceData || []).map((record: any) => ({
        date: new Date(record.attendance_date),
        status: record.status,
        remarks: record.remarks
    }))

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <StudentNavbar studentName={student.name} />

            <div className="container mx-auto px-4 py-8">
                <div className="mb-6">
                    <Button variant="ghost" size="sm" asChild className="mb-2 pl-0">
                        <Link href="/student/dashboard">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Dashboard
                        </Link>
                    </Button>
                    <h1 className="text-3xl font-bold text-gray-900">Attendance Record</h1>
                    <p className="text-gray-600">Track your daily class attendance</p>
                </div>

                <div className="bg-white rounded-lg p-4 shadow mb-6">
                    <AttendanceCalendar records={records} />
                </div>
            </div>
        </div>
    )
}
