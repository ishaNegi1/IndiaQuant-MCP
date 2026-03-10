<h1><b>IndiaQuant MCP – AI Stock Market Intelligence Server</b></h1>

<h2><b>Overview</b></h2>

IndiaQuant MCP is a Node.js-based Model Context Protocol (MCP) server that provides real-time Indian stock market intelligence to AI agents such as Claude.
The system integrates live market data, technical analysis, options analytics, sentiment analysis, and a virtual trading engine using only free APIs. It exposes these capabilities as AI tools, enabling agents to perform advanced financial analysis using natural language queries.<br>

Example user queries an AI agent could answer using this server:<br>
<i>“Should I buy Reliance right now?”</i><br>
<i>“Find oversold IT stocks.”</i><br>
<i>“Show my portfolio profit and loss.”</i><br>
<i>“Detect unusual options activity.”</i><br>
<i>“Calculate option Greeks for this contract.”</i><br>

The server acts as the intelligence layer between AI models and real-time financial markets.

<h2><b>Architecture</b></h2>

<h3><b>System Architecture</b></h3>

<pre>
                User / Trader
                      │
                      ▼
               AI Agent (Claude)
                      │
                      ▼
              IndiaQuant MCP Server
                 (Node.js / Express)
                      │
        ┌─────────────┼─────────────┐
        ▼             ▼             ▼
 Market Data     Analytics Engine   Portfolio Engine
        │             │             │
        ▼             ▼             ▼
 Yahoo Finance   Technical Analysis   SQLite Database
 NewsAPI         Options Analytics
 AlphaVantage    Sentiment Analysis
</pre>

<h3><b>Module Breakdown</b></h3>

<h4><b>1. Market Data Engine</b></h4>

Responsible for retrieving live stock market data.<br>

Functions:<br>

<ul type="circle">
<li>Live stock prices</li>
<li>Historical OHLC data</li>
<li>Options chain data</li>
</ul>

Data source:

<ul type="circle">
<li>Yahoo Finance API</li>
</ul>

<h4><b>2. AI Trade Signal Generator</b></h4>

Generates BUY / SELL / HOLD signals by combining:

<ul type="circle">
<li>RSI indicator</li>
<li>MACD indicator</li>
<li>News sentiment analysis</li>
</ul>

Confidence score is calculated using weighted signals:<br>

<pre><code>
confidence =
  (RSI_score * 0.4) +
  (MACD_score * 0.4) +
  (sentiment_score * 0.2)
</code></pre>

<h4><b>3. Options Chain Analyzer</b></h4>

Performs quantitative analysis on options data.<br>

Features:<br>

<ul type="circle">
<li>Option chain retrieval</li>
<li>Open interest spike detection</li>
<li>Max pain calculation</li>
<li>Options Greeks calculation using Black-Scholes</li>
</ul>

Greeks implemented from scratch:<br>

<ul type="circle">
<li>Delta</li>
<li>Gamma</li>
<li>Theta</li>
<li>Vega</li>
</ul>

<h4><b>4. Portfolio Risk Manager</b></h4>

Simulates trading activity using a virtual portfolio.<br>

Capabilities:<br>

<ul type="circle">
<li>Virtual buy/sell trades</li>
<li>Position tracking</li>
<li>Real-time portfolio P&L calculation</li>
</ul>

Data is stored in a SQLite database.

<h4><b>5. MCP Tools Layer</b></h4>

The MCP layer exposes the system’s capabilities as AI tools.
Each tool returns structured JSON responses that an AI agent can consume.

<h2><b>MCP Tools</b></h2>

The server exposes 10 AI tools.

<table border="1">
<tr>
<th>Tool</th>
<th>Description</th>
</tr>

<tr>
<td>get_live_price</td>
<td>Retrieve live stock price</td>
</tr>

<tr>
<td>get_options_chain</td>
<td>Fetch options chain data</td>
</tr>

<tr>
<td>analyze_sentiment</td>
<td>Perform news sentiment analysis</td>
</tr>

<tr>
<td>generate_signal</td>
<td>Generate BUY/SELL signal</td>
</tr>

<tr>
<td>get_portfolio_pnl</td>
<td>Retrieve portfolio performance</td>
</tr>

<tr>
<td>place_virtual_trade</td>
<td>Simulate buy/sell trade</td>
</tr>

<tr>
<td>calculate_greeks</td>
<td>Compute option Greeks</td>
</tr>

<tr>
<td>detect_unusual_activity</td>
<td>Detect unusual options activity</td>
</tr>

<tr>
<td>scan_market</td>
<td>Find oversold stocks</td>
</tr>

<tr>
<td>get_sector_heatmap</td>
<td>Analyze sector performance</td>
</tr>
</table>

