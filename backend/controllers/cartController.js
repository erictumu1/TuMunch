import mongoose from "mongoose";
import userModel from "../models/userModel.js";

// add items to user cart
const addToCart = async (req, res) => {
  try {
    const { userId, itemId } = req.body;

    const updatePath = `cartData.${itemId}`;
    await userModel.updateOne(
      { _id: new mongoose.Types.ObjectId(userId) },
      { $inc: { [updatePath]: 1 } }
    );

    res.json({ success: true, message: "Added To Cart" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error" });
  }
};

// remove items from user cart
const removeFromCart = async (req, res) => {
  try {
    const { userId, itemId } = req.body;

    const user = await userModel.findById(userId);
    const currentQty = user.cartData?.[itemId] || 0;

    if (currentQty > 1) {
      // Decrement item quantity
      const updatePath = `cartData.${itemId}`;
      await userModel.updateOne(
        { _id: new mongoose.Types.ObjectId(userId) },
        { $inc: { [updatePath]: -1 } }
      );
    } else if (currentQty === 1) {
      // Remove item completely when quantity becomes 0
      const unsetPath = `cartData.${itemId}`;
      await userModel.updateOne(
        { _id: new mongoose.Types.ObjectId(userId) },
        { $unset: { [unsetPath]: "" } }
      );
    }

    res.json({ success: true, message: "Removed From Cart" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error" });
  }
};

// fetch user cart data 
const getCart = async (req,res) => {
    try{
        let userData = await userModel.findById(req.body.userId);
        let cartData = await userData.cartData;
        res.json({success:true,cartData})
    } catch(error){
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

// clear all items from user cart
const clearCart = async (req, res) => {
  try {
    const { userId } = req.body;

    await userModel.updateOne(
      { _id: new mongoose.Types.ObjectId(userId) },
      { $set: { cartData: {} } } // Set cartData to empty object
    );

    res.json({ success: true, message: "Cart cleared successfully" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error clearing cart" });
  }
};

export { addToCart, clearCart, getCart, removeFromCart };

