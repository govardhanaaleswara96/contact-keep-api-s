const express = require("express");
const router = express.Router();
const contactModel = require("../models/Contact");
const authMiddleware = require("../middleware/auth");
const { check, validationResult } = require('express-validator');


// @route   POST api/contacts
// @desc    create contacts
// @access  private

router.post('/', [authMiddleware, [
    check("name", "Please enter Name").not().isEmpty(),
    check("email", "Please include a valid email").not().isEmpty(),

]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors })
    }
    try {
        const user = req.user.id;
        const { name, email, phone, type } = req.body;
        const contacts = new contactModel({
            user,
            name,
            email,
            phone,
            type
        });
        const data = await contacts.save();
        return res.status(400).json({ data, msg: "Contact created" });

    } catch (error) {
        console.log(error.message);
        return res.status(400).json({ msg: "Server Error" });
    }
})

// @route   GET api/contacts
// @desc    get all contacts
// @access  private

router.get('/', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const contacts = await contactModel.find({ user: userId }).sort({ date: -1 });
        return res.status(400).json({ contacts });
    } catch (error) {
        console.log(error.message);
        return res.status(400).json({ msg: "Server Error" });
    }
})

// @route   PUT api/contacts/:id
// @desc    update contacts
// @access  private

router.put('/:id', authMiddleware, async (req, res) => {
    const userId = req.user.id;
    const id = req.params.id;
    const { name, email, phone, type } = req.body;
    const contactFields = {};
    if (name) contactFields.name = name;
    if (email) contactFields.email = email;
    if (phone) contactFields.phone = phone;
    if (type) contactFields.type = type;
    try {
        let contact = await contactModel.findById(id);
        if (!contact) {
            return res.status(404).json({ msg: "Contact not found" });
        }
        let user = contact.user;
        // make sure users owns contact
        if (user.toString() !== userId) {
            return res.status(401).json({ msg: "Not authorized" });
        }
        contact = await contactModel.findByIdAndUpdate(id, { $set: contactFields }, { new: true });
        res.status(200).json(contact)
    } catch (error) {
        console.log(error.message);
        return res.status(400).json({ msg: "Server Error" });
    }
});


// @route   DELETE api/contacts/:id
// @desc    delete contacts
// @access  private

router.delete('/:id', authMiddleware, async (req, res) => {
    const userId = req.user.id;
    const id = req.params.id;
    try {
        let contact = await contactModel.findById(id);
        if (!contact) {
            return res.status(404).json({ msg: "Contact not found" });
        }
        let user = contact.user;
        // make sure users owns contact
        if (user.toString() !== userId) {
            return res.status(401).json({ msg: "Not authorized" });
        }
        await contactModel.findByIdAndRemove(id);
        res.status(200).json({ msg: "contact removed" })
    } catch (error) {
        console.log(error.message);
        return res.status(400).json({ msg: "Server Error" });
    }
})
module.exports = router;