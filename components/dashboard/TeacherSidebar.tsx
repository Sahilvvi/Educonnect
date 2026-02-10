'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
    LayoutDashboard,
    CalendarCheck,
    BookOpen,
    Users,
    MessageSquare,
    Bell,
    LogOut,
    Settings,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'

interface TeacherSidebarProps {
    teacherName?: string
    teacherEmail?: string
}

export function TeacherSidebar({ teacherName, teacherEmail }: TeacherSidebarProps) {
    const pathname = usePathname()
    const router = useRouter()
    const supabase = createClient()

    const handleLogout = async () => {
        await supabase.auth.signOut()
        toast.success('Signed out successfully')
        router.push('/login')
    }

    const navItems = [
        { name: 'Overview', href: '/teacher/dashboard', icon: LayoutDashboard },
        { name: 'Attendance', href: '/teacher/attendance', icon: CalendarCheck },
        { name: 'Assignments', href: '/teacher/homework', icon: BookOpen },
        { name: 'My Students', href: '/teacher/students', icon: Users },
        { name: 'Messages', href: '/teacher/messages', icon: MessageSquare },
        { name: 'Announcements', href: '/teacher/announcements', icon: Bell },
    ]

    return (
        <div className="flex h-screen w-72 flex-col bg-slate-900 text-slate-100 border-r border-slate-800">
            {/* Logo Area */}
            <div className="flex h-20 items-center px-6 border-b border-slate-800">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-900/20">
                        <BookOpen className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-white tracking-tight">Teacher Portal</h1>
                        <p className="text-xs text-slate-400">EduConnect</p>
                    </div>
                </div>
            </div>

            {/* Profile Summary (Compact) */}
            <div className="px-4 py-6">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                    <Avatar className="h-10 w-10 border-2 border-slate-700">
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${teacherName}`} />
                        <AvatarFallback>T</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{teacherName}</p>
                        <p className="text-xs text-slate-400 truncate">{teacherEmail}</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <ScrollArea className="flex-1 px-4">
                <div className="space-y-1.5">
                    {navItems.map((item) => {
                        const Icon = item.icon
                        const isActive = pathname.startsWith(item.href)
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    'flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 group',
                                    isActive
                                        ? 'bg-blue-600 text-white shadow-md shadow-blue-900/20'
                                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                )}
                            >
                                <Icon className={cn("h-5 w-5 transition-colors", isActive ? "text-white" : "text-slate-500 group-hover:text-white")} />
                                {item.name}
                            </Link>
                        )
                    })}
                </div>
            </ScrollArea>

            {/* Footer / Logout */}
            <div className="p-4 border-t border-slate-800 space-y-2">
                <Link
                    href="/teacher/settings"
                    className={cn(
                        'flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-colors',
                        pathname === '/teacher/settings' && 'bg-slate-800 text-white'
                    )}
                >
                    <Settings className="h-4 w-4" />
                    Settings
                </Link>
                <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-red-400 hover:bg-red-950/30 hover:text-red-300 transition-colors"
                >
                    <LogOut className="h-4 w-4" />
                    Log Out
                </button>
            </div>
        </div>
    )
}
