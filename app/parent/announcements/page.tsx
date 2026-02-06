import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ParentNavbar } from '@/components/dashboard/ParentNavbar'
import { AnnouncementCard } from '@/components/communication/AnnouncementCard'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default async function AnnouncementsPage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const { data: parentProfile } = await supabase
        .from('parent_profiles')
        .select('id, full_name')
        .eq('user_id', user.id)
        .single()

    // 1. Get user's linked items to find what schools they are part of
    const { data: linkedStudents } = await supabase
        .from('parent_student_mapping')
        .select(`
            student_id,
            students (
                school_id
            )
        `)
        .eq('parent_id', parentProfile?.id)

    const schoolIds = linkedStudents?.map((item: any) => item.students?.school_id).filter(Boolean) || []

    // 2. Fetch announcements for those schools
    let realAnnouncements: any[] = []

    if (schoolIds.length > 0) {
        const { data } = await supabase
            .from('announcements')
            .select(`
                *,
                schools (
                    name
                )
            `)
            .in('school_id', schoolIds)
            .eq('is_published', true)
            .order('published_at', { ascending: false })

        if (data) {
            realAnnouncements = data.map((item: any) => ({
                ...item,
                school_name: item.schools?.name || 'School',
                author_name: 'School Admin' // Simplified for MVP
            }))
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <ParentNavbar parentName={parentProfile?.full_name || 'Parent'} />

            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <h1 className="text-3xl font-bold mb-2">Announcements</h1>
                <p className="text-gray-600 mb-8">Latest updates from all your children&apos;s schools</p>

                <Tabs defaultValue="all" className="w-full">
                    <TabsList className="mb-6">
                        <TabsTrigger value="all">All Updates</TabsTrigger>
                        <TabsTrigger value="urgent">Urgent</TabsTrigger>
                        <TabsTrigger value="academic">Academic</TabsTrigger>
                        <TabsTrigger value="events">Events</TabsTrigger>
                    </TabsList>

                    <TabsContent value="all" className="space-y-4">
                        {realAnnouncements.map(announcement => (
                            <AnnouncementCard key={announcement.id} announcement={announcement} />
                        ))}
                    </TabsContent>

                    <TabsContent value="urgent" className="space-y-4">
                        {realAnnouncements.filter(a => a.priority === 'urgent' || a.priority === 'high').map(announcement => (
                            <AnnouncementCard key={announcement.id} announcement={announcement} />
                        ))}
                    </TabsContent>

                    <TabsContent value="academic" className="space-y-4">
                        {realAnnouncements.filter(a => a.announcement_type === 'academic').map(announcement => (
                            <AnnouncementCard key={announcement.id} announcement={announcement} />
                        ))}
                    </TabsContent>

                    <TabsContent value="events" className="space-y-4">
                        {realAnnouncements.filter(a => a.announcement_type === 'event').map(announcement => (
                            <AnnouncementCard key={announcement.id} announcement={announcement} />
                        ))}
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
