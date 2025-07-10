import React, { useState, useEffect, useRef } from 'react';
import { createChart, ColorType } from 'lightweight-charts';
import { motion } from 'framer-motion';
import { 
  TrendingUp, TrendingDown, BarChart3, Activity, 
  Zap, Target, Layers, Settings, Eye, EyeOff,
  MousePointer, Minus, Square, Circle, Triangle,
  PenTool, Ruler, RotateCcw, Save, Download
} from 'lucide-react';

const AdvancedChart = ({ symbol, data, indicators, onTimeframeChange, onChartTypeChange, onIndicatorToggle }) => {
  const chartContainerRef = useRef();
  const chartRef = useRef();
  const [selectedTimeframe, setSelectedTimeframe] = useState('1D');
  const [selectedChartType, setSelectedChartType] = useState('candlestick');
  const [selectedTool, setSelectedTool] = useState('cursor');
  const [activeIndicators, setActiveIndicators] = useState(['sma20']);
  const [showIndicatorPanel, setShowIndicatorPanel] = useState(false);
  const [showDrawingTools, setShowDrawingTools] = useState(false);
  
  const timeframes = [
    { id: '1m', label: '1m', duration: '1 minute' },
    { id: '5m', label: '5m', duration: '5 minutes' },
    { id: '15m', label: '15m', duration: '15 minutes' },
    { id: '30m', label: '30m', duration: '30 minutes' },
    { id: '1H', label: '1H', duration: '1 hour' },
    { id: '4H', label: '4H', duration: '4 hours' },
    { id: '1D', label: '1D', duration: '1 day' },
    { id: '1W', label: '1W', duration: '1 week' },
    { id: '1M', label: '1M', duration: '1 month' }
  ];

  const chartTypes = [
    { id: 'candlestick', label: 'Candlestick', icon: BarChart3 },
    { id: 'line', label: 'Line', icon: TrendingUp },
    { id: 'area', label: 'Area', icon: Activity },
    { id: 'heikinashi', label: 'Heikin Ashi', icon: Layers },
    { id: 'renko', label: 'Renko', icon: Square },
    { id: 'kagi', label: 'Kagi', icon: Zap }
  ];

  const drawingTools = [
    { id: 'cursor', label: 'Cursor', icon: MousePointer },
    { id: 'line', label: 'Line', icon: Minus },
    { id: 'ray', label: 'Ray', icon: TrendingUp },
    { id: 'rectangle', label: 'Rectangle', icon: Square },
    { id: 'circle', label: 'Circle', icon: Circle },
    { id: 'triangle', label: 'Triangle', icon: Triangle },
    { id: 'arrow', label: 'Arrow', icon: Target },
    { id: 'text', label: 'Text', icon: PenTool },
    { id: 'fibonacci', label: 'Fibonacci', icon: Ruler },
    { id: 'pitchfork', label: 'Pitchfork', icon: Activity }
  ];

  const technicalIndicators = [
    { id: 'sma10', label: 'SMA (10)', category: 'moving_averages', color: '#FF6B6B' },
    { id: 'sma20', label: 'SMA (20)', category: 'moving_averages', color: '#4ECDC4' },
    { id: 'sma50', label: 'SMA (50)', category: 'moving_averages', color: '#45B7D1' },
    { id: 'ema10', label: 'EMA (10)', category: 'moving_averages', color: '#96CEB4' },
    { id: 'ema20', label: 'EMA (20)', category: 'moving_averages', color: '#FFEAA7' },
    { id: 'rsi', label: 'RSI (14)', category: 'momentum', color: '#DDA0DD' },
    { id: 'macd', label: 'MACD', category: 'momentum', color: '#98D8C8' },
    { id: 'bollingerBands', label: 'Bollinger Bands', category: 'volatility', color: '#F7DC6F' },
    { id: 'stochastic', label: 'Stochastic', category: 'momentum', color: '#BB8FCE' },
    { id: 'atr', label: 'ATR (14)', category: 'volatility', color: '#85C1E9' },
    { id: 'williamsR', label: 'Williams %R', category: 'momentum', color: '#F8C471' }
  ];

  // Initialize chart
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: '#1F2937' },
        textColor: '#D1D5DB',
        fontSize: 12,
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
      },
      grid: {
        vertLines: {
          color: '#374151',
          style: 1,
          visible: true,
        },
        horzLines: {
          color: '#374151',
          style: 1,
          visible: true,
        },
      },
      crosshair: {
        mode: 1,
        vertLine: {
          color: '#6B7280',
          width: 1,
          style: 2,
        },
        horzLine: {
          color: '#6B7280',
          width: 1,
          style: 2,
        },
      },
      rightPriceScale: {
        borderColor: '#374151',
        textColor: '#D1D5DB',
      },
      timeScale: {
        borderColor: '#374151',
        textColor: '#D1D5DB',
        timeVisible: true,
        secondsVisible: false,
      },
      watermark: {
        color: '#374151',
        visible: true,
        text: 'MasterTraders',
        fontSize: 24,
        horzAlign: 'left',
        vertAlign: 'bottom',
      },
    });

    chartRef.current = chart;

    // Handle resize
    const resizeObserver = new ResizeObserver(entries => {
      if (entries.length === 0 || entries[0].target !== chartContainerRef.current) return;
      const { width, height } = entries[0].contentRect;
      chart.applyOptions({ width, height });
    });

    resizeObserver.observe(chartContainerRef.current);

    return () => {
      resizeObserver.disconnect();
      chart.remove();
    };
  }, []);

  // Update chart data
  useEffect(() => {
    if (!chartRef.current || !data || data.length === 0) return;

    const chart = chartRef.current;
    
    // Clear existing series safely
    try {
      // Remove all series if the method exists
      if (typeof chart.removeAllSeries === 'function') {
        chart.removeAllSeries();
      }
    } catch (error) {
      console.warn('Error removing series:', error);
    }

    // Convert data to lightweight-charts format
    const chartData = data.map(d => ({
      time: Math.floor(new Date(d.timestamp).getTime() / 1000),
      open: d.open,
      high: d.high,
      low: d.low,
      close: d.close,
      volume: d.volume
    }));

    // Add main series based on chart type
    let mainSeries;
    try {
      if (selectedChartType === 'candlestick') {
        mainSeries = chart.addCandlestickSeries({
          upColor: '#22C55E',
          downColor: '#EF4444',
          borderDownColor: '#EF4444',
          borderUpColor: '#22C55E',
          wickDownColor: '#EF4444',
          wickUpColor: '#22C55E',
          priceFormat: {
            type: 'price',
            precision: 2,
            minMove: 0.01,
          },
        });
        mainSeries.setData(chartData);
      } else if (selectedChartType === 'line') {
        mainSeries = chart.addLineSeries({
          color: '#3B82F6',
          lineWidth: 2,
          priceFormat: {
            type: 'price',
            precision: 2,
            minMove: 0.01,
          },
        });
        const lineData = chartData.map(d => ({ time: d.time, value: d.close }));
        mainSeries.setData(lineData);
      } else if (selectedChartType === 'area') {
        mainSeries = chart.addAreaSeries({
          topColor: 'rgba(59, 130, 246, 0.4)',
          bottomColor: 'rgba(59, 130, 246, 0.1)',
          lineColor: '#3B82F6',
          lineWidth: 2,
          priceFormat: {
            type: 'price',
            precision: 2,
            minMove: 0.01,
          },
        });
        const areaData = chartData.map(d => ({ time: d.time, value: d.close }));
        mainSeries.setData(areaData);
      }

      // Add volume series
      const volumeSeries = chart.addHistogramSeries({
        color: '#6B7280',
        priceFormat: {
          type: 'volume',
        },
        priceScaleId: 'volume',
      });

      chart.priceScale('volume').applyOptions({
        scaleMargins: {
          top: 0.8,
          bottom: 0,
        },
      });

      const volumeData = chartData.map(d => ({
        time: d.time,
        value: d.volume,
        color: d.close >= d.open ? '#22C55E' : '#EF4444'
      }));
      volumeSeries.setData(volumeData);

      // Add indicators
      if (indicators && activeIndicators.length > 0) {
        activeIndicators.forEach(indicatorId => {
          const indicator = technicalIndicators.find(i => i.id === indicatorId);
          if (!indicator || !indicators[indicatorId]) return;

          try {
            const indicatorSeries = chart.addLineSeries({
              color: indicator.color,
              lineWidth: 1,
              priceFormat: {
                type: 'price',
                precision: 2,
                minMove: 0.01,
              },
            });

            let indicatorData = [];
            if (indicatorId.includes('sma') || indicatorId.includes('ema')) {
              indicatorData = indicators[indicatorId].map((value, index) => ({
                time: chartData[chartData.length - indicators[indicatorId].length + index]?.time,
                value: value
              })).filter(d => d.time && d.value);
            }

            if (indicatorData.length > 0) {
              indicatorSeries.setData(indicatorData);
            }
          } catch (error) {
            console.warn('Error adding indicator:', error);
          }
        });
      }

      // Fit content
      chart.timeScale().fitContent();

    } catch (error) {
      console.error('Error updating chart:', error);
    }

  }, [data, indicators, selectedChartType, activeIndicators]);

  const handleTimeframeChange = (timeframe) => {
    setSelectedTimeframe(timeframe);
    onTimeframeChange?.(timeframe);
  };

  const handleChartTypeChange = (chartType) => {
    setSelectedChartType(chartType);
    onChartTypeChange?.(chartType);
  };

  const handleIndicatorToggle = (indicatorId) => {
    const newActiveIndicators = activeIndicators.includes(indicatorId)
      ? activeIndicators.filter(id => id !== indicatorId)
      : [...activeIndicators, indicatorId];
    
    setActiveIndicators(newActiveIndicators);
    onIndicatorToggle?.(newActiveIndicators);
  };

  const handleToolSelect = (tool) => {
    setSelectedTool(tool);
    // Tool selection logic would be implemented here
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

          {/* Indicators Button */}
          <button
            onClick={() => setShowIndicatorPanel(!showIndicatorPanel)}
            className={`flex items-center space-x-2 px-3 py-2 rounded transition-colors ${
              showIndicatorPanel
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            <Activity size={16} />
            <span>Indicators</span>
          </button>
        </div>

        {/* Drawing Tools */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowDrawingTools(!showDrawingTools)}
            className={`p-2 rounded transition-colors ${
              showDrawingTools
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            <PenTool size={16} />
          </button>

          {drawingTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <button
                key={tool.id}
                onClick={() => handleToolSelect(tool.id)}
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
            <button className="p-2 rounded text-gray-400 hover:text-white hover:bg-gray-800">
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

      {/* Indicator Panel */}
      {showIndicatorPanel && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="border-b border-gray-700 p-4 bg-gray-800"
        >
          <h4 className="text-white font-medium mb-3">Technical Indicators</h4>
          <div className="grid grid-cols-4 gap-2">
            {technicalIndicators.map((indicator) => (
              <button
                key={indicator.id}
                onClick={() => handleIndicatorToggle(indicator.id)}
                className={`flex items-center space-x-2 p-2 rounded text-sm transition-colors ${
                  activeIndicators.includes(indicator.id)
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: indicator.color }}
                ></div>
                <span>{indicator.label}</span>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Chart Container */}
      <div className="flex-1 p-4">
        <div 
          ref={chartContainerRef} 
          className="w-full h-full rounded-lg"
        />
      </div>
    </div>
  );
};

export default AdvancedChart;