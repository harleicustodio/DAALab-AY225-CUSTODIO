// =====================================================================
// STATE
// =====================================================================
let globalData = [];
let currentParser = null;
let confirmCallback = null;
let currentInfo = null;
let allColumns = [];
let selectedMetricCol = null;
let selectedXCol = null;
let displayedTableData = [];
let currentSortColumn = null;
let sortAscending = true;

const csvInput = document.getElementById('csv-upload');
const overlay = document.getElementById('loading-overlay');
const notifModal = document.getElementById('notification-modal');
const proceedBtn = document.getElementById('notif-proceed');

const TABLE_MAX_ROWS = 50;
const MAX_PARSED_ROWS = 15000;
const MAX_SCATTER_POINTS = 800;

// Tokens treated as missing / null in source data
// Covers World Bank ".." convention confirmed in EdStatsData
const MISSING_VALUE_TOKENS = new Set([
    '', '.', '..', '...', 'null', 'undefined',
    'n/a', 'na', 'nan', 'nil', 'none', '-', '--'
]);

const MSG_NEEDS_NUMERIC   = 'Mathematical analysis requires continuous numerical data.';
const MSG_NEEDS_PAIRS     = 'Correlation and regression require at least two overlapping numeric rows.';
const MSG_NEEDS_VARIATION = 'Variance is zero — all values are identical. Correlation is undefined.';
const MSG_DIST_POSITIVE   = 'Distribution chart requires at least one positive numeric value.';

// =====================================================================
// PRIMITIVE HELPERS
// =====================================================================

/** Returns true if a raw cell value should be treated as missing. */
function isMissingValue(value) {
    if (value === null || value === undefined) return true;
    if (typeof value === 'number') return !Number.isFinite(value);
    return MISSING_VALUE_TOKENS.has(String(value).trim().toLowerCase());
}

/**
 * Coerces any value to a finite number, or returns null.
 * Handles: actual numbers, numeric strings, comma-formatted numbers.
 * Rejects: Infinity, NaN, World Bank "..", empty strings, etc.
 */
function toFiniteNumber(value) {
    if (value === null || value === undefined) return null;
    if (typeof value === 'number') return Number.isFinite(value) ? value : null;
    const trimmed = String(value).trim();
    if (!trimmed || MISSING_VALUE_TOKENS.has(trimmed.toLowerCase())) return null;
    const parsed = Number(trimmed.replace(/,/g, ''));
    return Number.isFinite(parsed) ? parsed : null;
}

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;')
        .replace(/>/g, '&gt;').replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

/**
 * Format a number compactly for display (1.23M, 456.78K, etc.)
 * Returns '--' for null / non-finite input.
 */
function fmt(value) {
    const n = toFiniteNumber(value);
    if (n === null) return '--';
    if (Math.abs(n) >= 1e12) return (n / 1e12).toFixed(2) + 'T';
    if (Math.abs(n) >= 1e9)  return (n / 1e9).toFixed(2)  + 'B';
    if (Math.abs(n) >= 1e6)  return (n / 1e6).toFixed(2)  + 'M';
    if (Math.abs(n) >= 1e3)  return (n / 1e3).toFixed(2)  + 'K';
    return n.toLocaleString(undefined, { maximumFractionDigits: 4 });
}

/** Yield control back to the browser's paint queue. */
function yieldToBrowser(delay = 0) {
    return new Promise(resolve => requestAnimationFrame(() => setTimeout(resolve, delay)));
}

// =====================================================================
// COLUMN TYPE DETECTION
// =====================================================================

/**
 * Returns 'numeric' if the column has >= 2 finite numeric values,
 * 'categorical' otherwise (text, all-missing, etc.)
 */
function getColumnType(data, columnKey) {
    if (!Array.isArray(data) || !columnKey) return 'categorical';
    let count = 0;
    for (const row of data) {
        if (toFiniteNumber(row?.[columnKey]) !== null) {
            count++;
            if (count >= 2) return 'numeric';
        }
    }
    return 'categorical';
}

function isColumnNumeric(data, columnKey) {
    return getColumnType(data, columnKey) === 'numeric';
}

// =====================================================================
// MATH ENGINE
// =====================================================================

/** Extract all finite numeric values from a column. */
function getColumnNumericValues(data, columnKey) {
    const values = [];
    for (const row of data) {
        const n = toFiniteNumber(row?.[columnKey]);
        if (n !== null) values.push(n);
    }
    return values;
}

/**
 * Collect (x, y) pairs where BOTH columns have finite values.
 * Single correct join point — avoids index-mismatch bugs.
 */
function getNumericPairs(data, xKey, yKey) {
    const pairs = [];
    for (const row of data) {
        const x = toFiniteNumber(row?.[xKey]);
        const y = toFiniteNumber(row?.[yKey]);
        if (x !== null && y !== null) pairs.push({ x, y, row });
    }
    return pairs;
}

function mean(arr) {
    if (!arr.length) return 0;
    return arr.reduce((s, v) => s + v, 0) / arr.length;
}

/**
 * Sample variance (Bessel-corrected, n-1 denominator).
 * Returns 0 for arrays with fewer than 2 values.
 */
function variance(arr) {
    const vals = arr.map(toFiniteNumber).filter(v => v !== null);
    if (vals.length < 2) return 0;
    const avg = mean(vals);
    const sumSq = vals.reduce((s, v) => s + (v - avg) ** 2, 0);
    return sumSq / (vals.length - 1);
}

