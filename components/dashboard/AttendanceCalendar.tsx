'use client'

import { useState } from 'react'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { format, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns'
import { CheckCircle2, XCircle, Clock, Calendar as CalendarIcon } from 'lucide-react'

type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused'

interface AttendanceRecord {
    date: Date
    status: AttendanceStatus
    remarks?: string
}

interface AttendanceCalendarProps {
    records: AttendanceRecord[]
}

export function AttendanceCalendar({ records }: AttendanceCalendarProps) {
    const [date, setDate] = useState<Date | undefined>(new Date())

    // Helper to get status for a specific date
    const getStatusForDate = (day: Date) => {
        return records.find(record => isSameDay(new Date(record.date), day))?.status
    }

    // Custom renderer for calendar days
    const modifiers = {
        present: (day: Date) => getStatusForDate(day) === 'present',
        absent: (day: Date) => getStatusForDate(day) === 'absent',
        late: (day: Date) => getStatusForDate(day) === 'late',
        excused: (day: Date) => getStatusForDate(day) === 'excused',
    }

    const modifiersStyles = {
        present: { color: 'green', fontWeight: 'bold' },
        absent: { color: 'red', fontWeight: 'bold' },
        late: { color: 'orange', fontWeight: 'bold' },
        excused: { color: 'gray' }
    }

    // Calculate stats for current view (simplified to total for now)
    const stats = {
        present: records.filter(r => r.status === 'present').length,
        absent: records.filter(r => r.status === 'absent').length,
        late: records.filter(r => r.status === 'late').length,
        percentage: Math.round((records.filter(r => r.status === 'present').length / records.length) * 100) || 0
    }

    return (
        <div className="grid md:grid-cols-3 gap-6">
            {/* Calendar Section */}
            <Card className="md:col-span-2">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <CalendarIcon className="h-5 w-5 text-blue-600" />
                        Attendance Calendar
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        className="rounded-md border shadow p-4"
                        modifiers={modifiers}
                        modifiersClassNames={{
                            present: "bg-green-100 text-green-700 hover:bg-green-200",
                            absent: "bg-red-100 text-red-700 hover:bg-red-200",
                            late: "bg-orange-100 text-orange-700 hover:bg-orange-200",
                            excused: "bg-gray-100 text-gray-500"
                        }}
                    />
                </CardContent>
            </Card>

            {/* Stats & Details Section */}
            <div className="space-y-6">
                {/* Monthly Stats */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Monthly Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600 flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-green-600" /> Present
                            </span>
                            <span className="font-bold text-lg">{stats.present}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600 flex items-center gap-2">
                                <XCircle className="h-4 w-4 text-red-600" /> Absent
                            </span>
                            <span className="font-bold text-lg text-red-600">{stats.absent}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600 flex items-center gap-2">
                                <Clock className="h-4 w-4 text-orange-600" /> Late
                            </span>
                            <span className="font-bold text-lg text-orange-600">{stats.late}</span>
                        </div>
                        <div className="pt-4 border-t mt-2">
                            <div className="flex items-center justify-between">
                                <span className="font-medium">Attendance Rate</span>
                                <span className={`text-xl font-bold ${stats.percentage >= 75 ? 'text-green-600' : 'text-red-600'}`}>
                                    {stats.percentage}%
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Selected Date Detail */}
                {date && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm text-gray-500">
                                {format(date, 'EEEE, MMMM do, yyyy')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {getStatusForDate(date) ? (
                                <div className="text-center py-2">
                                    <Badge
                                        className={`text-lg py-1 px-4 mb-2 capitalize
                      ${getStatusForDate(date) === 'present' ? 'bg-green-100 text-green-800 hover:bg-green-100' : ''}
                      ${getStatusForDate(date) === 'absent' ? 'bg-red-100 text-red-800 hover:bg-red-100' : ''}
                      ${getStatusForDate(date) === 'late' ? 'bg-orange-100 text-orange-800 hover:bg-orange-100' : ''}
                      ${getStatusForDate(date) === 'excused' ? 'bg-gray-100 text-gray-800 hover:bg-gray-100' : ''}
                    `}
                                        variant="outline"
                                    >
                                        {getStatusForDate(date)}
                                    </Badge>
                                    {records.find(r => isSameDay(new Date(r.date), date))?.remarks && (
                                        <p className="text-sm text-gray-600 italic">
                                            "{records.find(r => isSameDay(new Date(r.date), date))?.remarks}"
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center text-gray-400 py-4">
                                    No record for this date
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}
