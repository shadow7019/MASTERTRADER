import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  CandlestickChart, BarChart, Bar, AreaChart, Area
} from 'recharts';
import { 
  Search, TrendingUp, TrendingDown, BarChart3, Settings, Bell, User,
  Plus, X, ChevronDown, ChevronUp, ChevronLeft, ChevronRight,
  Star, BookOpen, Calendar, DollarSign, Globe, Zap, Eye, EyeOff,
  Play, Pause, RotateCcw, MousePointer, Minus, Square, Circle,
  Triangle, PenTool, Ruler, Target, Activity, Volume2, Home,
  PieChart, Briefcase, TrendingUpIcon, MessageSquare, Share2
} from 'lucide-react';

// Mock data for charts and markets - now including Indian stocks
const mockChartData = Array.from({ length: 100 }, (_, i) => {
  const basePrice = 150;
  const variation = Math.sin(i * 0.1) * 10 + Math.random() * 5;
  const price = basePrice + variation;
  return {
    time: i,
    price: price,
    open: price - Math.random() * 2,
    high: price + Math.random() * 3,
    low: price - Math.random() * 3,
    close: price + (Math.random() - 0.5) * 2,
    volume: Math.floor(Math.random() * 1000000)
  };
});

const mockMarketData = [
  // US Stocks
  { symbol: 'AAPL', name: 'Apple Inc.', price: 175.43, change: 2.34, changePercent: 1.35, volume: '64.2M', country: 'US' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 142.56, change: -1.23, changePercent: -0.85, volume: '28.9M', country: 'US' },
  { symbol: 'MSFT', name: 'Microsoft Corp.', price: 378.91, change: 5.67, changePercent: 1.52, volume: '42.1M', country: 'US' },
  { symbol: 'TSLA', name: 'Tesla Inc.', price: 248.73, change: -8.45, changePercent: -3.28, volume: '156.8M', country: 'US' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 155.89, change: 0.78, changePercent: 0.50, volume: '35.7M', country: 'US' },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 875.43, change: 45.67, changePercent: 5.51, volume: '45.2M', country: 'US' },
  
  // Indian Stocks (NSE)
  { symbol: 'RELIANCE.NS', name: 'Reliance Industries Ltd.', price: 2456.78, change: 34.56, changePercent: 1.43, volume: '8.9M', country: 'IN' },
  { symbol: 'TCS.NS', name: 'Tata Consultancy Services', price: 3789.12, change: -45.67, changePercent: -1.19, volume: '2.1M', country: 'IN' },
  { symbol: 'INFY.NS', name: 'Infosys Limited', price: 1567.89, change: 23.45, changePercent: 1.52, volume: '4.5M', country: 'IN' },
  { symbol: 'HDFCBANK.NS', name: 'HDFC Bank Limited', price: 1623.45, change: -12.34, changePercent: -0.75, volume: '6.7M', country: 'IN' },
  { symbol: 'ICICIBANK.NS', name: 'ICICI Bank Limited', price: 987.65, change: 15.67, changePercent: 1.61, volume: '12.3M', country: 'IN' },
  { symbol: 'HINDUNILVR.NS', name: 'Hindustan Unilever Ltd.', price: 2567.89, change: 8.90, changePercent: 0.35, volume: '1.8M', country: 'IN' },
  { symbol: 'ITC.NS', name: 'ITC Limited', price: 456.78, change: -3.45, changePercent: -0.75, volume: '15.6M', country: 'IN' },
  { symbol: 'SBIN.NS', name: 'State Bank of India', price: 567.89, change: 12.34, changePercent: 2.22, volume: '45.7M', country: 'IN' },
  { symbol: 'BHARTIARTL.NS', name: 'Bharti Airtel Limited', price: 1234.56, change: 23.45, changePercent: 1.94, volume: '8.9M', country: 'IN' },
  { symbol: 'ASIANPAINT.NS', name: 'Asian Paints Limited', price: 3123.45, change: -67.89, changePercent: -2.13, volume: '2.3M', country: 'IN' },
  
  // Crypto
  { symbol: 'BTC-USD', name: 'Bitcoin', price: 67234.56, change: 1234.78, changePercent: 1.87, volume: '2.1B', country: 'CRYPTO' },
  { symbol: 'ETH-USD', name: 'Ethereum', price: 3456.78, change: -123.45, changePercent: -3.45, volume: '1.8B', country: 'CRYPTO' },
  
  // Indices
  { symbol: 'SPY', name: 'SPDR S&P 500', price: 456.78, change: 2.34, changePercent: 0.52, volume: '78.9M', country: 'US' },
  { symbol: 'NIFTY50', name: 'Nifty 50', price: 21567.89, change: 134.56, changePercent: 0.63, volume: '892.3M', country: 'IN' },
  { symbol: 'SENSEX', name: 'BSE Sensex', price: 71234.56, change: 456.78, changePercent: 0.65, volume: '1.2B', country: 'IN' }
];

