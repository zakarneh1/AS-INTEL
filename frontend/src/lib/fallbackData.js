export const FALLBACK_KPIS = {
  total_revenue: 13591643.70,
  total_orders: 99441,
  total_customers: 96096,
  avg_order_value: 136.68,
  revenue_growth: 12.4,
  orders_growth: 8.7,
  customers_growth: 15.3,
  avg_review_score: 4.09,
  total_products: 32951,
  total_sellers: 3095,
};

export const FALLBACK_REVENUE_DATA = [
  { month: 'Jan', year: 2017, revenue: 148578.45, orders: 1087 },
  { month: 'Feb', year: 2017, revenue: 229541.23, orders: 1698 },
  { month: 'Mar', year: 2017, revenue: 349872.67, orders: 2567 },
  { month: 'Apr', year: 2017, revenue: 423156.89, orders: 3108 },
  { month: 'May', year: 2017, revenue: 567234.12, orders: 4156 },
  { month: 'Jun', year: 2017, revenue: 534892.78, orders: 3921 },
  { month: 'Jul', year: 2017, revenue: 612345.90, orders: 4489 },
  { month: 'Aug', year: 2017, revenue: 689123.45, orders: 5047 },
  { month: 'Sep', year: 2017, revenue: 723456.78, orders: 5301 },
  { month: 'Oct', year: 2017, revenue: 845678.90, orders: 6198 },
  { month: 'Nov', year: 2017, revenue: 1023456.78, orders: 7501 },
  { month: 'Dec', year: 2017, revenue: 876543.21, orders: 6425 },
  { month: 'Jan', year: 2018, revenue: 912345.67, orders: 6687 },
  { month: 'Feb', year: 2018, revenue: 834567.89, orders: 6117 },
  { month: 'Mar', year: 2018, revenue: 987654.32, orders: 7238 },
  { month: 'Apr', year: 2018, revenue: 1045678.90, orders: 7665 },
  { month: 'May', year: 2018, revenue: 1123456.78, orders: 8234 },
  { month: 'Jun', year: 2018, revenue: 1056789.12, orders: 7745 },
  { month: 'Jul', year: 2018, revenue: 1087654.32, orders: 7972 },
  { month: 'Aug', year: 2018, revenue: 1134567.89, orders: 8316 },
];

export const FALLBACK_PRODUCTS_DATA = [
  { category: 'bed_bath_table', sales: 11115, revenue: 1712345.67 },
  { category: 'health_beauty', sales: 9672, revenue: 1456789.12 },
  { category: 'sports_leisure', sales: 8641, revenue: 1234567.89 },
  { category: 'furniture_decor', sales: 8334, revenue: 1189234.56 },
  { category: 'computers_accessories', sales: 7827, revenue: 1098765.43 },
  { category: 'housewares', sales: 6964, revenue: 876543.21 },
];

export const FALLBACK_STATES_DATA = [
  { state: 'SP', state_name: 'São Paulo', sales: 41746, revenue: 5698234.56, customers: 40234 },
  { state: 'RJ', state_name: 'Rio de Janeiro', sales: 12852, revenue: 1756789.12, customers: 12389 },
  { state: 'MG', state_name: 'Minas Gerais', sales: 11635, revenue: 1589234.56, customers: 11234 },
  { state: 'RS', state_name: 'Rio Grande do Sul', sales: 5466, revenue: 746543.21, customers: 5267 },
  { state: 'PR', state_name: 'Paraná', sales: 5045, revenue: 689123.45, customers: 4867 },
];

export const FALLBACK_SEGMENTS_DATA = [
  { segment: 'Champions (High Value)', count: 9610, percentage: 10.0 },
  { segment: 'Loyal Customers', count: 14414, percentage: 15.0 },
  { segment: 'Potential Loyalists', count: 19219, percentage: 20.0 },
  { segment: 'New Customers', count: 24024, percentage: 25.0 },
  { segment: 'At Risk', count: 14414, percentage: 15.0 },
  { segment: 'Need Attention', count: 14415, percentage: 15.0 },
];

export const FALLBACK_PAYMENTS_DATA = [
  { payment_type: 'credit_card', count: 76795, total_value: 10456789.12, percentage: 73.9 },
  { payment_type: 'boleto', count: 19784, total_value: 2134567.89, percentage: 19.1 },
  { payment_type: 'voucher', count: 5775, total_value: 378234.56, percentage: 5.6 },
  { payment_type: 'debit_card', count: 1529, total_value: 621052.13, percentage: 1.5 },
];

export const FALLBACK_INSIGHTS_DATA = [
  { id: '1', title: 'São Paulo dominates with 42% of all orders', description: 'SP is #1 and generates 42% revenue', recommendation: 'Focus marketing in SP.', category: 'Geographic Analysis', impact: 'high', metric_value: '42% market share' },
  { id: '2', title: 'Top 20% customers generate 65% revenue', description: 'Heavy tail customers generate most revenue', recommendation: 'Launch VIP program.', category: 'Customer Segmentation', impact: 'high', metric_value: '65% revenue from 20%' },
];
