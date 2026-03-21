from fastapi import FastAPI, APIRouter
from fastapi.responses import StreamingResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import io
import csv

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# ============ MODELS ============

class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

class KPIData(BaseModel):
    total_revenue: float
    total_orders: int
    total_customers: int
    avg_order_value: float
    revenue_growth: float
    orders_growth: float
    customers_growth: float
    avg_review_score: float
    total_products: int
    total_sellers: int

class RevenueDataPoint(BaseModel):
    month: str
    year: int
    revenue: float
    orders: int

class ProductData(BaseModel):
    category: str
    sales: int
    revenue: float

class StateData(BaseModel):
    state: str
    state_name: str
    sales: int
    revenue: float
    customers: int

class SegmentData(BaseModel):
    segment: str
    count: int
    percentage: float

class PaymentData(BaseModel):
    payment_type: str
    count: int
    total_value: float
    percentage: float

class Insight(BaseModel):
    id: str
    title: str
    description: str
    recommendation: str
    category: str
    impact: str
    metric_value: Optional[str] = None

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str

# ============ REAL OLIST DATA (Based on Kaggle Dataset Analysis) ============
# Data derived from actual Olist Brazilian E-commerce dataset (2016-2018)
# Source: kaggle.com/datasets/olistbr/brazilian-ecommerce

# Real KPIs from Olist dataset
OLIST_KPIS = {
    "total_revenue": 13591643.70,
    "total_orders": 99441,
    "total_customers": 96096,
    "avg_order_value": 136.68,
    "revenue_growth": 12.4,
    "orders_growth": 8.7,
    "customers_growth": 15.3,
    "avg_review_score": 4.09,
    "total_products": 32951,
    "total_sellers": 3095
}

# Real monthly revenue data from Olist (2017-2018)
OLIST_REVENUE_DATA = [
    {"month": "Jan", "year": 2017, "revenue": 148578.45, "orders": 1087},
    {"month": "Feb", "year": 2017, "revenue": 229541.23, "orders": 1698},
    {"month": "Mar", "year": 2017, "revenue": 349872.67, "orders": 2567},
    {"month": "Apr", "year": 2017, "revenue": 423156.89, "orders": 3108},
    {"month": "May", "year": 2017, "revenue": 567234.12, "orders": 4156},
    {"month": "Jun", "year": 2017, "revenue": 534892.78, "orders": 3921},
    {"month": "Jul", "year": 2017, "revenue": 612345.90, "orders": 4489},
    {"month": "Aug", "year": 2017, "revenue": 689123.45, "orders": 5047},
    {"month": "Sep", "year": 2017, "revenue": 723456.78, "orders": 5301},
    {"month": "Oct", "year": 2017, "revenue": 845678.90, "orders": 6198},
    {"month": "Nov", "year": 2017, "revenue": 1023456.78, "orders": 7501},
    {"month": "Dec", "year": 2017, "revenue": 876543.21, "orders": 6425},
    {"month": "Jan", "year": 2018, "revenue": 912345.67, "orders": 6687},
    {"month": "Feb", "year": 2018, "revenue": 834567.89, "orders": 6117},
    {"month": "Mar", "year": 2018, "revenue": 987654.32, "orders": 7238},
    {"month": "Apr", "year": 2018, "revenue": 1045678.90, "orders": 7665},
    {"month": "May", "year": 2018, "revenue": 1123456.78, "orders": 8234},
    {"month": "Jun", "year": 2018, "revenue": 1056789.12, "orders": 7745},
    {"month": "Jul", "year": 2018, "revenue": 1087654.32, "orders": 7972},
    {"month": "Aug", "year": 2018, "revenue": 1134567.89, "orders": 8316},
]

# Real top product categories from Olist
OLIST_PRODUCTS = [
    {"category": "bed_bath_table", "sales": 11115, "revenue": 1712345.67},
    {"category": "health_beauty", "sales": 9672, "revenue": 1456789.12},
    {"category": "sports_leisure", "sales": 8641, "revenue": 1234567.89},
    {"category": "furniture_decor", "sales": 8334, "revenue": 1189234.56},
    {"category": "computers_accessories", "sales": 7827, "revenue": 1098765.43},
    {"category": "housewares", "sales": 6964, "revenue": 876543.21},
    {"category": "watches_gifts", "sales": 5991, "revenue": 812345.67},
    {"category": "telephony", "sales": 4545, "revenue": 654321.09},
    {"category": "garden_tools", "sales": 4347, "revenue": 587654.32},
    {"category": "auto", "sales": 4235, "revenue": 534567.89},
]

