const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

// MISE À JOUR DE LA BASE DE DONNÉES
const initDB = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS sl_users (
                id SERIAL PRIMARY KEY,
                prenom VARCHAR(100),
                nom VARCHAR(100),
                email VARCHAR(255) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        // On force l'ajout des colonnes au cas où la table existait déjà avec l'ancien code
        await pool.query(`ALTER TABLE sl_users ADD COLUMN IF NOT EXISTS prenom VARCHAR(100);`);
        await pool.query(`ALTER TABLE sl_users ADD COLUMN IF NOT EXISTS nom VARCHAR(100);`);
        console.log("✅ Tables SousLoc à jour avec Noms et Prénoms !");
    } catch (err) {
        console.error("❌ Erreur BDD :", err);
    }
};
initDB();

// --- ROUTES DE LECTURE (Pour afficher sur le site) ---
app.get('/api/abonnements', (req, res) => {
    // Fausse liste temporaire
    res.json([
        { id: 1, service: 'Apple Music', places_dispos: 2, prix_client: 4.50 },
        { id: 2, service: 'Netflix Premium', places_dispos: 1, prix_client: 5.00 }
    ]);
});

app.get('/api/recherches', (req, res) => {
    // Fausses recherches temporaires
    res.json([
        { id: 1, service: 'Canal+', demandeur: 'Utilisateur Anonyme' },
        { id: 2, service: 'Crunchyroll', demandeur: 'Utilisateur Anonyme' }
    ]);
});

// --- ROUTES D'ÉCRITURE (Quand l'utilisateur validera un formulaire) ---
app.post('/api/inscription', async (req, res) => {
    const { prenom, nom, email, password } = req.body;
    
    try {
        // Enregistrement dans la table sl_users de ta base PostgreSQL
        const result = await pool.query(
            'INSERT INTO sl_users (prenom, nom, email, password_hash) VALUES ($1, $2, $3, $4) RETURNING id, prenom',
            [prenom, nom, email, password] // Idéalement, le mot de passe devra être crypté plus tard
        );
        
        res.status(201).json({ message: "Compte créé", user: result.rows[0] });
    } catch (err) {
        console.error(err);
        if (err.code === '23505') { // Code PostgreSQL pour une contrainte UNIQUE violée
            res.status(400).json({ erreur: "Cet email est déjà utilisé." });
        } else {
            res.status(500).json({ erreur: "Erreur interne du serveur." });
        }
    }
});

app.post('/api/abonnements', async (req, res) => {
    // Le code pour ajouter une offre ira ici
    res.json({ message: "Abonnement ajouté (simulation)" });
});

app.post('/api/recherches', async (req, res) => {
    // Le code pour ajouter une demande ira ici
    res.json({ message: "Recherche publiée (simulation)" });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
