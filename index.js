import express from "express";
import cors from "cors";
import rootRoute from "./src/routes/rootRoutes.js";
import ServerlessHttp from "serverless-http";

const app = express();
const port = 10000;

app.use(express.json());
app.use(cors());

app.use(rootRoute);
app.use("/.netlify/functions/api", rootRoute);

app.listen(port, () => {
  console.log(`⚡ Server is running at port:${port}`);
});

export const handler = ServerlessHttp(app);
