const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

// 1. Connexion à la base de données
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false } // Indispensable sur Render
});

// 2. Création automatique des tables SousLoc
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
        `);
        console.log("✅ Tables SousLoc créées avec succès !");
    } catch (err) {
        console.error("❌ Erreur BDD :", err);
    }
};
initDB();

// 3. Les routes du site
app.get('/', (req, res) => {
    res.send("🚀 Moteur SousLoc en ligne et connecté à la base de données !");
});

// Pour l'instant, on garde la fausse liste le temps de coder l'ajout de vrais abonnements
app.get('/api/abonnements', (req, res) => {
    res.json([
        { id: 1, service: 'Apple Music', places_dispos: 2, prix_client: 4.50 },
        { id: 2, service: 'Netflix Premium', places_dispos: 1, prix_client: 5.00 },
        { id: 3, service: 'Spotify', places_dispos: 3, prix_client: 3.50 },
        { id: 4, service: 'Disney+', places_dispos: 2, prix_client: 2.99 },
        { id: 5, service: 'PlayStation Plus', places_dispos: 1, prix_client: 6.00 },
        { id: 6, service: 'YouTube Premium', places_dispos: 4, prix_client: 3.99 }
    ]);
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
