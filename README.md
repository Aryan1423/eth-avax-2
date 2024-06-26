# Todo List DApp

## Description
This project is a decentralized Todo List application built using Solidity, React, and ethers.js. The smart contract allows users to add, retrieve, complete, and delete tasks. The frontend interacts with the smart contract deployed on the Ethereum blockchain.

## Getting Started

### Prerequisites
- Node.js
- npm
- MetaMask extension

### Installation

1. **Clone the repository:**
   ```
   git clone https://github.com/your-repo/todo-list-dapp.git
   cd todo-list-dapp
   ```
2. **Install Dependencies**
   ```
   npm install
   ```
3. **Deploy the smart contract using Hardhat**
   ```
   npx hardhat run scripts/deploy.js --network localhost
   ```
4. **Update the todoListAddress variable in App.js with the deployed contract address**
   ```
   const todoListAddress = '0xYourDeployedContractAddress';
   ```
5. **Start the React app**
   ```
   npm start
   ```
## Smart Contract
The smart contract is written in Solidity and provides the following functions:

- **addTask**: Adds a new task to the list.
- **getTask**: Retrieves details of a specific task by its ID.
- **completeTask**: Marks a specified task as completed.
- **deleteTask**: Deletes a specified task from the list.

## Frontend Application
The frontend is built using React and ethers.js for interaction with the Ethereum smart contract. Users can connect their Ethereum wallet via MetaMask to interact with the DApp.

## Folder Structure
- **contracts/**: Contains the Solidity smart contract `TodoList.sol`.
- **scripts/**: Contains the deployment script `deploy.js`.
- **src/**: Contains the React frontend application files.
  - **App.js**: Main React component for the application.
  - **TodoList.json**: ABI of the compiled smart contract.

## Features
- **Add Task**: Users can add new tasks to the todo list.
- **View Tasks**: Users can view all tasks along with their completion status.
- **Get Task**: Users can retrieve details of a specific task.
- **Complete Task**: Users can mark a task as completed.
- **Delete Task**: Users can delete a task from the list.

## Usage
1. **Connect Wallet**: Connect your Ethereum wallet using MetaMask.
2. **Add Task**: Enter a task description and click "Add Task".
3. **View Tasks**: View the list of tasks and their status.
4. **Get Task**: Enter a task ID to retrieve its details.
5. **Complete Task**: Mark a task as completed by clicking "Complete".
6. **Delete Task**: Remove a task from the list by clicking "Delete".

## License
This project is licensed under the MIT License. See the LICENSE file for details.

