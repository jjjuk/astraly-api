require('dotenv').config();
const router = require('express').Router();
const mongoose = require('mongoose');

// const Logger = require("../services/logger");
const Contact = mongoose.model('Contact');

router.post('/save', async (req, res) => {
  let email = req.body.email;
  console.log(email);

	// Check already exists
  let result = await Contact.findOne({ email: email });
  console.log(`Find result: ${result}`);
  if (result)
    return res.json({
      status: 'success',
      data: 'Already exists',
    });

	// Save
  let newContact = new Contact();
  newContact.email = email;
  result = await newContact.save();
  console.log(`Save result: ${result}`);
  if (result)
    return res.json({
      status: 'success',
      data: `Saved ${email}`,
    });
	
  return res.status(400).json({
    status: 'failed',
  });
});

module.exports = router;
