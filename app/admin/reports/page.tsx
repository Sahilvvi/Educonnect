'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Loader2, Download, FileText, TrendingUp, Users, BookOpen } from 'lucide-react'
import {
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

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444']

export default function ReportsPage() {
    const [loading, setLoading] = useState(true)
    const [reportType, setReportType] = useState('attendance')
    const [attendanceData, setAttendanceData] = useState<any[]>([])
    const [gradeDistribution, setGradeDistribution] = useState<any[]>([])

    const supabase = createClient()

    useEffect(() => {
        fetchReportData()
    }, [reportType])

    const fetchReportData = async () => {
        setLoading(true)
        try {
            // Mock data for demonstration
            const mockAttendance = [
                { month: 'Jan', percentage: 92 },
                { month: 'Feb', percentage: 88 },
                { month: 'Mar', percentage: 95 },
                { month: 'Apr', percentage: 90 },
                { month: 'May', percentage: 93 },
                { month: 'Jun', percentage: 91 }
            ]

            const mockGrades = [
                { grade: 'A', students: 45 },
                { grade: 'B', students: 78 },
                { grade: 'C', students: 52 },
                { grade: 'D', students: 15 }
            ]

            setAttendanceData(mockAttendance)
            setGradeDistribution(mockGrades)
        } catch (error) {
            console.error('Error fetching reports:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
                    <p className="text-gray-500">Generate and view school performance reports</p>
                </div>
                <Button className="bg-blue-600">
                    <Download className="mr-2 h-4 w-4" /> Export Report
                </Button>
            </div>

            {/* Report Type Selector */}
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Select Report Type
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Select value={reportType} onValueChange={setReportType}>
                        <SelectTrigger className="w-full md:w-[300px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="attendance">Attendance Report</SelectItem>
                            <SelectItem value="academic">Academic Performance</SelectItem>
                            <SelectItem value="financial">Financial Report</SelectItem>
                            <SelectItem value="teacher">Teacher Performance</SelectItem>
                        </SelectContent>
                    </Select>
                </CardContent>
            </Card>

            {/* Charts Grid */}
            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Attendance Trend */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Attendance Trend</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={attendanceData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="percentage" stroke="#3B82F6" strokeWidth={2} />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Grade Distribution */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Grade Distribution</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={gradeDistribution}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={(entry) => `${entry.grade}: ${entry.students}`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="students"
                                    >
                                        {gradeDistribution.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Summary Stats */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle>Summary Statistics</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="p-4 bg-blue-50 rounded-lg">
                                    <div className="flex items-center gap-2 mb-2">
                                        <TrendingUp className="h-4 w-4 text-blue-600" />
                                        <p className="text-sm font-medium text-blue-900">Avg Attendance</p>
                                    </div>
                                    <p className="text-2xl font-bold text-blue-900">91.5%</p>
                                </div>
                                <div className="p-4 bg-green-50 rounded-lg">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Users className="h-4 w-4 text-green-600" />
                                        <p className="text-sm font-medium text-green-900">Total Students</p>
                                    </div>
                                    <p className="text-2xl font-bold text-green-900">190</p>
                                </div>
                                <div className="p-4 bg-orange-50 rounded-lg">
                                    <div className="flex items-center gap-2 mb-2">
                                        <BookOpen className="h-4 w-4 text-orange-600" />
                                        <p className="text-sm font-medium text-orange-900">Pass Rate</p>
                                    </div>
                                    <p className="text-2xl font-bold text-orange-900">92%</p>
                                </div>
                                <div className="p-4 bg-purple-50 rounded-lg">
                                    <div className="flex items-center gap-2 mb-2">
                                        <TrendingUp className="h-4 w-4 text-purple-600" />
                                        <p className="text-sm font-medium text-purple-900">Avg Grade</p>
                                    </div>
                                    <p className="text-2xl font-bold text-purple-900">B+</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    )
}
