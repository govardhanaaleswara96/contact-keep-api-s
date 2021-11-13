const express = require("express");
const router = express.Router();
const userModel = require("../models/User");
const jwt = require("jsonwebtoken");
const config = require("config");
const authMiddleware = require("../middleware/auth");
const { check, validationResult } = require('express-validator');
const bcrypt = require("bcryptjs");

// @route   get api/auth
// @desc    get auth
// @access  private

router.get('/', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await userModel.findById(userId).select("-password");
        res.status(200).json({ user });
    } catch (error) {
        console.log(error.message);
        res.status(400).json({ msg: "Server Error" });

    }
})

// @route   POST api/auth
// @desc    login user
// @access  public

router.post('/', [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Please enter with 6 or more characters").isLength(
        { min: 6 }
    ),

], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors })
    }
    try {
        const { name, email, password } = req.body;
        let user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: "Invalid Credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: "Invalid Credentials" });
        }
        const payload = {
            user: {
                id: user.id
            }
        }
        jwt.sign(payload, config.get("jwtSecret"), {
            expiresIn: 360000
        }, (err, token) => {
            if (err) throw err;
            res.status(200).json({ token });
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Server Error" });

    }
})

module.exports = router;