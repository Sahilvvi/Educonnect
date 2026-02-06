import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ParentNavbar } from '@/components/dashboard/ParentNavbar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, CheckCircle2, DollarSign, Clock } from 'lucide-react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

export default async function ParentFeesPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const { data: profile } = await supabase
        .from('parent_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

    // Get linked students
    const { data: mappings } = await supabase
        .from('parent_student_mapping')
        .select('student_id')
        .eq('parent_id', profile.id)

    const studentIds = mappings?.map(m => m.student_id) || []

    // Fetch fee records for all children
    const { data: fees } = await supabase
        .from('fee_records')
        .select(`
            *,
            students ( name ),
            fee_types ( name )
        `)
        .in('student_id', studentIds)
        .order('due_date', { ascending: false })

    const totalDue = fees?.filter((f: any) => f.status === 'pending')
        .reduce((acc: number, curr: any) => acc + (curr.amount - (curr.paid_amount || 0)), 0) || 0

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <ParentNavbar parentName={profile.full_name} parentEmail={user.email} />

            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">School Fees</h1>
                <p className="text-gray-600 mb-8">View and manage fee payments for your children</p>

                {/* Summary Card */}
                <div className="mb-8 max-w-sm">
                    <Card className={`${totalDue > 0 ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}`}>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                                <DollarSign className="h-4 w-4" />
                                Total Outstanding
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className={`text-3xl font-bold ${totalDue > 0 ? 'text-red-700' : 'text-green-700'}`}>
                                ${totalDue.toLocaleString()}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {totalDue > 0 ? 'Please clear details by due date' : 'All clear!'}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Fee List */}
                <div className="bg-white rounded-lg shadow border overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Student</TableHead>
                                <TableHead>Fee Type</TableHead>
                                <TableHead>Due Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {!fees?.length && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                                        No fee records found.
                                    </TableCell>
                                </TableRow>
                            )}
                            {fees?.map((fee: any) => (
                                <TableRow key={fee.id}>
                                    <TableCell className="font-medium">{fee.students?.name}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span>{fee.fee_types?.name || 'School Fee'}</span>
                                            <span className="text-xs text-muted-foreground">{fee.remarks}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-3 w-3 text-gray-400" />
                                            {new Date(fee.due_date).toLocaleDateString()}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={fee.status === 'paid' ? 'default' : 'destructive'}
                                            className={fee.status === 'paid' ? 'bg-green-600 hover:bg-green-700' : ''}>
                                            {fee.status === 'paid' ? (
                                                <span className="flex items-center gap-1">
                                                    <CheckCircle2 className="h-3 w-3" /> Paid
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1">
                                                    <AlertCircle className="h-3 w-3" /> Pending
                                                </span>
                                            )}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right font-bold">
                                        ${fee.amount}
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
