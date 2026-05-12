import express, { Request, Response } from "express";
import { config } from "dotenv";
config();

const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/health", (req: Request, res: Response) => {
  res.json({
    status: "ok",
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});