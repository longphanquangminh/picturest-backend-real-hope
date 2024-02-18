import express from "express";
import cors from "cors";
import rootRoute from "./src/routes/rootRoutes.js";

const app = express();
const port = 8080;

app.use(express.json());
app.use(cors());

app.use(rootRoute);

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
