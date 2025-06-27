// middlewares/auth-middleware.js

const jwt = require("jsonwebtoken");
const authController = require("../controllers/auth-controller"); // Importe le contrôleur d'authentification pour la blacklist
const Voter = require("../models/voters-model"); // Assure-toi que le chemin est correct

/**
 * Middleware pour authentifier les requêtes en vérifiant le token JWT.
 * - Vérifie la présence et la validité du token dans l'en-tête Authorization.
 * - S'assure que le token n'est pas blacklisté.
 * - Récupère les informations du votant depuis la base de données et les attache à `req.voter`.
 */
const authenticateToken = async (req, res, next) => {
   const authHeader = req.headers["authorization"];
   const token = authHeader && authHeader.split(" ")[1];

   if (token == null) {
      return res.status(401).json({ message: "Non autorisé, aucun token fourni" });
   }

   if (authController.isBlacklisted(token)) {
      return res
          .status(401)
          .json({ message: "Token révoqué. Veuillez vous reconnecter." });
   }

   jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
      if (err) {
         console.error("Erreur de vérification JWT:", err.message);
         return res.status(403).json({ message: "Accès refusé, token invalide ou expiré" });
      }

      try {
         const voter = await Voter.findById(user.id).select("-password");

         if (!voter) {
            return res.status(403).json({ message: "Accès refusé, utilisateur non trouvé" });
         }

         req.voter = voter;

         next();
      } catch (error) {
         console.error("Erreur serveur lors de la récupération de l'utilisateur:", error);
         return res.status(500).json({ message: "Erreur serveur lors de l'authentification" });
      }
   });
};

module.exports = authenticateToken;
