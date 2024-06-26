import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import TodoList from './TodoList.json';

const todoListAddress = '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9';

function App() {
  const [tasks, setTasks] = useState([]);
  const [description, setDescription] = useState('');
  const [taskId, setTaskId] = useState('');
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [taskDetails, setTaskDetails] = useState(null);

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

  const fetchTasks = async () => {
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
  };

  const addTask = async () => {
    if (contract && description) {
      try {
        const tx = await contract.addTask(description);
        await tx.wait();
        setDescription('');
        fetchTasks();
      } catch (error) {
        console.error("Error adding task:", error);
      }
    }
  };

  const getTask = async () => {
    if (contract && taskId) {
      try {
        const task = await contract.getTask(taskId);
        setTaskDetails(task);
      } catch (error) {
        console.error("Error getting task:", error);
      }
    }
  };

  const completeTask = async (id) => {
    if (contract) {
      try {
        const tx = await contract.completeTask(id);
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
        const tx = await contract.deleteTask(id);
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
  }, [contract]);

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

          {/* Get Task Section */}
          <div>
            <h2>Get Task</h2>
            <input
              type="number"
              value={taskId}
              onChange={(e) => setTaskId(e.target.value)}
              placeholder="Task ID"
            />
            <button onClick={getTask}>Get Task</button>
            {taskDetails && (
              <div>
                <p>ID: {taskDetails[0].toString()}</p>
                <p>Description: {taskDetails[1]}</p>
                <p>Completed: {taskDetails[2] ? 'Yes' : 'No'}</p>
              </div>
            )}
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
