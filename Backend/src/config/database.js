const mongoose = require("mongoose");

// Fonction pour se connecter à la base de données
const connectDB = async () => {
   try {
      // On essaie de se connecter avec l'URL qui est dans le fichier .env
      // Les options sont là pour éviter des avertissements dans la console
      // @ts-ignore
      const conn = await mongoose.connect(process.env.MONGO_URI, {
         useNewUrlParser: true,
         useUnifiedTopology: true,
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
