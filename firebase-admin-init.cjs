var admin = require("firebase-admin");

var serviceAccount = require("./serviceAccountKey.json"); // Updated to look in current folder instead of "path/to/"

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

console.log("Firebase Admin Initialized (CommonJS)!");
