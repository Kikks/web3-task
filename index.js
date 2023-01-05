const dotenv = require("dotenv");
const Web3 = require("web3");
const Tx = require("ethereumjs-tx").Transaction;
const { createHash } = require("crypto");

dotenv.config();

const web3 = new Web3(
	new Web3.providers.HttpProvider(
		"https://goerli.infura.io/v3/2d6dedd9e8934c62bd0abf00e6098a98"
	)
);

const address1 = "0x7F2eCf00178684Fd40E802d0Cc8321e9f0ec71C9";
const address2 = "0x8515D50189FB145bbcf0c03cc5942DF0c907e312";

const privateKey1 = Buffer.from(process.env.ADDRESS_1_PRIVATE_KEY, "hex");
const privateKey2 = Buffer.from(process.env.ADDRESS_2_PRIVATE_KEY, "hex");

const hash = string => {
	return createHash("sha256").update(string).digest("hex");
};

web3.eth.getTransactionCount(address1, (error, txCount) => {
	const txObject = {
		nonce: web3.utils.toHex(txCount),
		data: web3.utils.toHex(hash("2009")),
		from: address1,
		to: address2,
		value: web3.utils.toHex(web3.utils.toWei("0.1", "ether")),
		gasLimit: web3.utils.toHex(30000),
		gasPrice: web3.utils.toHex(web3.utils.toWei("10", "gwei"))
	};

	const tx = new Tx(txObject, { chain: "goerli" });
	tx.sign(privateKey1);

	const serializedTransaction = tx.serialize();
	const raw = `0x${serializedTransaction.toString("hex")}`;

	web3.eth.sendSignedTransaction(raw, (error, txHash) => {
		if (error) {
			console.error(error);
		}
		console.log(txHash);
	});
});
