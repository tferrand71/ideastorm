import React from "react";

export default function MediaOverlay({ media }) {
    return (
        <>
            {media.map((item, index) =>
                item.src.endsWith(".mp4") ? (
                    <video
                        key={index}
                        src={item.src}
                        autoPlay
                        loop
                        muted
                        style={{
                            position: "fixed",
                            top: item.top,
                            left: item.left,
                            width: item.width || "150px",
                            pointerEvents: "none",
                            zIndex: 1000,
                        }}
                    />
                ) : (
                    <img
                        key={index}
                        src={item.src}
                        alt={item.alt || ""}
                        style={{
                            position: "fixed",
                            top: item.top,
                            left: item.left,
                            width: item.width || "150px",
                            pointerEvents: "none",
                            zIndex: 1000,
                        }}
                    />
                )
            )}
        </>
    );
}
