# CivicBallot — Secure & Transparent Voting Platform

> **Make every choice count in a transparent and safe voting experience.**

Plateforme de vote en ligne sécurisée, moderne et transparente. Développée avec **React 19 + Vite + Tailwind CSS** (Frontend) et **Node.js + Express + MongoDB Atlas** (Backend).

---

## ✨ Fonctionnalités

- Authentification JWT (signup/login/logout), hash bcrypt, protection brute-force (rate-limit 10/15min)
- Gestion des candidats (CRUD admin, vote atomique, sanitisation anti-NoSQLi)
- Gestion des votants (admin)
- Hardening complet : helmet, CORS allowlist, rate-limit global 300/15min
- Frontend React Router + TanStack Query (cache 5min), Axios avec intercepteur token

---

## 🛠️ Stack

- **Frontend** : React 19.1, React Router 7.6, TanStack Query 5.81, Axios, Tailwind CSS 4.1, Vite 6.3
- **Backend** : Node.js 24, Express 5.2, Mongoose 9.9, MongoDB Atlas, JWT, Helmet, express-rate-limit
- **Hébergement** : Vercel (Frontend), Render/Railway compatible (Backend)
- **Domaine** : is-a.dev (Cloudflare DNS)

---

## 🚀 Démarrage rapide

### Frontend
```sh
cd Frontend
pnpm install
pnpm dev      # http://localhost:5173
pnpm build    # production
```

### Backend
```sh
cd Backend
pnpm install
# .env requis : MONGO_URI, JWT_SECRET, JWT_EXPIRES_IN, PORT, FRONTEND_URL
pnpm dev      # http://localhost:5000
```

### Variables d'environnement

**Frontend (.env)** : `VITE_API_URL=https://api.example.com/api` (fallback `http://localhost:5000/api`)

**Backend (.env / .env-production)** :
```
MONGO_URI=mongodb+srv://...
JWT_SECRET=...
JWT_EXPIRES_IN=1h
PORT=5000
FRONTEND_URL=https://civicballot.vercel.app,https://civicballot.tahiry29.is-a.dev,http://localhost:5173
```

> Après merge is-a.dev, mettre à jour `FRONTEND_URL` dans Backend/.env-production avec les deux domaines Vercel + is-a.dev pour CORS.

---

## Déploiement

### Frontend — Vercel
- Projet : `civicballot` (team `tahirydev29`, framework Vite)
- Build : `vite build` → `dist`
- Domaine Vercel : `civicballot.vercel.app` (alias auto)
- Domaine custom ajouté via API : `civicballot.tahiry29.is-a.dev` (pending verification TXT)
- Rewrites SPA : `vercel.json` → `/(.*) → /index.html`

```sh
vercel --prod --yes   # depuis Frontend/
```

### is-a.dev
1. Fork `is-a-dev/register`
2. Ajouter `domains/civicballot.tahiry29.json` et `domains/_vercel.tahiry29.json`
3. PR vers `is-a-dev:main` → merge → DNS propagé en ~5min (Cloudflare)

---

## Liens

- **GitHub** : https://github.com/tahiry-dev-29/stysteme_vote
- **Live Vercel** : https://civicballot.vercel.app
- **Future is-a.dev** : https://civicballot.tahiry29.is-a.dev
- **PR is-a.dev** : https://github.com/is-a-dev/register/pull/50075
- **Portfolio** : https://tahiry29.is-a.dev

---

## Auteur

**Tahiry Dev 29** — Full-Stack Developer  
GitHub : [@tahiry-dev-29](https://github.com/tahiry-dev-29) · Email : tahirydev29@gmail.com

---

## 📄 Licence

ISC
