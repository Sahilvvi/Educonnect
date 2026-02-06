import { z } from 'zod'

// Login Schema
export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Please enter your password'),
})

export type LoginFormData = z.infer<typeof loginSchema>

// OTP Verification Schema
export const otpSchema = z.object({
    otp: z.string().length(6, 'OTP must be 6 digits'),
})

export type OTPFormData = z.infer<typeof otpSchema>

// Parent Signup Schema
export const parentSignupSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    full_name: z.string().min(2, 'Name must be at least 2 characters'),
    phone: z.string().min(10, 'Please enter a valid phone number'),
    address: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
})

export type ParentSignupData = z.infer<typeof parentSignupSchema>

// Teacher/Admin Login Schema (with school code)
export const schoolLoginSchema = loginSchema.extend({
    school_code: z.string().min(1, 'School code is required'),
})

export type SchoolLoginData = z.infer<typeof schoolLoginSchema>
