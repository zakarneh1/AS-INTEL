import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { 
    ChartLine, 
    Lightbulb, 
    Database, 
    ArrowRight,
    TrendUp,
    Users,
    Package,
    MapPin
} from '@phosphor-icons/react';

const features = [
    {
        icon: TrendUp,
        title: 'Revenue Analytics',
        description: 'Track R$13.6M+ in revenue trends across 20 months of real transaction data.'
    },
    {
        icon: Users,
        title: 'Customer Insights',
        description: 'Analyze 96,096 unique customers with RFM segmentation and behavior patterns.'
    },
    {
        icon: Package,
        title: 'Product Performance',
        description: 'Monitor 32,951 products across 73 categories with sales rankings.'
    },
    {
        icon: MapPin,
        title: 'Geographic Analysis',
        description: 'Visualize sales distribution across all 27 Brazilian states.'
    }
];

export default function Home() {
    return (
        <div className="page-container">
            {/* Hero Section */}
            <section className="hero-gradient grain-overlay">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
                    <div className="max-w-3xl">
                        <p className="section-label mb-4 animate-fade-in">
                            E-commerce Analytics Platform
                        </p>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter text-foreground mb-6 animate-fade-in stagger-1">
                            Salama Intelligence
                            <span className="text-primary block">Business Analytics</span>
                        </h1>
                        <p className="text-lg sm:text-xl text-muted-foreground mb-8 leading-relaxed animate-fade-in stagger-2">
                            Analyzing 99,441 real e-commerce orders from the Olist Brazilian marketplace. 
                            Transform raw transaction data into actionable insights for data-driven decisions.
                        </p>
                        <div className="flex flex-wrap gap-4 animate-fade-in stagger-3">
                            <Link to="/dashboard">
                                <Button 
                                    size="lg" 
                                    className="hover-lift gap-2"
                                    data-testid="view-dashboard-btn"
                                >
                                    <ChartLine size={20} weight="bold" />
                                    View Dashboard
                                </Button>
                            </Link>
                            <Link to="/insights">
                                <Button 
                                    variant="outline" 
                                    size="lg" 
                                    className="hover-lift gap-2"
                                    data-testid="explore-insights-btn"
                                >
                                    <Lightbulb size={20} weight="bold" />
                                    Explore Insights
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 lg:py-28">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-12">
                        <p className="section-label mb-3">Capabilities</p>
                        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                            Real Data, Real Insights
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <div 
                                    key={feature.title}
                                    className={`border border-border rounded-md p-6 bg-card card-hover animate-fade-in stagger-${index + 1}`}
                                    data-testid={`feature-card-${index}`}
                                >
                                    <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center mb-4">
                                        <Icon size={24} weight="duotone" className="text-primary" />
                                    </div>
                                    <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Data Source Section */}
            <section className="py-20 bg-muted/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-8 border border-border rounded-md p-8 lg:p-12 bg-card">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 rounded-md bg-primary/10 flex items-center justify-center">
                                <Database size={32} weight="duotone" className="text-primary" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-1">Powered by Real Data</h3>
                                <p className="text-muted-foreground">
                                    Kaggle Olist Brazilian E-commerce Dataset (2016-2018)
                                </p>
                            </div>
                        </div>
                        <Link to="/dashboard">
                            <Button size="lg" className="gap-2" data-testid="cta-dashboard-btn">
                                Explore Analytics
                                <ArrowRight size={18} weight="bold" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { value: '99.4K', label: 'Real Orders' },
                            { value: 'R$13.6M', label: 'Total Revenue' },
                            { value: '96K', label: 'Unique Customers' },
                            { value: '27', label: 'Brazilian States' },
                        ].map((stat, index) => (
                            <div 
                                key={stat.label} 
                                className={`text-center p-6 animate-fade-in stagger-${index + 1}`}
                                data-testid={`stat-${index}`}
                            >
                                <p className="kpi-value text-primary mb-2">{stat.value}</p>
                                <p className="text-sm text-muted-foreground">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
