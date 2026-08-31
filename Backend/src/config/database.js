const mongoose = require("mongoose");

// Fonction pour se connecter à la base de données
const connectDB = async () => {
   try {
      // On essaie de se connecter avec l'URL qui est dans le fichier .env
      // maxPoolSize est réduit pour respecter la limite de 100 connexions du free tier M0
      const conn = await mongoose.connect(process.env.MONGO_URI, {
         maxPoolSize: 10,
      });

      console.log(`🎉 MongoDB connecté avec succès: ${conn.connection.host}`);
   } catch (error) {
      console.error(
         `Erreur de connexion à la base de données: ${error.message}`
      );

      process.exit(1);
   }
};

module.exports = connectDB;
