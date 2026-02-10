'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from '@/components/ui/dialog'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Loader2, Plus, BookOpen, Users, GraduationCap } from 'lucide-react'
import { toast } from 'sonner'

export default function ClassesPage() {
    const [classes, setClasses] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [newClass, setNewClass] = useState({
        name: '',
        grade_level: '',
        section: '',
        room_number: '',
        capacity: ''
    })

    const supabase = createClient()

    useEffect(() => {
        fetchClasses()
    }, [])

    const fetchClasses = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            const { data: roleData } = await supabase
                .from('user_roles')
                .select('school_id')
                .eq('user_id', user.id)
                .single()

            const { data } = await supabase
                .from('classes')
                .select(`
                    *,
                    students (count)
                `)
                .eq('school_id', roleData?.school_id)
                .order('grade_level, name')

            setClasses(data || [])
        } catch (error) {
            console.error('Error fetching classes:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleCreateClass = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            const { data: roleData } = await supabase
                .from('user_roles')
                .select('school_id')
                .eq('user_id', user.id)
                .single()

            const { error } = await supabase
                .from('classes')
                .insert([{
                    school_id: roleData?.school_id,
                    name: newClass.name,
                    grade_level: parseInt(newClass.grade_level),
                    section: newClass.section,
                    room_number: newClass.room_number,
                    capacity: parseInt(newClass.capacity)
                }])

            if (error) throw error

            toast.success('Class created successfully')
            setIsDialogOpen(false)
            setNewClass({ name: '', grade_level: '', section: '', room_number: '', capacity: '' })
            fetchClasses()
        } catch (error: any) {
            toast.error(error.message || 'Failed to create class')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Classes Management</h1>
                    <p className="text-gray-500">Manage school classes and sections</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-blue-600 hover:bg-blue-700">
                            <Plus className="mr-2 h-4 w-4" /> Add Class
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create New Class</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleCreateClass} className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Class Name</Label>
                                <Input
                                    id="name"
                                    placeholder="e.g., Grade 5 - A"
                                    value={newClass.name}
                                    onChange={(e) => setNewClass({ ...newClass, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="grade">Grade Level</Label>
                                    <Input
                                        id="grade"
                                        type="number"
                                        min="1"
                                        max="12"
                                        placeholder="5"
                                        value={newClass.grade_level}
                                        onChange={(e) => setNewClass({ ...newClass, grade_level: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="section">Section</Label>
                                    <Input
                                        id="section"
                                        placeholder="A"
                                        value={newClass.section}
                                        onChange={(e) => setNewClass({ ...newClass, section: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="room">Room Number</Label>
                                    <Input
                                        id="room"
                                        placeholder="101"
                                        value={newClass.room_number}
                                        onChange={(e) => setNewClass({ ...newClass, room_number: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="capacity">Capacity</Label>
                                    <Input
                                        id="capacity"
                                        type="number"
                                        min="1"
                                        placeholder="40"
                                        value={newClass.capacity}
                                        onChange={(e) => setNewClass({ ...newClass, capacity: e.target.value })}
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit" disabled={isSubmitting} className="w-full">
                                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                    Create Class
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{classes.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                        <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {classes.reduce((sum, cls) => sum + (cls.students?.[0]?.count || 0), 0)}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg Class Size</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {classes.length > 0
                                ? Math.round(classes.reduce((sum, cls) => sum + (cls.students?.[0]?.count || 0), 0) / classes.length)
                                : 0}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Classes Table */}
            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Class Name</TableHead>
                                <TableHead>Grade</TableHead>
                                <TableHead>Section</TableHead>
                                <TableHead>Room</TableHead>
                                <TableHead>Students</TableHead>
                                <TableHead>Capacity</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-24 text-center">
                                        <Loader2 className="mx-auto h-6 w-6 animate-spin text-gray-400" />
                                    </TableCell>
                                </TableRow>
                            ) : classes.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-24 text-center text-gray-500">
                                        No classes found. Create your first class to get started.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                classes.map((cls) => {
                                    const studentCount = cls.students?.[0]?.count || 0
                                    const capacity = cls.capacity || 0
                                    const utilizationPercent = capacity > 0 ? (studentCount / capacity) * 100 : 0

                                    return (
                                        <TableRow key={cls.id}>
                                            <TableCell className="font-medium">{cls.name}</TableCell>
                                            <TableCell>{cls.grade_level}</TableCell>
                                            <TableCell>{cls.section}</TableCell>
                                            <TableCell>{cls.room_number || '-'}</TableCell>
                                            <TableCell>{studentCount}</TableCell>
                                            <TableCell>{capacity || '-'}</TableCell>
                                            <TableCell>
                                                <Badge
                                                    className={
                                                        utilizationPercent >= 90
                                                            ? 'bg-red-100 text-red-800'
                                                            : utilizationPercent >= 75
                                                                ? 'bg-yellow-100 text-yellow-800'
                                                                : 'bg-green-100 text-green-800'
                                                    }
                                                >
                                                    {utilizationPercent >= 90 ? 'Full' : utilizationPercent >= 75 ? 'Near Capacity' : 'Available'}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
