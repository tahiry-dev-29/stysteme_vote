// On importe mongoose pour pouvoir l'utiliser
const mongoose = require("mongoose");

// On crée une fonction pour se connecter à la base de données
const connectDB = async () => {
   try {
      // On essaie de se connecter avec l'URL qui est dans le fichier .env
      // Les options sont là pour éviter des avertissements dans la console
      // @ts-ignore
      const conn = await mongoose.connect(process.env.MONGO_URI, {
         useNewUrlParser: true,
         useUnifiedTopology: true,
      });

      // Si la connexion réussit, on affiche un message dans la console
      console.log(`🎉 MongoDB connecté avec succès: ${conn.connection.host}`);
   } catch (error) {
      // Si la connexion échoue, on affiche l'erreur...
      console.error(
         `Erreur de connexion à la base de données: ${error.message}`
      );

      // ...et on quitte le processus de l'application avec une erreur.
      process.exit(1);
   }
};

// On exporte notre fonction pour pouvoir l'utiliser dans server.js
module.exports = connectDB;
