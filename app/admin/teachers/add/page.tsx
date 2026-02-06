import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AdminNavbar } from '@/components/dashboard/AdminNavbar'
import { AddTeacherForm } from '@/components/dashboard/AddTeacherForm'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function AddTeacherPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/login')

    // Get school info
    const { data: school } = await supabase.from('schools').select('id').limit(1).single()
    const schoolId = school?.id

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <AdminNavbar />

            <div className="container mx-auto px-4 py-8">
                <div className="mb-6">
                    <Button variant="ghost" className="pl-0 mb-4" asChild>
                        <Link href="/admin/teachers">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Teachers
                        </Link>
                    </Button>
                    <h1 className="text-3xl font-bold text-gray-900">Add New Teacher</h1>
                    <p className="text-gray-600">Onboard a new teacher to the school</p>
                </div>

                <AddTeacherForm schoolId={schoolId} />
            </div>
        </div>
    )
}