const mockNews = [
  { 
    title: 'Fed Announces Rate Decision', 
    source: 'Reuters', 
    time: '2h ago', 
    impact: 'high',
    content: 'Federal Reserve announces interest rate decision affecting market sentiment...'
  },
  { 
    title: 'Tech Stocks Rally on AI News', 
    source: 'Bloomberg', 
    time: '4h ago', 
    impact: 'medium',
    content: 'Major technology companies see gains following AI breakthrough announcements...'
  },
  { 
    title: 'Oil Prices Surge on Supply Concerns', 
    source: 'CNBC', 
    time: '6h ago', 
    impact: 'high',
    content: 'Crude oil prices jump 3% on geopolitical tensions and supply disruptions...'
  }
];

const mockTradingIdeas = [
  {
    author: 'TradingPro',
    title: 'AAPL Long Setup - Cup & Handle Pattern',
    symbol: 'AAPL',
    direction: 'long',
    target: 185.00,
    stop: 165.00,
    likes: 234,
    comments: 45,
    time: '3h ago'
  },
  {
    author: 'CryptoAnalyst',
    title: 'BTC Breaking Resistance - Bullish Momentum',
    symbol: 'BTC-USD',
    direction: 'long',
    target: 72000,
    stop: 62000,
    likes: 567,
    comments: 89,
    time: '1h ago'
  },
  {
    author: 'ForexMaster',
    title: 'EUR/USD Bearish Divergence Setup',
    symbol: 'EURUSD',
    direction: 'short',
    target: 1.0850,
    stop: 1.0950,
    likes: 123,
    comments: 23,
    time: '5h ago'
  }
];

