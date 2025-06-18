const express = require("express");
const router = express.Router();
const {
   createCandidate,
   getAllCandidates,
   getCandidateById,
   updateCandidate,
   deleteCandidate,
   addVoteToCandidate,
} = require("../controllers/candidate-controller");

// POST /api/candidates - Crée un nouveau candidat
router.post("/", createCandidate);
router.get("/", getAllCandidates);
router.get("/:id", getCandidateById);
router.put("/:id", updateCandidate);
router.delete("/:id", deleteCandidate);
router.patch("/:id/vote", addVoteToCandidate);

module.exports = router;