/**
 * Sample standard deviation (Bessel-corrected, n-1 denominator).
 * Returns 0 for arrays with fewer than 2 values — safe for CV calc.
 */
function stdDev(arr) {
    return Math.sqrt(variance(arr));
}

/**
 * Pearson r from two parallel arrays.
 * Returns null if fewer than 2 valid pairs or if either variable has zero variance.
 * Returning null triggers graceful UI bypass rather than NaN in the DOM.
 */
function pearsonCorr(xArr, yArr) {
    const pairs = [];
    for (let i = 0; i < Math.min(xArr.length, yArr.length); i++) {
        const x = toFiniteNumber(xArr[i]);
        const y = toFiniteNumber(yArr[i]);
        if (x !== null && y !== null) pairs.push({ x, y });
    }
    if (pairs.length < 2) return null;

    const xs = pairs.map(p => p.x);
    const ys = pairs.map(p => p.y);
    const mx = mean(xs);
    const my = mean(ys);

    let cov = 0, ssX = 0, ssY = 0;
    for (const p of pairs) {
        const dx = p.x - mx;
        const dy = p.y - my;
        cov += dx * dy;
        ssX += dx * dx;
        ssY += dy * dy;
    }

    const denom = Math.sqrt(ssX * ssY);
    if (denom <= Number.EPSILON) return null;
    const r = cov / denom;
    return Math.max(-1, Math.min(1, r));
}

/**
 * Ordinary Least Squares linear regression.
 * Returns null when fewer than 2 valid pairs or zero variance in X.
 * r2 is clamped to [0, 1] to absorb floating-point overshoot.
 */
function linearRegression(xArr, yArr) {
    const pairs = [];
    for (let i = 0; i < Math.min(xArr.length, yArr.length); i++) {
        const x = toFiniteNumber(xArr[i]);
        const y = toFiniteNumber(yArr[i]);
        if (x !== null && y !== null) pairs.push({ x, y });
    }
    if (pairs.length < 2) return null;

    const xs = pairs.map(p => p.x);
    const ys = pairs.map(p => p.y);
    const mx = mean(xs);
    const my = mean(ys);

    let ssX = 0, sXY = 0;
    for (const p of pairs) {
        const dx = p.x - mx;
        ssX += dx * dx;
        sXY += dx * (p.y - my);
    }

    if (ssX <= Number.EPSILON) return null;

    const slope     = sXY / ssX;
    const intercept = my - slope * mx;
    const r         = pearsonCorr(xs, ys);
    const r2        = r === null ? null : Math.max(0, Math.min(1, r * r));

    return { slope, intercept, r2, sampleSize: pairs.length };
}

// =====================================================================
// DATASET FORMAT DETECTION
// =====================================================================

function detectDatasetFormat(data) {
    if (!data.length) return { format: 'empty', numericCols: [], categoricalCols: [], labelCol: null, yearCols: [], textCols: [] };

    const columns = Object.keys(data[0]);
    const sample  = data.slice(0, Math.min(400, data.length));

    const colStats = columns.map(column => {
        const values       = sample.map(r => r[column]).filter(v => !isMissingValue(v));
        const numericCount = values.filter(v => toFiniteNumber(v) !== null).length;
        const ratio        = values.length ? numericCount / values.length : 0;
        const isYearCol    = /^\d{4}$/.test(String(column).trim());
        return { column, ratio, numericCount, isYearCol, totalVals: values.length };
    });

    const yearCols          = colStats.filter(s => s.isYearCol && s.ratio > 0.03).map(s => s.column);
    const strongNumericCols = colStats.filter(s => !s.isYearCol && s.ratio > 0.5).map(s => s.column);
    const textCols          = colStats.filter(s => s.ratio < 0.15 && s.totalVals > 0).map(s => s.column);

    if (yearCols.length >= 3) {
        const labelCandidates = textCols.filter(col => {
            const unique = new Set(sample.map(r => r[col]).filter(v => !isMissingValue(v)).map(v => String(v).trim())).size;
            return unique > 1;
        });
        const labelCol = labelCandidates.find(c => /country.?name/i.test(c))
            || labelCandidates.find(c => /indicator.?name/i.test(c))
            || labelCandidates[0] || columns[0];

        const allSelectableCols = [...yearCols, ...textCols.filter(c => c !== labelCol)];
        return { format: 'wide', numericCols: yearCols, categoricalCols: textCols, labelCol, yearCols, textCols, allSelectableCols };
    }

    if (strongNumericCols.length >= 1) {
        const labelCandidates = [...textCols].sort((a, b) =>
            new Set(sample.map(r => r[b])).size - new Set(sample.map(r => r[a])).size
        );
        const labelCol        = labelCandidates[0] || columns[0];
        const categoricalCols = textCols.filter(c => c !== labelCol);
        const allSelectableCols = [...strongNumericCols, ...categoricalCols];
        return { format: 'long', numericCols: strongNumericCols, categoricalCols, labelCol, yearCols: [], textCols, allSelectableCols };
    }

    const categoricalCols = textCols;
    return { format: 'text-only', numericCols: [], categoricalCols, labelCol: null, yearCols: [], textCols, allSelectableCols: textCols };
}

