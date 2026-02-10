'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/input'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Loader2, Search } from 'lucide-react'

export default function AdminStudentsPage() {
    const [students, setStudents] = useState<any[]>([])
    const [filteredStudents, setFilteredStudents] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')

    const supabase = createClient()

    useEffect(() => {
        fetchStudents()
    }, [])

    useEffect(() => {
        // Filter students based on search query
        if (searchQuery.trim() === '') {
            setFilteredStudents(students)
        } else {
            const query = searchQuery.toLowerCase()
            const filtered = students.filter(student =>
                student.full_name?.toLowerCase().includes(query) ||
                student.student_id?.toLowerCase().includes(query) ||
                student.classes?.name?.toLowerCase().includes(query) ||
                student.roll_number?.toLowerCase().includes(query)
            )
            setFilteredStudents(filtered)
        }
    }, [searchQuery, students])

    const fetchStudents = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            const { data: roleData } = await supabase
                .from('user_roles')
                .select('school_id')
                .eq('user_id', user.id)
                .single()

            const { data } = await supabase
                .from('students')
                .select(`
                    *,
                    classes (
                        id,
                        name
                    )
                `)
                .eq('school_id', roleData?.school_id)
                .order('full_name')

            setStudents(data || [])
            setFilteredStudents(data || [])
        } catch (error) {
            console.error('Error fetching students:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="relative">
            {/* Search Bar */}
            <div className="mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search by name, student ID, roll number, or class..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
                {searchQuery && (
                    <p className="mt-2 text-sm text-gray-600">
                        Found {filteredStudents.length} student{filteredStudents.length !== 1 ? 's' : ''}
                    </p>
                )}
            </div>

            {/* Table */}
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Student ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Class</TableHead>
                        <TableHead>Roll No</TableHead>
                        <TableHead>DOB</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {loading ? (
                        <TableRow>
                            <TableCell colSpan={5} className="h-24 text-center">
                                <Loader2 className="mx-auto h-6 w-6 animate-spin text-gray-400" />
                            </TableCell>
                        </TableRow>
                    ) : filteredStudents.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="h-24 text-center text-gray-500">
                                {searchQuery ? 'No students match your search' : 'No students found'}
                            </TableCell>
                        </TableRow>
                    ) : (
                        filteredStudents.map((student) => (
                            <TableRow key={student.id}>
                                <TableCell className="font-medium">{student.student_id}</TableCell>
                                <TableCell>{student.full_name}</TableCell>
                                <TableCell>{student.classes?.name || '-'}</TableCell>
                                <TableCell>{student.roll_number || '-'}</TableCell>
                                <TableCell>
                                    {student.date_of_birth
                                        ? new Date(student.date_of_birth).toLocaleDateString()
                                        : student.dob
                                            ? new Date(student.dob).toLocaleDateString()
                                            : '-'}
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
