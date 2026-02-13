import React, { useState } from 'react';
import { signIn } from '../utils/api'; // Ton api.js modifié
import useStore from '../store/useStore';
import { useNavigate } from 'react-router-dom'; // Si tu utilises le routing

export default function LoginForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const setUser = useStore(state => state.setUser);
    const navigate = useNavigate(); // Optionnel: pour rediriger après login

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // L'API renvoie maintenant directement l'objet user { id, username }
            const user = await signIn(username, password);

            // On met à jour le store. Cela déclenche AUTOMATIQUEMENT loadGame()
            setUser(user);

            alert("Connexion réussie !");
            navigate('/'); // Redirection vers le jeu (si tu as un routeur)
        } catch(err) {
            alert(err.message || "Erreur de connexion");
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px', margin: 'auto' }}>
            <h2>Connexion</h2>
            <input
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Nom d'utilisateur"
                style={{ padding: '10px', fontSize: '1rem' }}
            />
            <input
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Mot de passe"
                type="password"
                style={{ padding: '10px', fontSize: '1rem' }}
            />
            <button type="submit" style={{ padding: '10px', cursor: 'pointer', background: '#4CAF50', color: 'white', border: 'none', fontSize: '1rem' }}>
                Se connecter
            </button>
        </form>
    );
}