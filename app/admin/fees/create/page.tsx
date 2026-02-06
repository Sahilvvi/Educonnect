import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AdminNavbar } from '@/components/dashboard/AdminNavbar'
import { CreateInvoiceForm } from '@/components/dashboard/CreateInvoiceForm'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function CreateInvoicePage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/login')

    // Get school info
    const { data: school } = await supabase.from('schools').select('id').limit(1).single()
    const schoolId = school?.id

    // Get students list
    const { data: students } = await supabase
        .from('students')
        .select('id, name, classes(name)')
        .eq('school_id', schoolId)
        .order('name')

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <AdminNavbar />

            <div className="container mx-auto px-4 py-8">
                <div className="mb-6">
                    <Button variant="ghost" className="pl-0 mb-4" asChild>
                        <Link href="/admin/fees">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Fees
                        </Link>
                    </Button>
                    <h1 className="text-3xl font-bold text-gray-900">Create Invoice</h1>
                    <p className="text-gray-600">Bill a student for tuition or other fees</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow max-w-2xl border">
                    <CreateInvoiceForm students={students || []} schoolId={schoolId} />
                </div>
            </div>
        </div>
    )
}
