const { ethers } = require("ethers");
import { useState, useEffect } from "react";
import { HDNodeWallet } from "ethers";

export default function TransferETH({ pkey }) {
  const [wallet, setWallet] = useState(null);
  const [userAdr, setUserAdr] = useState(null);
  const [userBalance, setUserBalance] = useState(null);
  const [hash, setHash] = useState(null);
  const [txstatus, setTxstatus] = useState(null);

  useEffect(() => {
    setTxstatus(null);
    setHash(null);
    if (!pkey) {
      console.error("Private key is missing.");
      return;
    }
    console.log("pkey from transfereth use effect (UPDATE!!!!)= ", pkey);
    async function setupWallet() {
      try {
        // Set up the provider
        const provider = ethers.getDefaultProvider("sepolia", {
          alchemy: "FQLza3Pw812rsFJyGWZvPsJXGzRvnWNv",
        });
        let walletInstance;
        // check the pkey type, hash or 12 phrases.
        const words = pkey.trim().split(/\s+/); // Split by spaces
        if (words.length === 12) {
          console.log("This is a valid 12-word phrase.");
          const walletMnemonic = HDNodeWallet.fromPhrase(pkey);
          console.log("Address mnemonic:", walletMnemonic.address);
          console.log("Private Key mnemonic:", walletMnemonic.privateKey);
          console.log("Public Key mnemonic:", walletMnemonic.publicKey);
          //set the provider
          walletInstance = new ethers.Wallet(
            walletMnemonic.privateKey,
            provider
          );
        } else {
          console.log("This is a valid Hexa private key.");
          // Create the wallet
          walletInstance = new ethers.Wallet(pkey, provider);
          console.log("Address pkey:", walletInstance.address);
        }

        setWallet(walletInstance);

        // Fetch the wallet address and balance
        const address = walletInstance.address;
        const balance = await provider.getBalance(address);
        console.log("address from useeffect=", address);
        console.log("balance from useeffect=", ethers.formatEther(balance));

        setUserAdr(address);
        setUserBalance(Number(ethers.formatEther(balance)).toFixed(4));
      } catch (error) {
        console.error("Error setting up wallet:", error);
      }
    }

    setupWallet();
  }, [pkey]); // Run when `pkey` changes

  async function submit(e) {
    e.preventDefault();
    setHash(null);
    const formData = new FormData(e.target);
    const to = formData.get("address");
    const value = formData.get("value");

    if (!wallet) {
      console.error("Wallet instance is not initialized.");
      return;
    }
    // Transaction details
    const tx = {
      to,
      value: ethers.parseEther(value),
    };

    try {
      // Send the transaction
      const txResponse = await wallet.sendTransaction(tx);
      console.log("Transaction sent:", txResponse.hash);
      setHash(txResponse.hash);

      // Wait for the transaction to be mined
      const receipt = await txResponse.wait();
      //setHash(receipt.transactionHash);
      console.log("Transaction confirmed:", receipt);
      setTxstatus("Transaction confirmed");
    } catch (error) {
      console.error("Transaction failed:", error);
    }
  }

  return (
    <div>
      <p>
        Transfer ETH for account: <strong>{userAdr || "unknown"}</strong> with
        balance: <strong>{userBalance || "unknown"}ETH.</strong>
      </p>
      <form onSubmit={submit}>
        <input
          type="text"
          name="address"
          placeholder="Recipient Address (0x...)"
          required
        />
        <br /> <br />
        <input type="text" name="value" placeholder="Amount (ETH)" required />
        <br /> <br />
        <button class="button" type="submit">
          Send
        </button>
      </form>
      {hash && (
        <p>
          Transaction Hash:{" "}
          <a
            href={`https://sepolia.etherscan.io/tx/${hash}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            View Transaction
          </a>
        </p>
      )}
      {txstatus}
    </div>
  );
}
