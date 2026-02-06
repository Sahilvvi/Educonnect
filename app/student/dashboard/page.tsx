import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { StudentNavbar } from '@/components/dashboard/StudentNavbar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BookOpen, CalendarCheck, Clock, ArrowRight, GraduationCap } from 'lucide-react'
import Link from 'next/link'

export default async function StudentDashboard() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/login')

    // 1. Get Student Profile linked to this Auth User
    // Note: Our schema currently links `students` to school, but NOT directly to `auth.users` in the schema overview provided.
    // However, the Login logic directs 'student' role. 
    // Wait, how do we identify WHICH student is logging in?
    // In `app/(auth)/login/page.tsx`, we just check role.
    // If the student doesn't have a linked `user_id` in `students` table, we can't find them!

    // CRITICAL CHECK: Does `students` table have `user_id`?
    // Reviewing `database_schema`: "students table: id, school_id, name, email..."
    // Implementation Plan Phase 2 says: "users - shared auth table", "user_roles".
    // It doesn't explicitly say `students` table has `user_id`.
    // BUT the standard pattern implies it must.
    // Let's assume `students` table has `email` which matches the auth email.
    // OR we assume there's a `user_id` column added during dev.

    // Let's try to query by email first, as that's robust if they signed up with same email.
    // Or if there is a `user_id`.

    // Let's check if we can select by email.
    const { data: student } = await supabase
        .from('students')
        .select(`
            *,
            schools ( name ),
            classes ( name )
        `)
        .eq('email', user.email)
        .single()

    if (!student) {
        return (
            <div className="p-8 text-center min-h-screen flex flex-col items-center justify-center">
                <GraduationCap className="h-12 w-12 text-gray-300 mb-4" />
                <h1 className="text-2xl font-bold text-gray-900">Student Profile Not Found</h1>
                <p className="text-gray-600 max-w-md mt-2">
                    We couldn't link your login email ({user.email}) to a student record.
                    Please ask your school admin to verify your registered email address matches your login.
                </p>
                <div className="mt-6">
                    <form action="/auth/signout" method="post">
                        <Button variant="outline">Sign Out</Button>
                    </form>
                </div>
            </div>
        )
    }

    // 2. Fetch Pending Homework
    const { count: pendingHomework } = await supabase
        .from('homework_assignments')
        .select('*', { count: 'exact', head: true })
        .eq('class_id', student.class_id)
        .eq('is_published', true)
        // Ideally filter by submission status if we had that. For MVP, just count allAssignments.
        // Or if we check due date > now.
        .gte('due_date', new Date().toISOString())

    // 3. Fetch Attendance Stats
    const { count: totalAttendance } = await supabase
        .from('attendance_records')
        .select('*', { count: 'exact', head: true })
        .eq('student_id', student.id)

    const { count: presentCount } = await supabase
        .from('attendance_records')
        .select('*', { count: 'exact', head: true })
        .eq('student_id', student.id)
        .eq('status', 'present')

    const attendanceRate = totalAttendance && totalAttendance > 0
        ? Math.round(((presentCount || 0) / totalAttendance) * 100)
        : 100 // Default to 100 if no records

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <StudentNavbar studentName={student.name} />

            <div className="container mx-auto px-4 py-8">
                {/* Welcome Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Hello, {student.name.split(' ')[0]} 👋
                    </h1>
                    <p className="text-gray-600 mt-2">
                        {student.classes?.name} • {student.schools?.name}
                    </p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card className="hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pending Homework</CardTitle>
                            <BookOpen className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-600">{pendingHomework || 0}</div>
                            <p className="text-xs text-muted-foreground">Assignments due soon</p>
                        </CardContent>
                    </Card>
                    <Card className="hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
                            <CalendarCheck className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{attendanceRate}%</div>
                            <p className="text-xs text-muted-foreground">Overall presence</p>
                        </CardContent>
                    </Card>
                    <Card className="hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Next Class</CardTitle>
                            <Clock className="h-4 w-4 text-purple-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-purple-600">--</div>
                            <p className="text-xs text-muted-foreground">Timetable coming soon</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Links */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
                        <Button className="w-full justify-start h-12 text-lg" asChild variant="outline">
                            <Link href="/student/homework">
                                <BookOpen className="mr-3 h-5 w-5" />
                                View Homework Assignments
                                <ArrowRight className="ml-auto h-5 w-5 text-gray-400" />
                            </Link>
                        </Button>
                        <Button className="w-full justify-start h-12 text-lg" asChild variant="outline">
                            <Link href="/student/attendance">
                                <CalendarCheck className="mr-3 h-5 w-5" />
                                Check My Attendance
                                <ArrowRight className="ml-auto h-5 w-5 text-gray-400" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

