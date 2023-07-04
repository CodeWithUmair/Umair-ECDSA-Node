import React, { useState } from "react";
import server from "./server";
import elliptic from "elliptic";

function Transfer({ address, setBalance, privateKey }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    try {
      const ec = new elliptic.ec("secp256k1");

      const senderKey = ec.keyFromPrivate(privateKey);
      const recipientAddress = recipient;

      const transaction = {
        sender: address,
        amount: parseInt(sendAmount),
        recipient: recipientAddress,
      };

      const transactionData = JSON.stringify(transaction);

      const signature = senderKey.sign(transactionData, "hex");

      const {
        data: { balance },
      } = await server.post("send", {
        sender: transaction.sender,
        recipient: transaction.recipient,
        amount: transaction.amount,
        signature: {
          r: signature.r.toString("hex"),
          s: signature.s.toString("hex"),
          recoveryParam: signature.recoveryParam,
        },
      });

      setBalance(balance);
    } catch (error) {
      alert("An error occurred during the transfer.");
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          type="number"
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        />
      </label>

      <label>
        Recipient Address
        <input
          type="text"
          placeholder="Type the recipient address"
          value={recipient}
          onChange={setValue(setRecipient)}
        />
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
