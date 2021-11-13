const express = require("express");
const router = express.Router();

// @route   POST api/user
// @desc    register user
// @access  private

router.post('/', (req, res) => {
    res.send("create user")
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