import React, { useEffect } from "react";
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import ClickButton from "./components/ClickButton.jsx";
import Score from "./components/Score.jsx";
import Shop from "./pages/Shop.jsx";
import Leaderboard from "./pages/Leaderboard.jsx";
import LoginForm from "./pages/LoginForm.jsx";
import SignupForm from "./pages/SignupForm.jsx";
import AdminPanel from "./pages/AdminPanel.jsx";
import Header from "./components/Header.jsx";
import MediaOverlay from "./components/MediaOverlay.jsx";
import Snow from "./components/Snow.jsx";
import EasterEgg from "./components/EasterEgg.jsx";

import useStore from "./store/useStore.js";
import supabase from "./lib/supabaseClient.js";
import { formatNumber } from "./utils/format.js";

export default function App() {
    // AJOUT : On récupère 'gameState' ici pour vérifier s'il est chargé
    const { score, perClick, perSecond, activeMedia, addScore, addPerSecond, saveGame, user, setUser, gameState, showMedia, hasSeenEnding, closeEasterEgg } = useStore();

    useEffect(() => {
        const fetchSession = async () => {
            const { data } = await supabase.auth.getSession();
            if (data.session?.user) setUser(data.session.user);
        };
        fetchSession();
        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) setUser(session.user); else setUser(null);
        });
        return () => listener.subscription.unsubscribe();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => addPerSecond(), 1000);
        return () => clearInterval(interval);
    }, [perSecond, addPerSecond]);

    useEffect(() => {
        if (user && saveGame) {
            const saveInterval = setInterval(() => saveGame(), 10000);
            return () => clearInterval(saveInterval);
        }
    }, [user, saveGame]);

    const END_GAME_THRESHOLD = 1e90;
    const showEnding = score >= END_GAME_THRESHOLD && !hasSeenEnding;

    return (
        <Router>
            {showMedia && <Snow />}
            {showMedia && <MediaOverlay media={activeMedia} />}
            {showEnding && <EasterEgg score={score} onClose={closeEasterEgg} />}

            <Header />

            <Routes>
                <Route
                    path="/"
                    element={
                        user ? (
                            // MODIFICATION ICI : Vérification du chargement
                            !gameState ? (
                                // Si connecté mais pas encore de données -> Écran de chargement
                                <div className="page-full bg-home">
                                    <div className="game-card" style={{ textAlign: 'center', padding: '50px' }}>
                                        <h2 style={{ color: '#ff6f61' }}>Chargement de ta partie...</h2>
                                        <div style={{ fontSize: '3rem', marginTop: '20px', animation: 'spin 1s infinite linear' }}>⏳</div>
                                    </div>
                                </div>
                            ) : (
                                // Si données chargées -> Le Jeu
                                <div className="page-full bg-home">
                                    <div className="game-card">
                                        <h1>IdeaStorm</h1>
                                        <Score score={score} />
                                        <p>Clic par clic : {formatNumber(perClick)}</p>
                                        <p>Gain automatique : {formatNumber(perSecond)} /s</p>
                                        <ClickButton onClick={() => addScore(perClick)} />
                                    </div>
                                </div>
                            )
                        ) : <Navigate to="/login" />
                    }
                />

                <Route path="/pages" element={user ? <Shop /> : <Navigate to="/login" />} />
                <Route path="/leaderboard" element={user ? <Leaderboard /> : <Navigate to="/login" />} />
                <Route path="/login" element={user ? <Navigate to="/" /> : (<div className="page-full bg-auth"><div className="game-card"><LoginForm /></div></div>)} />
                <Route path="/signup" element={user ? <Navigate to="/" /> : (<div className="page-full bg-auth"><div className="game-card"><SignupForm /></div></div>)} />
                {/* PAGE ADMIN SECRÈTE */}
                <Route path="/admin" element={user ? <AdminPanel /> : <Navigate to="/" />} />
            </Routes>
        </Router>
    );
}