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

const initDB = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS sl_users (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS sl_subscriptions (
                id SERIAL PRIMARY KEY,
                service_name VARCHAR(100) NOT NULL,
                total_slots INT NOT NULL,
                available_slots INT NOT NULL,
                price_per_slot DECIMAL(10,2) NOT NULL,
                owner_id INT REFERENCES sl_users(id),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            -- NOUVELLE TABLE : Les recherches des clients
            CREATE TABLE IF NOT EXISTS sl_requests (
                id SERIAL PRIMARY KEY,
                service_name VARCHAR(100) NOT NULL,
                user_id INT REFERENCES sl_users(id),
                status VARCHAR(50) DEFAULT 'en_attente',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("✅ Tables SousLoc à jour !");
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
    // Le code pour créer un compte ira ici
    res.json({ message: "Compte créé (simulation)" });
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
