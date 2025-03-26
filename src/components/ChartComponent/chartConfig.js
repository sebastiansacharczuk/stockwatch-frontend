// chartConfig.js

// Domyślne kolory dla ciemnego motywu
const defaultColors = {
    backgroundColor: '#1E1E1E', // Ciemny szary/czarny
    textColor: '#D9D9D9', // Jasny szary dla tekstu
    lineColor: '#42A5F5', // Jasnoniebieski dla linii
    areaTopColor: '#42A5F5', // Jasnoniebieski dla górnego obszaru
    areaBottomColor: 'rgba(66, 165, 245, 0.28)', // Półprzezroczysty niebieski
    baselineTopLineColor: '#66BB6A', // Zielony dla górnej linii bazowej
    baselineTopAreaColor: 'rgba(102, 187, 106, 0.28)', // Półprzezroczysty zielony
    baselineBottomLineColor: '#EF5350', // Czerwony dla dolnej linii bazowej
    baselineBottomAreaColor: 'rgba(239, 83, 80, 0.28)', // Półprzezroczysty czerwony
    upColor: '#26A69A', // Turkusowy dla rosnących świec/słupków
    downColor: '#EF5350', // Czerwony dla malejących świec/słupków
    borderColor: '#757575', // Szary dla obramowania świec/słupków
};

// Opcje ogólne dla wykresu
const chartOptions = {
    layout: {
        background: { type: 'solid', color: defaultColors.backgroundColor },
        textColor: defaultColors.textColor,
    },
    timeScale: {
        fixLeftEdge: true,
        fixRightEdge: true,
        timeVisible: true,
        secondsVisible: false,
    },
    priceScale: {
        autoScale: true,
        borderVisible: true,
        borderColor: '#424242', // Ciemniejszy szary dla obramowania osi
    },
    grid: {
        vertLines: { color: 'rgba(255, 255, 255, 0.1)', style: 1 }, // Bardzo subtelny biały
        horzLines: { color: 'rgba(255, 255, 255, 0.1)', style: 1 },
    },
    crosshair: {
        mode: 0,
        vertLine: { color: '#B0BEC5', width: 1, style: 1 }, // Jasnoszary dla krzyżowego wskaźnika
        horzLine: { color: '#B0BEC5', width: 1, style: 1 },
    },
    localization: {
        priceFormatter: price => price.toFixed(2),
    },
    handleScroll: {
        mouseWheel: true,
        pressedMouseMove: true,
    },
    handleScale: {
        axisPressedMouseMove: true,
        mouseWheel: true,
        pinch: true,
    },
};

// Opcje dla różnych typów serii
const seriesOptions = {
    AreaSeries: {
        lineColor: defaultColors.lineColor,
        topColor: defaultColors.areaTopColor,
        bottomColor: defaultColors.areaBottomColor,
        lineStyle: 0,
        lineWidth: 2,
    },
    BaselineSeries: {
        baseValue: { type: 'price', price: 0 },
        topLineColor: defaultColors.baselineTopLineColor,
        topFillColor1: defaultColors.baselineTopAreaColor,
        topFillColor2: defaultColors.baselineTopAreaColor,
        bottomLineColor: defaultColors.baselineBottomLineColor,
        bottomFillColor1: defaultColors.baselineBottomAreaColor,
        bottomFillColor2: defaultColors.baselineBottomAreaColor,
        lineWidth: 2,
    },
    CandlestickSeries: {
        upColor: defaultColors.upColor,
        downColor: defaultColors.downColor,
        borderVisible: true,
        borderUpColor: defaultColors.borderColor,
        borderDownColor: defaultColors.borderColor,
        wickVisible: true,
        wickUpColor: defaultColors.upColor,
        wickDownColor: defaultColors.downColor,
    },
    BarSeries: {
        upColor: defaultColors.upColor,
        downColor: defaultColors.downColor,
        openVisible: true,
        thinBars: true,
    },
};

// Eksportowanie konfiguracji
export const chartConfig = {
    chartOptions,
    seriesOptions,
};