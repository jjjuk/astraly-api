import { AccountModel } from '../../Repository/Account/Account.Entity'
import { QuestHistoryModel } from '../../Repository/Quest/QuestHistory.Entity'
import path from 'path' // Path
import fs from 'fs' // Filesystem
import Logger from '../../Utils/Logger'
import MerkleTree from 'merkletreejs'
import { validateAndParseAddress, hash } from 'starknet'

// Airdrop recipient addresses and scaled token values
type AirdropRecipient = {
  // Recipient address
  address: string
  // Scaled-to-decimals token value
  value: string
}

// Output file path
const outputPath: string = path.join(__dirname, './data/merkle.json')

const IDO_ID = 3
export const generateQuestsData = async (): Promise<void> => {
  const _accounts = await AccountModel.find({})

  const recipients = []
  const amounts = []
  console.log('generating...')
  for (const account of _accounts) {
    const _address = account.address
    const _nbQuest = await QuestHistoryModel.countDocuments({
      idoId: IDO_ID,
      address: _address,
    })
    if (_nbQuest > 0) {
      recipients.push(_address)
      amounts.push(_nbQuest)
    }
  }

  const _record = recipients.reduce((prev, cur, index) => {
    return { ...prev, [cur]: amounts[index] }
  }, {})
  fs.writeFileSync(
    // Output to airdrop.json
    path.join(__dirname, './data/airdrop.json'),
    // Record
    JSON.stringify(_record)
  )

  const _generator = new Generator(_record)
  await _generator.process()
}

export default class Generator {
  // Airdrop recipients
  recipients: AirdropRecipient[] = []

  /**
   * Setup generator
   * @param {Record<string, number>} airdrop address to token claim mapping
   */
  constructor(airdrop: Record<string, number>) {
    // For each airdrop entry
    for (const [address, value] of Object.entries(airdrop)) {
      // Push:
      this.recipients.push({
        // Checksum address
        address: validateAndParseAddress(address),
        // Scaled number of tokens claimable by recipient
        value: value.toString(),
      })
    }
  }

  /**
   * Generate Merkle Tree leaf from address and value
   * @param {string} address of airdrop claimee
   * @param {string} value of airdrop tokens to claimee
   * @returns {Buffer} Merkle Tree node
   */
  generateLeaf(address: string, value: string): Buffer {
    return Buffer.from(
      // Hash in appropriate Merkle format
      hash.pedersen([address, value]).slice(2),
      'hex'
    )
  }

  async process(): Promise<void> {
    Logger.info('Generating Merkle tree.')

    // Generate merkle tree
    const merkleTree = new MerkleTree(
      // Generate leafs
      this.recipients.map(({ address, value }) => this.generateLeaf(address, value)),
      // Hashing function
      hash.computeHashOnElements,
      { sortPairs: true }
    )

    // Collect and log merkle root
    const merkleRoot: string = merkleTree.getHexRoot()
    Logger.info(`Generated Merkle root: ${merkleRoot}`)

    // Collect and save merkle tree + root
    fs.writeFileSync(
      // Output to merkle.json
      outputPath,
      // Root + full tree
      JSON.stringify({
        root: merkleRoot,
        tree: merkleTree,
      })
    )
    Logger.info('Generated merkle tree and root saved to Merkle.json.')
  }
}
