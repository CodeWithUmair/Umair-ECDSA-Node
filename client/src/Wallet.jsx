import server from "./server";
import secp256k1 from "secp256k1";
import { toHex } from "ethereum-cryptography/utils";
import { Buffer } from "buffer";

function Wallet({
  address,
  setAddress,
  balance,
  setBalance,
  privateKey,
  setPrivateKey,
}) {
  async function onChange(evt) {
    const privateKeyStr = evt.target.value;
    const privateKeyBytes = Buffer.from(privateKeyStr, "hex");
    setPrivateKey(privateKeyStr);

    const publicKey = secp256k1.publicKeyCreate(privateKeyBytes);
    const recoveredAddress = toHex(publicKey);
    setAddress(recoveredAddress);

    if (recoveredAddress) {
      const {
        data: { balance },
      } = await server.get(`balance/${recoveredAddress}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Private Key
        <input
          placeholder="Type your private key here for signature"
          value={privateKey}
          onChange={onChange}
        ></input>
      </label>

      <div>
        <label>Public Key:</label> &nbsp;&nbsp;
        <code> 0x{address.slice(0, 20)}... </code>
      </div>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
