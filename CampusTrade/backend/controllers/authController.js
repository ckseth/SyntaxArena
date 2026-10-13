import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Helper to create token
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Register User
export const registerUser = async (req, res) => {
    try {
        console.log('\n========== SIGNUP START =========');
        const { name, email, password } = req.body;
        console.log('📝 Signup attempt:', { name, email, passwordLength: password?.length });

        // Validation
        if (!name || !email || !password) {
            console.log('❌ Missing fields');
            return res.status(400).json({ message: "Name, email, and password are required" });
        }

        if (password.length < 6) {
            console.log('❌ Password too short');
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            console.log('❌ Email exists:', email);
            return res.status(400).json({ message: "Email already registered" });
        }

        // Create new user (password will be hashed by pre-save hook)
        console.log('🔐 Creating user object...');
        const user = new User({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password: password,
            phone: (req.body.phone || '').trim()
        });

        // Save user to database (password gets hashed here in pre-save hook)
        console.log('💾 Saving to database...');
        await user.save();
        console.log('✅ User saved successfully');

        // Create token
        const token = createToken(user._id);

        // Return success response
        console.log('✅ Signup successful. Sending response...');
        console.log('========== SIGNUP END =========\n');
        
        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone
            }
        });
    } catch (error) {
        console.error('❌ Signup error details:', {
            message: error.message,
            code: error.code,
            name: error.name,
            stack: error.stack?.split('\n')[0]
        });
        console.log('========== SIGNUP END (ERROR) =========\n');
        
        // Handle specific errors
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "Email already exists"
            });
        }
        
        res.status(500).json({
            success: false,
            message: "Registration failed: " + (error.message || "Unknown error"),
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Login User
export const loginUser = async (req, res) => {
    try {
        console.log('\n========== LOGIN START =========');
        const { email, password } = req.body;
        console.log('🔐 Login attempt:', { email, passwordLength: password?.length });

        // Validation
        if (!email || !password) {
            console.log('❌ Missing credentials');
            return res.status(400).json({ message: "Email and password are required" });
        }

        // Find user by email
        console.log('🔍 Searching for user:', email);
        const user = await User.findOne({ email });

        if (!user) {
            console.log('❌ User not found:', email);
            return res.status(401).json({ message: "Invalid email or password" });
        }

        console.log('✅ User found:', user.email);
        console.log('📝 Comparing:', { plainPassword: password, hashedPasswordPreview: user.password.substring(0, 20) + '...' });

        // Compare passwords using the method from User model
        const isPasswordCorrect = await user.comparePassword(password);
        console.log('🔑 Password match result:', isPasswordCorrect);

        if (!isPasswordCorrect) {
            console.log('❌ Password mismatch');
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Create token
        console.log('🎫 Creating token...');
        const token = createToken(user._id);

        // Return success response
        console.log('✅ Login successful');
        console.log('========== LOGIN END =========\n');
        
        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone
            }
        });
    } catch (error) {
        console.error('❌ Login error:', error.message);
        res.status(500).json({
            success: false,
            message: "Login failed",
            error: error.message
        });
    }
};
