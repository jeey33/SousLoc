const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Page d'accueil de ton serveur
app.get('/', (req, res) => {
    res.send("🚀 Serveur de partage d'abonnement en ligne !");
});

// Ta liste d'abonnements test
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

// Configuration du port pour Render
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
