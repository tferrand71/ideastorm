import React, { useEffect, useState } from "react";
import { formatNumber } from "../utils/format";

export default function Leaderboard() {
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);

    // URL vers ton API PHP
    const API_URL = "http://localhost/ideastorm/api.php";

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const res = await fetch(`${API_URL}?action=leaderboard`);
                if (!res.ok) throw new Error("Erreur réseau");

                const data = await res.json();

                const rankedData = data.map((player, index) => ({
                    ...player,
                    rank: index + 1
                }));

                setPlayers(rankedData);
            } catch (error) {
                console.error("Erreur leaderboard:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
        const interval = setInterval(fetchLeaderboard, 10000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="page-full bg-leaderboard">
            <div className="game-card" style={{ maxWidth: '850px', width: '95%' }}>
                <h1 style={{ color: '#0984e3', marginBottom: '20px', textAlign: 'center' }}>
                    🏆 Classement des Légendes
                </h1>

                {loading ? (
                    <div style={{ padding: '20px', textAlign: 'center' }}>Chargement... ⏳</div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                            <thead>
                            <tr style={{ background: '#74b9ff', color: 'white' }}>
                                <th style={{ padding: '15px', textAlign: 'center' }}>#</th>
                                <th style={{ padding: '15px', textAlign: 'left' }}>Joueur</th>
                                <th style={{ padding: '15px', textAlign: 'center' }}>🔥 Rebirths</th>
                                <th style={{ padding: '15px', textAlign: 'right' }}>Score</th>
                            </tr>
                            </thead>
                            <tbody>
                            {players.map((player) => {
                                let rankBadge = <b>#{player.rank}</b>;
                                let rowStyle = { borderBottom: '1px solid #eee', background: 'white' };

                                if (player.rank === 1) rankBadge = "🥇";
                                if (player.rank === 2) rankBadge = "🥈";
                                if (player.rank === 3) rankBadge = "🥉";

                                return (
                                    <tr key={player.rank} style={rowStyle}>
                                        <td style={{ padding: '12px', textAlign: 'center', fontSize: '1.2rem' }}>
                                            {rankBadge}
                                        </td>

                                        <td style={{ padding: '12px', fontWeight: '600' }}>
                                            {player.username || "Anonyme"}
                                        </td>

                                        {/* COLONNE REBIRTH AVEC BADGE */}
                                        <td style={{ padding: '12px', textAlign: 'center' }}>
                                            <div style={{
                                                display: 'inline-block',
                                                background: 'linear-gradient(45deg, #2d3436, #000)',
                                                color: '#fdcb6e',
                                                padding: '4px 12px',
                                                borderRadius: '15px',
                                                fontSize: '0.85rem',
                                                fontWeight: 'bold',
                                                border: '1px solid #fdcb6e'
                                            }}>
                                                ★ {player.rebirth_count || 0}
                                            </div>
                                        </td>

                                        <td style={{ padding: '12px', textAlign: 'right', color: '#0984e3', fontWeight: 'bold' }}>
                                            {formatNumber(player.score)}
                                        </td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}