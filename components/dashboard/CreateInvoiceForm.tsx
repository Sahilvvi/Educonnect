'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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

const invoiceSchema = z.object({
    student_id: z.string().min(1, 'Student is required'),
    // fee_type_id: z.string().min(1, 'Fee Type is required'), // Simplified to manual entry
    amount: z.string().min(1, 'Amount is required'),
    due_date: z.string().min(1, 'Due date is required'),
    description: z.string().optional(),
})

type InvoiceFormValues = z.infer<typeof invoiceSchema>

export function CreateInvoiceForm({ students, schoolId }: { students: any[], schoolId: string }) {
    const router = useRouter()
    const supabase = createClient()
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<InvoiceFormValues>({
        resolver: zodResolver(invoiceSchema),
        defaultValues: {
            student_id: '',
            amount: '',
            due_date: new Date().toISOString().split('T')[0],
            description: '',
        },
    })

    const onSubmit = async (data: InvoiceFormValues) => {
        setIsLoading(true)
        try {
            // Need a dummy fee type or creating ad-hoc?
            // Schema requires `fee_type_id`.
            // Let's first check if a "General" fee type exists, or create one if missing?
            // Or just allow Ad-hoc? Table says `fee_type_id NOT NULL REFERENCES fee_types(id)`.
            // So we MUST pick a fee type.

            // For MVP simplicity: We will auto-create a "General" fee type if not passed, 
            // OR we iterate on this form to fetch fee types too.
            // Let's just create a fee record directly if we can bypass, but we can't.

            // Workaround: We'll fetch fee_types in parent.
            // For now, let's assume we have a fee_type_id passed or we select one.

            // Actually, let's just error if no fee types.
            // Wait, I didn't pass fee types to this component.
            // I'll update the component signature in a sec.

            // FOR NOW: I'll hardcode a "Tuition" type creation if missing? No that's messy.
            // Let's just insert into `fee_records` and see. If it fails, we know why.
            // Actually, I'll assume the user has created fee types or I'll query them.

            // Better: Let's Just Insert and assume we have a "Miscellaneous" type logic server side?
            // No.

            // Let's INSERT a dummy fee type for this MVP specific invoice to make it work seamlessly?
            // "Custom Invoice" Fee Type.

            const { data: feeType } = await supabase
                .from('fee_types')
                .select('id')
                .eq('name', 'General')
                .eq('school_id', schoolId)
                .single()

            let typeId = feeType?.id

            if (!typeId) {
                // Create default fee type
                const { data: newType, error: typeError } = await supabase
                    .from('fee_types')
                    .insert({
                        school_id: schoolId,
                        name: 'General',
                        amount: 0,
                        frequency: 'one_time'
                    })
                    .select()
                    .single()

                if (typeError) {
                    // Fallback/Error
                    throw new Error('Could not initialize billing system (Fee Types).')
                }
                typeId = newType.id
            }

            const { error } = await supabase
                .from('fee_records')
                .insert({
                    school_id: schoolId,
                    student_id: data.student_id,
                    fee_type_id: typeId,
                    amount: parseFloat(data.amount),
                    due_date: data.due_date,
                    remarks: data.description,
                    status: 'pending'
                })

            if (error) throw error

            toast.success('Invoice created successfully')
            router.push('/admin/fees')
            router.refresh()
        } catch (error: any) {
            toast.error('Failed to create invoice: ' + error.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="student_id"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Student</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Student" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {students.map((s) => (
                                        <SelectItem key={s.id} value={s.id}>
                                            {s.name} ({s.classes?.name || 'No Class'})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Amount ($)</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder="100.00" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="due_date"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Due Date</FormLabel>
                                <FormControl>
                                    <Input type="date" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Input placeholder="Tuition fees for Term 1..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex justify-end gap-4">
                    <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Create Invoice
                    </Button>
                </div>
            </form>
        </Form>
    )
}
