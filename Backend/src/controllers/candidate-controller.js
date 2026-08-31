const Candidate = require("../models/candidate-model");
const mongoose = require("mongoose");

// Helper : vérifie qu'un ID est un ObjectId MongoDB valide (sinon → 400, pas 500)
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// --- CREATE a new candidate ---
// Corresponds to: POST /api/candidates
const createCandidate = async (req, res) => {
   try {
      // C'est important d'inclure 'age' car il est obligatoire selon ton schéma !
      const { fullName, age, image, description, slogan, party } = req.body;

      if (!fullName) {
         return res
            .status(400)
            .json({ message: "Le nom complet du candidat est obligatoire." });
      }
      if (!age) {
         return res
            .status(400)
            .json({ message: "L'âge du candidat est obligatoire." });
      }

      // On crée un nouvel objet candidat avec toutes les données reçues.
      const newCandidate = await Candidate.create({
         fullName,
         age,
         image,
         description,
         slogan,
         party,
         // 'votes' et 'timestamps' sont gérés automatiquement par le schéma Mongoose
      });

      res.status(201).json(newCandidate);
   } catch (error) {
      console.error("Erreur lors de la création du candidat :", error);
      res.status(400).json({
         message: "Erreur lors de la création du candidat",
      });
   }
};

// --- READ all candidates ---
// Corresponds to: GET /api/candidates
const getAllCandidates = async (req, res) => {
   try {
      // On récupère tous les candidats de la base de données
      const candidates = await Candidate.find();
      res.status(200).json(candidates);
   } catch (error) {
      console.error(
         "Erreur lors de la récupération de tous les candidats :",
         error
      );
      res.status(500).json({ message: "Erreur serveur" });
   }
};

// --- READ one candidate by ID ---
// Corresponds to: GET /api/candidates/:id
const getCandidateById = async (req, res) => {
   try {
      if (!isValidId(req.params.id)) {
         return res.status(400).json({ message: "ID invalide." });
      }
      // On cherche un candidat par son ID dans les paramètres de la requête
      const candidate = await Candidate.findById(req.params.id);
      if (!candidate) {
         return res.status(404).json({ message: "Candidat non trouvé." });
      }
      res.status(200).json(candidate);
   } catch (error) {
      console.error(
         `Erreur lors de la récupération du candidat par ID ${req.params.id} :`,
         error
      );
      res.status(500).json({ message: "Erreur serveur" });
   }
};

// --- UPDATE a candidate by ID ---
// Corresponds to: PUT /api/candidates/:id
const updateCandidate = async (req, res) => {
   try {
      if (!isValidId(req.params.id)) {
         return res.status(400).json({ message: "ID invalide." });
      }
      // On cherche et met à jour le candidat par son ID avec les données du corps de la requête.
      // `new: true` pour retourner le document mis à jour.
      // `runValidators: true` pour réexécuter les validations du schéma Mongoose lors de la mise à jour.
      const candidate = await Candidate.findByIdAndUpdate(
         req.params.id,
         req.body,
         {
            new: true,
            runValidators: true,
         }
      );
      if (!candidate) {
         return res.status(404).json({ message: "Candidat non trouvé." });
      }
      res.status(200).json(candidate);
   } catch (error) {
      console.error(
         `Erreur lors de la mise à jour du candidat par ID ${req.params.id} :`,
         error
      );
      res.status(400).json({
         message: "Erreur lors de la mise à jour du candidat",
      });
   }
};

// --- DELETE a candidate by ID ---
// Corresponds to: DELETE /api/candidates/:id
const deleteCandidate = async (req, res) => {
   try {
      if (!isValidId(req.params.id)) {
         return res.status(400).json({ message: "ID invalide." });
      }
      // On cherche et supprime le candidat par son ID
      const candidate = await Candidate.findByIdAndDelete(req.params.id);
      if (!candidate) {
         return res.status(404).json({ message: "Candidat non trouvé." });
      }
      res.status(200).json({ message: "Candidat supprimé avec succès." });
   } catch (error) {
      console.error(
         `Erreur lors de la suppression du candidat par ID ${req.params.id} :`,
         error
      );
      res.status(500).json({ message: "Erreur serveur" });
   }
};

const Voter = require("../models/voters-model");

// --- Add a Candidate to a candidate ---
// Corresponds to: PATCH /api/candidates/:id/Candidate
const addVoteToCandidate = async (req, res) => {
   try {
      const candidateId = req.params.id;
      const voterId = req.voter._id;

      if (!isValidId(candidateId)) {
         return res.status(400).json({ message: "ID de candidat invalide." });
      }

      // Vérifie que le candidat existe AVANT de verrouiller le vote du votant
      const existingCandidate = await Candidate.findById(candidateId);
      if (!existingCandidate) {
         return res.status(404).json({ message: "Candidat non trouvé." });
      }

      // Mise à jour ATOMIQUE : ne réussit QUE si hasVoted est encore false.
      // Élimine la race condition (2 requêtes simultanées → 1 seul vote passe).
      const updatedVoter = await Voter.findOneAndUpdate(
         { _id: voterId, hasVoted: false },
         { $set: { hasVoted: true, dateLastVoted: new Date() } },
         { new: true }
      );
      if (!updatedVoter) {
         return res
            .status(403)
            .json({ message: "Action non autorisée. Vous avez déjà voté." });
      }

      const updatedCandidate = await Candidate.findByIdAndUpdate(
         candidateId,
         { $inc: { votes: 1 } }, // $inc est l'opérateur MongoDB pour incrémenter un nombre
         { new: true }
      );

      res.status(200).json({
         message: "Votre Candidate a été enregistré avec succès !",
         candidate: updatedCandidate,
      });
   } catch (error) {
      console.error(
         `Erreur lors de l'ajout d'un vote au candidat ID ${req.params.id} :`,
         error
      );
      res.status(500).json({ message: "Erreur serveur" });
   }
};

module.exports = {
   createCandidate,
   getAllCandidates,
   getCandidateById,
   updateCandidate,
   deleteCandidate,
   addVoteToCandidate,
};
