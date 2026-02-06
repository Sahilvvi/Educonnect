import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { TeacherNavbar } from '@/components/dashboard/TeacherNavbar'
import { Button } from '@/components/ui/button'
import { Plus, Calendar, FileText, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default async function TeacherHomeworkPage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const { data: teacherProfile } = await supabase
        .from('teacher_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

    if (!teacherProfile) redirect('/login')

    // Fetch homework created by this teacher
    const { data: assignments } = await supabase
        .from('homework_assignments')
        .select(`
            *,
            classes (
                name
            )
        `)
        .eq('teacher_id', teacherProfile.id)
        .order('created_at', { ascending: false })

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <TeacherNavbar
                teacherName={teacherProfile.full_name}
                teacherEmail={user.email}
            />

            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Homework & Assignments</h1>
                        <p className="text-gray-600">Manage assignments for your classes</p>
                    </div>
                    <Button asChild>
                        <Link href="/teacher/homework/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Create Assignment
                        </Link>
                    </Button>
                </div>

                {!assignments || assignments.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg border border-dashed shadow-sm">
                        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FileText className="h-8 w-8" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">No Assignments Yet</h3>
                        <p className="text-gray-500 max-w-sm mx-auto mt-1 mb-6">
                            You haven't created any homework assignments. Click below to get started.
                        </p>
                        <Button asChild variant="outline">
                            <Link href="/teacher/homework/create">
                                Create Your First Assignment
                            </Link>
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {assignments.map((assignment: any) => (
                            <Card key={assignment.id} className="hover:shadow-md transition-shadow flex flex-col">
                                <CardHeader className="pb-3">
                                    <div className="flex justify-between items-start gap-2">
                                        <CardTitle className="text-lg line-clamp-1" title={assignment.title}>
                                            {assignment.title}
                                        </CardTitle>
                                        <Badge variant={assignment.is_published ? "default" : "secondary"}>
                                            {assignment.is_published ? "Published" : "Draft"}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                        <span className="font-medium text-gray-700 bg-gray-100 px-2 py-0.5 rounded">
                                            {assignment.classes?.name}
                                        </span>
                                        <span>•</span>
                                        <span>{assignment.subject}</span>
                                    </div>
                                </CardHeader>
                                <CardContent className="flex-1 pb-4">
                                    <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                                        {assignment.description || 'No description provided.'}
                                    </p>
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <Calendar className="h-3.5 w-3.5" />
                                        <span>Due: {format(new Date(assignment.due_date), 'PPP')}</span>
                                    </div>
                                </CardContent>
                                <CardFooter className="pt-0 border-t bg-gray-50/50 p-3">
                                    <Button variant="ghost" size="sm" className="w-full text-xs h-8">
                                        View Submissions
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
