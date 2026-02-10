'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
    LayoutDashboard,
    GraduationCap,
    Users,
    School,
    CreditCard,
    Settings,
    LogOut,
    Building2,
    CalendarDays,
    BookOpenCheck,
    Megaphone,
    FileBarChart,
    UserCheck,
    ScrollText
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { ScrollArea } from '@/components/ui/scroll-area'

export function SchoolAdminSidebar({ userName = 'Admin' }: { userName?: string }) {
    const pathname = usePathname()
    const router = useRouter()
    const supabase = createClient()

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/login')
    }

    const navSections = [
        {
            title: 'Core',
            items: [
                { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
                { name: 'School Profile', href: '/admin/school-profile', icon: Building2 }, // Module 1
                { name: 'Calendar', href: '/admin/calendar', icon: CalendarDays }, // Module 9
            ]
        },
        {
            title: 'People',
            items: [
                { name: 'Students (SIS)', href: '/admin/students', icon: GraduationCap }, // Module 2
                { name: 'Teachers & Staff', href: '/admin/teachers', icon: Users }, // Module 3
            ]
        },
        {
            title: 'Academics',
            items: [
                { name: 'Attendance', href: '/admin/attendance', icon: UserCheck }, // Module 4
                { name: 'Academics & Exams', href: '/admin/academics', icon: ScrollText }, // Module 5
                { name: 'Homework', href: '/admin/homework', icon: BookOpenCheck }, // Module 7
                { name: 'Classes & Timetable', href: '/admin/classes', icon: School },
            ]
        },
        {
            title: 'Operations',
            items: [
                { name: 'Communication', href: '/admin/communication', icon: Megaphone }, // Module 6
                { name: 'Fee Management', href: '/admin/fees', icon: CreditCard }, // Module 8
                { name: 'Reports & Analytics', href: '/admin/reports', icon: FileBarChart }, // Module 10
            ]
        }
    ]

    return (
        <div className="flex h-screen w-64 flex-col bg-indigo-950 text-white border-r border-indigo-900">
            {/* Logo */}
            <div className="flex h-16 items-center gap-2 px-6 bg-indigo-950 border-b border-indigo-900">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 shadow-lg shadow-indigo-600/20">
                    <Building2 className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-bold tracking-tight">EduConnect</span>
            </div>

            {/* User Info */}
            <div className="px-6 py-6 bg-indigo-900/30">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center text-lg font-semibold border-2 border-indigo-400 shadow-sm">
                        {userName.charAt(0)}
                    </div>
                    <div className="overflow-hidden">
                        <p className="truncate text-sm font-medium text-white">{userName}</p>
                        <p className="text-xs text-indigo-300">School Administrator</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <ScrollArea className="flex-1 px-3 py-4">
                <div className="space-y-6">
                    {navSections.map((section, idx) => (
                        <div key={idx}>
                            <h4 className="mb-2 px-3 text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                                {section.title}
                            </h4>
                            <div className="space-y-1">
                                {section.items.map((item) => {
                                    const Icon = item.icon
                                    const isActive = pathname.startsWith(item.href)
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={cn(
                                                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200',
                                                isActive
                                                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/20'
                                                    : 'text-indigo-200 hover:bg-indigo-800/50 hover:text-white'
                                            )}
                                        >
                                            <Icon className={cn("h-4 w-4 transition-colors", isActive ? "text-white" : "text-indigo-300")} />
                                            {item.name}
                                        </Link>
                                    )
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-indigo-900 bg-indigo-950">
                <Link
                    href="/admin/settings"
                    className={cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors mb-1',
                        pathname === '/admin/settings' ? 'bg-indigo-800 text-white' : 'text-indigo-300 hover:text-white hover:bg-indigo-900'
                    )}
                >
                    <Settings className="h-4 w-4" />
                    Settings
                </Link>
                <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-950/20 transition-colors"
                >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                </button>
            </div>
        </div>
    )
}
