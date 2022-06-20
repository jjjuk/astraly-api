import { validateAndParseAddress } from 'starknet/utils/address'
import { ProjectModel } from '../../Repository/Project/Project.Entity'

export async function handleNewIDO({ block, tx, receipt, mysql }): Promise<void> {
  console.log('Handle New IDO', receipt.events)
  const idoId = BigInt(receipt.events[0].data[0]).toString()
  const idoAddress = validateAndParseAddress(receipt.events[0].data[1])

  const item = {
    idoId,
    tokenAddress: idoAddress,
    tx: tx.transaction_hash,
    created: block.timestamp,
  }

  await ProjectModel.create(item)

  const query = `
    INSERT IGNORE INTO projects SET ?;
  `;
  await mysql.queryAsync(query, [item]);
}
