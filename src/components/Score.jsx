import React from "react";

export default function Score({ score }) {
    return (
        <p style={{ fontSize: "24px", marginBottom: "20px" }}>
            Score : {score}
        </p>
    );
}
