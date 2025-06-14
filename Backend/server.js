// --- 1. IMPORTATIONS ---
// On importe les paquets nécessaires
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

// On importe notre fonction pour connecter la base de données
const connectDB = require("./src/config/database");

// --- 2. CONFIGURATION INITIALE ---
// Charge les variables d'environnement du fichier .env
dotenv.config();

// Lance la connexion à la base de données MongoDB
connectDB();

// Crée une instance de l'application Express
const app = express();

// --- 3. MIDDLEWARES ---
// Le middleware 'cors' permet d'autoriser les requêtes venant d'autres origines (ex: ton front-end Angular)
app.use(cors());

// Ce middleware permet à Express de comprendre le JSON envoyé dans les corps de requête (pour les POST, PUT, etc.)
app.use(express.json());

// Ce middleware permet de lire les données envoyées par un formulaire HTML simple
app.use(express.urlencoded({ extended: false }));

// --- 4. ROUTES ---
// Une route de test simple pour vérifier que le serveur fonctionne bien
app.get("/", (req, res) => {
   res.send("Bienvenue sur l'API de gestion de vote ! 🗳️");
});

/*
  ICI, TU AJOUTERAS TES ROUTES POUR L'API
  Par exemple, quand tu auras créé tes fichiers de routes :
  
  */
const candidateRoutes = require("./src/routes/candidate-routes");
//   const voteRoutes = require('./src/routes/vote.routes');

app.use("/api/candidates", candidateRoutes);
//   app.use('/api/votes', voteRoutes);

// --- 5. DÉMARRAGE DU SERVEUR ---
// On récupère le port depuis les variables d'environnement, avec 5000 comme valeur par défaut
const PORT = process.env.PORT || 8080;

// On met le serveur en écoute sur le port défini
app.listen(PORT, () => {
   console.log(`🚀 Serveur démarré et à l'écoute sur le port ${PORT}`);
});
