'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { School, MapPin, Phone, Mail, Globe, Users, Calendar } from 'lucide-react'
import { toast } from 'sonner'

export default function SchoolProfilePage() {
    const [loading, setLoading] = useState(true)
    const [editing, setEditing] = useState(false)
    const [schoolData, setSchoolData] = useState<any>(null)

    const supabase = createClient()

    useEffect(() => {
        fetchSchoolProfile()
    }, [])

    const fetchSchoolProfile = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            const { data: roleData } = await supabase
                .from('user_roles')
                .select('school_id')
                .eq('user_id', user.id)
                .single()

            const { data: school } = await supabase
                .from('schools')
                .select('*')
                .eq('id', roleData?.school_id)
                .single()

            setSchoolData(school)
        } catch (error) {
            console.error('Error fetching school profile:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async () => {
        try {
            const { error } = await supabase
                .from('schools')
                .update(schoolData)
                .eq('id', schoolData.id)

            if (error) throw error

            toast.success('School profile updated successfully')
            setEditing(false)
        } catch (error: any) {
            toast.error(error.message || 'Failed to update profile')
        }
    }

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">School Profile</h1>
                    <p className="text-gray-500">Manage your school information</p>
                </div>
                <Button onClick={() => editing ? handleSave() : setEditing(true)}>
                    {editing ? 'Save Changes' : 'Edit Profile'}
                </Button>
            </div>

            {/* School Header */}
            <Card className="mb-6">
                <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                        <div className="h-20 w-20 bg-blue-600 rounded-lg flex items-center justify-center">
                            <School className="h-10 w-10 text-white" />
                        </div>
                        <div className="flex-1">
                            {editing ? (
                                <Input
                                    value={schoolData?.name || ''}
                                    onChange={(e) => setSchoolData({ ...schoolData, name: e.target.value })}
                                    className="text-2xl font-bold mb-2"
                                />
                            ) : (
                                <h2 className="text-2xl font-bold">{schoolData?.name}</h2>
                            )}
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                    <Badge variant="outline">{schoolData?.code}</Badge>
                                </span>
                                <span className="flex items-center gap-1">
                                    <Badge className={schoolData?.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                                        {schoolData?.status || 'Active'}
                                    </Badge>
                                </span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            Address
                        </Label>
                        {editing ? (
                            <Input
                                value={schoolData?.address || ''}
                                onChange={(e) => setSchoolData({ ...schoolData, address: e.target.value })}
                                placeholder="School address"
                            />
                        ) : (
                            <p className="text-gray-700">{schoolData?.address || 'Not provided'}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2">
                                <Phone className="h-4 w-4" />
                                Phone
                            </Label>
                            {editing ? (
                                <Input
                                    value={schoolData?.phone || ''}
                                    onChange={(e) => setSchoolData({ ...schoolData, phone: e.target.value })}
                                    placeholder="Phone number"
                                />
                            ) : (
                                <p className="text-gray-700">{schoolData?.phone || 'Not provided'}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label className="flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                Email
                            </Label>
                            {editing ? (
                                <Input
                                    value={schoolData?.email || ''}
                                    onChange={(e) => setSchoolData({ ...schoolData, email: e.target.value })}
                                    placeholder="Email address"
                                />
                            ) : (
                                <p className="text-gray-700">{schoolData?.email || 'Not provided'}</p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                            <Globe className="h-4 w-4" />
                            Website
                        </Label>
                        {editing ? (
                            <Input
                                value={schoolData?.website || ''}
                                onChange={(e) => setSchoolData({ ...schoolData, website: e.target.value })}
                                placeholder="https://..."
                            />
                        ) : (
                            <p className="text-gray-700">{schoolData?.website || 'Not provided'}</p>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Additional Information */}
            <Card>
                <CardHeader>
                    <CardTitle>Additional Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-blue-50 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                                <Calendar className="h-4 w-4 text-blue-600" />
                                <p className="text-sm font-medium text-blue-900">Established</p>
                            </div>
                            <p className="text-2xl font-bold text-blue-900">
                                {schoolData?.created_at ? new Date(schoolData.created_at).getFullYear() : '-'}
                            </p>
                        </div>

                        <div className="p-4 bg-green-50 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                                <Users className="h-4 w-4 text-green-600" />
                                <p className="text-sm font-medium text-green-900">Location</p>
                            </div>
                            <p className="text-lg font-bold text-green-900">
                                {schoolData?.location || 'Not specified'}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