function getRowLabel(row, info) {
    if (info.format === 'wide') {
        const countryCol   = Object.keys(row).find(k => /country.?name/i.test(k));
        const indicatorCol = Object.keys(row).find(k => /indicator.?name/i.test(k));
        if (countryCol && indicatorCol) {
            const country   = isMissingValue(row[countryCol])   ? 'N/A' : String(row[countryCol]).trim();
            const indicator = isMissingValue(row[indicatorCol]) ? 'N/A' : String(row[indicatorCol]).trim().slice(0, 28);
            return `${country} - ${indicator}`;
        }
        if (countryCol && !isMissingValue(row[countryCol])) return String(row[countryCol]).trim();
    }
    const val = row[info.labelCol];
    return !isMissingValue(val) ? String(val).trim().slice(0, 40) : 'N/A';
}

// =====================================================================
// FREQUENCY AGGREGATION (for categorical chart support)
// =====================================================================

/**
 * Build a frequency map {category -> count} from a text column.
 * Missing values are excluded from the tally.
 */
function getCategoryFrequencies(data, columnKey) {
    const freq = new Map();
    for (const row of data) {
        const raw = row?.[columnKey];
        if (isMissingValue(raw)) continue;
        const key = String(raw).trim();
        if (!key) continue;
        freq.set(key, (freq.get(key) || 0) + 1);
    }
    return [...freq.entries()]
        .sort((a, b) => b[1] - a[1])
        .map(([label, count]) => ({ label, count }));
}

// =====================================================================
// SORTING (Timsort via Array.sort + custom comparator)
// =====================================================================

/**
 * Returns a new array sorted by columnKey.
 * Missing values always sink to the bottom regardless of direction.
 * Numeric values use subtraction; strings use localeCompare with
 * { numeric: true } for natural ordering ("Item2" < "Item10").
 * Array.sort() is Timsort: O(n log n) worst-case, adaptive O(n) on
 * nearly-sorted data.
 */
function sortByColumn(data, columnKey, ascending = true) {
    if (!Array.isArray(data) || !columnKey) return [];
    const dir = ascending ? 1 : -1;

    return [...data].sort((a, b) => {
        const rawA = a?.[columnKey];
        const rawB = b?.[columnKey];

        const aMissing = isMissingValue(rawA);
        const bMissing = isMissingValue(rawB);
        if (aMissing && bMissing) return 0;
        if (aMissing) return 1;
        if (bMissing) return -1;

        const nA = toFiniteNumber(rawA);
        const nB = toFiniteNumber(rawB);

        if (nA !== null && nB !== null) return (nA - nB) * dir;
        if (nA !== null) return -1 * dir;
        if (nB !== null) return  1 * dir;

        return String(rawA).trim().toLowerCase()
            .localeCompare(String(rawB).trim().toLowerCase(), undefined, { numeric: true }) * dir;
    });
}

function handleTableSort(columnKey, direction) {
    if (!columnKey) return;
    sortAscending      = direction === 'asc';
    currentSortColumn  = columnKey;
    displayedTableData = sortByColumn(globalData, columnKey, sortAscending);
}

// =====================================================================
// TABLE RENDERER — intentionally empty (explorer tab is blank)
// =====================================================================

function renderExplorerTable(dataToDisplay = globalData, maxRows = TABLE_MAX_ROWS) {
    displayedTableData = Array.isArray(dataToDisplay) ? dataToDisplay : [];
}

// =====================================================================
// CHART HELPERS
// =====================================================================

function updateChart(id, type, labels, datasets, keepRatio = false) {
    const canvas = document.getElementById(id);
    if (!canvas) return;
    const existing = Chart.getChart(id);
    if (existing) existing.destroy();

    canvas.style.opacity = '0.5';
    setTimeout(() => { canvas.style.opacity = '1'; }, 150);

    let scales = {};
    if (type === 'bar') {
        scales = {
            x: { ticks: { maxRotation: 35, font: { size: 10 } } },
            y: { ticks: { callback: v => fmt(v) } }
        };
    } else if (type === 'scatter') {
        scales = {
            x: { type: 'linear', ticks: { callback: v => fmt(v) } },
            y: { type: 'linear', ticks: { callback: v => fmt(v) } }
        };
    }

    new Chart(canvas, {
        type,
        data: { labels, datasets },
        options: {
            maintainAspectRatio: keepRatio,
            responsive: true,
            plugins: {
                legend: { display: type === 'doughnut' },
                tooltip: {
                    callbacks: {
                        label: ctx => {
                            if (type === 'scatter') {
                                return ` (${fmt(ctx.raw?.x)}, ${fmt(ctx.raw?.y)})`;
                            }
                            const v = ctx.parsed?.y ?? ctx.parsed;
                            return typeof v === 'number' ? ` ${fmt(v)}` : ` ${v}`;
                        }
                    }
                }
            },
            scales
        }
    });
}

function showChartPlaceholder(chartId, placeholderId, subtitleId, subtitleText, descId) {
    document.getElementById(subtitleId).innerText = subtitleText;
    document.getElementById(placeholderId).classList.remove('hidden');
    document.getElementById(chartId).classList.add('hidden');
    if (descId) document.getElementById(descId).classList.add('opacity-0');
}

function showChart(chartId, placeholderId) {
    document.getElementById(placeholderId).classList.add('hidden');
    document.getElementById(chartId).classList.remove('hidden');
}

// =====================================================================
// DRAW BAR CHART
// Numeric: top-10 by value. Categorical: top-10 by frequency.
// =====================================================================

