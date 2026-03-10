require("dotenv").config();
const express = require("express");
const tools = require("./mcp/tools");

const app = express();
app.use(express.json());

app.get("/get_live_price", tools.get_live_price);
app.get("/get_options_chain", tools.get_options_chain);
app.get("/analyze_sentiment", tools.analyze_sentiment);
app.get("/generate_signal", tools.generate_signal);
app.post("/place_virtual_trade", tools.place_virtual_trade);
app.get("/get_portfolio_pnl", tools.get_portfolio_pnl);
app.get("/calculate_greeks", tools.calculate_greeks);
app.get("/detect_unusual_activity", tools.detect_unusual_activity);
app.get("/scan_market", tools.scan_market);
app.get("/get_sector_heatmap", tools.get_sector_heatmap);

app.listen(3000, () => {
  console.log("IndiaQuant MCP running on port 3000");
});