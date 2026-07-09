# Kassa Finance Dashboard

Kassa is an enterprise-grade financial dashboard application designed for monitoring corporate cash flow, tracking transactions, and managing account settings. The application features support for localization (English and Bahasa Indonesia) and base currency conversion (USD and IDR).

## System Architecture

The application is structured as a monorepo consisting of a Next.js frontend and a FastAPI backend.

### Tech Stack

- **Frontend**: Next.js (App Router), React, Recharts, TailwindCSS / Custom CSS, Lucide Icons.
- **Backend**: FastAPI (Python), Motor (Asynchronous MongoDB Client), Pydantic.
- **Database**: MongoDB.

---

## Directory Structure

```text
kassa/
├── app/                  # Next.js page layouts and global styles
├── components/           # Reusable UI components (Sidebar, Navbar, Tables, Charts)
├── data/                 # Type definitions and interfaces
├── lib/                  # Helper utilities (currency conversion, localization)
├── public/               # Static assets (images, logos)
├── backend/              # FastAPI application
│   ├── main.py           # API server entrypoint and route handlers
│   ├── database.py       # MongoDB client configuration
│   ├── models.py         # Pydantic schemas for request/response validation
│   └── requirements.txt  # Python dependency specifications
└── package.json          # Frontend dependencies and scripts
```

---

## Prerequisites

Ensure you have the following software installed:

- Node.js (v18 or higher)
- pnpm (v8 or higher)
- Python (v3.10 or higher)
- MongoDB instance (local or Atlas)

---

## Configuration and Setup

### 1. Backend Configuration

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

3. Configure your MongoDB connection string in `.env`:
   ```env
   MONGO_URL=mongodb://localhost:27017/kassa_db
   ```

4. Create and activate a Python virtual environment:
   ```bash
   python -m venv venv
   # On Windows:
   .\venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```

5. Install backend dependencies:
   ```bash
   pip install -r requirements.txt
   ```

### 2. Frontend Configuration

1. Navigate to the root directory and install dependencies:
   ```bash
   pnpm install
   ```

---

## Running the Application

### 1. Run the Backend API Server

From the `backend` directory (ensure the virtual environment is active):
```bash
python main.py
```
The backend API server will run at `http://127.0.0.1:8000`.

### 2. Run the Frontend Development Server

From the root directory:
```bash
pnpm dev
```
The Next.js development server will run at `http://localhost:3000`.

### 3. Build for Production

To create an optimized production build of the frontend, run:
```bash
pnpm build
```

---

## API Documentation

FastAPI automatically generates interactive Swagger documentation. Once the backend server is running, you can access the API documentation at:
- Swagger UI: `http://127.0.0.1:8000/docs`
- Redoc: `http://127.0.0.1:8000/redoc`

### Primary Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/health` | Server health check |
| `GET` | `/api/status` | Database connectivity status |
| `GET` | `/api/transactions` | Retrieve all transactions (supports optional filters) |
| `POST` | `/api/transactions` | Create a new transaction |
| `GET` | `/api/transactions/{id}` | Retrieve details of a specific transaction |
| `PUT` | `/api/transactions/{id}` | Update an existing transaction |
| `DELETE` | `/api/transactions/{id}` | Delete a specific transaction |
| `GET` | `/api/transactions/stats/summary` | Retrieve aggregated financial metrics |