function drawBarChart(info, metricCol) {
    const colType = getColumnType(globalData, metricCol);

    if (colType === 'numeric') {
        const validRows = globalData
            .map(row => ({ row, value: toFiniteNumber(row?.[metricCol]) }))
            .filter(item => item.value !== null)
            .sort((a, b) => b.value - a.value)
            .slice(0, 10);

        document.getElementById('bar-subtitle').innerText = `Metric: ${metricCol}`;

        if (!validRows.length) {
            showChartPlaceholder('barChart', 'bar-placeholder', 'bar-subtitle', `No valid values in: ${metricCol}`, 'desc-bar');
            return;
        }
        showChart('barChart', 'bar-placeholder');

        const labels = validRows.map(item => getRowLabel(item.row, info));
        const values = validRows.map(item => item.value);

        updateChart('barChart', 'bar', labels, [{
            label: metricCol,
            data: values,
            backgroundColor: labels.map((_, i) => `rgba(37,99,235,${1 - i * 0.07})`),
            borderRadius: 8
        }]);

        const desc = document.getElementById('desc-bar');
        desc.classList.remove('opacity-0');
        desc.innerHTML = `Top: <span class="highlight">${escapeHtml(labels[0])}</span> with <span class="highlight">${fmt(values[0])}</span>. Top 10 by <em>${escapeHtml(metricCol)}</em> out of ${globalData.length.toLocaleString()} rows.`;

    } else {
        const freqs = getCategoryFrequencies(globalData, metricCol).slice(0, 10);
        document.getElementById('bar-subtitle').innerText = `Category Frequency: ${metricCol}`;

        if (!freqs.length) {
            showChartPlaceholder('barChart', 'bar-placeholder', 'bar-subtitle', `No valid categories in: ${metricCol}`, 'desc-bar');
            return;
        }
        showChart('barChart', 'bar-placeholder');

        const labels = freqs.map(f => f.label);
        const values = freqs.map(f => f.count);

        updateChart('barChart', 'bar', labels, [{
            label: `Count of ${metricCol}`,
            data: values,
            backgroundColor: labels.map((_, i) => `rgba(245,158,11,${1 - i * 0.07})`),
            borderRadius: 8
        }]);

        const desc = document.getElementById('desc-bar');
        desc.classList.remove('opacity-0');
        desc.innerHTML = `Most frequent: <span class="highlight">${escapeHtml(labels[0])}</span> appears <span class="highlight">${values[0].toLocaleString()}x</span> (${((values[0] / globalData.length) * 100).toFixed(1)}% of rows).`;
    }
}

// =====================================================================
// DRAW DOUGHNUT CHART
// Numeric: top-5 by value. Categorical: top-5 by frequency.
// =====================================================================

function drawDoughnut(info, metricCol) {
    const colType = getColumnType(globalData, metricCol);
    const PALETTE = ['#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#131b2e'];

    if (colType === 'numeric') {
        const validRows = globalData
            .map(row => ({ row, value: toFiniteNumber(row?.[metricCol]) }))
            .filter(item => item.value !== null && item.value > 0)
            .sort((a, b) => b.value - a.value);

        document.getElementById('doughnut-subtitle').innerText = `Distribution: ${metricCol}`;

        if (!validRows.length) {
            showChartPlaceholder('doughnutChart', 'doughnut-placeholder', 'doughnut-subtitle', MSG_DIST_POSITIVE, 'desc-doughnut');
            return;
        }
        showChart('doughnutChart', 'doughnut-placeholder');

        const top5      = validRows.slice(0, 5);
        const labels    = top5.map(item => getRowLabel(item.row, info));
        const values    = top5.map(item => item.value);
        const others    = validRows.slice(5);
        const othersSum = others.reduce((s, item) => s + item.value, 0);
        if (others.length && othersSum > 0) { labels.push('Others'); values.push(othersSum); }

        updateChart('doughnutChart', 'doughnut', labels, [{
            data: values, backgroundColor: PALETTE, borderWidth: 2, borderColor: '#fff'
        }], true);

        const total  = values.reduce((s, v) => s + v, 0);
        const topPct = total > 0 ? ((values[0] / total) * 100).toFixed(1) : '0.0';
        const desc   = document.getElementById('desc-doughnut');
        desc.classList.remove('opacity-0');
        desc.innerHTML = `<span class="highlight">${escapeHtml(labels[0])}</span> makes up <span class="highlight">${topPct}%</span> of the visible distribution.`;

    } else {
        const freqs = getCategoryFrequencies(globalData, metricCol);
        document.getElementById('doughnut-subtitle').innerText = `Category Share: ${metricCol}`;

        if (!freqs.length) {
            showChartPlaceholder('doughnutChart', 'doughnut-placeholder', 'doughnut-subtitle', `No valid categories in: ${metricCol}`, 'desc-doughnut');
            return;
        }
        showChart('doughnutChart', 'doughnut-placeholder');

        const top5      = freqs.slice(0, 5);
        const labels    = top5.map(f => f.label);
        const values    = top5.map(f => f.count);
        const othersSum = freqs.slice(5).reduce((s, f) => s + f.count, 0);
        if (othersSum > 0) { labels.push('Others'); values.push(othersSum); }

        updateChart('doughnutChart', 'doughnut', labels, [{
            data: values, backgroundColor: PALETTE, borderWidth: 2, borderColor: '#fff'
        }], true);

        const total  = values.reduce((s, v) => s + v, 0);
        const topPct = total > 0 ? ((values[0] / total) * 100).toFixed(1) : '0.0';
        const desc   = document.getElementById('desc-doughnut');
        desc.classList.remove('opacity-0');
        desc.innerHTML = `<span class="highlight">${escapeHtml(labels[0])}</span> is the most common category at <span class="highlight">${topPct}%</span>.`;
    }
}

