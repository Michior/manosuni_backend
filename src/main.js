import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import NgoModule from "./ngo/ngo.module.js";

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use("/ngo", NgoModule);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
