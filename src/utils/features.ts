import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const db = await mongoose.connect( "mongodb://localhost:27017", {
            dbName: "Ecommerce_MERN"
        } );

        console.log( `Database connected to ${ db.connection.host }` );
    } catch ( error ) {
        console.log( error );
    }
};