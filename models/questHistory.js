const mongoose = require("mongoose");

const QuestHistory = mongoose.Schema(
	{
		idoId: { type: Number, required: true },
		questId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Quest",
			required: true,
		},
		address: { type: String, required: true },
		completionDate: { type: Date },
	},
	{
		timestamps: true,
	}
);

//*** --- function for response JSON for record list request
QuestHistory.methods.toQuestHistoryJSON = function () {
	return {
		idoId: this.idoId,
		address: this.address,
		completionDate: this.completionDate,
	};
};

mongoose.model("QuestHistory", QuestHistory);
