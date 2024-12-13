import express from "express";
import router from "./router";
import config from "./config";
import { database } from "./config/db";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", router);

app.listen(8000, () => {
  console.log(`Server is running on http://localhost:8000`);
  database
    .authenticate()
    .then(() => {
      console.log("Database Connected");
    })
    .catch((error) => {
      console.log(`Wrong Db connection:${error}`);
    });
});
