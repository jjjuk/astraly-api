require("dotenv").config();
const jwt = require("jsonwebtoken");
const jwt_secret = process.env.JWT_SECRET;
const router = require("express").Router();
const ethers = require("ethers");
const mongoose = require("mongoose");
const Account = mongoose.model("Account");
const { toLowerCase } = require("../utils/utils");
const Logger = require("../services/logger");
const starknet = require("starknet");

router.post("/getToken", async (req, res) => {
	let address = req.body.address;
	let parsed_address = starknet.validateAndParseAddress(address);
	if (!parsed_address)
		return res.json({
			status: "failed",
			token: "",
		});
	parsed_address = toLowerCase(parsed_address);
	// save a new account if not registered
	let account = await Account.findOne({ address: parsed_address });
	if (!account) {
		try {
			let newAccount = new Account();
			newAccount.address = parsed_address;
			await newAccount.save();
		} catch (error) {}
	}

	let token = jwt.sign(
		{
			data: parsed_address,
		},
		jwt_secret,
		{ expiresIn: "24h" }
	);
	return res.json({
		status: "success",
		token: token,
	});
});

module.exports = router;
