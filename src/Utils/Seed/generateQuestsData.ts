import { generate_merkle_proof, getLeaves } from './utils'
import { MerkleProofsModel } from '../../Repository/Quest/MerkleProofs.Entity'

const IDO_ID = 0;
export const generateQuestsData = async (): Promise<void> => {

    const recipients = [
        "0x02b9ccdbe802fba1109ff59ee13bff0a53960853fa1d4f1a114d093cd660fe24",
        "0x04645ea2500032db6954ba40aca638aec94f8c1713ebb8002a6bcd0583942228",
    ];

    const amounts = [5, 2];

    const leaves = getLeaves(recipients, amounts).map((l) => l[0]);
    // const root = generate_merkle_root(leaves)

    const addressProofMap = Object.fromEntries(
        recipients.map((addr, index) => [
            addr,
            generate_merkle_proof(leaves, index),
        ])
    );

    const merkleProof = await MerkleProofsModel.findOne({
        idoId: IDO_ID,
        data: addressProofMap
    }).exec()

    if (!merkleProof) {
        await MerkleProofsModel.create({
            idoId: IDO_ID,
            data: addressProofMap
        })
    } else {
        await MerkleProofsModel.findByIdAndUpdate(merkleProof, {
            $set: { data: addressProofMap}
        })
    }
}
