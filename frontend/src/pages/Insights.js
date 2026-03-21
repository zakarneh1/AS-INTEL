import { useState, useEffect } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { 
    Lightbulb, 
    TrendUp, 
    Users, 
    Package, 
    MapPin,
    ArrowRight,
    Lightning,
    CreditCard,
    DownloadSimple,
    FilePdf,
    FileCsv,
    Megaphone,
    Globe,
    Truck
} from '@phosphor-icons/react';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';
import { Button } from '../components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const categoryIcons = {
    'Geographic Analysis': MapPin,
    'Payment Analysis': CreditCard,
    'Product Analysis': Package,
    'Customer Satisfaction': Users,
    'Seasonal Analysis': TrendUp,
    'Customer Segmentation': Users,
    'Conversion Optimization': Lightning,
    'Marketing Analysis': Megaphone,
    'Channel Analysis': Globe,
    'Logistics Analysis': Truck,
};

const impactColors = {
    high: 'bg-red-500/10 text-red-500 border-red-500/20',
    medium: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    low: 'bg-green-500/10 text-green-500 border-green-500/20',
};

const InsightCard = ({ insight, index }) => {
    const Icon = categoryIcons[insight.category] || Lightbulb;
    
    return (
        <div 
            className={`insight-card animate-fade-in stagger-${(index % 6) + 1}`}
            data-testid={`insight-card-${insight.id}`}
        >
            <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Icon size={20} weight="duotone" className="text-primary" />
                    </div>
                    <div>
                        <p className="section-label">{insight.category}</p>
                        {insight.metric_value && (
                            <p className="text-xs font-mono text-primary font-medium">{insight.metric_value}</p>
                        )}
                    </div>
                </div>
                <Badge 
                    variant="outline" 
                    className={`${impactColors[insight.impact]} uppercase text-[10px] tracking-wider`}
                >
                    {insight.impact} impact
                </Badge>
            </div>
            
            <h3 className="text-lg font-semibold mb-3 leading-tight" data-testid={`insight-title-${insight.id}`}>
                {insight.title}
            </h3>
            
            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                {insight.description}
            </p>
            
            <div className="border-t border-border pt-4">
                <div className="flex items-start gap-2">
                    <ArrowRight size={16} weight="bold" className="text-primary mt-0.5 flex-shrink-0" />
                    <div>
                        <p className="text-xs font-medium uppercase tracking-wider text-primary mb-1">
                            Recommendation
                        </p>
                        <p className="text-sm text-foreground leading-relaxed">
                            {insight.recommendation}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const InsightSkeleton = () => (
    <div className="border border-border rounded-md p-6 bg-card">
        <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-md" />
                <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-5 w-20" />
        </div>
        <Skeleton className="h-6 w-full mb-3" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-3/4 mb-4" />
        <div className="border-t border-border pt-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3 mt-2" />
        </div>
    </div>
);

export default function Insights() {
    const [insights, setInsights] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        const fetchInsights = async () => {
            try {
                const response = await axios.get(`${API}/insights`);
                setInsights(response.data);
            } catch (error) {
                console.error('Error fetching insights:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchInsights();
    }, []);

    const handleExportPDF = () => {
        const doc = new jsPDF();
        
        // Title
        doc.setFontSize(20);
        doc.setTextColor(0, 47, 167);
        doc.text('Salama AS - Business Insights Report', 14, 20);
        
        // Subtitle
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text('Generated from Olist Brazilian E-commerce Dataset Analysis', 14, 28);
        doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 34);
        
        // Table data
        const tableData = insights.map((insight, index) => [
            index + 1,
            insight.category,
            insight.title,
            insight.impact.toUpperCase(),
            insight.metric_value || '-'
        ]);
        
        autoTable(doc, {
            startY: 45,
            head: [['#', 'Category', 'Insight', 'Impact', 'Metric']],
            body: tableData,
            styles: { fontSize: 8, cellPadding: 3 },
            headStyles: { fillColor: [0, 47, 167], textColor: 255 },
            columnStyles: {
                0: { cellWidth: 10 },
                1: { cellWidth: 35 },
                2: { cellWidth: 80 },
                3: { cellWidth: 20 },
                4: { cellWidth: 35 }
            }
        });
        
        // Detailed insights
        let yPos = doc.lastAutoTable.finalY + 15;
        
        insights.forEach((insight, index) => {
            if (yPos > 250) {
                doc.addPage();
                yPos = 20;
            }
            
            doc.setFontSize(11);
            doc.setTextColor(0, 47, 167);
            doc.text(`${index + 1}. ${insight.title}`, 14, yPos);
            
            yPos += 6;
            doc.setFontSize(9);
            doc.setTextColor(60, 60, 60);
            
            const descLines = doc.splitTextToSize(insight.description, 180);
            doc.text(descLines, 14, yPos);
            yPos += descLines.length * 4 + 4;
            
            doc.setTextColor(0, 120, 0);
            doc.text('Recommendation:', 14, yPos);
            yPos += 4;
            doc.setTextColor(60, 60, 60);
            const recLines = doc.splitTextToSize(insight.recommendation, 180);
            doc.text(recLines, 14, yPos);
            yPos += recLines.length * 4 + 10;
        });
        
        doc.save('salama_as_insights_report.pdf');
    };

    const handleExportCSV = () => {
        window.open(`${API}/export/insights/csv`, '_blank');
    };

    const filteredInsights = filter === 'all' 
        ? insights 
        : insights.filter(i => i.impact === filter);

    const categories = [...new Set(insights.map(i => i.category))];

    return (
        <div className="page-container">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
                    <div>
                        <p className="section-label mb-2">Business Intelligence</p>
                        <h1 className="text-3xl font-bold tracking-tight mb-4">Data-Driven Insights</h1>
                        <p className="text-muted-foreground max-w-2xl">
                            Key findings from analyzing the Olist e-commerce dataset, with actionable 
                            recommendations to improve business performance.
                        </p>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="gap-2" data-testid="export-btn">
                                <DownloadSimple size={18} />
                                Export
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={handleExportPDF} data-testid="export-pdf-btn">
                                <FilePdf size={16} className="mr-2" />
                                Download PDF
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleExportCSV} data-testid="export-csv-btn">
                                <FileCsv size={16} className="mr-2" />
                                Download CSV
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Stats Summary */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: 'Total Insights', value: insights.length },
                        { label: 'High Impact', value: insights.filter(i => i.impact === 'high').length },
                        { label: 'Categories', value: categories.length },
                        { label: 'Recommendations', value: insights.length },
                    ].map((stat, index) => (
                        <div 
                            key={stat.label}
                            className="border border-border rounded-md p-4 bg-card text-center"
                            data-testid={`insight-stat-${index}`}
                        >
                            <p className="kpi-value text-2xl text-primary">{stat.value}</p>
                            <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Filter Tabs */}
                <div className="flex flex-wrap gap-2 mb-8" data-testid="insight-filters">
                    {['all', 'high', 'medium', 'low'].map((filterOption) => (
                        <button
                            key={filterOption}
                            onClick={() => setFilter(filterOption)}
                            data-testid={`filter-${filterOption}`}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                                filter === filterOption
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                            }`}
                        >
                            {filterOption === 'all' ? 'All Insights' : `${filterOption.charAt(0).toUpperCase() + filterOption.slice(1)} Impact`}
                        </button>
                    ))}
                </div>

                {/* Insights Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-testid="insights-grid">
                    {loading ? (
                        <>
                            <InsightSkeleton />
                            <InsightSkeleton />
                            <InsightSkeleton />
                            <InsightSkeleton />
                        </>
                    ) : filteredInsights.length > 0 ? (
                        filteredInsights.map((insight, index) => (
                            <InsightCard key={insight.id} insight={insight} index={index} />
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12">
                            <Lightbulb size={48} className="text-muted-foreground mx-auto mb-4" />
                            <p className="text-muted-foreground">No insights found for the selected filter.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
