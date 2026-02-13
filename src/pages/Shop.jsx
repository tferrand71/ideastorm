import React from "react";
import useStore from "../store/useStore";
import { formatNumber } from "../utils/format";

export default function Shop() {
    const store = useStore();

    // Multiplicateur pour l'affichage des compagnons
    const powerMult = Math.pow(50, store.rebirthCount);

    const renderUpgradeRow = (label, cost, buyFn, sellFn, disabledBuy, sellDisabledCondition, buttonStyle = {}) => (
        <div key={label} style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '10px', marginBottom: '10px', alignItems: 'center' }}>
            <button className="upgrade-btn" onClick={buyFn} disabled={disabledBuy} style={{ ...buttonStyle, margin: 0, justifyContent: 'space-between', textAlign: 'left', display: 'flex', width: '100%' }}>
                <span>{label}</span><span style={{ fontSize: '0.85em', opacity: 0.9, fontWeight: 'bold' }}>{formatNumber(cost)}</span>
            </button>
            {!sellDisabledCondition ? (
                <button onClick={sellFn} style={{ width: '100%', margin: 0, padding: '10px 5px', background: 'rgba(255, 118, 117, 0.1)', border: '1px solid #ff7675', color: '#d63031', fontWeight: 'bold', borderRadius: '12px', fontSize: '0.8rem', cursor: 'pointer', whiteSpace: 'nowrap' }}>Vendre</button>
            ) : (
                <div style={{ border: '1px dashed #ccc', borderRadius: '12px', padding: '10px 0', textAlign: 'center', color: '#ccc', fontSize: '0.8rem' }}>-</div>
            )}
        </div>
    );

    // --- CONFIGURATION DES PALIERS ---
    // minSell doit correspondre au prix de base APRES application du multiplicateur de Rebirth
    const clickUpgrades = [
        { id: 'superClickCost', label: "🌟 Super (+10k)", cost: store.superClickCost, buy: store.buySuperClick, sell: store.sellSuperClick, minSell: 500000, style: { borderColor: '#ffd700', background: 'rgba(255, 215, 0, 0.1)' } },
        { id: 'megaClickCost', label: "🔥 Méga (+100k)", cost: store.megaClickCost, buy: store.buyMegaClick, sell: store.sellMegaClick, minSell: 2500000, style: { borderColor: '#ff4757', background: 'rgba(255, 71, 87, 0.1)' } },
        { id: 'gigaClickCost', label: "🚀 Giga (+200k)", cost: store.gigaClickCost, buy: store.buyGigaClick, sell: store.sellGigaClick, minSell: 15000000, style: { borderColor: '#2ed573', background: 'rgba(46, 213, 115, 0.1)' } },
        { id: 'click500kCost', label: "💎 +500k", cost: store.click500kCost, buy: store.buy500k, sell: store.sell500k, minSell: 40000000, style: { borderColor: '#1e90ff', background: 'rgba(30, 144, 255, 0.1)' } },
        { id: 'click1mCost', label: "💎 +1M", cost: store.click1mCost, buy: store.buy1m, sell: store.sell1m, minSell: 1e8, style: { borderColor: '#3742fa', background: 'rgba(55, 66, 250, 0.1)' } },
        { id: 'click10mCost', label: "💎 +10M", cost: store.click10mCost, buy: store.buy10m, sell: store.sell10m, minSell: 1e9, style: { borderColor: '#5352ed', background: 'rgba(83, 82, 237, 0.1)' } },
        { id: 'click100mCost', label: "💎 +100M", cost: store.click100mCost, buy: store.buy100m, sell: store.sell100m, minSell: 1e10, style: { borderColor: '#70a1ff', background: 'rgba(112, 161, 255, 0.1)' } },
        { id: 'click1bCost', label: "🪐 +1B", cost: store.click1bCost, buy: store.buy1b, sell: store.sell1b, minSell: 1e11, style: { borderColor: '#ff6b81', background: 'rgba(255, 107, 129, 0.1)' } },
        { id: 'click10bCost', label: "🪐 +10B", cost: store.click10bCost, buy: store.buy10b, sell: store.sell10b, minSell: 1e12, style: { borderColor: '#ff4757', background: 'rgba(255, 71, 87, 0.1)' } },
        { id: 'click100bCost', label: "⚫ +100B", cost: store.click100bCost, buy: store.buy100b, sell: store.sell100b, minSell: 1e13, style: { borderColor: '#2f3542', background: 'rgba(47, 53, 66, 0.1)' } },
        { id: 'godClickACost', label: "⚡ Trillion (1T)", cost: store.godClickACost, buy: store.buyGodA, sell: store.sellGodA, minSell: 1e12, style: { borderColor: '#a29bfe', background: 'rgba(162, 155, 254, 0.1)' } },
        { id: 'godClickAACost', label: "🌌 Quadrillion (1Qa)", cost: store.godClickAACost, buy: store.buyGodAA, sell: store.sellGodAA, minSell: 1e15, style: { borderColor: '#6c5ce7', background: 'rgba(108, 92, 231, 0.1)' } }
    ];

    const autoUpgrades = [
        { id: 'auto500kCost', label: "⚙️ +500k Auto", cost: store.auto500kCost, buy: store.buyAuto500k, sell: store.sellAuto500k, minSell: 50000000, style: { borderColor: '#74b9ff', background: 'rgba(116, 185, 255, 0.1)' } },
        { id: 'auto1mCost', label: "🏭 +1M Auto", cost: store.auto1mCost, buy: store.buyAuto1m, sell: store.sellAuto1m, minSell: 100000000, style: { borderColor: '#0984e3', background: 'rgba(9, 132, 227, 0.1)' } },
        { id: 'auto10mCost', label: "🏭 +10M Auto", cost: store.auto10mCost, buy: store.buyAuto10m, sell: store.sellAuto10m, minSell: 1e9, style: { borderColor: '#6c5ce7', background: 'rgba(108, 92, 231, 0.1)' } },
        { id: 'auto100mCost', label: "🏭 +100M Auto", cost: store.auto100mCost, buy: store.buyAuto100m, sell: store.sellAuto100m, minSell: 1e10, style: { borderColor: '#a29bfe', background: 'rgba(162, 155, 254, 0.1)' } },
        { id: 'auto1bCost', label: "🤖 +1B Auto", cost: store.auto1bCost, buy: store.buyAuto1b, sell: store.sellAuto1b, minSell: 1e11, style: { borderColor: '#fd79a8', background: 'rgba(253, 121, 168, 0.1)' } },
        { id: 'auto10bCost', label: "🤖 +10B Auto", cost: store.auto10bCost, buy: store.buyAuto10b, sell: store.sellAuto10b, minSell: 1e12, style: { borderColor: '#e84393', background: 'rgba(232, 67, 147, 0.1)' } }
    ];

    // --- LOGIQUE DE VISIBILITÉ DYNAMIQUE ---
    const getVisibleItems = (list) => {
        // Multiplicateur appliqué aux coûts de base lors du Rebirth
        const factor = (store.rebirthCount + 2);

        const lastPurchasedIndex = list.findLastIndex(u => {
            const currentPrice = store[u.id];
            // On compare le prix actuel au prix de base ajusté par le Rebirth
            const basePriceAtRebirth = u.minSell * (store.rebirthCount === 0 ? 1 : factor);
            return currentPrice > basePriceAtRebirth;
        });

        const startIndex = lastPurchasedIndex === -1 ? 0 : lastPurchasedIndex;
        return list.slice(startIndex, startIndex + 3);
    };

    const nextClickUpgrades = getVisibleItems(clickUpgrades);
    const nextAutoUpgrades = getVisibleItems(autoUpgrades);

    const REBIRTH_REQ = 1e36;
    const canRebirth = store.score >= REBIRTH_REQ;

    return (
        <div className="page-full bg-shop">
            <div className="game-card" style={{ maxWidth: '900px', width: '95%' }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" }}>
                    <h2 style={{ margin: 0, fontSize: '2rem', color: '#ff6f61' }}>Boutique de Titouan</h2>
                    <button onClick={store.toggleMedia} style={{ padding: "8px 16px", fontSize: "0.8rem", borderRadius: "20px", background: '#74b9ff', border: 'none', color: 'white', cursor: 'pointer' }}>
                        {store.showMedia ? "👁️ Effets ON" : "🚫 Effets OFF"}
                    </button>
                </div>

                <div className="stats-box">
                    <div className="stats-row"><span>💰 Score</span> <b>{formatNumber(store.score)}</b></div>
                    <div className="stats-row"><span>👆 / Clic</span> <b>{formatNumber(store.perClick)}</b></div>
                    <div className="stats-row"><span>⏱️ / Sec</span> <b>{formatNumber(store.perSecond)}</b></div>
                    <div className="stats-row" style={{borderTop: '1px solid #eee', paddingTop: '5px', marginTop: '5px'}}>
                        <span>🔥 Rebirth</span> <b>{store.rebirthCount} / 6</b>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '15px', marginBottom: '15px', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
                    <h3 style={{ margin: 0, color: '#ff7675', textAlign: 'left', paddingLeft: '10px' }}>🛒 ACHETER</h3>
                    <h3 style={{ margin: 0, color: '#d63031', textAlign: 'center' }}>💰 VENDRE</h3>
                </div>

                {/* === CLICS === */}
                <div style={{ marginBottom: '30px' }}>
                    <h4 style={{ textAlign: 'left', color: '#555', borderLeft: '4px solid #ff7675', paddingLeft: '10px' }}>Améliorations Clics</h4>
                    {renderUpgradeRow("👆 +1 Clic", store.clickUpgradeCost, store.buyClickUpgrade, store.sellClickUpgrade, store.score < store.clickUpgradeCost, store.clickUpgradeCost <= (50 * (store.rebirthCount + 2)))}
                    {nextClickUpgrades.map(u =>
                        renderUpgradeRow(u.label, u.cost, u.buy, u.sell, store.score < u.cost, store.cost <= u.minSell, u.style)
                    )}
                </div>

                {/* === AUTO === */}
                <div style={{ marginBottom: '30px' }}>
                    <h4 style={{ textAlign: 'left', color: '#555', borderLeft: '4px solid #74b9ff', paddingLeft: '10px' }}>Automatisation</h4>
                    {renderUpgradeRow("🔄 +2 Auto", store.autoUpgradeCost, store.buyAutoUpgrade, store.sellAutoUpgrade, store.score < store.autoUpgradeCost, store.autoUpgradeCost <= 100)}
                    {nextAutoUpgrades.map(u =>
                        renderUpgradeRow(u.label, u.cost, u.buy, u.sell, store.score < u.cost, store.cost <= u.minSell, u.style)
                    )}
                </div>

                {/* COMPAGNONS */}
                <h3 style={{ textAlign: 'left', marginBottom: '15px', marginTop: '10px', color: '#333' }}>Compagnons</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {!store.catBought ? (
                        <button className="upgrade-btn" onClick={store.buyCatUpgrade} disabled={store.score < store.catUpgradeCost}>
                            <span>🐱 Chat (+{formatNumber(5 * powerMult)}/s)</span> <span>{formatNumber(store.catUpgradeCost)} pts</span>
                        </button>
                    ) : <div className="upgrade-btn" style={{opacity: 0.7, justifyContent: 'center', background: '#e0e0e0'}}>✅ Chat acquis</div>}
                    {!store.cat2Bought ? (
                        <button className="upgrade-btn" onClick={store.buyCat2Upgrade} disabled={store.score < store.cat2UpgradeCost}>
                            <span>😼 Chat Ninja (+{formatNumber(60 * powerMult)}/s)</span> <span>{formatNumber(store.cat2UpgradeCost)} pts</span>
                        </button>
                    ) : <div className="upgrade-btn" style={{opacity: 0.7, justifyContent: 'center', background: '#e0e0e0'}}>✅ Chat Ninja acquis</div>}
                </div>

                {/* ASCENSION */}
                <div style={{ marginTop: '50px', padding: '25px', border: '5px double gold', borderRadius: '15px', background: 'linear-gradient(135deg, #1a1a1a, #000)', boxShadow: '0 0 20px rgba(255, 215, 0, 0.3)' }}>
                    <h2 style={{ color: 'gold', textAlign: 'center', marginTop: 0, fontSize: '1.8rem' }}>🌟 ASCENSION {store.rebirthCount} / 6 🌟</h2>
                    {store.rebirthCount < 6 ? (
                        <button className="upgrade-btn" onClick={store.triggerRebirth} disabled={!canRebirth} style={{ width: '100%', background: canRebirth ? 'linear-gradient(45deg, gold, #f1c40f)' : '#333', color: canRebirth ? 'black' : '#666', fontWeight: '900', fontSize: '1.2rem', justifyContent: 'center', height: '60px', border: canRebirth ? '2px solid white' : 'none', cursor: canRebirth ? 'pointer' : 'not-allowed' }}>
                            {canRebirth ? "☄️ DÉCLENCHER LE REBIRTH ☄️" : `Requis : ${formatNumber(REBIRTH_REQ)} (1 Und)`}
                        </button>
                    ) : (
                        <div style={{ textAlign: 'center', color: 'gold', fontSize: '1.5rem', fontWeight: 'bold', padding: '10px' }}>👑 NIVEAU MAXIMUM ATTEINT 👑</div>
                    )}
                </div>

                <div style={{ marginTop: '30px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
                    <button className="reset-btn" onClick={store.resetGame}>🗑️ Réinitialiser la partie</button>
                </div>
            </div>
        </div>
    );
}