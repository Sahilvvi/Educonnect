export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

// User Roles
export type UserRole = 'parent' | 'teacher' | 'admin' | 'super_admin'

// Attendance Status
export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused'

// Fee Status
export type FeeStatus = 'pending' | 'paid' | 'overdue' | 'waived'

// Announcement Types
export type AnnouncementType = 'general' | 'academic' | 'event' | 'emergency'

// Priority Levels
export type Priority = 'low' | 'normal' | 'high' | 'urgent'

// Notification Types
export type NotificationType = 'absence' | 'homework' | 'announcement' | 'fee' | 'message'

// Relationship Types
export type RelationshipType = 'mother' | 'father' | 'guardian' | 'other'

// Database Tables Types
export interface Database {
    public: {
        Tables: {
            schools: {
                Row: {
                    id: string
                    name: string
                    code: string
                    address: string | null
                    city: string | null
                    state: string | null
                    country: string | null
                    postal_code: string | null
                    phone: string | null
                    email: string | null
                    website: string | null
                    logo_url: string | null
                    theme_color: string
                    academic_year_start_month: number
                    timezone: string
                    is_active: boolean
                    subscription_tier: string
                    subscription_expires_at: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: Omit<Database['public']['Tables']['schools']['Row'], 'id' | 'created_at' | 'updated_at'>
                Update: Partial<Database['public']['Tables']['schools']['Insert']>
            }
            user_roles: {
                Row: {
                    id: string
                    user_id: string
                    role: UserRole
                    school_id: string | null
                    is_active: boolean
                    created_at: string
                }
                Insert: Omit<Database['public']['Tables']['user_roles']['Row'], 'id' | 'created_at'>
                Update: Partial<Database['public']['Tables']['user_roles']['Insert']>
            }
            parent_profiles: {
                Row: {
                    id: string
                    user_id: string
                    full_name: string
                    phone: string | null
                    alternate_phone: string | null
                    address: string | null
                    city: string | null
                    state: string | null
                    occupation: string | null
                    notification_preferences: Json
                    language_preference: string
                    created_at: string
                    updated_at: string
                }
                Insert: Omit<Database['public']['Tables']['parent_profiles']['Row'], 'id' | 'created_at' | 'updated_at'>
                Update: Partial<Database['public']['Tables']['parent_profiles']['Insert']>
            }
            students: {
                Row: {
                    id: string
                    school_id: string
                    class_id: string | null
                    student_id: string | null
                    full_name: string
                    date_of_birth: string | null
                    gender: string | null
                    blood_group: string | null
                    email: string | null
                    phone: string | null
                    address: string | null
                    admission_date: string | null
                    roll_number: string | null
                    profile_photo_url: string | null
                    is_active: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: Omit<Database['public']['Tables']['students']['Row'], 'id' | 'created_at' | 'updated_at'>
                Update: Partial<Database['public']['Tables']['students']['Insert']>
            }
            parent_student_mapping: {
                Row: {
                    id: string
                    parent_id: string
                    student_id: string
                    relationship: RelationshipType
                    is_primary_contact: boolean
                    verified_at: string | null
                    verification_code: string | null
                    created_at: string
                }
                Insert: Omit<Database['public']['Tables']['parent_student_mapping']['Row'], 'id' | 'created_at'>
                Update: Partial<Database['public']['Tables']['parent_student_mapping']['Insert']>
            }
            notifications: {
                Row: {
                    id: string
                    user_id: string
                    school_id: string | null
                    student_id: string | null
                    notification_type: NotificationType
                    title: string
                    body: string
                    action_url: string | null
                    is_read: boolean
                    read_at: string | null
                    related_id: string | null
                    created_at: string
                }
                Insert: Omit<Database['public']['Tables']['notifications']['Row'], 'id' | 'created_at'>
                Update: Partial<Database['public']['Tables']['notifications']['Insert']>
            }
        }
    }
}
