const mongoose = require("mongoose");

const Quest = mongoose.Schema(
	{
		idoId: { type: mongoose.Schema.Types.ObjectId, ref: "IDO", required: true },
		name: { type: String },
		description: { type: String },
	},
	{
		timestamps: true,
	}
);

//*** --- function for response JSON for record list request
Quest.methods.toQuestJSON = function () {
	return {};
};

mongoose.model("Quest", Quest);
