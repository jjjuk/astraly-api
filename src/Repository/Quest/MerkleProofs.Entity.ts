import { getModelForClass, modelOptions, prop, Severity } from '@typegoose/typegoose'

@modelOptions({ options: { allowMixed: Severity.ALLOW } })
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
