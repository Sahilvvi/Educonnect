'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Loader2, Plus, Search, Building2 } from 'lucide-react'
import { toast } from 'sonner'
import { Label } from '@/components/ui/label'

interface School {
    id: string
    name: string
    code: string
    city: string
    state: string
    is_active: boolean
    created_at: string
}

export default function SchoolsManagementPage() {
    const [schools, setSchools] = useState<School[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [newSchool, setNewSchool] = useState({
        name: '',
        code: '',
        city: '',
        state: '',
    })
    const [isSubmitting, setIsSubmitting] = useState(false)

    const supabase = createClient()

    useEffect(() => {
        fetchSchools()
    }, [])

    const fetchSchools = async () => {
        try {
            const { data, error } = await supabase
                .from('schools')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error
            setSchools(data || [])
        } catch (error) {
            console.error('Error fetching schools:', error)
            toast.error('Failed to load schools')
        } finally {
            setIsLoading(false)
        }
    }

    const handleCreateSchool = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const { error } = await supabase
                .from('schools')
                .insert([
                    {
                        name: newSchool.name,
                        code: newSchool.code.toUpperCase(),
                        city: newSchool.city,
                        state: newSchool.state,
                        is_active: true,
                    }
                ])

            if (error) throw error

            toast.success('School created successfully')
            setIsDialogOpen(false)
            setNewSchool({ name: '', code: '', city: '', state: '' })
            fetchSchools() // Refresh list
        } catch (error: any) {
            toast.error(error.message || 'Failed to create school')
        } finally {
            setIsSubmitting(false)
        }
    }

    const filteredSchools = schools.filter(school =>
        school.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        school.code.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Manage Schools</h1>
                    <p className="text-gray-500">View and manage all tenant schools</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-blue-600 hover:bg-blue-700">
                            <Plus className="mr-2 h-4 w-4" /> Add School
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New School</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleCreateSchool} className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">School Name</Label>
                                <Input
                                    id="name"
                                    placeholder="e.g. Springfield High"
                                    value={newSchool.name}
                                    onChange={(e) => setNewSchool({ ...newSchool, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="code">School Code (Unique)</Label>
                                <Input
                                    id="code"
                                    placeholder="e.g. SPH2026"
                                    value={newSchool.code}
                                    onChange={(e) => setNewSchool({ ...newSchool, code: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="city">City</Label>
                                    <Input
                                        id="city"
                                        placeholder="New York"
                                        value={newSchool.city}
                                        onChange={(e) => setNewSchool({ ...newSchool, city: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="state">State</Label>
                                    <Input
                                        id="state"
                                        placeholder="NY"
                                        value={newSchool.state}
                                        onChange={(e) => setNewSchool({ ...newSchool, state: e.target.value })}
                                    />
                                </div>
                            </div>
                            <Button type="submit" className="w-full" disabled={isSubmitting}>
                                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                Create School Tenant
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="flex items-center mb-6 max-w-sm relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                    placeholder="Search schools..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="rounded-md border bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>School Name</TableHead>
                            <TableHead>Code</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Created At</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    <Loader2 className="mx-auto h-6 w-6 animate-spin text-gray-400" />
                                </TableCell>
                            </TableRow>
                        ) : filteredSchools.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center text-gray-500">
                                    No schools found. Create one to get started.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredSchools.map((school) => (
                                <TableRow key={school.id}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-2">
                                            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                                <Building2 className="h-4 w-4" />
                                            </div>
                                            {school.name}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="font-mono">
                                            {school.code}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{school.city}, {school.state}</TableCell>
                                    <TableCell>
                                        <Badge variant={school.is_active ? 'default' : 'destructive'} className={school.is_active ? "bg-green-600" : ""}>
                                            {school.is_active ? 'Active' : 'Inactive'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-gray-500">
                                        {new Date(school.created_at).toLocaleDateString()}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
