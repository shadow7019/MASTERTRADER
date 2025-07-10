import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, Filter, TrendingUp, TrendingDown, 
  Volume2, Activity, Target, Zap, Star,
  RefreshCw, Download, Settings, ArrowUp, ArrowDown
} from 'lucide-react';

const MarketScanner = ({ onSymbolSelect }) => {
  const [scanResults, setScanResults] = useState([]);
  const [selectedScan, setSelectedScan] = useState('momentum');
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    minVolume: '',
    sector: '',
    marketCap: ''
  });
  const [sortBy, setSortBy] = useState('changePercent');
  const [sortDirection, setSortDirection] = useState('desc');
  const [isLoading, setIsLoading] = useState(false);

  const scanTypes = [
    { 
      id: 'momentum', 
      label: 'Momentum Stocks', 
      icon: TrendingUp, 
      description: 'Stocks with strong upward momentum'
    },
    { 
      id: 'breakout', 
      label: 'Breakout Stocks', 
      icon: Zap, 
      description: 'Stocks breaking resistance levels'
    },
    { 
      id: 'volume', 
      label: 'Volume Surge', 
      icon: Volume2, 
      description: 'Stocks with unusual volume activity'
    },
    { 
      id: 'oversold', 
      label: 'Oversold Stocks', 
      icon: TrendingDown, 
      description: 'Potentially oversold stocks (RSI < 30)'
    },
    { 
      id: 'overbought', 
      label: 'Overbought Stocks', 
      icon: Activity, 
      description: 'Potentially overbought stocks (RSI > 70)'
    },
    { 
      id: 'earnings', 
      label: 'Earnings Movers', 
      icon: Target, 
      description: 'Stocks moving on earnings'
    }
  ];

  const sectors = [
    'Technology', 'Healthcare', 'Financial', 'Consumer', 'Energy', 
    'Industrial', 'Materials', 'Utilities', 'Real Estate', 'Telecommunications'
  ];

  const marketCapRanges = [
    'Large Cap (>$10B)', 'Mid Cap ($2B-$10B)', 'Small Cap ($300M-$2B)', 'Micro Cap (<$300M)'
  ];

  // Mock scan results
  const mockScanResults = {
    momentum: [
      { symbol: 'NVDA', name: 'NVIDIA Corp', price: 875.43, change: 45.67, changePercent: 5.51, volume: 45231000, rsi: 75.2, marketCap: '2.15T' },
      { symbol: 'TSLA', name: 'Tesla Inc', price: 248.73, change: 18.45, changePercent: 8.00, volume: 89234000, rsi: 68.4, marketCap: '789B' },
      { symbol: 'AMD', name: 'Advanced Micro Devices', price: 142.56, change: 8.23, changePercent: 6.13, volume: 67123000, rsi: 71.8, marketCap: '230B' }
    ],
    breakout: [
      { symbol: 'AAPL', name: 'Apple Inc', price: 175.43, change: 3.45, changePercent: 2.00, volume: 55234000, rsi: 62.1, marketCap: '2.85T' },
      { symbol: 'MSFT', name: 'Microsoft Corp', price: 378.91, change: 12.34, changePercent: 3.37, volume: 32145000, rsi: 58.7, marketCap: '2.82T' },
      { symbol: 'GOOGL', name: 'Alphabet Inc', price: 142.56, change: 5.67, changePercent: 4.15, volume: 28934000, rsi: 55.3, marketCap: '1.78T' }
    ],
    volume: [
      { symbol: 'GME', name: 'GameStop Corp', price: 45.67, change: 2.34, changePercent: 5.40, volume: 125000000, rsi: 65.2, marketCap: '14.2B' },
      { symbol: 'AMC', name: 'AMC Entertainment', price: 12.34, change: 0.89, changePercent: 7.78, volume: 89234000, rsi: 62.8, marketCap: '6.4B' },
      { symbol: 'BB', name: 'BlackBerry Ltd', price: 8.91, change: 0.45, changePercent: 5.32, volume: 67123000, rsi: 58.4, marketCap: '5.1B' }
    ],
    oversold: [
      { symbol: 'INTC', name: 'Intel Corp', price: 34.56, change: -1.23, changePercent: -3.44, volume: 45231000, rsi: 28.5, marketCap: '141B' },
      { symbol: 'BABA', name: 'Alibaba Group', price: 89.12, change: -2.34, changePercent: -2.56, volume: 32145000, rsi: 25.8, marketCap: '217B' },
      { symbol: 'NFLX', name: 'Netflix Inc', price: 456.78, change: -8.45, changePercent: -1.82, volume: 12345000, rsi: 29.2, marketCap: '203B' }
    ],
    overbought: [
      { symbol: 'NVDA', name: 'NVIDIA Corp', price: 875.43, change: 45.67, changePercent: 5.51, volume: 45231000, rsi: 82.3, marketCap: '2.15T' },
      { symbol: 'AVGO', name: 'Broadcom Inc', price: 1234.56, change: 67.89, changePercent: 5.82, volume: 23456000, rsi: 78.9, marketCap: '574B' },
      { symbol: 'CRM', name: 'Salesforce Inc', price: 234.56, change: 12.34, changePercent: 5.55, volume: 34567000, rsi: 76.4, marketCap: '231B' }
    ],
    earnings: [
      { symbol: 'AAPL', name: 'Apple Inc', price: 175.43, change: 8.45, changePercent: 5.06, volume: 89234000, rsi: 62.1, marketCap: '2.85T' },
      { symbol: 'MSFT', name: 'Microsoft Corp', price: 378.91, change: -12.34, changePercent: -3.16, volume: 67123000, rsi: 45.7, marketCap: '2.82T' },
      { symbol: 'GOOGL', name: 'Alphabet Inc', price: 142.56, change: 15.67, changePercent: 12.35, volume: 125000000, rsi: 71.3, marketCap: '1.78T' }
    ]
  };

  useEffect(() => {
    runScan();
  }, [selectedScan]);

  const runScan = async () => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    let results = mockScanResults[selectedScan] || [];
    
    // Apply filters
    if (filters.minPrice) {
      results = results.filter(stock => stock.price >= parseFloat(filters.minPrice));
    }
    if (filters.maxPrice) {
      results = results.filter(stock => stock.price <= parseFloat(filters.maxPrice));
    }
    if (filters.minVolume) {
      results = results.filter(stock => stock.volume >= parseInt(filters.minVolume));
    }
    
    // Sort results
    results.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (sortDirection === 'desc') {
        return bValue - aValue;
      } else {
        return aValue - bValue;
      }
    });
    
    setScanResults(results);
    setIsLoading(false);
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(column);
      setSortDirection('desc');
    }
  };

  const getRSIColor = (rsi) => {
    if (rsi > 70) return 'text-red-400';
    if (rsi < 30) return 'text-green-400';
    return 'text-yellow-400';
  };

  const getChangeColor = (change) => {
    return change >= 0 ? 'text-green-400' : 'text-red-400';
  };

  return (
    <div className="bg-gray-900 h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white text-xl font-bold">Market Scanner</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={runScan}
              disabled={isLoading}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded transition-colors"
            >
              <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
              <span>Scan</span>
            </button>
            <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded">
              <Download size={16} />
            </button>
            <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded">
              <Settings size={16} />
            </button>
          </div>
        </div>

        {/* Scan Types */}
        <div className="flex flex-wrap gap-2 mb-4">
          {scanTypes.map((scan) => {
            const Icon = scan.icon;
            return (
              <button
                key={scan.id}
                onClick={() => setSelectedScan(scan.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                  selectedScan === scan.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                <Icon size={16} />
                <span>{scan.label}</span>
              </button>
            );
          })}
        </div>

        {/* Filters */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          <input
            type="number"
            placeholder="Min Price"
            value={filters.minPrice}
            onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
            className="bg-gray-800 text-white px-3 py-2 rounded text-sm border border-gray-700 focus:border-blue-500 focus:outline-none"
          />
          <input
            type="number"
            placeholder="Max Price"
            value={filters.maxPrice}
            onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
            className="bg-gray-800 text-white px-3 py-2 rounded text-sm border border-gray-700 focus:border-blue-500 focus:outline-none"
          />
          <input
            type="number"
            placeholder="Min Volume"
            value={filters.minVolume}
            onChange={(e) => setFilters({...filters, minVolume: e.target.value})}
            className="bg-gray-800 text-white px-3 py-2 rounded text-sm border border-gray-700 focus:border-blue-500 focus:outline-none"
          />
          <select
            value={filters.sector}
            onChange={(e) => setFilters({...filters, sector: e.target.value})}
            className="bg-gray-800 text-white px-3 py-2 rounded text-sm border border-gray-700 focus:border-blue-500 focus:outline-none"
          >
            <option value="">All Sectors</option>
            {sectors.map(sector => (
              <option key={sector} value={sector}>{sector}</option>
            ))}
          </select>
          <select
            value={filters.marketCap}
            onChange={(e) => setFilters({...filters, marketCap: e.target.value})}
            className="bg-gray-800 text-white px-3 py-2 rounded text-sm border border-gray-700 focus:border-blue-500 focus:outline-none"
          >
            <option value="">All Market Caps</option>
            {marketCapRanges.map(range => (
              <option key={range} value={range}>{range}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <RefreshCw className="animate-spin text-blue-500 mx-auto mb-2" size={32} />
              <p className="text-gray-400">Scanning market...</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800 sticky top-0">
                <tr>
                  <th className="text-left p-3 text-gray-300 font-medium">
                    <button 
                      onClick={() => handleSort('symbol')}
                      className="flex items-center space-x-1 hover:text-white"
                    >
                      <span>Symbol</span>
                      {sortBy === 'symbol' && (
                        sortDirection === 'desc' ? <ArrowDown size={14} /> : <ArrowUp size={14} />
                      )}
                    </button>
                  </th>
                  <th className="text-left p-3 text-gray-300 font-medium">Company</th>
                  <th className="text-right p-3 text-gray-300 font-medium">
                    <button 
                      onClick={() => handleSort('price')}
                      className="flex items-center space-x-1 hover:text-white ml-auto"
                    >
                      <span>Price</span>
                      {sortBy === 'price' && (
                        sortDirection === 'desc' ? <ArrowDown size={14} /> : <ArrowUp size={14} />
                      )}
                    </button>
                  </th>
                  <th className="text-right p-3 text-gray-300 font-medium">
                    <button 
                      onClick={() => handleSort('change')}
                      className="flex items-center space-x-1 hover:text-white ml-auto"
                    >
                      <span>Change</span>
                      {sortBy === 'change' && (
                        sortDirection === 'desc' ? <ArrowDown size={14} /> : <ArrowUp size={14} />
                      )}
                    </button>
                  </th>
                  <th className="text-right p-3 text-gray-300 font-medium">
                    <button 
                      onClick={() => handleSort('changePercent')}
                      className="flex items-center space-x-1 hover:text-white ml-auto"
                    >
                      <span>%</span>
                      {sortBy === 'changePercent' && (
                        sortDirection === 'desc' ? <ArrowDown size={14} /> : <ArrowUp size={14} />
                      )}
                    </button>
                  </th>
                  <th className="text-right p-3 text-gray-300 font-medium">
                    <button 
                      onClick={() => handleSort('volume')}
                      className="flex items-center space-x-1 hover:text-white ml-auto"
                    >
                      <span>Volume</span>
                      {sortBy === 'volume' && (
                        sortDirection === 'desc' ? <ArrowDown size={14} /> : <ArrowUp size={14} />
                      )}
                    </button>
                  </th>
                  <th className="text-right p-3 text-gray-300 font-medium">
                    <button 
                      onClick={() => handleSort('rsi')}
                      className="flex items-center space-x-1 hover:text-white ml-auto"
                    >
                      <span>RSI</span>
                      {sortBy === 'rsi' && (
                        sortDirection === 'desc' ? <ArrowDown size={14} /> : <ArrowUp size={14} />
                      )}
                    </button>
                  </th>
                  <th className="text-right p-3 text-gray-300 font-medium">Market Cap</th>
                  <th className="text-center p-3 text-gray-300 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {scanResults.map((stock, index) => (
                  <motion.tr
                    key={stock.symbol}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-gray-700 hover:bg-gray-800 transition-colors"
                  >
                    <td className="p-3">
                      <div className="flex items-center space-x-2">
                        <button className="text-gray-400 hover:text-yellow-400">
                          <Star size={14} />
                        </button>
                        <span className="text-white font-medium">{stock.symbol}</span>
                      </div>
                    </td>
                    <td className="p-3 text-gray-300">{stock.name}</td>
                    <td className="p-3 text-right text-white font-medium">${stock.price.toFixed(2)}</td>
                    <td className={`p-3 text-right font-medium ${getChangeColor(stock.change)}`}>
                      {stock.change >= 0 ? '+' : ''}${stock.change.toFixed(2)}
                    </td>
                    <td className={`p-3 text-right font-medium ${getChangeColor(stock.changePercent)}`}>
                      {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                    </td>
                    <td className="p-3 text-right text-gray-300">
                      {(stock.volume / 1000000).toFixed(1)}M
                    </td>
                    <td className={`p-3 text-right font-medium ${getRSIColor(stock.rsi)}`}>
                      {stock.rsi.toFixed(1)}
                    </td>
                    <td className="p-3 text-right text-gray-300">{stock.marketCap}</td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => onSymbolSelect?.(stock.symbol)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
                      >
                        View
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketScanner;