import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import userRouter from './routes/userRoute.mjs';
import brandRoutes from './routes/brandRoute.mjs';
import categoryRoutes from './routes/categoryRoute.mjs';
import productRoutes from './routes/productRoute.mjs';
dotenv.config();

const app = express();

// ✅ CORS Middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173"); // or "*" for testing
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200); // preflight OK
  }
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 3000;

// DB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('MongoDB Error:', err));

// Routes
app.use("/products", productRoutes);
app.use('/users', userRouter);
app.use("/brands", brandRoutes);
app.use("/categories", categoryRoutes);

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
