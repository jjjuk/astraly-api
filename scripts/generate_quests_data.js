require("dotenv").config();

const IDO_ID = 0;
const mongoose = require("mongoose");
require("../models/account");
require("../models/questHistory");

const {
	generate_merkle_root,
	generate_merkle_proof,
	getLeaves,
} = require("../utils/utils");
const QuestHistory = mongoose.model("QuestHistory");
const Account = mongoose.model("Account");

const connect = () => {
	const uri = process.env.DB_URL;
	mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
	const db = mongoose.connection;
	db.on("error", console.error.bind(console, "connection error:"));
	db.once("open", async () => {
		const _accounts = await Account.find({});

		let recipients = [];
		let amounts = [];
		for (const account of _accounts) {
			const _address = account.address;
			const _nbQuest = await QuestHistory.countDocuments({
				idoId: IDO_ID,
				address: _address,
			});
			recipients.push(_address);
			amounts.push(_nbQuest);
		}

		// recipients = [
		// 	"0x02b9ccdbe802fba1109ff59ee13bff0a53960853fa1d4f1a114d093cd660fe24",
		// 	"0x04645ea2500032db6954ba40aca638aec94f8c1713ebb8002a6bcd0583942228",
		// ];

		// amounts = [5, 2];
		let leaves = getLeaves(recipients, amounts);
		leaves = leaves.map((l) => l[0]);

		const root = generate_merkle_root(leaves);
		console.log("ROOT : ", root);

		const proof = generate_merkle_proof(leaves, 0);

		console.log("PROOF : ", proof);
	});
};

connect();
