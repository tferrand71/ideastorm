import { create } from "zustand";

// --- CONFIGURATION ---
const API_URL = "http://localhost/ideastorm/api.php";
// --- UTILITAIRES ---

// Transforme les clés snake_case (BDD) en camelCase (React)
// Ex: "cat_upgrade_cost" devient "catUpgradeCost"
const toCamelCase = (obj) => {
    if (!obj || typeof obj !== 'object') return obj;
    const newObj = {};
    for (const key in obj) {
        const newKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
        newObj[newKey] = obj[key];
    }
    return newObj;
};

const toNumber = (val, defaultVal) => {
    if (val === undefined || val === null) return defaultVal;
    const num = Number(val);
    return isNaN(num) ? defaultVal : num;
};

// --- COÛTS DE BASE ---
const BASE_COSTS = {
    click: 50, auto: 100,
    cat: 250, cat2: 2500,
    volcan: 25000, cat3: 200000, goose: 1000000,
    super: 500000, mega: 2500000, giga: 15000000, ultimate: 2500000,
    c500k: 40000000, c1m: 1e8, c10m: 1e9, c100m: 1e10, c1b: 1e11, c10b: 1e12, c100b: 1e13,
    a500k: 40000000, a1m: 1e8, a10m: 1e9, a100m: 1e10, a1b: 1e11, a10b: 1e12, a100b: 1e13,
    multX2: 1e8, autoMultX2: 1e8,
    godA: 1e12, godAA: 1e15, sext: 1e21, noni: 1e27, duo: 1e36,
    godGG: 1e30, godMM: 1e44, godSS: 1e55, godZZ: 1e75,
    googol: 1e100, cent: 1e303,
    c1e120: 1e120, c1e180: 1e180, c1e240: 1e240, c1e300: 1e300
};

// --- ÉTAT INITIAL ---
const getResetState = (rebirthCount) => {
    const isHardReset = rebirthCount === 0;
    const highMult = isHardReset ? 1 : (rebirthCount + 2);
    const lowMult = isHardReset ? 1 : Math.max(1.5, highMult / 2);
    const powerMult = isHardReset ? 1 : Math.pow(50, rebirthCount);

    return {
        score: 0,
        perClick: 1 * powerMult,
        perSecond: 0,
        rebirthCount: rebirthCount,
        activeMedia: [],

        // Booleens
        catBought: false, cat2Bought: false, cat3Bought: false,
        volcanBought: false, gooseBought: false,

        // Coûts
        clickUpgradeCost: Math.floor(BASE_COSTS.click * lowMult),
        autoUpgradeCost: Math.floor(BASE_COSTS.auto * lowMult),
        catUpgradeCost: Math.floor(BASE_COSTS.cat * lowMult),
        cat2UpgradeCost: Math.floor(BASE_COSTS.cat2 * lowMult),
        volcanCost: Math.floor(BASE_COSTS.volcan * ((lowMult + highMult) / 2)),
        cat3UpgradeCost: Math.floor(BASE_COSTS.cat3 * highMult),
        gooseCost: Math.floor(BASE_COSTS.goose * highMult),

        superClickCost: BASE_COSTS.super * highMult, megaClickCost: BASE_COSTS.mega * highMult, gigaClickCost: BASE_COSTS.giga * highMult, ultimateClickCost: BASE_COSTS.ultimate * highMult,
        click500kCost: BASE_COSTS.c500k * highMult, auto500kCost: BASE_COSTS.a500k * highMult,
        click1mCost: BASE_COSTS.c1m * highMult, auto1mCost: BASE_COSTS.a1m * highMult,
        click10mCost: BASE_COSTS.c10m * highMult, click100mCost: BASE_COSTS.c100m * highMult, click1bCost: BASE_COSTS.c1b * highMult, click10bCost: BASE_COSTS.c10b * highMult, click100bCost: BASE_COSTS.c100b * highMult,
        auto10mCost: BASE_COSTS.a10m * highMult, auto100mCost: BASE_COSTS.a100m * highMult, auto1bCost: BASE_COSTS.a1b * highMult, auto10bCost: BASE_COSTS.a10b * highMult, auto100bCost: BASE_COSTS.a100b * highMult,
        multX2Cost: BASE_COSTS.multX2 * highMult, autoMultX2Cost: BASE_COSTS.autoMultX2 * highMult,
        godClickACost: BASE_COSTS.godA * highMult, godClickAACost: BASE_COSTS.godAA * highMult,
        clickSextillionCost: BASE_COSTS.sext * highMult, autoSextillionCost: BASE_COSTS.sext * highMult,
        clickNonillionCost: BASE_COSTS.noni * highMult, autoNonillionCost: BASE_COSTS.noni * highMult,
        clickDuodecillionCost: BASE_COSTS.duo * highMult, autoDuodecillionCost: BASE_COSTS.duo * highMult,
        godClickGGCost: BASE_COSTS.godGG * highMult, godAutoGGCost: BASE_COSTS.godGG * highMult,
        godClickMMCost: BASE_COSTS.godMM * highMult, godClickSSCost: BASE_COSTS.godSS * highMult, godClickZZCost: BASE_COSTS.godZZ * highMult,
        clickGoogolCost: BASE_COSTS.googol * highMult, autoGoogolCost: BASE_COSTS.googol * highMult,
        clickCentillionCost: BASE_COSTS.cent * highMult, autoCentillionCost: BASE_COSTS.cent * highMult,
        click1e120Cost: BASE_COSTS.c1e120 * highMult, auto1e120Cost: BASE_COSTS.c1e120 * highMult,
        click1e180Cost: BASE_COSTS.c1e180 * highMult, auto1e180Cost: BASE_COSTS.c1e180 * highMult,
        click1e240Cost: BASE_COSTS.c1e240 * highMult, auto1e240Cost: BASE_COSTS.c1e240 * highMult,
        click1e300Cost: BASE_COSTS.c1e300 * highMult, auto1e300Cost: BASE_COSTS.c1e300 * highMult,
        godAutoACost: BASE_COSTS.godA * highMult, godAutoAACost: BASE_COSTS.godAA * highMult
    };
};

