import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import userRouter from './routes/userRoute.mjs';
import brandRoutes from './routes/brandRoute.mjs';
import categoryRoutes from './routes/categoryRoute.mjs'
import productRoutes from './routes/productRoute.mjs'
dotenv.config();

const app = express();

// ✅ CORS Fix
app.use(cors({
  origin: "http://localhost:5173",  // React URL
  methods: "GET,POST,PUT,DELETE",
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 3000;

// DB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('MongoDB Error:', err));

// ❌ YE LAG NE DO — Tumhare code me galti se "a" likha tha
// a  -> Remove this

// Routes
app.use("/products", productRoutes);
app.use('/users', userRouter);
app.use("/brands", brandRoutes);
app.use("/categories", categoryRoutes);
// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
