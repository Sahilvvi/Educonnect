'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Loader2, BookOpen, Clock, CheckCircle } from 'lucide-react'

export default function AdminHomeworkPage() {
    const [homework, setHomework] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [filterClass, setFilterClass] = useState('all')
    const [filterStatus, setFilterStatus] = useState('all')
    const [classes, setClasses] = useState<any[]>([])

    const supabase = createClient()

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            const { data: roleData } = await supabase
                .from('user_roles')
                .select('school_id')
                .eq('user_id', user.id)
                .single()

            const [homeworkData, classesData] = await Promise.all([
                supabase
                    .from('homework_assignments')
                    .select(`
                        *,
                        classes (
                            id,
                            name
                        ),
                        teacher_profiles (
                            full_name
                        )
                    `)
                    .eq('school_id', roleData?.school_id)
                    .order('created_at', { ascending: false }),
                supabase
                    .from('classes')
                    .select('id, name')
                    .eq('school_id', roleData?.school_id)
            ])

            setHomework(homeworkData.data || [])
            setClasses(classesData.data || [])
        } catch (error) {
            console.error('Error fetching data:', error)
        } finally {
            setLoading(false)
        }
    }

    const filteredHomework = homework.filter(hw => {
        if (filterClass !== 'all' && hw.class_id !== filterClass) return false
        if (filterStatus !== 'all' && hw.status !== filterStatus) return false
        return true
    })

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'published':
                return <Badge className="bg-green-100 text-green-800">Published</Badge>
            case 'draft':
                return <Badge className="bg-gray-100 text-gray-800">Draft</Badge>
            default:
                return <Badge variant="outline">{status}</Badge>
        }
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Homework Overview</h1>
                <p className="text-gray-500">Monitor all homework assignments across classes</p>
            </div>

            {/* Filters */}
            <div className="flex gap-4 mb-6">
                <Select value={filterClass} onValueChange={setFilterClass}>
                    <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="All Classes" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Classes</SelectItem>
                        {classes.map(cls => (
                            <SelectItem key={cls.id} value={cls.id}>{cls.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Stats */}
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
                                <p className="text-sm text-muted-foreground">Published</p>
                                <p className="text-2xl font-bold text-green-600">
                                    {homework.filter(hw => hw.status === 'published').length}
                                </p>
                            </div>
                            <CheckCircle className="h-8 w-8 text-green-600" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Draft</p>
                                <p className="text-2xl font-bold text-gray-600">
                                    {homework.filter(hw => hw.status === 'draft').length}
                                </p>
                            </div>
                            <Clock className="h-8 w-8 text-gray-600" />
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
                ) : filteredHomework.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center h-64 text-gray-500">
                            <BookOpen className="h-12 w-12 mb-4 text-gray-400" />
                            <p>No homework assignments found</p>
                        </CardContent>
                    </Card>
                ) : (
                    filteredHomework.map((hw) => (
                        <Card key={hw.id}>
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <CardTitle className="text-xl">{hw.title}</CardTitle>
                                            {getStatusBadge(hw.status)}
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                            <span>Class: {hw.classes?.name}</span>
                                            <span>Subject: {hw.subject}</span>
                                            <span>Teacher: {hw.teacher_profiles?.full_name || 'N/A'}</span>
                                            <span>Due: {new Date(hw.due_date).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-700 line-clamp-2">{hw.description}</p>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}
