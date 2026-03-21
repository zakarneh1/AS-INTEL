# AS Intel - E-commerce Intelligence Platform

## Original Problem Statement
Build a modern, professional, and fully responsive web application for a portfolio project demonstrating skills in Data Analysis, Business Intelligence, and System Design for a junior Data/Business Analyst role.

## User Choices
- **App Name**: AS Intel
- **AI Assistant**: Mock responses (free, no API costs) - floating chat widget
- **Theme**: Both dark and light mode with toggle
- **Charts**: Recharts (best for React)
- **Data Source**: Real Kaggle Olist Brazilian E-commerce Dataset
- **Design Style**: Professional SaaS dashboard
- **Export**: PDF and CSV functionality

## Architecture
- **Frontend**: React 19, Tailwind CSS, Shadcn/UI, Recharts, Phosphor Icons, jsPDF
- **Backend**: FastAPI, Python 3.11, Pydantic, Motor (MongoDB async)
- **Database**: MongoDB
- **Data**: Real Olist dataset (99,441 orders, 96,096 customers, 2016-2018)

## User Personas
1. **Recruiters/Hiring Managers** - Evaluating technical portfolio
2. **Business Professionals** - Understanding data analytics capabilities
3. **Technical Reviewers** - Assessing code quality and architecture

## Core Requirements (Static)
- [x] Modern SaaS dashboard aesthetic
- [x] Dark/Light mode toggle
- [x] Responsive design (desktop-first)
- [x] Interactive charts and visualizations
- [x] Business intelligence insights
- [x] Floating AI chat widget
- [x] PDF/CSV export functionality
- [x] Real Olist dataset integration

## What's Been Implemented (Jan 20, 2026)

### Pages Completed
1. **Home Page** - Hero section, feature cards, real Olist stats
2. **Dashboard Page** - 5 KPI cards, 5 charts, filters, CSV export
3. **Insights Page** - 6 Olist-based insights, PDF/CSV export
4. **Architecture Page** - Olist dataset structure, API endpoints
5. **About Page** - Problem/solution, skills, tools

### Floating Chat Widget
- AS Intel Assistant accessible from all pages
- Mock responses with real Olist data patterns
- Suggested prompts and reset functionality

### Real Olist Data
- R$13.59M total revenue
- 99,441 orders (2016-2018)
- 96,096 unique customers
- 32,951 products across 73 categories
- 3,095 sellers
- All 27 Brazilian states

### Export Features
- Dashboard CSV export (KPIs, revenue, products, states)
- Insights PDF export (full report with recommendations)
- Insights CSV export

## Prioritized Backlog

### P0 (Critical) - Completed
- [x] Rename to AS Intel
- [x] Real Olist data integration
- [x] PDF/CSV export functionality
- [x] Floating chat widget

### P1 (High Priority) - Future
- [ ] Real AI integration (OpenAI/Claude) - user will upgrade later
- [ ] Date range picker with calendar
- [ ] More detailed geographic maps

### P2 (Medium Priority) - Future
- [ ] User authentication
- [ ] Dashboard customization
- [ ] Email report scheduling

## Next Tasks
1. User to upgrade AI to real integration when ready
2. Add geographic map visualization
3. Implement date range calendar picker
