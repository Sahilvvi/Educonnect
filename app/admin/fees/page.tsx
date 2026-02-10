'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { DollarSign, CreditCard, Plus, Loader2, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function FeeManagementPage() {
    const [loading, setLoading] = useState(true)
    const [structures, setStructures] = useState<any[]>([])
    const [classes, setClasses] = useState<any[]>([])
    const [createOpen, setCreateOpen] = useState(false)
    const [newFee, setNewFee] = useState({ name: '', amount: '', due_date: '', class_id: '' })

    // Stats (Mocked or real if table exists)
    const [stats, setStats] = useState({ collected: 0, pending: 0, expected: 0 })

    const supabase = createClient()

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            // Fetch Classes used for dropdown
            const { data: cls } = await supabase.from('classes').select('id, name, grade_level').order('name')
            setClasses(cls || [])

            // Fetch Fee Structures
            const { data: str } = await supabase
                .from('fee_structures')
                .select(`*, classes(name)`)
                .order('created_at', { ascending: false })
            setStructures(str || [])

            // Try Fetch stats (might fail if table doesn't exist)
            const { data: feeRecs, error } = await supabase.from('fee_records').select('amount, paid_amount')
            if (!error && feeRecs) {
                const exp = feeRecs.reduce((sum, r) => sum + (Number(r.amount) || 0), 0)
                const col = feeRecs.reduce((sum, r) => sum + (Number(r.paid_amount) || 0), 0)
                setStats({ expected: exp, collected: col, pending: exp - col })
            }

        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const handleCreateStructure = async () => {
        if (!newFee.name || !newFee.amount || !newFee.class_id) {
            toast.error('Please fill in required fields')
            return
        }

        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            const { data: roleData } = await supabase
                .from('user_roles')
                .select('school_id')
                .eq('user_id', user.id)
                .single()

            if (!roleData?.school_id) return

            const { error } = await supabase.from('fee_structures').insert({
                school_id: roleData.school_id,
                class_id: newFee.class_id,
                name: newFee.name,
                amount: parseFloat(newFee.amount),
                due_date: newFee.due_date || null
            })

            if (error) throw error

            toast.success('Fee structure created')
            setCreateOpen(false)
            setNewFee({ name: '', amount: '', due_date: '', class_id: '' })
            fetchData()

        } catch (error: any) {
            toast.error(error.message || 'Failed to create fee')
        }
    }

    return (
        <div className="container mx-auto p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Fee Management</h1>
                    <p className="text-gray-500">Manage invoices, collect payments, and track dues</p>
                </div>
                <div className="flex gap-2">
                    <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-indigo-600">
                                <Plus className="mr-2 h-4 w-4" />
                                Create Fee Structure
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>New Fee Structure</DialogTitle>
                                <DialogDescription>Define a standard fee for a class (e.g., Annual Tuition).</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label>Fee Name</Label>
                                    <Input
                                        placeholder="e.g. Term 1 Tuition"
                                        value={newFee.name}
                                        onChange={(e) => setNewFee({ ...newFee, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Applicable Class</Label>
                                    <Select onValueChange={(val) => setNewFee({ ...newFee, class_id: val })}>
                                        <SelectTrigger><SelectValue placeholder="Select Class" /></SelectTrigger>
                                        <SelectContent>
                                            {classes.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Amount ($)</Label>
                                        <Input
                                            type="number"
                                            value={newFee.amount}
                                            onChange={(e) => setNewFee({ ...newFee, amount: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Due Date</Label>
                                        <Input
                                            type="date"
                                            value={newFee.due_date}
                                            onChange={(e) => setNewFee({ ...newFee, due_date: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button onClick={handleCreateStructure}>Save Structure</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Collected</CardTitle>
                        <DollarSign className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">${stats.collected.toLocaleString()}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Dues</CardTitle>
                        <CreditCard className="h-4 w-4 text-red-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">${stats.pending.toLocaleString()}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Expected</CardTitle>
                        <DollarSign className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">${stats.expected.toLocaleString()}</div>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="structures">
                <TabsList>
                    <TabsTrigger value="structures">Fee Structures</TabsTrigger>
                    <TabsTrigger value="history">Transaction History</TabsTrigger>
                </TabsList>
                <TabsContent value="structures" className="mt-4">
                    <div className="bg-white rounded-lg shadow border overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Fee Name</TableHead>
                                    <TableHead>Class</TableHead>
                                    <TableHead>Due Date</TableHead>
                                    <TableHead className="text-right">Amount</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {structures.length === 0 ? (
                                    <TableRow><TableCell colSpan={4} className="text-center py-8 text-gray-400">No fee structures defined.</TableCell></TableRow>
                                ) : (
                                    structures.map(f => (
                                        <TableRow key={f.id}>
                                            <TableCell className="font-medium">{f.name}</TableCell>
                                            <TableCell>{f.classes?.name || 'All'}</TableCell>
                                            <TableCell>{f.due_date ? new Date(f.due_date).toLocaleDateString() : 'N/A'}</TableCell>
                                            <TableCell className="text-right font-bold text-gray-700">${f.amount}</TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody> // Closing tag fixed in logical thought, applied here
                        </Table>
                    </div>
                </TabsContent>
                <TabsContent value="history">
                    <div className="p-8 text-center text-gray-500 border rounded-lg bg-gray-50">
                        Transaction history will appear here once payments are recorded.
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
