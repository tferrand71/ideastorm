const API_URL = "http://localhost/ideastorm/api.php";

export const signIn = async (username, password) => {
    const res = await fetch(`${API_URL}?action=login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error);
    }
    return res.json();
};

export const signUp = async (username, password) => {
    const res = await fetch(`${API_URL}?action=signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    if (!res.ok) throw new Error("Erreur lors de l'inscription");
    return res.json();
};
export const fetchLeaderboard = async () => {
    try {
        const res = await fetch(`${API_URL}?action=leaderboard`);
        if (!res.ok) throw new Error("Erreur leaderboard");
        return await res.json();
    } catch (err) {
        console.error(err);
        return []; // Retourne une liste vide en cas d'erreur pour ne pas faire planter le jeu
    }
};