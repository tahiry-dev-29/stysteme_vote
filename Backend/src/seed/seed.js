/*
 * Seed de la base de données — données propres pour la PROD et le dev.
 *
 * Usage :
 *   node src/seed/seed.js            → seed SANS destruction (refuse si données existantes)
 *   node src/seed/seed.js --force    → VIDE candidates + voters puis re-seed
 *   NODE_ENV=production node src/seed/seed.js --force  → cible Atlas (.env-production)
 *
 * Variables optionnelles :
 *   SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD → credentials de l'admin (sinon générés et affichés)
 */
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const Candidate = require("../models/candidate-model");
const Voter = require("../models/voters-model");

if (process.env.NODE_ENV === "production") {
   dotenv.config({ path: ".env-production" });
} else {
   dotenv.config();
}

const FORCE = process.argv.includes("--force");

// --- Données réalistes (personnages fictifs) ---
const CANDIDATS = [
   {
      fullName: "Amina Belkacem",
      age: 52,
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      description:
         "Ancienne ministre de la Santé, 15 ans d'expérience en politique. Elle défend un programme axé sur l'éducation publique et la modernisation des hôpitaux.",
      slogan: "Investir dans l'humain, aujourd'hui et demain",
      party: "Alliance Progressiste",
   },
   {
      fullName: "Victor Moreau",
      age: 47,
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      description:
         "Entrepreneur dans les énergies renouvelables. Son plan : 100% d'électricité verte en 2040 et la rénovation énergétique de tous les bâtiments publics.",
      slogan: "Une économie verte, une nation forte",
      party: "Les Écologistes Unis",
   },
   {
      fullName: "Sofia Marchetti",
      age: 38,
      image: "https://randomuser.me/api/portraits/women/68.jpg",
      description:
         "Ancienne judokate olympique devenue avocate. Elle milite pour la justice sociale, la lutte contre les discriminations et la décentralisation.",
      slogan: "La justice pour tous, pas pour quelques-uns",
      party: "Renaissance Civique",
   },
   {
      fullName: "Karim Haddad",
      age: 61,
      image: "https://randomuser.me/api/portraits/men/75.jpg",
      description:
         "Économiste et ancien gouverneur de banque centrale. Programme : baisse des impôts de production, numérique souverain et réforme des retraites.",
      slogan: "Redresser l'économie, préparer l'avenir",
      party: "Union pour la Stabilité",
   },
   {
      fullName: "Léa Nguyen",
      age: 34,
      image: "https://randomuser.me/api/portraits/women/17.jpg",
      description:
         "Développeuse devenue députée, plus jeune élue de l'assemblée. Combat pour la transparence des algorithmes publics et le vote électronique vérifiable.",
      slogan: "La transparence n'est pas une option",
      party: "Génération Numérique",
   },
   {
      fullName: "Thomas Lefèvre",
      age: 55,
      image: "https://randomuser.me/api/portraits/men/51.jpg",
      description:
         "Agriculteur et syndicaliste rural. Défend la souveraineté alimentaire, les circuits courts et la protection des petites exploitations.",
      slogan: "Manger local, vivre rural",
      party: "Indépendant",
   },
];

const VOTANTS = [
   ["julie.martin", "Julie", "Martin", "female", "France", "Paris", 1988],
   ["paul.dubois", "Paul", "Dubois", "male", "France", "Marseille", 1992],
   ["nina.rossi", "Nina", "Rossi", "female", "Italie", "Milan", 1995],
   ["ahmed.benali", "Ahmed", "Benali", "male", "Maroc", "Casablanca", 1985],
   ["emma.schmidt", "Emma", "Schmidt", "female", "Allemagne", "Berlin", 1990],
   ["lucas.silva", "Lucas", "Silva", "male", "Brésil", "São Paulo", 1997],
   ["chen.wei", "Chen", "Wei", "other", "Chine", "Shanghai", 1993],
   ["sofia.lund", "Sofia", "Lund", "female", "Suède", "Stockholm", 1991],
];

const randomPassword = () =>
   crypto.randomBytes(12).toString("base64url"); // ~16 caractères, safe dans une URI

(async () => {
   try {
      await mongoose.connect(process.env.MONGO_URI, { maxPoolSize: 10 });
      const cible =
         process.env.NODE_ENV === "production"
            ? "PRODUCTION (Atlas)"
            : "développement (local)";
      console.log(`🔗 Connecté — seed de la base : ${cible}`);

      const existingCandidates = await Candidate.countDocuments();
      const existingVoters = await Voter.countDocuments();

      if (!FORCE && (existingCandidates > 0 || existingVoters > 0)) {
         console.error(
            `❌ Base non vide (${existingCandidates} candidats, ${existingVoters} votants).\n` +
               "   Utilisez --force pour vider et re-seed, ou rien pour annuler."
         );
         process.exit(1);
      }

      if (FORCE) {
         const r = await Promise.all([
            Candidate.deleteMany({}),
            Voter.deleteMany({}),
         ]);
         console.log(
            `🧹 Reset : ${r[0].deletedCount} candidats, ${r[1].deletedCount} votants supprimés`
         );
      }

      // --- Admin ---
      // ⚠️ Sécurité : les credentials admin viennent EXCLUSIVEMENT de l'environnement.
      // Aucune valeur par défaut dans le code (repo public).
      const adminEmail = process.env.SEED_ADMIN_EMAIL;
      const adminPassword = process.env.SEED_ADMIN_PASSWORD;
      if (!adminEmail || !adminPassword) {
         console.error(
            "❌ Variables manquantes : SEED_ADMIN_EMAIL et SEED_ADMIN_PASSWORD\n" +
               "   doivent être définis dans .env / .env-production (ou l'environnement d'exécution).\n" +
               "   Ne jamais écrire de credentials admin dans le code source."
         );
         process.exit(1);
      }
      await Voter.create({
         email: adminEmail.toLowerCase(),
         password: await bcrypt.hash(adminPassword, 10),
         firstName: "Admin",
         lastName: "Système",
         dateOfBirth: "1980-01-01",
         gender: "other",
         country: "France",
         city: "Paris",
         isAdmin: true,
      });
      console.log(`👑 Admin créé : ${adminEmail} (mot de passe lu depuis l'environnement)`);

      // --- Votants (mots de passe identiques pour la démo, hashés individuellement) ---
      const demoPassword = await bcrypt.hash("Demo1234!", 10);
      const voters = await Voter.create(
         VOTANTS.map(([u, f, l, g, co, ci, y]) => ({
            email: `${u}@vote-app.com`,
            password: demoPassword,
            firstName: f,
            lastName: l,
            dateOfBirth: `${y}-06-15`,
            gender: g,
            country: co,
            city: ci,
         }))
      );
      console.log(`🗳️  ${voters.length} votants créés (mot de passe démo : Demo1234!)`);

      // --- Candidats (votes à 0 — élection non commencée) ---
      const candidates = await Candidate.create(CANDIDATS);
      console.log(`🎯 ${candidates.length} candidats créés :`);
      candidates.forEach((c) => console.log(`   - ${c.fullName} (${c.party})`));

      console.log("✅ Seed terminé avec succès.");
      await mongoose.disconnect();
      process.exit(0);
   } catch (error) {
      console.error("❌ Erreur pendant le seed :", error.message);
      process.exit(1);
   }
})();
