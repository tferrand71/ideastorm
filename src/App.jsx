import React, { useState, useEffect } from "react";
import ClickButton from "./components/ClickButton.jsx";
import Score from "./components/Score.jsx";
import Shop from "./components/Shop.jsx";
import MediaOverlay from "./components/MediaOverlay.jsx";

export default function App() {
    // Score et upgrades
    const [score, setScore] = useState(() => Number(localStorage.getItem("score")) || 0);
    const [perClick, setPerClick] = useState(() => Number(localStorage.getItem("perClick")) || 1);
    const [perSecond, setPerSecond] = useState(() => Number(localStorage.getItem("perSecond")) || 0);

    // Médias affichés sur l’écran
    const [activeMedia, setActiveMedia] = useState(() => {
        return JSON.parse(localStorage.getItem("activeMedia")) || [];
    });

    // Sauvegarde automatique
    useEffect(() => {
        localStorage.setItem("score", score);
        localStorage.setItem("perClick", perClick);
        localStorage.setItem("perSecond", perSecond);
        localStorage.setItem("activeMedia", JSON.stringify(activeMedia));
    }, [score, perClick, perSecond, activeMedia]);

    // Gain automatique
    useEffect(() => {
        const interval = setInterval(() => {
            setScore(prev => prev + perSecond);
        }, 1000);
        return () => clearInterval(interval);
    }, [perSecond]);

    const handleClick = () => setScore(score + perClick);

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>IdeaStorm</h1>
            <Score score={score} />
            <p>Clic par clic : {perClick}</p>
            <p>Gain automatique par seconde : {perSecond}</p>
            <ClickButton onClick={handleClick} />
            <Shop
                score={score}
                setScore={setScore}
                perClick={perClick}
                setPerClick={setPerClick}
                perSecond={perSecond}
                setPerSecond={setPerSecond}
                activeMedia={activeMedia}
                setActiveMedia={setActiveMedia}
            />
            <MediaOverlay media={activeMedia} />
        </div>
    );
}
