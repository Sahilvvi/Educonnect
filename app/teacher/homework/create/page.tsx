'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Loader2, CalendarIcon, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import { format } from 'date-fns'

export default function CreateHomeworkPage() {
    const [loading, setLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [classes, setClasses] = useState<any[]>([])
    const [dueDate, setDueDate] = useState<Date>()
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        subject: '',
        class_id: '',
        max_marks: '',
        status: 'draft'
    })

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
                        subject,
                        classes (
                            id,
                            name
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!dueDate) {
            toast.error('Please select a due date')
            return
        }

        setIsSubmitting(true)

        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            const { data: teacherProfile } = await supabase
                .from('teacher_profiles')
                .select('id')
                .eq('user_id', user.id)
                .single()

            const { error } = await supabase
                .from('homework_assignments')
                .insert([{
                    teacher_id: teacherProfile?.id,
                    class_id: formData.class_id,
                    title: formData.title,
                    description: formData.description,
                    subject: formData.subject,
                    due_date: dueDate.toISOString(),
                    max_marks: parseInt(formData.max_marks) || null,
                    status: formData.status
                }])

            if (error) throw error

            toast.success('Homework assignment created successfully')
            router.push('/teacher/homework')
        } catch (error: any) {
            toast.error(error.message || 'Failed to create homework')
        } finally {
            setIsSubmitting(false)
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
        <div className="container mx-auto px-4 py-8 max-w-3xl">
            <Button
                variant="ghost"
                onClick={() => router.back()}
                className="mb-6"
            >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>

            <Card>
                <CardHeader>
                    <CardTitle>Create Homework Assignment</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="title">Assignment Title *</Label>
                            <Input
                                id="title"
                                placeholder="e.g., Chapter 5 Exercises"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description *</Label>
                            <Textarea
                                id="description"
                                placeholder="Detailed instructions for the assignment..."
                                rows={5}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="class">Class *</Label>
                                <Select
                                    value={formData.class_id}
                                    onValueChange={(value) => setFormData({ ...formData, class_id: value })}
                                    required
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select class" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {classes.map((cls) => (
                                            <SelectItem key={cls.class_id} value={cls.class_id}>
                                                {cls.classes?.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="subject">Subject *</Label>
                                <Input
                                    id="subject"
                                    placeholder="e.g., Mathematics"
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Due Date *</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="w-full justify-start text-left font-normal"
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {dueDate ? format(dueDate, 'PPP') : 'Pick a date'}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                            mode="single"
                                            selected={dueDate}
                                            onSelect={setDueDate}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="marks">Maximum Marks</Label>
                                <Input
                                    id="marks"
                                    type="number"
                                    min="1"
                                    placeholder="100"
                                    value={formData.max_marks}
                                    onChange={(e) => setFormData({ ...formData, max_marks: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <Select
                                value={formData.status}
                                onValueChange={(value) => setFormData({ ...formData, status: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="draft">Save as Draft</SelectItem>
                                    <SelectItem value="published">Publish Now</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.back()}
                                className="flex-1"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1 bg-blue-600"
                            >
                                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                {formData.status === 'published' ? 'Create & Publish' : 'Save Draft'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
