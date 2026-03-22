import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Area,
    AreaChart
} from 'recharts';
import {
    FALLBACK_KPIS,
    FALLBACK_REVENUE_DATA,
    FALLBACK_PRODUCTS_DATA,
    FALLBACK_STATES_DATA,
    FALLBACK_SEGMENTS_DATA,
    FALLBACK_PAYMENTS_DATA,
} from '../lib/fallbackData';
import { 
    CurrencyDollar, 
    ShoppingCart, 
    Users, 
    Star,
    TrendUp,
    TrendDown,
    Funnel,
    DownloadSimple,
    Storefront
} from '@phosphor-icons/react';
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from '../components/ui/select';
import { Skeleton } from '../components/ui/skeleton';
import { Button } from '../components/ui/button';
import { useTheme } from '../context/ThemeContext';

const normalizeBackendUrl = (url) => {
  const fallback = 'http://localhost:8000';
  if (!url || typeof url !== 'string') return `${fallback}/api`;
  const trimmed = url.trim().replace(/\/+$/, '');
  if (!trimmed) return `${fallback}/api`;
  if (trimmed.toLowerCase().endsWith('/api')) return trimmed;
  return `${trimmed}/api`;
};

const API_FALLBACK = 'https://as-intel.onrender.com';
const API = normalizeBackendUrl(process.env.REACT_APP_BACKEND_URL || API_FALLBACK);

const CHART_COLORS = {
    light: {
        primary: '#002FA7',
        secondary: '#10B981',
        tertiary: '#F59E0B',
        quaternary: '#8B5CF6',
        grid: '#E4E4E7',
        text: '#52525B'
    },
    dark: {
        primary: '#3B82F6',
        secondary: '#34D399',
        tertiary: '#FBBF24',
        quaternary: '#A78BFA',
        grid: '#27272A',
        text: '#A1A1AA'
    }
};

const PIE_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444', '#06B6D4'];

