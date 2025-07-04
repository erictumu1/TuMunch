import Stripe from "stripe";
import orderModel from "../models/orderModel.js";
import userModel from '../models/userModel.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

//placing user order for frontend
const placeOrder = async (req, res) => {
    const frontend_url = process.env.FRONTEND_URL || "http://localhost:5173/TuMunch";

    try {
        const { userId, address, items, amount, taxAmount, deliveryFee, discountAmount } = req.body;

        // Save order to DB
        const newOrder = new orderModel({
            userId,
            items,
            amount,
            address
        });
        await newOrder.save();

        // Clear user's cart
        await userModel.findByIdAndUpdate(userId, { cartData: {} });

        // Build Stripe session with ONE line item: total amount
        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price_data: {
                        currency: "cad",
                        product_data: {
                            name: "TuMunch Order",
                            description: [
                                deliveryFee ? `Delivery: $${deliveryFee}` : null,
                                discountAmount ? `Discount: -$${discountAmount}` : null,
                                taxAmount ? `Tax: $${taxAmount}` : null,
                            ].filter(Boolean).join(", ")
                        },
                        unit_amount: Math.round(amount * 100), // convert to cents
                    },
                    quantity: 1,
                }
            ],
            mode: "payment",
            success_url: `${frontend_url}/#/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${frontend_url}/#/verify?success=false&orderId=${newOrder._id}`,
        });

        res.json({ success: true, session_url: session.url });

    } catch (error) {
        console.log("Stripe checkout error:", error);
        res.status(500).json({ success: false, message: "Checkout failed" });
    }
};

const verifyOrder = async (req, res) => {
    const { orderId, success } = req.body;
    try {
        if (success == "true") {
            await orderModel.findByIdAndUpdate(orderId, { payment: true });
            res.json({ success: true, message: "Paid" })
        }
        else {
            await orderModel.findByIdAndDelete(orderId);
            res.json({ success: false, message: "Not Paid" })
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, messsage: "Error" })
    }
}

// user's orders for frontend
const userOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({ userId: req.body.userId });
        res.json({ success: true, data: orders })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

//Listing orders for admin panel
const listOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.json({ success: true, data: orders })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

// api for updating order status
const updateStatus = async (req, res) => {
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status })
        res.json({ success: true, message: "Status Updated" })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

//api for deleteing orders in atabase
const deleteOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const deletedOrder = await orderModel.findByIdAndDelete(orderId);
        if (!deletedOrder) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }
        res.json({ success: true, message: "Order deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};


export { deleteOrder, listOrders, placeOrder, updateStatus, userOrders, verifyOrder };

