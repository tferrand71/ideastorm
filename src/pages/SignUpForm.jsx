import React, { useState } from 'react';
import { signUp } from '../utils/api';
import useStore from '../store/useStore';
import { useNavigate } from 'react-router-dom';

export default function SignUpForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const setUser = useStore(state => state.setUser);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const user = await signUp(username, password);

            // Pareil ici : setUser déclenche le chargement (ou la création) de la partie
            setUser(user);

            alert("Compte créé avec succès !");
            navigate('/');
        } catch(err) {
            alert(err.message || "Erreur d'inscription");
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px', margin: 'auto' }}>
            <h2>Inscription</h2>
            <input
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Choisir un pseudo"
                style={{ padding: '10px', fontSize: '1rem' }}
            />
            <input
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Choisir un mot de passe"
                type="password"
                style={{ padding: '10px', fontSize: '1rem' }}
            />
            <button type="submit" style={{ padding: '10px', cursor: 'pointer', background: '#2196F3', color: 'white', border: 'none', fontSize: '1rem' }}>
                Créer mon compte
            </button>
        </form>
    );
}