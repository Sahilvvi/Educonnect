import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AdminNavbar } from '@/components/dashboard/AdminNavbar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Plus, MoreHorizontal } from 'lucide-react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import Link from 'next/link'

export default async function AdminStudentsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const { data: students } = await supabase
        .from('students')
        .select(`
            *,
            classes ( name )
        `)
        .order('name', { ascending: true })
        .limit(50)

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <AdminNavbar />

            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Students</h1>
                        <p className="text-gray-600">Manage student records and admissions</p>
                    </div>
                    <Button asChild>
                        <Link href="/admin/students/add">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Student
                        </Link>
                    </Button>
                </div>

                <div className="bg-white rounded-lg shadow border p-4 mb-6">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                        <Input
                            placeholder="Search students by name, roll number..."
                            className="pl-9 max-w-md"
                        />
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow border overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Roll No</TableHead>
                                <TableHead>Class</TableHead>
                                <TableHead>Phone</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {students?.map((student) => (
                                <TableRow key={student.id}>
                                    <TableCell className="font-medium">{student.name}</TableCell>
                                    <TableCell>{student.roll_number}</TableCell>
                                    <TableCell>
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                                            {student.classes?.name || 'Unassigned'}
                                        </span>
                                    </TableCell>
                                    <TableCell>{student.phone || '-'}</TableCell>
                                    <TableCell>
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
                                            Active
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    )
}
