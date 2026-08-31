const Voter = require("../models/voters-model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const blackList = new Set();


const generateToken = (voterId, isAdmin) => {
   return jwt.sign({ id: voterId, isAdmin: isAdmin }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "1h",
   });
};

// Contrôleur pour l'inscription (signup)
exports.signup = async (req, res) => {
   try {
      const {
         email,
         password,
         firstName,
         lastName,
         dateOfBirth,
         gender,
         country,
         city,
      } = req.body;

      // --- Validation des entrées (anti-injection + hygiène des données) ---
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || typeof email !== "string" || !emailRegex.test(email)) {
         return res.status(400).json({ message: "Email invalide." });
      }
      if (!password || typeof password !== "string" || password.length < 8) {
         return res.status(400).json({
            message: "Le mot de passe doit contenir au moins 8 caractères.",
         });
      }

      // Vérifier si l'email existe déjà
      const existingVoter = await Voter.findOne({ email });
      if (existingVoter) {
         return res
             .status(409)
             .json({ message: "Cet email est déjà enregistré." });
      }

      // Hasher le mot de passe
      const hashedPassword = await bcrypt.hash(password, 10);

      const newVoter = new Voter({
         email,
         password: hashedPassword,
         firstName,
         lastName,
         dateOfBirth,
         gender,
         country,
         city,
      });
      const savedVoter = await newVoter.save();

      // Générer un token JWT en incluant le statut isAdmin du nouveau votant
      const token = generateToken(savedVoter._id, savedVoter.isAdmin); // <-- Passage de isAdmin

      res.status(201).json({ message: "Inscription réussie", token });
   } catch (error) {
      console.error("Erreur lors de l'inscription:", error); // Log d'erreur détaillé
      res.status(500).json({
         message: "Erreur lors de l'inscription",
      });
   }
};

// Contrôleur pour la connexion (login)
exports.login = async (req, res) => {
   try {
      const { email, password } = req.body;

      // Validation basique : types primitifs uniquement (anti-injection NoSQL)
      if (
         !email ||
         !password ||
         typeof email !== "string" ||
         typeof password !== "string"
      ) {
         return res
            .status(400)
            .json({ message: "Email et mot de passe requis." });
      }

      // Vérifier si l'email existe
      const voter = await Voter.findOne({ email });
      if (!voter) {
         return res.status(401).json({ message: "Identifiants invalides" });
      }

      // Vérifier le mot de passe
      const isPasswordValid = await bcrypt.compare(password, voter.password);
      if (!isPasswordValid) {
         return res.status(401).json({ message: "Identifiants invalides" });
      }

      const token = generateToken(voter._id, voter.isAdmin);

      res.status(200).json({ message: "Connexion réussie", token });
   } catch (error) {
      console.error("Erreur lors de la connexion:", error);
      res.status(500).json({
         message: "Erreur lors de la connexion",
      });
   }
};


exports.logout = (req, res) => {
   try {
      const authHeader = req.headers["authorization"];
      const token = authHeader && authHeader.split(" ")[1];

      if (!token) {
         return res.sendStatus(204);
      }

      blackList.add(token);

      res.status(200).json({ message: "Déconnexion réussie" });
   } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      res.status(500).json({
         message: "Erreur lors de la déconnexion",
      });
   }
};


exports.isBlacklisted = (token) => {
   return blackList.has(token);
};
