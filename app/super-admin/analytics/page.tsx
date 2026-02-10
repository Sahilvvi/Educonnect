'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { TrendingUp, Users, School, GraduationCap, DollarSign, Activity, Loader2 } from 'lucide-react'
import {
    AreaChart,
    Area,
    BarChart,
    Bar,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts'

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']

export default function AnalyticsPage() {
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState({
        totalSchools: 0,
        totalStudents: 0,
        totalTeachers: 0,
        totalParents: 0,
        activeUsers: 0,
        totalRevenue: 0
    })
    const [growthData, setGrowthData] = useState<any[]>([])
    const [schoolDistribution, setSchoolDistribution] = useState<any[]>([])
    const [userActivityData, setUserActivityData] = useState<any[]>([])

    const supabase = createClient()

    useEffect(() => {
        fetchAnalytics()
    }, [])

    const fetchAnalytics = async () => {
        try {
            // Get overall stats
            const [schools, students, teachers, parents] = await Promise.all([
                supabase.from('schools').select('*', { count: 'exact', head: true }),
                supabase.from('students').select('*', { count: 'exact', head: true }),
                supabase.from('teacher_profiles').select('*', { count: 'exact', head: true }),
                supabase.from('parent_profiles').select('*', { count: 'exact', head: true })
            ])

            // Get schools with student counts for distribution
            const { data: schoolsData } = await supabase
                .from('schools')
                .select('id, name')

            if (schoolsData) {
                const distribution = await Promise.all(
                    schoolsData.map(async (school) => {
                        const { count } = await supabase
                            .from('students')
                            .select('*', { count: 'exact', head: true })
                            .eq('school_id', school.id)
                        return { name: school.name, students: count || 0 }
                    })
                )
                setSchoolDistribution(distribution.filter(d => d.students > 0).slice(0, 5))
            }

            // Calculate monthly growth (last 6 months)
            const monthlyData = []
            for (let i = 5; i >= 0; i--) {
                const date = new Date()
                date.setMonth(date.getMonth() - i)
                const monthStart = new Date(date.getFullYear(), date.getMonth(), 1).toISOString()
                const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59).toISOString()

                const [schoolsCount, studentsCount, teachersCount] = await Promise.all([
                    supabase.from('schools').select('*', { count: 'exact', head: true })
                        .lte('created_at', monthEnd),
                    supabase.from('students').select('*', { count: 'exact', head: true })
                        .lte('created_at', monthEnd),
                    supabase.from('teacher_profiles').select('*', { count: 'exact', head: true })
                        .lte('created_at', monthEnd)
                ])

                monthlyData.push({
                    month: date.toLocaleDateString('en-US', { month: 'short' }),
                    schools: schoolsCount.count || 0,
                    students: studentsCount.count || 0,
                    teachers: teachersCount.count || 0
                })
            }
            setGrowthData(monthlyData)

            // Mock user activity data (you can replace with real data from user_activity table)
            const activityData = [
                { day: 'Mon', logins: 45 },
                { day: 'Tue', logins: 52 },
                { day: 'Wed', logins: 49 },
                { day: 'Thu', logins: 63 },
                { day: 'Fri', logins: 58 },
                { day: 'Sat', logins: 28 },
                { day: 'Sun', logins: 22 }
            ]
            setUserActivityData(activityData)

            setStats({
                totalSchools: schools.count || 0,
                totalStudents: students.count || 0,
                totalTeachers: teachers.count || 0,
                totalParents: parents.count || 0,
                activeUsers: (teachers.count || 0) + (parents.count || 0),
                totalRevenue: (schools.count || 0) * 100 // Placeholder calculation
            })
        } catch (error) {
            console.error('Analytics fetch error:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Platform Analytics</h1>
            <p className="text-gray-600 mb-8">Comprehensive insights and performance metrics</p>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Schools</CardTitle>
                        <School className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalSchools}</div>
                        <p className="text-xs text-muted-foreground">Active tenants</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                        <GraduationCap className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalStudents.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Across all schools</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
                        <Users className="h-4 w-4 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalTeachers.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Teaching staff</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Parents</CardTitle>
                        <Users className="h-4 w-4 text-orange-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalParents.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Parent accounts</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                        <Activity className="h-4 w-4 text-indigo-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.activeUsers.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Teachers + Parents</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Est. Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Monthly recurring</p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Growth Trends */}
                <Card>
                    <CardHeader>
                        <CardTitle>Growth Trends</CardTitle>
                        <CardDescription>6-month growth across entities</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={growthData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Area type="monotone" dataKey="schools" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
                                <Area type="monotone" dataKey="teachers" stackId="2" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.6} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* User Activity */}
                <Card>
                    <CardHeader>
                        <CardTitle>User Activity</CardTitle>
                        <CardDescription>Weekly login activity</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={userActivityData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="day" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="logins" fill="#10B981" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* School Distribution */}
                <Card>
                    <CardHeader>
                        <CardTitle>Top Schools by Students</CardTitle>
                        <CardDescription>Student distribution across top 5 schools</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={schoolDistribution}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={(entry) => `${entry.name}: ${entry.students}`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="students"
                                >
                                    {schoolDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Student Growth */}
                <Card>
                    <CardHeader>
                        <CardTitle>Student Enrollment</CardTitle>
                        <CardDescription>Student growth over time</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={growthData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="students" stroke="#10B981" strokeWidth={2} dot={{ r: 4 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
