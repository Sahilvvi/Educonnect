'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import {
    LayoutDashboard,
    Users,
    Shield,
    BarChart3,
    School,
    Settings,
    LogOut,
    Menu,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export function SuperAdminNavbar({ userName = 'Super Admin' }: { userName?: string }) {
    const pathname = usePathname()
    const router = useRouter()
    const supabase = createClient()
    const [isOpen, setIsOpen] = useState(false)

    const handleLogout = async () => {
        await supabase.auth.signOut()
        toast.success('Signed out successfully')
        router.push('/login')
    }

    const navItems = [
        {
            name: 'Overview',
            href: '/super-admin/dashboard',
            icon: LayoutDashboard,
        },
        {
            name: 'Schools',
            href: '/super-admin/schools',
            icon: School,
        },
        {
            name: 'Users',
            href: '/super-admin/users',
            icon: Users,
        },
        {
            name: 'Access Control',
            href: '/super-admin/access',
            icon: Shield,
        },
        {
            name: 'Analytics',
            href: '/super-admin/analytics',
            icon: BarChart3,
        },
    ]

    return (
        <nav className="bg-white border-b sticky top-0 z-50 shadow-sm">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/super-admin/dashboard" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-rose-600 rounded-lg flex items-center justify-center text-white font-bold">
                            <Shield className="h-5 w-5" />
                        </div>
                        <span className="text-xl font-bold hidden sm:block bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
                            Super Admin
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-6">
                        {navItems.map((item) => {
                            const Icon = item.icon
                            const isActive = pathname.startsWith(item.href)
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-2 text-sm font-medium transition-colors ${isActive
                                            ? 'text-red-600'
                                            : 'text-gray-600 hover:text-red-600'
                                        }`}
                                >
                                    <Icon className="h-4 w-4" />
                                    {item.name}
                                </Link>
                            )
                        })}
                    </div>

                    {/* User Menu */}
                    <div className="flex items-center gap-4">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                                    <Avatar>
                                        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${userName}`} />
                                        <AvatarFallback>SA</AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end">
                                <DropdownMenuLabel>
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">{userName}</p>
                                        <p className="text-xs leading-none text-muted-foreground">Platform Owner</p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href="/super-admin/settings" className="cursor-pointer">
                                        <Settings className="mr-2 h-4 w-4" />
                                        <span>Settings</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600 cursor-pointer" onClick={handleLogout}>
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Log out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* Mobile Menu */}
                        <div className="md:hidden">
                            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        <Menu className="h-6 w-6" />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="right">
                                    <div className="flex flex-col gap-6 mt-6">
                                        {navItems.map((item) => {
                                            const Icon = item.icon
                                            const isActive = pathname.startsWith(item.href)
                                            return (
                                                <Link
                                                    key={item.href}
                                                    href={item.href}
                                                    onClick={() => setIsOpen(false)}
                                                    className={`flex items-center gap-3 text-lg font-medium p-2 rounded-md ${isActive
                                                            ? 'bg-red-50 text-red-600'
                                                            : 'text-gray-600 hover:text-red-600'
                                                        }`}
                                                >
                                                    <Icon className="h-5 w-5" />
                                                    {item.name}
                                                </Link>
                                            )
                                        })}
                                        <Button
                                            variant="ghost"
                                            className="justify-start text-red-600 gap-3 p-2"
                                            onClick={handleLogout}
                                        >
                                            <LogOut className="h-5 w-5" />
                                            Log out
                                        </Button>
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    )
}
