// --- 1. IMPORTS (Uniquement des require) ---
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcryptjs"); // Nécessaire pour l'inscription/connexion

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Limite augmentée pour les grosses sauvegardes JSON

// --- 2. CONNEXION MySQL ---
const db = mysql.createConnection({
    host: "db",      // Localhost car le port 3306 est ouvert via Docker
    user: "root",
    password: "azerty",
    database: "ideastorm"   // Nom de ta base (vérifie si c'est 'ideastorm' ou 'jeux')
});

db.connect(err => {
    if (err) console.error("❌ Erreur de connexion MySQL:", err);
    else console.log("✅ Connecté à MySQL (127.0.0.1)");
});

// --- 3. ROUTES API (Nécessaires pour le jeu) ---

// Route 1: Inscription
app.post("/api/signup", (req, res) => {
    const { username, password } = req.body;
    const hash = bcrypt.hashSync(password, 10);

    // On insère l'utilisateur
    const sqlUser = "INSERT INTO users (username, password_hash) VALUES (?, ?)";
    db.query(sqlUser, [username, hash], (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ error: "Ce pseudo est déjà pris." });
            console.error(err);
            return res.status(500).json({ error: "Erreur serveur" });
        }

        const userId = result.insertId;
        // On initialise une ligne de sauvegarde vide
        const sqlState = "INSERT INTO game_state (user_id, save_data) VALUES (?, ?)";
        db.query(sqlState, [userId, '{}'], (errState) => {
            if (errState) console.error("Erreur init save:", errState);
            res.json({ id: userId, username: username });
        });
    });
});

// Route 2: Connexion
app.post("/api/login", (req, res) => {
    const { username, password } = req.body;

    db.query("SELECT * FROM users WHERE username = ?", [username], (err, users) => {
        if (err) return res.status(500).json({ error: "Erreur serveur" });
        if (users.length === 0) return res.status(404).json({ error: "Utilisateur inconnu" });

        const user = users[0];
        const isValid = bcrypt.compareSync(password, user.password_hash);

        if (!isValid) return res.status(401).json({ error: "Mot de passe incorrect" });

        res.json({ id: user.id, username: user.username });
    });
});

// Route 3: Charger la partie
app.get("/api/game-state/:userId", (req, res) => {
    const userId = req.params.userId;
    db.query("SELECT save_data FROM game_state WHERE user_id = ?", [userId], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Erreur chargement" });
        }
        if (results.length === 0) return res.json({}); // Renvoie un objet vide si pas de save

        let data = results[0].save_data;
        // Si MySQL renvoie une string JSON, on la parse. Si c'est déjà un objet, on laisse.
        if (typeof data === 'string') {
            try { data = JSON.parse(data); } catch(e) {}
        }

        res.json(data);
    });
});

// Route 4: Sauvegarder la partie
app.post("/api/game-state", (req, res) => {
    const { user_id, save_data, score } = req.body;

    // Conversion en string pour le stockage TEXT/JSON MySQL
    const jsonState = JSON.stringify(save_data);

    const sql = "UPDATE game_state SET save_data = ?, score = ? WHERE user_id = ?";
    db.query(sql, [jsonState, score, user_id], (err) => {
        if (err) {
            console.error("Erreur save:", err);
            return res.status(500).json({ error: "Erreur sauvegarde" });
        }
        res.json({ success: true });
    });
});

// --- 4. LANCEMENT ---
app.listen(5000, () => {
    console.log("🚀 Serveur backend lancé sur http://localhost:5000");
});