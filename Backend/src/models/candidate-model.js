const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema(
   {
      fullName: {
         type: String,
         required: [true, "Le nom complet du candidat est obligatoire"],
         trim: true,
      },
      age: {
         type: Number,
         required: [true, "L'âge est obligatoire"],
         min: [18, "Le candidat doit avoir au moins 18 ans."],
      },
      // Important : ce champ stockera une URL vers l'image, pas l'image elle-même
      image: {
         type: String,
         required: true,
      },
      description: {
         type: String,
         required: false,
         trim: true,
      },
      slogan: {
         type: String,
         required: false,
         trim: true,
      },
      party: {
         type: String,
         required: false,
         trim: true,
         default: "Indépendant",
      },
      votes: {
         type: Number,
         default: 0,
      },
   },
   {
      timestamps: true,
   }
);

module.exports = mongoose.model("Candidate", candidateSchema);
