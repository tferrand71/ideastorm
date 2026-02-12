import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useStore from "../store/useStore";
import supabase from "../lib/supabaseClient";
import { formatNumber } from "../utils/format";

export default function AdminPanel() {
    // On récupère 'set' via useStore pour manipuler l'état local directement
    const { user, score, rebirthCount, gameState } = useStore();
    const navigate = useNavigate();
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState("");

    // Vérification des droits
    useEffect(() => {
        const checkAdmin = async () => {
            if (!user) { navigate("/"); return; }
            const { data } = await supabase.from("users").select("username").eq("id", user.id).single();
            if (data && data.username === "Letotoo06") setIsAdmin(true);
            else navigate("/");
            setLoading(false);
        };
        checkAdmin();
    }, [user, navigate]);

    // --- FONCTIONS DE TRICHE INSTANTANÉES ---

    const cheatAddScore = async (amount) => {
        if (!gameState) return;
        setStatus("Envoi...");

        // 1. Calcul du nouveau score
        const newScore = Number(score) + amount;

        // 2. Mise à jour de la Base de Données (Silencieux)
        await supabase.from("game_state").update({ score: newScore }).eq("id", gameState.id);

        // 3. Mise à jour de l'Affichage (Instantané)
        // On force la mise à jour du store sans recharger la page
        useStore.setState({ score: newScore });

        setStatus(`✅ Ajouté : ${formatNumber(amount)}`);
    };

    const cheatSetRebirth = async (count) => {
        if (!gameState) return;
        setStatus("Envoi...");

        // Mise à jour BDD
        await supabase.from("game_state").update({ rebirth_count: count }).eq("id", gameState.id);

        // Mise à jour Affichage
        useStore.setState({ rebirthCount: count });

        setStatus(`✅ Rebirth défini à ${count}`);
    };

    const cheatReset = async () => {
        if(!confirm("Reset TOTAL ?")) return;
        // Pour le reset, on utilise la fonction du store qui gère déjà tout
        useStore.getState().resetGame();
    };

    if (loading) return <div style={{padding:'100px', color:'white', textAlign:'center'}}>Vérification...</div>;
    if (!isAdmin) return null;

    return (
        <div className="page-full" style={{ background: '#1a1a2e', color: 'white', padding: '20px', paddingTop: '100px', minHeight: '100vh' }}>
            <div className="game-card" style={{ maxWidth: '600px', border: '2px solid #e94560', background: '#16213e' }}>
                <h1 style={{ color: '#e94560', marginTop: 0 }}>⚠️ ADMIN PANEL ⚠️</h1>

                <div style={{ marginBottom: '20px', padding: '15px', background: '#0f3460', borderRadius: '8px' }}>
                    <strong>Données en direct :</strong> <br/>
                    💰 Score : <span style={{color: '#4cc9f0'}}>{formatNumber(score)}</span> <br/>
                    🔥 Rebirths : <span style={{color: 'gold'}}>{rebirthCount}</span>
                </div>

                {status && <div style={{ color: '#2ecc71', marginBottom: '15px', fontWeight: 'bold' }}>{status}</div>}

                <h3>💰 Ajouter du Score (Instant)</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
                    <button className="upgrade-btn" onClick={() => cheatAddScore(1e9)}>+1 Milliard</button>
                    <button className="upgrade-btn" onClick={() => cheatAddScore(1e21)}>+1 Sextillion</button>
                    <button className="upgrade-btn" onClick={() => cheatAddScore(1e39)}>+1 Duodécillion (Rebirth)</button>
                    <button className="upgrade-btn" onClick={() => cheatAddScore(1e100)}>+1 Googol</button>
                    <button className="upgrade-btn" onClick={() => cheatAddScore(1e305)} style={{borderColor: '#e94560', color: '#e94560'}}>+1 Centillion (MAX)</button>
                </div>

                <h3>🔥 Modifier Rebirths (Instant)</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '20px' }}>
                    <button className="upgrade-btn" onClick={() => cheatSetRebirth(0)}>0</button>
                    <button className="upgrade-btn" onClick={() => cheatSetRebirth(1)}>1</button>
                    <button className="upgrade-btn" onClick={() => cheatSetRebirth(2)}>2</button>
                    <button className="upgrade-btn" onClick={() => cheatSetRebirth(3)}>3</button>
                    <button className="upgrade-btn" onClick={() => cheatSetRebirth(4)}>4</button>
                    <button className="upgrade-btn" onClick={() => cheatSetRebirth(5)}>5</button>
                    <button className="upgrade-btn" onClick={() => cheatSetRebirth(6)} style={{borderColor: 'gold'}}>6 (Max)</button>
                </div>

                <button
                    onClick={cheatReset}
                    style={{ width: '100%', padding: '15px', background: '#e94560', color: 'white', fontWeight: 'bold', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '20px' }}
                >
                    TOUT RESET
                </button>
            </div>
        </div>
    );
}