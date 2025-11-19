import React, { useState, useEffect } from "react";

export default function Shop({
                                 score, setScore,
                                 perClick, setPerClick,
                                 perSecond, setPerSecond,
                                 activeMedia, setActiveMedia
                             }) {
    // Coûts sauvegardés dans localStorage
    const [clickUpgradeCost, setClickUpgradeCost] = useState(() => Number(localStorage.getItem("clickUpgradeCost")) || 50);
    const [autoUpgradeCost, setAutoUpgradeCost] = useState(() => Number(localStorage.getItem("autoUpgradeCost")) || 100);
    const [catUpgradeCost, setCatUpgradeCost] = useState(() => Number(localStorage.getItem("catUpgradeCost")) || 250);
    const [catBought, setCatBought] = useState(() => localStorage.getItem("catBought") === "true" || false);

    // Sauvegarde des coûts
    useEffect(() => {
        localStorage.setItem("clickUpgradeCost", clickUpgradeCost);
        localStorage.setItem("autoUpgradeCost", autoUpgradeCost);
        localStorage.setItem("catUpgradeCost", catUpgradeCost);
    }, [clickUpgradeCost, autoUpgradeCost, catUpgradeCost]);

    // Assurer que le GIF acheté reste visible après reload
    useEffect(() => {
        if (catBought && !activeMedia.some(m => m.src === "/src/img/débile.gif")) {
            setActiveMedia(prev => [
                ...prev,
                { src: "/src/img/débile.gif", top: "20px", left: "80%", width: "150px" }
            ]);
        }
    }, [catBought, activeMedia, setActiveMedia]);

    // Fonctions d’achat
    const buyClickUpgrade = () => {
        if (score >= clickUpgradeCost) {
            setScore(score - clickUpgradeCost);
            setPerClick(perClick + 1);
            setClickUpgradeCost(Math.floor(clickUpgradeCost * 1.5));
        }
    };

    const buyAutoUpgrade = () => {
        if (score >= autoUpgradeCost) {
            setScore(score - autoUpgradeCost);
            setPerSecond(perSecond + 1);
            setAutoUpgradeCost(Math.floor(autoUpgradeCost * 1.5));
        }
    };

    const buyCatUpgrade = () => {
        if (score >= catUpgradeCost) {
            setScore(score - catUpgradeCost);
            setPerSecond(perSecond + 10);
            setCatUpgradeCost(Math.floor(catUpgradeCost * 1.5));
            setCatBought(true);
            localStorage.setItem("catBought", "true");

            // Ajouter le GIF dans l’overlay
            setActiveMedia(prev => [
                ...prev,
                { src: "/src/img/débile.gif", top: "20px", left: "80%", width: "150px" }
            ]);
        }
    };

    return (
        <div style={{ marginTop: "30px" }}>
            <p>Clic par clic : {perClick}</p>
            <p>Gain automatique par seconde : {perSecond}</p>

            <h3>Boutique</h3>

            <button onClick={buyClickUpgrade} disabled={score < clickUpgradeCost}>
                Augmenter le clic (+1) — {clickUpgradeCost} pts
            </button>

            <button onClick={buyAutoUpgrade} disabled={score < autoUpgradeCost} style={{ marginLeft: "10px" }}>
                Gain automatique (+1/sec) — {autoUpgradeCost} pts
            </button>

            {!catBought && score >= catUpgradeCost && (
                <button onClick={buyCatUpgrade} style={{ marginLeft: "10px" }}>
                    Gain gif chat (+10/sec) — {catUpgradeCost} pts
                </button>
            )}
        </div>
    );
}
