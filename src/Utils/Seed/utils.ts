/* eslint-disable @typescript-eslint/naming-convention */
// const merkleTree = require("merkletreejs");
import { hash } from 'starknet'
const toLowerCase = (val: string): string => {
  if (val) return val.toLowerCase()
  else return val
}

// def get_next_level(level):
//     next_level = []

//     for i in range(0, len(level), 2):
//         node = 0
//         if level[i] < level[i+1]:
//             node = pedersen_hash(level[i], level[i+1])
//         else:
//             node = pedersen_hash(level[i+1], level[i])

//         next_level.append(node)

//     return next_level

// def generate_proof_helper(level, index, proof):
//     if len(level) == 1:
//         return proof
//     if len(level) % 2 != 0:
//         level.append(0)

//     next_level = get_next_level(level)
//     index_parent = 0

//     for i in range(0, len(level)):
//         if i == index:
//             index_parent = i // 2
//             if i % 2 == 0:
//                 proof.append(level[index+1])
//             else:
//                 proof.append(level[index-1])

//     return generate_proof_helper(next_level, index_parent, proof)

// def generate_merkle_proof(values, index):
//     return generate_proof_helper(values, index, [])

// def generate_merkle_root(values):
//     if len(values) == 1:
//         return values[0]

//     if len(values) % 2 != 0:
//         values.append(0)

//     next_level = get_next_level(values)
//     return generate_merkle_root(next_level)

const get_next_level = (level: any): any => {
  const next_level = []

  for (let i = 0, _pj_a = level.length; i < _pj_a; i += 2) {
    let node: string

    if (level[i] < level[i + 1]) {
      node = hash.pedersen([level[i], level[i + 1]])
    } else {
      node = hash.pedersen([level[i + 1], level[i]])
    }

    next_level.push(node)
  }

  return next_level
}

const generate_proof_helper = (level: any, index: number, proof: any): any => {
  if (level.length === 1) {
    return proof
  }

  if (level.length % 2 !== 0) {
    level.push(0)
  }

  const next_level = get_next_level(level)
  let index_parent = 0

  for (let i = 0, _pj_a = level.length; i < _pj_a; i += 1) {
    if (i === index) {
      index_parent = Math.floor(i / 2)

      if (i % 2 === 0) {
        proof.push(level[index + 1])
      } else {
        proof.push(level[index - 1])
      }
    }
  }

  return generate_proof_helper(next_level, index_parent, proof)
}

export const generate_merkle_proof = (values: any[], index: any): any => {
  return generate_proof_helper(values, index, [])
}

export const generate_merkle_root = (values: any[]): any => {
  if (values.length === 1) {
    return values[0]
  }

  if (values.length % 2 !== 0) {
    values.push(0)
  }

  const next_level = get_next_level(values)
  return generate_merkle_root(next_level)
}

const getLeaf = (recipient: string, amount: number): any => {
  const leaf = hash.pedersen([recipient, amount])
  return leaf
}

export const getLeaves = (recipients: string[], amounts: number[]): any => {
  const values = []
  for (let index = 0; index < recipients.length; index++) {
    const leaf = getLeaf(recipients[index], amounts[index])
    const value = [leaf, recipients[index], amounts[index]]
    values.push(value)
  }

  if (values.length % 2 !== 0) {
    const last_value = [0, 0, 0]
    values.push(last_value)
  }
  return values
}

// const pedersenHash = (data: any): any => {
//   return Buffer.from(starknet.hash.pedersen([data, 0]), 'hex')
// }

// function generateMerkleTree(recipients, amounts) {
// 	let leaves = getLeaves(recipients, amounts);
// 	leaves = leaves.map((l) => l[0]);
// 	console.log(leaves);
// 	return new merkleTree.MerkleTree(leaves, pedersenHash, {
// 		sort: true,
// 	});
// }

// const getProof = (tree, recipient, amount) =>
// 	tree.getHexProof(starknet.hash.pedersen([recipient, amount]));

module.exports = {
  toLowerCase,
  // generateMerkleTree,
  // getProof,
  generate_merkle_proof,
  generate_merkle_root,
  getLeaves,
}
