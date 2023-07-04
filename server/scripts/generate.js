const crypto = require("crypto");
const secp256k1 = require("secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { toHex } = require("ethereum-cryptography/utils");

const privateKey = crypto.randomBytes(32);
const publicKeyFull = secp256k1.publicKeyCreate(privateKey);
// const publicKey = keccak256(publicKeyFull.slice(1)).slice(-20);

console.log("Private key:", toHex(privateKey));
console.log("Public key:", toHex(publicKeyFull));

//npm i secp256k1

