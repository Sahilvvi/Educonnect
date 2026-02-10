'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, BookOpen, Calendar, Clock } from 'lucide-react'

export default function StudentHomeworkPage() {
    const [homework, setHomework] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    const supabase = createClient()

    useEffect(() => {
        fetchHomework()
    }, [])

    const fetchHomework = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            // Get student by matching email
            const { data: student } = await supabase
                .from('students')
                .select('id, class_id')
                .eq('email', user.email)
                .single()

            if (!student) return

            // Fetch homework for this class
            const { data } = await supabase
                .from('homework_assignments')
                .select(`
                    *,
                    classes (
                        id,
                        name
                    )
                `)
                .eq('class_id', student.class_id)
                .eq('status', 'published')
                .order('due_date', { ascending: true })

            setHomework(data || [])
        } catch (error) {
            console.error('Error fetching homework:', error)
        } finally {
            setLoading(false)
        }
    }

    const getStatusBadge = (dueDate: string) => {
        const due = new Date(dueDate)
        const now = new Date()
        const daysUntilDue = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

        if (daysUntilDue < 0) {
            return <Badge className="bg-red-100 text-red-800">Overdue</Badge>
        } else if (daysUntilDue === 0) {
            return <Badge className="bg-orange-100 text-orange-800">Due Today</Badge>
        } else if (daysUntilDue <= 3) {
            return <Badge className="bg-yellow-100 text-yellow-800">Due Soon</Badge>
        } else {
            return <Badge className="bg-green-100 text-green-800">Upcoming</Badge>
        }
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">My Homework</h1>
                <p className="text-gray-500">View and track your homework assignments</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Total Assignments</p>
                                <p className="text-2xl font-bold">{homework.length}</p>
                            </div>
                            <BookOpen className="h-8 w-8 text-blue-600" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Due This Week</p>
                                <p className="text-2xl font-bold">
                                    {homework.filter(hw => {
                                        const due = new Date(hw.due_date)
                                        const now = new Date()
                                        const daysUntilDue = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
                                        return daysUntilDue >= 0 && daysUntilDue <= 7
                                    }).length}
                                </p>
                            </div>
                            <Clock className="h-8 w-8 text-orange-600" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Overdue</p>
                                <p className="text-2xl font-bold text-red-600">
                                    {homework.filter(hw => new Date(hw.due_date) < new Date()).length}
                                </p>
                            </div>
                            <Calendar className="h-8 w-8 text-red-600" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Homework List */}
            <div className="space-y-4">
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                    </div>
                ) : homework.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center h-64 text-gray-500">
                            <BookOpen className="h-12 w-12 mb-4 text-gray-400" />
                            <p>No homework assignments at the moment</p>
                        </CardContent>
                    </Card>
                ) : (
                    homework.map((hw) => (
                        <Card key={hw.id}>
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <CardTitle className="text-xl">{hw.title}</CardTitle>
                                            {getStatusBadge(hw.due_date)}
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <BookOpen className="h-4 w-4" />
                                                {hw.subject}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Calendar className="h-4 w-4" />
                                                Due: {new Date(hw.due_date).toLocaleDateString()}
                                            </span>
                                            {hw.max_marks && (
                                                <Badge variant="outline">Max Marks: {hw.max_marks}</Badge>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-700 whitespace-pre-wrap">{hw.description}</p>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}
