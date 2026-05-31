import {
    Database,
    Code,
    ChartBar,
    FileCsv,
    FlowArrow,
    FileCode,
} from '@phosphor-icons/react';

const architectureLayers = [
    {
        title: 'Data flow',
        icon: FlowArrow,
        color: 'bg-blue-500/10 text-blue-500',
        description: 'Raw Olist tables are loaded, joined, and normalized before any dashboard view is shown.',
        details: [
            'Orders, customers, payments, reviews, products, sellers, and geolocation are kept as separate source tables.',
            'The backend returns pre-aggregated responses for the dashboard and insights pages.',
            'Fallback data is available when the live API or database is unavailable.',
        ],
    },
    {
        title: 'Application structure',
        icon: FileCode,
        color: 'bg-purple-500/10 text-purple-500',
        description: 'React handles the presentation layer, with route-level pages for summary, dashboard, insights, and documentation.',
        details: [
            'Layout, routing, and theme state are handled on the frontend.',
            'Charts and filters are scoped to the dashboard page.',
            'The site uses clear fallback states when backend data is missing.',
        ],
    },
    {
        title: 'Processing',
        icon: Code,
        color: 'bg-yellow-500/10 text-yellow-500',
        description: 'Cleaning and summarization happen before the results are presented to the user.',
        details: [
            'State names and category values are standardized.',
            'Revenue and order totals are aggregated by period, region, and category.',
            'Segment and insight outputs are prepared for direct reporting use.',
        ],
    },
    {
        title: 'Storage',
        icon: Database,
        color: 'bg-green-500/10 text-green-500',
        description: 'MongoDB is an optional store, but the app still runs cleanly without it.',
        details: [
            'Motor handles async access when MongoDB is available.',
            'The backend is safe to run in read-only mode.',
            'The architecture supports both live querying and static fallback delivery.',
        ],
    },
    {
        title: 'Reporting layer',
        icon: ChartBar,
        color: 'bg-red-500/10 text-red-500',
        description: 'Outputs are written for stakeholders, not for internal debugging.',
        details: [
            'Executive summary on the homepage keeps the story short.',
            'Decision briefs on the insights page link findings to action.',
            'PDF and CSV exports keep the analysis portable.',
        ],
    },
];

const datasetFiles = [
    { name: 'olist_orders_dataset.csv', rows: '99,441', description: 'Order timestamps, status, and purchase lifecycle' },
    { name: 'olist_order_items_dataset.csv', rows: '112,650', description: 'Items, price, freight, and order composition' },
    { name: 'olist_customers_dataset.csv', rows: '99,441', description: 'Customer identifiers and location data' },
    { name: 'olist_products_dataset.csv', rows: '32,951', description: 'Product details and category structure' },
    { name: 'olist_order_payments_dataset.csv', rows: '103,886', description: 'Payment method and installment patterns' },
    { name: 'olist_order_reviews_dataset.csv', rows: '99,224', description: 'Review score and customer feedback' },
    { name: 'olist_sellers_dataset.csv', rows: '3,095', description: 'Seller identifiers and state information' },
    { name: 'olist_geolocation_dataset.csv', rows: '1,000,163', description: 'Brazilian postal-code coordinates' },
];

