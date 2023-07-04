const express = require("express");
const app = express();
const cors = require("cors");
const crypto = require("crypto");
const port = 3042;

app.use(cors());
app.use(express.json());

/*

Private Keys:

1. 840858cf94c55fc9d653b93f97c332667a15b5d31cde2eec614d5bd85fc67772
2. 402eadce79c5a82b860ac3801675b28914323501fdd10e39dd6f8766eafb3cf5
3. 10fea65a85f250452addd697421fed604013b0069ce32680ca64a2b68c091c11

*/

const balances = {
  "03892ae45841edf2e33f09510e805056c38ac786b1dbbbb8e393ae121fa6db5d54": 100,
  "03d55812a05bde47e59eac74850013af37fd25b5615d3e849d0b5c3a54da1ec2de": 50,
  "03ffb54c950595c723c60732fee2127a580893bd6765b41fd77c5b515611287b72": 75,
};

const elliptic = require("elliptic");
const ec = new elliptic.ec("secp256k1");

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount, signature } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);

  // TODO-1: Verify the signature using appropriate cryptographic libraries/functions
  const senderKey = ec.keyFromPublic(sender, "hex");

  // Create the transaction data string
  const transactionData = `${sender}${recipient}${amount}`;

  // Generate the transaction hash by hashing the transaction data
  const transactionHash = crypto.createHash("sha256").update(transactionData).digest("hex");

  // Verify the signature using the transaction hash
  const isValidSignature = senderKey.verify(transactionHash, signature);

  // TODO-2: Recover the public key/address from the signature
  const recoveredAddress = senderKey.getPublic().encode("hex");

  // Verify the ownership of the private key corresponding to the address
  // by comparing the recovered public key/address with the sender's address
  if (isValidSignature && recoveredAddress === sender) {
    if (balances[sender] < amount) {
      res.status(400).send({ message: "Not enough funds!" });
    } else {
      balances[sender] -= amount;
      balances[recipient] += amount;
      res.send({ balance: balances[sender] });
    }
  } else {
    res.status(400).send({ message: "Invalid signature or address!" });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
