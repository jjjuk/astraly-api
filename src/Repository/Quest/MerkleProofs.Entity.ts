import { getModelForClass, prop } from '@typegoose/typegoose'

export class MerkleProofs {
    @prop()
    idoId: number

    @prop()
    data: any
}

export const MerkleProofsModel = getModelForClass(MerkleProofs, {
    schemaOptions: {
        timestamps: true,
        collection: 'merkleProofs',
    },
})
