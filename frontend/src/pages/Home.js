import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { ChartLine, CheckCircle, Lightbulb } from '@phosphor-icons/react';

const headlineMetrics = [
    {
        value: 'R$13.6M',
        label: 'Revenue reviewed',
        context: 'Used to separate seasonality from longer-term change.',
    },
    {
        value: '99,441',
        label: 'Orders analyzed',
        context: 'Enough volume to compare regions, products, and customers.',
    },
    {
        value: '96,096',
        label: 'Customers tracked',
        context: 'Repeat buying and concentration are visible in the data.',
    },
];

const executiveFindings = [
    {
        title: 'Revenue is concentrated, not evenly spread',
        text: 'São Paulo and the southeast carry most of the revenue.',
    },
    {
        title: 'A small customer base carries a large share of revenue',
        text: 'The strongest customers deserve retention work; first-time buyers need follow-up.',
    },
    {
        title: 'Seasonality is visible in the monthly trend',
        text: 'Planning should happen before the peak, not after it.',
    },
];

const methodologySteps = [
    {
        title: 'Source',
        text: 'Kaggle Olist dataset across orders, customers, products, payments, reviews, sellers, and geolocation.',
    },
    {
        title: 'Preparation',
        text: 'Joined the source tables and standardized state and category values.',
    },
    {
        title: 'Cleaning',
        text: 'Removed duplicates, checked dates, and handled missing values separately from zeros.',
    },
    {
        title: 'Validation',
        text: 'Checked totals, monthly revenue, and fallback behavior.',
    },
    {
        title: 'Limits',
        text: 'The dataset shows marketplace behavior, not every upstream constraint.',
    },
];

const caseStudies = [
    {
        title: 'Customer retention',
        question: 'Which customers should be kept active?',
        signal: 'Repeat buyers and high-value customers are not evenly distributed.',
        evidence: 'RFM-style review separates a small, high-value cluster from the broader first-time buyer base.',
        implication: 'Retention work should start with the highest-value group, then move to new customers in the first 30 days.',
        recommendation: 'Prioritize loyalty touches and early follow-up instead of treating every buyer the same.',
    },
    {
        title: 'Revenue trends and seasonality',
        question: 'When should operations prepare for demand spikes?',
        signal: 'Revenue and order volume climb in a way that suggests a predictable second-half peak.',
        evidence: 'The monthly trend rises toward the end of the year rather than staying flat.',
        implication: 'Planning should happen before the spike reaches the operation, not after it appears.',
        recommendation: 'Align inventory, carrier capacity, and campaign timing ahead of the seasonal peak.',
    },
    {
        title: 'Regional performance',
        question: 'Where is the business too concentrated?',
        signal: 'Revenue, orders, and customers are heavily weighted to one dominant region.',
        evidence: 'State-level performance shows São Paulo and the southeast carrying most of the business.',
        implication: 'Growth is exposed if the strongest geography slows down.',
        recommendation: 'Defend the top states while testing smaller regional bets to reduce concentration risk.',
    },
    {
        title: 'Payment behavior',
        question: 'Which payment methods matter most?',
        signal: 'Checkout behavior is driven by one dominant method, with a secondary method still meaningful.',
        evidence: 'Credit card clearly leads, while boleto remains relevant enough to affect conversion and cash flow.',
        implication: 'Payment design should optimize for the dominant method without ignoring the fallback option.',
        recommendation: 'Keep the checkout path simple and test boleto nudges carefully where conversion is at risk.',
    },
];

