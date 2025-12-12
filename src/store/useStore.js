import { create } from "zustand";
import supabase from "../lib/supabaseClient";

// Helper de sécurité pour convertir en nombre
const toNumber = (val, defaultVal) => {
    if (val === undefined || val === null) return defaultVal;
    const num = Number(val);
    return isNaN(num) ? defaultVal : num;
};

// --- COÛTS DE BASE (CONSTANTES) ---
// Ces valeurs servent de référence pour recalculer les prix après un Rebirth.
const BASE_COSTS = {
    // Début de jeu (Low Tier)
    click: 50, auto: 100,
    cat: 250, cat2: 2500, // Chat Ninja

    // Milieu de jeu (Mid Tier)
    volcan: 25000,     // Chat Tueur
    cat3: 200000,      // Roi Chat
    goose: 1000000,    // L'Oie

    // Spéciaux
    super: 500000, mega: 2500000, giga: 15000000, ultimate: 2500000,

    // Fin de jeu (High Tier - Massifs)
    c500k: 40000000, c1m: 1e8, c10m: 1e9, c100m: 1e10, c1b: 1e11, c10b: 1e12, c100b: 1e13,
    a500k: 40000000, a1m: 1e8, a10m: 1e9, a100m: 1e10, a1b: 1e11, a10b: 1e12, a100b: 1e13,

    // Multiplicateurs
    multX2: 1e8, autoMultX2: 1e8,

    // God Mode (Trillion -> Centillion)
    godA: 1e12, godAA: 1e15,
    sext: 1e21, noni: 1e27, duo: 1e36,
    godGG: 1e30, godMM: 1e44, godSS: 1e55, godZZ: 1e75, // Anciens noms conservés BDD
    googol: 1e100, cent: 1e303,

    // Cosmiques (Limites JS - 1e308)
    c1e120: 1e120, c1e180: 1e180, c1e240: 1e240, c1e300: 1e300
};

