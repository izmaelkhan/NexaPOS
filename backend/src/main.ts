import express, { Request, Response } from "express";
import { config } from "dotenv";
import authRouter from "./presentation/routes/auth.routes";
import productRouter from "./presentation/routes/product.routes";
import salesRouter from "./presentation/routes/sales.routes";
import inventoryRouter from "./presentation/routes/inventory.routes";

config();

const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/health", (req: Request, res: Response) => {
  res.json({
    status: "ok",
  });
});

// bind auth routes
app.use("/auth", authRouter);
app.use("/products", productRouter);
app.use("/sales", salesRouter);
app.use("/inventory", inventoryRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});