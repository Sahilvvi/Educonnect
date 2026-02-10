'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Loader2, Save, ArrowLeft, UserCheck, UserX, Clock } from 'lucide-react'
import { toast } from 'sonner'

export default function MarkAttendancePage() {
    const params = useParams()
    const router = useRouter()
    const classId = params?.classId as string

    const [loading, setLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [students, setStudents] = useState<any[]>([])
    const [attendance, setAttendance] = useState<Record<string, { status: string; notes: string }>>({})
    const [classInfo, setClassInfo] = useState<any>(null)
    const [date, setDate] = useState(new Date().toISOString().split('T')[0])

    const supabase = createClient()

    useEffect(() => {
        if (classId) {
            fetchStudents()
        }
    }, [classId, date])

    const fetchStudents = async () => {
        try {
            // Fetch class info
            const { data: classData } = await supabase
                .from('classes')
                .select('*')
                .eq('id', classId)
                .single()

            setClassInfo(classData)

            // Fetch students in this class
            const { data: studentsData } = await supabase
                .from('students')
                .select('*')
                .eq('class_id', classId)
                .order('roll_number')

            // Check if attendance already exists for this date
            const { data: existingAttendance } = await supabase
                .from('attendance_records')
                .select('*')
                .eq('class_id', classId)
                .gte('date', `${date}T00:00:00`)
                .lte('date', `${date}T23:59:59`)

            // Initialize attendance state
            const attendanceMap: Record<string, { status: string; notes: string }> = {}
            studentsData?.forEach((student) => {
                const existing = existingAttendance?.find((a) => a.student_id === student.id)
                attendanceMap[student.id] = {
                    status: existing?.status || 'present',
                    notes: existing?.notes || ''
                }
            })

            setStudents(studentsData || [])
            setAttendance(attendanceMap)
        } catch (error) {
            console.error('Error fetching students:', error)
            toast.error('Failed to load students')
        } finally {
            setLoading(false)
        }
    }

    const handleStatusChange = (studentId: string, status: string) => {
        setAttendance((prev) => ({
            ...prev,
            [studentId]: { ...prev[studentId], status }
        }))
    }

    const handleSaveAttendance = async () => {
        setIsSaving(true)

        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            // Delete existing attendance for this date
            await supabase
                .from('attendance_records')
                .delete()
                .eq('class_id', classId)
                .gte('date', `${date}T00:00:00`)
                .lte('date', `${date}T23:59:59`)

            // Insert new attendance records
            const records = Object.entries(attendance).map(([studentId, data]) => ({
                student_id: studentId,
                class_id: classId,
                date: `${date}T${new Date().toTimeString().split(' ')[0]}`,
                status: data.status,
                marked_by: user.id,
                notes: data.notes || null
            }))

            const { error } = await supabase
                .from('attendance_records')
                .insert(records)

            if (error) throw error

            toast.success('Attendance saved successfully')
            router.push('/teacher/attendance')
        } catch (error: any) {
            toast.error(error.message || 'Failed to save attendance')
        } finally {
            setIsSaving(false)
        }
    }

    const stats = {
        present: Object.values(attendance).filter((a) => a.status === 'present').length,
        absent: Object.values(attendance).filter((a) => a.status === 'absent').length,
        late: Object.values(attendance).filter((a) => a.status === 'late').length,
        total: students.length
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
            <Button
                variant="ghost"
                onClick={() => router.push('/teacher/attendance')}
                className="mb-6"
            >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Attendance
            </Button>

            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Mark Attendance</h1>
                <p className="text-gray-500">{classInfo?.name} - {new Date(date).toLocaleDateString()}</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Total</p>
                                <p className="text-2xl font-bold">{stats.total}</p>
                            </div>
                            <UserCheck className="h-8 w-8 text-blue-600" />
                        </div>
                    </CardContent>
                </Card>
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
            </div>

            {/* Attendance Form */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Student List</CardTitle>
                        <Input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-auto"
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {students.map((student) => (
                            <div
                                key={student.id}
                                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                            >
                                <div className="flex-1">
                                    <p className="font-medium">{student.full_name}</p>
                                    <p className="text-sm text-muted-foreground">
                                        Roll No: {student.roll_number} | ID: {student.student_id}
                                    </p>
                                </div>
                                <Select
                                    value={attendance[student.id]?.status || 'present'}
                                    onValueChange={(value) => handleStatusChange(student.id, value)}
                                >
                                    <SelectTrigger className="w-[140px]">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="present">Present</SelectItem>
                                        <SelectItem value="absent">Absent</SelectItem>
                                        <SelectItem value="late">Late</SelectItem>
                                        <SelectItem value="excused">Excused</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Save Button */}
            <div className="mt-8 flex justify-end gap-4">
                <Button
                    variant="outline"
                    onClick={() => router.push('/teacher/attendance')}
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleSaveAttendance}
                    disabled={isSaving}
                    className="bg-blue-600"
                >
                    {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Save Attendance
                </Button>
            </div>
        </div>
    )
}
