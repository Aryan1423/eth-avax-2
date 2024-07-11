import React, { useEffect, useState, useCallback } from 'react';
import { ethers } from 'ethers';
import TodoList from './TodoList.json';

const todoListAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3'; 
function App() {
  const [tasks, setTasks] = useState([]);
  const [description, setDescription] = useState('');
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);

  const loadProvider = async () => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(provider);
    } else {
      console.error("No Ethereum wallet detected");
    }
  };

  const connectWallet = async () => {
    if (provider) {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const signer = provider.getSigner();
      const contract = new ethers.Contract(todoListAddress, TodoList.abi, signer);
      const accounts = await provider.listAccounts();
      setSigner(signer);
      setContract(contract);
      setAccount(accounts[0]);
    }
  };

  const fetchTasks = useCallback(async () => {
    if (contract) {
      try {
        const taskCount = await contract.taskCount();
        const tasks = [];
        for (let i = 1; i <= taskCount; i++) {
          const task = await contract.tasks(i);
          tasks.push(task);
        }
        setTasks(tasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    }
  }, [contract]);

  const getGasFees = async () => {
    const feeData = await provider.getFeeData();
    return {
      maxFeePerGas: feeData.maxFeePerGas,
      maxPriorityFeePerGas: feeData.maxPriorityFeePerGas,
    };
  };

  const addTask = async () => {
    if (contract && description) {
      try {
        const gasFees = await getGasFees();
        const tx = await contract.addTask(description, {
          maxFeePerGas: gasFees.maxFeePerGas,
          maxPriorityFeePerGas: gasFees.maxPriorityFeePerGas,
        });
        await tx.wait();
        setDescription('');
        fetchTasks();
      } catch (error) {
        console.error("Error adding task:", error);
      }
    }
  };

  const completeTask = async (id) => {
    if (contract) {
      try {
        const gasFees = await getGasFees();
        const tx = await contract.completeTask(id, {
          maxFeePerGas: gasFees.maxFeePerGas,
          maxPriorityFeePerGas: gasFees.maxPriorityFeePerGas,
        });
        await tx.wait();
        fetchTasks();
      } catch (error) {
        console.error("Error completing task:", error);
      }
    }
  };

  const deleteTask = async (id) => {
    if (contract) {
      try {
        const gasFees = await getGasFees();
        const tx = await contract.deleteTask(id, {
          maxFeePerGas: gasFees.maxFeePerGas,
          maxPriorityFeePerGas: gasFees.maxPriorityFeePerGas,
        });
        await tx.wait();
        fetchTasks(); 
      } catch (error) {
        console.error("Error deleting task:", error);
      }
    }
  };

  useEffect(() => {
    loadProvider();
  }, []);

  useEffect(() => {
    if (contract) {
      fetchTasks();
    }
  }, [contract, fetchTasks]);

  return (
    <div className="App">
      <h1>Todo List</h1>
      {!account ? (
        <button onClick={connectWallet}>Connect Wallet</button>
      ) : (
        <div>
          <p>Connected Account: {account}</p>
          
          {/* Add Task Section */}
          <div>
            <h2>Add Task</h2>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="New task description"
            />
            <button onClick={addTask}>Add Task</button>
          </div>

          {/* Tasks List */}
          <div>
            <h2>Tasks</h2>
            <ul>
              {tasks.map((task) => (
                <li key={task.id.toString()}>
                  {task.description} - {task.completed ? 'Completed' : 'Pending'}
                  {!task.completed && (
                    <button onClick={() => completeTask(task.id.toString())}>Complete</button>
                  )}
                  <button onClick={() => deleteTask(task.id.toString())}>Delete</button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
