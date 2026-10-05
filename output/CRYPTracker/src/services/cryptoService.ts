import { CryptoAsset } from "../types/crypto";

const INITIAL_ASSETS: CryptoAsset[] = [
  { id: "bitcoin", symbol: "BTC", name: "Bitcoin", price: 68420.50, change24h: 3.42, high24h: 69200.00, low24h: 66100.00, volume24h: 28400000000, sparkline: [66200, 66800, 67400, 66900, 68100, 68420] },
  { id: "ethereum", symbol: "ETH", name: "Ethereum", price: 3450.80, change24h: -1.15, high24h: 3580.00, low24h: 3410.00, volume24h: 14200000000, sparkline: [3520, 3560, 3490, 3440, 3470, 3450] },
  { id: "solana", symbol: "SOL", name: "Solana", price: 178.25, change24h: 7.82, high24h: 182.50, low24h: 164.00, volume24h: 4200000000, sparkline: [165, 168, 172, 175, 176, 178] },
  { id: "binancecoin", symbol: "BNB", name: "BNB", price: 588.40, change24h: 0.85, high24h: 595.00, low24h: 580.00, volume24h: 1100000000, sparkline: [582, 584, 589, 585, 587, 588] },
  { id: "ripple", symbol: "XRP", name: "XRP", price: 0.582, change24h: 2.15, high24h: 0.601, low24h: 0.565, volume24h: 920000000, sparkline: [0.57, 0.568, 0.575, 0.579, 0.582, 0.582] }
];

export function getInitialAssets(): CryptoAsset[] {
  return [...INITIAL_ASSETS];
}

export function subscribeLivePrices(onUpdate: (updated: CryptoAsset[]) => void) {
  let assets = [...INITIAL_ASSETS];
  const interval = setInterval(() => {
    assets = assets.map(a => {
      const deltaPercent = (Math.random() - 0.49) * 0.008;
      const newPrice = Number((a.price * (1 + deltaPercent)).toFixed(a.price < 1 ? 4 : 2));
      const spark = [...a.sparkline.slice(1), newPrice];
      return {
        ...a,
        price: newPrice,
        change24h: Number((a.change24h + deltaPercent * 10).toFixed(2)),
        high24h: Math.max(a.high24h, newPrice),
        low24h: Math.min(a.low24h, newPrice),
        sparkline: spark
      };
    });
    onUpdate(assets);
  }, 1200);

  return () => clearInterval(interval);
}
