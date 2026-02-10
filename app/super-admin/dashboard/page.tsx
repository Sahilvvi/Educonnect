'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { School, Users, DollarSign, TrendingUp, Loader2 } from 'lucide-react'

export default function SuperAdminDashboard() {
    const [counts, setCounts] = useState({
        schools: 0,
        users: 0,
        revenue: 0
    })
    const [isLoading, setIsLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Schools Count
                const { count: schoolsCount } = await supabase
                    .from('schools')
                    .select('*', { count: 'exact', head: true })

                // 2. Users Count
                const { count: parentsCount } = await supabase
                    .from('parent_profiles')
                    .select('*', { count: 'exact', head: true })

                const { count: teachersCount } = await supabase
                    .from('teacher_profiles')
                    .select('*', { count: 'exact', head: true })

                // Mock revenue calc
                const revenue = (schoolsCount || 0) * 100

                setCounts({
                    schools: schoolsCount || 0,
                    users: (parentsCount || 0) + (teachersCount || 0),
                    revenue
                })
            } catch (error) {
                console.error('Error fetching dashboard stats:', error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchData()
    }, [])

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-full min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-red-600" />
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Platform Overview</h1>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Schools</CardTitle>
                        <School className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{counts.schools}</div>
                        <p className="text-xs text-muted-foreground">Registered tenants</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{counts.users}</div>
                        <p className="text-xs text-muted-foreground">Parents & Teachers</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${counts.revenue}</div>
                        <p className="text-xs text-muted-foreground">Est. MRR</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Platform Health</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">100%</div>
                        <p className="text-xs text-muted-foreground">System Operational</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
