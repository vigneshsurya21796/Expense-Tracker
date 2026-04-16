const app = require("./app");
const connectDB = require("./config/db");
const path = require("path");
const PORT = process.env.PORT;
connectDB();
app.listen(PORT, (req, res) => {
  console.log(`server is running on PORT ${PORT} in ${process.env.NODE_ENV}`);
});
