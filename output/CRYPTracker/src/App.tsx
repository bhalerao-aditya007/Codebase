import React, { useState, useEffect } from "react";
import { getInitialAssets, subscribeLivePrices } from "./services/cryptoService";
import { CryptoAsset } from "./types/crypto";

export function App() {
  const [assets, setAssets] = useState<CryptoAsset[]>(getInitialAssets());
  const [selectedId, setSelectedId] = useState<string>("bitcoin");
  const [search, setSearch] = useState("");
  const [filterFav, setFilterFav] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(["bitcoin", "ethereum"]);

  useEffect(() => {
    const unsub = subscribeLivePrices((latest) => {
      setAssets(latest);
    });
    return unsub;
  }, []);

  const selected = assets.find((a) => a.id === selectedId) || assets[0];
  const filtered = assets.filter((a) => {
    const matchSearch = a.name.toLowerCase().includes(search.toLowerCase()) || a.symbol.toLowerCase().includes(search.toLowerCase());
    const matchFav = !filterFav || favorites.includes(a.id);
    return matchSearch && matchFav;
  });

  const toggleFav = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-slate-100 flex flex-col font-sans">
      {/* Top Bar */}
      <header className="h-16 border-b border-slate-800 bg-[#161b22]/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-400 flex items-center justify-center font-black text-slate-950 text-xl shadow-lg shadow-orange-500/20">
            C
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight tracking-wide flex items-center gap-2">
              CRYPTracker <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-mono font-medium">LIVE WS</span>
            </h1>
            <p className="text-xs text-slate-400">Autonomous Real-Time Asset Terminal</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Search crypto (BTC, ETH)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400 w-56"
          />
          <button
            onClick={() => setFilterFav(!filterFav)}
            className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-colors ${filterFav ? "bg-amber-400 text-slate-950 font-bold" : "bg-slate-800 text-slate-300 hover:bg-slate-700"}`}
          >
            Starred ({favorites.length})
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Asset List */}
        <section className="lg:col-span-1 space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Market Overview</h2>
          <div className="space-y-2">
            {filtered.map((coin) => {
              const isSelected = coin.id === selectedId;
              const isPositive = coin.change24h >= 0;
              return (
                <div
                  key={coin.id}
                  onClick={() => setSelectedId(coin.id)}
                  className={`p-4 rounded-xl cursor-pointer border transition-all ${
                    isSelected
                      ? "bg-slate-800/90 border-amber-400/50 shadow-lg shadow-amber-500/5"
                      : "bg-[#161b22] border-slate-800/80 hover:border-slate-700 hover:bg-slate-800/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <button onClick={(e) => toggleFav(coin.id, e)} className="text-slate-400 hover:text-amber-400 text-sm">
                        {favorites.includes(coin.id) ? "[*]" : "[ ]"}
                      </button>
                      <div>
                        <div className="font-bold text-sm text-slate-100">{coin.name}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{coin.symbol}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-bold text-sm text-slate-100">
                        ${coin.price.toLocaleString(undefined, { minimumFractionDigits: coin.price < 1 ? 4 : 2 })}
                      </div>
                      <div className={`text-xs font-mono font-semibold ${isPositive ? "text-emerald-400" : "text-rose-400"}`}>
                        {isPositive ? "+" : ""}{coin.change24h}%
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Right Columns: Detail, Chart & Depth */}
        <section className="lg:col-span-2 space-y-6">
          {/* Active Asset Banner */}
          <div className="bg-[#161b22] border border-slate-800/80 rounded-2xl p-6 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-6">
              <div>
                <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Active Instrument</div>
                <h3 className="text-2xl font-black text-slate-100 mt-1">{selected.name} ({selected.symbol}/USD)</h3>
              </div>
              <div className="text-right">
                <div className="text-3xl font-mono font-black text-amber-400">
                  ${selected.price.toLocaleString(undefined, { minimumFractionDigits: selected.price < 1 ? 4 : 2 })}
                </div>
                <div className={`text-sm font-mono font-bold mt-0.5 ${selected.change24h >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                  {selected.change24h >= 0 ? "▲ +" : "▼ "}{selected.change24h}% (24h)
                </div>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                <div className="text-[11px] text-slate-400">24h High</div>
                <div className="font-mono font-bold text-sm text-slate-200 mt-1">${selected.high24h.toLocaleString()}</div>
              </div>
              <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                <div className="text-[11px] text-slate-400">24h Low</div>
                <div className="font-mono font-bold text-sm text-slate-200 mt-1">${selected.low24h.toLocaleString()}</div>
              </div>
              <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                <div className="text-[11px] text-slate-400">24h Volume</div>
                <div className="font-mono font-bold text-sm text-slate-200 mt-1">${(selected.volume24h / 1e9).toFixed(2)}B</div>
              </div>
            </div>

            {/* Simulated Live Sparkline / SVG Chart */}
            <div className="bg-slate-900/90 rounded-xl p-4 border border-slate-800">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Real-Time Tick Wave</span>
                <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  Streaming
                </span>
              </div>
              <div className="h-40 w-full flex items-end gap-2 pt-4">
                {selected.sparkline.map((val, idx) => {
                  const min = Math.min(...selected.sparkline);
                  const max = Math.max(...selected.sparkline);
                  const range = max - min || 1;
                  const heightPercent = Math.max(15, Math.min(100, ((val - min) / range) * 100));
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1 group">
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className="w-full bg-gradient-to-t from-amber-500/40 to-amber-400 rounded-t transition-all duration-300"
                      />
                      <span className="text-[9px] font-mono text-slate-500 hidden group-hover:block">${val}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
export default App;
