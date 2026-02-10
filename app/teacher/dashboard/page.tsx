import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { TeacherNavbar } from '@/components/dashboard/TeacherNavbar'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, CalendarCheck, BookOpen, Clock, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default async function TeacherDashboard() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    // Fetch teacher profile
    const { data: teacherProfile } = await supabase
        .from('teacher_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

    if (!teacherProfile) {
        // Handle edge case where profile doesn't exist yet
        return (
            <div className="p-8 text-center">
                <h1 className="text-2xl font-bold text-red-600">Profile Not Found</h1>
                <p>Please contact your school administrator.</p>
            </div>
        )
    }

    // Fetch assigned classes (teacher_class_mapping)
    const { data: classes } = await supabase
        .from('teacher_class_mapping')
        .select(`
            class_id,
            is_class_teacher,
            subject,
            classes (
                id,
                name,
                grade_level
            )
        `)
        .eq('teacher_id', teacherProfile.id)

    // Simplified stats for MVP
    const totalClasses = classes?.length || 0
    const teacherClassMapping = classes?.find((c: any) => c.is_class_teacher)
    const classObj = teacherClassMapping?.classes as any
    const classTeacherOf = Array.isArray(classObj) ? classObj[0]?.name : classObj?.name

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <div className="container mx-auto px-6 py-8">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Welcome back, {teacherProfile.full_name}
                    </h1>
                    <p className="text-gray-600 mt-2">
                        {classTeacherOf
                            ? `Class Teacher of ${classTeacherOf}`
                            : 'Here is your daily overview'}
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                My Classes
                            </CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalClasses}</div>
                            <p className="text-xs text-muted-foreground">
                                Assigned subjects/sections
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Attendance
                            </CardTitle>
                            <CalendarCheck className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">Today</div>
                            <p className="text-xs text-muted-foreground">
                                Mark for your class
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Pending Tasks
                            </CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">3</div>
                            <p className="text-xs text-muted-foreground">
                                Homework reviews
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions & Classes */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content - Assigned Classes */}
                    <div className="lg:col-span-2 space-y-6">
                        <h2 className="text-xl font-bold text-gray-900">My Classes & Subjects</h2>

                        {classes?.length === 0 ? (
                            <Card className="bg-gray-50 border-dashed">
                                <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                                        <BookOpen className="h-6 w-6 text-gray-400" />
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900">No Classes Assigned</h3>
                                    <p className="text-sm text-gray-500 max-w-sm mt-1">
                                        You haven't been assigned to any classes yet. Please contact the school administrator.
                                    </p>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid gap-4">
                                {classes?.map((item: any) => {
                                    const cls = Array.isArray(item.classes) ? item.classes[0] : item.classes
                                    return (
                                        <Card key={item.class_id} className="hover:shadow-md transition-shadow">
                                            <CardHeader className="pb-3">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <CardTitle className="text-lg">
                                                            {cls?.name}
                                                        </CardTitle>
                                                        <CardDescription>
                                                            {item.subject} {item.is_class_teacher && '• Class Teacher'}
                                                        </CardDescription>
                                                    </div>
                                                    <Button variant="outline" size="sm" asChild>
                                                        <Link href={`/teacher/classes/${item.class_id}`}>
                                                            View Details <ArrowRight className="ml-2 h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                </div>
                                            </CardHeader>
                                        </Card>
                                    )
                                })}
                            </div>
                        )}
                    </div>

                    {/* Sidebar - Quick Actions */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
                        <div className="grid gap-4">
                            <Button className="w-full justify-start" size="lg" asChild>
                                <Link href="/teacher/attendance">
                                    <CalendarCheck className="mr-2 h-5 w-5" />
                                    Mark Attendance
                                </Link>
                            </Button>
                            <Button variant="outline" className="w-full justify-start" size="lg" asChild>
                                <Link href="/teacher/homework/create">
                                    <BookOpen className="mr-2 h-5 w-5" />
                                    Create Assignment
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
