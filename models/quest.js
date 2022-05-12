const mongoose = require("mongoose");

const Quest = mongoose.Schema(
	{
		idoId: { type: Number, required: true },
		name: { type: String },
		description: { type: String },
	},
	{
		timestamps: true,
	}
);

//*** --- function for response JSON for record list request
Quest.methods.toQuestJSON = function () {
	return {
		idoId: this.idoId,
		name: this.name,
		description: this.description,
	};
};

mongoose.model("Quest", Quest);
