'use client'

import { School, Users, Calendar, BookOpen, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface Student {
    id: string
    full_name: string
    school_name: string
    class_name: string
    profile_photo_url?: string
    attendance_percentage?: number
    pending_homework?: number
    pending_fees?: number
    school_logo_url?: string
    school_theme_color?: string
}

interface ChildCardProps {
    student: Student
}

export function ChildCard({ student }: ChildCardProps) {
    const cardColor = student.school_theme_color || '#3B82F6'
    const attendanceStatus = (student.attendance_percentage || 0) >= 75 ? 'good' : 'warning'

    return (
        <Card className="hover:shadow-lg transition-shadow">
            <CardHeader
                className="pb-3"
                style={{
                    background: `linear-gradient(135deg, ${cardColor}15 0%, ${cardColor}05 100%)`,
                    borderBottom: `2px solid ${cardColor}30`,
                }}
            >
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        {/* Student Avatar */}
                        <div
                            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-lg"
                            style={{ backgroundColor: cardColor }}
                        >
                            {student.full_name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <CardTitle className="text-lg">{student.full_name}</CardTitle>
                            <div className="flex items-center gap-2 mt-1">
                                <School className="h-3 w-3 text-gray-500" />
                                <p className="text-sm text-gray-600">{student.school_name}</p>
                            </div>
                        </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                        {student.class_name}
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="pt-4">
                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                    {/* Attendance */}
                    <div className="text-center">
                        <div
                            className={`text-2xl font-bold ${attendanceStatus === 'good' ? 'text-green-600' : 'text-orange-600'
                                }`}
                        >
                            {student.attendance_percentage || 0}%
                        </div>
                        <div className="text-xs text-gray-500 mt-1 flex items-center justify-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Attendance
                        </div>
                    </div>

                    {/* Homework */}
                    <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                            {student.pending_homework || 0}
                        </div>
                        <div className="text-xs text-gray-500 mt-1 flex items-center justify-center gap-1">
                            <BookOpen className="h-3 w-3" />
                            Pending
                        </div>
                    </div>

                    {/* Fees */}
                    <div className="text-center">
                        <div
                            className={`text-2xl font-bold ${(student.pending_fees || 0) > 0 ? 'text-red-600' : 'text-green-600'
                                }`}
                        >
                            ₹{student.pending_fees || 0}
                        </div>
                        <div className="text-xs text-gray-500 mt-1 flex items-center justify-center gap-1">
                            <Users className="h-3 w-3" />
                            Fees Due
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1" asChild>
                        <Link href={`/parent/student/${student.id}/attendance`}>
                            View Details
                        </Link>
                    </Button>
                    <Button size="sm" className="flex-1" style={{ backgroundColor: cardColor }} asChild>
                        <Link href={`/parent/student/${student.id}/homework`}>
                            Homework
                        </Link>
                    </Button>
                </div>

                {/* Alerts */}
                {(student.attendance_percentage || 0) < 75 && (
                    <div className="mt-3 flex items-start gap-2 p-2 bg-orange-50 rounded-lg border border-orange-200">
                        <AlertCircle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-orange-700">
                            Low attendance: {student.attendance_percentage}%. Required: 75%
                        </p>
                    </div>
                )}

                {(student.pending_fees || 0) > 0 && (
                    <div className="mt-2 flex items-start gap-2 p-2 bg-red-50 rounded-lg border border-red-200">
                        <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-red-700">
                            Pending fees: ₹{student.pending_fees}
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
