import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, TrendingDown, BarChart3, Activity, 
  MousePointer, Minus, Square, Circle, Triangle,
  PenTool, Ruler, RotateCcw, Save, Download,
  Play, Pause, Zap, Target
} from 'lucide-react';

const LiveChart = ({ symbol, data, onTimeframeChange, onChartTypeChange }) => {
  const canvasRef = useRef(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState('1D');
  const [selectedChartType, setSelectedChartType] = useState('candlestick');
  const [selectedTool, setSelectedTool] = useState('cursor');
  const [isLive, setIsLive] = useState(true);
  const [drawings, setDrawings] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState(null);
  const [currentDrawing, setCurrentDrawing] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [liveUpdateInterval, setLiveUpdateInterval] = useState(null);

  const timeframes = [
    { id: '1m', label: '1m' },
    { id: '5m', label: '5m' },
    { id: '15m', label: '15m' },
    { id: '30m', label: '30m' },
    { id: '1H', label: '1H' },
    { id: '4H', label: '4H' },
    { id: '1D', label: '1D' },
    { id: '1W', label: '1W' },
    { id: '1M', label: '1M' }
  ];

  const chartTypes = [
    { id: 'candlestick', label: 'Candlestick', icon: BarChart3 },
    { id: 'line', label: 'Line', icon: TrendingUp },
    { id: 'area', label: 'Area', icon: Activity }
  ];

  const drawingTools = [
    { id: 'cursor', label: 'Cursor', icon: MousePointer },
    { id: 'line', label: 'Line', icon: Minus },
    { id: 'rectangle', label: 'Rectangle', icon: Square },
    { id: 'circle', label: 'Circle', icon: Circle },
    { id: 'triangle', label: 'Triangle', icon: Triangle },
    { id: 'text', label: 'Text', icon: PenTool }
  ];

  // Initialize chart data
  useEffect(() => {
    if (data && data.length > 0) {
      setChartData([...data]);
    }
  }, [data]);

  // Live data updates
  useEffect(() => {
    if (isLive) {
      const interval = setInterval(() => {
        setChartData(prevData => {
          if (prevData.length === 0) return prevData;
          
          const newData = [...prevData];
          const lastIndex = newData.length - 1;
          const lastCandle = newData[lastIndex];
          
          // Update the last candle with new price
          const priceChange = (Math.random() - 0.5) * 2;
          const newPrice = lastCandle.close + priceChange;
          
          newData[lastIndex] = {
            ...lastCandle,
            close: newPrice,
            high: Math.max(lastCandle.high, newPrice),
            low: Math.min(lastCandle.low, newPrice),
            volume: lastCandle.volume + Math.floor(Math.random() * 1000)
          };
          
          return newData;
        });
      }, 1000); // Update every second
      
      setLiveUpdateInterval(interval);
      
      return () => {
        if (interval) clearInterval(interval);
      };
    } else {
      if (liveUpdateInterval) {
        clearInterval(liveUpdateInterval);
        setLiveUpdateInterval(null);
      }
    }
  }, [isLive]);

  // Canvas drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || chartData.length === 0) return;

    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    
    // Set canvas size
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    
    // Clear canvas
    ctx.fillStyle = '#1F2937';
    ctx.fillRect(0, 0, rect.width, rect.height);
    
    // Calculate chart dimensions
    const padding = 60;
    const chartWidth = rect.width - 2 * padding;
    const chartHeight = rect.height - 2 * padding;
    
    // Find price range
    const prices = chartData.flatMap(d => [d.high, d.low]);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceRange = maxPrice - minPrice;
    
    // Helper functions
    const getX = (index) => padding + (index / (chartData.length - 1)) * chartWidth;
    const getY = (price) => padding + ((maxPrice - price) / priceRange) * chartHeight;
    
    // Draw grid
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 1;
    
    // Horizontal grid lines
    for (let i = 0; i <= 10; i++) {
      const y = padding + (i / 10) * chartHeight;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(padding + chartWidth, y);
      ctx.stroke();
      
      // Price labels
      const price = maxPrice - (i / 10) * priceRange;
      ctx.fillStyle = '#9CA3AF';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(price.toFixed(2), padding - 10, y + 4);
    }
    
    // Vertical grid lines
    for (let i = 0; i <= 10; i++) {
      const x = padding + (i / 10) * chartWidth;
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, padding + chartHeight);
      ctx.stroke();
    }
    
    // Draw chart based on type
    if (selectedChartType === 'candlestick') {
      drawCandlesticks(ctx, chartData, getX, getY);
    } else if (selectedChartType === 'line') {
      drawLine(ctx, chartData, getX, getY);
    } else if (selectedChartType === 'area') {
      drawArea(ctx, chartData, getX, getY, rect.height - padding);
    }
    
    // Draw drawings
    drawings.forEach(drawing => {
      drawShape(ctx, drawing);
    });
    
    // Draw current drawing
    if (currentDrawing) {
      drawShape(ctx, currentDrawing, true);
    }
    
  }, [chartData, selectedChartType, drawings, currentDrawing]);

  const drawCandlesticks = (ctx, data, getX, getY) => {
    const candleWidth = Math.max(2, (canvasRef.current.getBoundingClientRect().width - 120) / data.length - 2);
    
    data.forEach((candle, index) => {
      const x = getX(index);
      const openY = getY(candle.open);
      const closeY = getY(candle.close);
      const highY = getY(candle.high);
      const lowY = getY(candle.low);
      
      const isGreen = candle.close >= candle.open;
      const color = isGreen ? '#22C55E' : '#EF4444';
      
      // Draw wick
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, highY);
      ctx.lineTo(x, lowY);
      ctx.stroke();
      
      // Draw body
      const bodyHeight = Math.abs(closeY - openY);
      const bodyY = Math.min(openY, closeY);
      
      if (isGreen) {
        ctx.fillStyle = color;
        ctx.fillRect(x - candleWidth/2, bodyY, candleWidth, bodyHeight || 1);
      } else {
        ctx.fillStyle = color;
        ctx.fillRect(x - candleWidth/2, bodyY, candleWidth, bodyHeight || 1);
      }
      
      // Border for hollow candles
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.strokeRect(x - candleWidth/2, bodyY, candleWidth, bodyHeight || 1);
    });
  };

  const drawLine = (ctx, data, getX, getY) => {
    ctx.strokeStyle = '#3B82F6';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    data.forEach((point, index) => {
      const x = getX(index);
      const y = getY(point.close);
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    
    ctx.stroke();
  };

  const drawArea = (ctx, data, getX, getY, bottomY) => {
    const gradient = ctx.createLinearGradient(0, 0, 0, bottomY);
    gradient.addColorStop(0, 'rgba(59, 130, 246, 0.4)');
    gradient.addColorStop(1, 'rgba(59, 130, 246, 0.1)');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    
    // Start from bottom left
    ctx.moveTo(getX(0), bottomY);
    
    // Draw the line
    data.forEach((point, index) => {
      const x = getX(index);
      const y = getY(point.close);
      ctx.lineTo(x, y);
    });
    
    // Close the path to bottom right
    ctx.lineTo(getX(data.length - 1), bottomY);
    ctx.fill();
    
    // Draw the line on top
    ctx.strokeStyle = '#3B82F6';
    ctx.lineWidth = 2;
    ctx.beginPath();
    data.forEach((point, index) => {
      const x = getX(index);
      const y = getY(point.close);
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();
  };

  const drawShape = (ctx, drawing, isTemp = false) => {
    ctx.strokeStyle = isTemp ? '#FBBF24' : '#3B82F6';
    ctx.lineWidth = 2;
    
    switch (drawing.type) {
      case 'line':
        ctx.beginPath();
        ctx.moveTo(drawing.start.x, drawing.start.y);
        ctx.lineTo(drawing.end.x, drawing.end.y);
        ctx.stroke();
        break;
        
      case 'rectangle':
        const width = drawing.end.x - drawing.start.x;
        const height = drawing.end.y - drawing.start.y;
        ctx.strokeRect(drawing.start.x, drawing.start.y, width, height);
        break;
        
      case 'circle':
        const radius = Math.sqrt(
          Math.pow(drawing.end.x - drawing.start.x, 2) + 
          Math.pow(drawing.end.y - drawing.start.y, 2)
        );
        ctx.beginPath();
        ctx.arc(drawing.start.x, drawing.start.y, radius, 0, 2 * Math.PI);
        ctx.stroke();
        break;
    }
  };

  const handleCanvasMouseDown = (e) => {
    if (selectedTool === 'cursor') return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setStartPoint({ x, y });
    setIsDrawing(true);
  };

  const handleCanvasMouseMove = (e) => {
    if (!isDrawing || selectedTool === 'cursor') return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setCurrentDrawing({
      type: selectedTool,
      start: startPoint,
      end: { x, y }
    });
  };

  const handleCanvasMouseUp = (e) => {
    if (!isDrawing || selectedTool === 'cursor') return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newDrawing = {
      type: selectedTool,
      start: startPoint,
      end: { x, y },
      id: Date.now()
    };
    
    setDrawings(prev => [...prev, newDrawing]);
    setCurrentDrawing(null);
    setIsDrawing(false);
    setStartPoint(null);
  };

  const handleTimeframeChange = (timeframe) => {
    setSelectedTimeframe(timeframe);
    onTimeframeChange?.(timeframe);
  };

  const handleChartTypeChange = (chartType) => {
    setSelectedChartType(chartType);
    onChartTypeChange?.(chartType);
  };

  const clearDrawings = () => {
    setDrawings([]);
    setCurrentDrawing(null);
  };

  return (
    <div className="bg-gray-900 flex-1 flex flex-col">
      {/* Chart Toolbar */}
      <div className="border-b border-gray-700 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          {/* Timeframes */}
          <div className="flex items-center space-x-2">
            {timeframes.map((tf) => (
              <button
                key={tf.id}
                onClick={() => handleTimeframeChange(tf.id)}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  selectedTimeframe === tf.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                {tf.label}
              </button>
            ))}
          </div>

          {/* Chart Types */}
          <div className="flex items-center space-x-2">
            {chartTypes.map((ct) => {
              const Icon = ct.icon;
              return (
                <button
                  key={ct.id}
                  onClick={() => handleChartTypeChange(ct.id)}
                  className={`p-2 rounded transition-colors ${
                    selectedChartType === ct.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                  title={ct.label}
                >
                  <Icon size={16} />
                </button>
              );
            })}
          </div>

          {/* Live Toggle */}
          <button
            onClick={() => setIsLive(!isLive)}
            className={`flex items-center space-x-2 px-3 py-2 rounded transition-colors ${
              isLive
                ? 'bg-green-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {isLive ? <Pause size={16} /> : <Play size={16} />}
            <span>{isLive ? 'Live' : 'Paused'}</span>
            {isLive && <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>}
          </button>
        </div>

        {/* Drawing Tools */}
        <div className="flex items-center space-x-2">
          {drawingTools.map((tool) => {
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

          <div className="border-l border-gray-700 pl-2 ml-2">
            <button 
              onClick={clearDrawings}
              className="p-2 rounded text-gray-400 hover:text-white hover:bg-gray-800"
              title="Clear Drawings"
            >
              <RotateCcw size={16} />
            </button>
            <button className="p-2 rounded text-gray-400 hover:text-white hover:bg-gray-800">
              <Save size={16} />
            </button>
            <button className="p-2 rounded text-gray-400 hover:text-white hover:bg-gray-800">
              <Download size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="flex-1 p-4">
        <canvas
          ref={canvasRef}
          className="w-full h-full rounded-lg cursor-crosshair"
          onMouseDown={handleCanvasMouseDown}
          onMouseMove={handleCanvasMouseMove}
          onMouseUp={handleCanvasMouseUp}
          style={{ cursor: selectedTool === 'cursor' ? 'default' : 'crosshair' }}
        />
      </div>

      {/* Chart Info */}
      <div className="border-t border-gray-700 p-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <span className="text-gray-400">Symbol: <span className="text-white">{symbol}</span></span>
            <span className="text-gray-400">Type: <span className="text-white">{selectedChartType}</span></span>
            <span className="text-gray-400">Timeframe: <span className="text-white">{selectedTimeframe}</span></span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-400">Drawings: <span className="text-white">{drawings.length}</span></span>
            <span className="text-gray-400">Tool: <span className="text-white">{selectedTool}</span></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveChart;