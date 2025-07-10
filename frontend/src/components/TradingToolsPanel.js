import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calculator, TrendingUp, TrendingDown, Target, 
  Zap, Activity, BarChart3, PieChart, Layers,
  DollarSign, Percent, Clock, AlertTriangle,
  Settings, Save, Download, RefreshCw
} from 'lucide-react';

const TradingToolsPanel = ({ symbol, currentPrice, onToolSelect }) => {
  const [activeToolTab, setActiveToolTab] = useState('calculator');
  const [positionSize, setPositionSize] = useState('');
  const [riskAmount, setRiskAmount] = useState('');
  const [stopLoss, setStopLoss] = useState('');
  const [takeProfit, setTakeProfit] = useState('');
  const [fibLevels, setFibLevels] = useState([]);
  const [pivotPoints, setPivotPoints] = useState({});
  const [supportLevels, setSupportLevels] = useState([]);
  const [resistanceLevels, setResistanceLevels] = useState([]);

  const toolTabs = [
    { id: 'calculator', label: 'Position Calculator', icon: Calculator },
    { id: 'fibonacci', label: 'Fibonacci', icon: TrendingUp },
    { id: 'pivots', label: 'Pivot Points', icon: Target },
    { id: 'levels', label: 'Support/Resistance', icon: BarChart3 },
    { id: 'portfolio', label: 'Portfolio Risk', icon: PieChart },
    { id: 'alerts', label: 'Price Alerts', icon: AlertTriangle }
  ];

  // Position Size Calculator
  const calculatePositionSize = () => {
    if (!riskAmount || !stopLoss || !currentPrice) return 0;
    
    const riskAmountNum = parseFloat(riskAmount);
    const stopLossNum = parseFloat(stopLoss);
    const riskPerShare = Math.abs(currentPrice - stopLossNum);
    
    if (riskPerShare === 0) return 0;
    
    return Math.floor(riskAmountNum / riskPerShare);
  };

  // Risk/Reward Calculator
  const calculateRiskReward = () => {
    if (!stopLoss || !takeProfit || !currentPrice) return { risk: 0, reward: 0, ratio: 0 };
    
    const stopLossNum = parseFloat(stopLoss);
    const takeProfitNum = parseFloat(takeProfit);
    const risk = Math.abs(currentPrice - stopLossNum);
    const reward = Math.abs(takeProfitNum - currentPrice);
    const ratio = reward / risk;
    
    return { risk, reward, ratio };
  };

  // Generate Fibonacci Levels
  const generateFibonacciLevels = (high, low, direction = 'retracement') => {
    const fibRatios = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1.0, 1.272, 1.414, 1.618, 2.0];
    const range = high - low;
    
    return fibRatios.map(ratio => {
      let level;
      if (direction === 'retracement') {
        level = high - (range * ratio);
      } else {
        level = low + (range * ratio);
      }
      
      return {
        ratio: ratio,
        level: level,
        percentage: (ratio * 100).toFixed(1)
      };
    });
  };

  // Calculate Pivot Points
  const calculatePivotPoints = (high, low, close) => {
    const pivot = (high + low + close) / 3;
    const r1 = (2 * pivot) - low;
    const s1 = (2 * pivot) - high;
    const r2 = pivot + (high - low);
    const s2 = pivot - (high - low);
    const r3 = high + 2 * (pivot - low);
    const s3 = low - 2 * (high - pivot);
    
    return {
      pivot: pivot,
      resistance1: r1,
      resistance2: r2,
      resistance3: r3,
      support1: s1,
      support2: s2,
      support3: s3
    };
  };

  // Mock data for demonstration
  useEffect(() => {
    if (currentPrice) {
      // Generate mock fibonacci levels
      const mockHigh = currentPrice * 1.1;
      const mockLow = currentPrice * 0.9;
      setFibLevels(generateFibonacciLevels(mockHigh, mockLow));
      
      // Calculate pivot points
      const pivots = calculatePivotPoints(mockHigh, mockLow, currentPrice);
      setPivotPoints(pivots);
      
      // Mock support and resistance levels
      setSupportLevels([
        { level: currentPrice * 0.95, strength: 'strong', touches: 3 },
        { level: currentPrice * 0.92, strength: 'medium', touches: 2 },
        { level: currentPrice * 0.88, strength: 'weak', touches: 1 }
      ]);
      
      setResistanceLevels([
        { level: currentPrice * 1.05, strength: 'strong', touches: 4 },
        { level: currentPrice * 1.08, strength: 'medium', touches: 2 },
        { level: currentPrice * 1.12, strength: 'weak', touches: 1 }
      ]);
    }
  }, [currentPrice]);

  const riskReward = calculateRiskReward();
  const calculatedPositionSize = calculatePositionSize();

  return (
    <div className="bg-gray-900 border-l border-gray-700 w-96 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <h3 className="text-white font-semibold">Trading Tools</h3>
        <p className="text-gray-400 text-sm">{symbol} - ${currentPrice?.toFixed(2)}</p>
      </div>

      {/* Tool Tabs */}
      <div className="border-b border-gray-700">
        <div className="flex flex-wrap">
          {toolTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveToolTab(tab.id)}
                className={`flex items-center space-x-2 px-3 py-2 text-sm transition-colors ${
                  activeToolTab === tab.id
                    ? 'bg-blue-600 text-white border-b-2 border-blue-400'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <Icon size={16} />
                <span className="hidden md:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tool Content */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {activeToolTab === 'calculator' && (
            <motion.div
              key="calculator"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-4 space-y-4"
            >
              <h4 className="text-white font-medium">Position Size Calculator</h4>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Risk Amount ($)</label>
                  <input
                    type="number"
                    value={riskAmount}
                    onChange={(e) => setRiskAmount(e.target.value)}
                    placeholder="1000"
                    className="w-full bg-gray-800 text-white px-3 py-2 rounded border border-gray-700 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Stop Loss ($)</label>
                  <input
                    type="number"
                    value={stopLoss}
                    onChange={(e) => setStopLoss(e.target.value)}
                    placeholder={(currentPrice * 0.95).toFixed(2)}
                    className="w-full bg-gray-800 text-white px-3 py-2 rounded border border-gray-700 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Take Profit ($)</label>
                  <input
                    type="number"
                    value={takeProfit}
                    onChange={(e) => setTakeProfit(e.target.value)}
                    placeholder={(currentPrice * 1.05).toFixed(2)}
                    className="w-full bg-gray-800 text-white px-3 py-2 rounded border border-gray-700 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="bg-gray-800 p-3 rounded space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Position Size:</span>
                  <span className="text-white font-medium">{calculatedPositionSize} shares</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Risk per Share:</span>
                  <span className="text-white">${stopLoss ? Math.abs(currentPrice - parseFloat(stopLoss)).toFixed(2) : '0.00'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Risk/Reward Ratio:</span>
                  <span className={`font-medium ${riskReward.ratio >= 2 ? 'text-green-400' : riskReward.ratio >= 1 ? 'text-yellow-400' : 'text-red-400'}`}>
                    1:{riskReward.ratio.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Potential Profit:</span>
                  <span className="text-green-400">${(calculatedPositionSize * riskReward.reward).toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Potential Loss:</span>
                  <span className="text-red-400">-${(calculatedPositionSize * riskReward.risk).toFixed(2)}</span>
                </div>
              </div>
            </motion.div>
          )}

          {activeToolTab === 'fibonacci' && (
            <motion.div
              key="fibonacci"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-4 space-y-4"
            >
              <h4 className="text-white font-medium">Fibonacci Levels</h4>
              
              <div className="space-y-2">
                {fibLevels.map((fib, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-gray-800 rounded">
                    <span className="text-gray-400">{fib.percentage}%</span>
                    <span className="text-white font-medium">${fib.level.toFixed(2)}</span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      fib.level > currentPrice ? 'bg-red-900 text-red-300' : 'bg-green-900 text-green-300'
                    }`}>
                      {fib.level > currentPrice ? 'Resistance' : 'Support'}
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => onToolSelect?.('fibonacci')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition-colors"
              >
                Draw Fibonacci on Chart
              </button>
            </motion.div>
          )}

          {activeToolTab === 'pivots' && (
            <motion.div
              key="pivots"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-4 space-y-4"
            >
              <h4 className="text-white font-medium">Pivot Points</h4>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 bg-gray-800 rounded">
                  <span className="text-blue-400">Pivot Point</span>
                  <span className="text-white font-medium">${pivotPoints.pivot?.toFixed(2)}</span>
                </div>
                
                <div className="text-red-400 text-sm font-medium">Resistance Levels</div>
                {['resistance3', 'resistance2', 'resistance1'].map((level, index) => (
                  <div key={level} className="flex justify-between items-center p-2 bg-gray-800 rounded">
                    <span className="text-red-400">R{3-index}</span>
                    <span className="text-white font-medium">${pivotPoints[level]?.toFixed(2)}</span>
                  </div>
                ))}
                
                <div className="text-green-400 text-sm font-medium">Support Levels</div>
                {['support1', 'support2', 'support3'].map((level, index) => (
                  <div key={level} className="flex justify-between items-center p-2 bg-gray-800 rounded">
                    <span className="text-green-400">S{index+1}</span>
                    <span className="text-white font-medium">${pivotPoints[level]?.toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => onToolSelect?.('pivots')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition-colors"
              >
                Show Pivots on Chart
              </button>
            </motion.div>
          )}

          {activeToolTab === 'levels' && (
            <motion.div
              key="levels"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-4 space-y-4"
            >
              <h4 className="text-white font-medium">Support & Resistance</h4>
              
              <div className="space-y-3">
                <div>
                  <div className="text-red-400 text-sm font-medium mb-2">Resistance Levels</div>
                  {resistanceLevels.map((level, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-gray-800 rounded">
                      <div className="flex items-center space-x-2">
                        <span className="text-red-400">${level.level.toFixed(2)}</span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          level.strength === 'strong' ? 'bg-red-900 text-red-300' :
                          level.strength === 'medium' ? 'bg-yellow-900 text-yellow-300' :
                          'bg-gray-700 text-gray-300'
                        }`}>
                          {level.strength}
                        </span>
                      </div>
                      <span className="text-gray-400 text-xs">{level.touches} touches</span>
                    </div>
                  ))}
                </div>
                
                <div>
                  <div className="text-green-400 text-sm font-medium mb-2">Support Levels</div>
                  {supportLevels.map((level, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-gray-800 rounded">
                      <div className="flex items-center space-x-2">
                        <span className="text-green-400">${level.level.toFixed(2)}</span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          level.strength === 'strong' ? 'bg-green-900 text-green-300' :
                          level.strength === 'medium' ? 'bg-yellow-900 text-yellow-300' :
                          'bg-gray-700 text-gray-300'
                        }`}>
                          {level.strength}
                        </span>
                      </div>
                      <span className="text-gray-400 text-xs">{level.touches} touches</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => onToolSelect?.('levels')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition-colors"
              >
                Draw Levels on Chart
              </button>
            </motion.div>
          )}

          {activeToolTab === 'portfolio' && (
            <motion.div
              key="portfolio"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-4 space-y-4"
            >
              <h4 className="text-white font-medium">Portfolio Risk Management</h4>
              
              <div className="space-y-3">
                <div className="bg-gray-800 p-3 rounded">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400">Portfolio Value</span>
                    <span className="text-white font-medium">$50,000</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400">Current Risk</span>
                    <span className="text-yellow-400">2.5%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Max Risk (2%)</span>
                    <span className="text-red-400">$1,000</span>
                  </div>
                </div>
                
                <div className="bg-gray-800 p-3 rounded">
                  <div className="text-white font-medium mb-2">Risk Distribution</div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">AAPL</span>
                      <span className="text-white">0.8%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">TSLA</span>
                      <span className="text-white">1.2%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">GOOGL</span>
                      <span className="text-white">0.5%</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeToolTab === 'alerts' && (
            <motion.div
              key="alerts"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-4 space-y-4"
            >
              <h4 className="text-white font-medium">Price Alerts</h4>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Alert Price</label>
                  <input
                    type="number"
                    placeholder="Enter price level"
                    className="w-full bg-gray-800 text-white px-3 py-2 rounded border border-gray-700 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Alert Type</label>
                  <select className="w-full bg-gray-800 text-white px-3 py-2 rounded border border-gray-700 focus:border-blue-500 focus:outline-none">
                    <option>Price Above</option>
                    <option>Price Below</option>
                    <option>Price Change %</option>
                    <option>Volume Spike</option>
                  </select>
                </div>
                
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition-colors">
                  Create Alert
                </button>
              </div>
              
              <div className="space-y-2">
                <div className="text-white font-medium">Active Alerts</div>
                <div className="bg-gray-800 p-3 rounded">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-white text-sm">AAPL above $180</div>
                      <div className="text-gray-400 text-xs">Created 2 hours ago</div>
                    </div>
                    <button className="text-red-400 hover:text-red-300">
                      <X size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TradingToolsPanel;