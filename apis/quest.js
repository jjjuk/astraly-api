require("dotenv").config();
const router = require("express").Router();
const mongoose = require("mongoose");
const extractAddress = require("../services/address.utils");

// const Logger = require("../services/logger");
const Quest = mongoose.model("Quest");
const QuestHistory = mongoose.model("QuestHistory");
const Account = mongoose.model("Account");

const fs = require("fs");

router.post("/onQuestCompleted", auth, async (req, res) => {
	let address = extractAddress(req);
	let questId = req.body.questId;
	let account = await Account.findOne({ address: address });

	if (!account)
		return res.json({
			status: "failed",
			data: "No account",
		});

	let quest = await Quest.findOne({ _id: questId });
	if (quest) {
		if (questId in account.questsCompleted) {
			return res.json({
				status: "failed",
				data: "Quest already completed",
			});
		}

		account.questsCompleted.append(questId);
		await account.save();

		// Update history
		let _questHistory = new QuestHistory();
		_questHistory.idoId = quest.idoId;
		_questHistory.questId = questId;
		_questHistory.address = address;
		_questHistory.completionDate = new Date();
		await _questHistory.save();
	}

	return res.json({
		status: "success",
		data: quest,
	});
});

router.post("/getMerkleProof", auth, async (req, res) => {
	let address = extractAddress(req);
	let idoID = req.body.idoID;
	let account = await Account.findOne({ address: address });

	if (!account)
		return res.json({
			status: "failed",
			data: "No account found for this address",
		});

	const proofs = fs.readFileSync(`scripts/data/proofs_${idoID}.json`);

	const proof = proofs[address];

	if (!proof)
		return res.json({
			status: "failed",
			error: "No proof found for this address",
		});

	return res.json({
		status: "success",
		data: proof,
	});
});

module.exports = router;
