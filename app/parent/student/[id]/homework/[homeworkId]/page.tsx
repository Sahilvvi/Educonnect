import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ParentNavbar } from '@/components/dashboard/ParentNavbar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Calendar, User, FileText, Upload, CheckCircle2 } from 'lucide-react'
import { format } from 'date-fns'
import Link from 'next/link'

interface PageProps {
    params: {
        id: string
        homeworkId: string
    }
}

export default async function HomeworkDetailsPage({ params }: PageProps) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const { data: parentProfile } = await supabase
        .from('parent_profiles')
        .select('full_name')
        .eq('user_id', user.id)
        .single()

    // Fetch assignment details
    const { data: assignment } = await supabase
        .from('homework_assignments')
        .select('*, teacher_profiles(full_name)')
        .eq('id', params.homeworkId)
        .single()

    if (!assignment) {
        return <div>Assignment not found</div>
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <ParentNavbar parentName={parentProfile?.full_name || 'Parent'} />

            <div className="container mx-auto px-4 py-8 max-w-3xl">
                <Button variant="ghost" size="sm" asChild className="mb-4 pl-0">
                    <Link href={`/parent/student/${params.id}/homework`}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Assignments
                    </Link>
                </Button>

                <div className="grid gap-6">
                    {/* Header Card */}
                    <Card>
                        <CardHeader className="pb-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <Badge className="mb-2 bg-blue-100 text-blue-700 hover:bg-blue-100 border-0">
                                        {assignment.subject}
                                    </Badge>
                                    <CardTitle className="text-2xl">{assignment.title}</CardTitle>
                                </div>
                                {/* Mock status for now */}
                                <Badge variant="outline" className="border-orange-200 text-orange-700 bg-orange-50">
                                    Pending
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-6 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    <span>Due: <span className="font-semibold text-gray-900">{format(new Date(assignment.due_date), 'MMMM do, yyyy')}</span></span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <User className="h-4 w-4" />
                                    <span>Assigned by: {assignment.teacher_profiles?.full_name || 'Teacher'}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4" />
                                    <span>Marks: {assignment.total_marks > 0 ? assignment.total_marks : 'Ungraded'}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Details Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Instructions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="prose prose-sm max-w-none text-gray-700">
                                <p className="whitespace-pre-wrap">{assignment.description}</p>
                            </div>

                            {/* Attachments Section - Placeholder */}
                            {assignment.attachment_urls && assignment.attachment_urls.length > 0 && (
                                <div className="mt-6">
                                    <h4 className="font-medium mb-3 text-sm text-gray-900">Attachments</h4>
                                    <div className="flex gap-2">
                                        {assignment.attachment_urls.map((url: string, i: number) => (
                                            <Button key={i} variant="outline" size="sm" className="gap-2">
                                                <FileText className="h-4 w-4" />
                                                Attachment {i + 1}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Submission Card - Mock Interface */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Your Submission</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="bg-slate-50 border border-dashed rounded-lg p-8 text-center">
                                <Upload className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                                <h3 className="font-medium text-gray-900">Upload your homework</h3>
                                <p className="text-sm text-gray-500 mb-4">
                                    Drag and drop files here, or click to select files
                                </p>
                                {/* Disabled for MVP until Supabase Storage is set up */}
                                <Button disabled>Select File (Coming Soon)</Button>
                                <p className="text-xs text-gray-400 mt-4">
                                    Supported formats: PDF, JPG, PNG
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