<h2><b>Example Tool Calls</b></h2>

<h4><b>Live Price</b></h4>

<code>GET /get_live_price?symbol=RELIANCE.NS</code>

<h5><b>Response</b></h5>

<pre><code>
{
 "symbol": "RELIANCE.NS",
 "price": 2920,
 "change": 0.45,
 "volume": 3200000
}
</code></pre>

<h4><b>Trading Signal</b></h4>

<code>GET /generate_signal?symbol=RELIANCE.NS</code>

<h5><b>Response</b></h5>

<pre><code>
{
 "signal": "BUY",
 "confidence": 64,
 "indicators": {
   "rsi": 28,
   "macd": 3.2,
   "sentiment": 2
 }
}
</code></pre>

<h4><b>Options Chain</b></h4>

<code>GET /get_options_chain?symbol=AAPL</code>

<h5><b>Response</b></h5>

<pre><code>
{
 "expiry": "2026-06-19",
 "maxPain": 180,
 "calls": [...],
 "puts": [...]
}
</code></pre>

<h4><b>Portfolio</b></h4>

<code>GET /get_portfolio_pnl</code>

<h5><b>Response</b></h5>

<pre><code>
{
 "positions": [...],
 "total_pnl": 320
}
</code></pre>

<h2><b>Installation Guide</b></h2>

<h3><b>Clone the repository</b></h3>

<code>git clone https://github.com/yourusername/IndiaQuant-MCP.git</code><br>
<code>cd indiaquant-mcp</code>

<h3><b>Install dependencies</b></h3>

<code>npm install</code>

<h3><b>Environment Variables</b></h3>

Create a .env file:<br>

<code>NEWS_API_KEY=your_news_api_key</code><br>
<code>ALPHA_VANTAGE_KEY=your_alpha_vantage_key</code><br>

<h3><b>Run the server</b></h3>

<code>node src/server.js</code>

Server runs on:<br>

<code>http://localhost:3000</code>

<h2><b>Example Requests</b></h2>

Live Stock Price<br>
<code>http://localhost:3000/get_live_price?symbol=RELIANCE.NS</code><br>

Generate Signal<br>
<code>http://localhost:3000/generate_signal?symbol=RELIANCE.NS</code><br>

Market Scan<br>
<code>http://localhost:3000/scan_market</code>

<h2><b>Architecture Decisions</b></h2>

<h4><b>Node.js + Express</b></h4>

Chosen for fast development of API-based tool servers and easy integration with AI agents.

<h4><b>Yahoo Finance API</b></h4>

Provides free access to:<br>

<ul type="circle">
<li>live prices</li>
<li>historical data</li>
<li>options chains</li>
</ul>

No paid broker APIs required.

<h4><b>SQLite</b></h4>

Selected for lightweight storage of portfolio data without requiring a separate database server.

<h4><b>Modular Architecture</b></h4>

Project structured into independent modules:

<pre><code>
src/
  market/
  signals/
  options/
  portfolio/
  sentiment/
  mcp/
</code></pre>

This improves maintainability and scalability.

<h2><b>Trade-offs</b></h2>

<h4><b>Free APIs</b></h4>

Free APIs limit:<br>

<ul type="circle">
<li>request rate</li>
<li>options availability for some symbols</li>
</ul>

However they allow building a fully free system.

<h4><b>Options Data</b></h4>

Yahoo Finance does not always provide options data for all NSE stocks.
The system handles missing data gracefully.

<h4><b>Simple Signal Strategy</b></h4>

The signal generator uses RSI, MACD, and sentiment analysis rather than a complex ML model.
This keeps the system transparent and explainable.

<h4><b>Market Coverage</b></h4>

The market scanner currently analyzes a subset of major stocks rather than the full NSE universe.

<h2><b>AI Agent Integration</b></h2>

This server is designed to act as an AI tool backend.<br>

Example AI interaction:<br>

User:<br>
<code>Should I buy Reliance today?</code>

AI tool call:<br>
<code>generate_signal(symbol="RELIANCE.NS")</code>

Server response:<br>

<pre><code>
{
 "signal": "BUY",
 "confidence": 64
}
</code></pre>

AI response:<br>

<code>Reliance appears oversold based on RSI and sentiment analysis. Signal: BUY with 64% confidence.</code>

<h2><b>Tech Stack</b></h2>

<ul type="circle">
<li>Node.js</li>
<li>Express</li>
<li>Yahoo Finance API</li>
<li>NewsAPI</li>
<li>AlphaVantage</li>
<li>TechnicalIndicators</li>
<li>SQLite</li>
<li>Node Cache</li>
</ul>

