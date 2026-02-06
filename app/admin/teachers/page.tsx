import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AdminNavbar } from '@/components/dashboard/AdminNavbar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Plus, MoreHorizontal, Mail, Phone } from 'lucide-react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import Link from 'next/link'

export default async function AdminTeachersPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    // Fetch teachers
    // Using teacher_profiles for listing
    const { data: teachers } = await supabase
        .from('teacher_profiles')
        .select('*')
        .order('full_name', { ascending: true })

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <AdminNavbar />

            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Teachers</h1>
                        <p className="text-gray-600">Manage teaching staff and assignments</p>
                    </div>
                    <Button asChild>
                        <Link href="/admin/teachers/add">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Teacher
                        </Link>
                    </Button>
                </div>

                <div className="bg-white rounded-lg shadow border p-4 mb-6">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                        <Input
                            placeholder="Search teachers by name, email..."
                            className="pl-9 max-w-md"
                        />
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow border overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Phone</TableHead>
                                <TableHead>Subjects</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {teachers?.map((teacher) => (
                                <TableRow key={teacher.id}>
                                    <TableCell className="font-medium">{teacher.full_name}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Mail className="h-3 w-3 text-gray-400" />
                                            {teacher.email}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {teacher.phone && (
                                            <div className="flex items-center gap-2">
                                                <Phone className="h-3 w-3 text-gray-400" />
                                                {teacher.phone}
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell>-</TableCell>
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
