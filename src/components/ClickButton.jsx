import React from "react";

export default function ClickButton({ onClick }) {
    return (
        <button
            style={{ padding: "20px", fontSize: "20px", marginTop: "20px" }}
            onClick={onClick}
        >
            Clique ici !
        </button>
    );
}
