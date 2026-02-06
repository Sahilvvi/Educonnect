'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Loader2, School } from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { toast } from 'sonner'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { createClient } from '@/lib/supabase/client'

const addChildSchema = z.object({
    school_code: z.string().min(1, 'School code is required'),
    student_id: z.string().min(1, 'Student ID is required'),
    relationship: z.enum(['mother', 'father', 'guardian', 'other'] as const),
})

type AddChildFormData = z.infer<typeof addChildSchema>

export function AddChildButton() {
    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const form = useForm<AddChildFormData>({
        resolver: zodResolver(addChildSchema),
        defaultValues: {
            school_code: '',
            student_id: '',
            relationship: undefined,
        },
    })

    const onSubmit = async (data: AddChildFormData) => {
        setIsLoading(true)

        try {
            // Get current user
            const {
                data: { user },
            } = await supabase.auth.getUser()

            if (!user) {
                toast.error('Not authenticated')
                return
            }

            // Get parent profile
            const { data: parentProfile } = await supabase
                .from('parent_profiles')
                .select('id')
                .eq('user_id', user.id)
                .single()

            if (!parentProfile) {
                toast.error('Parent profile not found')
                return
            }

            // Find school by code
            const { data: school, error: schoolError } = await supabase
                .from('schools')
                .select('id')
                .eq('code', data.school_code)
                .single()

            if (schoolError || !school) {
                toast.error('Invalid school code', {
                    description: 'Please check the school code and try again.',
                })
                return
            }

            // Find student by student_id and school
            const { data: student, error: studentError } = await supabase
                .from('students')
                .select('id, full_name')
                .eq('school_id', school.id)
                .eq('student_id', data.student_id)
                .single()

            if (studentError || !student) {
                toast.error('Student not found', {
                    description: 'Please verify the student ID and school code.',
                })
                return
            }

            // Check if already linked
            const { data: existing } = await supabase
                .from('parent_student_mapping')
                .select('id')
                .eq('parent_id', parentProfile.id)
                .eq('student_id', student.id)
                .single()

            if (existing) {
                toast.error('Already linked', {
                    description: 'This child is already linked to your account.',
                })
                return
            }

            // Create parent-student mapping
            const { error: mappingError } = await supabase
                .from('parent_student_mapping')
                .insert({
                    parent_id: parentProfile.id,
                    student_id: student.id,
                    relationship: data.relationship,
                    is_primary_contact: false,
                    verified_at: new Date().toISOString(), // Auto-verify for MVP
                })

            if (mappingError) {
                toast.error('Failed to link child', {
                    description: mappingError.message,
                })
                return
            }

            toast.success('Child added successfully!', {
                description: `${student.full_name} has been linked to your account.`,
            })

            setOpen(false)
            form.reset()
            router.refresh()
        } catch (error) {
            toast.error('Something went wrong', {
                description: 'Please try again later.',
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Child
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <School className="h-5 w-5" />
                        Link Your Child
                    </DialogTitle>
                    <DialogDescription>
                        Enter your child&apos;s details to link them to your account. You can
                        add children from multiple schools.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="school_code"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>School Code</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="e.g., GIS2026"
                                            {...field}
                                            disabled={isLoading}
                                        />
                                    </FormControl>
                                    <FormDescription className="text-xs">
                                        Contact your school for the school code
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="student_id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Student ID / Roll Number</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="e.g., 2024001"
                                            {...field}
                                            disabled={isLoading}
                                        />
                                    </FormControl>
                                    <FormDescription className="text-xs">
                                        Your child&apos;s unique ID provided by the school
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="relationship"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Your Relationship</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        disabled={isLoading}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select relationship" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="mother">Mother</SelectItem>
                                            <SelectItem value="father">Father</SelectItem>
                                            <SelectItem value="guardian">Guardian</SelectItem>
                                            <SelectItem value="other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex gap-3 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setOpen(false)}
                                disabled={isLoading}
                                className="flex-1"
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isLoading} className="flex-1">
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Add Child
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
