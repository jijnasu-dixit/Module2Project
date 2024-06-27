// Important Modules
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json"; // Used to define the methods you can call.
import styles from './HomePage.module.css'; // Import CSS module for styling

// Home page components
export default function HomePage() {
  // 1. State Variables:
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);

  //2. Contract Details:
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  //3. Getting the Wallet:
  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const account = await ethWallet.request({ method: "eth_accounts" });
      handleAccount(account);
    }
  };
  // 4. Handling the Account:
  const handleAccount = (account) => {
    if (account) {
      console.log("Account connected:", account);
      setAccount(account);
    } else {
      console.log("No account found");
    }
  };
  // 5. Connecting to Account:
  const connectAccount = async () => {
    if (!ethWallet) {
      alert('MetaMask wallet is required to connect');
      return;
    }

    const accounts = await ethWallet.request({ method: 'eth_requestAccounts' });
    handleAccount(accounts);

    // Once the wallet is set, we can get a reference to our deployed contract
    getATMContract();
  };

    // 6. Getting the Contract:
  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);

    setATM(atmContract);
  };

  // 7. Getting Balance:
  const getBalance = async () => {
    if (atm) {
      setBalance((await atm.getBalance()).toNumber());
    }
  };
  //8. Depositing and Withdrawing:
  const deposit = async () => {
    if (atm) {
      let tx = await atm.deposit(1);
      await tx.wait();
      getBalance();
    }
  };

  const withdraw = async () => {
    if (atm) {
      let tx = await atm.withdraw(1);
      await tx.wait();
      getBalance();
    }
  };
  // 9. Initializing User
  const initUser = () => {
    // Check if the user has Metamask
    if (!ethWallet) {
      return <p className={styles.message}>Please install Metamask to use this ATM.</p>;
    }

    // Check if the user is connected. If not, connect to their account
    if (!account) {
      return <button className={styles.button} onClick={connectAccount}>Connect your Metamask wallet</button>;
    }

    if (balance === undefined) {
      getBalance();
    }

    return (
      <div className={styles.userInfo}>
        <p>Your Account: {account}</p>
        <p>Your Balance: {balance}</p>
        <button className={styles.button} onClick={deposit}>Deposit 1 ETH</button>
        <button className={styles.button} onClick={withdraw}>Withdraw 1 ETH</button>
      </div>
    );
  };

  //10. Effect Hook -> runs when the component mounts and checks if the wallet is available.
  useEffect(() => {
    getWallet();
  }, []);

  //11. Rendering the Component:
  return (
    <main className={styles.container}>
      <header className={styles.header}><h1>Radhe Radhe! Welcome to Vrindavan. Let's handle your payments 😊</h1></header>
      {initUser()}
    </main>
  );
}