const KPICard = ({ title, value, change, icon: Icon, loading, prefix = '' }) => {
    const isPositive = change >= 0;
    
    if (loading) {
        return (
            <div className="border border-border rounded-md p-6 bg-card">
                <Skeleton className="h-4 w-24 mb-4" />
                <Skeleton className="h-10 w-32 mb-2" />
                <Skeleton className="h-4 w-20" />
            </div>
        );
    }

    return (
        <div className="border border-border rounded-md p-6 bg-card card-hover" data-testid={`kpi-${title.toLowerCase().replace(/ /g, '-')}`}>
            <div className="flex items-center justify-between mb-4">
                <span className="section-label">{title}</span>
                <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center">
                    <Icon size={20} weight="duotone" className="text-primary" />
                </div>
            </div>
            <p className="kpi-value mb-2" data-testid={`kpi-value-${title.toLowerCase().replace(/ /g, '-')}`}>
                {prefix}{value}
            </p>
            {change !== undefined && (
                <div className="flex items-center gap-1">
                    {isPositive ? (
                        <TrendUp size={16} weight="bold" className="text-green-500" />
                    ) : (
                        <TrendDown size={16} weight="bold" className="text-red-500" />
                    )}
                    <span className={`text-sm font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                        {isPositive ? '+' : ''}{change}%
                    </span>
                    <span className="text-sm text-muted-foreground ml-1">vs last period</span>
                </div>
            )}
        </div>
    );
};

// Custom tooltip component with better formatting
const RevenueTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="bg-card border border-border rounded-md p-4 shadow-lg">
                <p className="font-semibold text-foreground mb-2">{data.month} {data.year}</p>
                <div className="space-y-1">
                    <p className="text-sm">
                        <span className="text-muted-foreground">Revenue: </span>
                        <span className="font-mono font-medium text-primary">
                            R$ {data.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                    </p>
                    <p className="text-sm">
                        <span className="text-muted-foreground">Orders: </span>
                        <span className="font-mono font-medium">
                            {data.orders.toLocaleString('pt-BR')}
                        </span>
                    </p>
                    <p className="text-sm">
                        <span className="text-muted-foreground">Avg Order: </span>
                        <span className="font-mono font-medium">
                            R$ {(data.revenue / data.orders).toFixed(2)}
                        </span>
                    </p>
                </div>
            </div>
        );
    }
    return null;
};

const ProductTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="bg-card border border-border rounded-md p-4 shadow-lg">
                <p className="font-semibold text-foreground mb-2 capitalize">
                    {data.category.replace(/_/g, ' ')}
                </p>
                <div className="space-y-1">
                    <p className="text-sm">
                        <span className="text-muted-foreground">Orders: </span>
                        <span className="font-mono font-medium">{data.sales.toLocaleString('pt-BR')}</span>
                    </p>
                    <p className="text-sm">
                        <span className="text-muted-foreground">Revenue: </span>
                        <span className="font-mono font-medium text-primary">
                            R$ {data.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                    </p>
                </div>
            </div>
        );
    }
    return null;
};

const StateTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="bg-card border border-border rounded-md p-4 shadow-lg">
                <p className="font-semibold text-foreground mb-2">{data.state_name} ({data.state})</p>
                <div className="space-y-1">
                    <p className="text-sm">
                        <span className="text-muted-foreground">Revenue: </span>
                        <span className="font-mono font-medium text-primary">
                            R$ {data.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                    </p>
                    <p className="text-sm">
                        <span className="text-muted-foreground">Orders: </span>
                        <span className="font-mono font-medium">{data.sales.toLocaleString('pt-BR')}</span>
                    </p>
                    <p className="text-sm">
                        <span className="text-muted-foreground">Customers: </span>
                        <span className="font-mono font-medium">{data.customers.toLocaleString('pt-BR')}</span>
                    </p>
                </div>
            </div>
        );
    }
    return null;
};

export default function Dashboard() {
    const { theme } = useTheme();
    const colors = CHART_COLORS[theme];
    
    const [kpis, setKpis] = useState(FALLBACK_KPIS);
    const [revenueData, setRevenueData] = useState(FALLBACK_REVENUE_DATA);
    const [filteredRevenueData, setFilteredRevenueData] = useState(FALLBACK_REVENUE_DATA);
    const [productsData, setProductsData] = useState(FALLBACK_PRODUCTS_DATA);
    const [statesData, setStatesData] = useState(FALLBACK_STATES_DATA);
    const [filteredStatesData, setFilteredStatesData] = useState(FALLBACK_STATES_DATA);
    const [segmentsData, setSegmentsData] = useState(FALLBACK_SEGMENTS_DATA);
    const [paymentsData, setPaymentsData] = useState(FALLBACK_PAYMENTS_DATA);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // Filters
    const [year, setYear] = useState('all');
    const [state, setState] = useState('all');

useEffect(() => {
 const fetchData = async () => {
    setLoading(true);
    try {
        console.debug('[Dashboard] API base: ', API);
            axios.get(`${API}/dashboard/states`),
            axios.get(`${API}/dashboard/segments`),
            axios.get(`${API}/dashboard/payments`)
        ]);

        setKpis(kpisRes.data);
        setRevenueData(revenueRes.data);
        setFilteredRevenueData(revenueRes.data);
        setProductsData(productsRes.data);
        setStatesData(statesRes.data);
        setFilteredStatesData(statesRes.data);
        setSegmentsData(segmentsRes.data);
        setPaymentsData(paymentsRes.data);
        setError('');
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        const details = error.response?.data || error.message || String(error);
        setError(`Unable to load dashboard data from backend (${details}); using fallback. Please check console/network.`);
    } finally {
        setLoading(false);
    }
};

    fetchData();
}, []);

    // Filter revenue data when year changes
    useEffect(() => {
        if (year === 'all') {
            setFilteredRevenueData(revenueData);
        } else {
            setFilteredRevenueData(revenueData.filter(d => d.year === parseInt(year)));
        }
    }, [year, revenueData]);

    // Filter states data when state changes
    useEffect(() => {
        if (state === 'all') {
            setFilteredStatesData(statesData);
        } else {
            setFilteredStatesData(statesData.filter(d => d.state === state));
        }
    }, [state, statesData]);

    const downloadCsv = (rows, headers, filename) => {
        let csvContent = headers.join(',') + '\n';
        rows.forEach(row => {
            csvContent += row.map(val => `"${val}"`).join(',') + '\n';
        });
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleExportCSV = () => {
        if (!error) {
            window.open(`${API}/export/dashboard/csv`, '_blank');
            return;
        }

        const rows = revenueData.map(d => [
            d.month,
            d.year,
            d.revenue,
            d.orders,
        ]);

        downloadCsv(rows, ['month', 'year', 'revenue', 'orders'], 'salama_dashboard_fallback.csv');
    };

    const formatCurrency = (value) => {
        if (value >= 1000000) {
            return `R$${(value / 1000000).toFixed(2)}M`;
        }
        if (value >= 1000) {
            return `R$${(value / 1000).toFixed(1)}K`;
        }
        return `R$${value.toFixed(2)}`;
    };

    // Calculate filtered KPIs based on year
    const getFilteredKPIs = () => {
        if (!kpis) return null;
        
        if (year === 'all') {
            return kpis;
        }
        
        // Calculate totals for filtered year
        const yearData = revenueData.filter(d => d.year === parseInt(year));
        const totalRevenue = yearData.reduce((sum, d) => sum + d.revenue, 0);
        const totalOrders = yearData.reduce((sum, d) => sum + d.orders, 0);
        
        return {
            ...kpis,
            total_revenue: totalRevenue,
            total_orders: totalOrders,
            avg_order_value: totalOrders > 0 ? totalRevenue / totalOrders : 0,
        };
    };

    const displayKpis = getFilteredKPIs();

    return (
        <div className="page-container">
            {error && (
                <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-red-700">
                    <p className="font-semibold">{error}</p>
                    <p className="text-sm">Check backend URL and CORS in environment settings. Dashboard uses in-app fallback data until API is reachable.</p>
                </div>
            )}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div>
                        <p className="section-label mb-2">Olist Dataset Analytics</p>
                        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    </div>
                    <Button 
                        variant="outline" 
                        onClick={handleExportCSV}
                        className="gap-2"
                        data-testid="export-csv-btn"
                    >
                        <DownloadSimple size={18} />
                        Export Full Report
                    </Button>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-4 mb-8 p-4 border border-border rounded-md bg-card" data-testid="filters-container">
                    <div className="flex items-center gap-2">
                        <Funnel size={18} className="text-muted-foreground" />
                        <span className="text-sm font-medium">Filters:</span>
                    </div>
                    <Select value={year} onValueChange={setYear}>
                        <SelectTrigger className="w-[140px]" data-testid="filter-year">
                            <SelectValue placeholder="Year" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Years</SelectItem>
                            <SelectItem value="2017">2017</SelectItem>
                            <SelectItem value="2018">2018</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={state} onValueChange={setState}>
                        <SelectTrigger className="w-[180px]" data-testid="filter-state">
                            <SelectValue placeholder="State" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All States</SelectItem>
                            <SelectItem value="SP">São Paulo (SP)</SelectItem>
                            <SelectItem value="RJ">Rio de Janeiro (RJ)</SelectItem>
                            <SelectItem value="MG">Minas Gerais (MG)</SelectItem>
                            <SelectItem value="RS">Rio Grande do Sul (RS)</SelectItem>
                            <SelectItem value="PR">Paraná (PR)</SelectItem>
                            <SelectItem value="SC">Santa Catarina (SC)</SelectItem>
                            <SelectItem value="BA">Bahia (BA)</SelectItem>
                            <SelectItem value="DF">Distrito Federal (DF)</SelectItem>
                        </SelectContent>
                    </Select>
                    {(year !== 'all' || state !== 'all') && (
                        <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => { setYear('all'); setState('all'); }}
                            className="text-muted-foreground"
                        >
                            Clear Filters
                        </Button>
                    )}
                </div>

                {/* Active Filter Indicator */}
                {(year !== 'all' || state !== 'all') && (
                    <div className="mb-4 p-3 bg-primary/5 border border-primary/20 rounded-md">
                        <p className="text-sm text-primary font-medium">
                            Showing data for: {year !== 'all' ? year : 'All Years'}
                            {state !== 'all' && ` • ${statesData.find(s => s.state === state)?.state_name || state}`}
                        </p>
                    </div>
                )}

                {/* KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                    <KPICard
                        title="Total Revenue"
                        value={displayKpis ? formatCurrency(displayKpis.total_revenue) : '-'}
                        change={year === 'all' ? displayKpis?.revenue_growth : undefined}
                        icon={CurrencyDollar}
                        loading={loading}
                    />
                    <KPICard
                        title="Total Orders"
                        value={displayKpis ? displayKpis.total_orders.toLocaleString() : '-'}
                        change={year === 'all' ? displayKpis?.orders_growth : undefined}
                        icon={ShoppingCart}
                        loading={loading}
                    />
                    <KPICard
                        title="Customers"
                        value={displayKpis ? displayKpis.total_customers.toLocaleString() : '-'}
                        change={year === 'all' ? displayKpis?.customers_growth : undefined}
                        icon={Users}
                        loading={loading}
                    />
                    <KPICard
                        title="Avg Review"
                        value={displayKpis ? displayKpis.avg_review_score.toFixed(2) : '-'}
                        icon={Star}
                        loading={loading}
                    />
                    <KPICard
                        title="Sellers"
                        value={displayKpis ? displayKpis.total_sellers.toLocaleString() : '-'}
                        icon={Storefront}
                        loading={loading}
                    />
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Revenue Over Time */}
                    <div className="border border-border rounded-md p-6 bg-card" data-testid="chart-revenue">
                        <h3 className="font-semibold mb-1">Revenue Over Time</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Monthly revenue {year !== 'all' ? `for ${year}` : '(2017-2018)'}
                            {filteredRevenueData.length > 0 && (
                                <span className="ml-2 text-primary font-mono">
                                    Total: R$ {filteredRevenueData.reduce((sum, d) => sum + d.revenue, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </span>
                            )}
                        </p>
                        {loading ? (
                            <Skeleton className="h-[300px] w-full" />
                        ) : (
                            <ResponsiveContainer width="100%" height={300}>
                                <AreaChart data={filteredRevenueData}>
                                    <defs>
                                        <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor={colors.primary} stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor={colors.primary} stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} vertical={false} />
                                    <XAxis 
                                        dataKey="month" 
                                        stroke={colors.text} 
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis 
                                        stroke={colors.text} 
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value) => `R$${(value/1000).toFixed(0)}K`}
                                    />
                                    <Tooltip content={<RevenueTooltip />} />
                                    <Area 
                                        type="monotone" 
                                        dataKey="revenue" 
                                        name="Revenue"
                                        stroke={colors.primary} 
                                        strokeWidth={2}
                                        fill="url(#revenueGradient)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        )}
                    </div>

                    {/* Top Categories */}
                    <div className="border border-border rounded-md p-6 bg-card" data-testid="chart-products">
                        <h3 className="font-semibold mb-1">Top Product Categories</h3>
                        <p className="text-sm text-muted-foreground mb-4">Best performing categories by order count</p>
                        {loading ? (
                            <Skeleton className="h-[300px] w-full" />
                        ) : (
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={productsData.slice(0, 6)} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} horizontal={false} />
                                    <XAxis 
                                        type="number" 
                                        stroke={colors.text} 
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value) => value.toLocaleString()}
                                    />
                                    <YAxis 
                                        type="category" 
                                        dataKey="category" 
                                        stroke={colors.text} 
                                        fontSize={10}
                                        tickLine={false}
                                        axisLine={false}
                                        width={100}
                                        tickFormatter={(value) => value.replace(/_/g, ' ')}
                                    />
                                    <Tooltip content={<ProductTooltip />} />
                                    <Bar 
                                        dataKey="sales" 
                                        name="Orders"
                                        fill={colors.primary} 
                                        radius={[0, 4, 4, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>

                    {/* Sales by State */}
                    <div className="border border-border rounded-md p-6 bg-card" data-testid="chart-states">
                        <h3 className="font-semibold mb-1">Sales by State</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Revenue distribution {state !== 'all' ? `- ${statesData.find(s => s.state === state)?.state_name}` : 'across Brazilian states'}
                        </p>
                        {loading ? (
                            <Skeleton className="h-[300px] w-full" />
                        ) : (
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={filteredStatesData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} vertical={false} />
                                    <XAxis 
                                        dataKey="state" 
                                        stroke={colors.text} 
                                        fontSize={11}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis 
                                        stroke={colors.text} 
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value) => `R$${(value/1000000).toFixed(1)}M`}
                                    />
                                    <Tooltip content={<StateTooltip />} />
                                    <Bar 
                                        dataKey="revenue" 
                                        name="Revenue"
                                        fill={colors.secondary} 
                                        radius={[4, 4, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>

                    {/* Customer Segmentation */}
                    <div className="border border-border rounded-md p-6 bg-card" data-testid="chart-segments">
                        <h3 className="font-semibold mb-1">Customer Segmentation (RFM)</h3>
                        <p className="text-sm text-muted-foreground mb-4">Distribution by customer value tier</p>
                        {loading ? (
                            <Skeleton className="h-[300px] w-full" />
                        ) : (
                            <div className="flex items-center">
                                <ResponsiveContainer width="55%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={segmentsData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={50}
                                            outerRadius={90}
                                            paddingAngle={2}
                                            dataKey="percentage"
                                            nameKey="segment"
                                        >
                                            {segmentsData.map((entry, index) => (
                                                <Cell 
                                                    key={`cell-${index}`} 
                                                    fill={PIE_COLORS[index % PIE_COLORS.length]} 
                                                />
                                            ))}
                                        </Pie>
                                        <Tooltip 
                                            formatter={(value, name) => [`${value}%`, name]}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="w-[45%] space-y-2">
                                    {segmentsData.map((segment, index) => (
                                        <div key={segment.segment} className="flex items-center gap-2">
                                            <div 
                                                className="w-2.5 h-2.5 rounded-sm flex-shrink-0" 
                                                style={{ backgroundColor: PIE_COLORS[index] }}
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[10px] text-muted-foreground truncate">{segment.segment}</p>
                                                <p className="text-xs font-medium font-mono">{segment.percentage}%</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Payment Methods */}
                <div className="border border-border rounded-md p-6 bg-card" data-testid="chart-payments">
                    <h3 className="font-semibold mb-1">Payment Methods</h3>
                    <p className="text-sm text-muted-foreground mb-4">Distribution of payment types used by customers</p>
                    {loading ? (
                        <Skeleton className="h-[100px] w-full" />
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {paymentsData.map((payment, index) => (
                                <div key={payment.payment_type} className="p-4 border border-border rounded-md bg-background">
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                                        {payment.payment_type.replace(/_/g, ' ')}
                                    </p>
                                    <p className="text-2xl font-bold font-mono text-primary">{payment.percentage}%</p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {payment.count.toLocaleString()} orders
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        R$ {(payment.total_value / 1000000).toFixed(2)}M
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
