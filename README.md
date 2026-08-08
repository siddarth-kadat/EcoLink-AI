# EcoLink AI 🌿
> **AI-Powered Food Rescue & Redistribution Platform**

EcoLink AI connects surplus food donors (restaurants/hotels) with local NGOs and volunteers using real-time routing, AI recommendation matching, and Leaflet interactive tracking.

---

## 🚀 Quick Start Guide

### Prerequisites
* **Python 3.9+**
* **Node.js 18+ & npm**

---

### 1️⃣ Backend Setup (FastAPI & PostgreSQL/SQLite)

Open a terminal and run the following commands:

```bash
# Navigate to backend directory
cd backend

# Activate virtual environment (Windows PowerShell)
.\.venv\Scripts\Activate.ps1

# (Alternative for Windows CMD)
# .venv\Scripts\activate.bat

# Start FastAPI Uvicorn dev server
uvicorn main:app --reload
```

* 🌐 **API Base Endpoint**: `http://127.0.0.1:8000`
* 📚 **Interactive Swagger API Docs**: `http://127.0.0.1:8000/docs`

---

### 2️⃣ Frontend Setup (Vite + React + TailwindCSS)

Open a **second** terminal and run:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies (if running for the first time)
npm install

# Start Vite React development server
npm run dev
```

* 🖥️ **Web Platform App**: `http://localhost:5173`

---

## 🔑 Pre-Configured Demo Credentials

| Role | Email | Password |
| :--- | :--- | :--- |
| **Restaurant** | `restaurant@ecolink.ai` | `Password@123` |
| **NGO** | `ngo@ecolink.ai` | `Password@123` |
| **Volunteer** | `volunteer@ecolink.ai` | `Password@123` |
| **Admin** | `admin@ecolink.ai` | `Password@123` |
