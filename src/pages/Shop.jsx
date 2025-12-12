import React from "react";
import useStore from "../store/useStore";
import { formatNumber } from "../utils/format";

export default function Shop() {
    const store = useStore();

    // Calcul du multiplicateur de puissance actuel pour l'affichage
    const powerMult = Math.pow(50, store.rebirthCount);

    const renderUpgradeRow = (label, cost, buyFn, sellFn, disabledBuy, sellDisabledCondition, buttonStyle = {}) => (
        <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '10px', marginBottom: '10px', alignItems: 'center' }}>
            <button className="upgrade-btn" onClick={buyFn} disabled={disabledBuy} style={{ ...buttonStyle, margin: 0, justifyContent: 'space-between', textAlign: 'left', display: 'flex', width: '100%' }}>
                <span>{label}</span><span style={{ fontSize: '0.85em', opacity: 0.9, fontWeight: 'bold' }}>{formatNumber(cost)}</span>
            </button>
            {!sellDisabledCondition ? (<button onClick={sellFn} style={{ width: '100%', margin: 0, padding: '10px 5px', background: 'rgba(255, 118, 117, 0.1)', border: '1px solid #ff7675', color: '#d63031', fontWeight: 'bold', borderRadius: '12px', fontSize: '0.8rem', cursor: 'pointer', whiteSpace: 'nowrap' }}>Vendre</button>) : (<div style={{ border: '1px dashed #ccc', borderRadius: '12px', padding: '10px 0', textAlign: 'center', color: '#ccc', fontSize: '0.8rem' }}>-</div>)}
        </div>
    );

    const REBIRTH_REQ = 1e36;
    const canRebirth = store.score >= REBIRTH_REQ;
    const nextPriceMult = store.rebirthCount + 3;

    return (
        <div className="page-full bg-shop">
            <div className="game-card" style={{ maxWidth: '900px', width: '95%' }}>
                {/* HEADER */}
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
                    {store.score >= store.superClickThreshold && renderUpgradeRow("🌟 Super (+10k)", store.superClickCost, store.buySuperClick, store.sellSuperClick, store.score < store.superClickCost, store.superClickCost <= 500000, { borderColor: '#ffd700', background: 'rgba(255, 215, 0, 0.1)' })}
                    {store.score >= store.megaClickThreshold && renderUpgradeRow("🔥 Méga (+100k)", store.megaClickCost, store.buyMegaClick, store.sellMegaClick, store.score < store.megaClickCost, store.megaClickCost <= 2500000, { borderColor: '#ff4757', background: 'rgba(255, 71, 87, 0.1)' })}
                    {store.score >= store.gigaClickThreshold && renderUpgradeRow("🚀 Giga (+200k)", store.gigaClickCost, store.buyGigaClick, store.sellGigaClick, store.score < store.gigaClickCost, store.gigaClickCost <= 15000000, { borderColor: '#2ed573', background: 'rgba(46, 213, 115, 0.1)' })}
                    {store.score >= store.click500kThreshold && renderUpgradeRow("💎 +500k", store.click500kCost, store.buy500k, store.sell500k, store.score < store.click500kCost, store.click500kCost <= 40000000, { borderColor: '#1e90ff', background: 'rgba(30, 144, 255, 0.1)' })}
                    {store.score >= store.click1mThreshold && renderUpgradeRow("💎 +1M", store.click1mCost, store.buy1m, store.sell1m, store.score < store.click1mCost, store.click1mCost <= 1e8, { borderColor: '#3742fa', background: 'rgba(55, 66, 250, 0.1)' })}
                    {store.score >= store.click10mThreshold && renderUpgradeRow("💎 +10M", store.click10mCost, store.buy10m, store.sell10m, store.score < store.click10mCost, store.click10mCost <= 1e9, { borderColor: '#5352ed', background: 'rgba(83, 82, 237, 0.1)' })}
                    {store.score >= store.click100mThreshold && renderUpgradeRow("💎 +100M", store.click100mCost, store.buy100m, store.sell100m, store.score < store.click100mCost, store.click100mCost <= 1e10, { borderColor: '#70a1ff', background: 'rgba(112, 161, 255, 0.1)' })}
                    {store.score >= store.click1bThreshold && renderUpgradeRow("🪐 +1B", store.click1bCost, store.buy1b, store.sell1b, store.score < store.click1bCost, store.click1bCost <= 1e11, { borderColor: '#ff6b81', background: 'rgba(255, 107, 129, 0.1)' })}
                    {store.score >= store.click10bThreshold && renderUpgradeRow("🪐 +10B", store.click10bCost, store.buy10b, store.sell10b, store.score < store.click10bCost, store.click10bCost <= 1e12, { borderColor: '#ff4757', background: 'rgba(255, 71, 87, 0.1)' })}
                    {store.score >= store.click100bThreshold && renderUpgradeRow("⚫ +100B", store.click100bCost, store.buy100b, store.sell100b, store.score < store.click100bCost, store.click100bCost <= 1e13, { borderColor: '#2f3542', background: 'rgba(47, 53, 66, 0.1)' })}
                    {store.score >= store.godClickAThreshold && renderUpgradeRow("⚡ Trillion (1T)", store.godClickACost, store.buyGodA, store.sellGodA, store.score < store.godClickACost, store.godClickACost <= 1e12, { borderColor: '#a29bfe', background: 'rgba(162, 155, 254, 0.1)' })}
                    {store.score >= store.godClickAAThreshold && renderUpgradeRow("🌌 Quadrillion (1Qa)", store.godClickAACost, store.buyGodAA, store.sellGodAA, store.score < store.godClickAACost, store.godClickAACost <= 1e15, { borderColor: '#6c5ce7', background: 'rgba(108, 92, 231, 0.1)' })}
                    {store.score >= store.clickSextillionThreshold && renderUpgradeRow("✨ Sextillion (1Sx)", store.clickSextillionCost, store.buySextillion, store.sellSextillion, store.score < store.clickSextillionCost, store.clickSextillionCost <= 1e21, { borderColor: '#a29bfe', background: 'rgba(162, 155, 254, 0.1)' })}
                    {store.score >= store.clickNonillionThreshold && renderUpgradeRow("💫 Octillion (1e27)", store.clickNonillionCost, store.buyNonillion, store.sellNonillion, store.score < store.clickNonillionCost, store.clickNonillionCost <= 1e27, { borderColor: '#74b9ff', background: 'rgba(116, 185, 255, 0.1)' })}
                    {store.score >= store.clickDuodecillionThreshold && renderUpgradeRow("🌀 Undécillion (1e36)", store.clickDuodecillionCost, store.buyDuodecillion, store.sellDuodecillion, store.score < store.clickDuodecillionCost, store.clickDuodecillionCost <= 1e36, { borderColor: '#00b894', background: 'rgba(0, 184, 148, 0.1)' })}
                    {store.score >= store.clickGoogolThreshold && renderUpgradeRow("🔥 GOOGOL (1e100)", store.clickGoogolCost, store.buyGoogol, store.sellGoogol, store.score < store.clickGoogolCost, store.clickGoogolCost <= 1e100, { borderColor: '#e17055', background: 'rgba(225, 112, 85, 0.1)' })}
                    {store.score >= store.clickCentillionThreshold && renderUpgradeRow("💀 CENTILLION (1e303)", store.clickCentillionCost, store.buyCentillion, null, store.score < store.clickCentillionCost, true, { borderColor: 'black', background: 'black', color: 'gold', fontWeight: '900' })}
                    {store.score >= store.click1e120Threshold && renderUpgradeRow("🌌 +1e120", store.click1e120Cost, store.buy1e120, store.sell1e120, store.score < store.click1e120Cost, store.click1e120Cost <= 1e120, { borderColor: '#6c5ce7', background: 'rgba(108, 92, 231, 0.3)' })}
                    {store.score >= store.click1e180Threshold && renderUpgradeRow("🪐 +1e180", store.click1e180Cost, store.buy1e180, store.sell1e180, store.score < store.click1e180Cost, store.click1e180Cost <= 1e180, { borderColor: '#a29bfe', background: 'rgba(162, 155, 254, 0.3)' })}
                    {store.score >= store.click1e240Threshold && renderUpgradeRow("🔮 +1e240", store.click1e240Cost, store.buy1e240, store.sell1e240, store.score < store.click1e240Cost, store.click1e240Cost <= 1e240, { borderColor: '#ff7675', background: 'rgba(255, 118, 117, 0.3)' })}
                    {store.score >= store.click1e300Threshold && renderUpgradeRow("👑 +1e300 (MAX)", store.click1e300Cost, store.buy1e300, store.sell1e300, store.score < store.click1e300Cost, store.click1e300Cost <= 1e300, { borderColor: 'gold', background: 'linear-gradient(45deg, black, gold)', color: 'white' })}
                </div>

                <div style={{ marginBottom: '30px' }}>
                    <h4 style={{ textAlign: 'left', color: '#555', borderLeft: '4px solid #74b9ff', paddingLeft: '10px' }}>Automatisation</h4>
                    {renderUpgradeRow("🔄 +2 Auto", store.autoUpgradeCost, store.buyAutoUpgrade, store.sellAutoUpgrade, store.score < store.autoUpgradeCost, store.autoUpgradeCost <= 100)}
                    {store.score >= store.auto500kThreshold && renderUpgradeRow("⚙️ +500k Auto", store.auto500kCost, store.buyAuto500k, store.sellAuto500k, store.score < store.auto500kCost, store.auto500kCost <= 50000000, { borderColor: '#74b9ff', background: 'rgba(116, 185, 255, 0.1)' })}
                    {store.score >= store.auto1mThreshold && renderUpgradeRow("🏭 +1M Auto", store.auto1mCost, store.buyAuto1m, store.sellAuto1m, store.score < store.auto1mCost, store.auto1mCost <= 100000000, { borderColor: '#0984e3', background: 'rgba(9, 132, 227, 0.1)' })}
                    {store.score >= store.auto10mThreshold && renderUpgradeRow("🏭 +10M Auto", store.auto10mCost, store.buyAuto10m, store.sellAuto10m, store.score < store.auto10mCost, store.auto10mCost <= 1e9, { borderColor: '#6c5ce7', background: 'rgba(108, 92, 231, 0.1)' })}
                    {store.score >= store.auto100mThreshold && renderUpgradeRow("🏭 +100M Auto", store.auto100mCost, store.buyAuto100m, store.sellAuto100m, store.score < store.auto100mCost, store.auto100mCost <= 1e10, { borderColor: '#a29bfe', background: 'rgba(162, 155, 254, 0.1)' })}
                    {store.score >= store.auto1bThreshold && renderUpgradeRow("🤖 +1B Auto", store.auto1bCost, store.buyAuto1b, store.sellAuto1b, store.score < store.auto1bCost, store.auto1bCost <= 1e11, { borderColor: '#fd79a8', background: 'rgba(253, 121, 168, 0.1)' })}
                    {store.score >= store.auto10bThreshold && renderUpgradeRow("🤖 +10B Auto", store.auto10bCost, store.buyAuto10b, store.sellAuto10b, store.score < store.auto10bCost, store.auto10bCost <= 1e12, { borderColor: '#e84393', background: 'rgba(232, 67, 147, 0.1)' })}
                    {store.score >= store.auto100bThreshold && renderUpgradeRow("🧠 +100B Auto", store.auto100bCost, store.buyAuto100b, store.sellAuto100b, store.score < store.auto100bCost, store.auto100bCost <= 1e13, { borderColor: '#2d3436', background: 'rgba(45, 52, 54, 0.1)' })}
                    {store.score >= store.godAutoAThreshold && renderUpgradeRow("⚡ 1T Auto", store.godAutoACost, store.buyAutoGodA, store.sellAutoGodA, store.score < store.godAutoACost, store.godAutoACost <= 1e12, { borderColor: '#a29bfe', background: 'rgba(162, 155, 254, 0.1)' })}
                    {store.score >= store.godAutoAAThreshold && renderUpgradeRow("🌌 1Qa Auto", store.godAutoAACost, store.buyAutoGodAA, store.sellAutoGodAA, store.score < store.godAutoAACost, store.godAutoAACost <= 1e15, { borderColor: '#6c5ce7', background: 'rgba(108, 92, 231, 0.1)' })}
                    {store.score >= store.autoSextillionThreshold && renderUpgradeRow("✨ Sextillion Auto", store.autoSextillionCost, store.buyAutoSextillion, store.sellAutoSextillion, store.score < store.autoSextillionCost, store.autoSextillionCost <= 1e21, { borderColor: '#a29bfe', background: 'rgba(162, 155, 254, 0.1)' })}
                    {store.score >= store.autoNonillionThreshold && renderUpgradeRow("💫 Octillion Auto", store.autoNonillionCost, store.buyAutoNonillion, store.sellAutoNonillion, store.score < store.autoNonillionCost, store.autoNonillionCost <= 1e27, { borderColor: '#74b9ff', background: 'rgba(116, 185, 255, 0.1)' })}
                    {store.score >= store.autoDuodecillionThreshold && renderUpgradeRow("🌀 Undécillion Auto", store.autoDuodecillionCost, store.buyAutoDuodecillion, store.sellAutoDuodecillion, store.score < store.autoDuodecillionCost, store.autoDuodecillionCost <= 1e36, { borderColor: '#00b894', background: 'rgba(0, 184, 148, 0.1)' })}
                    {store.score >= store.autoGoogolThreshold && renderUpgradeRow("🔥 GOOGOL Auto", store.autoGoogolCost, store.buyAutoGoogol, store.sellAutoGoogol, store.score < store.autoGoogolCost, store.autoGoogolCost <= 1e100, { borderColor: '#e17055', background: 'rgba(225, 112, 85, 0.1)' })}
                    {store.score >= store.autoCentillionThreshold && renderUpgradeRow("💀 CENTILLION Auto", store.autoCentillionCost, store.buyAutoCentillion, null, store.score < store.autoCentillionCost, true, { borderColor: 'black', background: 'black', color: 'gold', fontWeight: '900' })}
                    {store.score >= store.auto1e120Threshold && renderUpgradeRow("🌌 +1e120 Auto", store.auto1e120Cost, store.buyAuto1e120, store.sellAuto1e120, store.score < store.auto1e120Cost, store.auto1e120Cost <= 1e120, { borderColor: '#6c5ce7', background: 'rgba(108, 92, 231, 0.3)' })}
                    {store.score >= store.auto1e180Threshold && renderUpgradeRow("🪐 +1e180 Auto", store.auto1e180Cost, store.buyAuto1e180, store.sellAuto1e180, store.score < store.auto1e180Cost, store.auto1e180Cost <= 1e180, { borderColor: '#a29bfe', background: 'rgba(162, 155, 254, 0.3)' })}
                    {store.score >= store.auto1e240Threshold && renderUpgradeRow("🔮 +1e240 Auto", store.auto1e240Cost, store.buyAuto1e240, store.sellAuto1e240, store.score < store.auto1e240Cost, store.auto1e240Cost <= 1e240, { borderColor: '#ff7675', background: 'rgba(255, 118, 117, 0.3)' })}
                    {store.score >= store.auto1e300Threshold && renderUpgradeRow("👑 +1e300 Auto", store.auto1e300Cost, store.buyAuto1e300, store.sellAuto1e300, store.score < store.auto1e300Cost, store.auto1e300Cost <= 1e300, { borderColor: 'gold', background: 'linear-gradient(45deg, black, gold)', color: 'white' })}
                </div>

                <h3 style={{ textAlign: 'left', marginBottom: '15px', color: '#a29bfe' }}>Puissance</h3>
                {store.score >= store.multX2Threshold && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '15px', marginBottom: '10px' }}>
                        <button className="upgrade-btn" onClick={store.buyMultX2} disabled={store.score < store.multX2Cost} style={{ background: 'linear-gradient(45deg, #000, #444)', color: 'white', textAlign: 'center', justifyContent: 'center' }}>
                            <span>⚡ <b>Double Clic (x2)</b> — {formatNumber(store.multX2Cost)} pts</span>
                        </button>
                    </div>
                )}
                {store.score >= store.autoMultX2Threshold && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '15px', marginBottom: '10px' }}>
                        <button className="upgrade-btn" onClick={store.buyAutoMultX2} disabled={store.score < store.autoMultX2Cost} style={{ background: 'linear-gradient(45deg, #2d3436, #636e72)', color: 'white', textAlign: 'center', justifyContent: 'center' }}>
                            <span>⚡ <b>Double Auto (x2)</b> — {formatNumber(store.autoMultX2Cost)} pts</span>
                        </button>
                    </div>
                )}
                {store.score >= store.ultimateClickThreshold &&
                    renderUpgradeRow("🌌 Ultimate (x3)", store.ultimateClickCost, store.buyUltimateClick, store.sellUltimateClick, store.score < store.ultimateClickCost, store.ultimateClickCost <= 2500000, { background: 'linear-gradient(45deg, #6c5ce7, #a29bfe)', color: 'white' })
                }

                <br />
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

                    {!store.volcanBought ? (
                        <button className="upgrade-btn" onClick={store.buyVolcan} disabled={store.score < store.volcanCost}>
                            <span>🔫 Chat Tueur (+{formatNumber(700 * powerMult)}/s)</span> <span>{formatNumber(store.volcanCost)} pts</span>
                        </button>
                    ) : <div className="upgrade-btn" style={{opacity: 0.7, justifyContent: 'center', background: '#e0e0e0'}}>✅ Chat Tueur acquis</div>}

                    {!store.cat3Bought ? (
                        <button className="upgrade-btn" onClick={store.buyCat3Upgrade} disabled={store.score < store.cat3UpgradeCost}>
                            <span>👑 Roi Chat (+{formatNumber(6000 * powerMult)}/s)</span> <span>{formatNumber(store.cat3UpgradeCost)} pts</span>
                        </button>
                    ) : <div className="upgrade-btn" style={{opacity: 0.7, justifyContent: 'center', background: '#e0e0e0'}}>✅ Roi Chat acquis</div>}

                    {!store.gooseBought ? (
                        <button className="upgrade-btn" onClick={store.buyGoose} disabled={store.score < store.gooseCost}>
                            <span>🪿 L'Oie (+{formatNumber(35000 * powerMult)}/s)</span> <span>{formatNumber(store.gooseCost)} pts</span>
                        </button>
                    ) : <div className="upgrade-btn" style={{opacity: 0.7, justifyContent: 'center', background: '#e0e0e0'}}>✅ Oie acquise</div>}
                </div>

                <div style={{ marginTop: '50px', padding: '25px', border: '5px double gold', borderRadius: '15px', background: 'linear-gradient(135deg, #1a1a1a, #000)', boxShadow: '0 0 20px rgba(255, 215, 0, 0.3)' }}>
                    <h2 style={{ color: 'gold', textAlign: 'center', marginTop: 0, fontSize: '1.8rem' }}>🌟 ASCENSION {store.rebirthCount} / 6 🌟</h2>
                    <p style={{ color: '#eee', textAlign: 'center', fontStyle: 'italic', marginBottom: '20px' }}>
                        Sacrifiez tout votre progrès pour renaître plus fort.<br/><br/>
                        <span style={{color: '#ff7675', fontWeight: 'bold'}}>🔻 PRIX : x{nextPriceMult}</span><br/>
                        <span style={{color: '#55efc4', fontWeight: 'bold'}}>🚀 PUISSANCE : x50</span>
                    </p>
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