const ArchitectureCard = ({ layer, titleTag: TitleTag = 'h2', bodyClassName = '', testId }) => {
    const Icon = layer.icon;

    return (
        <div className={`border border-border rounded-md p-6 lg:p-8 bg-card h-full min-h-[240px] ${bodyClassName}`} data-testid={testId}>
            <div className="flex h-full flex-col gap-4">
                <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-md ${layer.color} flex items-center justify-center flex-shrink-0`}>
                        <Icon size={20} weight="duotone" />
                    </div>
                    <div className="min-w-0">
                        <TitleTag className="font-semibold text-lg mb-2">{layer.title}</TitleTag>
                        <p className="text-sm text-muted-foreground leading-relaxed">{layer.description}</p>
                    </div>
                </div>
                <ul className="space-y-2 flex-1">
                    {layer.details.map((detail) => (
                        <li key={detail} className="text-sm text-muted-foreground flex items-start gap-2 leading-relaxed">
                            <span className="text-primary mt-1">•</span>
                            <span>{detail}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default function Architecture() {
    return (
        <div className="page-container">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-12">
                    <p className="section-label mb-2">Technical Overview</p>
                    <h1 className="text-3xl font-bold tracking-tight mb-4">System Architecture</h1>
                    <p className="text-muted-foreground max-w-2xl">
                        A project document for reviewers who want to see how the analysis is structured, where the numbers come from, and how the result becomes a decision.
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row items-stretch gap-4 mb-12">
                    <ArchitectureCard
                        layer={architectureLayers[0]}
                        titleTag="h2"
                        bodyClassName="flex-1"
                        testId={`architecture-${architectureLayers[0].title.toLowerCase().replace(/ /g, '-')}`}
                    />
                    <div className="flex items-center justify-center px-2 py-2 lg:py-0">
                        <div className="rounded-full border border-border bg-background p-2 shadow-sm">
                            <span className="block text-sm font-semibold leading-none text-muted-foreground rotate-90 lg:rotate-0">→</span>
                        </div>
                    </div>
                    <ArchitectureCard
                        layer={architectureLayers[1]}
                        titleTag="h2"
                        bodyClassName="flex-1"
                        testId={`architecture-${architectureLayers[1].title.toLowerCase().replace(/ /g, '-')}`}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)] gap-4 mb-12 items-stretch">
                    <ArchitectureCard
                        layer={architectureLayers[2]}
                        titleTag="h3"
                        bodyClassName="flex-1"
                        testId={`architecture-${architectureLayers[2].title.toLowerCase().replace(/ /g, '-')}`}
                    />
                    <div className="hidden lg:flex items-center justify-center px-2">
                        <div className="rounded-full border border-border bg-background p-2 shadow-sm">
                            <span className="block text-sm font-semibold leading-none text-muted-foreground">→</span>
                        </div>
                    </div>
                    <ArchitectureCard
                        layer={architectureLayers[3]}
                        titleTag="h3"
                        bodyClassName="flex-1"
                        testId={`architecture-${architectureLayers[3].title.toLowerCase().replace(/ /g, '-')}`}
                    />
                    <div className="hidden lg:flex items-center justify-center px-2">
                        <div className="rounded-full border border-border bg-background p-2 shadow-sm">
                            <span className="block text-sm font-semibold leading-none text-muted-foreground">→</span>
                        </div>
                    </div>
                    <ArchitectureCard
                        layer={architectureLayers[4]}
                        titleTag="h3"
                        bodyClassName="flex-1"
                        testId={`architecture-${architectureLayers[4].title.toLowerCase().replace(/ /g, '-')}`}
                    />
                </div>

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
                                {datasetFiles.map((file) => (
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

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="border border-border rounded-md p-6 bg-card" data-testid="tech-stack">
                        <h2 className="font-semibold mb-4">Architecture stack</h2>
                        <div className="space-y-4">
                            {[
                                { category: 'Presentation layer', items: ['React Router', 'Route-based pages', 'Reusable UI blocks', 'Stateful filters'] },
                                { category: 'API layer', items: ['FastAPI', 'Pydantic validation', 'CORS handling', 'Response shaping'] },
                                { category: 'Data layer', items: ['MongoDB', 'Fallback datasets', 'Pre-aggregated metrics', 'Source-table joins'] },
                                { category: 'Delivery layer', items: ['jsPDF exports', 'CSV downloads', 'Local build pipeline', 'Deployment-ready static assets'] },
                            ].map((stack) => (
                                <div key={stack.category}>
                                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">{stack.category}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {stack.items.map((item) => (
                                            <span key={item} className="px-2 py-1 text-xs rounded-md bg-muted font-mono">{item}</span>
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
                                { method: 'POST', path: '/api/chat', desc: 'Analytics assistant chat' },
                                { method: 'GET', path: '/api/export/*/csv', desc: 'CSV export endpoints' },
                            ].map((endpoint) => (
                                <div key={endpoint.path} className="flex items-center gap-3 p-2 border border-border rounded-md bg-background">
                                    <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${endpoint.method === 'GET' ? 'bg-green-500/10 text-green-500' : 'bg-blue-500/10 text-blue-500'}`}>
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