import React, { useEffect, useState } from "react";

/**
 * Volcano component
 * - ajoute 150 points toutes les 5 secondes (5000ms)
 * - affiche un pixel-art (volcano.png) fixé à gauche
 * - affiche une petite animation "+150" à chaque gain
 *
 * Usage: <Volcano setScore={setScore} />
 */

export default function Volcano({ setScore, enabled = true }) {
    const [showBurst, setShowBurst] = useState(false);

    useEffect(() => {
        if (!enabled) return;

        // donne 150 pts toutes les 5 secondes
        const interval = setInterval(() => {
            setScore(prev => {
                const next = prev + 150;
                // si tu veux sauver directement dans localStorage ici, fais localStorage.setItem("score", next)
                return next;
            });

            // montrer l'animation +150
            setShowBurst(true);
            setTimeout(() => setShowBurst(false), 1000);
        }, 5000);

        return () => clearInterval(interval);
    }, [enabled, setScore]);

    return (
        <>
            <div className="volcano-container" aria-hidden="true">
                <img
                    src="../img/volcano.png"
                    alt="volcan"
                    className="volcano-img"
                    draggable="false"
                />
                {showBurst && <div className="volcano-burst">+150</div>}
            </div>
        </>
    );
}