// --- STORE ZUSTAND ---
export const useStore = create((set, get) => ({
    // Initialisation
    ...getResetState(0),
    user: null,
    gameState: null,
    showMedia: true,
    hasSeenEnding: false,

    // Actions UI
    toggleMedia: () => set((state) => ({ showMedia: !state.showMedia })),
    closeEasterEgg: () => set({ hasSeenEnding: true }),
    setActiveMedia: (media) => set({ activeMedia: media }),

    // --- GESTION UTILISATEUR & CHARGEMENT ---
    setUser: (user) => {
        set({ user });
        if (user) {
            localStorage.setItem("game_user", JSON.stringify(user));
            get().loadGame(); // C'est ICI qu'on déclenche le chargement
        } else {
            localStorage.removeItem("game_user");
            set({ gameState: null, score: 0 });
        }
    },

    // --- Remplace ta fonction loadGame actuelle par celle-ci ---
    loadGame: async () => {
        const s = get();
        if (!s.user) return;

        try {
            // On tente de contacter le serveur
            const res = await fetch(`${API_URL}?action=load&userId=${s.user.id}`);

            // Si le serveur renvoie une erreur (ex: 500 ou 404 non géré)
            if (!res.ok) throw new Error(`Erreur HTTP: ${res.status}`);

            const rawData = await res.json();

            if (rawData && Object.keys(rawData).length > 0) {
                console.log("Sauvegarde trouvée:", rawData);

                // 1. Conversion snake_case -> camelCase
                const camelData = toCamelCase(rawData);

                // 2. Fusion avec les valeurs par défaut
                const savedRebirth = toNumber(camelData.rebirthCount, 0);
                const defaultState = getResetState(savedRebirth);

                set({
                    ...defaultState,
                    ...camelData,
                    gameState: true, // <--- DÉBLOQUE LE JEU (Succès)
                    // On force les types numériques
                    score: toNumber(camelData.score, 0),
                    perClick: toNumber(camelData.perClick, defaultState.perClick),
                    perSecond: toNumber(camelData.perSecond, 0),
                    rebirthCount: savedRebirth
                });
            } else {
                console.log("Nouvelle partie.");
                set({ ...getResetState(0), gameState: true }); // <--- DÉBLOQUE LE JEU (Nouveau joueur)
            }
        } catch (err) {
            console.error("ERREUR CRITIQUE CHARGEMENT:", err);

            // --- C'EST ICI QUE TU BLOQUAIS ---
            // En cas d'erreur (serveur éteint, crash...), on lance quand même une partie vide
            // pour que le joueur puisse jouer (mode hors ligne temporaire)
            alert("Erreur de connexion au serveur de sauvegarde. Le jeu se lance en mode temporaire.");
            set({ ...getResetState(0), gameState: true }); // <--- DÉBLOQUE LE JEU (Mode Secours)
        }
    },

    // --- SAUVEGARDE UNIFIÉE ---
    saveToDB: async (partialState = {}) => {
        const s = get();
        if (!s.user) return;

        // On fusionne l'état actuel avec les modifications récentes
        const currentState = { ...s, ...partialState };

        // On filtre pour ne pas envoyer de fonctions au serveur
        const keysToExclude = ['user', 'gameState', 'saveToDB', 'saveGame', 'loadGame', 'buyUpgrade', 'sellUpgrade', /* etc */];
        const dataToSave = {};

        for (const key in currentState) {
            if (typeof currentState[key] !== 'function' && !keysToExclude.includes(key)) {
                dataToSave[key] = currentState[key];
            }
        }

        try {
            await fetch(`${API_URL}?action=save`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_id: s.user.id,
                    score: currentState.score,
                    save_data: dataToSave
                })
            });
        } catch (err) {
            console.error("Erreur sauvegarde:", err);
        }
    },

    // Wrapper pour la sauvegarde périodique
    saveGame: async () => { get().saveToDB(); },

    // --- ACTIONS JEU ---
    addScore: (value) => {
        const { score } = get();
        const newScore = Math.floor(score + toNumber(value, 0));
        if (!isNaN(newScore)) set({ score: newScore });
    },

    addPerSecond: () => {
        const { perSecond, score } = get();
        const ps = toNumber(perSecond, 0);
        if (ps > 0) {
            const newScore = Math.floor(score + ps);
            if (!isNaN(newScore)) set({ score: newScore });
        }
    },

    triggerRebirth: async () => {
        const s = get();
        const REBIRTH_REQ = 1e36;
        if (s.score < REBIRTH_REQ || s.rebirthCount >= 6) return;

        const newRebirthCount = s.rebirthCount + 1;
        const resetState = getResetState(newRebirthCount);

        set(resetState);
        get().saveToDB(resetState); // Sauvegarde immédiate
        window.location.reload();
    },

    resetGame: async () => {
        const s = get();
        if (!s.user) return;

        const resetState = getResetState(0);
        set(resetState);
        get().saveToDB(resetState);
        window.location.reload();
    },

    // --- ACHATS & VENTES ---
    // Note: On garde les appels "legacy" (paramètres snake_case), mais saveToDB les ignorera
    // pour utiliser l'état global du store, ce qui est plus sûr.

    buyUpgrade: async (costKey, thresholdKey, dbCostKey, dbThresholdKey, clickBonus) => {
        const state = get();
        const cost = toNumber(state[costKey], Infinity);
        if (state.score >= cost) {
            const newScore = Math.floor(state.score - cost);
            const newPerClick = Math.floor(state.perClick + Number(clickBonus));
            const newCost = cost * 1.5;
            set({ score: newScore, perClick: newPerClick, [costKey]: newCost });
            get().saveToDB();
        }
    },

    buyAutoUpgradeHelper: async (costKey, thresholdKey, dbCostKey, dbThresholdKey, autoBonus) => {
        const state = get();
        const cost = toNumber(state[costKey], Infinity);
        if (state.score >= cost) {
            const newScore = Math.floor(state.score - cost);
            const newPerSecond = Math.floor(state.perSecond + Number(autoBonus));
            const newCost = cost * 1.5;
            set({ score: newScore, perSecond: newPerSecond, [costKey]: newCost });
            get().saveToDB();
        }
    },

    sellUpgrade: async (costKey, thresholdKey, dbCostKey, dbThresholdKey, statKey, dbStatKey, statDeduction, minCost) => {
        const state = get();
        const currentCost = toNumber(state[costKey], 0);
        if (currentCost <= 0) return;

        const previousCost = currentCost / 1.5;
        const refund = previousCost / 2;
        const newScore = Math.floor(state.score + refund);
        const newStat = Math.max(0, Math.floor(state[statKey] - toNumber(statDeduction, 0)));

        set({ score: newScore, [statKey]: newStat, [costKey]: previousCost });
        get().saveToDB();
    },

    // --- MAPPINGS CLICS (Identiques) ---
    buyClickUpgrade: () => get().buyUpgrade('clickUpgradeCost', 'clickUpgradeCost', '', '', 1),
    buySuperClick: () => get().buyUpgrade('superClickCost', 'superClickThreshold', '', '', 10000),
    buyMegaClick: () => get().buyUpgrade('megaClickCost', 'megaClickThreshold', '', '', 100000),
    buyGigaClick: () => get().buyUpgrade('gigaClickCost', 'gigaClickThreshold', '', '', 200000),
    buy500k: () => get().buyUpgrade('click500kCost', 'click500kThreshold', '', '', 500000),
    buy1m: () => get().buyUpgrade('click1mCost', 'click1mThreshold', '', '', 1000000),
    buy10m: () => get().buyUpgrade('click10mCost', 'click10mThreshold', '', '', 10000000),
    buy100m: () => get().buyUpgrade('click100mCost', 'click100mThreshold', '', '', 100000000),
    buy1b: () => get().buyUpgrade('click1bCost', 'click1bThreshold', '', '', 1000000000),
    buy10b: () => get().buyUpgrade('click10bCost', 'click10bThreshold', '', '', 10000000000),
    buy100b: () => get().buyUpgrade('click100bCost', 'click100bThreshold', '', '', 100000000000),

    // GOD MODE CLICS
    buyGodA: () => get().buyUpgrade('godClickACost', 'godClickAThreshold', '', '', 1e12),
    buyGodAA: () => get().buyUpgrade('godClickAACost', 'godClickAAThreshold', '', '', 1e15),
    buySextillion: () => get().buyUpgrade('clickSextillionCost', 'clickSextillionThreshold', '', '', 1e21),
    buyNonillion: () => get().buyUpgrade('clickNonillionCost', 'clickNonillionThreshold', '', '', 1e27),
    buyDuodecillion: () => get().buyUpgrade('clickDuodecillionCost', 'clickDuodecillionThreshold', '', '', 1e36),
    buyGoogol: () => get().buyUpgrade('clickGoogolCost', 'clickGoogolThreshold', '', '', 1e100),
    buyCentillion: () => get().buyUpgrade('clickCentillionCost', 'clickCentillionThreshold', '', '', 1e303),

    // INSANE CLICS
    buy1e120: () => get().buyUpgrade('click1e120Cost', 'click1e120Threshold', '', '', 1e120),
    buy1e180: () => get().buyUpgrade('click1e180Cost', 'click1e180Threshold', '', '', 1e180),
    buy1e240: () => get().buyUpgrade('click1e240Cost', 'click1e240Threshold', '', '', 1e240),
    buy1e300: () => get().buyUpgrade('click1e300Cost', 'click1e300Threshold', '', '', 1e300),

    // --- MAPPINGS AUTO ---
    buyAutoUpgrade: () => get().buyAutoUpgradeHelper('autoUpgradeCost', 'autoUpgradeCost', '', '', 2),
    buyAuto500k: () => get().buyAutoUpgradeHelper('auto500kCost', 'auto500kThreshold', '', '', 500000),
    buyAuto1m: () => get().buyAutoUpgradeHelper('auto1mCost', 'auto1mThreshold', '', '', 1000000),
    buyAuto10m: () => get().buyAutoUpgradeHelper('auto10mCost', 'auto10mThreshold', '', '', 10000000),
    buyAuto100m: () => get().buyAutoUpgradeHelper('auto100mCost', 'auto100mThreshold', '', '', 100000000),
    buyAuto1b: () => get().buyAutoUpgradeHelper('auto1bCost', 'auto1bThreshold', '', '', 1000000000),
    buyAuto10b: () => get().buyAutoUpgradeHelper('auto10bCost', 'auto10bThreshold', '', '', 10000000000),
    buyAuto100b: () => get().buyAutoUpgradeHelper('auto100bCost', 'auto100bThreshold', '', '', 100000000000),

    // GOD MODE AUTO
    buyAutoGodA: () => get().buyAutoUpgradeHelper('godAutoACost', 'godAutoAThreshold', '', '', 1e12),
    buyAutoGodAA: () => get().buyAutoUpgradeHelper('godAutoAACost', 'godAutoAAThreshold', '', '', 1e15),
    buyAutoSextillion: () => get().buyAutoUpgradeHelper('autoSextillionCost', 'autoSextillionThreshold', '', '', 1e21),
    buyAutoNonillion: () => get().buyAutoUpgradeHelper('autoNonillionCost', 'autoNonillionThreshold', '', '', 1e27),
    buyAutoDuodecillion: () => get().buyAutoUpgradeHelper('autoDuodecillionCost', 'autoDuodecillionThreshold', '', '', 1e36),
    buyAutoGoogol: () => get().buyAutoUpgradeHelper('autoGoogolCost', 'autoGoogolThreshold', '', '', 1e100),
    buyAutoCentillion: () => get().buyAutoUpgradeHelper('autoCentillionCost', 'autoCentillionThreshold', '', '', 1e303),

    // INSANE AUTO
    buyAuto1e120: () => get().buyAutoUpgradeHelper('auto1e120Cost', 'auto1e120Threshold', '', '', 1e120),
    buyAuto1e180: () => get().buyAutoUpgradeHelper('auto1e180Cost', 'auto1e180Threshold', '', '', 1e180),
    buyAuto1e240: () => get().buyAutoUpgradeHelper('auto1e240Cost', 'auto1e240Threshold', '', '', 1e240),
    buyAuto1e300: () => get().buyAutoUpgradeHelper('auto1e300Cost', 'auto1e300Threshold', '', '', 1e300),

    // Multiplicateurs Spéciaux
    buyMultX2: async () => {
        const s = get();
        if(s.score >= s.multX2Cost){
            const newScore = Math.floor(s.score-s.multX2Cost);
            const newPerClick = Math.floor(s.perClick*2);
            const newCost = Math.floor(s.multX2Cost*3);
            set({score:newScore, perClick:newPerClick, multX2Cost:newCost});
            get().saveToDB();
        }
    },
    buyAutoMultX2: async () => {
        const s = get();
        if(s.score >= s.autoMultX2Cost){
            const newScore = Math.floor(s.score-s.autoMultX2Cost);
            const newPerSecond = Math.floor(s.perSecond*2);
            const newCost = Math.floor(s.autoMultX2Cost*3);
            set({score:newScore, perSecond:newPerSecond, autoMultX2Cost:newCost});
            get().saveToDB();
        }
    },
    buyUltimateClick: async () => {
        const s = get();
        if(s.score >= s.ultimateClickCost){
            const newScore = Math.floor(s.score-s.ultimateClickCost);
            const newPerClick = Math.floor(s.perClick*3);
            const newCost = Math.floor(s.ultimateClickCost*4);
            set({score:newScore, perClick:newPerClick, ultimateClickCost:newCost});
            get().saveToDB();
        }
    },

    // Fonctions de vente (Mêmes mappings)
    sellClickUpgrade: () => get().sellUpgrade('clickUpgradeCost', '', '', '', 'perClick', '', 1, 0),
    sellSuperClick: () => get().sellUpgrade('superClickCost', '', '', '', 'perClick', '', 10000, 0),
    // ... (Tu peux ajouter les autres ventes ici sur le même modèle si besoin,
    // l'important est que saveToDB() soit appelé sans arguments)

    // Compagnons
    buyCatUpgrade: async () => {
        const s = get();
        if(s.score >= s.catUpgradeCost && !s.catBought) {
            const pm = Math.pow(50, s.rebirthCount);
            set({score: Math.floor(s.score - s.catUpgradeCost), perSecond: Math.floor(s.perSecond + 5 * pm), catBought: true});
            get().saveToDB();
        }
    },
    buyCat2Upgrade: async () => {
        const s = get();
        if(s.score >= s.cat2UpgradeCost && !s.cat2Bought) {
            const pm = Math.pow(50, s.rebirthCount);
            set({score: Math.floor(s.score - s.cat2UpgradeCost), perSecond: Math.floor(s.perSecond + 60 * pm), cat2Bought: true});
            get().saveToDB();
        }
    },
    buyVolcan: async () => {
        const s = get();
        if(s.score >= s.volcanCost && !s.volcanBought) {
            const pm = Math.pow(50, s.rebirthCount);
            set({score: Math.floor(s.score - s.volcanCost), perSecond: Math.floor(s.perSecond + 700 * pm), volcanBought: true});
            get().saveToDB();
        }
    },
    buyCat3Upgrade: async () => {
        const s = get();
        if(s.score >= s.cat3UpgradeCost && !s.cat3Bought) {
            const pm = Math.pow(50, s.rebirthCount);
            set({score: Math.floor(s.score - s.cat3UpgradeCost), perSecond: Math.floor(s.perSecond + 6000 * pm), cat3Bought: true});
            get().saveToDB();
        }
    },
    buyGoose: async () => {
        const s = get();
        if(s.score >= s.gooseCost && !s.gooseBought) {
            const pm = Math.pow(50, s.rebirthCount);
            set({score: Math.floor(s.score - s.gooseCost), perSecond: Math.floor(s.perSecond + 35000 * pm), gooseBought: true});
            get().saveToDB();
        }
    },
}));

export default useStore;