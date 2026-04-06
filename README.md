# SCEMAS — Smart City Environmental Monitoring & Alert System

## Overview
SCEMAS is a cloud-native IoT platform for monitoring environmental data (air quality, temperature, humidity, and noise), evaluating rule-based alerts, and providing role-based dashboards for public users, operators, and administrators.

This repository contains both the frontend (Next.js + TypeScript) and backend (FastAPI) applications.

---

## Dependencies

### Frontend
- Node.js (v18+ recommended)
- npm
- Next.js
- TypeScript

### Backend
- Python (v3.10+ recommended)
- FastAPI
- Uvicorn

---

## Environment Variables

Create a `.env.local` file in `/frontend`:

```env
NEXT_PUBLIC_API_MODE=mock              # mock | real
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
```

---

## Installation

### Frontend
```bash
cd frontend
npm install
```

### Backend
```bash
cd backend
pip install -r requirements.txt
```

---

## Running the Application

### Start Backend
```bash
cd backend
uvicorn main:app --reload
```

### Start Frontend
```bash
cd frontend
npm run dev
```

---

## Access

- Frontend: http://localhost:3000  
- Backend API: http://localhost:8000  

---

## Notes

- Set `NEXT_PUBLIC_API_MODE=real` to connect to the backend.
- Ensure the backend is running before using real API mode.
- Google Maps API key is required for map features.