// =====================================================================
// DRAW SCATTER PLOT (strictly numeric — no categorical fallback)
// =====================================================================

function drawScatterPlot(info, metricCol, xCol) {
    document.getElementById('scatter-subtitle').innerText = `X: ${xCol}  ->  Y: ${metricCol}`;

    if (!isColumnNumeric(globalData, xCol) || !isColumnNumeric(globalData, metricCol)) {
        showChartPlaceholder('scatterPlot', 'scatter-placeholder', 'scatter-subtitle',
            'Scatter plot requires two numeric columns.', 'desc-scatter');
        return;
    }

    const allPairs = getNumericPairs(globalData, xCol, metricCol);
    if (!allPairs.length) {
        showChartPlaceholder('scatterPlot', 'scatter-placeholder', 'scatter-subtitle',
            `No overlapping data for: ${xCol} vs ${metricCol}`, 'desc-scatter');
        return;
    }

    const step        = Math.max(1, Math.ceil(allPairs.length / MAX_SCATTER_POINTS));
    const scatterData = [];
    for (let i = 0; i < allPairs.length && scatterData.length < MAX_SCATTER_POINTS; i += step) {
        scatterData.push({ x: allPairs[i].x, y: allPairs[i].y });
    }

    showChart('scatterPlot', 'scatter-placeholder');

    updateChart('scatterPlot', 'scatter', [], [{
        label: `${xCol} vs ${metricCol}`,
        data: scatterData,
        backgroundColor: 'rgba(37,99,235,0.45)',
        pointRadius: 4
    }]);

    const desc = document.getElementById('desc-scatter');
    desc.classList.remove('opacity-0');
    desc.innerHTML = `<span class="highlight">${escapeHtml(xCol)}</span> (X) vs <span class="highlight">${escapeHtml(metricCol)}</span> (Y) — <span class="highlight">${scatterData.length}</span> sampled points from <span class="highlight">${allPairs.length}</span> valid pairs.`;
}

function initCharts(info, metricCol, xCol) {
    drawBarChart(info, metricCol);
    drawDoughnut(info, metricCol);
    if (xCol) drawScatterPlot(info, metricCol, xCol);
}

// =====================================================================
// COLUMN SELECTOR UI
// =====================================================================

