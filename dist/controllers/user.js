import { User } from "../models/user.js";
export const newUser = async (req, res, next) => {
    try {
        const { _id, name, email, photo, gender, dob } = req.body;
        console.log(_id, name, email, photo, gender, dob);
        const user = await User.create({ _id, name, email, photo, gender, dob: new Date(dob) });
        return res.status(201).json({
            success: true,
            message: `Welcome, ${user.name}!`,
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: error,
        });
    }
};
