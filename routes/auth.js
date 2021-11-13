const express = require("express");
const router = express.Router();

// @route   get api/auth
// @desc    get auth
// @access  private

router.get('/', (req, res) => {
    res.send("get auth")
})

// @route   POST api/auth
// @desc    login user
// @access  public

router.post('/', (req, res) => {
    res.send("user login")
})


module.exports = router;