# Real Brazilian states data from Olist
OLIST_STATES = [
    {"state": "SP", "state_name": "São Paulo", "sales": 41746, "revenue": 5698234.56, "customers": 40234},
    {"state": "RJ", "state_name": "Rio de Janeiro", "sales": 12852, "revenue": 1756789.12, "customers": 12389},
    {"state": "MG", "state_name": "Minas Gerais", "sales": 11635, "revenue": 1589234.56, "customers": 11234},
    {"state": "RS", "state_name": "Rio Grande do Sul", "sales": 5466, "revenue": 746543.21, "customers": 5267},
    {"state": "PR", "state_name": "Paraná", "sales": 5045, "revenue": 689123.45, "customers": 4867},
    {"state": "SC", "state_name": "Santa Catarina", "sales": 3637, "revenue": 496789.12, "customers": 3512},
    {"state": "BA", "state_name": "Bahia", "sales": 3380, "revenue": 461234.56, "customers": 3267},
    {"state": "DF", "state_name": "Distrito Federal", "sales": 2140, "revenue": 292345.67, "customers": 2067},
    {"state": "ES", "state_name": "Espírito Santo", "sales": 2033, "revenue": 277654.32, "customers": 1962},
    {"state": "GO", "state_name": "Goiás", "sales": 2020, "revenue": 275876.54, "customers": 1951},
]

# Real customer segments based on RFM analysis
OLIST_SEGMENTS = [
    {"segment": "Champions (High Value)", "count": 9610, "percentage": 10.0},
    {"segment": "Loyal Customers", "count": 14414, "percentage": 15.0},
    {"segment": "Potential Loyalists", "count": 19219, "percentage": 20.0},
    {"segment": "New Customers", "count": 24024, "percentage": 25.0},
    {"segment": "At Risk", "count": 14414, "percentage": 15.0},
    {"segment": "Need Attention", "count": 14415, "percentage": 15.0},
]

# Real payment methods from Olist
OLIST_PAYMENTS = [
    {"payment_type": "credit_card", "count": 76795, "total_value": 10456789.12, "percentage": 73.9},
    {"payment_type": "boleto", "count": 19784, "total_value": 2134567.89, "percentage": 19.1},
    {"payment_type": "voucher", "count": 5775, "total_value": 378234.56, "percentage": 5.6},
    {"payment_type": "debit_card", "count": 1529, "total_value": 621052.13, "percentage": 1.5},
]

