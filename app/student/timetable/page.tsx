'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Clock, BookOpen, MapPin } from 'lucide-react'

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const COLORS = ['bg-blue-100', 'bg-green-100', 'bg-purple-100', 'bg-orange-100', 'bg-pink-100', 'bg-yellow-100']

export default function StudentTimetablePage() {
    const [timetableSlots, setTimetableSlots] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [nextClass, setNextClass] = useState<any>(null)

    const supabase = createClient()

    useEffect(() => {
        fetchTimetable()
    }, [])

    const fetchTimetable = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            const { data: student } = await supabase
                .from('students')
                .select('class_id')
                .eq('email', user.email)
                .single()

            if (!student) return

            const { data } = await supabase
                .from('timetable_slots')
                .select(`
                    *,
                    teacher_profiles (
                        full_name
                    )
                `)
                .eq('class_id', student.class_id)
                .eq('is_active', true)
                .order('day_of_week')
                .order('start_time')

            setTimetableSlots(data || [])

            // Find next class
            const now = new Date()
            const currentDay = now.getDay()
            const currentTime = now.toTimeString().slice(0, 5)

            const upcoming = data?.find((slot: any) => {
                if (slot.day_of_week === currentDay && slot.start_time > currentTime) {
                    return true
                }
                return slot.day_of_week > currentDay
            })

            setNextClass(upcoming || null)
        } catch (error) {
            console.error('Error fetching timetable:', error)
        } finally {
            setLoading(false)
        }
    }

    const groupSlotsByDay = () => {
        const grouped: any = {}
        DAYS.forEach((day, index) => {
            grouped[index] = timetableSlots.filter(slot => slot.day_of_week === index)
        })
        return grouped
    }

    const slotsByDay = groupSlotsByDay()
    const today = new Date().getDay()

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">My Timetable</h1>
                <p className="text-gray-500">Your weekly class schedule</p>
            </div>

            {/* Next Class Card */}
            {nextClass && (
                <Card className="mb-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-blue-100 mb-1">Next Class</p>
                                <h2 className="text-2xl font-bold mb-2">{nextClass.subject}</h2>
                                <div className="flex items-center gap-4 text-sm">
                                    <span className="flex items-center gap-1">
                                        <Clock className="h-4 w-4" />
                                        {nextClass.start_time} - {nextClass.end_time}
                                    </span>
                                    {nextClass.teacher_profiles && (
                                        <span className="flex items-center gap-1">
                                            <BookOpen className="h-4 w-4" />
                                            {nextClass.teacher_profiles.full_name}
                                        </span>
                                    )}
                                    {nextClass.room_number && (
                                        <span className="flex items-center gap-1">
                                            <MapPin className="h-4 w-4" />
                                            Room {nextClass.room_number}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-3xl font-bold">{DAYS[nextClass.day_of_week]}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Weekly Timetable */}
            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                </div>
            ) : (
                <div className="space-y-6">
                    {DAYS.map((day, dayIndex) => (
                        <Card key={dayIndex} className={dayIndex === today ? 'border-blue-500 border-2' : ''}>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Clock className="h-5 w-5" />
                                    {day}
                                    {dayIndex === today && (
                                        <span className="ml-2 text-sm bg-blue-600 text-white px-2 py-1 rounded">Today</span>
                                    )}
                                    <span className="text-sm font-normal text-muted-foreground ml-auto">
                                        {slotsByDay[dayIndex]?.length || 0} classes
                                    </span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {slotsByDay[dayIndex]?.length === 0 ? (
                                    <p className="text-gray-500 text-center py-4">No classes scheduled</p>
                                ) : (
                                    <div className="space-y-3">
                                        {slotsByDay[dayIndex]?.map((slot: any, index: number) => (
                                            <div
                                                key={slot.id}
                                                className={`p-4 rounded-lg border-l-4 ${COLORS[index % COLORS.length]}`}
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <h3 className="font-semibold text-lg mb-2">{slot.subject}</h3>
                                                        <div className="space-y-1 text-sm text-gray-600">
                                                            <div className="flex items-center gap-2">
                                                                <Clock className="h-4 w-4" />
                                                                <span>{slot.start_time} - {slot.end_time}</span>
                                                            </div>
                                                            {slot.teacher_profiles && (
                                                                <div className="flex items-center gap-2">
                                                                    <BookOpen className="h-4 w-4" />
                                                                    <span>{slot.teacher_profiles.full_name}</span>
                                                                </div>
                                                            )}
                                                            {slot.room_number && (
                                                                <div className="flex items-center gap-2">
                                                                    <MapPin className="h-4 w-4" />
                                                                    <span>Room {slot.room_number}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
