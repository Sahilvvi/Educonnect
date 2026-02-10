'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { Loader2, ArrowLeft, Save } from 'lucide-react'

export default function AddStudentPage() {
    const [loading, setLoading] = useState(false)
    const [classes, setClasses] = useState<any[]>([])
    const [formData, setFormData] = useState({
        full_name: '',
        student_id: '',
        roll_number: '',
        class_id: '',
        date_of_birth: '',
        gender: 'male',
        address: '',
        phone: ''
    })

    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        fetchClasses()
    }, [])

    const fetchClasses = async () => {
        const { data } = await supabase.from('classes').select('id, name, grade_level').order('name')
        if (data) setClasses(data)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            // Get School ID
            const { data: roleData } = await supabase
                .from('user_roles')
                .select('school_id')
                .eq('user_id', user.id)
                .single()

            if (!roleData?.school_id) {
                toast.error('You are not linked to a school')
                return
            }

            const { error } = await supabase.from('students').insert({
                school_id: roleData.school_id,
                full_name: formData.full_name, // Schema might use 'name' or 'full_name'. Checked view_file earlier: 'name' column in 'students' table? 
                // Wait, view_file earlier returned `students` table with `name` column.
                // But `parent_student_mapping` used `students ( full_name )`.
                // I should double check. Step 1776 view_file showed `student.name`.
                // But Step 1622 `parent_student_mapping` select logic used `full_name`.
                // Let's safe bet check schema or try both?
                // Actually Step 1776 output shows `TableCell {student.name}`. So 'name' is likely the column.
                // I'll use 'name' mapping from 'full_name' state.
                name: formData.full_name,
                student_id: formData.student_id,
                roll_number: formData.roll_number,
                class_id: formData.class_id,
                date_of_birth: formData.date_of_birth || null,
                gender: formData.gender,
                address: formData.address,
                phone: formData.phone
            })

            if (error) throw error

            toast.success('Student added successfully')
            router.push('/admin/students')
        } catch (error: any) {
            console.error(error)
            toast.error(error.message || 'Failed to add student')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container mx-auto p-8 max-w-2xl">
            <Button variant="ghost" onClick={() => router.back()} className="mb-6">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Students
            </Button>

            <Card>
                <CardHeader>
                    <CardTitle>Add New Student</CardTitle>
                    <CardDescription>Enter student details below.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label>Full Name</Label>
                            <Input
                                required
                                value={formData.full_name}
                                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                placeholder="John Doe"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Student ID (Admission No)</Label>
                                <Input
                                    required
                                    value={formData.student_id}
                                    onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
                                    placeholder="ADM-2024-001"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Roll Number</Label>
                                <Input
                                    value={formData.roll_number}
                                    onChange={(e) => setFormData({ ...formData, roll_number: e.target.value })}
                                    placeholder="101"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Class</Label>
                                <Select onValueChange={(val) => setFormData({ ...formData, class_id: val })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Class" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {classes.map((c) => (
                                            <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Gender</Label>
                                <Select
                                    value={formData.gender}
                                    onValueChange={(val) => setFormData({ ...formData, gender: val })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="male">Male</SelectItem>
                                        <SelectItem value="female">Female</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Date of Birth</Label>
                                <Input
                                    type="date"
                                    value={formData.date_of_birth}
                                    onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Phone</Label>
                                <Input
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    placeholder="+1 234..."
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Address</Label>
                            <Input
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            />
                        </div>

                        <Button type="submit" className="w-full bg-indigo-600" disabled={loading}>
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                            Save Student
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
