// Real-time market data service
import { RSI, MACD, BollingerBands, Stochastic, EMA, SMA, ATR, WilliamsR } from 'technicalindicators';

// API configuration
const API_CONFIG = {
  ALPHA_VANTAGE: {
    API_KEY: 'demo', // Replace with real API key
    BASE_URL: 'https://www.alphavantage.co/query'
  },
  POLYGON: {
    API_KEY: 'demo', // Replace with real API key
    BASE_URL: 'https://api.polygon.io/v2'
  },
  COINAPI: {
    API_KEY: 'demo', // Replace with real API key
    BASE_URL: 'https://rest.coinapi.io/v1'
  }
};

// Cache for API responses
const dataCache = new Map();

// Mock WebSocket for real-time data simulation
class MockWebSocket {
  constructor(callback) {
    this.callback = callback;
    this.interval = null;
    this.isConnected = false;
  }

  connect() {
    if (this.isConnected) return;
    
    this.isConnected = true;
    this.interval = setInterval(() => {
      const mockData = this.generateMockTick();
      this.callback(mockData);
    }, 1000); // Update every second
  }

  disconnect() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    this.isConnected = false;
  }

  generateMockTick() {
    const symbols = [
      'AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN', 'NVDA',
      'RELIANCE.NS', 'TCS.NS', 'INFY.NS', 'HDFCBANK.NS', 'ICICIBANK.NS',
      'BTC-USD', 'ETH-USD', 'NIFTY50', 'SENSEX'
    ];
    const symbol = symbols[Math.floor(Math.random() * symbols.length)];
    
    // Generate realistic price movements based on symbol
    const basePrices = {
      'AAPL': 175.43,
      'GOOGL': 142.56,
      'MSFT': 378.91,
      'TSLA': 248.73,
      'AMZN': 155.89,
      'NVDA': 875.43,
      'RELIANCE.NS': 2456.78,
      'TCS.NS': 3789.12,
      'INFY.NS': 1567.89,
      'HDFCBANK.NS': 1623.45,
      'ICICIBANK.NS': 987.65,
      'BTC-USD': 67234.56,
      'ETH-USD': 3456.78,
      'NIFTY50': 21567.89,
      'SENSEX': 71234.56
    };

    const currentPrice = basePrices[symbol] || 100;
    const volatility = symbol.includes('BTC') || symbol.includes('ETH') ? 0.02 : 0.005;
    const change = (Math.random() - 0.5) * 2 * volatility * currentPrice;
    const newPrice = Math.max(0.01, currentPrice + change);
    const volume = Math.floor(Math.random() * 10000000) + 100000;

    return {
      symbol,
      price: parseFloat(newPrice.toFixed(2)),
      change: parseFloat(change.toFixed(2)),
      changePercent: parseFloat((change / currentPrice * 100).toFixed(2)),
      volume: volume,
      timestamp: new Date().toISOString(),
      high: parseFloat((newPrice * (1 + Math.random() * 0.01)).toFixed(2)),
      low: parseFloat((newPrice * (1 - Math.random() * 0.01)).toFixed(2)),
      open: parseFloat((newPrice + (Math.random() - 0.5) * change).toFixed(2))
    };
  }
}

// Real-time data service
export class MarketDataService {
  constructor() {
    this.subscribers = new Map();
    this.webSocket = null;
    this.isConnected = false;
  }

  // Subscribe to real-time data for a symbol
  subscribe(symbol, callback) {
    if (!this.subscribers.has(symbol)) {
      this.subscribers.set(symbol, new Set());
    }
    this.subscribers.get(symbol).add(callback);

    // Start WebSocket connection if not already connected
    if (!this.isConnected) {
      this.connect();
    }
  }

  // Unsubscribe from real-time data
  unsubscribe(symbol, callback) {
    if (this.subscribers.has(symbol)) {
      this.subscribers.get(symbol).delete(callback);
      if (this.subscribers.get(symbol).size === 0) {
        this.subscribers.delete(symbol);
      }
    }
  }

  // Connect to real-time data feed
  connect() {
    if (this.isConnected) return;

    // Use mock WebSocket for demo (replace with real WebSocket)
    this.webSocket = new MockWebSocket((data) => {
      this.handleRealTimeData(data);
    });

    this.webSocket.connect();
    this.isConnected = true;
  }

