const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const connectDB = require("./src/config/database");
const sanitizeMiddleware = require("./src/middlewares/sanitize-middleware");

// --- CONFIGURATION INITIALE ---
// Charge .env-production en production (NODE_ENV=production), sinon .env (développement local)
if (process.env.NODE_ENV === "production") {
   dotenv.config({ path: ".env-production" });
} else {
   dotenv.config();
}

// Lance la connexion à la base de données MongoDB
connectDB();

// Crée une instance de l'application Express
const app = express();

// --- SÉCURITÉ : Headers HTTP (XSS, sniffing, etc.) ---
app.use(helmet());

// --- SÉCURITÉ : Rate limiting (protège les quotas Atlas M0 et Render) ---
// Limite globale : 300 requêtes / 15 min par IP
const globalLimiter = rateLimit({
   windowMs: 15 * 60 * 1000,
   max: 300,
   standardHeaders: true,
   legacyHeaders: false,
});
app.use(globalLimiter);

// Limite stricte sur l'authentification : 10 tentatives / 15 min par IP (anti-bruteforce)
const authLimiter = rateLimit({
   windowMs: 15 * 60 * 1000,
   max: 10,
   message: {
      message: "Trop de tentatives. Réessayez dans 15 minutes.",
   },
   standardHeaders: true,
   legacyHeaders: false,
});

// --- CORS : allowlist d'origines (plus de cors() ouvert à tous) ---
const allowedOrigins = (
   process.env.FRONTEND_URL || "http://localhost:5173"
).split(",");

app.use(
   cors({
      origin: (origin, callback) => {
         // Autorise les requêtes sans origin (curl, Postman, same-origin)
         if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
         }
         callback(new Error("Origine non autorisée par CORS"));
      },
   })
);

// --- SÉCURITÉ : Sanitisation anti-injection NoSQL ---
app.use(sanitizeMiddleware);

// Ce middlewares permet à Express de comprendre le JSON envoyé dans les corps de requête (pour les POST, PUT, etc.)
app.use(express.json());

// Ce middlewares permet de lire les données envoyées par un formulaire HTML simple
app.use(express.urlencoded({ extended: false }));

// --- ROUTES ---
// Une route de test simple pour vérifier que le serveur fonctionne bien
app.get("/", (req, res) => {
   res.send("Bienvenue sur l'API de gestion de Candidate ! 🗳️");
});

const adminRoutes = require("./src/routes/admin-routes");
const candidateRoutes = require("./src/routes/candidate-routes");
const authRoutes = require("./src/routes/auth-routes");
const authenticateToken = require("./src/middlewares/auth-middleware");

app.use("/api/admin", adminRoutes);
// Limite stricte sur le login/signup : anti-bruteforce
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/candidates", authenticateToken, candidateRoutes);

// --- DÉMARRAGE DU SERVEUR ---
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
   console.log(`🚀 Serveur démarré et à l'écoute sur le port ${PORT}`);
});
