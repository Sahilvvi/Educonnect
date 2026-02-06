'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { GraduationCap, Loader2, Eye, EyeOff, Info } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { loginSchema, type LoginFormData } from '@/lib/validations/auth'
import { createClient } from '@/lib/supabase/client'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

function LoginForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    // Check if redirected from signup
    const justVerified = searchParams.get('verified') === 'false'

    const form = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    })

    const supabase = createClient()

    const onSubmit = async (data: LoginFormData) => {
        setIsLoading(true)

        try {
            // Login with email and password
            const { data: authData, error } = await supabase.auth.signInWithPassword({
                email: data.email,
                password: data.password,
            })

            if (error) {
                toast.error('Login failed', {
                    description: error.message === 'Invalid login credentials' ? 'Invalid email or password' : error.message,
                })
                return
            }

            if (authData.user) {
                toast.success('Login successful!', {
                    description: 'Finding your dashboard...',
                })

                // Auto-detect role by checking profiles
                const userId = authData.user.id

                // 1. Check Parent Profile
                const { data: parent } = await supabase
                    .from('parent_profiles')
                    .select('id')
                    .eq('user_id', userId)
                    .single()

                if (parent) {
                    router.push('/parent/dashboard')
                    return
                }

                // 2. Check Teacher Profile
                const { data: teacher } = await supabase
                    .from('teacher_profiles')
                    .select('id')
                    .eq('user_id', userId)
                    .single()

                if (teacher) {
                    router.push('/teacher/dashboard')
                    return
                }

                // 3. Check Student (This is tricky if students table lacks user_id, but per dashboard logic we used email)
                // Let's check matching email in students table
                const { data: student } = await supabase
                    .from('students')
                    .select('id')
                    .eq('email', authData.user.email)
                    .single()

                if (student) {
                    router.push('/student/dashboard')
                    return
                }

                // 4. Check Admin (Assuming admin has a profile or based on metadata/email domain?)
                // Attempt to check `user_roles` if it exists (Phase 2 plan mentioned it)
                const { data: roleData } = await supabase
                    .from('user_roles')
                    .select('role')
                    .eq('user_id', userId)
                    .single()

                if (roleData) {
                    if (roleData.role === 'admin') {
                        router.push('/admin/dashboard')
                        return
                    }
                    // Fallback for others if table exists
                }

                // Final Fallback: If no specific profile found, default to Parent or error
                router.push('/parent/dashboard')
            }
        } catch (error) {
            toast.error('Something went wrong', {
                description: 'Please try again later.',
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card className="w-full max-w-md shadow-xl">
            <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-4">
                    <GraduationCap className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-2xl">Welcome back</CardTitle>
                <CardDescription>
                    Login to access your school dashboard
                </CardDescription>
            </CardHeader>
            <CardContent>
                {justVerified && (
                    <Alert className="bg-green-50 border-green-200 mb-6">
                        <Info className="h-4 w-4 text-green-600" />
                        <AlertTitle className="text-green-800">Account Created</AlertTitle>
                        <AlertDescription className="text-green-700">
                            Please check your email to verify your account before logging in.
                        </AlertDescription>
                    </Alert>
                )}

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="your.email@example.com"
                                        type="email"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Input
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="••••••••"
                                            {...field}
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-4 w-4 text-gray-400" />
                                            ) : (
                                                <Eye className="h-4 w-4 text-gray-400" />
                                            )}
                                        </Button>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" disabled={isLoading} className="w-full" size="lg">
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Login
                    </Button>
                </form>
            </CardContent>
            <CardFooter className="flex-col gap-2">
                <div className="text-sm text-center">
                    Don&apos;t have an account?{' '}
                    <Link href="/signup" className="text-blue-600 hover:underline font-medium">
                        Sign up
                    </Link>
                </div>
            </CardFooter>
        </Card>
    )
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="flex justify-center items-center h-[500px]">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        }>
            <LoginForm />
        </Suspense>
    )
}
