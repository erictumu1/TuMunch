import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://tumunch:20020531@cluster0.rzgc0.mongodb.net/tu-munch').then(()=>console.log("DB Connected"));
}

