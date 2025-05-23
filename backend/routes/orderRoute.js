import express from "express";
import { deleteOrder, listOrders, placeOrder, updateStatus, userOrders, verifyOrder } from "../controllers/orderController.js";
import authMiddleware from "../middleware/auth.js";

const orderRouter = express.Router();

orderRouter.post("/place",authMiddleware,placeOrder);
orderRouter.post("/verify",verifyOrder);
orderRouter.post("/useorders",authMiddleware, userOrders);
orderRouter.get("/list", listOrders);
orderRouter.post("/status",updateStatus);
orderRouter.delete("/delete/:orderId", deleteOrder);


export default orderRouter;