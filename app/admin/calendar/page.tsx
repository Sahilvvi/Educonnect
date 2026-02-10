'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar as CalendarIcon } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'

export default function CalendarPage() {
    const [date, setDate] = useState<Date | undefined>(new Date())
    const [events, setEvents] = useState<any[]>([])

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">School Calendar</h1>
            <p className="text-gray-500 mb-8">View and manage school events</p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Calendar</CardTitle>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            className="rounded-md border"
                        />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Upcoming Events</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                                <CalendarIcon className="h-5 w-5 text-blue-600 mt-0.5" />
                                <div>
                                    <p className="font-medium text-sm">Parent-Teacher Meeting</p>
                                    <p className="text-xs text-muted-foreground">Tomorrow, 10:00 AM</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                                <CalendarIcon className="h-5 w-5 text-green-600 mt-0.5" />
                                <div>
                                    <p className="font-medium text-sm">Annual Sports Day</p>
                                    <p className="text-xs text-muted-foreground">Next Week Friday</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
                                <CalendarIcon className="h-5 w-5 text-orange-600 mt-0.5" />
                                <div>
                                    <p className="font-medium text-sm">Final Exams Begin</p>
                                    <p className="text-xs text-muted-foreground">In 2 weeks</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
