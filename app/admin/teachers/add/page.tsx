'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { toast } from 'sonner'
import { Loader2, ArrowLeft, Save } from 'lucide-react'

export default function AddTeacherPage() {
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        phone: '',
        qualification: '',
        designation: 'Assistant Teacher'
    })

    const router = useRouter()
    const supabase = createClient()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            const { data: roleData } = await supabase
                .from('user_roles')
                .select('school_id')
                .eq('user_id', user.id)
                .single()

            if (!roleData?.school_id) {
                toast.error('You are not linked to a school')
                return
            }

            // Insert into teacher_profiles
            // Note: This relies on user_id being nullable in DB, or this operation is just "Profile Creation"
            // and linking happens later. 
            const { error } = await supabase.from('teacher_profiles').insert({
                school_id: roleData.school_id,
                full_name: formData.full_name,
                email: formData.email,
                phone: formData.phone,
                qualification: formData.qualification,
                designation: formData.designation
            })

            if (error) throw error

            toast.success('Teacher profile created')
            router.push('/admin/teachers')
        } catch (error: any) {
            console.error(error)
            toast.error(error.message || 'Failed to add teacher')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container mx-auto p-8 max-w-2xl">
            <Button variant="ghost" onClick={() => router.back()} className="mb-6">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Teachers
            </Button>

            <Card>
                <CardHeader>
                    <CardTitle>Add New Teacher</CardTitle>
                    <CardDescription>Create a teacher profile. (User account needs to be linked separately)</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label>Full Name</Label>
                            <Input
                                required
                                value={formData.full_name}
                                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                placeholder="Jane Smith"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Email</Label>
                            <Input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="jane@school.com"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Phone</Label>
                            <Input
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Qualification</Label>
                                <Input
                                    value={formData.qualification}
                                    onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                                    placeholder="M.Sc. Physics"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Designation</Label>
                                <Input
                                    value={formData.designation}
                                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                                />
                            </div>
                        </div>

                        <Button type="submit" className="w-full bg-indigo-600" disabled={loading}>
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                            Create Profile
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
