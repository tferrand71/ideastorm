import React from "react";
import useStore from "../store/useStore";
import { formatNumber } from "../utils/format";

export default function Shop() {
    const store = useStore();
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

    // --- CONFIGURATION DE TOUS LES PALIERS ---
    const clickUpgrades = [
        { id: 'superClickCost', label: "🌟 Super (+10k)", cost: store.superClickCost, buy: store.buySuperClick, sell: store.sellSuperClick, minSell: 5e5 },
        { id: 'megaClickCost', label: "🔥 Méga (+100k)", cost: store.megaClickCost, buy: store.buyMegaClick, sell: store.sellMegaClick, minSell: 2.5e6 },
        { id: 'gigaClickCost', label: "🚀 Giga (+200k)", cost: store.gigaClickCost, buy: store.buyGigaClick, sell: store.sellGigaClick, minSell: 1.5e7 },
        { id: 'click500kCost', label: "💎 +500k", cost: store.click500kCost, buy: store.buy500k, sell: store.sell500k, minSell: 4e7 },
        { id: 'click1mCost', label: "💎 +1M", cost: store.click1mCost, buy: store.buy1m, sell: store.sell1m, minSell: 1e8 },
        { id: 'click10mCost', label: "💎 +10M", cost: store.click10mCost, buy: store.buy10m, sell: store.sell10m, minSell: 1e9 },
        { id: 'click100mCost', label: "💎 +100M", cost: store.click100mCost, buy: store.buy100m, sell: store.sell100m, minSell: 1e10 },
        { id: 'click1bCost', label: "🪐 +1B", cost: store.click1bCost, buy: store.buy1b, sell: store.sell1b, minSell: 1e11 },
        { id: 'click10bCost', label: "🪐 +10B", cost: store.click10bCost, buy: store.buy10b, sell: store.sell10b, minSell: 1e12 },
        { id: 'godClickACost', label: "⚡ Trillion (1T)", cost: store.godClickACost, buy: store.buyGodA, sell: store.sellGodA, minSell: 1e12 },
        { id: 'godClickAACost', label: "🌌 Quadrillion (1Qa)", cost: store.godClickAACost, buy: store.buyGodAA, sell: store.sellGodAA, minSell: 1e15 },
        { id: 'clickSextillionCost', label: "✨ Sextillion (1Sx)", cost: store.clickSextillionCost, buy: store.buySextillion, sell: store.sellSextillion, minSell: 1e21 },
        { id: 'clickNonillionCost', label: "💫 Octillion (1e27)", cost: store.clickNonillionCost, buy: store.buyNonillion, sell: store.sellNonillion, minSell: 1e27 },
        { id: 'clickDuodecillionCost', label: "🌀 Undécillion (1e36)", cost: store.clickDuodecillionCost, buy: store.buyDuodecillion, sell: store.sellDuodecillion, minSell: 1e36 },
        { id: 'clickVigintillionCost', label: "⚛️ Vigintillion (1e63)", cost: store.clickVigintillionCost, buy: store.buyVigintillion, sell: store.sellVigintillion, minSell: 1e63, style: {borderColor: '#55efc4'} },
        { id: 'clickTrigintillionCost', label: "🪐 Trigintillion (1e93)", cost: store.clickTrigintillionCost, buy: store.buyTrigintillion, sell: store.sellTrigintillion, minSell: 1e93 },
        { id: 'clickGoogolCost', label: "🔥 GOOGOL (1e100)", cost: store.clickGoogolCost, buy: store.buyGoogol, sell: store.sellGoogol, minSell: 1e100, style: {borderColor: '#e17055'} },
        { id: 'clickQuinquagintillionCost', label: "🌀 Quinquagint. (1e153)", cost: store.clickQuinquagintillionCost, buy: store.buyQuinquagintillion, sell: store.sellQuinquagintillion, minSell: 1e153 },
        { id: 'clickNonagintillionCost', label: "🌌 Nonagintillion (1e273)", cost: store.clickNonagintillionCost, buy: store.buyNonagintillion, sell: store.sellNonagintillion, minSell: 1e273 },
        { id: 'clickCentillionCost', label: "💀 CENTILLION (1e303)", cost: store.clickCentillionCost, buy: store.buyCentillion, sell: null, minSell: 1e303, style: { background: 'black', color: 'gold', border: '2px solid gold' } }
    ];

    const autoUpgrades = [
        { id: 'autoUpgradeCost', label: "🔄 +2 Auto", cost: store.autoUpgradeCost, buy: store.buyAutoUpgrade, sell: store.sellAutoUpgrade, minSell: 100 },
        { id: 'auto500kCost', label: "⚙️ +500k Auto", cost: store.auto500kCost, buy: store.buyAuto500k, sell: store.sellAuto500k, minSell: 5e7 },
        { id: 'auto1mCost', label: "🏭 +1M Auto", cost: store.auto1mCost, buy: store.buyAuto1m, sell: store.sellAuto1m, minSell: 1e8 },
        { id: 'auto1bCost', label: "🤖 +1B Auto", cost: store.auto1bCost, buy: store.buyAuto1b, sell: store.sellAuto1b, minSell: 1e11 },
        { id: 'godAutoAACost', label: "🌌 1Qa Auto", cost: store.godAutoAACost, buy: store.buyAutoGodAA, sell: store.sellAutoGodAA, minSell: 1e15 },
        { id: 'autoGoogolCost', label: "🔥 GOOGOL Auto", cost: store.autoGoogolCost, buy: store.buyAutoGoogol, sell: store.sellAutoGoogol, minSell: 1e100 }
    ];

    const getVisibleItems = (list) => {
        const factor = (store.rebirthCount + 2);
        const lastPurchasedIndex = list.findLastIndex(u => {
            const currentPrice = store[u.id];
            // On vérifie si l'item a été acheté (son prix actuel > prix de base)
            const basePrice = u.minSell * (store.rebirthCount === 0 ? 1 : factor);
            return currentPrice > basePrice;
        });
        const startIndex = lastPurchasedIndex === -1 ? 0 : lastPurchasedIndex;
        return list.slice(startIndex, startIndex + 3);
    };

    const nextClickUpgrades = getVisibleItems(clickUpgrades);
    const nextAutoUpgrades = getVisibleItems(autoUpgrades);

    return (
        <div className="page-full bg-shop">
            <div className="game-card" style={{ maxWidth: '900px', width: '95%' }}>
                <h2 style={{ color: '#ff6f61', textAlign: 'center', fontSize: '2.2rem' }}>Boutique de Titouan</h2>

                <div className="stats-box">
                    <div className="stats-row"><span>💰 Score</span> <b>{formatNumber(store.score)}</b></div>
                    <div className="stats-row"><span>👆 / Clic</span> <b>{formatNumber(store.perClick)}</b></div>
                    <div className="stats-row"><span>⏱️ / Sec</span> <b>{formatNumber(store.perSecond)}</b></div>
                </div>

                <h4 style={{ borderLeft: '4px solid #ff7675', paddingLeft: '10px' }}>Améliorations Clics</h4>
                {renderUpgradeRow("👆 +1 Clic", store.clickUpgradeCost, store.buyClickUpgrade, store.sellClickUpgrade, store.score < store.clickUpgradeCost, store.clickUpgradeCost <= (50 * (store.rebirthCount + 2)))}
                {nextClickUpgrades.map(u => renderUpgradeRow(u.label, u.cost, u.buy, u.sell, store.score < u.cost, store.cost <= u.minSell, u.style))}

                <h4 style={{ borderLeft: '4px solid #74b9ff', paddingLeft: '10px', marginTop: '20px' }}>Automatisation</h4>
                {nextAutoUpgrades.map(u => renderUpgradeRow(u.label, u.cost, u.buy, u.sell, store.score < u.cost, store.cost <= u.minSell, u.style))}

                <h3 style={{ color: '#a29bfe', marginTop: '25px' }}>Puissance Maximale</h3>
                {store.score >= 1e6 && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <button className="upgrade-btn" onClick={store.buyMultX2} disabled={store.score < store.multX2Cost} style={{ background: '#2d3436', color: 'white' }}>⚡ Clic x2</button>
                        <button className="upgrade-btn" onClick={store.buyAutoMultX2} disabled={store.score < store.autoMultX2Cost} style={{ background: '#2d3436', color: 'white' }}>⚡ Auto x2</button>
                    </div>
                )}

                <h3 style={{ marginTop: '20px' }}>Compagnons</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {!store.catBought ? (
                        <button className="upgrade-btn" onClick={store.buyCatUpgrade} disabled={store.score < store.catUpgradeCost}>🐱 Chat (+{formatNumber(5 * powerMult)}/s)</button>
                    ) : <div className="upgrade-btn" style={{opacity: 0.7, background: '#eee', justifyContent: 'center'}}>✅ Chat acquis</div>}
                    {!store.volcanBought ? (
                        <button className="upgrade-btn" onClick={store.buyVolcan} disabled={store.score < store.volcanCost}>🔫 Chat Tueur (+{formatNumber(700 * powerMult)}/s)</button>
                    ) : <div className="upgrade-btn" style={{opacity: 0.7, background: '#eee', justifyContent: 'center'}}>✅ Chat Tueur acquis</div>}
                </div>

                <div style={{ marginTop: '40px', padding: '25px', border: '5px double gold', borderRadius: '15px', background: '#111' }}>
                    <h2 style={{ color: 'gold', textAlign: 'center' }}>🌟 ASCENSION {store.rebirthCount} / 6</h2>
                    <button className="upgrade-btn" onClick={store.triggerRebirth} disabled={store.score < 1e36} style={{ width: '100%', background: store.score >= 1e36 ? 'gold' : '#444', color: 'black' }}>
                        {store.score >= 1e36 ? "☄️ DÉCLENCHER LE REBIRTH" : `Requis : 1 Undécillion`}
                    </button>
                </div>
            </div>
        </div>
    );
}