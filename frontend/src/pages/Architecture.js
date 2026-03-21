import { 
    Database, 
    Code, 
    ChartBar, 
    Globe,
    ArrowRight,
    FileCode,
    Table,
    FlowArrow,
    FileCsv
} from '@phosphor-icons/react';

const architectureLayers = [
    {
        id: 1,
        title: 'Data Source',
        subtitle: 'Kaggle Olist Dataset',
        icon: FileCsv,
        color: 'bg-blue-500/10 text-blue-500',
        description: 'Brazilian e-commerce public dataset with 9 interconnected CSV files.',
        details: [
            '99,441 orders (2016-2018)',
            '96,096 unique customers',
            '32,951 unique products',
            '3,095 sellers'
        ]
    },
    {
        id: 2,
        title: 'Database Layer',
        subtitle: 'MongoDB',
        icon: Database,
        color: 'bg-green-500/10 text-green-500',
        description: 'NoSQL database for flexible document storage and fast analytical queries.',
        details: [
            'Document-based schema',
            'Async operations with Motor',
            'Aggregation pipelines',
            'Indexed collections'
        ]
    },
    {
        id: 3,
        title: 'Data Processing',
        subtitle: 'Python Analytics',
        icon: Code,
        color: 'bg-yellow-500/10 text-yellow-500',
        description: 'ETL pipelines for data transformation and statistical analysis.',
        details: [
            'Data cleaning & validation',
            'RFM segmentation',
            'Revenue aggregation',
            'Geographic analysis'
        ]
    },
    {
        id: 4,
        title: 'Visualization',
        subtitle: 'Recharts',
        icon: ChartBar,
        color: 'bg-purple-500/10 text-purple-500',
        description: 'Interactive React-based charts for KPIs and trend visualization.',
        details: [
            'Area & Line charts',
            'Bar charts (horizontal/vertical)',
            'Pie charts with legends',
            'Custom tooltips'
        ]
    },
    {
        id: 5,
        title: 'Web Application',
        subtitle: 'React + FastAPI',
        icon: Globe,
        color: 'bg-red-500/10 text-red-500',
        description: 'Modern full-stack application with responsive UI and RESTful API.',
        details: [
            'React 19 frontend',
            'FastAPI backend',
            'PDF/CSV exports',
            'Dark/Light mode'
        ]
    }
];

const datasetFiles = [
    { name: 'olist_orders_dataset.csv', rows: '99,441', description: 'Order information with timestamps and status' },
    { name: 'olist_order_items_dataset.csv', rows: '112,650', description: 'Products in each order with prices' },
    { name: 'olist_customers_dataset.csv', rows: '99,441', description: 'Customer location and unique IDs' },
    { name: 'olist_products_dataset.csv', rows: '32,951', description: 'Product details and categories' },
    { name: 'olist_order_payments_dataset.csv', rows: '103,886', description: 'Payment method and installments' },
    { name: 'olist_order_reviews_dataset.csv', rows: '99,224', description: 'Customer reviews and scores' },
    { name: 'olist_sellers_dataset.csv', rows: '3,095', description: 'Seller information and location' },
    { name: 'olist_geolocation_dataset.csv', rows: '1,000,163', description: 'Brazilian zip codes coordinates' },
];