export default function Home() {
    return (
        <div className="page-container">
            <section className="relative overflow-hidden min-h-[90vh] flex items-center bg-black">
                <video
                    className="absolute inset-0 h-full w-full object-cover scale-[1.01]"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    aria-hidden="true"
                >
                    <source src="/Network%20hero%20page.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-slate-950/70" />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/65 to-slate-950/25" />

                <div className="relative z-10 w-full">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
                        <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
                            <div className="lg:col-span-7 max-w-3xl text-white">
                                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/60 animate-fade-in">Project snapshot</p>
                                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight mt-4 mb-4 animate-fade-in stagger-1">
                                    Olist marketplace analysis
                                    <span className="text-cyan-300 block">Revenue, customers, regions</span>
                                </h1>
                                <p className="text-base sm:text-lg text-white/78 mb-7 leading-relaxed animate-fade-in stagger-2 max-w-2xl">
                                    A concise overview of revenue concentration, customer value, and regional patterns across 99,441 orders.
                                </p>
                                <div className="flex flex-wrap gap-4 animate-fade-in stagger-3">
                                    <Link to="/dashboard">
                                        <Button size="lg" className="hover-lift gap-2 bg-white text-slate-950 transition-all duration-300 hover:bg-white/90" data-testid="view-dashboard-btn">
                                            <ChartLine size={20} weight="bold" />
                                            Review dashboard
                                        </Button>
                                    </Link>
                                    <Link to="/insights">
                                        <Button variant="outline" size="lg" className="hover-lift gap-2 border-white/30 bg-white/5 text-white transition-all duration-300 hover:bg-white/10" data-testid="explore-insights-btn">
                                            <Lightbulb size={20} weight="bold" />
                                            Open case studies
                                        </Button>
                                    </Link>
                                </div>
                            </div>

                            <div className="lg:col-span-5 animate-fade-in stagger-2">
                                <div className="rounded-2xl border border-white/15 bg-white/10 p-4 sm:p-5 backdrop-blur-xl shadow-2xl transition-all duration-300 hover:border-white/25 hover:bg-white/12">
                                    <div className="flex items-center justify-between gap-4 mb-4">
                                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/65">At a glance</p>
                                    </div>
                                    <div className="grid gap-3">
                                        {headlineMetrics.map((metric, index) => (
                                            <div
                                                key={metric.label}
                                                className={`rounded-xl border border-white/12 bg-slate-950/20 p-4 text-white transition-all duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/10 animate-fade-in stagger-${index + 1}`}
                                            >
                                                <p className="font-mono text-2xl sm:text-3xl font-bold tracking-tight text-cyan-300 mb-1">{metric.value}</p>
                                                <p className="font-medium text-sm mb-1">{metric.label}</p>
                                                <p className="text-xs sm:text-sm text-white/70 leading-relaxed">{metric.context}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-16 lg:py-20 border-t border-border/60">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-8 max-w-2xl animate-fade-in">
                        <p className="section-label mb-3">Key takeaways</p>
                        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">Three signals to know first.</h2>
                        <p className="text-muted-foreground leading-relaxed">This page is meant to read cleanly in a few seconds.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {executiveFindings.map((item, index) => (
                            <div key={item.title} className={`border border-border rounded-md bg-card p-5 h-full card-hover transition-all duration-300 animate-fade-in stagger-${index + 1}`}>
                                <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center mb-4 transition-all duration-300">
                                    <CheckCircle size={20} weight="fill" className="text-primary" />
                                </div>
                                <h3 className="font-semibold text-lg mb-2 leading-snug">{item.title}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">{item.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-16 bg-muted/20 border-y border-border/60">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        <div className="lg:col-span-4 animate-fade-in">
                            <p className="section-label mb-3">Methodology</p>
                            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">Simple process</h2>
                            <p className="text-muted-foreground leading-relaxed">Source, cleaning, validation, limits.</p>
                        </div>
                        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {methodologySteps.map((step, index) => (
                                <div key={step.title} className={`border border-border rounded-md bg-card p-4 h-full transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 card-hover animate-fade-in stagger-${(index % 6) + 1}`}>
                                    <p className="text-xs uppercase tracking-wider text-primary font-semibold mb-1">{step.title}</p>
                                    <p className="text-sm text-muted-foreground leading-relaxed">{step.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-16 border-b border-border/60">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-8">
                        <div>
                            <p className="section-label mb-3">Case studies</p>
                            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Analytical case notes</h2>
                        </div>
                        <p className="text-muted-foreground max-w-2xl">Each case shows the question, the finding, and the next move.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {caseStudies.map((study, index) => (
                            <article key={study.title} className={`border border-border rounded-md bg-card p-6 h-full card-hover transition-all duration-300 animate-fade-in stagger-${(index % 6) + 1}`}>
                                <div className="flex items-start justify-between gap-4 mb-3">
                                    <p className="section-label">Case {index + 1}</p>
                                    <span className="text-xs uppercase tracking-wider text-muted-foreground text-right">{study.title}</span>
                                </div>
                                <h3 className="text-lg sm:text-xl font-semibold mb-4 leading-tight">{study.question}</h3>
                                <div className="space-y-3 text-sm leading-relaxed">
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-1">Signal</p>
                                        <p className="text-muted-foreground">{study.signal}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-1">Evidence</p>
                                        <p className="text-muted-foreground">{study.evidence}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-1">Implication</p>
                                        <p className="text-muted-foreground">{study.implication}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-1">Next move</p>
                                        <p className="text-foreground">{study.recommendation}</p>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}