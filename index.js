import express from "express";
import cors from "cors";
import rootRoute from "./src/routes/rootRoutes.js";
import { default as swaggerDocument } from "./swagger.js";
import swaggerUi from "swagger-ui-express";

const app = express();
const port = 10000;

app.use(express.json());
app.use(cors());

app.use(`/swagger`, swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(rootRoute);

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