  // Disconnect from real-time data feed
  disconnect() {
    if (this.webSocket) {
      this.webSocket.disconnect();
      this.webSocket = null;
    }
    this.isConnected = false;
  }

  // Handle incoming real-time data
  handleRealTimeData(data) {
    if (this.subscribers.has(data.symbol)) {
      this.subscribers.get(data.symbol).forEach(callback => {
        callback(data);
      });
    }
  }

  // Fetch historical data
  async fetchHistoricalData(symbol, interval = '1day', limit = 100) {
    const cacheKey = `${symbol}-${interval}-${limit}`;
    
    if (dataCache.has(cacheKey)) {
      return dataCache.get(cacheKey);
    }

    try {
      // For demo, generate mock historical data
      const data = this.generateMockHistoricalData(symbol, limit);
      dataCache.set(cacheKey, data);
      return data;
    } catch (error) {
      console.error('Error fetching historical data:', error);
      return this.generateMockHistoricalData(symbol, limit);
    }
  }

  // Generate mock historical data with Indian market support
  generateMockHistoricalData(symbol, limit) {
    const basePrices = {
      // US Stocks
      'AAPL': 175.43,
      'GOOGL': 142.56,
      'MSFT': 378.91,
      'TSLA': 248.73,
      'AMZN': 155.89,
      'NVDA': 875.43,
      
      // Indian Stocks (NSE)
      'RELIANCE.NS': 2456.78,
      'TCS.NS': 3789.12,
      'INFY.NS': 1567.89,
      'HDFCBANK.NS': 1623.45,
      'ICICIBANK.NS': 987.65,
      'HINDUNILVR.NS': 2567.89,
      'ITC.NS': 456.78,
      'SBIN.NS': 567.89,
      'BHARTIARTL.NS': 1234.56,
      'ASIANPAINT.NS': 3123.45,
      
      // Crypto
      'BTC-USD': 67234.56,
      'ETH-USD': 3456.78,
      
      // Indices
      'SPY': 456.78,
      'NIFTY50': 21567.89,
      'SENSEX': 71234.56
    };

    const startPrice = basePrices[symbol] || 100;
    const data = [];

    for (let i = 0; i < limit; i++) {
      const timestamp = new Date(Date.now() - (limit - i) * 24 * 60 * 60 * 1000);
      const variation = Math.sin(i * 0.1) * 10 + (Math.random() - 0.5) * 5;
      const price = startPrice + variation;
      
      const open = price + (Math.random() - 0.5) * 4;
      const close = price + (Math.random() - 0.5) * 4;
      const high = Math.max(open, close) + Math.random() * 6;
      const low = Math.min(open, close) - Math.random() * 6;
      const volume = Math.floor(Math.random() * 10000000) + 100000;

      data.push({
        timestamp: timestamp.toISOString(),
        open: parseFloat(Math.max(0.01, open).toFixed(2)),
        high: parseFloat(Math.max(0.01, high).toFixed(2)),
        low: parseFloat(Math.max(0.01, low).toFixed(2)),
        close: parseFloat(Math.max(0.01, close).toFixed(2)),
        volume: volume
      });
    }

    return data;
  }

  // Calculate technical indicators
  calculateTechnicalIndicators(data) {
    const closes = data.map(d => d.close);
    const highs = data.map(d => d.high);
    const lows = data.map(d => d.low);
    const volumes = data.map(d => d.volume);

    const indicators = {};

    try {
      // RSI
      indicators.rsi = RSI.calculate({
        values: closes,
        period: 14
      });

      // MACD
      const macdData = MACD.calculate({
        values: closes,
        fastPeriod: 12,
        slowPeriod: 26,
        signalPeriod: 9,
        SimpleMAOscillator: false,
        SimpleMASignal: false
      });
      indicators.macd = macdData;

      // Bollinger Bands
      indicators.bollingerBands = BollingerBands.calculate({
        period: 20,
        values: closes,
        stdDev: 2
      });

      // Stochastic
      indicators.stochastic = Stochastic.calculate({
        high: highs,
        low: lows,
        close: closes,
        period: 14,
        signalPeriod: 3
      });

      // Simple Moving Averages
      indicators.sma10 = SMA.calculate({ period: 10, values: closes });
      indicators.sma20 = SMA.calculate({ period: 20, values: closes });
      indicators.sma50 = SMA.calculate({ period: 50, values: closes });

      // Exponential Moving Averages
      indicators.ema10 = EMA.calculate({ period: 10, values: closes });
      indicators.ema20 = EMA.calculate({ period: 20, values: closes });

      // Average True Range
      indicators.atr = ATR.calculate({
        high: highs,
        low: lows,
        close: closes,
        period: 14
      });

      // Williams %R
      indicators.williamsR = WilliamsR.calculate({
        high: highs,
        low: lows,
        close: closes,
        period: 14
      });

    } catch (error) {
      console.error('Error calculating technical indicators:', error);
    }

    return indicators;
  }

