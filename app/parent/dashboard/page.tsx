import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ParentNavbar } from '@/components/dashboard/ParentNavbar'
import { ChildCard } from '@/components/dashboard/ChildCard'
import { NotificationCenter } from '@/components/dashboard/NotificationCenter'
import { AddChildButton } from '@/components/dashboard/AddChildButton'
import { Users, TrendingUp, Calendar, Bell } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function ParentDashboard() {
    const supabase = await createClient()

    // Check authentication
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Get parent profile
    const { data: parentProfile } = await supabase
        .from('parent_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

    // Get all children linked to this parent
    const { data: childrenData } = await supabase
        .from('parent_student_mapping')
        .select(`
      id,
      relationship,
      students (
        id,
        full_name,
        class_id,
        student_id,
        profile_photo_url,
        schools (
          id,
          name,
          logo_url,
          theme_color
        )
      )
    `)
        .eq('parent_id', parentProfile?.id || '')

    // Get notifications
    const { data: notifications } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10)

    // Transform children data for display
    const children = (childrenData || []).map((item: any) => ({
        id: item.students.id,
        full_name: item.students.full_name,
        student_id: item.students.student_id,
        school_name: item.students.schools?.name || 'Unknown School',
        school_logo_url: item.students.schools?.logo_url,
        school_theme_color: item.students.schools?.theme_color || '#3B82F6',
        class_name: 'Class 5A', // Placeholder - we'll add classes table later
        attendance_percentage: 85, // Placeholder
        pending_homework: 3, // Placeholder
        pending_fees: 0, // Placeholder
        relationship: item.relationship,
    }))

    const stats = {
        totalChildren: children.length,
        totalSchools: new Set(children.map((c: any) => c.school_name)).size,
        unreadNotifications: (notifications || []).filter((n: any) => !n.is_read).length,
        avgAttendance: children.length > 0
            ? Math.round(children.reduce((acc: number, c: any) => acc + (c.attendance_percentage || 0), 0) / children.length)
            : 0,
    }

    return (
        <>
            <ParentNavbar parentName={parentProfile?.full_name || 'Parent'} />

            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Welcome back, {parentProfile?.full_name?.split(' ')[0] || 'Parent'}! 👋
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Here&apos;s what&apos;s happening with your children today
                        </p>
                    </div>
                    <AddChildButton />
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">
                                Total Children
                            </CardTitle>
                            <Users className="h-4 w-4 text-gray-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{stats.totalChildren}</div>
                            <p className="text-xs text-gray-500 mt-1">
                                Across {stats.totalSchools} school{stats.totalSchools !== 1 ? 's' : ''}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">
                                Avg Attendance
                            </CardTitle>
                            <Calendar className="h-4 w-4 text-gray-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-green-600">
                                {stats.avgAttendance}%
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                {stats.avgAttendance >= 75 ? 'Above required 75%' : 'Below required 75%'}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">
                                Notifications
                            </CardTitle>
                            <Bell className="h-4 w-4 text-gray-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-blue-600">
                                {stats.unreadNotifications}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Unread messages</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">
                                Overall Status
                            </CardTitle>
                            <TrendingUp className="h-4 w-4 text-gray-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-green-600">Great</div>
                            <p className="text-xs text-gray-500 mt-1">All on track</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content Grid */}
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Children Cards */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-bold text-gray-900">My Children</h2>
                            {children.length > 0 && (
                                <span className="text-sm text-gray-500">
                                    {children.length} child{children.length !== 1 ? 'ren' : ''}
                                </span>
                            )}
                        </div>

                        {children.length === 0 ? (
                            <Card className="p-12 text-center">
                                <Users className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                                <h3 className="text-xl font-semibold mb-2">No children linked yet</h3>
                                <p className="text-gray-600 mb-6">
                                    Add your first child to start tracking their academic progress
                                </p>
                                <AddChildButton />
                            </Card>
                        ) : (
                            <div className="grid gap-6">
                                {children.map((child: any) => (
                                    <ChildCard key={child.id} student={child} />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Notifications */}
                    <div>
                        <NotificationCenter
                            notifications={notifications || []}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}
