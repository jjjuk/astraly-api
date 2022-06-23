import { generate_merkle_proof, getLeaves, generate_merkle_root } from "./utils";
import { MerkleProofsModel } from "../../Repository/Quest/MerkleProofs.Entity";
import { AccountModel } from "../../Repository/Account/Account.Entity";
import { QuestHistoryModel } from "../../Repository/Quest/QuestHistory.Entity";
import { writeFileSync } from "fs";

const IDO_ID = 3;
export const generateQuestsData = async (): Promise<void> => {
  const _accounts = await AccountModel.find({});

  const recipients = [];
  const amounts = [];
  console.log("generating...");
  for (const account of _accounts) {
    console.log(`Account ${i}`);
    const _address = account.address;
    const _nbQuest = await QuestHistoryModel.countDocuments({
      idoId: IDO_ID,
      address: _address
    });
    recipients.push(_address);
    amounts.push(_nbQuest);
  }

  const leaves = getLeaves(recipients, amounts).map((l) => l[0]);
  const root = generate_merkle_root(leaves);
  console.log("ROOT : ", root);
  writeFileSync(`leaves_${IDO_ID}.json`, JSON.stringify(leaves), { flag: "a+" });
  writeFileSync(`recipients_${IDO_ID}.json`, JSON.stringify(recipients), { flag: "a+" });
  console.log("Start generating proofs");

  let cachedLevels = {}
  const addressProofMap = Object.fromEntries(
    recipients.map((addr, index) => {
      const result = [addr, generate_merkle_proof(leaves, index, cachedLevels)]
      return result;
    })
  );
  cachedLevels = null;

  writeFileSync(`proofs_${IDO_ID}.json`, JSON.stringify(addressProofMap), { flag: "a+" });
  const merkleProof = await MerkleProofsModel.findOne({
    idoId: IDO_ID,
    data: addressProofMap
  }).exec();

  if (!merkleProof) {
    console.log("creating...");
    await MerkleProofsModel.create({
      idoId: IDO_ID,
      data: addressProofMap
    });
  } else {
    await MerkleProofsModel.findByIdAndUpdate(merkleProof, {
      $set: { data: addressProofMap }
    });
  }
};
