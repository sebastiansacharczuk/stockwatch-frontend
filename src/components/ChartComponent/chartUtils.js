export const Timespan = Object.freeze({
    MINUTE: "minute",
    HOUR: "hour",
    DAY: "day",
    WEEK: "week",
    MONTH: "month",
});

export const TimeInterval = Object.freeze({
    M1: { timespan: Timespan.MINUTE, multiplier: 1 },
    M5: { timespan: Timespan.MINUTE, multiplier: 5 },
    M15: { timespan: Timespan.MINUTE, multiplier: 15 },
    H1: { timespan: Timespan.HOUR, multiplier: 1 },
    D1: { timespan: Timespan.DAY, multiplier: 1 },
    W1: { timespan: Timespan.WEEK, multiplier: 1 },
    MN1: { timespan: Timespan.MONTH, multiplier: 1 },
});

export const MultiChartColors = [
    "red",
    "green",
    "blue",
    "yellow",
    "purple",
    "pink",
    "brown",
    "orange",
    "white"
];


export const SeriesType = Object.freeze({
    CANDLESTICK: "candlestick",
    LINE: "line",
    AREA: "area",
    BAR: "bar"
});

const MILLISECONDS_IN_A_DAY = 86400000;
const currentTimestamp = Date.now();

function calculateFromTimestamp(timeInterval) {
    let offsetInSeconds; // Deklaracja zmiennej

    switch (timeInterval.timespan) {
        case Timespan.MINUTE:
            offsetInSeconds = MILLISECONDS_IN_A_DAY * 4;
            break;
        case Timespan.HOUR:
            offsetInSeconds = MILLISECONDS_IN_A_DAY * 4 * 60;
            break;
        case Timespan.DAY:
            offsetInSeconds = MILLISECONDS_IN_A_DAY * 360 * 2;
            break;
        case Timespan.WEEK:
            offsetInSeconds = MILLISECONDS_IN_A_DAY * 360 * 7;
            break;
        case Timespan.MONTH:
            offsetInSeconds = MILLISECONDS_IN_A_DAY * 360 * 30;
            break;
        case Timespan.YEAR:
            offsetInSeconds = MILLISECONDS_IN_A_DAY * 1800;
            break;
        default:
            throw new Error("Invalid timespan. Use 'day', 'hour', 'week', or 'month'.");
    }

    return currentTimestamp - (offsetInSeconds * timeInterval.multiplier);
}

function timestampToDateString(timestamp) {
    return new Date(timestamp).toISOString().split('T')[0];
}

function transformStockData(dataArray) {
    return dataArray.map(item => ({
        value: item.vw,
        open: item.o,
        close: item.c,
        high: item.h,
        low: item.l,
        time: item.t / 1000,
    }));
}



export { calculateFromTimestamp, currentTimestamp, timestampToDateString, transformStockData };