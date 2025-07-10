import React, { useState, useEffect } from 'react';
import './App.css';
import { Header, Sidebar, Chart, TradingPanel, BottomPanel } from './components';
import AdvancedChart from './components/AdvancedChart';
import TradingToolsPanel from './components/TradingToolsPanel';
import { marketDataService } from './services/marketData';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, TrendingUp, Search, Settings } from 'lucide-react';

function App() {
  const [selectedSymbol, setSelectedSymbol] = useState('AAPL');
  const [activeTab, setActiveTab] = useState('watchlist');
  const [activeBottomTab, setActiveBottomTab] = useState('positions');
  const [chartType, setChartType] = useState('candlestick');
  const [indicators, setIndicators] = useState(['sma20']);
  const [isLoading, setIsLoading] = useState(true);
  const [marketData, setMarketData] = useState([]);
  const [technicalIndicators, setTechnicalIndicators] = useState({});
  const [realTimeData, setRealTimeData] = useState({});
  const [currentView, setCurrentView] = useState('trading'); // trading, scanner, screener
  const [showAdvancedTools, setShowAdvancedTools] = useState(true);

  useEffect(() => {
    // Initialize market data service
    const initializeData = async () => {
      setIsLoading(true);
      
      try {
        // Fetch historical data
        const data = await marketDataService.fetchHistoricalData(selectedSymbol, '1day', 100);
        setMarketData(data);
        
        // Calculate technical indicators
        const indicators = marketDataService.calculateTechnicalIndicators(data);
        setTechnicalIndicators(indicators);
        
        // Subscribe to real-time data
        marketDataService.subscribe(selectedSymbol, (realTimeUpdate) => {
          setRealTimeData(prev => ({
            ...prev,
            [realTimeUpdate.symbol]: realTimeUpdate
          }));
        });
        
      } catch (error) {
        console.error('Error initializing data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();

    return () => {
      // Cleanup subscription
      marketDataService.disconnect();
    };
  }, [selectedSymbol]);

  const handleSymbolChange = async (newSymbol) => {
    setSelectedSymbol(newSymbol);
    setIsLoading(true);
    
    try {
      const data = await marketDataService.fetchHistoricalData(newSymbol, '1day', 100);
      setMarketData(data);
      
      const indicators = marketDataService.calculateTechnicalIndicators(data);
      setTechnicalIndicators(indicators);
      
    } catch (error) {
      console.error('Error fetching symbol data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTimeframeChange = async (timeframe) => {
    setIsLoading(true);
    try {
      const data = await marketDataService.fetchHistoricalData(selectedSymbol, timeframe, 100);
      setMarketData(data);
      
      const indicators = marketDataService.calculateTechnicalIndicators(data);
      setTechnicalIndicators(indicators);
    } catch (error) {
      console.error('Error changing timeframe:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleIndicatorToggle = (activeIndicators) => {
    setIndicators(activeIndicators);
  };

  const handleToolSelect = (tool) => {
    console.log('Tool selected:', tool);
    // Tool selection logic would be implemented here
  };

  const getCurrentPrice = () => {
    const realTime = realTimeData[selectedSymbol];
    if (realTime) return realTime.price;
    
    if (marketData.length > 0) {
      return marketData[marketData.length - 1].close;
    }
    
    return 0;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto"></div>
          <div className="mt-4 text-white text-xl font-bold">
            Master<span className="text-blue-400">Traders</span>
          </div>
          <div className="mt-2 text-gray-400">Loading advanced market data...</div>
          <div className="mt-1 text-gray-500 text-sm">Real-time data • Technical indicators • Trading tools</div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col trading-container">
      <Header 
        selectedSymbol={selectedSymbol} 
        setSelectedSymbol={handleSymbolChange}
        realTimeData={realTimeData}
        currentView={currentView}
        setCurrentView={setCurrentView}
      />
      
      <div className="flex-1 flex">
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          onSymbolSelect={handleSymbolChange}
        />
        
        <div className="flex-1 flex flex-col">
          {currentView === 'trading' && (
            <div className="flex-1 flex">
              <div className="flex-1 flex flex-col">
                <AdvancedChart 
                  symbol={selectedSymbol}
                  data={marketData} 
                  indicators={technicalIndicators}
                  onTimeframeChange={handleTimeframeChange}
                  onChartTypeChange={setChartType}
                  onIndicatorToggle={handleIndicatorToggle}
                />
              </div>
              
              <div className="flex">
                <TradingPanel 
                  selectedSymbol={selectedSymbol}
                  currentPrice={getCurrentPrice()}
                  realTimeData={realTimeData[selectedSymbol]}
                />
                
                {showAdvancedTools && (
                  <TradingToolsPanel
                    symbol={selectedSymbol}
                    currentPrice={getCurrentPrice()}
                    onToolSelect={handleToolSelect}
                  />
                )}
              </div>
            </div>
          )}
          
          <BottomPanel 
            activeBottomTab={activeBottomTab} 
            setActiveBottomTab={setActiveBottomTab}
            realTimeData={realTimeData}
          />
        </div>

        {/* Toggle Advanced Tools Button */}
        <motion.button
          onClick={() => setShowAdvancedTools(!showAdvancedTools)}
          className="fixed right-4 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg z-10"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          title={showAdvancedTools ? 'Hide Trading Tools' : 'Show Trading Tools'}
        >
          <BarChart3 size={20} />
        </motion.button>
      </div>
    </div>
  );
}

export default App;