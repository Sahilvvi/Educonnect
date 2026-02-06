'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Check, X, Clock, HelpCircle } from 'lucide-react'
import { format } from 'date-fns'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

interface ClassOption {
    id: string
    name: string
    subject: string
    school_id: string
}

interface Student {
    id: string
    name: string
    roll_number: string
}

interface AttendanceState {
    [studentId: string]: {
        status: 'present' | 'absent' | 'late' | 'excused'
        remarks: string
        id?: string // existing record id
    }
}

export function AttendanceSheet({ classes, teacherId }: { classes: ClassOption[], teacherId: string }) {
    const [selectedClassId, setSelectedClassId] = useState<string>('')
    const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0])
    const [students, setStudents] = useState<Student[]>([])
    const [attendance, setAttendance] = useState<AttendanceState>({})
    const [isLoading, setIsLoading] = useState(false)
    const [isSaving, setIsSaving] = useState(false)

    const supabase = createClient()

    // Load students when class changes
    useEffect(() => {
        if (!selectedClassId) return

        async function fetchStudentsAndAttendance() {
            setIsLoading(true)
            try {
                // 1. Fetch Students
                const { data: studentsData, error: studentError } = await supabase
                    .from('students')
                    .select('id, name, roll_number')
                    .eq('class_id', selectedClassId)
                    .order('roll_number', { ascending: true })

                if (studentError) throw studentError
                setStudents(studentsData || [])

                // 2. Fetch existing attendance for this date
                const { data: existingRecords, error: attendanceError } = await supabase
                    .from('attendance_records')
                    .select('*')
                    .eq('class_id', selectedClassId)
                    .eq('attendance_date', date)

                if (attendanceError) throw attendanceError

                // 3. Initialize state
                const newAttendance: AttendanceState = {}

                // Default to 'present' for all students if no record exists
                studentsData?.forEach(student => {
                    const record = existingRecords?.find(r => r.student_id === student.id)
                    if (record) {
                        newAttendance[student.id] = {
                            status: record.status,
                            remarks: record.remarks || '',
                            id: record.id
                        }
                    } else {
                        newAttendance[student.id] = {
                            status: 'present',
                            remarks: ''
                        }
                    }
                })

                setAttendance(newAttendance)

            } catch (error) {
                console.error('Error fetching data:', error)
                toast.error('Failed to load class data')
            } finally {
                setIsLoading(false)
            }
        }

        fetchStudentsAndAttendance()
    }, [selectedClassId, date, supabase])

    const handleStatusChange = (studentId: string, status: 'present' | 'absent' | 'late' | 'excused') => {
        setAttendance(prev => ({
            ...prev,
            [studentId]: { ...prev[studentId], status }
        }))
    }

    const handleRemarkChange = (studentId: string, remarks: string) => {
        setAttendance(prev => ({
            ...prev,
            [studentId]: { ...prev[studentId], remarks }
        }))
    }

    const saveAttendance = async () => {
        setIsSaving(true)
        try {
            const updates = students.map(student => {
                const record = attendance[student.id]
                return {
                    id: record.id, // Include ID for upsert content match if mapped correctly, or rely on composite key
                    student_id: student.id,
                    class_id: selectedClassId,
                    attendance_date: date,
                    status: record.status,
                    remarks: record.remarks,
                    recorded_by: teacherId
                }
            })

            // Using upsert based on (student_id, attendance_date) constraint
            // Ensure you have a unique constraint on these columns in DB
            const { error } = await supabase
                .from('attendance_records')
                .upsert(updates, { onConflict: 'student_id, attendance_date' })

            if (error) throw error

            toast.success('Attendance saved successfully')

            // Refresh logic if needed (e.g. to get new IDs)
        } catch (error: any) {
            console.error('Error saving attendance:', error)
            toast.error('Failed to save attendance: ' + error.message)
        } finally {
            setIsSaving(false)
        }
    }

    // Bulk mark actions
    const markAll = (status: 'present' | 'absent') => {
        const newAttendance = { ...attendance }
        students.forEach(s => {
            if (newAttendance[s.id]) {
                newAttendance[s.id].status = status
            }
        })
        setAttendance(newAttendance)
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4 items-end md:items-center justify-between">
                <div className="flex gap-4 w-full md:w-auto">
                    <div className="w-full md:w-[200px]">
                        <label className="text-sm font-medium mb-1 block">Select Class</label>
                        <Select value={selectedClassId} onValueChange={setSelectedClassId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Choose a class" />
                            </SelectTrigger>
                            <SelectContent>
                                {classes.map(c => (
                                    <SelectItem key={c.id} value={c.id}>
                                        {c.name} ({c.subject})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="w-full md:w-[200px]">
                        <label className="text-sm font-medium mb-1 block">Date</label>
                        <Input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div>
                </div>

                {selectedClassId && (
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => markAll('present')}>
                            Mark All Present
                        </Button>
                        <Button onClick={saveAttendance} disabled={isSaving || students.length === 0}>
                            {isSaving ? 'Saving...' : 'Save Attendance'}
                        </Button>
                    </div>
                )}
            </div>

            {!selectedClassId ? (
                <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg border border-dashed">
                    Please select a class to view student list
                </div>
            ) : isLoading ? (
                <div className="text-center py-12">Loading students...</div>
            ) : students.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                    No students found in this class
                </div>
            ) : (
                <div className="border rounded-md">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">Roll No</TableHead>
                                <TableHead>Student Name</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Remarks</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {students.map((student) => {
                                const status = attendance[student.id]?.status || 'present'
                                return (
                                    <TableRow key={student.id}>
                                        <TableCell className="font-medium">{student.roll_number}</TableCell>
                                        <TableCell>{student.name}</TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                <Button
                                                    size="sm"
                                                    variant={status === 'present' ? 'default' : 'outline'}
                                                    className={status === 'present' ? 'bg-green-600 hover:bg-green-700' : ''}
                                                    onClick={() => handleStatusChange(student.id, 'present')}
                                                >
                                                    P
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant={status === 'absent' ? 'default' : 'outline'}
                                                    className={status === 'absent' ? 'bg-red-600 hover:bg-red-700' : ''}
                                                    onClick={() => handleStatusChange(student.id, 'absent')}
                                                >
                                                    A
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant={status === 'late' ? 'default' : 'outline'}
                                                    className={status === 'late' ? 'bg-orange-500 hover:bg-orange-600' : ''}
                                                    onClick={() => handleStatusChange(student.id, 'late')}
                                                >
                                                    L
                                                </Button>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Input
                                                placeholder="Optional remarks"
                                                value={attendance[student.id]?.remarks || ''}
                                                onChange={(e) => handleRemarkChange(student.id, e.target.value)}
                                                className="max-w-[200px]"
                                            />
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    )
}
