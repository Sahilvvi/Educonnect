'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
    GraduationCap,
    Bell,
    Settings,
    LogOut,
    Menu,
    X,
    User,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

interface ParentNavbarProps {
    parentName?: string
    parentEmail?: string
}

export function ParentNavbar({ parentName = 'Parent', parentEmail }: ParentNavbarProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const handleLogout = async () => {
        await supabase.auth.signOut()
        toast.success('Logged out successfully')
        router.push('/login')
    }

    return (
        <nav className="bg-white border-b sticky top-0 z-50 shadow-sm">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/parent/dashboard" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                            <GraduationCap className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-xl font-bold hidden sm:block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            EduConnect
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-6">
                        <Link
                            href="/parent/dashboard"
                            className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
                        >
                            Dashboard
                        </Link>
                        <Link
                            href="/parent/messages"
                            className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
                        >
                            Messages
                        </Link>
                        <Link
                            href="/parent/announcements"
                            className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
                        >
                            Announcements
                        </Link>
                        <Link
                            href="/parent/notifications"
                            className="text-gray-700 hover:text-blue-600 transition-colors font-medium relative"
                        >
                            <Bell className="h-5 w-5" />
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                                3
                            </span>
                        </Link>
                    </div>

                    {/* User Menu */}
                    <div className="hidden md:flex items-center gap-3">
                        <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
                            <User className="h-4 w-4 text-gray-600" />
                            <span className="text-sm font-medium text-gray-700">
                                {parentName}
                            </span>
                        </div>
                        <Button variant="ghost" size="icon" asChild>
                            <Link href="/parent/settings">
                                <Settings className="h-5 w-5" />
                            </Link>
                        </Button>
                        <Button variant="ghost" size="icon" onClick={handleLogout}>
                            <LogOut className="h-5 w-5" />
                        </Button>
                    </div>

                    {/* Mobile Menu Button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? (
                            <X className="h-6 w-6" />
                        ) : (
                            <Menu className="h-6 w-6" />
                        )}
                    </Button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden py-4 border-t">
                        <div className="flex flex-col gap-4">
                            <Link
                                href="/parent/dashboard"
                                className="text-gray-700 hover:text-blue-600 transition-colors font-medium px-4 py-2"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Dashboard
                            </Link>
                            <Link
                                href="/parent/messages"
                                className="text-gray-700 hover:text-blue-600 transition-colors font-medium px-4 py-2"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Messages
                            </Link>
                            <Link
                                href="/parent/announcements"
                                className="text-gray-700 hover:text-blue-600 transition-colors font-medium px-4 py-2"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Announcements
                            </Link>
                            <Link
                                href="/parent/notifications"
                                className="text-gray-700 hover:text-blue-600 transition-colors font-medium px-4 py-2 flex items-center gap-2"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <Bell className="h-5 w-5" />
                                Notifications
                                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                                    3
                                </span>
                            </Link>
                            <div className="border-t pt-4 px-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <User className="h-4 w-4 text-gray-600" />
                                    <span className="text-sm font-medium text-gray-700">
                                        {parentName}
                                    </span>
                                </div>
                                <Button variant="outline" className="w-full mb-2" asChild>
                                    <Link href="/parent/settings">
                                        <Settings className="h-4 w-4 mr-2" />
                                        Settings
                                    </Link>
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full"
                                    onClick={handleLogout}
                                >
                                    <LogOut className="h-4 w-4 mr-2" />
                                    Logout
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    )
}
