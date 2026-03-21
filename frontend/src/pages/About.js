import { 
    Target, 
    Lightbulb, 
    Wrench,
    CheckCircle,
    GithubLogo,
    LinkedinLogo,
    EnvelopeSimple,
    Database
} from '@phosphor-icons/react';
import { Button } from '../components/ui/button';

const skills = [
    { name: 'SQL', level: 90 },
    { name: 'Python', level: 85 },
    { name: 'Data Analysis', level: 88 },
    { name: 'Power BI / Tableau', level: 80 },
    { name: 'Excel / Sheets', level: 92 },
    { name: 'Web Development', level: 75 },
];

const tools = [
    { category: 'Data Analysis', items: ['Python', 'Pandas', 'NumPy', 'SQL', 'Excel'] },
    { category: 'Visualization', items: ['Recharts', 'Matplotlib', 'Seaborn', 'Power BI'] },
    { category: 'Database', items: ['MongoDB', 'PostgreSQL', 'MySQL'] },
    { category: 'Development', items: ['React', 'FastAPI', 'Git', 'Docker'] },
];

export default function About() {
    return (
        <div className="page-container">
            {/* Hero Section */}
            <section className="hero-gradient grain-overlay">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="max-w-3xl">
                        <p className="section-label mb-4">About This Project</p>
                        <h1 className="text-4xl sm:text-5xl font-black tracking-tighter mb-6">
                            AS Intelligence
                            <span className="text-primary block">Portfolio Project</span>
                        </h1>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            A comprehensive demonstration of data analysis, business intelligence, 
                            and full-stack development skills using real e-commerce data from Brazil's Olist marketplace.
                        </p>
                    </div>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* Data Source Highlight */}
                <div className="border border-primary/20 rounded-md p-6 bg-primary/5 mb-16 flex flex-col md:flex-row items-center gap-6">
                    <div className="w-16 h-16 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Database size={32} weight="duotone" className="text-primary" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg mb-1">Real Data from Kaggle</h3>
                        <p className="text-muted-foreground">
                            This project analyzes the <strong>Olist Brazilian E-commerce Dataset</strong> containing 
                            99,441 real orders from 2016-2018, including customer behavior, product performance, 
                            payment patterns, and geographic distribution across all 27 Brazilian states.
                        </p>
                    </div>
                </div>

                {/* Problem & Solution */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
                    <div className="border border-border rounded-md p-8 bg-card" data-testid="problem-section">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-md bg-red-500/10 flex items-center justify-center">
                                <Target size={24} weight="duotone" className="text-red-500" />
                            </div>
                            <h2 className="text-xl font-bold">The Problem</h2>
                        </div>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            E-commerce businesses generate massive amounts of data daily, but many struggle to:
                        </p>
                        <ul className="space-y-3">
                            {[
                                'Understand customer behavior and purchase patterns',
                                'Identify regional market opportunities',
                                'Optimize payment and fulfillment processes',
                                'Make data-driven strategic decisions'
                            ].map((item, index) => (
                                <li key={index} className="flex items-start gap-2 text-sm">
                                    <span className="text-red-500 mt-0.5">•</span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="border border-border rounded-md p-8 bg-card" data-testid="solution-section">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-md bg-green-500/10 flex items-center justify-center">
                                <Lightbulb size={24} weight="duotone" className="text-green-500" />
                            </div>
                            <h2 className="text-xl font-bold">The Solution</h2>
                        </div>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            AS Intel provides an end-to-end analytics solution that:
                        </p>
                        <ul className="space-y-3">
                            {[
                                'Processes 99K+ real orders with RFM customer segmentation',
                                'Visualizes KPIs through interactive dashboards',
                                'Generates actionable business insights with recommendations',
                                'Exports reports in PDF and CSV formats'
                            ].map((item, index) => (
                                <li key={index} className="flex items-start gap-2 text-sm">
                                    <CheckCircle size={16} weight="fill" className="text-green-500 mt-0.5" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Skills & Tools */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
                    <div className="border border-border rounded-md p-8 bg-card" data-testid="skills-section">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center">
                                <Wrench size={24} weight="duotone" className="text-primary" />
                            </div>
                            <h2 className="text-xl font-bold">Technical Skills</h2>
                        </div>
                        <div className="space-y-4">
                            {skills.map((skill) => (
                                <div key={skill.name}>
                                    <div className="flex justify-between mb-1">
                                        <span className="text-sm font-medium">{skill.name}</span>
                                        <span className="text-sm text-muted-foreground font-mono">{skill.level}%</span>
                                    </div>
                                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-primary rounded-full transition-all duration-500"
                                            style={{ width: `${skill.level}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="border border-border rounded-md p-8 bg-card" data-testid="tools-section">
                        <h2 className="text-xl font-bold mb-6">Tools & Technologies</h2>
                        <div className="space-y-6">
                            {tools.map((group) => (
                                <div key={group.category}>
                                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
                                        {group.category}
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {group.items.map((item) => (
                                            <span 
                                                key={item}
                                                className="px-3 py-1.5 text-sm rounded-md bg-muted border border-border"
                                            >
                                                {item}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Project Highlights */}
                <div className="border border-border rounded-md p-8 bg-card mb-16" data-testid="highlights-section">
                    <h2 className="text-xl font-bold mb-6">Project Highlights</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            { label: 'Orders Analyzed', value: '99,441' },
                            { label: 'Total Revenue', value: 'R$13.6M' },
                            { label: 'API Endpoints', value: '10+' },
                            { label: 'Business Insights', value: '6' },
                        ].map((stat, index) => (
                            <div key={stat.label} className="text-center p-4">
                                <p className="kpi-value text-2xl text-primary mb-1">{stat.value}</p>
                                <p className="text-sm text-muted-foreground">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Contact CTA */}
                <div className="border border-border rounded-md p-8 bg-card text-center" data-testid="contact-section">
                    <h2 className="text-xl font-bold mb-2">Interested in this work?</h2>
                    <p className="text-muted-foreground mb-6">
                        Let's connect and discuss how data analytics can drive business value.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Button variant="outline" className="gap-2" data-testid="github-btn">
                            <GithubLogo size={18} weight="bold" />
                            GitHub
                        </Button>
                        <Button variant="outline" className="gap-2" data-testid="linkedin-btn">
                            <LinkedinLogo size={18} weight="bold" />
                            LinkedIn
                        </Button>
                        <Button className="gap-2" data-testid="contact-btn">
                            <EnvelopeSimple size={18} weight="bold" />
                            Contact Me
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
