'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
    LayoutDashboard,
    School,
    Users,
    Shield,
    BarChart3,
    LogOut,
    User,
    Settings,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

const sidebarItems = [
    {
        title: 'Overview',
        href: '/super-admin/dashboard',
        icon: LayoutDashboard,
    },
    {
        title: 'Manage Schools',
        href: '/super-admin/schools',
        icon: School,
    },
    {
        title: 'All Users',
        href: '/super-admin/users',
        icon: Users,
    },
    {
        title: 'Access Control',
        href: '/super-admin/access',
        icon: Shield,
    },
    {
        title: 'Analytics',
        href: '/super-admin/analytics',
        icon: BarChart3,
    },
]

const accountItems = [
    {
        title: 'My Profile',
        href: '/super-admin/profile',
        icon: User,
    },
    {
        title: 'Settings',
        href: '/super-admin/settings',
        icon: Settings,
    },
]

export function SuperAdminSidebar() {
    const pathname = usePathname()
    const router = useRouter()
    const supabase = createClient()

    const handleLogout = async () => {
        await supabase.auth.signOut()
        toast.success('Signed out successfully')
        router.push('/login')
    }

    const NavGroup = ({ items, label }: { items: any[], label?: string }) => (
        <div className="mb-4">
            {label && (
                <h4 className="mb-2 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {label}
                </h4>
            )}
            <div className="space-y-1">
                {items.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                                isActive
                                    ? 'bg-red-50 text-red-600 shadow-sm'
                                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                            )}
                        >
                            <Icon className="h-4 w-4" />
                            {item.title}
                        </Link>
                    )
                })}
            </div>
        </div>
    )

    return (
        <div className="flex h-full w-64 flex-col bg-white border-r">
            {/* Logo/Header */}
            <div className="flex h-16 items-center border-b px-6 mb-4">
                <Link href="/super-admin/dashboard" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-rose-600 rounded-lg flex items-center justify-center">
                        <Shield className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-lg font-bold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
                        Super Admin
                    </span>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 overflow-y-auto">
                <NavGroup items={sidebarItems} label="Menu" />
                <div className="my-4 border-t border-gray-100" />
                <NavGroup items={accountItems} label="Account" />
            </nav>

            {/* Logout Button */}
            <div className="border-t p-4">
                <Button
                    variant="ghost"
                    className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700"
                    onClick={handleLogout}
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                </Button>
            </div>
        </div>
    )
}
