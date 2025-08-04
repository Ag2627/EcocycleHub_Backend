import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import Connection from "./Database/db.js"
import multer from "multer";
import Authrouter from "./Routes/AuthRouter.js";
import Reportrouter from "./Routes/ReportRouter.js";
import rewardRouter from "./Routes/RewardRoutes.js";
import UserRouter from "./Routes/UserRouter.js";
// import recyclingRouter from "./Routes/CentreRouter.js";
import UploadRouter from "./Routes/UploadRouter.js";
import CenterRouter from "./Routes/RecyclingCentersRouter.js";
import Remindrouter from "./Routes/ReminderRouter.js";
dotenv.config();
const app = express();

// Middleware
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

app.use( cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    methods: ["GET", "POST", "DELETE", "PUT","PATCH"],
    allowedHeaders: [
      "Content-Type",
      "authorization",
      "Cache-Control",
      "Expires",
      "Pragma",
    ],
    credentials: true,
  })); //iske andar ye likhna optional h likh kar bas site secure banti h or nahi likhne par kisi par bhi chal jaati h
app.use(cors({
  origin: true, // or origin: '*', but not with credentials: true
  credentials: true
}));

//   app.use(bodyParser.json({extended:true}));
// app.use(bodyParser.urlencoded({extended:true}));
app.use('/auth',Authrouter);
// Routes
app.get("/", (req, res) => {
  res.send("Waste Management API is running...");
});
app.use("/users",UserRouter);
app.use("/reports", Reportrouter);
app.use("/upload", UploadRouter)

app.use("/ngos",CenterRouter);
app.use("/rewards", rewardRouter);
app.use("/remind",Remindrouter);


app.use("/api/rewards", rewardRouter);





// MongoDB Connection
const USERNAME=process.env.DB_USERNAME;
const PASSWORD=process.env.DB_PASSWORD;
Connection(USERNAME,PASSWORD);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
