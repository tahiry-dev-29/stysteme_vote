const mongoose = require("mongoose");

// Define the schema for a candidate
const candidateSchema = new mongoose.Schema(
   {
      name: {
         type: String,
         required: [true, "Le nom du candidat est obligatoire"], // Name is required
         trim: true, // Removes whitespace from both ends
         unique: true, // Each candidate must have a unique name
      },
      party: {
         type: String,
         required: false, // Party is optional
         trim: true,
         default: "Indépendant", // Default value if not provided
      },
      // We can add a field to count votes directly here
      votes: {
         type: Number,
         default: 0,
      },
   },
   {
      // This option automatically adds `createdAt` and `updatedAt` fields
      timestamps: true,
   }
);

// Create and export the model
// Mongoose will create a collection named 'candidates' (plural and lowercase)
module.exports = mongoose.model("Candidate", candidateSchema);