// --- GÉNÉRATEUR D'ÉTAT INITIAL (Pour Reset & Rebirth) ---
const getResetState = (rebirthCount) => {
    // Si rebirthCount = 0 (Reset total), tout est x1.
    const isHardReset = rebirthCount === 0;

    // Multiplicateur FINAL pour le Late Game (x3, x4, x5...)
    const highMult = isHardReset ? 1 : (rebirthCount + 2);

    // Multiplicateur DOUX pour le Early Game (Moitié moins fort)
    const lowMult = isHardReset ? 1 : Math.max(1.5, highMult / 2);

    // Puissance x50
    const powerMult = isHardReset ? 1 : Math.pow(50, rebirthCount);

    return {
        score: 0,
        perClick: 1 * powerMult,
        perSecond: 0,
        rebirthCount: rebirthCount,
        activeMedia: [],

        // RESET DES BOOLEENS
        catBought: false, cat2Bought: false, cat3Bought: false,
        volcanBought: false, gooseBought: false,

        // RESET DES COÛTS AVEC MULTIPLICATEURS PROGRESSIFS

        // 1. EARLY GAME (Prix Doux)
        clickUpgradeCost: Math.floor(BASE_COSTS.click * lowMult),
        autoUpgradeCost: Math.floor(BASE_COSTS.auto * lowMult),
        catUpgradeCost: Math.floor(BASE_COSTS.cat * lowMult),
        cat2UpgradeCost: Math.floor(BASE_COSTS.cat2 * lowMult),

        // 2. MID GAME (Transition)
        volcanCost: Math.floor(BASE_COSTS.volcan * ((lowMult + highMult) / 2)),
        cat3UpgradeCost: Math.floor(BASE_COSTS.cat3 * highMult),
        gooseCost: Math.floor(BASE_COSTS.goose * highMult),

        // 3. LATE GAME (Prix Forts)
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

const useStore = create((set, get) => ({
    // --- ÉTATS INITIAUX ---
    ...getResetState(0),
    user: null, gameState: null, showMedia: true, hasSeenEnding: false,

    // --- FONCTIONS SYSTÈME ---
    toggleMedia: () => set((state) => ({ showMedia: !state.showMedia })),
    closeEasterEgg: () => set({ hasSeenEnding: true }),
    setGameState: (newState) => { set(newState); },
    setActiveMedia: (media) => set({ activeMedia: media }),

    setUser: async (user) => {
        set({ user });
        if (user) {
            const { data } = await supabase.from("game_state").select("*").eq("user_id", user.id).single();
            if (data) {
                set({
                    gameState: data, score: toNumber(data.score, 0), perClick: toNumber(data.per_click, 1), perSecond: toNumber(data.per_second, 0), activeMedia: data.active_media, rebirthCount: toNumber(data.rebirth_count, 0),
                    // Chargement dynamique des coûts (surcharge les defaults)
                    clickUpgradeCost: toNumber(data.click_upgrade_cost, BASE_COSTS.click), autoUpgradeCost: toNumber(data.auto_upgrade_cost, BASE_COSTS.auto),
                    catUpgradeCost: toNumber(data.cat_upgrade_cost, BASE_COSTS.cat), cat2UpgradeCost: toNumber(data.cat2_upgrade_cost, BASE_COSTS.cat2),
                    cat3UpgradeCost: toNumber(data.cat3_upgrade_cost, BASE_COSTS.cat3), volcanCost: toNumber(data.volcan_cost, BASE_COSTS.volcan), gooseCost: toNumber(data.goose_cost, BASE_COSTS.goose),
                    catBought: data.cat_bought, cat2Bought: data.cat2_bought, cat3Bought: data.cat3_bought, volcanBought: data.volcan_bought, gooseBought: data.goose_bought,

                    superClickCost: toNumber(data.super_click_cost, BASE_COSTS.super), megaClickCost: toNumber(data.mega_click_cost, BASE_COSTS.mega), gigaClickCost: toNumber(data.giga_click_cost, BASE_COSTS.giga), ultimateClickCost: toNumber(data.ultimate_click_cost, BASE_COSTS.ultimate),
                    click500kCost: toNumber(data.click_500k_cost, BASE_COSTS.c500k), click1mCost: toNumber(data.click_1m_cost, BASE_COSTS.c1m), click10mCost: toNumber(data.click_10m_cost, BASE_COSTS.c10m), click100mCost: toNumber(data.click_100m_cost, BASE_COSTS.c100m), click1bCost: toNumber(data.click_1b_cost, BASE_COSTS.c1b), click10bCost: toNumber(data.click_10b_cost, BASE_COSTS.c10b), click100bCost: toNumber(data.click_100b_cost, BASE_COSTS.c100b),
                    auto500kCost: toNumber(data.auto_500k_cost, BASE_COSTS.a500k), auto1mCost: toNumber(data.auto_1m_cost, BASE_COSTS.a1m), auto10mCost: toNumber(data.auto_10m_cost, BASE_COSTS.a10m), auto100mCost: toNumber(data.auto_100m_cost, BASE_COSTS.a100m), auto1bCost: toNumber(data.auto_1b_cost, BASE_COSTS.a1b), auto10bCost: toNumber(data.auto_10b_cost, BASE_COSTS.a10b), auto100bCost: toNumber(data.auto_100b_cost, BASE_COSTS.a100b),
                    multX2Cost: toNumber(data.mult_x2_cost, BASE_COSTS.multX2), autoMultX2Cost: toNumber(data.auto_mult_x2_cost, BASE_COSTS.autoMultX2),

                    godClickACost: toNumber(data.god_click_a_cost, BASE_COSTS.godA), godClickAACost: toNumber(data.god_click_aa_cost, BASE_COSTS.godAA), godClickGGCost: toNumber(data.god_click_gg_cost, BASE_COSTS.godGG), godClickMMCost: toNumber(data.god_click_mm_cost, BASE_COSTS.godMM), godClickSSCost: toNumber(data.god_click_ss_cost, BASE_COSTS.godSS), godClickZZCost: toNumber(data.god_click_zz_cost, BASE_COSTS.godZZ),
                    clickSextillionCost: toNumber(data.click_sextillion_cost, BASE_COSTS.sext), clickNonillionCost: toNumber(data.click_nonillion_cost, BASE_COSTS.noni), clickDuodecillionCost: toNumber(data.click_duodecillion_cost, BASE_COSTS.duo), clickGoogolCost: toNumber(data.click_googol_cost, BASE_COSTS.googol), clickCentillionCost: toNumber(data.click_centillion_cost, BASE_COSTS.cent),
                    click1e120Cost: toNumber(data.click_1e120_cost, BASE_COSTS.c1e120), click1e180Cost: toNumber(data.click_1e180_cost, BASE_COSTS.c1e180), click1e240Cost: toNumber(data.click_1e240_cost, BASE_COSTS.c1e240), click1e300Cost: toNumber(data.click_1e300_cost, BASE_COSTS.c1e300),

                    godAutoACost: toNumber(data.god_auto_a_cost, BASE_COSTS.godA), godAutoAACost: toNumber(data.god_auto_aa_cost, BASE_COSTS.godAA), godAutoGGCost: toNumber(data.god_auto_gg_cost, BASE_COSTS.godGG),
                    autoSextillionCost: toNumber(data.auto_sextillion_cost, BASE_COSTS.sext), autoNonillionCost: toNumber(data.auto_nonillion_cost, BASE_COSTS.noni), autoDuodecillionCost: toNumber(data.auto_duodecillion_cost, BASE_COSTS.duo), autoGoogolCost: toNumber(data.auto_googol_cost, BASE_COSTS.googol), autoCentillionCost: toNumber(data.auto_centillion_cost, BASE_COSTS.cent),
                    auto1e120Cost: toNumber(data.auto_1e120_cost, BASE_COSTS.c1e120), auto1e180Cost: toNumber(data.auto_1e180_cost, BASE_COSTS.c1e180), auto1e240Cost: toNumber(data.auto_1e240_cost, BASE_COSTS.c1e240), auto1e300Cost: toNumber(data.auto_1e300_cost, BASE_COSTS.c1e300),
                });
            }
        } else { set({ user: null, gameState: null, score: 0 }); }
    },

    saveToDB: async (payload) => {
        const state = get(); if (!state.gameState) return;
        const stringPayload = {};
        for (const key in payload) {
            const val = payload[key];
            if (typeof val === 'number' && !isNaN(val) && isFinite(val)) stringPayload[key] = val;
            else if (typeof val === 'boolean') stringPayload[key] = val;
        }
        if (Object.keys(stringPayload).length > 0) supabase.from("game_state").update(stringPayload).eq("id", state.gameState.id).then();
    },
    saveGame: async () => { const s = get(); if(!s.gameState) return; s.saveToDB({ score: s.score, per_click: s.perClick, per_second: s.perSecond, rebirth_count: s.rebirthCount }); },
    addScore: (value) => { const { score } = get(); const newScore = Math.floor(score + toNumber(value, 0)); if (!isNaN(newScore)) set({ score: newScore }); },
    addPerSecond: () => { const { perSecond, score } = get(); const ps = toNumber(perSecond, 0); if (ps > 0) { const newScore = Math.floor(score + ps); if (!isNaN(newScore)) set({ score: newScore }); } },

    // --- REBIRTH TRIGGER ---
    triggerRebirth: async () => {
        const s = get();
        const REBIRTH_REQ = 1e36; // 1 Undécillion
        if (s.score < REBIRTH_REQ || s.rebirthCount >= 6) return;

        const newRebirthCount = s.rebirthCount + 1;
        // Génère l'état propre avec les bons prix
        const resetState = getResetState(newRebirthCount);

        set(resetState);

        // Sauvegarde BDD en snake_case
        const dbPayload = {
            score: 0, per_click: resetState.perClick, per_second: 0, rebirth_count: newRebirthCount,
            active_media: [],
            cat_bought: false, cat2_bought: false, cat3_bought: false, volcan_bought: false, goose_bought: false,
            click_upgrade_cost: resetState.clickUpgradeCost, auto_upgrade_cost: resetState.autoUpgradeCost,
            cat_upgrade_cost: resetState.catUpgradeCost, cat2_upgrade_cost: resetState.cat2UpgradeCost,
            volcan_cost: resetState.volcanCost, cat3_upgrade_cost: resetState.cat3UpgradeCost, goose_cost: resetState.gooseCost,
            // Pour bien faire, on devrait lister tous les coûts importants ici pour éviter qu'ils ne reviennent à leur valeur par défaut au reload
            god_click_zz_cost: resetState.godClickZZCost,
            click_1e300_cost: resetState.click1e300Cost
        };
        await supabase.from("game_state").update(dbPayload).eq("id", s.gameState.id);
        window.location.reload();
    },

    // --- RESET TOTAL (ADMIN / SHOP) ---
    resetGame: async () => {
        const { gameState } = get(); if (!gameState) return;

        // État Niveau 0
        const resetState = getResetState(0);

        set(resetState);

        const dbPayload = {
            score: 0, per_click: 1, per_second: 0, rebirth_count: 0, active_media: [],
            cat_bought: false, cat2_bought: false, cat3_bought: false, volcan_bought: false, goose_bought: false,
            click_upgrade_cost: BASE_COSTS.click, auto_upgrade_cost: BASE_COSTS.auto,
            cat_upgrade_cost: BASE_COSTS.cat, cat2_upgrade_cost: BASE_COSTS.cat2,
            volcan_cost: BASE_COSTS.volcan, cat3_upgrade_cost: BASE_COSTS.cat3, goose_cost: BASE_COSTS.goose,
            god_click_zz_cost: BASE_COSTS.godZZ
        };
        await supabase.from("game_state").update(dbPayload).eq("id", gameState.id);
        window.location.reload();
    },

    // --- ACHATS & VENTES (Standard) ---
    buyUpgrade: async (costKey, thresholdKey, dbCostKey, dbThresholdKey, clickBonus) => {
        const state = get(); const cost = toNumber(state[costKey], Infinity);
        if (state.score >= cost) {
            const newScore = Math.floor(state.score - cost); const newPerClick = Math.floor(state.perClick + Number(clickBonus));
            const newCost = cost * 1.5;
            if (!isNaN(newScore)) {
                set({ score: newScore, perClick: newPerClick, [costKey]: newCost });
                get().saveToDB({ score: newScore, per_click: newPerClick, [dbCostKey]: newCost });
            }
        }
    },
    buyAutoUpgradeHelper: async (costKey, thresholdKey, dbCostKey, dbThresholdKey, autoBonus) => {
        const state = get(); const cost = toNumber(state[costKey], Infinity);
        if (state.score >= cost) {
            const newScore = Math.floor(state.score - cost); const newPerSecond = Math.floor(state.perSecond + Number(autoBonus));
            const newCost = cost * 1.5;
            if (!isNaN(newScore)) {
                set({ score: newScore, perSecond: newPerSecond, [costKey]: newCost });
                get().saveToDB({ score: newScore, per_second: newPerSecond, [dbCostKey]: newCost });
            }
        }
    },
    sellUpgrade: async (costKey, thresholdKey, dbCostKey, dbThresholdKey, statKey, dbStatKey, statDeduction, minCost) => {
        const state = get(); const currentCost = toNumber(state[costKey], 0);
        if (currentCost <= 0) return;
        const previousCost = currentCost / 1.5; const refund = previousCost / 2;
        const newScore = Math.floor(state.score + refund); const newStat = Math.max(0, Math.floor(state[statKey] - toNumber(statDeduction, 0)));
        if (!isNaN(newScore)) {
            set({ score: newScore, [statKey]: newStat, [costKey]: previousCost });
            get().saveToDB({ score: newScore, [dbStatKey]: newStat, [dbCostKey]: previousCost });
        }
    },

    // --- MAPPINGS CLICS ---
    buyClickUpgrade: () => get().buyUpgrade('clickUpgradeCost', 'clickUpgradeCost', 'click_upgrade_cost', 'click_upgrade_cost', 1),
    buySuperClick: () => get().buyUpgrade('superClickCost', 'superClickThreshold', 'super_click_cost', 'super_click_threshold', 10000),
    buyMegaClick: () => get().buyUpgrade('megaClickCost', 'megaClickThreshold', 'mega_click_cost', 'mega_click_threshold', 100000),
    buyGigaClick: () => get().buyUpgrade('gigaClickCost', 'gigaClickThreshold', 'giga_click_cost', 'giga_click_threshold', 20000000),
    buy500k: () => get().buyUpgrade('click500kCost', 'click500kThreshold', 'click_500k_cost', 'click_500k_threshold', 500000),
    buy1m: () => get().buyUpgrade('click1mCost', 'click1mThreshold', 'click_1m_cost', 'click_1m_threshold', 1000000),
    buy10m: () => get().buyUpgrade('click10mCost', 'click10mThreshold', 'click_10m_cost', 'click_10m_threshold', 10000000),
    buy100m: () => get().buyUpgrade('click100mCost', 'click100mThreshold', 'click_100m_cost', 'click_100m_threshold', 100000000),
    buy1b: () => get().buyUpgrade('click1bCost', 'click1bThreshold', 'click_1b_cost', 'click_1b_threshold', 1000000000),
    buy10b: () => get().buyUpgrade('click10bCost', 'click10bThreshold', 'click_10b_cost', 'click_10b_threshold', 10000000000),
    buy100b: () => get().buyUpgrade('click100bCost', 'click100bThreshold', 'click100b_cost', 'click100b_threshold', 100000000000),

    // GOD MODE
    buyGodA: () => get().buyUpgrade('godClickACost', 'godClickAThreshold', 'god_click_a_cost', 'god_click_a_threshold', 1e12),
    buyGodAA: () => get().buyUpgrade('godClickAACost', 'godClickAAThreshold', 'god_click_aa_cost', 'god_click_aa_threshold', 1e15),
    buySextillion: () => get().buyUpgrade('clickSextillionCost', 'clickSextillionThreshold', 'click_sextillion_cost', 'click_sextillion_threshold', 1e21),
    buyNonillion: () => get().buyUpgrade('clickNonillionCost', 'clickNonillionThreshold', 'click_nonillion_cost', 'click_nonillion_threshold', 1e27),
    buyDuodecillion: () => get().buyUpgrade('clickDuodecillionCost', 'clickDuodecillionThreshold', 'click_duodecillion_cost', 'click_duodecillion_threshold', 1e36),
    buyGoogol: () => get().buyUpgrade('clickGoogolCost', 'clickGoogolThreshold', 'click_googol_cost', 'click_googol_threshold', 1e100),
    buyCentillion: () => get().buyUpgrade('clickCentillionCost', 'clickCentillionThreshold', 'click_centillion_cost', 'click_centillion_threshold', 1e303),
    buy1e120: () => get().buyUpgrade('click1e120Cost', 'click1e120Threshold', 'click_1e120_cost', 'click_1e120_threshold', 1e120),
    buy1e180: () => get().buyUpgrade('click1e180Cost', 'click1e180Threshold', 'click_1e180_cost', 'click_1e180_threshold', 1e180),
    buy1e240: () => get().buyUpgrade('click1e240Cost', 'click1e240Threshold', 'click_1e240_cost', 'click_1e240_threshold', 1e240),
    buy1e300: () => get().buyUpgrade('click1e300Cost', 'click1e300Threshold', 'click_1e300_cost', 'click_1e300_threshold', 1e300),

    // --- MAPPINGS AUTO ---
    buyAutoUpgrade: () => get().buyAutoUpgradeHelper('autoUpgradeCost', 'autoUpgradeCost', 'auto_upgrade_cost', 'auto_upgrade_cost', 2),
    buyAuto500k: () => get().buyAutoUpgradeHelper('auto500kCost', 'auto500kThreshold', 'auto_500k_cost', 'auto_500k_threshold', 500000),
    buyAuto1m: () => get().buyAutoUpgradeHelper('auto1mCost', 'auto1mThreshold', 'auto_1m_cost', 'auto_1m_threshold', 1000000),
    buyAuto10m: () => get().buyAutoUpgradeHelper('auto10mCost', 'auto10mThreshold', 'auto_10m_cost', 'auto_10m_threshold', 10000000),
    buyAuto100m: () => get().buyAutoUpgradeHelper('auto100mCost', 'auto100mThreshold', 'auto100m_cost', 'auto100m_threshold', 100000000),
    buyAuto1b: () => get().buyAutoUpgradeHelper('auto1bCost', 'auto1bThreshold', 'auto_1b_cost', 'auto_1b_threshold', 1000000000),
    buyAuto10b: () => get().buyAutoUpgradeHelper('auto10bCost', 'auto10bThreshold', 'auto_10b_cost', 'auto_10b_threshold', 10000000000),
    buyAuto100b: () => get().buyAutoUpgradeHelper('auto100bCost', 'auto100bThreshold', 'auto_100b_cost', 'auto_100b_threshold', 100000000000),
    buyAutoGodA: () => get().buyAutoUpgradeHelper('godAutoACost', 'godAutoAThreshold', 'god_auto_a_cost', 'god_auto_a_threshold', 1e12),
    buyAutoGodAA: () => get().buyAutoUpgradeHelper('godAutoAACost', 'godAutoAAThreshold', 'god_auto_aa_cost', 'god_auto_aa_threshold', 1e15),
    buyAutoSextillion: () => get().buyAutoUpgradeHelper('autoSextillionCost', 'autoSextillionThreshold', 'auto_sextillion_cost', 'auto_sextillion_threshold', 1e21),
    buyAutoNonillion: () => get().buyAutoUpgradeHelper('autoNonillionCost', 'autoNonillionThreshold', 'auto_nonillion_cost', 'auto_nonillion_threshold', 1e27),
    buyAutoDuodecillion: () => get().buyAutoUpgradeHelper('autoDuodecillionCost', 'autoDuodecillionThreshold', 'auto_duodecillion_cost', 'auto_duodecillion_threshold', 1e36),
    buyAutoGoogol: () => get().buyAutoUpgradeHelper('autoGoogolCost', 'autoGoogolThreshold', 'auto_googol_cost', 'auto_googol_threshold', 1e100),
    buyAutoCentillion: () => get().buyAutoUpgradeHelper('autoCentillionCost', 'autoCentillionThreshold', 'auto_centillion_cost', 'auto_centillion_threshold', 1e303),
    buyAuto1e120: () => get().buyAutoUpgradeHelper('auto1e120Cost', 'auto1e120Threshold', 'auto_1e120_cost', 'auto_1e120_threshold', 1e120),
    buyAuto1e180: () => get().buyAutoUpgradeHelper('auto1e180Cost', 'auto1e180Threshold', 'auto_1e180_cost', 'auto_1e180_threshold', 1e180),
    buyAuto1e240: () => get().buyAutoUpgradeHelper('auto1e240Cost', 'auto1e240Threshold', 'auto_1e240_cost', 'auto_1e240_threshold', 1e240),
    buyAuto1e300: () => get().buyAutoUpgradeHelper('auto1e300Cost', 'auto1e300Threshold', 'auto_1e300_cost', 'auto_1e300_threshold', 1e300),

    buyMultX2: async () => { const s = get(); if(s.score>=s.multX2Cost){ const newScore = Math.floor(s.score-s.multX2Cost); const newPerClick = Math.floor(s.perClick*2); const newCost = Math.floor(s.multX2Cost*3); set({score:newScore, perClick:newPerClick, multX2Cost:newCost}); get().saveToDB({score:newScore, per_click:newPerClick, mult_x2_cost:newCost});}},
    buyAutoMultX2: async () => { const s = get(); if(s.score>=s.autoMultX2Cost){ const newScore = Math.floor(s.score-s.autoMultX2Cost); const newPerSecond = Math.floor(s.perSecond*2); const newCost = Math.floor(s.autoMultX2Cost*3); set({score:newScore, perSecond:newPerSecond, autoMultX2Cost:newCost}); get().saveToDB({score:newScore, per_second:newPerSecond, auto_mult_x2_cost:newCost});}},
    buyUltimateClick: async () => { const s = get(); if(s.score>=s.ultimateClickCost){ const newScore = Math.floor(s.score-s.ultimateClickCost); const newPerClick = Math.floor(s.perClick*3); const newCost = Math.floor(s.ultimateClickCost*4); set({score:newScore, perClick:newPerClick, ultimateClickCost:newCost}); get().saveToDB({score:newScore, per_click:newPerClick, ultimate_click_cost:newCost});}},

    sellClickUpgrade: () => get().sellUpgrade('clickUpgradeCost', 'clickUpgradeCost', 'click_upgrade_cost', 'click_upgrade_cost', 'perClick', 'per_click', 1, 50),
    sellSuperClick: () => get().sellUpgrade('superClickCost', 'superClickThreshold', 'super_click_cost', 'super_click_threshold', 'perClick', 'per_click', 10000, 500000),
    sellMegaClick: () => get().sellUpgrade('megaClickCost', 'megaClickThreshold', 'mega_click_cost', 'mega_click_threshold', 'perClick', 'per_click', 100000, 5000000),
    sellGigaClick: () => get().sellUpgrade('gigaClickCost', 'gigaClickThreshold', 'giga_click_cost', 'giga_click_threshold', 'perClick', 'per_click', 200000, 20000000),
    sell500k: () => get().sellUpgrade('click500kCost', 'click500kThreshold', 'click_500k_cost', 'click_500k_threshold', 'perClick', 'per_click', 500000, 50000000),
    sell1m: () => get().sellUpgrade('click1mCost', 'click1mThreshold', 'click_1m_cost', 'click_1m_threshold', 'perClick', 'per_click', 1000000, 100000000),
    sell10m: () => get().sellUpgrade('click10mCost', 'click10mThreshold', 'click10m_cost', 'click10m_threshold', 'perClick', 'per_click', 10000000, 1000000000),
    sell100m: () => get().sellUpgrade('click100mCost', 'click100mThreshold', 'click100m_cost', 'click_100m_threshold', 'perClick', 'per_click', 100000000, 10000000000),
    sell1b: () => get().sellUpgrade('click1bCost', 'click1bThreshold', 'click_1b_cost', 'click_1b_threshold', 'perClick', 'per_click', 1000000000, 100000000000),
    sell10b: () => get().sellUpgrade('click10bCost', 'click10bThreshold', 'click_10b_cost', 'click_10b_threshold', 'perClick', 'per_click', 10000000000, 1000000000000),
    sell100b: () => get().sellUpgrade('click100bCost', 'click100bThreshold', 'click100b_cost', 'click100b_threshold', 'perClick', 'per_click', 100000000000, 10000000000000),
    sellGodA: () => get().sellUpgrade('godClickACost', 'godClickAThreshold', 'god_click_a_cost', 'god_click_a_threshold', 'perClick', 'per_click', 1e12, 1e12),
    sellGodAA: () => get().sellUpgrade('godClickAACost', 'godClickAAThreshold', 'god_click_aa_cost', 'god_click_aa_threshold', 'perClick', 'per_click', 1e15, 1e15),
    sellSextillion: () => get().sellUpgrade('clickSextillionCost', 'clickSextillionThreshold', 'click_sextillion_cost', 'click_sextillion_threshold', 'perClick', 'per_click', 1e21, 1e21),
    sellNonillion: () => get().sellUpgrade('clickNonillionCost', 'clickNonillionThreshold', 'click_nonillion_cost', 'click_nonillion_threshold', 'perClick', 'per_click', 1e27, 1e27),
    sellDuodecillion: () => get().sellUpgrade('clickDuodecillionCost', 'clickDuodecillionThreshold', 'click_duodecillion_cost', 'click_duodecillion_threshold', 'perClick', 'per_click', 1e36, 1e36),
    sellGoogol: () => get().sellUpgrade('clickGoogolCost', 'clickGoogolThreshold', 'click_googol_cost', 'click_googol_threshold', 'perClick', 'per_click', 1e100, 1e100),
    sellAutoUpgrade: () => get().sellUpgrade('autoUpgradeCost', 'autoUpgradeCost', 'auto_upgrade_cost', 'auto_upgrade_cost', 'perSecond', 'per_second', 2, 100),
    sellAuto500k: () => get().sellUpgrade('auto500kCost', 'auto500kThreshold', 'auto_500k_cost', 'auto_500k_threshold', 'perSecond', 'per_second', 500000, 50000000),
    sellAuto1m: () => get().sellUpgrade('auto1mCost', 'auto1mThreshold', 'auto_1m_cost', 'auto_1m_threshold', 'perSecond', 'per_second', 1000000, 100000000),
    sellAuto10m: () => get().sellUpgrade('auto10mCost', 'auto10mThreshold', 'auto_10m_cost', 'auto_10m_threshold', 'perSecond', 'per_second', 10000000, 1000000000),
    sellAuto100m: () => get().sellUpgrade('auto100mCost', 'auto100mThreshold', 'auto100m_cost', 'auto_100m_threshold', 'perSecond', 'per_second', 100000000, 10000000000),
    sellAuto1b: () => get().sellUpgrade('auto1bCost', 'auto1bThreshold', 'auto_1b_cost', 'auto_1b_threshold', 'perSecond', 'per_second', 1000000000, 100000000000),
    sellAuto10b: () => get().sellUpgrade('auto10bCost', 'auto10bThreshold', 'auto_10b_cost', 'auto_10b_threshold', 'perSecond', 'per_second', 10000000000, 1000000000000),
    sellAuto100b: () => get().sellUpgrade('auto100bCost', 'auto100bThreshold', 'auto100b_cost', 'auto_100b_threshold', 'perSecond', 'per_second', 100000000000, 10000000000000),
    sellAutoGodA: () => get().sellUpgrade('godAutoACost', 'godAutoAThreshold', 'god_auto_a_cost', 'god_auto_a_threshold', 'perSecond', 'per_second', 1e12, 1e12),
    sellAutoGodAA: () => get().sellUpgrade('godAutoAACost', 'godAutoAAThreshold', 'god_auto_aa_cost', 'god_auto_aa_threshold', 'perSecond', 'per_second', 1e15, 1e15),
    sellAutoSextillion: () => get().sellUpgrade('autoSextillionCost', 'autoSextillionThreshold', 'auto_sextillion_cost', 'auto_sextillion_threshold', 'perSecond', 'per_second', 1e21, 1e21),
    sellAutoNonillion: () => get().sellUpgrade('autoNonillionCost', 'autoNonillionThreshold', 'auto_nonillion_cost', 'auto_nonillion_threshold', 'perSecond', 'per_second', 1e27, 1e27),
    sellAutoDuodecillion: () => get().sellUpgrade('autoDuodecillionCost', 'autoDuodecillionThreshold', 'auto_duodecillion_cost', 'auto_duodecillion_threshold', 'perSecond', 'per_second', 1e36, 1e36),
    sellAutoGoogol: () => get().sellUpgrade('autoGoogolCost', 'autoGoogolThreshold', 'auto_googol_cost', 'auto_googol_threshold', 'perSecond', 'per_second', 1e100, 1e100),
    sell1e120: () => get().sellUpgrade('click1e120Cost', 'click1e120Threshold', 'click_1e120_cost', 'click_1e120_threshold', 'perClick', 'per_click', 1e120, 1e120),
    sell1e180: () => get().sellUpgrade('click1e180Cost', 'click1e180Threshold', 'click_1e180_cost', 'click_1e180_threshold', 'perClick', 'per_click', 1e180, 1e180),
    sell1e240: () => get().sellUpgrade('click1e240Cost', 'click1e240Threshold', 'click_1e240_cost', 'click_1e240_threshold', 'perClick', 'per_click', 1e240, 1e240),
    sell1e300: () => get().sellUpgrade('click1e300Cost', 'click1e300Threshold', 'click_1e300_cost', 'click_1e300_threshold', 'perClick', 'per_click', 1e300, 1e300),
    sellAuto1e120: () => get().sellUpgrade('auto1e120Cost', 'auto1e120Threshold', 'auto_1e120_cost', 'auto_1e120_threshold', 'perSecond', 'per_second', 1e120, 1e120),
    sellAuto1e180: () => get().sellUpgrade('auto1e180Cost', 'auto1e180Threshold', 'auto_1e180_cost', 'auto_1e180_threshold', 'perSecond', 'per_second', 1e180, 1e180),
    sellAuto1e240: () => get().sellUpgrade('auto1e240Cost', 'auto1e240Threshold', 'auto_1e240_cost', 'auto_1e240_threshold', 'perSecond', 'per_second', 1e240, 1e240),
    sellAuto1e300: () => get().sellUpgrade('auto1e300Cost', 'auto1e300Threshold', 'auto_1e300_cost', 'auto_1e300_threshold', 'perSecond', 'per_second', 1e300, 1e300),

    // --- COMPAGNONS (AVEC MULTIPLICATEUR REBIRTH) ---
    buyCatUpgrade: async () => {
        const s = get();
        if(s.score >= s.catUpgradeCost && !s.catBought) {
            const powerMult = Math.pow(50, s.rebirthCount);
            const baseGain = 5;
            const actualGain = baseGain * powerMult;
            const ns = Math.floor(s.score - s.catUpgradeCost);
            const nps = Math.floor(s.perSecond + actualGain);
            set({score: ns, perSecond: nps, catBought: true});
            get().saveToDB({score: ns, per_second: nps, cat_bought: true});
        }
    },
    buyCat2Upgrade: async () => {
        const s = get();
        if(s.score >= s.cat2UpgradeCost && !s.cat2Bought) {
            const powerMult = Math.pow(50, s.rebirthCount);
            const baseGain = 60;
            const actualGain = baseGain * powerMult;
            const ns = Math.floor(s.score - s.cat2UpgradeCost);
            const nps = Math.floor(s.perSecond + actualGain);
            set({score: ns, perSecond: nps, cat2Bought: true});
            get().saveToDB({score: ns, per_second: nps, cat2_bought: true});
        }
    },
    buyVolcan: async () => {
        const s = get();
        if(s.score >= s.volcanCost && !s.volcanBought) {
            const powerMult = Math.pow(50, s.rebirthCount);
            const baseGain = 700;
            const actualGain = baseGain * powerMult;
            const ns = Math.floor(s.score - s.volcanCost);
            const nps = Math.floor(s.perSecond + actualGain);
            set({score: ns, perSecond: nps, volcanBought: true});
            get().saveToDB({score: ns, per_second: nps, volcan_bought: true});
        }
    },
    buyCat3Upgrade: async () => {
        const s = get();
        if(s.score >= s.cat3UpgradeCost && !s.cat3Bought) {
            const powerMult = Math.pow(50, s.rebirthCount);
            const baseGain = 6000;
            const actualGain = baseGain * powerMult;
            const ns = Math.floor(s.score - s.cat3UpgradeCost);
            const nps = Math.floor(s.perSecond + actualGain);
            set({score: ns, perSecond: nps, cat3Bought: true});
            get().saveToDB({score: ns, per_second: nps, cat3_bought: true});
        }
    },
    buyGoose: async () => {
        const s = get();
        if(s.score >= s.gooseCost && !s.gooseBought) {
            const powerMult = Math.pow(50, s.rebirthCount);
            const baseGain = 35000;
            const actualGain = baseGain * powerMult;
            const ns = Math.floor(s.score - s.gooseCost);
            const nps = Math.floor(s.perSecond + actualGain);
            set({score: ns, perSecond: nps, gooseBought: true});
            get().saveToDB({score: ns, per_second: nps, goose_bought: true});
        }
    },
}));

export default useStore;