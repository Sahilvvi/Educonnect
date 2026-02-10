'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
    DialogFooter
} from '@/components/ui/dialog'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Loader2, Plus, UserPlus, Shield, Trash2, Mail } from 'lucide-react'
import { toast } from 'sonner'

interface User {
    id: string
    email: string
    created_at: string
    roles: any[]
    schools: any[]
}

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([])
    const [schools, setSchools] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [newUser, setNewUser] = useState({
        email: '',
        password: '',
        role: 'teacher',
        school_id: ''
    })
    const [isSubmitting, setIsSubmitting] = useState(false)

    const supabase = createClient()

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            // Fetch schools for dropdown
            const { data: schoolsData } = await supabase
                .from('schools')
                .select('id, name, code')
                .order('name')
            setSchools(schoolsData || [])

            // Fetch all user roles with user emails
            const { data: rolesData } = await supabase
                .from('user_roles')
                .select(`
                    user_id,
                    role,
                    school_id,
                    is_active,
                    created_at,
                    schools (
                        id,
                        name
                    )
                `)
                .order('created_at', { ascending: false })

            // Group by user_id
            const usersMap = new Map<string, any>()

            if (rolesData) {
                for (const role of rolesData) {
                    if (!usersMap.has(role.user_id)) {
                        usersMap.set(role.user_id, {
                            id: role.user_id,
                            email: '', // Will be fetched
                            created_at: role.created_at,
                            roles: [],
                            schools: []
                        })
                    }
                    const user = usersMap.get(role.user_id)
                    user.roles.push(role.role)
                    if (role.schools) {
                        user.schools.push(role.schools)
                    }
                }
            }

            setUsers(Array.from(usersMap.values()))
        } catch (error) {
            console.error('Error fetching users:', error)
            toast.error('Failed to load users')
        } finally {
            setLoading(false)
        }
    }

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            // Note: Creating users via Supabase Auth requires admin privileges
            // This is a placeholder - you'll need to implement server-side user creation
            // For now, we'll just create a role entry

            const { data: { user: currentUser } } = await supabase.auth.getUser()
            if (!currentUser) {
                toast.error('Not authenticated')
                return
            }

            // In production, you'd call a server function to create the auth user
            // For now, let's create a mock role entry
            toast.info('User creation requires server-side implementation')

            // Example of what would happen:
            // const { data, error } = await supabase.functions.invoke('create-user', {
            //     body: newUser
            // })

            setIsDialogOpen(false)
            setNewUser({ email: '', password: '', role: 'teacher', school_id: '' })

        } catch (error: any) {
            toast.error(error.message || 'Failed to create  user')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDeleteRole = async (userId: string, role: string) => {
        if (!confirm('Are you sure you want to remove this role?')) return

        try {
            const { error } = await supabase
                .from('user_roles')
                .delete()
                .eq('user_id', userId)
                .eq('role', role)

            if (error) throw error

            toast.success('Role removed successfully')
            fetchData()
        } catch (error: any) {
            toast.error(error.message || 'Failed to remove role')
        }
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
                    <p className="text-gray-500">Manage platform users and permissions</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-blue-600 hover:bg-blue-700">
                            <UserPlus className="mr-2 h-4 w-4" /> Add User
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create New User</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleCreateUser} className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="user@example.com"
                                    value={newUser.email}
                                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Temporary Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Min. 8 characters"
                                    value={newUser.password}
                                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                    required
                                    minLength={8}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="role">Role</Label>
                                <Select
                                    value={newUser.role}
                                    onValueChange={(value) => setNewUser({ ...newUser, role: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="admin">Admin</SelectItem>
                                        <SelectItem value="teacher">Teacher</SelectItem>
                                        <SelectItem value="parent">Parent</SelectItem>
                                        <SelectItem value="student">Student</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="school">School</Label>
                                <Select
                                    value={newUser.school_id}
                                    onValueChange={(value) => setNewUser({ ...newUser, school_id: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select school" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {schools.map((school) => (
                                            <SelectItem key={school.id} value={school.id}>
                                                {school.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <DialogFooter>
                                <Button type="submit" disabled={isSubmitting} className="w-full">
                                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                    Create User
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User ID</TableHead>
                                <TableHead>Roles</TableHead>
                                <TableHead>Schools</TableHead>
                                <TableHead>Created</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center">
                                        <Loader2 className="mx-auto h-6 w-6 animate-spin text-gray-400" />
                                    </TableCell>
                                </TableRow>
                            ) : users.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center text-gray-500">
                                        No users found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                users.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell className="font-mono text-xs">
                                            {user.id.substring(0, 8)}...
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-1 flex-wrap">
                                                {user.roles.map((role: string, idx: number) => (
                                                    <Badge key={idx} variant="outline">
                                                        <Shield className="h-3 w-3 mr-1" />
                                                        {role}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-1 flex-wrap">
                                                {user.schools.slice(0, 2).map((school: any, idx: number) => (
                                                    <Badge key={idx} className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                                                        {school?.name}
                                                    </Badge>
                                                ))}
                                                {user.schools.length > 2 && (
                                                    <Badge className="bg-gray-100 text-gray-600">
                                                        +{user.schools.length - 2}
                                                    </Badge>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-sm text-gray-500">
                                            {new Date(user.created_at).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                onClick={() => handleDeleteRole(user.id, user.roles[0])}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Card className="mt-6 bg-amber-50 border-amber-200">
                <CardHeader>
                    <CardTitle className="text-amber-900 flex items-center gap-2">
                        <Mail className="h-5 w-5" />
                        Note: User Creation
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-amber-800">
                        Creating new users requires server-side implementation with Supabase Admin API.
                        Currently, users can be created through the signup flow, and roles can be assigned here.
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
