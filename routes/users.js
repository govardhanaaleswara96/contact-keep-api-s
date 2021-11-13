const express = require("express");
const router = express.Router();
const userModel = require("../models/User");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require('express-validator');
const bcrypt = require("bcryptjs");

// @route   POST api/user
// @desc    register user
// @access  private

router.post('/', [
    check("name", "Please enter Name").not().isEmpty(),
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
        if (user) {
            return res.status(400).json({ msg: "User Already exists" });
        }
        user = new userModel({
            name,
            email,
            password
        });
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();
        const payload = {
            user: {
                id: user.id
            }
        }
        jwt.sign(payload, config.get("jwtSecret"), {
            expiresIn: 360000
        }, (err, token) => {
            if (err) throw err;
            return res.status(200).json({ token });
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Server Error" });

    }
})

// @route   GET api/user
// @desc    login user
// @access  private

router.get('/', (req, res) => {
    res.send("get all user")
})

// @route   PUT api/user
// @desc    update user
// @access  private

router.put('/', (req, res) => {
    res.send("update user")
})
// @route   DELETE api/user
// @desc    delete user
// @access  private

router.delete('/', (req, res) => {
    res.send("delete user")
})
module.exports = router;