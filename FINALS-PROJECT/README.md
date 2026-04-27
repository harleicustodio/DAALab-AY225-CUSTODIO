# Education Statistics Analysis 📊

A robust, client-side web application designed to process and visualize World Bank **EdStats** datasets. This tool provides an interactive dashboard for descriptive statistics, data visualization, and linear regression analysis directly in your browser — no backend server, no file uploads, and no setup required.

## ✨ Features

The application is divided into three main analytical views:

### 1. Data Engine & Summary Statistics
* **KPI Overview:** Instantly view dataset volume (rows/columns), data completeness percentages, and missing cell counts.
* **Column Profiles:** Automatically detects numeric vs. categorical columns and generates summary statistics (Min, Max, Mean, Median, Standard Deviation, CV, and Skewness) or frequency distributions.
* **Correlation Heatmap:** Generates a visual Pearson *r* correlation matrix for up to 10 numeric columns.
* **Raw Data Explorer:** A fully searchable, sortable, and paginated data table to inspect raw records.

### 2. Visualizations
* **Dynamic Column Selection:** Swap between metric (Y-axis) and categorical (X-axis) columns to instantly update charts.
* **Bar Charts:** Displays the top 10 performing records or the most frequent categories.
* **Doughnut Charts:** Visualizes the proportional distribution of the top 5 values or categories.
* **Scatter Plots:** Maps two numeric variables against each other to visually identify trends and outliers.

### 3. Analysis Insights
* **Descriptive Statistics:** Deep dive into the selected metric's mathematical profile.
* **Linear Regression:** Calculates Ordinary Least Squares (OLS) regression, providing the mathematical equation ($y = mx + b$) and the model's confidence ($R^2$).
* **Correlation Analysis:** Calculates Pearson's *r* to determine the strength and direction of relationships between variables.
* **Data-Driven Narrative:** Generates automated text summaries explaining the variability and linear relationships in plain English.

## 🗂️ Pre-Loaded Datasets

All datasets are **hardcoded directly inside `datasets.js`** as a constant (`RAW_DATA`) — no CSV files need to be uploaded or fetched. The following EdStats tables are available in the dataset picker:

| Dataset Name | Description |
|---|---|
| **EdStats Data** | Core indicator data (enrolment, literacy, completion rates, etc.) by country and year |
| **EdStats Countries** | Country metadata — region, income group, currency, lending category |
| **EdStats Series Metadata** | Indicator definitions, topics, units of measure, and data sources |
| **EdStats Country–Series** | Country-specific notes and source descriptions per indicator |
| **EdStats Footnotes** | Footnotes and estimation flags per country/series/year |

## 🛠️ Technologies Used

This project is built purely with frontend web technologies and leverages CDNs for rapid deployment:

* **HTML5 / CSS3 / Vanilla JavaScript** (Core logic & structure)
* **[Tailwind CSS](https://tailwindcss.com/)** (Via CDN for utility-first styling)
* **[Chart.js](https://www.chartjs.org/)** (Interactive, responsive `<canvas>` charts)
* **Google Fonts & Material Symbols** (Typography and iconography)

## 🚀 Getting Started

Since this is a fully client-side application, there are no build steps, package managers, or local servers required.

### Prerequisites
* A modern web browser (Chrome, Firefox, Edge, Safari).
* An active internet connection (to load Tailwind, Chart.js, and font CDNs).

### Installation
1. Clone or download the repository to your local machine.
2. Make sure these four files are in the **same folder**:
   * `stats.html` — Main HTML structure
   * `stats.css` — Custom styles
   * `stats.js` — Analytics engine, charts, and visualizations
   * `datasets.js` — Hardcoded EdStats data and data pipeline functions
3. Open `stats.html` by double-clicking it in your file explorer.

## 📈 Usage

1. **Load a Dataset:** Click the **LOAD DATASET** button in the top-right corner and select one of the five pre-loaded EdStats tables from the picker modal.
2. **Wait for Ingestion:** The app will process the data and automatically load the dashboard.
3. **Navigate Tabs:** Use the top navigation bar to switch between the **Data Engine**, **Visualizations**, and **Analysis** views.
4. **Interact:** In the Visualizations tab, use the pill buttons to change the active metric or X-axis column, then click **↻ Refresh Charts** to update all charts.

> 💡 **Tip:** An instruction banner at the top of the page walks you through the workflow step by step. You can dismiss it once you're familiar with the app.

## 🌿 Git Workflow & Commit History

This project was developed collaboratively across **two feature branches** before being merged into `main`.

---

### Branch: `feature/data-engine`

> Owned by **Student 1** — covers the data pipeline, table rendering, filters, and summary cards.

| Commit | Description |
|---|---|
| `feat: create GitHub repo and push initial files` | Set up repository structure with `stats.html`, `stats.css`, `stats.js`, and `datasets.js` |
| `feat: define RAW_DATA constant with EdStats samples` | Hardcoded representative samples from all five EdStats CSV files into `datasets.js` |
| `feat: implement loadDataset()` | Entry point — copies `RAW_DATA` into `window.DS`, calls render functions, and triggers `onDataReady()` |
| `feat: implement renderTable(data)` | Builds a dynamic HTML table with one `<tr>` per record; applies CSS tint classes based on value ranges; shows a "No results" row when empty |
| `feat: implement applyFilterSort()` | Reads `#filterInput` and `#sortSelect`; filters by country/indicator name (case-insensitive); sorts numerically (desc/asc) or alphabetically |
| `feat: implement resetTable()` | Clears all filter and sort inputs and restores the full unfiltered dataset view |
| `feat: implement renderSummaryCards(data)` | Computes and renders 4 stat cards — Total Records, Mean Indicator Value, Top Country, and Data Coverage % |

---

### Branch: `feature/viz-analysis`

> Owned by **Student 2** — covers the analytics engine, charts, and narrative insights.

| Commit | Description |
|---|---|
| `feat: implement drawBarChart()` | Renders a horizontal bar chart of the top 10 records or most frequent categories for any selected column |
| `feat: implement drawScatterPlot()` | Maps two numeric columns against each other; samples up to 800 points for performance |
| `feat: implement drawDoughnut()` | Visualizes proportional distribution of the top 5 values or categories |
| `feat: implement stdDev(), variance(), pearsonCorr(), linearRegression()` | Core statistical functions used across the analysis tab |
| `feat: implement renderAnalysis(data)` | Populates the Descriptive Statistics, Linear Regression, and Correlation Analysis cards |
| `feat: implement renderInsights(data)` | Generates a plain-English narrative summary of variability, regression fit, and key trends |

---

### Merge History

```
main
├── feature/data-engine   → merged after all Task A–E commits
└── feature/viz-analysis  → merged after all chart and analysis commits
```

## ⚠️ Limitations & Notes
* **Performance:** The tool processes data entirely in the browser's memory. The maximum parsed row limit is capped at `15,000` rows and scatter plots sample a maximum of `800` points to prevent UI freezing.
* **Missing Data Handling:** The engine automatically detects and ignores standard null tokens (e.g., `N/A`, `..`, `null`, empty strings) when performing mathematical operations.
* **No File Upload:** This version uses hardcoded EdStats samples only. External CSV uploading is not supported in the current build.

## 📄 License
This project is open-source and available for educational and analytical use.