  // Fetch market overview
  async fetchMarketOverview() {
    const symbols = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN', 'BTC-USD', 'ETH-USD', 'SPY'];
    const overview = [];

    for (const symbol of symbols) {
      const data = await this.fetchHistoricalData(symbol, '1day', 2);
      if (data.length >= 2) {
        const current = data[data.length - 1];
        const previous = data[data.length - 2];
        const change = current.close - previous.close;
        const changePercent = (change / previous.close) * 100;

        overview.push({
          symbol,
          name: this.getSymbolName(symbol),
          price: current.close,
          change: change,
          changePercent: changePercent,
          volume: current.volume,
          high: current.high,
          low: current.low,
          open: current.open
        });
      }
    }

    return overview;
  }

  // Get symbol name
  getSymbolName(symbol) {
    const names = {
      'AAPL': 'Apple Inc.',
      'GOOGL': 'Alphabet Inc.',
      'MSFT': 'Microsoft Corp.',
      'TSLA': 'Tesla Inc.',
      'AMZN': 'Amazon.com Inc.',
      'BTC-USD': 'Bitcoin',
      'ETH-USD': 'Ethereum',
      'SPY': 'SPDR S&P 500'
    };
    return names[symbol] || symbol;
  }

  // Fetch news data
  async fetchNews(symbol = null) {
    // Mock news data - replace with real API
    const mockNews = [
      {
        id: 1,
        title: 'Federal Reserve Announces Rate Decision',
        summary: 'The Federal Reserve maintained interest rates at current levels, citing inflation concerns and economic stability.',
        source: 'Reuters',
        publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        impact: 'high',
        symbols: ['SPY', 'AAPL', 'MSFT'],
        url: 'https://example.com/news/1'
      },
      {
        id: 2,
        title: 'Tech Stocks Rally on AI Breakthrough',
        summary: 'Major technology companies see significant gains following announcements of AI advancements.',
        source: 'Bloomberg',
        publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        impact: 'medium',
        symbols: ['AAPL', 'GOOGL', 'MSFT'],
        url: 'https://example.com/news/2'
      },
      {
        id: 3,
        title: 'Cryptocurrency Market Volatility Continues',
        summary: 'Bitcoin and Ethereum experience significant price swings amid regulatory uncertainty.',
        source: 'CoinDesk',
        publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        impact: 'high',
        symbols: ['BTC-USD', 'ETH-USD'],
        url: 'https://example.com/news/3'
      }
    ];

    if (symbol) {
      return mockNews.filter(news => news.symbols.includes(symbol));
    }

    return mockNews;
  }

  // Economic calendar
  async fetchEconomicCalendar() {
    const mockEvents = [
      {
        id: 1,
        title: 'Non-Farm Payrolls',
        country: 'US',
        date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        impact: 'high',
        forecast: '200K',
        previous: '185K',
        actual: null
      },
      {
        id: 2,
        title: 'CPI Inflation Rate',
        country: 'US',
        date: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
        impact: 'high',
        forecast: '3.2%',
        previous: '3.1%',
        actual: null
      },
      {
        id: 3,
        title: 'GDP Growth Rate',
        country: 'EU',
        date: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(),
        impact: 'medium',
        forecast: '0.8%',
        previous: '0.6%',
        actual: null
      }
    ];

    return mockEvents;
  }
}

// Export singleton instance
export const marketDataService = new MarketDataService();