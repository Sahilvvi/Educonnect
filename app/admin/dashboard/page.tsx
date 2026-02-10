import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, GraduationCap, School, CreditCard } from 'lucide-react'

export default async function AdminDashboard() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/login')

    // Get school ID for this admin
    const { data: roleData } = await supabase
        .from('user_roles')
        .select('school_id')
        .eq('user_id', user.id)
        .single()

    const schoolId = roleData?.school_id

    // Fetch all stats in parallel
    const [
        { count: studentCount },
        { count: teacherCount },
        { count: classCount },
        { data: feeData }
    ] = await Promise.all([
        supabase
            .from('students')
            .select('*', { count: 'exact', head: true })
            .eq('school_id', schoolId),
        supabase
            .from('teacher_profiles')
            .select('*', { count: 'exact', head: true })
            .eq('school_id', schoolId),
        supabase
            .from('classes')
            .select('*', { count: 'exact', head: true })
            .eq('school_id', schoolId),
        supabase
            .from('fee_records')
            .select('amount, paid_amount, status')
            .eq('school_id', schoolId)
            .eq('status', 'pending')
    ])

    // Calculate pending fees
    const pendingFees = feeData?.reduce((total, record) => {
        return total + (Number(record.amount) - Number(record.paid_amount || 0))
    }, 0) || 0

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">School Overview</h1>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                        <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{studentCount || 0}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{teacherCount || 0}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Classes</CardTitle>
                        <School className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{classCount || 0}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Fees</CardTitle>
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${pendingFees.toLocaleString()}</div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
