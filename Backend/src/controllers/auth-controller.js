// @ts-nocheck
const Voter = require("../models/voters-model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Liste noire pour stocker les tokens révoqués
const blackList = new Set();

// Fonction pour générer un token JWT
const generateToken = (id) => {
   return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "1h", // Durée de validité du token
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

      // Vérifier si l'email existe déjà
      const existingVoter = await Voter.findOne({ email });
      if (existingVoter) {
         return res
            .status(409)
            .json({ message: "Cet email est déjà enregistré." });
      }

      // Hasher le mot de passe
      const hashedPassword = await bcrypt.hash(password, 10);

      // Créer un nouveau votant
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

      // Générer un token JWT
      const token = generateToken(savedVoter._id);

      res.status(201).json({ message: "Inscription réussie", token });
   } catch (error) {
      res.status(500).json({
         message: "Erreur lors de l'inscription",
         error: error.message,
      });
   }
};

// Contrôleur pour la connexion (login)
exports.login = async (req, res) => {
   try {
      const { email, password } = req.body;

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

      // Générer un nouveau token JWT
      const token = generateToken(voter._id);

      res.status(200).json({ message: "Connexion réussie", token });
   } catch (error) {
      res.status(500).json({
         message: "Erreur lors de la connexion",
         error: error.message,
      });
   }
};

// Contrôleur pour la déconnexion (logout)
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
      res.status(500).json({
         message: "Erreur lors de la déconnexion",
         error: error.message,
      });
   }
};

// Middleware pour vérifier si le token est dans la blacklist
exports.isBlacklisted = (token) => {
   return blackList.has(token);
};
