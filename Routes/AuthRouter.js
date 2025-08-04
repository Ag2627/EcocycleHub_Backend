import express from 'express';
import { loginValidation, signupValidation } from '../Middleware/AuthValidation.js';
import { checkAuthentication, googleLogin, login, logout, signup } from '../controllers/AuthController.js';
import { ensureAuthenticated } from '../Middleware/Auth.js';
const Authrouter=express.Router();

Authrouter.post('/login', loginValidation, login);
Authrouter.post('/signup', signupValidation, signup);
Authrouter.get('/check-auth', ensureAuthenticated,checkAuthentication, (req, res) => {
    res.json({ success: true, message: "User is authenticated", data: req.user,token:req.token });
});

Authrouter.post('/google-login',googleLogin)

Authrouter.post('/logout',logout);


export default Authrouter;