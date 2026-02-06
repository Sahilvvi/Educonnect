import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { GraduationCap, Users, MessageSquare, Calendar } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              EduConnect
            </span>
          </div>
          <div className="flex gap-3">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
            🚀 Unified Multi-School Platform
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            One Platform for All Your Children&apos;s Schools
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Manage multiple children across different schools with a single login. Stay connected with teachers, track attendance, view homework, and never miss an important announcement.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="text-lg px-8">
                Start Free Trial
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="text-lg px-8">
                Parent Login
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: Users,
              title: 'Multi-School Access',
              description: 'One account for all your children across different schools',
              color: 'text-blue-600',
              bg: 'bg-blue-100',
            },
            {
              icon: MessageSquare,
              title: 'Real-Time Communication',
              description: 'Direct messaging with teachers and instant notifications',
              color: 'text-purple-600',
              bg: 'bg-purple-100',
            },
            {
              icon: Calendar,
              title: 'Attendance Tracking',
              description: 'Get instant alerts when your child is marked absent',
              color: 'text-green-600',
              bg: 'bg-green-100',
            },
            {
              icon: GraduationCap,
              title: 'Academic Monitoring',
              description: 'Track homework, assignments, and academic progress',
              color: 'text-orange-600',
              bg: 'bg-orange-100',
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="p-6 rounded-2xl border border-gray-200 bg-white hover:shadow-lg transition-shadow"
            >
              <div className={`inline-flex p-3 rounded-xl ${feature.bg} mb-4`}>
                <feature.icon className={`h-6 w-6 ${feature.color}`} />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to simplify school communication?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of parents managing their children&apos;s education effortlessly
          </p>
          <Link href="/signup">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              Create Parent Account
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-gray-50 py-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>© 2026 EduConnect. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
