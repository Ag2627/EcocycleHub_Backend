import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../Model/User.js';
import dotenv from 'dotenv';
dotenv.config();
const JWT_SECRET=process.env.JWT_SECRET
const JWT_EXPIRES_IN = '24h';

if (!JWT_SECRET) {
    console.error("FATAL ERROR: JWT_SECRET is not defined in .env file.");
    process.exit(1);
}
export const signup = async (req, res) => {
    try {
        const { name, email, password,phone,address,role } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({
                message: 'Name, email, and password are required.',
                success: false,
            });
        }
        const user = await User.findOne({ email });
        if (user) {
            return res.status(409)
                .json({ message: 'User already exist, you can login', success: false });
        }
        const userModel = new User({ name, email, password,phone,address,role });
        userModel.password = await bcrypt.hash(password, 10);
        await userModel.save();
        const token = jwt.sign(
            { userId: userModel._id, email: userModel.email, role: userModel.role },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        const userToReturn = userModel.toObject();
        delete userToReturn.password;

        res.status(201).json({
            message: "Signup successful. You are now logged in.",
            success: true,
            token: token,
            data: userToReturn,
        });
    } catch (err) {
        console.error("Signup Error:", err);
        res.status(500)
            .json({
                message: "Internal server errror",
                success: false
            })
    }
}


export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                message: 'Email and password are required.',
                success: false,
            });
        }

        const user = await User.findOne({ email });
        const errorMsg = 'Auth failed email or password is wrong';
        if (!user) {
            return res.status(401)
                .json({ message: errorMsg, success: false });
        }
        const isPassEqual = await bcrypt.compare(password, user.password);
        if (!isPassEqual) {
            return res.status(401)
                .json({ message: errorMsg, success: false });
        }
        const jwtToken = jwt.sign(
            { email: user.email, userId: user._id ,role:user.role},
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        )

        const userToReturn = user.toObject();
        delete userToReturn.password;

        res.status(200).json({
            message: "Login successful.",
            success: true,
            token: jwtToken, // Standardized key
            data: userToReturn,
        });
    } catch (err) {
        res.status(500)
            .json({
                message: "Internal server errror during login",
                success: false
            })
    }
}

export const googleLogin = async (req, res) => {
    const { email } = req.body;
     if (!email) {
        return res.status(400).json({ message: "Email is required for Google login.", success: false });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            // Option: Auto-register user if they don't exist with Google login
            // For now, we'll return an error, client can redirect to signup
             return res.status(404).json({
                 message: "User not found with this Google account. Please sign up or link your account.",
                 success: false,
                 userNotFound: true, // Custom flag for client
             });
            
        }


        // Generate JWT Token
        const token = jwt.sign(
            { userId: user._id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        const userToReturn = user.toObject();
        delete userToReturn.password;

        res.status(200).json({
            message: "Google login successful.",
            success: true,
            token: token,
            data: userToReturn,
        });

    } catch (error) {
         console.error("Google Login Error:", error);
        res.status(500).json({ message: "Internal server error during Google login.", success: false });
    }
};

// This is called by the checkAuth thunk on the frontend
export const checkAuthentication = async (req, res) => {
    // This controller relies on an authentication middleware
    // to verify the token and attach user info to `req.user`.
    if (req.user && req.user.userId) { // req.user is populated by auth middleware
        try {
            const fullUser = await User.findById(req.user.userId).select('-password');
            if (!fullUser) {
                return res.status(404).json({ success: false, message: 'User from token not found.' });
            }
            // Optionally, you could issue a new token here if you want to implement sliding sessions
            // For simplicity, we'll just confirm authentication.
            res.status(200).json({
                success: true,
                message: 'User authenticated successfully.',
                user: fullUser,
                // token: req.token // Send back the same token or a new one if refreshed
            });
        } catch(error) {
            console.error("Check Auth - User Fetch Error:", error);
            res.status(500).json({ success: false, message: 'Server error validating session.' });
        }
    } else {
        // This means the auth middleware did not find a valid token or user
        res.status(401).json({ success: false, message: 'Not authenticated or token invalid.' });
    }
};

export const logout = async (req, res) => {
    // For stateless JWTs, logout is primarily a client-side concern (deleting the token).
    // If you store tokens in HttpOnly cookies, you'd clear the cookie here.
    // If you implement a token blacklist, you'd add the token to the blacklist.
    res.status(200).json({ message: 'Logout initiated. Client should clear token.', success: true });
};