// Header Component
export const Header = ({ selectedSymbol, setSelectedSymbol, realTimeData, currentView, setCurrentView }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSymbols = mockMarketData.filter(stock =>
    stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stock.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get real-time ticker data
  const getTickerData = () => {
    const defaultTicker = [
      { symbol: 'AAPL', price: 175.43, change: 2.34, changePercent: 1.35 },
      { symbol: 'RELIANCE.NS', price: 2456.78, change: 34.56, changePercent: 1.43 },
      { symbol: 'TCS.NS', price: 3789.12, change: -45.67, changePercent: -1.19 },
      { symbol: 'BTC-USD', price: 67234.56, change: 1234.78, changePercent: 1.87 },
      { symbol: 'NIFTY50', price: 21567.89, change: 134.56, changePercent: 0.63 },
      { symbol: 'SENSEX', price: 71234.56, change: 456.78, changePercent: 0.65 }
    ];
    
    return defaultTicker.map(stock => {
      const realtimeUpdate = realTimeData?.[stock.symbol];
      if (realtimeUpdate) {
        return {
          ...stock,
          price: realtimeUpdate.price,
          change: realtimeUpdate.change,
          changePercent: realtimeUpdate.changePercent
        };
      }
      return stock;
    });
  };

  const viewTabs = [
    { id: 'trading', label: 'Trading', icon: TrendingUp },
    { id: 'scanner', label: 'Scanner', icon: Search },
    { id: 'screener', label: 'Screener', icon: BarChart3 }
  ];

  return (
    <header className="bg-gray-900 border-b border-gray-700 h-16 flex items-center px-4">
      <div className="flex items-center space-x-4">
        <div className="text-2xl font-bold text-white">
          Master<span className="text-blue-400">Traders</span>
        </div>
        
        <div className="relative">
          <button 
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded-md transition-colors"
          >
            <Search size={18} className="text-gray-400" />
            <span className="text-white font-medium">{selectedSymbol}</span>
            <ChevronDown size={16} className="text-gray-400" />
          </button>
          
          <AnimatePresence>
            {isSearchOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 mt-2 w-80 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-50"
              >
                <div className="p-3 border-b border-gray-700">
                  <input
                    type="text"
                    placeholder="Search symbols..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-gray-700 text-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoFocus
                  />
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {filteredSymbols.map((stock, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSelectedSymbol(stock.symbol);
                        setIsSearchOpen(false);
                        setSearchTerm('');
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-gray-700 flex items-center justify-between"
                    >
                      <div>
                        <div className="text-white font-medium">{stock.symbol}</div>
                        <div className="text-gray-400 text-sm">{stock.name}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-white">${stock.price.toFixed(2)}</div>
                        <div className={`text-sm ${stock.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* View Tabs */}
        <div className="flex items-center space-x-2">
          {viewTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setCurrentView(tab.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded text-sm transition-colors ${
                  currentView === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 mx-8">
        <div className="flex items-center space-x-6 text-sm">
          {getTickerData().map((stock, index) => (
            <motion.div 
              key={index} 
              className="flex items-center space-x-2 ticker-item"
              animate={{ 
                backgroundColor: stock.change >= 0 ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)' 
              }}
              transition={{ duration: 0.3 }}
            >
              <span className="text-gray-400">{stock.symbol}</span>
              <span className="text-white font-medium">{stock.price.toFixed(2)}</span>
              <span className={`font-medium ${stock.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 text-sm">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-green-400">Live Data</span>
        </div>
        <button className="text-gray-400 hover:text-white transition-colors">
          <Bell size={20} />
        </button>
        <button className="text-gray-400 hover:text-white transition-colors">
          <Settings size={20} />
        </button>
        <button className="text-gray-400 hover:text-white transition-colors">
          <User size={20} />
        </button>
      </div>
    </header>
  );
};

// Sidebar Component
export const Sidebar = ({ activeTab, setActiveTab, onSymbolSelect }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const tabs = [
    { id: 'watchlist', label: 'Watchlist', icon: Star },
    { id: 'alerts', label: 'Alerts', icon: Bell },
    { id: 'news', label: 'News', icon: Globe },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'ideas', label: 'Ideas', icon: MessageSquare },
    { id: 'screener', label: 'Screener', icon: Target }
  ];

  return (
    <div className={`bg-gray-900 border-r border-gray-700 transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'}`}>
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        {!isCollapsed && <h2 className="text-white font-semibold">Markets</h2>}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-gray-400 hover:text-white transition-colors"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <div className="p-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
                activeTab === tab.id 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <Icon size={20} />
              {!isCollapsed && <span>{tab.label}</span>}
            </button>
          );
        })}
      </div>

      {activeTab === 'watchlist' && !isCollapsed && (
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-medium">My Watchlist</h3>
            <button className="text-gray-400 hover:text-white">
              <Plus size={16} />
            </button>
          </div>
          <div className="space-y-2">
            {mockMarketData.slice(0, 8).map((stock, index) => (
              <button
                key={index}
                onClick={() => onSymbolSelect?.(stock.symbol)}
                className="w-full flex items-center justify-between p-2 hover:bg-gray-800 rounded cursor-pointer"
              >
                <div>
                  <div className="text-white text-sm font-medium">{stock.symbol}</div>
                  <div className="text-gray-400 text-xs">{stock.name}</div>
                </div>
                <div className="text-right">
                  <div className="text-white text-sm">${stock.price.toFixed(2)}</div>
                  <div className={`text-xs ${stock.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'news' && !isCollapsed && (
        <div className="p-4">
          <h3 className="text-white font-medium mb-4">Latest News</h3>
          <div className="space-y-3">
            {mockNews.map((news, index) => (
              <div key={index} className="p-3 bg-gray-800 rounded-md">
                <div className="flex items-center space-x-2 mb-2">
                  <span className={`w-2 h-2 rounded-full ${news.impact === 'high' ? 'bg-red-500' : 'bg-yellow-500'}`}></span>
                  <span className="text-gray-400 text-xs">{news.source}</span>
                  <span className="text-gray-500 text-xs">{news.time}</span>
                </div>
                <h4 className="text-white text-sm font-medium mb-1">{news.title}</h4>
                <p className="text-gray-400 text-xs">{news.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'ideas' && !isCollapsed && (
        <div className="p-4">
          <h3 className="text-white font-medium mb-4">Trading Ideas</h3>
          <div className="space-y-3">
            {mockTradingIdeas.map((idea, index) => (
              <div key={index} className="p-3 bg-gray-800 rounded-md">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-blue-400 text-sm font-medium">{idea.author}</span>
                  <span className="text-gray-500 text-xs">{idea.time}</span>
                </div>
                <h4 className="text-white text-sm font-medium mb-2">{idea.title}</h4>
                <div className="flex items-center space-x-4 text-xs">
                  <span className={`px-2 py-1 rounded ${idea.direction === 'long' ? 'bg-green-900 text-green-400' : 'bg-red-900 text-red-400'}`}>
                    {idea.direction.toUpperCase()}
                  </span>
                  <span className="text-gray-400">Target: ${idea.target}</span>
                </div>
                <div className="flex items-center space-x-4 mt-2 text-xs text-gray-400">
                  <span>❤️ {idea.likes}</span>
                  <span>💬 {idea.comments}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Chart Component
export const Chart = ({ data, chartType, indicators }) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('1D');
  const [selectedTool, setSelectedTool] = useState('cursor');

  const timeframes = ['1m', '5m', '15m', '30m', '1H', '4H', '1D', '1W', '1M'];
  const tools = [
    { id: 'cursor', icon: MousePointer, label: 'Cursor' },
    { id: 'line', icon: Minus, label: 'Line' },
    { id: 'rectangle', icon: Square, label: 'Rectangle' },
    { id: 'circle', icon: Circle, label: 'Circle' },
    { id: 'arrow', icon: Triangle, label: 'Arrow' },
    { id: 'trend', icon: TrendingUp, label: 'Trend Line' },
    { id: 'fib', icon: Ruler, label: 'Fibonacci' }
  ];

  const chartTypes = [
    { id: 'candlestick', label: 'Candlestick' },
    { id: 'line', label: 'Line' },
    { id: 'area', label: 'Area' },
    { id: 'bar', label: 'Bar' }
  ];

  const renderChart = () => {
    switch (chartType) {
      case 'line':
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="time" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1F2937', 
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#fff'
              }} 
            />
            <Line 
              type="monotone" 
              dataKey="price" 
              stroke="#3B82F6" 
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        );
      case 'area':
        return (
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="time" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1F2937', 
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#fff'
              }} 
            />
            <Area 
              type="monotone" 
              dataKey="price" 
              stroke="#3B82F6" 
              fill="#3B82F6"
              fillOpacity={0.3}
            />
          </AreaChart>
        );
      case 'bar':
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="time" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1F2937', 
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#fff'
              }} 
            />
            <Bar dataKey="volume" fill="#3B82F6" />
          </BarChart>
        );
      default:
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="time" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1F2937', 
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#fff'
              }} 
            />
            <Line 
              type="monotone" 
              dataKey="close" 
              stroke="#3B82F6" 
              strokeWidth={2}
              dot={false}
            />
            {indicators.includes('sma') && (
              <Line 
                type="monotone" 
                dataKey="sma" 
                stroke="#10B981" 
                strokeWidth={1}
                dot={false}
              />
            )}
          </LineChart>
        );
    }
  };

  return (
    <div className="bg-gray-900 flex-1 flex flex-col">
      <div className="border-b border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              {timeframes.map((tf) => (
                <button
                  key={tf}
                  onClick={() => setSelectedTimeframe(tf)}
                  className={`px-3 py-1 rounded text-sm transition-colors ${
                    selectedTimeframe === tf
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
            
            <div className="flex items-center space-x-2">
              {chartTypes.map((ct) => (
                <button
                  key={ct.id}
                  onClick={() => {}} // chartType change would be handled by parent
                  className={`px-3 py-1 rounded text-sm transition-colors ${
                    chartType === ct.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  {ct.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {tools.map((tool) => {
              const Icon = tool.icon;
              return (
                <button
                  key={tool.id}
                  onClick={() => setSelectedTool(tool.id)}
                  className={`p-2 rounded transition-colors ${
                    selectedTool === tool.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                  title={tool.label}
                >
                  <Icon size={16} />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex-1 p-4">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// Trading Panel Component
export const TradingPanel = ({ selectedSymbol, currentPrice, realTimeData }) => {
  const [orderType, setOrderType] = useState('market');
  const [side, setSide] = useState('buy');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [stopLoss, setStopLoss] = useState('');
  const [takeProfit, setTakeProfit] = useState('');

  // Get current market data
  const getMarketData = () => {
    if (realTimeData) {
      return {
        price: realTimeData.price,
        change: realTimeData.change,
        changePercent: realTimeData.changePercent,
        volume: realTimeData.volume
      };
    }
    
    const fallback = mockMarketData.find(s => s.symbol === selectedSymbol);
    return fallback || { price: currentPrice, change: 0, changePercent: 0, volume: 0 };
  };

  const marketData = getMarketData();

  return (
    <div className="bg-gray-900 border-l border-gray-700 w-80 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold">Trade {selectedSymbol}</h3>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-green-400 text-xs">Live</span>
        </div>
      </div>

      {/* Real-time Price Display */}
      <div className="bg-gray-800 p-3 rounded mb-4">
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Current Price</span>
          <div className="text-right">
            <div className="text-white text-lg font-bold">${marketData.price.toFixed(2)}</div>
            <div className={`text-sm ${marketData.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {marketData.change >= 0 ? '+' : ''}${marketData.change.toFixed(2)} ({marketData.changePercent.toFixed(2)}%)
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between mt-2 text-sm">
          <span className="text-gray-400">Volume</span>
          <span className="text-white">{(marketData.volume / 1000000).toFixed(1)}M</span>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex space-x-2">
          <button
            onClick={() => setSide('buy')}
            className={`flex-1 py-2 rounded font-medium transition-colors ${
              side === 'buy' 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            BUY
          </button>
          <button
            onClick={() => setSide('sell')}
            className={`flex-1 py-2 rounded font-medium transition-colors ${
              side === 'sell' 
                ? 'bg-red-600 text-white' 
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            SELL
          </button>
        </div>

        <div>
          <label className="block text-gray-400 text-sm mb-1">Order Type</label>
          <select
            value={orderType}
            onChange={(e) => setOrderType(e.target.value)}
            className="w-full bg-gray-800 text-white px-3 py-2 rounded border border-gray-700 focus:border-blue-500 focus:outline-none"
          >
            <option value="market">Market</option>
            <option value="limit">Limit</option>
            <option value="stop">Stop</option>
            <option value="stopLimit">Stop Limit</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-400 text-sm mb-1">Quantity</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="0"
            className="w-full bg-gray-800 text-white px-3 py-2 rounded border border-gray-700 focus:border-blue-500 focus:outline-none"
          />
        </div>

        {orderType !== 'market' && (
          <div>
            <label className="block text-gray-400 text-sm mb-1">Price</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder={marketData.price.toFixed(2)}
              className="w-full bg-gray-800 text-white px-3 py-2 rounded border border-gray-700 focus:border-blue-500 focus:outline-none"
            />
          </div>
        )}

        <div>
          <label className="block text-gray-400 text-sm mb-1">Stop Loss</label>
          <input
            type="number"
            value={stopLoss}
            onChange={(e) => setStopLoss(e.target.value)}
            placeholder="Optional"
            className="w-full bg-gray-800 text-white px-3 py-2 rounded border border-gray-700 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-gray-400 text-sm mb-1">Take Profit</label>
          <input
            type="number"
            value={takeProfit}
            onChange={(e) => setTakeProfit(e.target.value)}
            placeholder="Optional"
            className="w-full bg-gray-800 text-white px-3 py-2 rounded border border-gray-700 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div className="pt-4 border-t border-gray-700">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-400">Estimated Cost</span>
            <span className="text-white">${(quantity * marketData.price).toFixed(2)}</span>
          </div>
          {stopLoss && quantity && (
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-400">Max Loss</span>
              <span className="text-red-400">-${(quantity * Math.abs(marketData.price - parseFloat(stopLoss))).toFixed(2)}</span>
            </div>
          )}
          {takeProfit && quantity && (
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-400">Max Profit</span>
              <span className="text-green-400">+${(quantity * Math.abs(parseFloat(takeProfit) - marketData.price)).toFixed(2)}</span>
            </div>
          )}
        </div>

        <button
          className={`w-full py-3 rounded font-medium transition-colors ${
            side === 'buy'
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : 'bg-red-600 hover:bg-red-700 text-white'
          }`}
        >
          Place {side.toUpperCase()} Order
        </button>
      </div>

      <div className="mt-6">
        <h4 className="text-white font-medium mb-3">Open Positions</h4>
        <div className="space-y-2">
          <div className="bg-gray-800 p-3 rounded">
            <div className="flex justify-between items-center">
              <span className="text-white font-medium">AAPL</span>
              <span className="text-green-400">+2.34%</span>
            </div>
            <div className="flex justify-between items-center text-sm text-gray-400">
              <span>100 shares</span>
              <span>$17,543.00</span>
            </div>
          </div>
          <div className="bg-gray-800 p-3 rounded">
            <div className="flex justify-between items-center">
              <span className="text-white font-medium">TSLA</span>
              <span className="text-red-400">-1.28%</span>
            </div>
            <div className="flex justify-between items-center text-sm text-gray-400">
              <span>50 shares</span>
              <span>$12,436.50</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Bottom Panel Component
export const BottomPanel = ({ activeBottomTab, setActiveBottomTab }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const tabs = [
    { id: 'positions', label: 'Positions', icon: Briefcase },
    { id: 'orders', label: 'Orders', icon: Target },
    { id: 'alerts', label: 'Alerts', icon: Bell },
    { id: 'history', label: 'History', icon: Activity }
  ];

  const mockPositions = [
    { symbol: 'AAPL', quantity: 100, avgPrice: 175.43, currentPrice: 177.77, pnl: 234.00, pnlPercent: 1.33 },
    { symbol: 'TSLA', quantity: 50, avgPrice: 248.73, currentPrice: 245.28, pnl: -172.50, pnlPercent: -1.39 },
    { symbol: 'GOOGL', quantity: 25, avgPrice: 142.56, currentPrice: 144.89, pnl: 58.25, pnlPercent: 1.63 }
  ];

  if (!isExpanded) {
    return (
      <div className="bg-gray-900 border-t border-gray-700 h-12 flex items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveBottomTab(tab.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded text-sm transition-colors ${
                  activeBottomTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
        <button
          onClick={() => setIsExpanded(true)}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <ChevronUp size={20} />
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 border-t border-gray-700 h-64">
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-700">
        <div className="flex items-center space-x-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveBottomTab(tab.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded text-sm transition-colors ${
                  activeBottomTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
        <button
          onClick={() => setIsExpanded(false)}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <ChevronDown size={20} />
        </button>
      </div>

      <div className="p-4">
        {activeBottomTab === 'positions' && (
          <div className="space-y-2">
            <div className="grid grid-cols-7 gap-4 text-sm text-gray-400 font-medium">
              <span>Symbol</span>
              <span>Quantity</span>
              <span>Avg Price</span>
              <span>Current Price</span>
              <span>Market Value</span>
              <span>P&L</span>
              <span>P&L%</span>
            </div>
            {mockPositions.map((position, index) => (
              <div key={index} className="grid grid-cols-7 gap-4 text-sm py-2 border-t border-gray-700">
                <span className="text-white font-medium">{position.symbol}</span>
                <span className="text-white">{position.quantity}</span>
                <span className="text-white">${position.avgPrice.toFixed(2)}</span>
                <span className="text-white">${position.currentPrice.toFixed(2)}</span>
                <span className="text-white">${(position.quantity * position.currentPrice).toFixed(2)}</span>
                <span className={position.pnl >= 0 ? 'text-green-400' : 'text-red-400'}>
                  {position.pnl >= 0 ? '+' : ''}${position.pnl.toFixed(2)}
                </span>
                <span className={position.pnlPercent >= 0 ? 'text-green-400' : 'text-red-400'}>
                  {position.pnlPercent >= 0 ? '+' : ''}{position.pnlPercent.toFixed(2)}%
                </span>
              </div>
            ))}
          </div>
        )}

        {activeBottomTab === 'orders' && (
          <div className="text-center text-gray-400 py-8">
            <Target size={48} className="mx-auto mb-4 opacity-50" />
            <p>No open orders</p>
          </div>
        )}

        {activeBottomTab === 'alerts' && (
          <div className="text-center text-gray-400 py-8">
            <Bell size={48} className="mx-auto mb-4 opacity-50" />
            <p>No active alerts</p>
          </div>
        )}

        {activeBottomTab === 'history' && (
          <div className="text-center text-gray-400 py-8">
            <Activity size={48} className="mx-auto mb-4 opacity-50" />
            <p>No trading history</p>
          </div>
        )}
      </div>
    </div>
  );
};