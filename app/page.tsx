'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  GraduationCap,
  Users,
  MessageSquare,
  Calendar,
  CheckCircle2,
  ArrowRight,
  Star,
  ShieldCheck,
  Smartphone,
  X,
  Menu,
  ChevronDown,
  ChevronUp
} from 'lucide-react'

// FAQ Component
function FAQItem({ question, answer }: { question: string, answer: string }) {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <div className="border-b border-gray-800 last:border-0">
      <button
        className="flex items-center justify-between w-full py-4 text-left hover:text-blue-400 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-medium text-lg text-gray-200">{question}</span>
        {isOpen ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}
      </button>
      {isOpen && (
        <div className="pb-4 text-gray-400 leading-relaxed animate-in fade-in slide-in-from-top-2">
          {answer}
        </div>
      )}
    </div>
  )
}

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-black text-white selection:bg-blue-900 selection:text-white">
      {/* Navigation */}
      <header className="fixed top-0 w-full border-b border-white/10 bg-black/80 backdrop-blur-md z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-lg">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              EduConnect
            </span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Features</Link>
            <Link href="#how-it-works" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">How it works</Link>
            <Link href="#testimonials" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Testimonials</Link>
            <Link href="#faq" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">FAQ</Link>
          </nav>

          <div className="hidden md:flex gap-4">
            <Link href="/login">
              <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-white/10">Log in</Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white border-0">Get Started</Button>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden text-gray-300" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-black border-b border-white/10 p-6 flex flex-col gap-4 animate-in slide-in-from-top-5">
            <Link href="#features" className="text-lg font-medium text-gray-300" onClick={() => setMobileMenuOpen(false)}>Features</Link>
            <Link href="#how-it-works" className="text-lg font-medium text-gray-300" onClick={() => setMobileMenuOpen(false)}>How it works</Link>
            <Link href="/login" className="text-lg font-medium text-gray-300" onClick={() => setMobileMenuOpen(false)}>Log in</Link>
            <Link href="/signup">
              <Button className="w-full bg-blue-600">Get Started</Button>
            </Link>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-48 md:pb-32 container mx-auto px-6 text-center relative overflow-hidden">
        {/* Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-500/20 rounded-full blur-[120px] -z-10" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px] -z-10" />

        <div className="max-w-4xl mx-auto animate-in fade-in zoom-in duration-700">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-blue-400 text-sm font-medium mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            The #1 Platform for Modern Parents
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight leading-tight">
            Manage <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">School Life</span><br />
            Without the Chaos
          </h1>

          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            One login for all your children across different schools. Track attendance, assignments, fees, and messages in a single, unified dashboard.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="h-14 px-8 text-lg bg-white text-black hover:bg-gray-200 rounded-full w-full sm:w-auto font-semibold">
                Start Free Account
              </Button>
            </Link>
            <Link href="#how-it-works">
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-white/20 text-white hover:bg-white/10 rounded-full w-full sm:w-auto bg-transparent">
                How It Works
              </Button>
            </Link>
          </div>

          <p className="mt-8 text-sm text-gray-500">
            Trusted by 50+ Schools • Free for Parents • No Credit Card Required
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y border-white/5 bg-white/5 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <h3 className="text-4xl font-bold text-white">10k+</h3>
              <p className="text-gray-400 text-sm uppercase tracking-wider">Parents</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-4xl font-bold text-white">50+</h3>
              <p className="text-gray-400 text-sm uppercase tracking-wider">Partner Schools</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-4xl font-bold text-white">99%</h3>
              <p className="text-gray-400 text-sm uppercase tracking-wider">Satisfaction</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-4xl font-bold text-white">24/7</h3>
              <p className="text-gray-400 text-sm uppercase tracking-wider">Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Problem vs Solution Section */}
      <section className="py-24 bg-black">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Why Parents Switch?</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Stop juggling multiple apps, WhatsApp groups, and emails.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* The Old Way */}
            <div className="p-8 rounded-3xl bg-red-500/5 border border-red-500/20">
              <h3 className="text-2xl font-bold text-red-400 mb-6 flex items-center gap-2">
                <X className="h-6 w-6" /> The Hard Way
              </h3>
              <ul className="space-y-4">
                {[
                  "Multiple apps for different schools",
                  "Lost in WhatsApp group clutter",
                  "Missing homework deadlines",
                  "Surprise fee payment reminders",
                  "Zero visibility on daily attendance"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-400 decoration-red-900/50">
                    <span className="h-2 w-2 rounded-full bg-red-500/50" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* The EduConnect Way */}
            <div className="p-8 rounded-3xl bg-blue-500/10 border border-blue-500/30 relative">
              <div className="absolute -top-4 -right-4 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg shadow-blue-900/50">
                RECOMMENDED
              </div>
              <h3 className="text-2xl font-bold text-blue-400 mb-6 flex items-center gap-2">
                <CheckCircle2 className="h-6 w-6" /> The EduConnect Way
              </h3>
              <ul className="space-y-4">
                {[
                  "One dashboard for ALL your kids",
                  "Direct, organized teacher messaging",
                  "Automated homework alerts",
                  "Smart fee tracking & reminders",
                  "Real-time attendance notifications"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-200">
                    <CheckCircle2 className="h-5 w-5 text-blue-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid (Expanded) */}
      <section id="features" className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/0 via-zinc-900/50 to-zinc-900/0 pointer-events-none" />
        <div className="container mx-auto px-6 relative">
          <h2 className="text-3xl md:text-5xl font-bold mb-16 text-center">Everything You Need</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Users,
                title: 'Multi-School Profile',
                description: 'Link multiple children from different schools to a single parent account effortlessly.',
                color: 'text-blue-400',
                bg: 'bg-blue-500/10'
              },
              {
                icon: MessageSquare,
                title: 'Direct Messaging',
                description: 'Chat securely with teachers without sharing personal phone numbers.',
                color: 'text-purple-400',
                bg: 'bg-purple-500/10'
              },
              {
                icon: Calendar,
                title: 'Live Attendance',
                description: 'Get notified instantly if your child arrives late or is marked absent.',
                color: 'text-green-400',
                bg: 'bg-green-500/10'
              },
              {
                icon: GraduationCap,
                title: 'Homework Tracker',
                description: 'View pending assignments, due dates, and attachments in one place.',
                color: 'text-orange-400',
                bg: 'bg-orange-500/10'
              },
              {
                icon: Star,
                title: 'Performance Analytics',
                description: 'Visual graphs of your child\'s academic growth and attendance trends.',
                color: 'text-yellow-400',
                bg: 'bg-yellow-500/10'
              },
              {
                icon: ShieldCheck,
                title: 'Bank-Grade Security',
                description: 'Your family data is encrypted and protected with industry standards.',
                color: 'text-teal-400',
                bg: 'bg-teal-500/10'
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group p-8 rounded-3xl border border-white/5 bg-zinc-900/50 hover:bg-zinc-800/80 transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`inline-flex p-4 rounded-2xl ${feature.bg} mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`h-8 w-8 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works (Steps) */}
      <section id="how-it-works" className="py-24 bg-zinc-950">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-5xl font-bold mb-16 text-center">Get Started in 3 Steps</h2>

          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-blue-900 via-purple-900 to-blue-900" />

            {[
              { title: "Create Account", desc: "Sign up as a parent with your email.", step: "1" },
              { title: "Link Your Child", desc: "Enter the school code and student ID.", step: "2" },
              { title: "Stay Update", desc: "Get real-time alerts instantly.", step: "3" }
            ].map((item, i) => (
              <div key={i} className="relative flex flex-col items-center text-center z-10">
                <div className="w-24 h-24 rounded-full bg-zinc-900 border-4 border-black flex items-center justify-center text-2xl font-bold text-white mb-6 shadow-xl shadow-blue-900/20">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-gray-400 max-w-xs">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-5xl font-bold mb-16 text-center">Loved by Parents</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah M.",
                role: "Mother of 2",
                text: "Finally, I don't have to check 5 different emails to find my kids' homework. It's all in one place!"
              },
              {
                name: "James Wilson",
                role: "Father of 3",
                text: "The multiple school feature is a lifesaver. I have kids in elementary and high school, and this app handles both perfectly."
              },
              {
                name: "Priya Patel",
                role: "Parent",
                text: "I love the attendance alerts. I know exactly when my son reaches school. Peace of mind is priceless."
              }
            ].map((t, i) => (
              <div key={i} className="p-8 rounded-3xl bg-zinc-900/50 border border-white/5">
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map(s => <Star key={s} className="h-4 w-4 text-yellow-500 fill-yellow-500" />)}
                </div>
                <p className="text-gray-300 text-lg mb-6 leading-relaxed">"{t.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-600" />
                  <div>
                    <h4 className="font-bold text-white">{t.name}</h4>
                    <p className="text-xs text-gray-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 bg-zinc-950">
        <div className="container mx-auto px-6 max-w-3xl">
          <h2 className="text-3xl md:text-5xl font-bold mb-12 text-center">Frequently Asked Questions</h2>
          <div className="space-y-2">
            <FAQItem
              question="Can I add children from different schools?"
              answer="Yes! This is our core feature. As long as the schools use EduConnect, you can link all your children to a single parent account."
            />
            <FAQItem
              question="Is the app free for parents?"
              answer="Absolutely. The school covers the licensing costs. Parents get full access to the dashboard and mobile app for free."
            />
            <FAQItem
              question="How do I get my school code?"
              answer="Your school administration will provide you with a unique School Code and Student ID for each of your children."
            />
            <FAQItem
              question="Is my data secure?"
              answer="We use bank-grade encryption and strict privacy controls. Only you and authorized school staff can access your child's data."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 container mx-auto px-6">
        <div className="relative rounded-[3rem] overflow-hidden px-6 py-20 text-center">
          {/* CTA Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-purple-900" />
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20" /> {/* Texture placeholder */}

          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
              Ready to Simplify Your Life?
            </h2>
            <p className="text-xl text-blue-100 mb-10">
              Join thousands of happy parents and smart schools today.
            </p>
            <Link href="/signup">
              <Button size="lg" className="h-16 px-10 text-xl bg-white text-blue-900 hover:bg-blue-50 rounded-full font-bold shadow-2xl hover:scale-105 transition-transform">
                Create Parent Account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black pt-20 pb-10">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2 space-y-4">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-6 w-6 text-blue-500" />
                <span className="text-xl font-bold text-white">EduConnect</span>
              </div>
              <p className="text-gray-400 max-w-sm">
                The advanced multi-school management platform connecting parents, teachers, and students in one unified ecosystem.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-white mb-6">Platform</h4>
              <ul className="space-y-4 text-gray-400">
                <li><Link href="#" className="hover:text-blue-400 transition-colors">Features</Link></li>
                <li><Link href="#" className="hover:text-blue-400 transition-colors">For Schools</Link></li>
                <li><Link href="#" className="hover:text-blue-400 transition-colors">For Parents</Link></li>
                <li><Link href="#" className="hover:text-blue-400 transition-colors">Pricing</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-6">Support</h4>
              <ul className="space-y-4 text-gray-400">
                <li><Link href="#" className="hover:text-blue-400 transition-colors">Help Center</Link></li>
                <li><Link href="#" className="hover:text-blue-400 transition-colors">Contact Us</Link></li>
                <li><Link href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-blue-400 transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 text-center text-gray-600 text-sm">
            <p>© 2026 EduConnect Inc. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
