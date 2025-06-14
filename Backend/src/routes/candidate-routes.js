const express = require("express");
const router = express.Router();

// Import the controller functions
const {
   createCandidate,
   getAllCandidates,
   getCandidateById,
   updateCandidate,
   deleteCandidate,
} = require("../controllers/candidate-controller");

// --- Define the routes ---

// POST /api/candidates - Create a new candidate
router.post("/", createCandidate);

// GET /api/candidates - Get all candidates
router.get("/", getAllCandidates);

// GET /api/candidates/:id - Get a single candidate by id
router.get("/:id", getCandidateById);

// PUT /api/candidates/:id - Update a candidate by id
router.patch("/:id", updateCandidate);

// DELETE /api/candidates/:id - Delete a candidate by id
router.delete("/:id", deleteCandidate);

module.exports = router;