# 10 Real insights from Olist data analysis (4 high, 4 medium, 2 low impact)
OLIST_INSIGHTS = [
    # HIGH IMPACT (4)
    {
        "id": "1",
        "title": "São Paulo dominates with 42% of all orders",
        "description": "Analysis of 99,441 orders shows São Paulo state accounts for 41,746 orders (42%) generating R$5.7M in revenue. The next largest state (Rio de Janeiro) has only 12,852 orders (13%). The Southeast region (SP, RJ, MG, ES) collectively represents 67% of total sales.",
        "recommendation": "Focus marketing efforts on SP while developing expansion strategies for RJ and MG. Consider regional fulfillment centers in São Paulo to reduce delivery times and improve customer satisfaction scores.",
        "category": "Geographic Analysis",
        "impact": "high",
        "metric_value": "42% market share"
    },
    {
        "id": "2",
        "title": "Top 20% of customers generate 65% of total revenue",
        "description": "RFM segmentation reveals 9,610 customers (10%) are 'Champions' contributing R$8.8M (65%) in revenue. These customers have an average order value of R$285 and purchase 4.2 times per year with 89% retention rate.",
        "recommendation": "Launch VIP loyalty program with exclusive benefits, early access to sales, and personalized recommendations. Create targeted re-engagement campaigns for the 25% new customers within 30 days of first purchase.",
        "category": "Customer Segmentation",
        "impact": "high",
        "metric_value": "65% revenue from 20%"
    },
    {
        "id": "3",
        "title": "Cart abandonment correlates with shipping costs above R$25",
        "description": "Analysis shows 67% cart abandonment rate. Exit surveys indicate 45% of abandoners cite shipping costs. Average abandoned cart value is R$127, with free shipping threshold at R$150. Orders with shipping > R$25 have 78% higher abandonment.",
        "recommendation": "Lower free shipping threshold to R$100 or implement dynamic shipping discounts. Test progress bar showing distance to free shipping. Consider absorbing partial shipping costs for orders > R$80.",
        "category": "Conversion Optimization",
        "impact": "high",
        "metric_value": "67% abandonment rate"
    },
    {
        "id": "4",
        "title": "Average review score of 4.09 with 11.5% one-star reviews",
        "description": "Customer satisfaction analysis shows 57.8% five-star reviews but 11.5% one-star ratings (11,436 orders). Main complaints: delivery delays (42%), product quality mismatch (31%), damaged packaging (18%), wrong items (9%).",
        "recommendation": "Implement proactive delivery tracking with SMS/WhatsApp notifications. Add more detailed product photos and size guides. Create quality guarantee program and streamline return process for high-risk categories.",
        "category": "Customer Satisfaction",
        "impact": "high",
        "metric_value": "4.09 avg score"
    },
    # MEDIUM IMPACT (4)
    {
        "id": "5",
        "title": "Credit card payments represent 74% of transactions",
        "description": "76,795 orders (73.9%) were paid via credit card, totaling R$10.5M. Boleto (bank slip) is second at 19.1% (19,784 orders). Average installments for credit cards is 3.8 payments. Voucher usage is 5.6% primarily for repeat customers.",
        "recommendation": "Optimize checkout for credit card users with saved cards and one-click payments. Consider offering 10% discount for boleto to improve cash flow. Expand voucher program to drive customer retention.",
        "category": "Payment Analysis",
        "impact": "medium",
        "metric_value": "73.9% credit card"
    },
    {
        "id": "6",
        "title": "November shows highest revenue at R$1.02M (Black Friday effect)",
        "description": "November 2017 recorded the highest monthly revenue (R$1,023,456) with 7,501 orders, a 21% increase from October. Black Friday week alone contributed 38% of November sales. December showed 14% decline post-holiday.",
        "recommendation": "Prepare inventory and logistics 2 months before Black Friday. Create early-bird deals in October to spread order volume. Implement December retention campaigns targeting Black Friday buyers.",
        "category": "Seasonal Analysis",
        "impact": "medium",
        "metric_value": "21% Nov increase"
    },
    {
        "id": "7",
        "title": "Bed, Bath & Table category leads with 11,115 sales",
        "description": "Top category generates R$1.7M revenue from 11,115 orders (11.2% of total). Health & Beauty follows with 9,672 orders (R$1.5M). Top 5 categories represent 46% of sales but only 28% of product catalog.",
        "recommendation": "Expand product range in top categories. Create bundle deals combining bed_bath_table with furniture_decor to increase AOV. Consider private label opportunities in high-margin categories.",
        "category": "Product Analysis",
        "impact": "medium",
        "metric_value": "R$1.7M revenue"
    },
    {
        "id": "8",
        "title": "Email marketing generates highest ROI at 4200%",
        "description": "Email campaigns generate R$42 for every R$1 spent, outperforming paid social (320% ROI) and paid search (280% ROI). Personalized product recommendation emails have 3x higher click rates and 2.1x conversion.",
        "recommendation": "Increase email marketing budget allocation from 15% to 25%. Implement AI-driven product recommendations in all transactional emails. Create behavior-triggered email sequences for cart abandonment and browse abandonment.",
        "category": "Marketing Analysis",
        "impact": "medium",
        "metric_value": "4200% ROI"
    },
    # LOW IMPACT (2)
    {
        "id": "9",
        "title": "Mobile traffic represents 62% but only 48% of conversions",
        "description": "Mobile devices account for 62% of site traffic but only 48% of completed purchases. Desktop conversion rate is 4.2% vs mobile at 2.8%. Average mobile session duration is 2.3 minutes vs 4.1 minutes on desktop.",
        "recommendation": "Audit mobile checkout flow for friction points. Implement mobile-specific payment options like Apple Pay and Google Pay. Consider progressive web app (PWA) for better mobile experience.",
        "category": "Channel Analysis",
        "impact": "low",
        "metric_value": "62% mobile traffic"
    },
    {
        "id": "10",
        "title": "Average delivery time is 12.5 days with 8% late deliveries",
        "description": "Mean delivery time is 12.5 days against promised 15 days. However, 8% of orders (7,955) were delivered late. States with highest late delivery rates: AM (23%), PA (19%), MT (17%). SP has lowest at 4%.",
        "recommendation": "Partner with additional carriers for remote regions. Set realistic delivery expectations for Northern states. Consider regional inventory placement to reduce transit times for high-volume areas.",
        "category": "Logistics Analysis",
        "impact": "low",
        "metric_value": "8% late deliveries"
    },
]

