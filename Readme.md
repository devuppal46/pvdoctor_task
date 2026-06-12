# Assignment Submission

## Visualizations

### STRC Chart - View 1

![STRC Chart](images/img1.png)

### STRC Chart - View 2

![STRC Chart](images/img2.png)

---

## Q1 A) Assumptions Made About the Data

The solution was developed based on the following assumptions:

* The dataset represents a continuous time series without major gaps.
* All input files are provided in CSV format.
* Every CSV file follows a consistent schema and column structure.
* Data types are consistent across all files.
* The dataset size is relatively small and can be processed in memory.
* No duplicate records exist in the provided data.

---

## Q1 B) What Could Break the Solution?

The current implementation may require changes if:

* Input files have different column structures.
* Data is provided in formats other than CSV.
* Duplicate records are present and need deduplication.
* The dataset grows significantly in size.
* Files contain malformed data, missing values, or inconsistent formatting.

Potential improvements include schema validation, data quality checks, and duplicate handling.

---

## Q3 A) Likely Data Sources for the Time Series

The displayed time series appears to represent financial market data. Possible sources include:

* Yahoo Finance
* Nasdaq Data Services
* Alpha Vantage
* Polygon.io
* IEX Cloud

These platforms provide both historical and near real-time market data.

---

## Q3 B) How Is the Data Processed and Updated in Near Real-Time?

A typical workflow would be:

1. Market data is received from an external provider through APIs or WebSocket streams.
2. Incoming events are aggregated into fixed intervals (e.g., 10-second or 1-minute windows).
3. Processed records are stored in a time-series database.
4. The frontend receives updates through polling or WebSocket subscriptions.
5. The chart refreshes dynamically as new data becomes available.

This approach enables efficient real-time visualization with low latency.

---

## Q3 C) How Can Visual Noise Be Reduced Without Changing the Data?

Several techniques can improve readability while preserving the original data:

* Display fewer points at wider zoom levels.
* Apply visual aggregation for dense regions.
* Use interactive zoom and pan controls.
* Highlight significant peaks and troughs.
* Improve tooltip behavior to focus attention on relevant values.

These methods enhance user experience without modifying the underlying dataset.

---

## Q3 D) Scaling the Solution to 10 Million Rows

### What Would Break?

At this scale, the current approach would face:

* Increased memory usage.
* Slower network transfers.
* Expensive frontend rendering.
* Reduced application responsiveness.

### How Would You Improve It?

To support large datasets efficiently:

* Avoid sending the entire dataset to the frontend.
* Implement server-side filtering and aggregation.
* Return only the data required for the selected time range.
* Use pre-aggregated datasets for different zoom levels.
* Store data in a time-series optimized database.
* Introduce lazy loading and virtualization techniques.

These improvements would maintain performance and responsiveness even with millions of records.
