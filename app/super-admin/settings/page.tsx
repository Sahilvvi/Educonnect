'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Loader2, Save, Settings as SettingsIcon } from 'lucide-react'
import { toast } from 'sonner'

export default function SettingsPage() {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [settings, setSettings] = useState({
        attendanceLateCutoff: '09:15',
        attendanceAlertTime: '10:00',
        consecutiveAbsenceThreshold: 3,
        autoSendAbsenceAlerts: true,
        schoolYearStart: '2024-01-01',
        schoolYearEnd: '2024-12-31',
        enableNotifications: true,
        enableEmailDigest: false,
        maxStudentsPerClass: 40,
        minAttendancePercentage: 75
    })

    const supabase = createClient()

    useEffect(() => {
        fetchSettings()
    }, [])

    const fetchSettings = async () => {
        try {
            const { data } = await supabase
                .from('system_settings')
                .select('*')
                .is('school_id', null) // Super admin settings

            if (data && data.length > 0) {
                const settingsObj = data.reduce((acc: any, curr: any) => {
                    acc[curr.setting_key] = curr.setting_value
                    return acc
                }, {})
                setSettings({ ...settings, ...settingsObj })
            }
        } catch (error) {
            console.error('Error fetching settings:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async () => {
        setSaving(true)
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            // Save each setting
            const updates = Object.entries(settings).map(([key, value]) => ({
                school_id: null, // Super admin level
                setting_key: key,
                setting_value: value,
                category: getCategoryForSetting(key),
                updated_by: user.id
            }))

            const { error } = await supabase
                .from('system_settings')
                .upsert(updates, { onConflict: 'school_id,setting_key' })

            if (error) throw error

            toast.success('Settings saved successfully')
        } catch (error: any) {
            toast.error(error.message || 'Failed to save settings')
        } finally {
            setSaving(false)
        }
    }

    const getCategoryForSetting = (key: string) => {
        if (key.includes('attendance')) return 'attendance'
        if (key.includes('schoolYear')) return 'academic'
        if (key.includes('notification') || key.includes('email')) return 'communication'
        return 'general'
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
                    <p className="text-gray-500">Configure platform-wide settings and defaults</p>
                </div>
                <Button onClick={handleSave} disabled={saving} className="bg-blue-600">
                    {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Save Changes
                </Button>
            </div>

            <Tabs defaultValue="attendance" className="space-y-6">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="attendance">Attendance</TabsTrigger>
                    <TabsTrigger value="academic">Academic</TabsTrigger>
                    <TabsTrigger value="communication">Communication</TabsTrigger>
                    <TabsTrigger value="general">General</TabsTrigger>
                </TabsList>

                <TabsContent value="attendance">
                    <Card>
                        <CardHeader>
                            <CardTitle>Attendance Settings</CardTitle>
                            <CardDescription>Configure attendance rules and notifications</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="lateCutoff">Late Arrival Cutoff Time</Label>
                                <Input
                                    id="lateCutoff"
                                    type="time"
                                    value={settings.attendanceLateCutoff}
                                    onChange={(e) => setSettings({ ...settings, attendanceLateCutoff: e.target.value })}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Students arriving after this time will be marked as late
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="alertTime">Absence Alert Time</Label>
                                <Input
                                    id="alertTime"
                                    type="time"
                                    value={settings.attendanceAlertTime}
                                    onChange={(e) => setSettings({ ...settings, attendanceAlertTime: e.target.value })}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Automatic alerts will be sent at this time
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="absenceThreshold">Consecutive Absence Threshold</Label>
                                <Input
                                    id="absenceThreshold"
                                    type="number"
                                    min="1"
                                    max="10"
                                    value={settings.consecutiveAbsenceThreshold}
                                    onChange={(e) => setSettings({ ...settings, consecutiveAbsenceThreshold: parseInt(e.target.value) })}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Number of consecutive days before triggering admin alert
                                </p>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Auto-send Absence Alerts</Label>
                                    <p className="text-xs text-muted-foreground">
                                        Automatically notify parents of student absences
                                    </p>
                                </div>
                                <Switch
                                    checked={settings.autoSendAbsenceAlerts}
                                    onCheckedChange={(checked) => setSettings({ ...settings, autoSendAbsenceAlerts: checked })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="minAttendance">Minimum Attendance Percentage</Label>
                                <Input
                                    id="minAttendance"
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={settings.minAttendancePercentage}
                                    onChange={(e) => setSettings({ ...settings, minAttendancePercentage: parseInt(e.target.value) })}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Required minimum attendance for students (%)
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="academic">
                    <Card>
                        <CardHeader>
                            <CardTitle>Academic Settings</CardTitle>
                            <CardDescription>Configure academic year and class limits</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="yearStart">School Year Start Date</Label>
                                    <Input
                                        id="yearStart"
                                        type="date"
                                        value={settings.schoolYearStart}
                                        onChange={(e) => setSettings({ ...settings, schoolYearStart: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="yearEnd">School Year End Date</Label>
                                    <Input
                                        id="yearEnd"
                                        type="date"
                                        value={settings.schoolYearEnd}
                                        onChange={(e) => setSettings({ ...settings, schoolYearEnd: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="maxStudents">Maximum Students Per Class</Label>
                                <Input
                                    id="maxStudents"
                                    type="number"
                                    min="1"
                                    max="100"
                                    value={settings.maxStudentsPerClass}
                                    onChange={(e) => setSettings({ ...settings, maxStudentsPerClass: parseInt(e.target.value) })}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Default maximum class size (can be overridden per school)
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="communication">
                    <Card>
                        <CardHeader>
                            <CardTitle>Communication Settings</CardTitle>
                            <CardDescription>Configure notifications and email preferences</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Enable In-App Notifications</Label>
                                    <p className="text-xs text-muted-foreground">
                                        Show notifications within the application
                                    </p>
                                </div>
                                <Switch
                                    checked={settings.enableNotifications}
                                    onCheckedChange={(checked) => setSettings({ ...settings, enableNotifications: checked })}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Enable Email Digest</Label>
                                    <p className="text-xs text-muted-foreground">
                                        Send daily summary emails to users
                                    </p>
                                </div>
                                <Switch
                                    checked={settings.enableEmailDigest}
                                    onCheckedChange={(checked) => setSettings({ ...settings, enableEmailDigest: checked })}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="general">
                    <Card>
                        <CardHeader>
                            <CardTitle>General Settings</CardTitle>
                            <CardDescription>Other platform-wide configurations</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-500">
                                Additional general settings can be configured here.
                            </p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
