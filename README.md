# Mini Service Request Board

> **Full-Stack Technical Assessment · GlobalTNA**
>
> Built with Next.js · Node.js · Express · MongoDB

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)
![Express](https://img.shields.io/badge/Express-4-lightgrey)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8)
![Licence](https://img.shields.io/badge/Licence-MIT-yellow)

---

## Table of Contents

1. [Project Description](#1-project-description)
2. [System Architecture & Design](#2-system-architecture--design)
3. [Technologies Used](#3-technologies-used)
4. [Installation Instructions](#4-installation-instructions)
5. [Environment Variables](#5-environment-variables)
6. [Usage Instructions](#6-usage-instructions)
7. [API Endpoints](#7-api-endpoints)
8. [Project Structure](#8-project-structure)
9. [Features](#9-features)
10. [Contact Information](#10-contact-information)
11. [Licence](#11-licence)

---

## 1. Project Description

### Overview

The **Mini Service Request Board** is a full-stack web application built as a technical assessment for the Full-Stack Developer Intern role at **GlobalTNA**. It provides a stripped-down, single-page version of a service marketplace platform where homeowners can post service requests and tradespeople can browse, manage, and update those requests in real time.

### Problem Statement

Homeowners often need quick access to tradespeople for common jobs such as plumbing, electrical work, painting, or joinery. Without a centralized platform, coordinating these requests becomes fragmented and inefficient. This application solves that by providing a clean, functional board where requests can be posted, tracked, and managed from a single interface.

### Objectives

- **Post Requests:** Allow homeowners to submit detailed service requests with category, location, and contact information.
- **Browse Jobs:** Let tradespeople view all open requests, filter by category, and search by keyword.
- **Manage Status:** Enable status updates (Open → In Progress → Closed) directly from the job detail page.
- **Clean Architecture:** Maintain a clear separation between the Next.js frontend and the Express REST API backend.



---

## 2. System Architecture & Design

### Application Topology

The system follows a decoupled three-tier architecture with the frontend, backend, and database running as independent services.

```text
+-------------------+       +-------------------+       +-------------------+
|   Frontend        |       |   Backend         |       |   Database        |
|   Next.js 14      | ----> |   Node.js +       | ----> |   MongoDB Atlas   |
|   (App Router)    | <---- |   Express API     | <---- |   (jobRequests)   |
|   Tailwind CSS    |       |   Port 5000       |       |   Free Tier       |
|   Port 3000       |       +-------------------+       +-------------------+
+-------------------+
```

### Core Components

#### Backend (`backend/`)

| File | Responsibility |
|------|----------------|
| `index.js` | Express app entry point — CORS, middleware, MongoDB connection, global error handler |
| `models/JobRequest.js` | Mongoose schema — field definitions, validation, enums, defaults |
| `routes/jobs.js` | REST route handlers — GET, POST, PATCH, DELETE with input validation |
| `seed.js` | One-time script to insert sample job data into the database |

#### Frontend (`frontend/`)

| Component | Responsibility |
|-----------|----------------|
| `app/page.tsx` | Home page — job cards, category filter dropdown, keyword search |
| `app/new/page.tsx` | New job form — client-side validation, POST to API |
| `app/jobs/[id]/page.tsx` | Job detail page — full info, status dropdown, delete button |

### Data Flow

```text
 Browser                  Next.js Frontend              Express Backend          MongoDB
    │                           │                              │                     │
  1 ├── Load home page ─────────► GET /api/jobs ──────────────► Job.find(filter) ───► Return docs
    │                           │  (category, search)          │                     │
    │                           │                              │                     │
  2 ├── Click + Post Request ───► /new page                    │                     │
    │   Fill form               │                              │                     │
    │   Submit ─────────────────► POST /api/jobs ─────────────► Job.create() ───────► Save doc
    │                           │                              │                     │
  3 ├── Click job card ──────────► /jobs/[id] page             │                     │
    │                           │  GET /api/jobs/:id ──────────► Job.findById() ─────► Return doc
    │                           │                              │                     │
  4 ├── Change status ──────────► PATCH /api/jobs/:id ─────────► Job.findByIdAndUpdate │
    │   or Delete ──────────────► DELETE /api/jobs/:id ─────────► Job.findByIdAndDelete│
```

---

## 3. Technologies Used

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| Frontend Framework | Next.js | 14 (App Router) | React-based UI with file-system routing |
| Language | TypeScript | 5+ | Type-safe frontend components |
| Styling | Tailwind CSS | 3 | Utility-first responsive styling |
| Backend Runtime | Node.js | 18+ | Server-side JavaScript runtime |
| HTTP Framework | Express | 4 | REST API routing and middleware |
| Database | MongoDB Atlas | Free Tier | Cloud-hosted NoSQL document store |
| ODM | Mongoose | 8+ | MongoDB schema modelling and validation |
| Cross-Origin | CORS | Latest | Allow frontend-backend communication |
| Environment | dotenv | Latest | Manage environment variables securely |

---

## 4. Installation Instructions

### Prerequisites

- Node.js 18 or higher
- npm 9 or higher
- A free [MongoDB Atlas](https://cloud.mongodb.com) account

### 1. Clone the Repository

```bash
git clone https://github.com/NimshanDilunika/globaltna-assessment.git
cd globaltna-assessment
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Edit .env and fill in your MONGO_URI (see Environment Variables section)

# Run the development server
npm run dev
# Server starts at http://localhost:5000
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
# Edit .env.local and set NEXT_PUBLIC_API_URL

# Run the development server
npm run dev
# Dashboard opens at http://localhost:3000
```

### 4. Seed Sample Data (Optional)

To pre-populate the database with 7 sample job requests:

```bash
cd backend
node seed.js
```

Expected output:
```
MongoDB connected
Cleared existing jobs
Seeded 7 jobs successfully
```

---

## 5. Environment Variables

### Backend — `backend/.env`

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/globaltna` |
| `PORT` | Port the Express server runs on | `5000` |

```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/globaltna?retryWrites=true&w=majority
PORT=5000
```

### Frontend — `frontend/.env.local`

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Base URL of the Express backend | `http://localhost:5000` |

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

> ⚠️ Never commit `.env` or `.env.local` to version control. Both files are listed in `.gitignore`.

---

## 6. Usage Instructions

### Step 1 — Start Both Servers

Open two separate terminals:

```bash
# Terminal 1 — Backend
cd backend && npm run dev

# Terminal 2 — Frontend
cd frontend && npm run dev
```

### Step 2 — Open the Dashboard

Navigate to `http://localhost:3000` in your browser.

### Step 3 — Use the Application

| Action | How |
|--------|-----|
| **View all jobs** | Home page loads automatically with all open requests |
| **Filter by category** | Use the category dropdown on the home page |
| **Search jobs** | Type in the search bar to filter by title or description |
| **Post a new request** | Click **+ Post Request** → fill in the form → Submit |
| **View job details** | Click any job card on the home page |
| **Update job status** | On the detail page, use the **Change status** dropdown |
| **Delete a job** | On the detail page, click the **🗑 Delete Job** button |

---

## 7. API Endpoints

Base URL: `http://localhost:5000`

| Method | Endpoint | Description | Query Params |
|--------|----------|-------------|--------------|
| `GET` | `/api/jobs` | List all jobs | `?category=Plumbing` `?status=Open` `?search=tap` |
| `GET` | `/api/jobs/:id` | Fetch a single job by ID | — |
| `POST` | `/api/jobs` | Create a new job | Body: `title`, `description`, `category`, `location`, `contactName`, `contactEmail` |
| `PATCH` | `/api/jobs/:id` | Update job status only | Body: `{ status: "In Progress" }` |
| `DELETE` | `/api/jobs/:id` | Delete a job | — |


### HTTP Status Codes Used

| Code | Meaning |
|------|---------|
| `200` | Success |
| `201` | Resource created |
| `400` | Bad request / validation error |
| `404` | Resource not found |
| `500` | Internal server error |

---

## 8. Project Structure

```text
globaltna-assessment/
│
├── backend/                    # Express REST API
│   ├── models/
│   │   └── JobRequest.js       #   Mongoose schema and model
│   ├── routes/
│   │   └── jobs.js             #   All job-related route handlers
│   ├── .env                    #   Environment variables (not committed)
│   ├── .env.example            #   Example env file for reference
│   ├── .gitignore              #   Ignores node_modules and .env
│   ├── index.js                #   App entry point, DB connection
│   ├── package.json            #   Node dependencies and scripts
│   └── seed.js                 #   Sample data seeder script
│
├── frontend/                   # Next.js Web Dashboard
│   ├── app/
│   │   ├── page.tsx            #   Home — job list, filter, search
│   │   ├── layout.tsx          #   Root layout
│   │   ├── new/
│   │   │   └── page.tsx        #   New job form
│   │   └── jobs/
│   │       └── [id]/
│   │           └── page.tsx    #   Job detail, status update, delete
│   ├── public/                 #   Static assets
│   ├── .env.local              #   Frontend env variables (not committed)
│   ├── .env.example            #   Example env file for reference
│   ├── .gitignore              #   Ignores node_modules and .env.local
│   ├── next.config.ts          #   Next.js configuration
│   ├── package.json            #   Node dependencies and scripts
│   └── tailwind.config.ts      #   Tailwind CSS configuration
│
└── README.md                   # This file
```

---

## 9. Features

### Core Features

- **Job listing** — paginated card view of all service requests with status badges
- **Category filter** — instantly filter jobs by trade category
- **Keyword search** — search across job title and description in real time
- **Create job** — validated form with required fields and email format check
- **Job detail** — full view of all job information on a dedicated page
- **Status management** — update job status via dropdown (Open → In Progress → Closed)
- **Delete job** — remove a request with a confirmation prompt
- **Global error handler** — consistent JSON error responses with proper HTTP status codes
- **Sample data seeder** — pre-populate the database with 7 realistic job entries

### Data Model — `jobRequests` Collection

| Field | Type | Constraints |
|-------|------|-------------|
| `title` | String | Required |
| `description` | String | Required |
| `category` | String | Enum: Plumbing, Electrical, Painting, Joinery, Other |
| `location` | String | Optional |
| `contactName` | String | Optional |
| `contactEmail` | String | Email format validated |
| `status` | String | Enum: Open, In Progress, Closed — Default: Open |
| `createdAt` | Date | Auto-set on creation |

---

## 10. Contact Information

| Name | Email |
|------|-------|
| Your Name | your.nimshandilunika.com |

---


```
