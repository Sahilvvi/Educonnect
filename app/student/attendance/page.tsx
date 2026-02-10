'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, Calendar, UserCheck, UserX, Clock } from 'lucide-react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

export default function StudentAttendancePage() {
    const [attendanceRecords, setAttendanceRecords] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth().toString())
    const [stats, setStats] = useState({
        present: 0,
        absent: 0,
        late: 0,
        percentage: 0
    })

    const supabase = createClient()

    useEffect(() => {
        fetchAttendance()
    }, [selectedMonth])

    const fetchAttendance = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            const { data: student } = await supabase
                .from('students')
                .select('id, class_id')
                .eq('email', user.email)
                .single()

            if (!student) return

            // Get current month's attendance
            const year = new Date().getFullYear()
            const month = parseInt(selectedMonth)
            const startDate = new Date(year, month, 1)
            const endDate = new Date(year, month + 1, 0)

            const { data } = await supabase
                .from('attendance_records')
                .select('*')
                .eq('student_id', student.id)
                .gte('date', startDate.toISOString())
                .lte('date', endDate.toISOString())
                .order('date', { ascending: false })

            const records = data || []
            setAttendanceRecords(records)

            // Calculate stats
            const present = records.filter(r => r.status === 'present').length
            const absent = records.filter(r => r.status === 'absent').length
            const late = records.filter(r => r.status === 'late').length
            const total = records.length

            setStats({
                present,
                absent,
                late,
                percentage: total > 0 ? Math.round((present / total) * 100) : 0
            })
        } catch (error) {
            console.error('Error fetching attendance:', error)
        } finally {
            setLoading(false)
        }
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'present':
                return <Badge className="bg-green-100 text-green-800">Present</Badge>
            case 'absent':
                return <Badge className="bg-red-100 text-red-800">Absent</Badge>
            case 'late':
                return <Badge className="bg-orange-100 text-orange-800">Late</Badge>
            case 'excused':
                return <Badge className="bg-blue-100 text-blue-800">Excused</Badge>
            default:
                return <Badge variant="outline">{status}</Badge>
        }
    }

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ]

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">My Attendance</h1>
                    <p className="text-gray-500">Track your attendance record</p>
                </div>
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {months.map((month, index) => (
                            <SelectItem key={index} value={index.toString()}>
                                {month}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Present</p>
                                <p className="text-2xl font-bold text-green-600">{stats.present}</p>
                            </div>
                            <UserCheck className="h-8 w-8 text-green-600" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Absent</p>
                                <p className="text-2xl font-bold text-red-600">{stats.absent}</p>
                            </div>
                            <UserX className="h-8 w-8 text-red-600" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Late</p>
                                <p className="text-2xl font-bold text-orange-600">{stats.late}</p>
                            </div>
                            <Clock className="h-8 w-8 text-orange-600" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Percentage</p>
                                <p className="text-2xl font-bold text-blue-600">{stats.percentage}%</p>
                            </div>
                            <Calendar className="h-8 w-8 text-blue-600" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Attendance Records */}
            <Card>
                <CardHeader>
                    <CardTitle>Attendance History - {months[parseInt(selectedMonth)]}</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex items-center justify-center h-48">
                            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                        </div>
                    ) : attendanceRecords.length === 0 ? (
                        <div className="text-center text-gray-500 py-12">
                            No attendance records for this month
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {attendanceRecords.map((record) => (
                                <div
                                    key={record.id}
                                    className="flex items-center justify-between p-4 border rounded-lg"
                                >
                                    <div className="flex items-center gap-4">
                                        <Calendar className="h-5 w-5 text-gray-400" />
                                        <div>
                                            <p className="font-medium">
                                                {new Date(record.date).toLocaleDateString('en-US', {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </p>
                                            {record.notes && (
                                                <p className="text-sm text-muted-foreground">{record.notes}</p>
                                            )}
                                        </div>
                                    </div>
                                    {getStatusBadge(record.status)}
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
