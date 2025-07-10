import React, { useState, useEffect } from 'react';
import './App.css';
import { Header, Sidebar, Chart, TradingPanel, BottomPanel } from './components';

// Mock data for the chart
const mockChartData = Array.from({ length: 100 }, (_, i) => {
  const basePrice = 150;
  const variation = Math.sin(i * 0.1) * 10 + Math.random() * 5;
  const price = basePrice + variation;
  const sma = basePrice + Math.sin(i * 0.05) * 5; // Simple moving average mock
  return {
    time: i,
    price: price,
    open: price - Math.random() * 2,
    high: price + Math.random() * 3,
    low: price - Math.random() * 3,
    close: price + (Math.random() - 0.5) * 2,
    volume: Math.floor(Math.random() * 1000000),
    sma: sma
  };
});

function App() {
  const [selectedSymbol, setSelectedSymbol] = useState('AAPL');
  const [activeTab, setActiveTab] = useState('watchlist');
  const [activeBottomTab, setActiveBottomTab] = useState('positions');
  const [chartType, setChartType] = useState('line');
  const [indicators, setIndicators] = useState(['sma']);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto"></div>
          <div className="mt-4 text-white text-xl font-bold">
            Master<span className="text-blue-400">Traders</span>
          </div>
          <div className="mt-2 text-gray-400">Loading market data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <Header 
        selectedSymbol={selectedSymbol} 
        setSelectedSymbol={setSelectedSymbol} 
      />
      
      <div className="flex-1 flex">
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
        />
        
        <div className="flex-1 flex flex-col">
          <div className="flex-1 flex">
            <Chart 
              data={mockChartData} 
              chartType={chartType}
              indicators={indicators}
            />
            
            <TradingPanel 
              selectedSymbol={selectedSymbol} 
            />
          </div>
          
          <BottomPanel 
            activeBottomTab={activeBottomTab} 
            setActiveBottomTab={setActiveBottomTab} 
          />
        </div>
      </div>
    </div>
  );
}

export default App;