import express from 'express';
import rateLimit from 'express-rate-limit';
import { login, register, getUserStats, getUserCount, getActivityStats, googleCallback, forgotPassword, resetPassword, verifyEmail, resendOTP } from '../controllers/auth.js';
import passport from 'passport';

const router = express.Router();

const registerLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 3,
    message: { error: 'Too many requests. Please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
});

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { error: 'Too many requests. Please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
});

router.post('/register', registerLimiter, register);
router.post('/login', loginLimiter, login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.post('/verify-email', verifyEmail);
router.post('/resend-otp', resendOTP);

// Google Auth Routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], prompt: 'select_account' }));
router.get('/google/callback', passport.authenticate('google', { session: false }), googleCallback);
router.get('/stats', getUserStats);
router.get('/users/count', getUserCount);
router.get('/stats/activity', getActivityStats);

export default router;
