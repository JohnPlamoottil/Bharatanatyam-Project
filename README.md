# Bharatanatyam Arangetram Samarpanam 2025 
# Final Project Submission 
- Submitted August 25 2025

# Deployed Website 

Final Project Design: [Dance Website - Samarpanam](https://arangetram2025.onrender.com/)
## Getting started / Startup instructions

Follow these steps to run the project locally (backend + frontend).

Prerequisites
- Node.js (v16+ recommended) and npm (or yarn)
- (Optional) MongoDB if you plan to use the server-side database
- (Optional) Cloudinary account and credentials if you use image/video uploads

1) Install dependencies

From the repository root run:

```bash
# install server deps
cd server
npm install

# install web (frontend) deps
cd ../web
npm install
```

2) Add environment variables

- Server: create `server/.env` with the following (example):

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/bharatanatyam
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

- Frontend (Vite): create `web/.env` with client variables prefixed by `VITE_`:

```
VITE_API_BASE=http://localhost:5000
VITE_FALLBACK_IMAGE=/src/assets/avatar.jpg
```

3) Run in development (two terminals)

Terminal A (backend):

```bash
cd server
# If the project has a dev script (nodemon), use it; otherwise run node
npm run dev || node index.js
```

Terminal B (frontend):

```bash
cd web
npm run dev
```

4) Build for production

```bash
cd web
npm run build

# Serve the built files from web/dist using a static server or integrate with server/
```

Notes and troubleshooting
- Vite client env vars must start with `VITE_` and require restarting the dev server after changes.
- Do not expose secrets in client-side env vars (VITE_* are bundled into the client).
- If the frontend cannot reach the backend verify `VITE_API_BASE` matches the server URL and check CORS configuration on the server.
- For Cloudinary uploads, ensure credentials are present in `server/.env` and that the Cloudinary helper is configured in `server/services/cloudinary.js`.

