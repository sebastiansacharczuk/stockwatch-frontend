import React, { useEffect, useRef, useState } from 'react';
import { AreaSeries, BarSeries, BaselineSeries, CandlestickSeries, LineSeries, createChart } from 'lightweight-charts';
import { Button, Dropdown, DropdownButton, Form } from 'react-bootstrap';
import { TimeInterval, transformStockData } from './chartUtils.js';
import { getStockAggregateData } from '../../api.js';
import { chartConfig } from './chartConfig.js';

export const ChartComponent = ({ selectedTicker, style, watchlist }) => {
    const [timeInterval, setTimeInterval] = useState(TimeInterval.M15);
    const [tickersData, setTickersData] = useState({});
    const [selectedTickers, setSelectedTickers] = useState([]); // Stores { ticker, lineColor } objects
    const [fetchInterval, setFetchInterval] = useState(300000);
    const [chartType, setChartType] = useState('Area');
    const [showAverage, setShowAverage] = useState(false); // State to toggle average line
    const chartTypes = ['Area', 'Line', 'Candlestick', 'Bar', 'Baseline'];
    const chartContainerRef = useRef();
    const chartRef = useRef(null);
    const seriesRefs = useRef({});
    const averageSeriesRef = useRef(null); // Ref for the average series

    // Generate random color
    const generateRandomColor = () => {
        return {
            lineColor: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 1)`,
        };
    };

    // Initialize selected tickers when prop changes
    useEffect(() => {
        if (selectedTicker && !selectedTickers.some(t => t.ticker === selectedTicker)) {
            setSelectedTickers([{ ticker: selectedTicker, ...generateRandomColor() }]);
        }
    }, [selectedTicker]);

    // Fetch stock data for all selected tickers
    const fetchStockData = async () => {
        if (!selectedTickers.length) return;

        const promises = selectedTickers.map(({ ticker }) =>
            getStockAggregateData(ticker, timeInterval, true, 'asc', 50000)
                .then(response => {
                    const transformedData = transformStockData(response.data.data.results);
                    console.log(`Stock data for ${ticker}:`, response);
                    console.log(`Transformed data for ${ticker}:`, transformedData);
                    return { ticker, data: transformedData };
                })
                .catch(err => {
                    console.error(`Error fetching stock data for ${ticker}:`, err);
                    return { ticker, data: [] };
                })
        );

        const results = await Promise.all(promises);
        const newData = results.reduce((acc, { ticker, data }) => {
            acc[ticker] = data;
            return acc;
        }, {});
        setTickersData(prev => ({ ...prev, ...newData }));
    };

    // Set up interval for fetching data
    useEffect(() => {
        fetchStockData();
        const timer = setInterval(() => {
            console.log("Fetching data at interval:", fetchInterval);
            fetchStockData();
        }, fetchInterval);

        return () => clearInterval(timer);
    }, [selectedTickers, timeInterval, fetchInterval]);

    // Initialize chart
    useEffect(() => {
        const container = chartContainerRef.current;
        if (!container) return;

        const chart = createChart(container, {
            ...chartConfig.chartOptions,
            width: container.clientWidth,
            height: container.clientHeight,
            timeScale: {
                fixLeftEdge: true,
                fixRightEdge: true,
                timeVisible: [TimeInterval.M15, TimeInterval.H1, TimeInterval.D1].includes(timeInterval),
                secondsVisible: false,
            },
        });

        chartRef.current = chart;

        const handleResize = () => {
            chart.resize(container.clientWidth, container.clientHeight);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            chart.remove();
        };
    }, []);

    // Function to calculate average stock data
    const calculateAverageStockData = (tickersData, selectedTickers) => {
        if (!selectedTickers.length || Object.keys(tickersData).length === 0) {
            return [];
        }

        // Get all unique timestamps across all selected tickers
        const allTimestamps = new Set();
        selectedTickers.forEach(({ ticker }) => {
            const data = tickersData[ticker] || [];
            data.forEach(point => allTimestamps.add(point.time));
        });

        // Sort timestamps (data is sorted, but this ensures consistency)
        const timestamps = Array.from(allTimestamps).sort((a, b) => a - b);

        // Minimum number of tickers required to include a timestamp in the average
        const minTickers = Math.ceil(selectedTickers.length / 2); // At least half of the tickers

        // Calculate average for each timestamp
        const avgData = timestamps.map(time => {
            let sum = 0;
            let count = 0;

            selectedTickers.forEach(({ ticker }) => {
                const data = tickersData[ticker] || [];
                const point = data.find(p => p.time === time);
                if (point) {
                    if (point.value !== undefined) { // Line/Area series
                        sum += point.value;
                        count++;
                    } else if (point.close !== undefined) { // Candlestick/Bar series
                        sum += point.close;
                        count++;
                    }
                }
            });

            // Only include points with data from at least minTickers
            return count >= minTickers ? { time, value: sum / count } : null;
        }).filter(point => point !== null);

        return avgData;
    };

    // Update chart series when tickersData, chartType, or showAverage changes
    useEffect(() => {
        if (!chartRef.current) return;

        const chart = chartRef.current;

        // Remove all existing series
        Object.keys(seriesRefs.current).forEach(ticker => {
            chart.removeSeries(seriesRefs.current[ticker]);
            delete seriesRefs.current[ticker];
        });

        // Remove existing average series if it exists
        if (averageSeriesRef.current) {
            chart.removeSeries(averageSeriesRef.current);
            averageSeriesRef.current = null;
        }

        // Map chart type to series constructor
        const seriesConstructors = {
            Area: AreaSeries,
            Line: LineSeries,
            Candlestick: CandlestickSeries,
            Bar: BarSeries,
            Baseline: BaselineSeries,
        };

        const SeriesType = seriesConstructors[chartType];

        // Add or update series for each ticker
        selectedTickers.forEach(({ ticker, lineColor }) => {
            const data = tickersData[ticker] || [];
            let seriesOptions;

            switch (chartType) {
                case 'Area':
                    seriesOptions = {
                        ...chartConfig.seriesOptions.AreaSeries,
                        lineColor: lineColor,
                        topColor: lineColor,
                        bottomColor: 'rgba(0, 0, 0, 0)',
                    };
                    break;
                case 'Line':
                    seriesOptions = {
                        ...chartConfig.seriesOptions.LineSeries,
                        color: lineColor,
                        lineWidth: 2,
                    };
                    break;
                case 'Baseline':
                    seriesOptions = {
                        ...chartConfig.seriesOptions.BaselineSeries,
                        topLineColor: lineColor,
                        topFillColor1: lineColor,
                        topFillColor2: lineColor,
                        bottomLineColor: lineColor,
                        bottomFillColor1: lineColor,
                        bottomFillColor2: lineColor,
                    };
                    break;
                case 'Candlestick':
                    seriesOptions = {
                        ...chartConfig.seriesOptions.CandlestickSeries,
                        upColor: lineColor,
                        borderUpColor: lineColor,
                        wickUpColor: lineColor,
                        downColor: lineColor,
                        borderDownColor: lineColor,
                        wickDownColor: lineColor,
                    };
                    break;
                case 'Bar':
                    seriesOptions = {
                        ...chartConfig.seriesOptions.BarSeries,
                        upColor: lineColor,
                        downColor: lineColor,
                    };
                    break;
                default:
                    seriesOptions = chartConfig.seriesOptions.AreaSeries;
            }

            const series = chart.addSeries(SeriesType, seriesOptions);
            series.setData(data);
            seriesRefs.current[ticker] = series;
        });

        // Add average series only if showAverage is true
        if (showAverage) {
            const avgData = calculateAverageStockData(tickersData, selectedTickers);
            if (avgData.length > 0) {
                const avgSeries = chart.addSeries(LineSeries, chartConfig.seriesOptions.AvgSeries);
                avgSeries.setData(avgData);
                averageSeriesRef.current = avgSeries;
            }
        }

        chart.priceScale();
    }, [tickersData, selectedTickers, chartType, showAverage]);

    // Handle ticker selection toggle
    const handleCheckboxChange = (ticker) => {
        setSelectedTickers(prev => {
            if (prev.some(t => t.ticker === ticker)) {
                return prev.filter(t => t.ticker !== ticker);
            } else {
                return [...prev, { ticker, ...generateRandomColor() }];
            }
        });
    };

    // Change fetch interval
    const changeInterval = (newInterval) => {
        if (newInterval > 0) {
            setFetchInterval(newInterval);
        } else {
            console.log("Please provide a valid interval greater than 0.");
        }
    };

    // Toggle average line visibility
    const toggleAverageLine = () => {
        setShowAverage(prev => !prev);
    };

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <DropdownButton title=" + " autoClose="outside" style={{ marginRight: '10px' }}>
                    <Dropdown.Menu>
                        {watchlist.items.map((item, index) => (
                            <Form.Check
                                key={`watchlist-${index}`}
                                className="mb-3"
                                type="checkbox"
                                id={`watchlist-${index}`}
                                label={item.ticker}
                                checked={selectedTickers.some(t => t.ticker === item.ticker)}
                                onChange={() => handleCheckboxChange(item.ticker)}
                            />
                        ))}
                    </Dropdown.Menu>
                </DropdownButton>

                {Object.entries(TimeInterval).map(([key, value]) => (
                    <Button
                        key={key}
                        variant={timeInterval === value ? 'primary' : 'outline-primary'}
                        onClick={() => setTimeInterval(value)}
                        style={{ margin: '0 5px' }}
                    >
                        {key}
                    </Button>
                ))}
                <Button
                    variant={fetchInterval === 1000 ? 'primary' : 'outline-primary'}
                    onClick={() => changeInterval(1000)}
                    style={{ margin: '0 5px' }}
                >
                    1s
                </Button>
                <Button
                    variant={fetchInterval === 5000 ? 'primary' : 'outline-primary'}
                    onClick={() => changeInterval(5000)}
                    style={{ margin: '0 5px' }}
                >
                    5s
                </Button>
                <DropdownButton
                    title={chartType}
                    style={{ marginLeft: '10px' }}
                >
                    <Dropdown.Menu>
                        {chartTypes.map(type => (
                            <Dropdown.Item
                                key={type}
                                active={chartType === type}
                                onClick={() => setChartType(type)}
                            >
                                {type}
                            </Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
                </DropdownButton>
                <Button
                    variant={showAverage ? 'primary' : 'outline-primary'}
                    onClick={toggleAverageLine}
                    style={{ marginLeft: '10px' }}
                >
                    AVG
                </Button>
            </div>

            {/* Display selected tickers with their colors */}
            <div style={{ marginBottom: '10px' }}>
                {selectedTickers.map(({ ticker, lineColor }) => (
                    <span
                        key={ticker}
                        style={{
                            marginRight: '10px',
                            color: lineColor,
                            fontWeight: 'bold',
                        }}
                    >
                        {ticker}
                    </span>
                ))}
            </div>

            <div ref={chartContainerRef} style={style} />
        </div>
    );
};