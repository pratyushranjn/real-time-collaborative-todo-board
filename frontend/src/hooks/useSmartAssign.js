import { useContext } from 'react';
import { BoardContext } from '../context/BoardContext';
import api from '../services/api'; 

export default function useSmartAssign() {
  const { setTasks } = useContext(BoardContext);

  const smartAssign = async (taskId) => {
    try {
      // Call smart assign endpoint
      const response = await api.post(`/tasks/smart-assign/${taskId}`);

      const updatedTask = response.data;

      // Update tasks state
      setTasks(prev => prev.map(task => 
        task._id === taskId ? updatedTask : task
      ));

      return updatedTask;  //  Return updated task here
    } catch (error) {
      console.error('Smart Assign failed:', error);
      return null;
    }
  };

  return { smartAssign };
}
