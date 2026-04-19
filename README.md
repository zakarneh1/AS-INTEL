# AS Intel

AS Intel is an e-commerce analytics and decision-support project built to showcase my end-to-end product thinking: from data storytelling and KPI design to API development and frontend delivery.

The project analyzes the Brazilian Olist marketplace dataset and presents it in a modern dashboard with exportable business reports and actionable insights.

## Why I Built This

I created this project as a portfolio case study for Data Analyst / Business Analyst / BI-oriented roles where I wanted to demonstrate:

- Business-focused analytics, not just charts
- Clean full-stack implementation
- Ability to turn messy data into clear decisions
- Practical communication through insights and recommendations

## What This Project Shows

- Real-world KPI tracking (revenue, orders, customers, review score, seller base)
- Time-series revenue analysis and category-level performance
- Geographic analysis by Brazilian state
- Customer segmentation (RFM-style groups)
- Payment method behavior analysis
- Export-ready reporting in CSV and PDF formats
- Conversational assistant endpoint for quick data Q&A

## Tech Stack

Frontend
- React + CRACO
- Tailwind CSS + Shadcn UI components
- Recharts for data visualization
- Axios for API calls
- jsPDF for report export

Backend
- FastAPI (Python)
- Pydantic models
- Motor / MongoDB (optional; app falls back to static analyzed data if DB is unavailable)
- CSV streaming exports

## Dataset

Source: Olist Brazilian E-commerce Public Dataset (Kaggle)

Modeled highlights used in the app:
- 99,441 orders
- 96,096 customers
- R$13.59M total revenue
- 32,951 products
- 3,095 sellers

## Project Structure

```text
AS INTEL/
	backend/
		server.py
		requirements.txt
	frontend/
		src/
		package.json
	tests/
	test_reports/
	README.md
```

## Key API Endpoints

- GET /api/dashboard/kpis
- GET /api/dashboard/revenue
- GET /api/dashboard/products
- GET /api/dashboard/states
- GET /api/dashboard/segments
- GET /api/dashboard/payments
- GET /api/insights
- POST /api/chat
- GET /api/export/dashboard/csv
- GET /api/export/insights/csv

## Local Setup

### 1) Clone

```bash
git clone <your-repo-url>
cd "AS INTEL"
```

### 2) Run Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows PowerShell: .venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn server:app --reload --host 0.0.0.0 --port 8001
```

### 3) Run Frontend

```bash
cd frontend
npm install
npm start
```

Frontend runs at http://localhost:3000
Backend runs at http://localhost:8001

## Environment Notes

Frontend uses `REACT_APP_BACKEND_URL` if provided.

If not set, frontend API client falls back to the deployed backend URL configured in source.

## What I Focused On

- Business readability: numbers are presented as decisions, not just metrics
- Clean UX: dense but structured dashboard layout for quick scanning
- Production-minded API design: stable endpoints and export support
- Graceful fallback behavior if database services are unavailable

## Testing

The repository includes API and iteration test artifacts in:

- test_reports/
- backend_test.py

## Roadmap

- Add date-range controls with deeper cohort analysis
- Expand geography visuals beyond state-level charts
- Add authentication for saved dashboard views

## About This Portfolio Project

This is a practical analytics product build intended to demonstrate how I approach:

- analytical reasoning,
- stakeholder-oriented reporting,
- and full-stack implementation quality.

If you are reviewing this for hiring, I would be happy to walk through architecture decisions, tradeoffs, and how I would evolve this into a production BI product.