export default function Architecture() {
    return (
        <div className="page-container">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-12">
                    <p className="section-label mb-2">Technical Overview</p>
                    <h1 className="text-3xl font-bold tracking-tight mb-4">System Architecture</h1>
                    <p className="text-muted-foreground max-w-2xl">
                        A comprehensive overview of the technical architecture powering AS Intel, 
                        from Olist data ingestion to interactive visualization.
                    </p>
                </div>

                {/* Architecture Diagram */}
                <div className="border border-border rounded-md p-6 lg:p-8 bg-card mb-12" data-testid="architecture-diagram">
                    <h2 className="font-semibold mb-6 flex items-center gap-2">
                        <FlowArrow size={20} weight="duotone" className="text-primary" />
                        System Components
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {architectureLayers.map((layer, index) => {
                            const Icon = layer.icon;
                            return (
                                <div 
                                    key={layer.id}
                                    className={`relative animate-fade-in stagger-${index + 1}`}
                                    data-testid={`architecture-layer-${layer.id}`}
                                >
                                    <div className="border border-border rounded-md p-4 bg-background h-full">
                                        <div className={`w-10 h-10 rounded-md ${layer.color} flex items-center justify-center mb-3`}>
                                            <Icon size={20} weight="duotone" />
                                        </div>
                                        <h3 className="font-semibold text-sm mb-1">{layer.title}</h3>
                                        <p className="text-xs text-muted-foreground mb-3">{layer.subtitle}</p>
                                        <ul className="space-y-1">
                                            {layer.details.slice(0, 3).map((detail, i) => (
                                                <li key={i} className="text-xs text-muted-foreground flex items-start gap-1">
                                                    <span className="text-primary mt-1">•</span>
                                                    {detail}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    {index < architectureLayers.length - 1 && (
                                        <div className="hidden lg:flex absolute top-1/2 -right-2 transform -translate-y-1/2 z-10">
                                            <ArrowRight size={16} className="text-muted-foreground" />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Dataset Files */}
                <div className="border border-border rounded-md p-6 lg:p-8 bg-card mb-12" data-testid="dataset-files">
                    <h2 className="font-semibold mb-6 flex items-center gap-2">
                        <FileCsv size={20} weight="duotone" className="text-primary" />
                        Olist Dataset Structure
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border">
                                    <th className="text-left py-3 px-4 font-medium text-muted-foreground uppercase tracking-wider text-xs">File Name</th>
                                    <th className="text-right py-3 px-4 font-medium text-muted-foreground uppercase tracking-wider text-xs">Rows</th>
                                    <th className="text-left py-3 px-4 font-medium text-muted-foreground uppercase tracking-wider text-xs">Description</th>
                                </tr>
                            </thead>
                            <tbody>
                                {datasetFiles.map((file, index) => (
                                    <tr key={file.name} className="border-b border-border/50 hover:bg-muted/50">
                                        <td className="py-3 px-4 font-mono text-xs">{file.name}</td>
                                        <td className="py-3 px-4 text-right font-mono text-xs text-primary">{file.rows}</td>
                                        <td className="py-3 px-4 text-muted-foreground text-xs">{file.description}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Tech Stack */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="border border-border rounded-md p-6 bg-card" data-testid="tech-stack">
                        <h2 className="font-semibold mb-4">Technology Stack</h2>
                        <div className="space-y-4">
                            {[
                                { category: 'Frontend', items: ['React 19', 'Tailwind CSS', 'Recharts', 'Shadcn/UI', 'jsPDF'] },
                                { category: 'Backend', items: ['FastAPI', 'Python 3.11', 'Pydantic', 'Motor (Async MongoDB)'] },
                                { category: 'Database', items: ['MongoDB', 'Aggregation Pipelines'] },
                                { category: 'Export', items: ['PDF Reports', 'CSV Downloads', 'Streaming Responses'] }
                            ].map((stack, index) => (
                                <div key={stack.category}>
                                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
                                        {stack.category}
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {stack.items.map((item) => (
                                            <span 
                                                key={item}
                                                className="px-2 py-1 text-xs rounded-md bg-muted font-mono"
                                            >
                                                {item}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="border border-border rounded-md p-6 bg-card" data-testid="api-endpoints">
                        <h2 className="font-semibold mb-4">API Endpoints</h2>
                        <div className="space-y-2">
                            {[
                                { method: 'GET', path: '/api/dashboard/kpis', desc: 'Key performance indicators' },
                                { method: 'GET', path: '/api/dashboard/revenue', desc: 'Monthly revenue data' },
                                { method: 'GET', path: '/api/dashboard/products', desc: 'Top product categories' },
                                { method: 'GET', path: '/api/dashboard/states', desc: 'Sales by Brazilian state' },
                                { method: 'GET', path: '/api/dashboard/segments', desc: 'Customer RFM segments' },
                                { method: 'GET', path: '/api/dashboard/payments', desc: 'Payment method breakdown' },
                                { method: 'GET', path: '/api/insights', desc: 'Business insights list' },
                                { method: 'POST', path: '/api/chat', desc: 'AI assistant chat' },
                                { method: 'GET', path: '/api/export/*/csv', desc: 'CSV export endpoints' },
                            ].map((endpoint) => (
                                <div key={endpoint.path} className="flex items-center gap-3 p-2 border border-border rounded-md bg-background">
                                    <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                                        endpoint.method === 'GET' ? 'bg-green-500/10 text-green-500' : 'bg-blue-500/10 text-blue-500'
                                    }`}>
                                        {endpoint.method}
                                    </span>
                                    <span className="font-mono text-xs flex-1">{endpoint.path}</span>
                                    <span className="text-xs text-muted-foreground">{endpoint.desc}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
