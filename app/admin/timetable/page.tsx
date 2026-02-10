'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from '@/components/ui/dialog'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Loader2, Plus, Clock, BookOpen, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const COLORS = ['bg-blue-100', 'bg-green-100', 'bg-purple-100', 'bg-orange-100', 'bg-pink-100', 'bg-yellow-100']

export default function AdminTimetablePage() {
    const [timetableSlots, setTimetableSlots] = useState<any[]>([])
    const [classes, setClasses] = useState<any[]>([])
    const [teachers, setTeachers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [selectedClass, setSelectedClass] = useState<string>('all')
    const [newSlot, setNewSlot] = useState({
        class_id: '',
        subject: '',
        teacher_id: '',
        day_of_week: '1',
        start_time: '09:00',
        end_time: '10:00',
        room_number: ''
    })

    const supabase = createClient()

    useEffect(() => {
        fetchData()
    }, [selectedClass])

    const fetchData = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            const { data: roleData } = await supabase
                .from('user_roles')
                .select('school_id')
                .eq('user_id', user.id)
                .single()

            const schoolId = roleData?.school_id

            // Fetch classes
            const { data: classesData } = await supabase
                .from('classes')
                .select('id, name')
                .eq('school_id', schoolId)
                .order('name')

            setClasses(classesData || [])

            // Fetch teachers
            const { data: teachersData } = await supabase
                .from('teacher_profiles')
                .select('id, full_name')
                .eq('school_id', schoolId)
                .order('full_name')

            setTeachers(teachersData || [])

            // Fetch timetable slots
            let query = supabase
                .from('timetable_slots')
                .select(`
                    *,
                    classes (id, name),
                    teacher_profiles (id, full_name)
                `)
                .eq('school_id', schoolId)
                .eq('is_active', true)
                .order('day_of_week')
                .order('start_time')

            if (selectedClass !== 'all') {
                query = query.eq('class_id', selectedClass)
            }

            const { data } = await query

            setTimetableSlots(data || [])
        } catch (error) {
            console.error('Error fetching data:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleCreateSlot = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            const { data: roleData } = await supabase
                .from('user_roles')
                .select('school_id')
                .eq('user_id', user.id)
                .single()

            const { error } = await supabase
                .from('timetable_slots')
                .insert([{
                    ...newSlot,
                    school_id: roleData?.school_id,
                    day_of_week: parseInt(newSlot.day_of_week)
                }])

            if (error) throw error

            toast.success('Timetable slot created successfully')
            setIsDialogOpen(false)
            setNewSlot({
                class_id: '',
                subject: '',
                teacher_id: '',
                day_of_week: '1',
                start_time: '09:00',
                end_time: '10:00',
                room_number: ''
            })
            fetchData()
        } catch (error: any) {
            toast.error(error.message || 'Failed to create slot')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDeleteSlot = async (slotId: string) => {
        try {
            const { error } = await supabase
                .from('timetable_slots')
                .update({ is_active: false })
                .eq('id', slotId)

            if (error) throw error

            toast.success('Timetable slot deleted')
            fetchData()
        } catch (error: any) {
            toast.error(error.message || 'Failed to delete slot')
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

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Timetable Management</h1>
                    <p className="text-gray-500">Manage class schedules and timetable slots</p>
                </div>
                <div className="flex items-center gap-4">
                    <Select value={selectedClass} onValueChange={setSelectedClass}>
                        <SelectTrigger className="w-[200px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Classes</SelectItem>
                            {classes.map(cls => (
                                <SelectItem key={cls.id} value={cls.id}>{cls.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-blue-600">
                                <Plus className="mr-2 h-4 w-4" /> Add Slot
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Create Timetable Slot</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleCreateSlot} className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="class">Class *</Label>
                                    <Select
                                        value={newSlot.class_id}
                                        onValueChange={(value) => setNewSlot({ ...newSlot, class_id: value })}
                                        required
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select class" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {classes.map(cls => (
                                                <SelectItem key={cls.id} value={cls.id}>{cls.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="subject">Subject *</Label>
                                    <Input
                                        id="subject"
                                        value={newSlot.subject}
                                        onChange={(e) => setNewSlot({ ...newSlot, subject: e.target.value })}
                                        placeholder="e.g., Mathematics"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="teacher">Teacher</Label>
                                    <Select
                                        value={newSlot.teacher_id}
                                        onValueChange={(value) => setNewSlot({ ...newSlot, teacher_id: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select teacher (optional)" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {teachers.map(teacher => (
                                                <SelectItem key={teacher.id} value={teacher.id}>
                                                    {teacher.full_name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="day">Day *</Label>
                                        <Select
                                            value={newSlot.day_of_week}
                                            onValueChange={(value) => setNewSlot({ ...newSlot, day_of_week: value })}
                                            required
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {DAYS.map((day, index) => (
                                                    <SelectItem key={index} value={index.toString()}>{day}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="room">Room</Label>
                                        <Input
                                            id="room"
                                            value={newSlot.room_number}
                                            onChange={(e) => setNewSlot({ ...newSlot, room_number: e.target.value })}
                                            placeholder="e.g., 101"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="start_time">Start Time *</Label>
                                        <Input
                                            id="start_time"
                                            type="time"
                                            value={newSlot.start_time}
                                            onChange={(e) => setNewSlot({ ...newSlot, start_time: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="end_time">End Time *</Label>
                                        <Input
                                            id="end_time"
                                            type="time"
                                            value={newSlot.end_time}
                                            onChange={(e) => setNewSlot({ ...newSlot, end_time: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>

                                <DialogFooter>
                                    <Button type="submit" disabled={isSubmitting} className="w-full">
                                        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                                        Create Slot
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Timetable Grid */}
            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                </div>
            ) : (
                <div className="space-y-6">
                    {DAYS.map((day, dayIndex) => (
                        <Card key={dayIndex}>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Clock className="h-5 w-5" />
                                    {day}
                                    <span className="text-sm font-normal text-muted-foreground ml-2">
                                        ({slotsByDay[dayIndex]?.length || 0} slots)
                                    </span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {slotsByDay[dayIndex]?.length === 0 ? (
                                    <p className="text-gray-500 text-center py-4">No slots scheduled for this day</p>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                        {slotsByDay[dayIndex]?.map((slot: any, index: number) => (
                                            <div
                                                key={slot.id}
                                                className={`p-4 rounded-lg border-l-4 ${COLORS[index % COLORS.length]}`}
                                            >
                                                <div className="flex items-start justify-between mb-2">
                                                    <div>
                                                        <h3 className="font-semibold text-lg">{slot.subject}</h3>
                                                        <p className="text-sm text-muted-foreground">
                                                            {slot.classes?.name || 'Unknown Class'}
                                                        </p>
                                                    </div>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => handleDeleteSlot(slot.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4 text-red-600" />
                                                    </Button>
                                                </div>
                                                <div className="space-y-1 text-sm">
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="h-4 w-4 text-blue-600" />
                                                        <span>{slot.start_time} - {slot.end_time}</span>
                                                    </div>
                                                    {slot.teacher_profiles && (
                                                        <div className="flex items-center gap-2">
                                                            <BookOpen className="h-4 w-4 text-green-600" />
                                                            <span>{slot.teacher_profiles.full_name}</span>
                                                        </div>
                                                    )}
                                                    {slot.room_number && (
                                                        <p className="text-muted-foreground">Room: {slot.room_number}</p>
                                                    )}
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
