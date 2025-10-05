# 💰 FinSage — AI-Driven Personal Financial Advisor

FinSage is a modern **AI-powered financial advisory web app** designed to help users make smarter financial decisions.  
It combines intelligent risk profiling, investment recommendations, debt management tools, and real-time insights — all in a secure, elegant, and easy-to-use interface.

---

## 🚀 Overview

FinSage empowers students and young professionals to:
- Understand their **financial health** through AI-driven insights.
- Get **personalized investment suggestions** across stocks, bonds, crypto, and cash equivalents.
- Manage **debts and loans** with repayment strategy recommendations.
- Track **goals, progress, and reports** through a dynamic dashboard.
- Access **premium features** securely with Stripe integration.

---

## 🧩 Key Features

### 🧠 AI Features (via Gemini API)
- Personalized **risk profiling summaries**.
- Smart **investment recommendations** and portfolio balancing.
- Natural language **financial insights** and debt strategy explanations.
- Personalized **financial news & summaries**.

### 📊 Core Modules
| Module | Description |
|---------|-------------|
| **Dashboard** | Central hub showing portfolio, debt, and financial progress. |
| **Risk Quiz** | Determines user’s investment style and tolerance. |
| **Investments** | AI-generated investment suggestions. |
| **Debt Advisor** | Suggests best repayment strategy (Snowball / Avalanche). |
| **Calculators** | Includes SIP, Step-up SIP, EMI, and savings calculators. |
| **Reports** | Visual summaries of investment and spending patterns. |
| **Profile & Settings** | Manage personal data, preferences, and authentication. |
| **Premium Access** | Stripe-powered secure payment for premium features. |

---

## 🏗️ Project Architecture


```mermaid
flowchart TD
    A[Frontend: React, Vite, Tailwind] --> B[Backend: Supabase]
    A --> C[Gemini API]
    B --> D[Database: PostgreSQL]
    B --> E[Auth & Storage: Supabase]
    A --> F[Payments: Stripe]
