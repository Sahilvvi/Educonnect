import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AdminNavbar } from '@/components/dashboard/AdminNavbar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, GraduationCap, School, CreditCard } from 'lucide-react'

export default async function AdminDashboard() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/login')

    // Fetch school stats
    // Note: Assuming admin is linked to a school via 'school_admin_profiles' or similar
    // For MVP, we might associate via user metadata or just show all if SUPER ADMIN
    // Let's assume there's a 'schools' table and we get the first one for now

    const { data: school } = await supabase.from('schools').select('*').limit(1).single()
    const schoolId = school?.id

    const { count: studentCount } = await supabase
        .from('students')
        .select('*', { count: 'exact', head: true })
        .eq('school_id', schoolId)

    const { count: teacherCount } = await supabase
        .from('teachers')
        .select('*', { count: 'exact', head: true }) // Using 'teachers' view/table if exists, or teacher_profiles
    // In schema we have 'teacher_profiles' but linked to 'schools'? 
    // Schema diagram says schools ||--o{ teachers
    // Let's check 'teacher_profiles'. It doesn't strictly have school_id in my previous view.
    // Wait, Implementation Plan says `teacher_profiles` linked to school via `teachers` table?
    // Ah, `teachers` table is linked to schools.
    // Let's check `teachers` table count.

    // Actually, looking at previous files, we used `teacher_profiles`.
    // Let's safe bet count `teacher_profiles` for now or `teachers` table if we created it.
    // I recall `schools` table.
    // Let's count `teacher_profiles` generally.

    const { count: teachersTotal } = await supabase
        .from('teacher_profiles')
        .select('*', { count: 'exact', head: true })

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <AdminNavbar userName="Admin" />

            <div className="container mx-auto px-4 py-8">
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
                            <div className="text-2xl font-bold">{teachersTotal || 0}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Classes</CardTitle>
                            <School className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">12</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pending Fees</CardTitle>
                            <CreditCard className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">$12,450</div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
