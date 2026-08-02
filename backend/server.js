require("dotenv").config();
const express = require("express");
const cors = require("cors");

const logsRouter = require("./routes/logs");
const digestRouter = require("./routes/digest");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => res.json({ ok: true }));

app.use("/api/logs", logsRouter);
app.use("/api/digest", digestRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`CareLoop backend listening on http://localhost:${PORT}`);
});
