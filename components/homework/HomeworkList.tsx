'use client'

import { useState } from 'react'
import { HomeworkCard } from '@/components/homework/HomeworkCard'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { isPast, isToday } from 'date-fns'

interface HomeworkListProps {
    assignments: any[]
    studentId: string
}

export function HomeworkList({ assignments, studentId }: HomeworkListProps) {
    // Logic to determine status since is_submitted is mocked/not fully implemented in DB yet
    const getStatus = (assignment: any) => {
        const dueDate = new Date(assignment.due_date)
        // Random mock submission status for demo if not present
        const isSubmitted = assignment.is_submitted || false
        const isOverdue = isPast(dueDate) && !isToday(dueDate) && !isSubmitted

        if (isSubmitted) return 'completed'
        if (isOverdue) return 'overdue'
        return 'pending'
    }

    const pendingAssignments = assignments.filter(a => getStatus(a) === 'pending' || getStatus(a) === 'overdue')
    const completedAssignments = assignments.filter(a => getStatus(a) === 'completed')

    return (
        <Tabs defaultValue="pending" className="w-full">
            <TabsList className="mb-6 w-full md:w-auto">
                <TabsTrigger value="pending" className="flex-1 md:flex-none">
                    To Do ({pendingAssignments.length})
                </TabsTrigger>
                <TabsTrigger value="completed" className="flex-1 md:flex-none">
                    Completed ({completedAssignments.length})
                </TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="space-y-4">
                {pendingAssignments.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg border border-dashed">
                        <p className="text-gray-500">No pending homework! 🎉</p>
                    </div>
                ) : (
                    pendingAssignments.map(assignment => (
                        <HomeworkCard
                            key={assignment.id}
                            assignment={assignment}
                            studentId={studentId}
                        />
                    ))
                )}
            </TabsContent>

            <TabsContent value="completed" className="space-y-4">
                {completedAssignments.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg border border-dashed">
                        <p className="text-gray-500">No completed assignments yet.</p>
                    </div>
                ) : (
                    completedAssignments.map(assignment => (
                        <HomeworkCard
                            key={assignment.id}
                            assignment={{ ...assignment, is_submitted: true }}
                            studentId={studentId}
                        />
                    ))
                )}
            </TabsContent>
        </Tabs>
    )
}
