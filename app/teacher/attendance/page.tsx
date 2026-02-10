'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, ClipboardList, Plus } from 'lucide-react'

export default function TeacherAttendancePage() {
    const [classes, setClasses] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        fetchClasses()
    }, [])

    const fetchClasses = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            const { data: teacherProfile } = await supabase
                .from('teacher_profiles')
                .select('id')
                .eq('user_id', user.id)
                .single()

            if (teacherProfile) {
                const { data } = await supabase
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

                setClasses(data || [])
            }
        } catch (error) {
            console.error('Error fetching classes:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleMarkAttendance = (classId: string) => {
        router.push(`/teacher/attendance/${classId}`)
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
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Attendance Management</h1>
                <p className="text-gray-500">Mark attendance for your classes</p>
            </div>

            {classes.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center h-64 text-gray-500">
                        <ClipboardList className="h-12 w-12 mb-4 text-gray-400" />
                        <p>No classes assigned yet</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {classes.map((classItem) => (
                        <Card key={classItem.class_id} className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <CardTitle>{classItem.classes?.name}</CardTitle>
                                <p className="text-sm text-muted-foreground">
                                    Grade {classItem.classes?.grade_level} • {classItem.subject}
                                </p>
                            </CardHeader>
                            <CardContent>
                                <Button
                                    onClick={() => handleMarkAttendance(classItem.class_id)}
                                    className="w-full bg-blue-600"
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Mark Attendance
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
