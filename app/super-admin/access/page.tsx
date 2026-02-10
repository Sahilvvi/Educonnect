'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
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
import { Loader2, Plus, Shield, Key } from 'lucide-react'
import { toast } from 'sonner'
import { Label } from '@/components/ui/label'

const PERMISSIONS = [
    { key: 'manage_schools', label: 'Manage Schools', description: 'Create, edit, and delete schools' },
    { key: 'manage_users', label: 'Manage Users', description: 'Create and manage user accounts' },
    { key: 'view_analytics', label: 'View Analytics', description: 'Access platform analytics' },
    { key: 'manage_settings', label: 'Manage Settings', description: 'Configure system settings' },
    { key: 'manage_fees', label: 'Manage Fees', description: 'Configure and view fee structures' },
    { key: 'manage_attendance', label: 'Manage Attendance', description: 'Configure attendance rules' },
]

interface Role {
    id: string
    role: string
    school_id: string | null
    schools?: { name: string }
    user_id: string
}

export default function AccessPage() {
    const [roles, setRoles] = useState<Role[]>([])
    const [loading, setLoading] = useState(true)
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const supabase = createClient()

    useEffect(() => {
        fetchRoles()
    }, [])

    const fetchRoles = async () => {
        try {
            const { data } = await supabase
                .from('user_roles')
                .select(`
                    *,
                    schools (
                        name
                    )
                `)
                .in('role', ['super_admin', 'admin'])
                .order('created_at', { ascending: false })

            setRoles(data || [])
        } catch (error) {
            console.error('Error fetching roles:', error)
            toast.error('Failed to load access control data')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Access Control</h1>
                    <p className="text-gray-500">Manage permissions and access levels</p>
                </div>
            </div>

            {/* Permissions Matrix */}
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Key className="h-5 w-5" />
                        Platform Permissions
                    </CardTitle>
                    <CardDescription>
                        Overview of available permission levels
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {PERMISSIONS.map((perm) => (
                            <div key={perm.key} className="flex items-start gap-4 p-4 border rounded-lg">
                                <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                                <div className="flex-1">
                                    <h4 className="font-medium text-gray-900">{perm.label}</h4>
                                    <p className="text-sm text-muted-foreground">{perm.description}</p>
                                </div>
                                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                                    Super Admin
                                </Badge>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Admin Roles */}
            <Card>
                <CardHeader>
                    <CardTitle>Administrative Roles</CardTitle>
                    <CardDescription>Users with elevated access permissions</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User ID</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>School</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center">
                                        <Loader2 className="mx-auto h-6 w-6 animate-spin text-gray-400" />
                                    </TableCell>
                                </TableRow>
                            ) : roles.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center text-gray-500">
                                        No administrative roles found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                roles.map((role) => (
                                    <TableRow key={role.id}>
                                        <TableCell className="font-mono text-xs">
                                            {role.user_id.substring(0, 8)}...
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className={
                                                    role.role === 'super_admin'
                                                        ? 'bg-purple-100 text-purple-800 border-purple-200'
                                                        : 'bg-blue-100 text-blue-800 border-blue-200'
                                                }
                                            >
                                                <Shield className="h-3 w-3 mr-1" />
                                                {role.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {role.schools?.name || (
                                                <span className="text-muted-foreground text-sm">Global</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Badge className="bg-green-100 text-green-800">
                                                Active
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Info Card */}
            <Card className="mt-6 bg-blue-50 border-blue-200">
                <CardHeader>
                    <CardTitle className="text-blue-900 text-base">About Access Control</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-2 text-sm text-blue-800">
                        <li className="flex items-start gap-2">
                            <Shield className="h-4 w-4 mt-0.5" />
                            <span><strong>Super Admins</strong> have full platform access across all schools</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <Shield className="h-4 w-4 mt-0.5" />
                            <span><strong>Admins</strong> have full access within their assigned school(s)</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <Shield className="h-4 w-4 mt-0.5" />
                            <span><strong>Teachers</strong> can manage their assigned classes and students</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <Shield className="h-4 w-4 mt-0.5" />
                            <span><strong>Parents</strong> can view their children's information only</span>
                        </li>
                    </ul>
                </CardContent>
            </Card>
        </div>
    )
}
