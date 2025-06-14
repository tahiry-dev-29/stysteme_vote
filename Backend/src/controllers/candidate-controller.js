const Candidate = require("../models/candidate-model");

// --- CREATE a new candidate ---
// Corresponds to: POST /api/candidates
const createCandidate = async (req, res) => {
   try {
      // Get data from the request body
      const { name, party } = req.body;

      // Check if name is provided
      if (!name) {
         return res.status(400).json({ message: "Le nom est obligatoire." });
      }

      // Create a new candidate in the database
      const newCandidate = await Candidate.create({ name, party });

      // Send a success response with the created data
      res.status(201).json(newCandidate);
   } catch (error) {
      // Handle potential errors (like a duplicate name)
      res.status(400).json({
         message: "Erreur lors de la création du candidat",
         error: error.message,
      });
   }
};

// --- READ all candidates ---
// Corresponds to: GET /api/candidates
const getAllCandidates = async (req, res) => {
   try {
      const candidates = await Candidate.find();
      res.status(200).json(candidates);
   } catch (error) {
      res.status(500).json({ message: "Erreur serveur", error: error.message });
   }
};

// --- READ one candidate by ID ---
// Corresponds to: GET /api/candidates/:id
const getCandidateById = async (req, res) => {
   try {
      const candidate = await Candidate.findById(req.params.id);
      if (!candidate) {
         return res.status(404).json({ message: "Candidat non trouvé" });
      }
      res.status(200).json(candidate);
   } catch (error) {
      res.status(500).json({ message: "Erreur serveur", error: error.message });
   }
};

// --- UPDATE a candidate by ID ---
// Corresponds to: PUT /api/candidates/:id
const updateCandidate = async (req, res) => {
   try {
      const candidate = await Candidate.findByIdAndUpdate(
         req.params.id,
         req.body,
         {
            new: true, // Return the updated document
            runValidators: true, // Rerun schema validations
         }
      );
      if (!candidate) {
         return res.status(404).json({ message: "Candidat non trouvé" });
      }
      res.status(200).json(candidate);
   } catch (error) {
      res.status(400).json({
         message: "Erreur lors de la mise à jour",
         error: error.message,
      });
   }
};

// --- DELETE a candidate by ID ---
// Corresponds to: DELETE /api/candidates/:id
const deleteCandidate = async (req, res) => {
   try {
      const candidate = await Candidate.findByIdAndDelete(req.params.id);
      if (!candidate) {
         return res.status(404).json({ message: "Candidat non trouvé" });
      }
      res.status(200).json({ message: "Candidat supprimé avec succès" });
   } catch (error) {
      res.status(500).json({ message: "Erreur serveur", error: error.message });
   }
};

// Export all controller functions
module.exports = {
   createCandidate,
   getAllCandidates,
   getCandidateById,
   updateCandidate,
   deleteCandidate,
};