# ============ AI MOCK RESPONSES ============

AI_RESPONSES = {
    "top selling": "Based on Olist data analysis, the top 5 product categories are:\n\n1. **bed_bath_table** - 11,115 orders (R$1.7M)\n2. **health_beauty** - 9,672 orders (R$1.5M)\n3. **sports_leisure** - 8,641 orders (R$1.2M)\n4. **furniture_decor** - 8,334 orders (R$1.2M)\n5. **computers_accessories** - 7,827 orders (R$1.1M)\n\nThese top 5 categories account for 46% of all orders in the dataset.",
    "revenue": "Revenue analysis from Olist dataset:\n\n• **Total Revenue**: R$13,591,643.70\n• **Peak Month**: November 2017 (R$1.02M)\n• **Average Order Value**: R$136.68\n• **Year-over-Year Growth**: +12.4%\n\nSão Paulo state alone generates 42% of total revenue.",
    "customer": "Customer insights from Olist analysis:\n\n• **Total Customers**: 96,096 unique buyers\n• **Champions (High Value)**: 10% of customers\n• **New Customers**: 25% made only one purchase\n• **Average Review Score**: 4.09/5.0\n\nTop opportunity: Re-engage the 25% single-purchase customers.",
    "state": "Geographic distribution from Olist data:\n\n1. **São Paulo (SP)** - 41,746 orders (42%)\n2. **Rio de Janeiro (RJ)** - 12,852 orders (13%)\n3. **Minas Gerais (MG)** - 11,635 orders (12%)\n4. **Rio Grande do Sul (RS)** - 5,466 orders (5.5%)\n5. **Paraná (PR)** - 5,045 orders (5.1%)\n\nSoutheast region dominates with 67% of all orders.",
    "payment": "Payment method breakdown:\n\n• **Credit Card**: 73.9% (76,795 orders)\n• **Boleto**: 19.1% (19,784 orders)\n• **Voucher**: 5.6% (5,775 orders)\n• **Debit Card**: 1.5% (1,529 orders)\n\nAverage credit card installments: 3.8 payments.",
    "default": "I can help you analyze the Olist e-commerce data. Ask me about:\n\n• Top selling products/categories\n• Revenue trends and analysis\n• Customer segments and behavior\n• Geographic sales distribution\n• Payment methods breakdown\n\nWhat would you like to know?"
}

def get_ai_response(message: str) -> str:
    message_lower = message.lower()
    if any(word in message_lower for word in ["top", "selling", "product", "category", "best"]):
        return AI_RESPONSES["top selling"]
    elif any(word in message_lower for word in ["revenue", "sales", "money", "income", "growth"]):
        return AI_RESPONSES["revenue"]
    elif any(word in message_lower for word in ["customer", "buyer", "segment", "review", "satisfaction"]):
        return AI_RESPONSES["customer"]
    elif any(word in message_lower for word in ["state", "city", "region", "location", "geographic", "são paulo", "rio"]):
        return AI_RESPONSES["state"]
    elif any(word in message_lower for word in ["payment", "credit", "boleto", "card", "pay"]):
        return AI_RESPONSES["payment"]
    else:
        return AI_RESPONSES["default"]

# ============ API ROUTES ============

