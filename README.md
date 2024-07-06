
# Assessment Smart Contract

A smart contract for managing deposits and withdrawals, connected with a front-end using Hardhat.

## Description

This Solidity smart contract allows the owner to deposit and withdraw funds while keeping track of the balance. The contract emits events for deposit and withdrawal actions, and includes custom error handling for insufficient balance during withdrawals. The project demonstrates how to connect a Solidity smart contract with a front-end using Hardhat.

## Getting Started

### Installing

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. **Install Dependencies**
   ```bash
   npm i
   ```

3. **Open Three Terminals in VS Code**
   - In the first terminal, you will run the front-end.
   - In the second terminal, you will start the Hardhat node.
   - In the third terminal, you will deploy the contract.

### Executing Program

1. **In the Second Terminal, Start the Hardhat Node**
   ```bash
   npx hardhat node
   ```

2. **In the Third Terminal, Deploy the Contract**
   ```bash
   npx hardhat run --network localhost scripts/deploy.js
   ```

3. **In the First Terminal, Launch the Front-End**
   ```bash
   npm run dev
   ```

After executing these steps, the project will be running on your localhost. Typically, you can access it at [http://localhost:3000/](http://localhost:3000/).

## Help

For common problems or issues, consider the following:

- **Dependency Issues**: Ensure all dependencies are installed correctly by running `npm i`.
- **Hardhat Node**: Make sure the Hardhat node is running in one of the terminals before deploying the contract.
- **Localhost**: If the front-end does not launch, check for any errors in the terminal where you ran `npm run dev`.

For more detailed help, use the Hardhat help command:
```bash
npx hardhat help
```

## Authors

Made by Jijnasu Dixit.

---

```solidity
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Assessment {
    address payable public owner;
    uint256 public balance;

    event Deposit(uint256 amount);
    event Withdraw(uint256 amount);

    constructor(uint initBalance) payable {
        owner = payable(msg.sender);
        balance = initBalance;
    }

    function getBalance() public view returns(uint256) {
        return balance;
    }

    function deposit(uint256 _amount) public payable {
        uint _previousBalance = balance;

        // make sure this is the owner
        require(msg.sender == owner, "You are not the owner of this account");

        // perform transaction
        balance += _amount;

        // assert transaction completed successfully
        assert(balance == _previousBalance + _amount);

        // emit the event
        emit Deposit(_amount);
    }

    // custom error
    error InsufficientBalance(uint256 balance, uint256 withdrawAmount);

    function withdraw(uint256 _withdrawAmount) public {
        require(msg.sender == owner, "You are not the owner of this account");
        uint _previousBalance = balance;
        if (balance < _withdrawAmount) {
            revert InsufficientBalance({
                balance: balance,
                withdrawAmount: _withdrawAmount
            });
        }

        // withdraw the given amount
        balance -= _withdrawAmount;

        // assert the balance is correct
        assert(balance == (_previousBalance - _withdrawAmount));

        // emit the event
        emit Withdraw(_withdrawAmount);
    }
}
```
```

