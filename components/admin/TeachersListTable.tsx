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

export default function AdminTeachersPage() {
    const [teachers, setTeachers] = useState<any[]>([])
    const [filteredTeachers, setFilteredTeachers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')

    const supabase = createClient()

    useEffect(() => {
        fetchTeachers()
    }, [])

    useEffect(() => {
        // Filter teachers based on search query
        if (searchQuery.trim() === '') {
            setFilteredTeachers(teachers)
        } else {
            const query = searchQuery.toLowerCase()
            const filtered = teachers.filter(teacher =>
                teacher.full_name?.toLowerCase().includes(query) ||
                teacher.email?.toLowerCase().includes(query) ||
                teacher.phone?.toLowerCase().includes(query) ||
                teacher.designation?.toLowerCase().includes(query) ||
                teacher.qualification?.toLowerCase().includes(query)
            )
            setFilteredTeachers(filtered)
        }
    }, [searchQuery, teachers])

    const fetchTeachers = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            const { data: roleData } = await supabase
                .from('user_roles')
                .select('school_id')
                .eq('user_id', user.id)
                .single()

            const { data } = await supabase
                .from('teacher_profiles')
                .select('*')
                .eq('school_id', roleData?.school_id)
                .order('full_name')

            setTeachers(data || [])
            setFilteredTeachers(data || [])
        } catch (error) {
            console.error('Error fetching teachers:', error)
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
                        placeholder="Search by name, email, phone, designation, or qualification..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
                {searchQuery && (
                    <p className="mt-2 text-sm text-gray-600">
                        Found {filteredTeachers.length} teacher{filteredTeachers.length !== 1 ? 's' : ''}
                    </p>
                )}
            </div>

            {/* Table */}
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Qualification</TableHead>
                        <TableHead>Designation</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {loading ? (
                        <TableRow>
                            <TableCell colSpan={5} className="h-24 text-center">
                                <Loader2 className="mx-auto h-6 w-6 animate-spin text-gray-400" />
                            </TableCell>
                        </TableRow>
                    ) : filteredTeachers.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="h-24 text-center text-gray-500">
                                {searchQuery ? 'No teachers match your search' : 'No teachers found'}
                            </TableCell>
                        </TableRow>
                    ) : (
                        filteredTeachers.map((teacher) => (
                            <TableRow key={teacher.id}>
                                <TableCell className="font-medium">{teacher.full_name}</TableCell>
                                <TableCell>{teacher.email}</TableCell>
                                <TableCell>{teacher.phone || '-'}</TableCell>
                                <TableCell>{teacher.qualification || '-'}</TableCell>
                                <TableCell>{teacher.designation || '-'}</TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
