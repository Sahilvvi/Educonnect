'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Loader2, ArrowLeft, CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

const homeworkSchema = z.object({
    title: z.string().min(3, 'Title is required'),
    description: z.string().optional(),
    class_id: z.string().min(1, 'Please select a class'),
    due_date: z.date(),
    subject: z.string().min(1, 'Subject is required'),
})

type HomeworkFormValues = z.infer<typeof homeworkSchema>

export function CreateHomeworkForm({ teacherProfile, classes }: { teacherProfile: any, classes: any[] }) {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const form = useForm<HomeworkFormValues>({
        resolver: zodResolver(homeworkSchema),
        defaultValues: {
            title: '',
            description: '',
            subject: '',
        },
    })

    const onSubmit = async (data: HomeworkFormValues) => {
        setIsLoading(true)
        try {
            // Find selected class to get school_id
            const selectedClass = classes.find(c => c.class_id === data.class_id)
            if (!selectedClass) throw new Error('Invalid class selected')

            const { error } = await supabase
                .from('homework_assignments')
                .insert({
                    title: data.title,
                    description: data.description,
                    class_id: data.class_id,
                    teacher_id: teacherProfile.id,
                    school_id: selectedClass.classes.school_id,
                    subject: data.subject,
                    due_date: data.due_date.toISOString(),
                    is_published: true, // Auto publish for MVP
                    created_at: new Date().toISOString(),
                })

            if (error) throw error

            toast.success('Assignment created successfully')
            router.push('/teacher/homework')
            router.refresh()
        } catch (error: any) {
            toast.error('Failed to create assignment: ' + error.message)
        } finally {
            setIsLoading(false)
        }
    }

    // Auto-fill subject when class is selected
    const handleClassChange = (classId: string) => {
        form.setValue('class_id', classId)
        const selectedClass = classes.find(c => c.class_id === classId)
        if (selectedClass && selectedClass.subject) {
            form.setValue('subject', selectedClass.subject)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-2xl bg-white p-6 rounded-lg shadow-sm border">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Assignment Title</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. Chapter 5 Review Questions" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="class_id"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Class</FormLabel>
                                <Select onValueChange={handleClassChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a class" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {classes.map((c) => (
                                            <SelectItem key={c.class_id} value={c.class_id}>
                                                {c.classes.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="subject"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Subject</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. Mathematics" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="due_date"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Due Date</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-[240px] pl-3 text-left font-normal",
                                                !field.value && "text-muted-foreground"
                                            )}
                                        >
                                            {field.value ? (
                                                format(field.value, "PPP")
                                            ) : (
                                                <span>Pick a date</span>
                                            )}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        disabled={(date) =>
                                            date < new Date()
                                        }
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description & Instructions</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Enter detailed instructions here..."
                                    className="min-h-[120px]"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex gap-4 pt-4 border-t">
                    <Button type="button" variant="outline" asChild>
                        <Link href="/teacher/homework">Cancel</Link>
                    </Button>
                    <Button type="submit" disabled={isLoading} className="flex-1">
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Create Assignment
                    </Button>
                </div>
            </form>
        </Form>
    )
}
