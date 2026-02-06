import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AdminNavbar } from '@/components/dashboard/AdminNavbar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DollarSign, CreditCard, AlertCircle, Plus } from 'lucide-react'
import Link from 'next/link'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'

export default async function AdminFeesPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    // Fetch fee stats
    // Note: Assuming we have fee_records table. If not, this will error in development, 
    // but code is correct per schema.

    // Total Expected
    const { data: feeRecords } = await supabase
        .from('fee_records')
        .select('amount, paid_amount, status')

    const totalExpected = feeRecords?.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0) || 0
    const totalCollected = feeRecords?.reduce((acc, curr) => acc + (Number(curr.paid_amount) || 0), 0) || 0
    const pendingAmount = totalExpected - totalCollected

    // Recent Payments
    const { data: recentPayments } = await supabase
        .from('payment_records')
        .select(`
            *,
            fee_records (
                students ( name )
            )
        `)
        .order('payment_date', { ascending: false })
        .limit(5)

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <AdminNavbar />

            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Fee Management</h1>
                    <div className="flex gap-2">
                        <Button asChild variant="outline">
                            <Link href="/admin/fees/types">
                                Manage Fee Structures
                            </Link>
                        </Button>
                        <Button asChild>
                            <Link href="/admin/fees/create">
                                <Plus className="mr-2 h-4 w-4" />
                                Create Invoice
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Collected</CardTitle>
                            <DollarSign className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">${totalCollected.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground">Year to date</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pending Dues</CardTitle>
                            <AlertCircle className="h-4 w-4 text-red-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">${pendingAmount.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground">Unpaid invoices</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Projected Revenue</CardTitle>
                            <CreditCard className="h-4 w-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-600">${totalExpected.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground">Total invoiced</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Transactions */}
                <div className="bg-white rounded-lg shadow border overflow-hidden">
                    <div className="p-4 border-b">
                        <h3 className="font-semibold text-gray-900">Recent Payments</h3>
                    </div>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Student</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Method</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {recentPayments?.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center text-gray-500 py-8">
                                        No recent payments found
                                    </TableCell>
                                </TableRow>
                            )}
                            {recentPayments?.map((payment) => (
                                <TableRow key={payment.id}>
                                    <TableCell className="font-medium">
                                        {payment.fee_records?.students?.name || 'Unknown'}
                                    </TableCell>
                                    <TableCell>{new Date(payment.payment_date).toLocaleDateString()}</TableCell>
                                    <TableCell className="capitalize">{payment.payment_method}</TableCell>
                                    <TableCell className="text-right font-medium text-green-600">
                                        +${payment.amount}
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
