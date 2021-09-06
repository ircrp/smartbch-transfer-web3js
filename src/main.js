const web3 = new Web3("http://35.220.203.194:8545")

const contractABI = [
	{
		"constant": true,
		"inputs": [
			{
				"name": "contractOwner",
				"type": "address"
			}
		],
		"name": "balanceOf",
		"outputs": [
			{
				"name": "balance",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "to",
				"type": "address"
			},
			{
				"name": "contracts",
				"type": "uint256"
			}
		],
		"name": "transfer",
		"outputs": [
			{
				"name": "success",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "decimals",
		"outputs": [
			{
				"internalType": "uint8",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]

const TOKEN_CONTRACT_ADDRESS = "0xf6519d8d262f40555499c0a745b976721014908d"
const PRIVATE_KEY = "0xc7462b9aef487b5932d4fa4cc9bbcb08fb48b3b5a6be5057148ef6b021f51d06"
const TRANSFER_FROM_ADDRESS = "0x4e60686568b31a46939b17a0325b9bf355a83068"
const TRANSFER_TO_ADDRESS = "0xc956fFC991CEB7A1A2F28aF8660516AAfc85A4Da"
const TRANSFER_AMOUNT = 7

const contract = new web3.eth.Contract( contractABI, TOKEN_CONTRACT_ADDRESS )

async function getBlockNumber() {
  let latestBlockNumber = await web3.eth.getBlockNumber()
  console.log( "Current smartBCH block number: ", toReadableNum( latestBlockNumber ) )
  return latestBlockNumber
}

getBlockNumber()

async function transfer() {
	let decimals = await contract.methods.decimals().call()

	console.log(decimals)

	let initialFromBalance = await contract.methods.balanceOf( TRANSFER_FROM_ADDRESS ).call()
	let initialToBalance = await contract.methods.balanceOf( TRANSFER_TO_ADDRESS ).call()

	console.log( "Initial From Balance: ", toReadableNum( Math.round(initialFromBalance / ( 10 ** decimals ) ) ) )
	console.log( "Initial To Balance: ", toReadableNum( Math.round( initialToBalance / ( 10 ** decimals ) ) ) )
	
	let transferAmount = web3.utils.toHex( TRANSFER_AMOUNT * ( 10 ** decimals ) )

	let signedTransaction = await web3.eth.accounts.signTransaction({
	  'from': TRANSFER_FROM_ADDRESS,
	  'gasPrice': web3.utils.toHex( 1050000000 ),
	  'gasLimit': web3.utils.toHex( 210000 ),
	  'to': TOKEN_CONTRACT_ADDRESS,
	  'value': 0x0,
	  'data': contract.methods.transfer( TRANSFER_TO_ADDRESS, transferAmount ).encodeABI(),
	},  PRIVATE_KEY  );

	let receipt = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction)
	
	console.log(receipt)

	let finalFromBalance = await contract.methods.balanceOf( TRANSFER_FROM_ADDRESS ).call()
	let finalToBalance = await contract.methods.balanceOf( TRANSFER_TO_ADDRESS ).call()

	console.log( "Final From Balance: ", toReadableNum( Math.round( finalFromBalance / ( 10 ** decimals ) ) ) )
	console.log( "Final To Balance: ", toReadableNum( Math.round( finalToBalance / ( 10 ** decimals ) ) ) )
}

transfer()

function toReadableNum(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}