import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    // Check if Supabase is configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    // If Supabase is not configured, allow public route access only
    if (!supabaseUrl || !supabaseAnonKey ||
        supabaseUrl.includes('your_supabase') ||
        supabaseAnonKey.includes('your_supabase')) {

        // Allow access to landing page and auth pages even without Supabase
        const publicRoutes = ['/', '/login', '/signup', '/about', '/contact']
        if (publicRoutes.includes(request.nextUrl.pathname)) {
            return NextResponse.next()
        }

        // Redirect protected routes to landing page if Supabase not configured
        const url = request.nextUrl.clone()
        url.pathname = '/'
        return NextResponse.redirect(url)
    }

    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabase = createServerClient(
        supabaseUrl,
        supabaseAnonKey,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value)
                    )
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // IMPORTANT: Avoid writing any logic between createServerClient and
    // supabase.auth.getUser(). A simple mistake could make it very hard to debug
    // issues with users being randomly logged out.

    const {
        data: { user },
    } = await supabase.auth.getUser()

    // Refresh session if user is logged in
    if (user) {
        // User is authenticated, allow the request
        return supabaseResponse
    }

    // If user is not authenticated and trying to access protected routes, redirect to login
    if (
        !user &&
        !request.nextUrl.pathname.startsWith('/login') &&
        !request.nextUrl.pathname.startsWith('/signup') &&
        !request.nextUrl.pathname.startsWith('/auth')
    ) {
        // Allow public routes (you can customize this)
        const publicRoutes = ['/', '/about', '/contact']
        if (!publicRoutes.includes(request.nextUrl.pathname)) {
            const url = request.nextUrl.clone()
            url.pathname = '/login'
            return NextResponse.redirect(url)
        }
    }

    return supabaseResponse
}
