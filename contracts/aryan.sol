pragma solidity ^0.8.18;

contract TodoList {
    uint public taskCount;
    struct Task {
        uint256 id;
        string description;
        bool completed;
    }

    mapping(uint256 => Task) public tasks;
    function addTask(string memory description) external {
        taskCount++;
        tasks[taskCount] = Task(taskCount, description, false);}

    function getTask(uint256 id) external view returns (uint256, string memory, bool) {
        require(id > 0 && id <= taskCount, "Task ID is out of range.");
        Task memory task = tasks[id];
        return (task.id, task.description, task.completed);}

    function completeTask(uint256 id) external {
        require(id > 0 && id <= taskCount, "Task ID is out of range.");
        tasks[id].completed = true;
    }

    function deleteTask(uint256 id) external {
        require(id > 0 && id <= taskCount, "Task ID is out of range.");
        delete tasks[id];
    }
}
