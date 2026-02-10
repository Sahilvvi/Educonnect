'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CalendarDays, AlertTriangle, UserCheck, BarChart, ArrowRight, CheckCircle2 } from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function AttendancePage() {
    const [classes, setClasses] = useState<any[]>([])
    const [selectedClass, setSelectedClass] = useState('')
    const [loading, setLoading] = useState(true)
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        fetchClasses()
    }, [])

    const fetchClasses = async () => {
        try {
            const { data, error } = await supabase
                .from('classes')
                .select('id, name, grade_level')
                .order('name')

            if (error) throw error
            setClasses(data || [])
        } catch (error) {
            console.error('Error fetching classes:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleStartMarking = () => {
        if (!selectedClass) {
            toast.error('Please select a class first')
            return
        }
        router.push(`/admin/attendance/${selectedClass}`)
    }

    return (
        <div className="container mx-auto p-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Attendance Management</h1>
                    <p className="text-gray-500">Track and manage student and staff attendance</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => router.push('/admin/reports')}>
                        <BarChart className="mr-2 h-4 w-4" />
                        Reports
                    </Button>

                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className="bg-indigo-600 hover:bg-indigo-700">
                                <UserCheck className="mr-2 h-4 w-4" />
                                Mark Today's Attendance
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Select Class</DialogTitle>
                                <DialogDescription>Choose a class to mark attendance for today.</DialogDescription>
                            </DialogHeader>
                            <div className="py-4">
                                <Select value={selectedClass} onValueChange={setSelectedClass}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a class..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {classes.map((cls) => (
                                            <SelectItem key={cls.id} value={cls.id}>
                                                {cls.name} (Grade {cls.grade_level})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button onClick={handleStartMarking} className="w-full">
                                Continue
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Today's Presence</CardTitle>
                        <UserCheck className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-700">92%</div>
                        <p className="text-xs text-muted-foreground">+2% from yesterday</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Absentee Alerts</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">12</div>
                        <p className="text-xs text-muted-foreground">Notifications sent to parents</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Average (This Month)</CardTitle>
                        <BarChart className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-700">88.5%</div>
                        <p className="text-xs text-muted-foreground">Consistent trend</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>Latest attendance submissions</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {[1, 2, 3].map((_, i) => (
                            <div key={i} className="flex items-center justify-between border-b pb-2 last:border-0">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                        <CheckCircle2 className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">Class 10-A Attendance Marked</p>
                                        <p className="text-xs text-gray-500">By Sarah Wilson • 10 mins ago</p>
                                    </div>
                                </div>
                                <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">100%</span>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-indigo-50 to-white">
                    <CardHeader>
                        <CardTitle>Attendance Rules</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2 text-sm text-gray-600 list-disc list-inside">
                            <li>Late arrival threshold is <strong>09:15 AM</strong>.</li>
                            <li>SMS alerts sent automatically at <strong>10:00 AM</strong>.</li>
                            <li>Consecutive 3-day absence triggers Admin Alert.</li>
                        </ul>
                        <Button variant="link" className="px-0 mt-4 text-indigo-600">Configure Rules &rarr;</Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
