export const rounds = [
  {
    title: 'Ticket Claim',
    description: 'You can claim your ticket.',
    startDate: new Date(1655740800 * 1000),
    endDate: new Date(1655913600 * 1000),
  },
  {
    title: 'Allocation',
    description: 'You can burn your ticket for allocations.',
    startDate: new Date(1655913600 * 1000),
    endDate: new Date(1656086400 * 1000),
  },
  {
    title: 'Purchase',
    description: 'You can invest in the IDO.',
    startDate: new Date(1656086401 * 1000),
    endDate: new Date(1656259200 * 1000),
  },
  {
    title: 'Distribution',
    description: 'The tokens are gradually sent to your wallet.',
    startDate: new Date(1656345600 * 1000),
    endDate: new Date(1656864000 * 1000),
  },
]

export const roundsINO = [
  {
    title: 'Ticket Claim',
    description: 'You can claim your ticket.',
    startDate: new Date(1659513600 * 1000),
    endDate: new Date(1659945600 * 1000),
  },
  {
    title: 'Allocation',
    description: 'You can burn your ticket for allocations.',
    startDate: new Date(1659945600 * 1000),
    endDate: new Date(1660118400 * 1000),
  },
  {
    title: 'Purchase',
    description: 'You can invest in the INO.',
    startDate: new Date(1660118400 * 1000),
    endDate: new Date(1660377600 * 1000),
  },
  {
    title: 'Distribution',
    description: "Claim the NFTs you've bought.",
    startDate: new Date(1660377600 * 1000),
    endDate: new Date(1660550400 * 1000),
  },
]

export const projects = [
  // {
  //   idoId: 3,
  //   name: 'Demo Project',
  //   description:
  //     'This project is a placeholder. Once Astraly is live on mainnet, you’ll be able to discover and invest in real projects building on StarkNet.',
  //   ticker: 'ASTR',
  //   logo: 'https://testnet.astraly.xyz/images/logo_black_bg.png',
  //   cover: 'https://testnet.astraly.xyz/images/home/builders.png',
  //   totalRaise: 1000,
  //   tokenPrice: 0.1,
  //   maxAllocation: 500,
  //   currentRoundIndex: 2,
  //   type: 'IDO',
  //   categories: ['DeFi', 'DEX'],
  //   rounds,
  // },
  {
    idoId: 4,
    name: 'Briq',
    description:
      'briq is a NFT construction protocol built on StarkNet. The project aims to create a more fun, composable, interoperable and on-chain future for NFTs.',
    ticker: 'BRIQ',
    logo: 'https://pbs.twimg.com/profile_images/1483732579710914560/DAC7rsiy_400x400.jpg',
    cover: 'https://astraly-bucket.fra1.digitaloceanspaces.com/cover.png',
    totalRaise: 0.5,
    tokenPrice: 0.0001,
    currentRoundIndex: 0,
    type: 'INO',
    categories: ['CONSTRUCTION', 'NFT'],
    rounds: roundsINO,
  },
  //   {
  //     idoId: 2,
  //     name: 'search',
  //     description:
  //       'This project is a placeholder. Once Astraly is live on mainnet, you’ll be able to discover and invest in real projects building on StarkNet.',
  //     ticker: 'ASTR',
  //     logo: 'https://testnet.astraly.xyz/images/logo_black_bg.png',
  //     cover: 'https://testnet.astraly.xyz/images/home/builders.png',
  //     totalRaise: 1000,
  //     tokenPrice: 0.1,
  //     maxAllocation: 500,
  //     currentRoundIndex: 2,
  //     type: 'IDO',
  //     categories: ['DeFi', 'DEX'],
  //     rounds,
  //   },
]