function buildColumnSelector(info) {
    const panel = document.getElementById('col-selector-panel');
    panel.classList.remove('hidden');
    panel.style.display = 'flex';

    const sampleRows           = globalData.slice(0, 500);
    const columnHasNumericData = col => sampleRows.some(r => toFiniteNumber(r?.[col]) !== null);
    const allSelectable        = info.allSelectableCols || [...(info.numericCols || []), ...(info.categoricalCols || [])];

    if (info.format === 'wide') {
        const sortedYears = [...(info.yearCols || [])].filter(c => /^\d{4}$/.test(c)).sort((a, b) => +b - +a);
        if (!selectedMetricCol || !columnHasNumericData(selectedMetricCol)) {
            selectedMetricCol = sortedYears.find(columnHasNumericData) || info.yearCols?.[info.yearCols.length - 1];
        }
        const ascYears = [...sortedYears].reverse();
        if (!selectedXCol || !columnHasNumericData(selectedXCol) || selectedXCol === selectedMetricCol) {
            selectedXCol = ascYears.find(c => c !== selectedMetricCol && columnHasNumericData(c))
                || ascYears.find(columnHasNumericData)
                || selectedMetricCol;
        }
    } else {
        if (!selectedMetricCol || !allSelectable.includes(selectedMetricCol)) {
            selectedMetricCol = info.numericCols?.[info.numericCols.length - 1] || allSelectable[0];
        }
        if (!selectedXCol || !allSelectable.includes(selectedXCol) || selectedXCol === selectedMetricCol) {
            selectedXCol = (info.numericCols || []).find(c => c !== selectedMetricCol)
                || allSelectable.find(c => c !== selectedMetricCol)
                || allSelectable[0];
        }
    }

    // Y-axis / metric buttons (numeric + categorical)
    const btnRow = document.getElementById('col-btn-row');
    btnRow.innerHTML = '';
    allSelectable.slice(0, 80).forEach(col => {
        const isCat = !isColumnNumeric(globalData.slice(0, 200), col);
        const btn   = document.createElement('button');
        btn.className = 'col-select-btn' + (isCat ? ' categorical' : '') + (col === selectedMetricCol ? ' selected' : '');
        btn.textContent = col;
        btn.title = isCat ? 'Categorical — shows frequency chart' : 'Numeric column';
        btn.onclick = () => {
            selectedMetricCol = col;
            document.querySelectorAll('#col-btn-row .col-select-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            refreshCharts();
        };
        btnRow.appendChild(btn);
    });

    // X-axis buttons (numeric only — scatter requires numbers)
    const scatterXRow    = document.getElementById('scatter-x-row');
    const scatterXBtnRow = document.getElementById('scatter-x-btn-row');
    const numericForX    = info.numericCols || [];

    if (numericForX.length >= 2) {
        scatterXRow.classList.remove('hidden');
        scatterXRow.style.display = 'flex';
        scatterXBtnRow.innerHTML  = '';
        numericForX.slice(0, 80).forEach(col => {
            const btn = document.createElement('button');
            btn.className = 'col-select-btn' + (col === selectedXCol ? ' selected' : '');
            btn.textContent = col;
            btn.onclick = () => {
                selectedXCol = col;
                document.querySelectorAll('#scatter-x-btn-row .col-select-btn').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                refreshCharts();
            };
            scatterXBtnRow.appendChild(btn);
        });
    } else {
        scatterXRow.classList.add('hidden');
        selectedXCol = numericForX[0] || null;
    }
}

// =====================================================================
// ANALYSIS RENDER — strict numeric guard before every math call
// =====================================================================

function setElementMessage(id, message) {
    const el = document.getElementById(id);
    if (el) el.innerHTML = `<span class="text-slate-500 text-sm italic">${escapeHtml(message)}</span>`;
}

function getMetricSummary(data, metricCol) {
    const values = getColumnNumericValues(data, metricCol);
    if (!values.length) return null;
    return {
        count: values.length,
        mean:  mean(values),
        min:   Math.min(...values),
        max:   Math.max(...values),
        sd:    values.length > 1 ? stdDev(values) : 0
    };
}

function getPairSummary(data, xKey, yKey) {
    if (!isColumnNumeric(data, xKey) || !isColumnNumeric(data, yKey)) {
        return { ok: false, message: MSG_NEEDS_NUMERIC };
    }
    const pairs = getNumericPairs(data, xKey, yKey);
    if (pairs.length < 2) return { ok: false, message: MSG_NEEDS_PAIRS };

    const xVals       = pairs.map(p => p.x);
    const yVals       = pairs.map(p => p.y);
    const correlation = pearsonCorr(xVals, yVals);
    if (correlation === null) return { ok: false, message: MSG_NEEDS_VARIATION };

    const regression = linearRegression(xVals, yVals);
    if (!regression || regression.r2 === null) return { ok: false, message: MSG_NEEDS_VARIATION };

    return { ok: true, pairs, xVals, yVals, correlation, regression };
}

function renderAnalysis(data) {
    const colType = getColumnType(data, selectedMetricCol);
    if (colType !== 'numeric') {
        setElementMessage('desc-stats-content', MSG_NEEDS_NUMERIC);
    } else {
        const summary = getMetricSummary(data, selectedMetricCol);
        if (!summary) {
            setElementMessage('desc-stats-content', MSG_NEEDS_NUMERIC);
        } else {
            document.getElementById('desc-stats-content').innerHTML = `
                <div class="grid grid-cols-2 gap-y-4 gap-x-8 w-full mt-2 text-slate-700">
                    <div class="flex justify-between border-b border-slate-100 pb-1"><span class="font-bold text-slate-400 text-xs uppercase">Sample (N)</span><span class="font-black">${summary.count.toLocaleString()}</span></div>
                    <div class="flex justify-between border-b border-slate-100 pb-1"><span class="font-bold text-slate-400 text-xs uppercase">Mean</span><span class="font-black text-blue-600">${fmt(summary.mean)}</span></div>
                    <div class="flex justify-between border-b border-slate-100 pb-1"><span class="font-bold text-slate-400 text-xs uppercase">Minimum</span><span class="font-black">${fmt(summary.min)}</span></div>
                    <div class="flex justify-between border-b border-slate-100 pb-1"><span class="font-bold text-slate-400 text-xs uppercase">Maximum</span><span class="font-black">${fmt(summary.max)}</span></div>
                    <div class="col-span-2 flex justify-between pt-1"><span class="font-bold text-slate-400 text-xs uppercase">Std Deviation</span><span class="font-black text-blue-600">${fmt(summary.sd)}</span></div>
                </div>`;
        }
    }

    const pairSummary = getPairSummary(data, selectedXCol, selectedMetricCol);
    if (!pairSummary.ok) {
        setElementMessage('lr-content', pairSummary.message);
        setElementMessage('corr-content', pairSummary.message);
        document.getElementById('lr-confidence').innerText = 'N/A';
        return;
    }

    const r         = pairSummary.correlation;
    const lr        = pairSummary.regression;
    const strength  = Math.abs(r) > 0.7 ? 'Strong' : Math.abs(r) > 0.4 ? 'Moderate' : 'Weak';
    const direction = r >= 0 ? 'Positive' : 'Negative';

    document.getElementById('corr-content').innerHTML = `
        <div class="flex items-center gap-6 mt-4 text-slate-700">
            <div class="bg-emerald-50 rounded-2xl p-4 flex-shrink-0 min-w-[130px] text-center border border-emerald-100">
                <p class="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Pearson r</p>
                <p class="text-3xl font-black text-emerald-700">${r.toFixed(4)}</p>
            </div>
            <div class="text-sm font-medium text-slate-600 leading-relaxed">
                Evaluated against <strong class="text-slate-900">${escapeHtml(selectedXCol)}</strong>.<br>
                Detecting a <strong class="text-emerald-700">${strength}</strong>,
                <strong class="text-emerald-700">${direction}</strong> linear relationship.
                <span class="text-slate-400 text-xs block mt-1">n = ${lr.sampleSize.toLocaleString()} valid pairs</span>
            </div>
        </div>`;

    document.getElementById('lr-content').innerHTML = `
        <div class="bg-slate-50 border border-slate-100 rounded-xl p-3 mb-4 text-center mt-2 text-slate-700">
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Equation (y = mx + b)</p>
            <p class="text-lg font-black font-mono text-slate-800 tracking-tight">
                y = ${fmt(lr.slope)}x ${lr.intercept >= 0 ? '+' : '-'} ${fmt(Math.abs(lr.intercept))}
            </p>
        </div>
        <div class="grid grid-cols-2 gap-4 text-slate-700">
            <div class="flex justify-between border-b border-slate-100 pb-1"><span class="font-bold text-slate-400 text-[10px] uppercase">Slope (m)</span><span class="font-black text-sm">${fmt(lr.slope)}</span></div>
            <div class="flex justify-between border-b border-slate-100 pb-1"><span class="font-bold text-slate-400 text-[10px] uppercase">Intercept (b)</span><span class="font-black text-sm">${fmt(lr.intercept)}</span></div>
        </div>`;

    document.getElementById('lr-confidence').innerHTML = `R&sup2; = ${lr.r2.toFixed(4)}`;
}

function renderInsights(data) {
    const pairSummary = getPairSummary(data, selectedXCol, selectedMetricCol);
    if (!pairSummary.ok) {
        setElementMessage('insights-content', pairSummary.message);
        return;
    }

    const { yVals, regression: lr } = pairSummary;
    const avg = mean(yVals);
    const sd  = stdDev(yVals);
    const cv  = Math.abs(avg) > Number.EPSILON ? sd / Math.abs(avg) : null;

    const variabilityDesc = cv === null ? 'centered around zero'
        : cv > 1   ? 'highly volatile'
        : cv > 0.5 ? 'moderately variable'
        : 'relatively stable';
    const cvText = cv === null ? 'N/A (mean near 0)' : `${(cv * 100).toFixed(1)}%`;

    document.getElementById('insights-content').innerHTML = `
        <div class="text-slate-600 text-sm font-medium leading-relaxed w-full mt-2">
            <p class="mb-3">
                The metric <strong class="text-blue-600">${escapeHtml(selectedMetricCol)}</strong>
                is <strong>${variabilityDesc}</strong> (CV: ${cvText}).
            </p>
            <p>
                The regression model explains <strong class="text-blue-600">${(lr.r2 * 100).toFixed(1)}%</strong>
                of the variance in the target. For every unit increase in
                <em>${escapeHtml(selectedXCol)}</em>, the target shifts by an estimated
                <strong>${fmt(lr.slope)}</strong> units.
            </p>
        </div>`;
}

function renderAnalysisTextOnly() {
    document.getElementById('desc-stats-content').innerHTML =
        `Dataset contains <span class="font-bold text-blue-600">${globalData.length.toLocaleString()}</span> records, but no aggregatable numeric targets.`;
    ['lr-content', 'corr-content', 'insights-content'].forEach(id => setElementMessage(id, MSG_NEEDS_NUMERIC));
    document.getElementById('lr-confidence').innerText = 'Inactive';
}

// =====================================================================
// REFRESH ORCHESTRATION (async to prevent main-thread freeze)
// =====================================================================

let refreshRequestId       = 0;
let refreshFeedbackTimeout = null;

function pulseRefreshButton() {
    const btn = document.getElementById('refresh-btn');
    if (!btn) return;
    btn.innerText = '✓ Updated';
    btn.classList.replace('bg-blue-600', 'bg-emerald-500');
    btn.classList.replace('hover:bg-blue-700', 'hover:bg-emerald-600');
    if (refreshFeedbackTimeout) clearTimeout(refreshFeedbackTimeout);
    refreshFeedbackTimeout = setTimeout(() => {
        btn.innerText = '↻ Refresh Charts';
        btn.classList.replace('bg-emerald-500', 'bg-blue-600');
        btn.classList.replace('hover:bg-emerald-600', 'hover:bg-blue-700');
    }, 900);
}

async function refreshCharts() {
    if (!currentInfo || !selectedMetricCol) return;

    const requestId = ++refreshRequestId;
    pulseRefreshButton();

    const xCol = selectedXCol
        || (currentInfo.numericCols || []).find(c => c !== selectedMetricCol)
        || (currentInfo.numericCols || [])[0];

    await yieldToBrowser();
    if (requestId !== refreshRequestId) return;

    initCharts(currentInfo, selectedMetricCol, xCol);

    await yieldToBrowser(globalData.length > 5000 ? 40 : 0);
    if (requestId !== refreshRequestId) return;

    renderAnalysis(globalData);

    await yieldToBrowser();
    if (requestId !== refreshRequestId) return;

    renderInsights(globalData);
}

async function onDataReady() {
    if (!globalData.length) return;

    const info  = detectDatasetFormat(globalData);
    currentInfo = info;

    const warningSlot = document.getElementById('warning-slot');
    warningSlot.innerHTML = '';

    renderExplorerTable(globalData, TABLE_MAX_ROWS);

    if (info.format === 'text-only' || info.format === 'empty') {
        if (info.format === 'text-only' && (info.categoricalCols || []).length > 0) {
            warningSlot.innerHTML = `
                <div class="info-banner">
                    <span class="material-symbols-outlined text-xl flex-shrink-0">info</span>
                    No numeric columns detected — showing category frequency charts.
                </div>`;
            selectedMetricCol = info.categoricalCols[0];
            selectedXCol      = info.categoricalCols[1] || info.categoricalCols[0];
            buildColumnSelector(info);
            await yieldToBrowser();
            await refreshCharts();
        } else {
            warningSlot.innerHTML = `
                <div class="warning-banner">
                    <span class="material-symbols-outlined text-xl flex-shrink-0">warning</span>
                    <div><strong>No usable columns detected.</strong> Try uploading a dataset with numeric or categorical values.</div>
                </div>`;
            renderAnalysisTextOnly();
        }
        return;
    }

    if (info.format === 'wide') {
        warningSlot.innerHTML = `
            <div class="info-banner">
                <span class="material-symbols-outlined text-xl flex-shrink-0">info</span>
                Wide-format dataset detected — select a year column below and click <strong>Refresh Charts</strong>.
            </div>`;
    }

    if (!selectedMetricCol || !(info.allSelectableCols || []).includes(selectedMetricCol)) {
        selectedMetricCol = (info.numericCols || [])[info.numericCols.length - 1] || (info.categoricalCols || [])[0];
    }
    if (!selectedXCol || !(info.numericCols || []).includes(selectedXCol) || selectedXCol === selectedMetricCol) {
        selectedXCol = (info.numericCols || []).find(c => c !== selectedMetricCol) || (info.numericCols || [])[0];
    }

    buildColumnSelector(info);

    await yieldToBrowser(globalData.length > 5000 ? 60 : 0);
    await refreshCharts();
}

// =====================================================================
// SYSTEM / UI WIRING
// =====================================================================

function showConfirm(title, message, callback) {
    confirmCallback = callback;
    document.getElementById('notif-title').innerText   = title;
    document.getElementById('notif-message').innerText = message;
    notifModal.classList.remove('hidden');
}

proceedBtn.addEventListener('click', () => {
    notifModal.classList.add('hidden');
    if (confirmCallback) confirmCallback();
});

document.getElementById('notif-close').addEventListener('click', () => notifModal.classList.add('hidden'));

document.getElementById('cancel-load').addEventListener('click', () => {
    showConfirm('Cancel Progress?', 'Are you sure? Current stream will be terminated.', () => {
        if (currentParser) currentParser.abort();
        overlay.classList.add('hidden');
        globalData = [];
        csvInput.value = '';
        document.getElementById('file-badge').classList.add('hidden');
    });
});

csvInput.addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;

    document.getElementById('display-filename').innerText = file.name;
    document.getElementById('file-badge').classList.remove('hidden');

    globalData         = [];
    allColumns         = [];
    currentInfo        = null;
    selectedMetricCol  = null;
    selectedXCol       = null;
    currentSortColumn  = null;
    sortAscending      = true;
    displayedTableData = [];

    overlay.classList.remove('hidden');
    document.getElementById('col-selector-panel').classList.add('hidden');
    document.getElementById('col-selector-panel').style.display = 'none';
    document.getElementById('warning-slot').innerHTML = '';
    document.getElementById('scatter-x-row').classList.add('hidden');

    ['barChart', 'doughnutChart', 'scatterPlot'].forEach(id => {
        const ex = Chart.getChart(id); if (ex) ex.destroy();
        document.getElementById(id).classList.add('hidden');
    });
    ['bar-placeholder', 'doughnut-placeholder', 'scatter-placeholder'].forEach(id => {
        document.getElementById(id).classList.remove('hidden');
    });
    ['desc-bar', 'desc-doughnut', 'desc-scatter'].forEach(id => {
        document.getElementById(id).classList.add('opacity-0');
    });
    ['bar-subtitle', 'doughnut-subtitle', 'scatter-subtitle'].forEach(id => {
        document.getElementById(id).innerText = '—';
    });

    document.getElementById('load-progress-bar').style.width  = '0%';
    document.getElementById('load-percentage').innerText       = '0%';
    document.getElementById('desc-stats-content').innerHTML    = 'Waiting for dataset ingestion...';
    document.getElementById('lr-content').innerHTML            = 'Awaiting numerical correlation pairs...';
    document.getElementById('corr-content').innerHTML          = 'Processing feature associations...';
    document.getElementById('insights-content').innerHTML      = 'Waiting for narrative generation...';
    document.getElementById('lr-confidence').innerText         = 'Pending Calculation';

    Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        worker: true,
        chunk: (result, parser) => {
            currentParser = parser;
            const remaining = MAX_PARSED_ROWS - globalData.length;

            if (remaining > 0) {
                globalData.push(...result.data.slice(0, remaining));
                if (!allColumns.length && globalData.length) allColumns = Object.keys(globalData[0]);
                if (globalData.length >= MAX_PARSED_ROWS) parser.abort();
            } else {
                parser.abort();
            }

            const pct = Math.min(99, Math.round((result.meta.cursor / file.size) * 100));
            document.getElementById('load-progress-bar').style.width = pct + '%';
            document.getElementById('load-percentage').innerText      = pct + '%';
        },
        complete: async () => {
            document.getElementById('load-progress-bar').style.width = '100%';
            document.getElementById('load-percentage').innerText      = '100%';

            await yieldToBrowser(80);
            overlay.classList.add('hidden');

            if (!allColumns.length && globalData.length) allColumns = Object.keys(globalData[0]);

            await yieldToBrowser(20);
            onDataReady();
        },
        error: err => {
            overlay.classList.add('hidden');
            document.getElementById('warning-slot').innerHTML =
                `<div class="warning-banner"><span class="material-symbols-outlined text-xl">error</span> Parse error: ${escapeHtml(err.message || 'Unknown error')}</div>`;
        }
    });
});

function switchView(target) {
    ['explorer', 'viz', 'stats'].forEach(id => {
        const navBtn  = document.getElementById('nav-' + id);
        const viewDiv = document.getElementById('view-' + id);
        if (id === target) {
            navBtn.classList.add('active-nav');
            viewDiv.classList.replace('hidden-tab', 'visible-tab');
        } else {
            navBtn.classList.remove('active-nav');
            viewDiv.classList.replace('visible-tab', 'hidden-tab');
        }
    });
}

function clearSystem() { location.reload(); }