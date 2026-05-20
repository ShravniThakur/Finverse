import Footer from "../components/Footer"
import { assets } from "../assets/assets"
import { useNavigate } from "react-router"
import AssetIcon from "../components/AssetIcon"

const Landing = () => {
    const navigate = useNavigate()

    const features = [
        { icon: assets.sidebar.Wallet, title: "Wallet", desc: "Your money, always in control. Track wallet balance, credits, debits, and view a complete transaction history." },
        { icon: assets.sidebar.Expenses, title: "Expenses", desc: "Know exactly where your money goes. Log expenses, categorize them, and monitor daily spending habits." },
        { icon: assets.sidebar.Budget, title: "Budgets", desc: "Plan smarter, spend better. Set budgets, track limits, and avoid overspending with clear insights." },
        { icon: assets.sidebar.SplitBill, title: "Splits", desc: "Fair and effortless bill splitting. Split expenses with friends or groups and keep track of who owes what." },
        { icon: assets.splitbill.SettleUp, title: "Settlements", desc: "Clear dues without confusion. Settle split balances seamlessly and record clean settlement transactions." },
        { icon: assets.dashboard.Monthly, title: "Insights", desc: "Turn data into decisions. Visualize spending with monthly charts and source-wise breakdowns." },
    ]

    const howItWorks = [
        { icon: assets.website.Arrow, step: "01", title: "Login", desc: "Secure access" },
        { icon: assets.sidebar.Wallet, step: "02", title: "Wallet", desc: "Manage funds" },
        { icon: assets.sidebar.Expenses, step: "03", title: "Expenses", desc: "Track spending" },
        { icon: assets.sidebar.Budget, step: "04", title: "Budgets", desc: "Stay in control" },
        { icon: assets.sidebar.SplitBill, step: "05", title: "Splits", desc: "Share bills easily" },
        { icon: assets.splitbill.SettleUp, step: "06", title: "Settle", desc: "Pay & receive" },
    ]

    const faqs = [
        { q: "What is Finverse?", a: "Finverse is a personal finance platform that helps you track wallet transactions, manage expenses, set budgets, and split bills seamlessly — all in one place." },
        { q: "Is my financial data secure?", a: "Yes. Your data is protected using industry-standard security practices, and sensitive information is never shared with third parties." },
        { q: "Can I split expenses with friends?", a: "Absolutely. Create groups, add expenses, and settle splits easily. Finverse keeps balances updated automatically." },
        { q: "Do I need a bank account?", a: "No. Finverse works with an in-app wallet and manual expense tracking, so you stay in control without linking a bank account." },
        { q: "Can I track spending over time?", a: "Yes. View detailed transaction history, monthly summaries, and visual charts to understand where your money goes." },
        { q: "Is Finverse free to use?", a: "Yes. All core features are available for free, with optional advanced features planned for the future." },
    ]

    const testimonials = [
        { name: "Riya Sharma", location: "Pune", text: "As a student managing my monthly allowance and group trips, Finverse has been a lifesaver. Splitting bills with friends is now so simple!" },
        { name: "Aditya Verma", location: "Bangalore", text: "Finverse keeps my finances organized effortlessly. I can track my wallet, expenses, and even plan budgets. It's like having a personal finance assistant." },
        { name: "Priya & Rohit Mehta", location: "Mumbai", text: "Our family outings are easier to manage now. Splitting expenses is transparent, and everyone stays updated. Stress-free financial planning!" },
    ]

    return (
        <div className="text-bodyText font-sans">
            {/* Hero */}
            <div className="relative min-h-screen flex items-center overflow-hidden">
                {/* Animated gradient orbs */}
                <div className="absolute top-20 left-1/4 w-96 h-96 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(127,90,240,0.2), transparent 70%)', filter: 'blur(40px)' }} />
                <div className="absolute bottom-20 right-1/4 w-80 h-80 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(75,42,133,0.25), transparent 70%)', filter: 'blur(40px)' }} />

                <div className="relative z-10 w-full px-6 sm:px-10 lg:px-16 py-20">
                    <div className="lg:flex gap-12 items-center max-w-7xl mx-auto">
                        {/* Left: Copy */}
                        <div className="mb-12 lg:mb-0 lg:flex-1">
                            <img src={assets.website.Finverse} className="w-48 mb-8 object-contain" alt="Finverse" />
                            <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight tracking-tight mb-6">
                                Finverse helps you track{' '}
                                <span className="text-[#7F5AF0]">transactions</span>,
                                manage{' '}
                                <span className="text-[#7F5AF0]">wallets</span>, and{' '}
                                <span className="text-[#7F5AF0]">split</span> expenses effortlessly.
                            </h1>
                            <p className="text-lg text-[#8888A0] mb-4 leading-relaxed">
                                Stay organized, stay in control, and settle payments with confidence.
                            </p>
                            <p className="text-base font-medium text-[#7F5AF0] mb-10">
                                Built for students, friends, and families who want clarity, not chaos.
                            </p>
                            <button
                                onClick={() => navigate('/login')}
                                className="btn-primary flex items-center gap-2 text-lg px-8 py-3"
                                style={{ boxShadow: '0 0 0 rgba(127,90,240,0.4)' }}
                                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 30px rgba(127,90,240,0.5)'}
                                onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
                            >
                                Get Started <AssetIcon src={assets.website.Arrow} size={18} />
                            </button>
                        </div>

                        {/* Right: Hero image */}
                        <div className="lg:flex-1 lg:max-w-lg">
                            <div className="glass-card p-2 rounded-2xl overflow-hidden">
                                <img src={assets.website.Landing} className="w-full rounded-xl" alt="Finverse App Preview" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features */}
            <section className="px-6 sm:px-10 lg:px-16 py-20 max-w-7xl mx-auto">
                <div className="text-center mb-14">
                    <p className="text-xs font-semibold text-[#7F5AF0] uppercase tracking-widest mb-3">Everything you need</p>
                    <h2 className="text-4xl font-bold text-white tracking-tight">Features</h2>
                    <p className="text-[#8888A0] mt-3 text-base">Track, split, budget, and grow your money — in one place.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {features.map(({ icon, title, desc }) => (
                        <div key={title} className="glass-card p-7 relative overflow-hidden flex flex-col gap-4">
                            {/* Top shimmer line */}
                            <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(to right, transparent, #7F5AF0, transparent)' }} />
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(127,90,240,0.15)' }}>
                                <AssetIcon src={icon} size={20} />
                            </div>
                            <p className="text-lg font-bold text-white">{title}</p>
                            <p className="text-sm text-[#8888A0] leading-relaxed">{desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* How It Works */}
            <section className="px-6 sm:px-10 lg:px-16 py-20" style={{ background: 'rgba(127,90,240,0.04)' }}>
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-14">
                        <p className="text-xs font-semibold text-[#7F5AF0] uppercase tracking-widest mb-3">Simple steps</p>
                        <h2 className="text-4xl font-bold text-white tracking-tight">How It Works</h2>
                        <p className="text-[#8888A0] mt-3 text-base">Smarter finance in just a few steps.</p>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                        {howItWorks.map(({ icon, step, title, desc }) => (
                            <div key={step} className="glass-card p-5 flex flex-col items-center gap-3 text-center">
                                <p className="text-xs font-bold text-[#7F5AF0] tracking-widest">{step}</p>
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(127,90,240,0.15)' }}>
                                    <AssetIcon src={icon} size={18} />
                                </div>
                                <p className="text-sm font-bold text-white">{title}</p>
                                <p className="text-xs text-[#8888A0]">{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Banner */}
            <section className="px-6 sm:px-10 lg:px-16 py-20 max-w-7xl mx-auto">
                <div className="glass-card p-10 sm:p-14 relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-8">
                    <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(to right, transparent, #7F5AF0, transparent)' }} />
                    <div className="absolute -top-20 -left-20 w-60 h-60 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(127,90,240,0.15), transparent 70%)', filter: 'blur(30px)' }} />
                    <div className="relative z-10">
                        <p className="text-2xl sm:text-3xl font-bold text-white leading-snug">
                            Get started with <span className="text-[#7F5AF0]">Finverse</span> and simplify the way you manage money.
                        </p>
                        <p className="text-[#8888A0] mt-3 text-base">Whether it's tracking daily expenses, managing your wallet, or settling group splits — Finverse keeps you in control.</p>
                    </div>
                    <button
                        onClick={() => navigate('/login')}
                        className="btn-primary flex items-center gap-2 text-base px-8 py-3 whitespace-nowrap relative z-10"
                        onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 30px rgba(127,90,240,0.5)'}
                        onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
                    >
                        Get Started <AssetIcon src={assets.website.Arrow} size={16} />
                    </button>
                </div>
            </section>

            {/* FAQs */}
            <section className="px-6 sm:px-10 lg:px-16 py-20" style={{ background: 'rgba(127,90,240,0.04)' }}>
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-14">
                        <p className="text-xs font-semibold text-[#7F5AF0] uppercase tracking-widest mb-3">Got questions?</p>
                        <h2 className="text-4xl font-bold text-white tracking-tight">FAQs</h2>
                        <p className="text-[#8888A0] mt-3 text-base">Everything you need to know, explained simply.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {faqs.map(({ q, a }) => (
                            <div key={q} className="glass-card p-6 relative overflow-hidden flex flex-col gap-3">
                                <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(to right, transparent, #7F5AF0, transparent)' }} />
                                <div className="flex items-start gap-3">
                                    <AssetIcon src={assets.website.Question} size={16} className="mt-0.5" />
                                    <p className="text-sm font-bold text-white">{q}</p>
                                </div>
                                <p className="text-sm text-[#8888A0] leading-relaxed pl-5">{a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="px-6 sm:px-10 lg:px-16 py-20 max-w-7xl mx-auto">
                <div className="text-center mb-14">
                    <p className="text-xs font-semibold text-[#7F5AF0] uppercase tracking-widest mb-3">Loved by users</p>
                    <h2 className="text-4xl font-bold text-white tracking-tight">Testimonials</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {testimonials.map(({ name, location, text }) => (
                        <div key={name} className="glass-card p-6 relative overflow-hidden flex flex-col gap-4">
                            <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(to right, transparent, #7F5AF0, transparent)' }} />
                            <div className="flex gap-1">
                                {[1,2,3,4,5].map(i => <AssetIcon key={i} src={assets.budget.TotalSaved} size={12} />)}
                            </div>
                            <p className="text-sm text-[#C4C4CF] leading-relaxed italic">"{text}"</p>
                            <div className="flex items-center gap-3 mt-auto pt-3" style={{ borderTop: '1px solid rgba(127,90,240,0.15)' }}>
                                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                                    style={{ background: 'linear-gradient(135deg, #7F5AF0, #4B2A85)' }}>
                                    {name[0]}
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-white">{name}</p>
                                    <p className="text-xs text-[#8888A0]">{location}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <Footer />
        </div>
    )
}

export default Landing
