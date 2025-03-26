import React, { useEffect, useRef, useState } from 'react';
import { AreaSeries, createChart, ColorType } from 'lightweight-charts';
import { Button } from 'react-bootstrap';
import {TimeInterval, Timespan, transformStockData} from '../../stockUtils.js';
import {getStockAggregateData} from "../../api.js";
import {chartConfig} from "./chartConfig.js";

export const ChartComponent = ({ selectedTicker, style }) => {


    const [timeInterval, setTimeInterval] = useState(TimeInterval.M15);
    const [data, setData] = useState([]);
    const chartContainerRef = useRef();
    const chartRef = useRef(null);
    const seriesRef = useRef(null);

    // Pobieranie danych giełdowych przy zmianie ticker lub timeInterval
    useEffect(() => {
        if (!selectedTicker) return;

        getStockAggregateData(selectedTicker, timeInterval, true, 'asc', 50000)
            .then(response => {
                console.log(response);
                const dataArray = transformStockData(response.data.data.results);
                console.log('Transformed data: ', dataArray);
                setData(dataArray);
            })
            .catch(err => {
                console.error(err);
            });
    }, [selectedTicker, timeInterval]);

    // Inicjalizacja wykresu
    useEffect(() => {
        const container = chartContainerRef.current;
        if (!container) return;

        const initialTimeScale = {
            fixLeftEdge: true,
            fixRightEdge: true,
            timeVisible: [Timespan.MINUTE, Timespan.HOUR, Timespan.DAY].includes(timeInterval.timespan),
            secondsVisible: false,
        };

        const chart = createChart(container, {
            timeScale: initialTimeScale,
            width: container.clientWidth,
            height: container.clientHeight,
        });
        chart.applyOptions(chartConfig.chartOptions);
        chartRef.current = chart;

        const newSeries = chart.addSeries(AreaSeries, chartConfig.seriesOptions.AreaSeries);
        newSeries.setData(data);
        seriesRef.current = newSeries;
        chart.timeScale().fitContent();

        const handleResize = () => {
            chart.applyOptions({ width: container.clientWidth });
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            chart.remove();
        };
    }, []);
    // Aktualizacja danych serii po pobraniu nowych danych
    useEffect(() => {
        if (seriesRef.current && data.length) {
            seriesRef.current.setData(data);
        }
    }, [data]);

    return (
        <div>
            <div style={{ marginBottom: '10px' }}>
                <Button onClick={() => setTimeInterval(TimeInterval.M1)}>M1</Button>
                <Button onClick={() => setTimeInterval(TimeInterval.M5)}>M5</Button>
                <Button onClick={() => setTimeInterval(TimeInterval.M15)}>M15</Button>
                <Button onClick={() => setTimeInterval(TimeInterval.H1)}>H1</Button>
                <Button onClick={() => setTimeInterval(TimeInterval.W1)}>W1</Button>
                <Button onClick={() => setTimeInterval(TimeInterval.D1)}>D1</Button>
                <Button onClick={() => setTimeInterval(TimeInterval.W1)}>W1</Button>
                <Button onClick={() => setTimeInterval(TimeInterval.MN1)}>MN1</Button>
                <Button onClick={() => setTimeInterval(TimeInterval.Y1)}>Y1</Button>
            </div>
            <div ref={chartContainerRef} style={style} />
        </div>
    );
};
