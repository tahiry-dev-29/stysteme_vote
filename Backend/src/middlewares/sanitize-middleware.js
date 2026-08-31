// Nettoie récursivement les clés commençant par "$" ou contenant "."
// → prévient les injections NoSQL (ex: {"$gt": ""} dans le login)
// Compatible Express 5 : on ne touche pas à req.query (getter en lecture seule)
const sanitize = (obj) => {
   if (typeof obj !== "object" || obj === null) return obj;
   for (const key of Object.keys(obj)) {
      if (key.startsWith("$") || key.includes(".")) {
         delete obj[key];
      } else {
         sanitize(obj[key]);
      }
   }
   return obj;
};

module.exports = (req, res, next) => {
   if (req.body) sanitize(req.body);
   if (req.params) sanitize(req.params);
   next();
};
