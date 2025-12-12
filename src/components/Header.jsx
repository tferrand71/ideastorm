import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useStore from "../store/useStore";
import supabase from "../lib/supabaseClient";

export default function Header() {
    const { user, setUser } = useStore();
    const navigate = useNavigate();
    const [isAdmin, setIsAdmin] = useState(false);

    // Vérification Admin au montage
    useEffect(() => {
        const checkAdmin = async () => {
            if (!user) return;
            const { data } = await supabase
                .from("users")
                .select("username")
                .eq("id", user.id)
                .single();

            if (data && data.username === "Letotoo06") {
                setIsAdmin(true);
            }
        };
        checkAdmin();
    }, [user]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setUser(null);
        navigate("/login"); // Redirection fluide sans recharger la page
    };

    return (
        <header style={headerStyle}>
            <div style={logoStyle}>
                <Link to="/" style={{ color: "white", textDecoration: "none" }}>
                    <h2>IdeaStorm</h2>
                </Link>
            </div>

            <nav style={navStyle}>
                <Link to="/" style={linkStyle}>Accueil</Link>
                <Link to="/pages" style={linkStyle}>Boutique</Link>
                <Link to="/leaderboard" style={linkStyle}>Leaderboard</Link>

                {/* BOUTON ADMIN (Style intégré pour coller au thème) */}
                {isAdmin && (
                    <Link to="/admin" style={adminLinkStyle}>
                        🛠️ ADMIN
                    </Link>
                )}
            </nav>

            <div style={userStyle}>
                {user ? (
                    <>
                        <div style={avatarStyle}>
                            {user.email ? user.email.charAt(0).toUpperCase() : "U"}
                        </div>
                        <button onClick={handleLogout} style={logoutBtn}>Déconnexion</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" style={btnStyle}>Connexion</Link>
                        <Link to="/signup" style={btnStyle}>Inscription</Link>
                    </>
                )}
            </div>
        </header>
    );
}

/* ----------------- CSS INLINE (VOTRE DESIGN) ----------------- */
const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 30px",
    backgroundColor: "#1a1a2e",
    color: "white",
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    height: "60px",
    zIndex: 1000,
    boxShadow: "0 2px 5px rgba(0,0,0,0.3)",
};

const logoStyle = {
    fontSize: "24px",
    fontWeight: "bold",
};

const navStyle = {
    display: "flex",
    gap: "20px",
    alignItems: "center",
};

const linkStyle = {
    color: "white",
    textDecoration: "none",
    fontWeight: "500",
    transition: "color 0.2s",
};

const adminLinkStyle = {
    color: "#ff4757",
    textDecoration: "none",
    fontWeight: "bold",
    border: "1px solid #ff4757",
    padding: "4px 8px",
    borderRadius: "4px",
    fontSize: "0.9rem"
};

const userStyle = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
};

const avatarStyle = {
    width: "35px",
    height: "35px",
    borderRadius: "50%",
    backgroundColor: "#e94560",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "bold",
    color: "white",
    fontSize: "16px",
};

const btnStyle = {
    backgroundColor: "#0f3460",
    color: "white",
    padding: "6px 12px",
    borderRadius: "5px",
    textDecoration: "none",
    fontWeight: "500",
    transition: "background-color 0.2s",
};

const logoutBtn = {
    ...btnStyle,
    backgroundColor: "#e94560",
    border: "none",
    cursor: "pointer",
};