import React, { useState, useEffect } from "react";
import ClickButton from "./components/ClickButton.jsx";
import Score from "./components/Score.jsx";
import Shop from "./components/Shop.jsx";

export default function App() {
    // Récupérer les valeurs depuis localStorage si elles existent
    const [score, setScore] = useState(() => Number(localStorage.getItem("score")) || 0);
    const [perClick, setPerClick] = useState(() => Number(localStorage.getItem("perClick")) || 1);
    const [perSecond, setPerSecond] = useState(() => Number(localStorage.getItem("perSecond")) || 0);

    // Sauvegarder automatiquement dès que l'une des valeurs change
    useEffect(() => {
        localStorage.setItem("score", score);
        localStorage.setItem("perClick", perClick);
        localStorage.setItem("perSecond", perSecond);
    }, [score, perClick, perSecond]);

    // Gain automatique
    useEffect(() => {
        const interval = setInterval(() => {
            setScore(prevScore => prevScore + perSecond);
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
            />
        </div>
    );
}