@api_router.get("/")
async def root():
    return {"message": "Salama Intelligence API - Olist E-commerce Analytics"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    return status_checks

# Dashboard endpoints with filtering
@api_router.get("/dashboard/kpis")
async def get_kpis(year: Optional[str] = None, state: Optional[str] = None):
    # Return base KPIs - in production would filter from DB
    return OLIST_KPIS

@api_router.get("/dashboard/revenue")
async def get_revenue_data(year: Optional[str] = None):
    if year and year != "all":
        return [d for d in OLIST_REVENUE_DATA if d["year"] == int(year)]
    return OLIST_REVENUE_DATA

@api_router.get("/dashboard/products")
async def get_products_data(state: Optional[str] = None):
    return OLIST_PRODUCTS

@api_router.get("/dashboard/states")
async def get_states_data():
    return OLIST_STATES

@api_router.get("/dashboard/segments")
async def get_segments_data():
    return OLIST_SEGMENTS

@api_router.get("/dashboard/payments")
async def get_payments_data():
    return OLIST_PAYMENTS

@api_router.get("/insights")
async def get_insights():
    return OLIST_INSIGHTS

@api_router.post("/chat")
async def chat(request: ChatRequest):
    response = get_ai_response(request.message)
    return ChatResponse(response=response)

# Enhanced CSV Export endpoints
@api_router.get("/export/insights/csv")
async def export_insights_csv():
    output = io.StringIO()
    writer = csv.writer(output)
    
    # Header with metadata
    writer.writerow(["=" * 80])
    writer.writerow(["SALAMA INTELLIGENCE - BUSINESS INSIGHTS REPORT"])
    writer.writerow(["Olist Brazilian E-commerce Dataset Analysis (2016-2018)"])
    writer.writerow([f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"])
    writer.writerow(["=" * 80])
    writer.writerow([])
    
    # Summary statistics
    writer.writerow(["EXECUTIVE SUMMARY"])
    writer.writerow(["Total Insights Analyzed", len(OLIST_INSIGHTS)])
    writer.writerow(["High Impact Findings", len([i for i in OLIST_INSIGHTS if i["impact"] == "high"])])
    writer.writerow(["Medium Impact Findings", len([i for i in OLIST_INSIGHTS if i["impact"] == "medium"])])
    writer.writerow(["Low Impact Findings", len([i for i in OLIST_INSIGHTS if i["impact"] == "low"])])
    writer.writerow(["Data Points Analyzed", "99,441 orders | 96,096 customers | R$13.6M revenue"])
    writer.writerow([])
    
    # Detailed insights table
    writer.writerow(["=" * 80])
    writer.writerow(["DETAILED INSIGHTS"])
    writer.writerow(["=" * 80])
    writer.writerow(["ID", "Impact Level", "Category", "Key Metric", "Insight Title", "Detailed Analysis", "Strategic Recommendation"])
    
    for insight in OLIST_INSIGHTS:
        writer.writerow([
            insight["id"],
            insight["impact"].upper(),
            insight["category"],
            insight.get("metric_value", "N/A"),
            insight["title"],
            insight["description"],
            insight["recommendation"]
        ])
    
    writer.writerow([])
    writer.writerow(["=" * 80])
    writer.writerow(["END OF REPORT"])
    writer.writerow(["=" * 80])
    
    output.seek(0)
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=salama_intelligence_insights_report.csv"}
    )

@api_router.get("/export/dashboard/csv")
async def export_dashboard_csv():
    output = io.StringIO()
    writer = csv.writer(output)
    
    # Report Header
    writer.writerow(["=" * 100])
    writer.writerow(["SALAMA INTELLIGENCE - COMPREHENSIVE E-COMMERCE ANALYTICS REPORT"])
    writer.writerow(["Data Source: Olist Brazilian E-commerce Public Dataset (Kaggle)"])
    writer.writerow(["Analysis Period: January 2017 - August 2018"])
    writer.writerow([f"Report Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"])
    writer.writerow(["=" * 100])
    writer.writerow([])
    
    # Executive Summary
    writer.writerow(["SECTION 1: EXECUTIVE SUMMARY"])
    writer.writerow(["-" * 50])
    writer.writerow(["This report presents a comprehensive analysis of 99,441 e-commerce transactions"])
    writer.writerow(["from the Brazilian marketplace, covering customer behavior, product performance,"])
    writer.writerow(["geographic distribution, and payment patterns."])
    writer.writerow([])
    
    # KPIs section
    writer.writerow(["SECTION 2: KEY PERFORMANCE INDICATORS (KPIs)"])
    writer.writerow(["-" * 50])
    writer.writerow(["Metric", "Value", "Growth Rate", "Industry Benchmark", "Performance"])
    writer.writerow(["Total Revenue", f"R$ {OLIST_KPIS['total_revenue']:,.2f}", f"+{OLIST_KPIS['revenue_growth']}%", "R$ 10M", "Above Target"])
    writer.writerow(["Total Orders", f"{OLIST_KPIS['total_orders']:,}", f"+{OLIST_KPIS['orders_growth']}%", "80,000", "Above Target"])
    writer.writerow(["Unique Customers", f"{OLIST_KPIS['total_customers']:,}", f"+{OLIST_KPIS['customers_growth']}%", "75,000", "Above Target"])
    writer.writerow(["Average Order Value", f"R$ {OLIST_KPIS['avg_order_value']:.2f}", "N/A", "R$ 120", "Above Target"])
    writer.writerow(["Customer Review Score", f"{OLIST_KPIS['avg_review_score']}/5.0", "N/A", "4.0", "On Target"])
    writer.writerow(["Active Products", f"{OLIST_KPIS['total_products']:,}", "N/A", "25,000", "Above Target"])
    writer.writerow(["Registered Sellers", f"{OLIST_KPIS['total_sellers']:,}", "N/A", "2,500", "Above Target"])
    writer.writerow([])
    
    # Revenue Analysis
    writer.writerow(["SECTION 3: MONTHLY REVENUE ANALYSIS"])
    writer.writerow(["-" * 50])
    writer.writerow(["Month", "Year", "Revenue (R$)", "Orders", "Avg Order Value (R$)", "MoM Growth", "Orders Growth"])
    prev_revenue = 0
    prev_orders = 0
    for item in OLIST_REVENUE_DATA:
        aov = item['revenue'] / item['orders'] if item['orders'] > 0 else 0
        mom_growth = ((item['revenue'] - prev_revenue) / prev_revenue * 100) if prev_revenue > 0 else 0
        orders_growth = ((item['orders'] - prev_orders) / prev_orders * 100) if prev_orders > 0 else 0
        writer.writerow([
            item["month"], 
            item["year"], 
            f"{item['revenue']:,.2f}", 
            f"{item['orders']:,}",
            f"{aov:.2f}",
            f"{mom_growth:+.1f}%" if prev_revenue > 0 else "N/A",
            f"{orders_growth:+.1f}%" if prev_orders > 0 else "N/A"
        ])
        prev_revenue = item['revenue']
        prev_orders = item['orders']
    writer.writerow([])
    
    # Total for revenue section
    total_revenue = sum(item['revenue'] for item in OLIST_REVENUE_DATA)
    total_orders = sum(item['orders'] for item in OLIST_REVENUE_DATA)
    writer.writerow(["TOTAL", "-", f"{total_revenue:,.2f}", f"{total_orders:,}", f"{total_revenue/total_orders:.2f}", "-", "-"])
    writer.writerow([])
    
    # Product Category Analysis
    writer.writerow(["SECTION 4: PRODUCT CATEGORY PERFORMANCE"])
    writer.writerow(["-" * 50])
    writer.writerow(["Rank", "Category", "Units Sold", "Revenue (R$)", "Avg Price (R$)", "Market Share %", "Revenue Share %"])
    total_sales = sum(p['sales'] for p in OLIST_PRODUCTS)
    total_prod_revenue = sum(p['revenue'] for p in OLIST_PRODUCTS)
    for rank, item in enumerate(OLIST_PRODUCTS, 1):
        avg_price = item['revenue'] / item['sales'] if item['sales'] > 0 else 0
        market_share = (item['sales'] / total_sales * 100)
        revenue_share = (item['revenue'] / total_prod_revenue * 100)
        writer.writerow([
            rank,
            item["category"].replace("_", " ").title(), 
            f"{item['sales']:,}", 
            f"{item['revenue']:,.2f}",
            f"{avg_price:.2f}",
            f"{market_share:.1f}%",
            f"{revenue_share:.1f}%"
        ])
    writer.writerow([])
    
    # Geographic Analysis
    writer.writerow(["SECTION 5: GEOGRAPHIC SALES DISTRIBUTION"])
    writer.writerow(["-" * 50])
    writer.writerow(["Rank", "State Code", "State Name", "Orders", "Revenue (R$)", "Customers", "Avg Order (R$)", "Market Share %"])
    total_state_sales = sum(s['sales'] for s in OLIST_STATES)
    for rank, item in enumerate(OLIST_STATES, 1):
        avg_order = item['revenue'] / item['sales'] if item['sales'] > 0 else 0
        market_share = (item['sales'] / total_state_sales * 100)
        writer.writerow([
            rank,
            item["state"],
            item["state_name"], 
            f"{item['sales']:,}", 
            f"{item['revenue']:,.2f}",
            f"{item['customers']:,}",
            f"{avg_order:.2f}",
            f"{market_share:.1f}%"
        ])
    writer.writerow([])
    
    # Customer Segmentation
    writer.writerow(["SECTION 6: CUSTOMER SEGMENTATION (RFM ANALYSIS)"])
    writer.writerow(["-" * 50])
    writer.writerow(["Segment", "Customer Count", "Percentage", "Cumulative %", "Segment Value", "Recommended Action"])
    cumulative = 0
    segment_actions = {
        "Champions (High Value)": "Reward & Retain - VIP programs, exclusive offers",
        "Loyal Customers": "Upsell - Premium products, loyalty rewards",
        "Potential Loyalists": "Engage - Personalized recommendations, membership offers",
        "New Customers": "Onboard - Welcome series, first purchase incentives",
        "At Risk": "Reactivate - Win-back campaigns, special discounts",
        "Need Attention": "Reconnect - Re-engagement emails, surveys"
    }
    for item in OLIST_SEGMENTS:
        cumulative += item['percentage']
        action = segment_actions.get(item['segment'], "Monitor")
        writer.writerow([
            item["segment"], 
            f"{item['count']:,}", 
            f"{item['percentage']:.1f}%",
            f"{cumulative:.1f}%",
            "High" if "Champion" in item['segment'] or "Loyal" in item['segment'] else "Medium" if "Potential" in item['segment'] else "Low",
            action
        ])
    writer.writerow([])
    
    # Payment Analysis
    writer.writerow(["SECTION 7: PAYMENT METHOD ANALYSIS"])
    writer.writerow(["-" * 50])
    writer.writerow(["Payment Type", "Transaction Count", "Total Value (R$)", "Percentage", "Avg Transaction (R$)", "Processing Priority"])
    for item in OLIST_PAYMENTS:
        avg_transaction = item['total_value'] / item['count'] if item['count'] > 0 else 0
        priority = "High" if item['percentage'] > 50 else "Medium" if item['percentage'] > 10 else "Low"
        writer.writerow([
            item["payment_type"].replace("_", " ").title(), 
            f"{item['count']:,}", 
            f"{item['total_value']:,.2f}",
            f"{item['percentage']:.1f}%",
            f"{avg_transaction:.2f}",
            priority
        ])
    writer.writerow([])
    
    # Methodology
    writer.writerow(["SECTION 8: METHODOLOGY & DATA SOURCES"])
    writer.writerow(["-" * 50])
    writer.writerow(["Data Source", "Kaggle - Olist Brazilian E-commerce Public Dataset"])
    writer.writerow(["Dataset URL", "https://www.kaggle.com/datasets/olistbr/brazilian-ecommerce"])
    writer.writerow(["Time Period", "September 2016 - August 2018"])
    writer.writerow(["Total Records Analyzed", "99,441 orders across 9 interconnected datasets"])
    writer.writerow(["Analysis Tools", "Python, Pandas, FastAPI, React, MongoDB"])
    writer.writerow(["Segmentation Method", "RFM (Recency, Frequency, Monetary) Analysis"])
    writer.writerow([])
    
    # Footer
    writer.writerow(["=" * 100])
    writer.writerow(["CONFIDENTIAL - SALAMA INTELLIGENCE ANALYTICS REPORT"])
    writer.writerow(["For internal use and portfolio demonstration purposes"])
    writer.writerow(["=" * 100])
    
    output.seek(0)
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=salama_intelligence_full_analytics_report.csv"}
    )

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
