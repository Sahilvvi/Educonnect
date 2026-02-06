'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, FileText, CheckCircle2, Clock, AlertCircle } from 'lucide-react'
import { format, isPast, isToday } from 'date-fns'
import Link from 'next/link'

interface HomeworkAssignment {
    id: string
    title: string
    subject: string
    description?: string
    due_date: string
    is_submitted?: boolean // mocked for now
    total_marks?: number
}

interface HomeworkCardProps {
    assignment: HomeworkAssignment
    studentId: string
}

export function HomeworkCard({ assignment, studentId }: HomeworkCardProps) {
    const dueDate = new Date(assignment.due_date)
    const isOverdue = isPast(dueDate) && !isToday(dueDate) && !assignment.is_submitted

    const getStatusColor = () => {
        if (assignment.is_submitted) return 'bg-green-100 text-green-700 hover:bg-green-200'
        if (isOverdue) return 'bg-red-100 text-red-700 hover:bg-red-200'
        return 'bg-blue-100 text-blue-700 hover:bg-blue-200'
    }

    const getStatusText = () => {
        if (assignment.is_submitted) return 'Submitted'
        if (isOverdue) return 'Overdue'
        return 'Pending'
    }

    const getStatusIcon = () => {
        if (assignment.is_submitted) return <CheckCircle2 className="h-3 w-3 mr-1" />
        if (isOverdue) return <AlertCircle className="h-3 w-3 mr-1" />
        return <Clock className="h-3 w-3 mr-1" />
    }

    return (
        <Link href={`/parent/student/${studentId}/homework/${assignment.id}`}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-transparent hover:border-l-blue-500">
                <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <div className="text-xs font-semibold text-blue-600 mb-1 uppercase tracking-wider">
                                {assignment.subject}
                            </div>
                            <h3 className="font-semibold text-lg text-gray-900 leading-tight">
                                {assignment.title}
                            </h3>
                        </div>
                        <Badge variant="secondary" className={`${getStatusColor()} border-0`}>
                            {getStatusIcon()}
                            {getStatusText()}
                        </Badge>
                    </div>

                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {assignment.description}
                    </p>

                    <div className="flex items-center text-xs text-gray-500 gap-4">
                        <div className={`flex items-center gap-1 ${isOverdue ? 'text-red-600 font-medium' : ''}`}>
                            <Calendar className="h-3 w-3" />
                            Due: {format(dueDate, 'MMM d, yyyy')}
                        </div>
                        <div className="flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            {assignment.total_marks ? `${assignment.total_marks} Marks` : 'Ungraded'}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    )
}
