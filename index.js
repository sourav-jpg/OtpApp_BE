const express = require("express");
const cors = require("cors");
const app = express();
app.use(express.json());
const dotenv = require("dotenv");
const morgan = require("morgan");
const connectDb = require("./server/database/connection");
const route = require("./server/routes/routes");

dotenv.config({ path: "config.env" });
const PORT = process.env.PORT || 7070;

// start server only when we have valid connection
connectDb().then(() => {
  try {
    app.listen(PORT, () => console.log(`Server is running on ${PORT}`));
  } catch (error) {
    console.log("Cannot connect to the server");
  }
}).catch(error=>{
  console.log('Invalid DB connection');
})


app.use(morgan("tiny"));
app.disable("x-powered-by"); //less hackers know about our stack

app.use(
  cors({
    origin: "*",
  })
);
app.all("/*", (request, response, next) => {
  response.header("Access-Control-Allow-Origin", "*");
  response.header("Access-Control-Allow-Headers", "*");
  response.header("Access-Control-Expose-Headers", "*");
  response.header(
    "Access-Control-Allow-Methods",
    "GET, PUT, POST, DELETE, OPTIONS, HEAD, PATCH"
  );
  response.header("Access-Control-Allow-Credentials", true);
  next();
});

app.use("/api", route);


