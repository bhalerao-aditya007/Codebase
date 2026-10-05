export interface CryptoAsset {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  high24h: number;
  low24h: number;
  volume24h: number;
  sparkline: number[];
}

export interface OrderBookEntry {
  price: number;
  amount: number;
  total: number;
}

export interface PriceAlert {
  id: string;
  assetId: string;
  targetPrice: number;
  condition: "above" | "below";
  active: boolean;
}
