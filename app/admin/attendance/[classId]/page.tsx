'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { ArrowLeft, Save, Loader2, CheckCircle2 } from 'lucide-react'

export default function MarkAttendancePage({ params }: { params: { classId: string } }) {
    const [students, setStudents] = useState<any[]>([])
    const [classInfo, setClassInfo] = useState<any>(null)
    const [attendanceData, setAttendanceData] = useState<Record<string, string>>({})
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            // Fetch Class Info
            const { data: cls } = await supabase
                .from('classes')
                .select('*')
                .eq('id', params.classId)
                .single()
            setClassInfo(cls)

            // Fetch Students
            const { data: stds } = await supabase
                .from('students')
                .select('*')
                .eq('class_id', params.classId)
                .order('full_name')

            setStudents(stds || [])

            // Initialize all as 'present'
            const initialData: Record<string, string> = {}
            stds?.forEach(s => {
                initialData[s.id] = 'present'
            })
            setAttendanceData(initialData)

        } catch (error) {
            console.error('Error fetching data:', error)
            toast.error('Failed to load class data')
        } finally {
            setLoading(false)
        }
    }

    const handleStatusChange = (studentId: string, status: string) => {
        setAttendanceData(prev => ({ ...prev, [studentId]: status }))
    }

    const handleSubmit = async () => {
        setSaving(true)
        try {
            const { data: { user } } = await supabase.auth.getUser()

            // Prepare insert payload
            const inserts = students.map(s => ({
                student_id: s.id,
                class_id: params.classId,
                date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
                status: attendanceData[s.id],
                recorded_by: user?.id
            }))

            const { error } = await supabase
                .from('attendance')
                .insert(inserts)

            if (error) throw error

            toast.success('Attendance submitted successfully!')
            setTimeout(() => router.push('/admin/attendance'), 1000)
        } catch (error) {
            console.error('Error saving attendance:', error)
            toast.error('Failed to save attendance')
        } finally {
            setSaving(false)
        }
    }

    if (loading) return <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-indigo-600" /></div>

    return (
        <div className="container mx-auto p-8 max-w-4xl">
            <Button variant="ghost" onClick={() => router.back()} className="mb-6">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
            </Button>

            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Mark Attendance</h1>
                    <p className="text-gray-500">
                        {classInfo?.name} • {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>
                <Button onClick={handleSubmit} disabled={saving} className="bg-indigo-600 hover:bg-indigo-700">
                    {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Save Attendance
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Student List ({students.length})</CardTitle>
                    <CardDescription>Default status is set to Present.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {students.length === 0 ? (
                        <p className="text-center text-gray-500 py-8">No students found in this class.</p>
                    ) : (
                        students.map((student) => (
                            <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <Avatar>
                                        <AvatarImage src={student.profile_photo_url} />
                                        <AvatarFallback>{student.full_name?.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-medium text-gray-900">{student.full_name}</p>
                                        <p className="text-xs text-gray-500">{student.student_id}</p>
                                    </div>
                                </div>

                                <RadioGroup
                                    value={attendanceData[student.id]}
                                    onValueChange={(val) => handleStatusChange(student.id, val)}
                                    className="flex items-center gap-4"
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="present" id={`p-${student.id}`} className="text-green-600 border-green-600" />
                                        <Label htmlFor={`p-${student.id}`} className="text-green-700 cursor-pointer">Present</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="absent" id={`a-${student.id}`} className="text-red-600 border-red-600" />
                                        <Label htmlFor={`a-${student.id}`} className="text-red-700 cursor-pointer">Absent</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="late" id={`l-${student.id}`} className="text-yellow-600 border-yellow-600" />
                                        <Label htmlFor={`l-${student.id}`} className="text-yellow-700 cursor-pointer">Late</Label>
                                    </div>
                                </RadioGroup>
                            </div>
                        ))
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
