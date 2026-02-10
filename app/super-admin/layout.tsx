import { SuperAdminSidebar } from '@/components/dashboard/SuperAdminSidebar'
import { SuperAdminHeader } from '@/components/dashboard/SuperAdminHeader'

export default function SuperAdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex h-screen overflow-hidden bg-gray-50">
            {/* Left Sidebar */}
            <aside className="hidden md:block">
                <SuperAdminSidebar />
            </aside>

            {/* Main Content Area */}
            <div className="flex flex-1 flex-col overflow-hidden">
                {/* Top Header */}
                <SuperAdminHeader />

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    )
}
