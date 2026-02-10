'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { BookOpen, Calendar, Award, TrendingUp, Plus, Loader2, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

export default function AcademicsPage() {
    const [activeTab, setActiveTab] = useState('subjects')
    const [subjects, setSubjects] = useState<any[]>([])
    const [academicYears, setAcademicYears] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [newSubject, setNewSubject] = useState({
        name: '',
        code: '',
        description: '',
        credit_hours: ''
    })

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

            // Fetch subjects from system_settings or create dedicated subjects table
            const { data: subjectsData } = await supabase
                .from('system_settings')
                .select('*')
                .eq('school_id', roleData?.school_id)
                .eq('category', 'academic')
                .eq('setting_key', 'subjects')
                .single()

            if (subjectsData?.setting_value) {
                setSubjects(subjectsData.setting_value as any[])
            }

            // Fetch academic years
            const { data: yearsData } = await supabase
                .from('system_settings')
                .select('*')
                .eq('school_id', roleData?.school_id)
                .eq('category', 'academic')
                .eq('setting_key', 'academic_years')
                .single()

            if (yearsData?.setting_value) {
                setAcademicYears(yearsData.setting_value as any[])
            }
        } catch (error) {
            console.error('Error fetching data:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleCreateSubject = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            const { data: roleData } = await supabase
                .from('user_roles')
                .select('school_id')
                .eq('user_id', user.id)
                .single()

            const updatedSubjects = [...subjects, { ...newSubject, id: Date.now() }]

            const { error } = await supabase
                .from('system_settings')
                .upsert([{
                    school_id: roleData?.school_id,
                    setting_key: 'subjects',
                    setting_value: updatedSubjects,
                    category: 'academic',
                    description: 'School subjects configuration',
                    updated_by: user.id
                }])

            if (error) throw error

            toast.success('Subject created successfully')
            setSubjects(updatedSubjects)
            setIsDialogOpen(false)
            setNewSubject({ name: '', code: '', description: '', credit_hours: '' })
        } catch (error: any) {
            toast.error(error.message || 'Failed to create subject')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDeleteSubject = async (subjectId: number) => {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            const { data: roleData } = await supabase
                .from('user_roles')
                .select('school_id')
                .eq('user_id', user.id)
                .single()

            const updatedSubjects = subjects.filter(s => s.id !== subjectId)

            const { error } = await supabase
                .from('system_settings')
                .upsert([{
                    school_id: roleData?.school_id,
                    setting_key: 'subjects',
                    setting_value: updatedSubjects,
                    category: 'academic',
                    updated_by: user.id
                }])

            if (error) throw error

            toast.success('Subject deleted')
            setSubjects(updatedSubjects)
        } catch (error: any) {
            toast.error(error.message || 'Failed to delete subject')
        }
    }

    const getPerformanceStats = async () => {
        // This would fetch real exam/grade data when implemented
        return {
            passRate: 92,
            averageGrade: 'B+',
            topPerformers: 45
        }
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
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Academic Management</h1>
                <p className="text-gray-500">Manage curriculum, subjects, and academic performance</p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="subjects">Subjects</TabsTrigger>
                    <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                    <TabsTrigger value="performance">Performance</TabsTrigger>
                </TabsList>

                <TabsContent value="subjects" className="space-y-4 mt-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold">Subject Management</h2>
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button className="bg-blue-600">
                                    <Plus className="mr-2 h-4 w-4" /> Add Subject
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Create New Subject</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={handleCreateSubject} className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Subject Name *</Label>
                                        <Input
                                            id="name"
                                            value={newSubject.name}
                                            onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
                                            placeholder="e.g., Mathematics"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="code">Subject Code</Label>
                                        <Input
                                            id="code"
                                            value={newSubject.code}
                                            onChange={(e) => setNewSubject({ ...newSubject, code: e.target.value })}
                                            placeholder="e.g., MATH101"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="description">Description</Label>
                                        <Textarea
                                            id="description"
                                            value={newSubject.description}
                                            onChange={(e) => setNewSubject({ ...newSubject, description: e.target.value })}
                                            placeholder="Subject description"
                                            rows={3}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="credit_hours">Credit Hours</Label>
                                        <Input
                                            id="credit_hours"
                                            type="number"
                                            value={newSubject.credit_hours}
                                            onChange={(e) => setNewSubject({ ...newSubject, credit_hours: e.target.value })}
                                            placeholder="e.g., 3"
                                        />
                                    </div>
                                    <DialogFooter>
                                        <Button type="submit" disabled={isSubmitting} className="w-full">
                                            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                                            Create Subject
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <Card>
                        <CardContent className="pt-6">
                            {subjects.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                                    <p>No subjects created yet. Click "Add Subject" to get started.</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {subjects.map((subject) => (
                                        <div key={subject.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="font-semibold text-lg">{subject.name}</h3>
                                                    {subject.code && (
                                                        <Badge variant="outline">{subject.code}</Badge>
                                                    )}
                                                </div>
                                                {subject.description && (
                                                    <p className="text-sm text-muted-foreground">{subject.description}</p>
                                                )}
                                                {subject.credit_hours && (
                                                    <p className="text-sm text-muted-foreground mt-1">
                                                        Credit Hours: {subject.credit_hours}
                                                    </p>
                                                )}
                                            </div>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => handleDeleteSubject(subject.id)}
                                            >
                                                <Trash2 className="h-4 w-4 text-red-600" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="curriculum" className="space-y-4 mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BookOpen className="h-5 w-5" />
                                Curriculum Overview
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground mb-4">
                                Curriculum structure is based on assigned subjects and grade levels.
                                Use the Subjects tab to manage available subjects for your school.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-4 border rounded-lg">
                                    <h3 className="font-semibold mb-2">Grade 1-5</h3>
                                    <p className="text-sm text-muted-foreground">Primary Education</p>
                                    <p className="text-sm mt-2">{subjects.length} subjects available</p>
                                </div>
                                <div className="p-4 border rounded-lg">
                                    <h3 className="font-semibold mb-2">Grade 6-8</h3>
                                    <p className="text-sm text-muted-foreground">Middle School</p>
                                    <p className="text-sm mt-2">{subjects.length} subjects available</p>
                                </div>
                                <div className="p-4 border rounded-lg">
                                    <h3 className="font-semibold mb-2">Grade 9-10</h3>
                                    <p className="text-sm text-muted-foreground">Secondary Education</p>
                                    <p className="text-sm mt-2">{subjects.length} subjects available</p>
                                </div>
                                <div className="p-4 border rounded-lg">
                                    <h3 className="font-semibold mb-2">Grade 11-12</h3>
                                    <p className="text-sm text-muted-foreground">Higher Secondary</p>
                                    <p className="text-sm mt-2">{subjects.length} subjects available</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="performance" className="space-y-4 mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="h-5 w-5" />
                                Academic Performance Overview
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="p-4 bg-green-50 rounded-lg">
                                    <p className="text-sm text-muted-foreground">Average Pass Rate</p>
                                    <p className="text-3xl font-bold text-green-600">92%</p>
                                </div>
                                <div className="p-4 bg-blue-50 rounded-lg">
                                    <p className="text-sm text-muted-foreground">Average Grade</p>
                                    <p className="text-3xl font-bold text-blue-600">B+</p>
                                </div>
                                <div className="p-4 bg-purple-50 rounded-lg">
                                    <p className="text-sm text-muted-foreground">Top Performers</p>
                                    <p className="text-3xl font-bold text-purple-600">45</p>
                                </div>
                            </div>
                            <p className="text-sm text-muted-foreground mt-4">
                                *Performance metrics will be calculated from exam results when examination system is implemented
                            </p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
