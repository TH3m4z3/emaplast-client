# EMAPLAST client

Public website (FR / EN) and admin dashboard.

This repository is the **frontend only**. The API lives in [emaplast-server](https://github.com/TH3m4z3/emaplast-server).

## Run locally

1. Start the API from the server repo (`npm run dev` on port 4000).
2. In this repo:

```bash
npm install
npm run dev
```

- Site: http://localhost:5173
- Admin: http://localhost:5173/admin/login

Vite proxies `/api`, `/uploads`, and `/images` to `http://localhost:4000`.

To point at another API, set `VITE_API_URL` in `.env` (see `.env.example`).
