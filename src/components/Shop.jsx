import React, { useState, useEffect } from "react";

export default function Shop({ score, setScore, perClick, setPerClick, perSecond, setPerSecond }) {
    const [clickUpgradeCost, setClickUpgradeCost] = useState(50);
    const [autoUpgradeCost, setAutoUpgradeCost] = useState(100);


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
        </div>
    );
}
