const express = require("express");
const router = express.Router();

// @route   POST api/contacts
// @desc    create contacts
// @access  private

router.post('/', (req, res) => {
    res.send("Create Contact")
})

// @route   GET api/contacts
// @desc    get all contacts
// @access  private

router.get('/', (req, res) => {
    res.send("get all Contact")
})

// @route   PUT api/contacts
// @desc    update contacts
// @access  private

router.put('/', (req, res) => {
    res.send("update Contact")
})

// @route   DELETE api/contacts
// @desc    delete contacts
// @access  private

router.delete('/', (req, res) => {
    res.send("delete Contact")
})

module.exports = router;