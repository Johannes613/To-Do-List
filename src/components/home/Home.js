import "./Home.css";
import React, { useEffect, useRef, useState } from "react";
import { auth, db } from "../../config/config";
import { v4 as uuidv4 } from "uuid";
import { signOut } from "firebase/auth";
import { toast, ToastContainer } from "react-toastify";
import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";

export default function Home({ currentUser, setCurrentUser }) {
  const userDoc = doc(db, "userTasks", currentUser);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [editedValue, setEditedValue] = useState("");
  const [editingId, setEditingId] = useState("");

  const getList = async () => {
    const docSnap = await getDoc(userDoc);
    const newList = docSnap?.data();
    setTasks(newList?.tasks);
  };

  useEffect(() => {
    getList();
  }, []);

  const handleLogOut = async () => {
    try {
      await signOut(auth);
      toast.success("User logged Out!");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (newTask) {
      await updateDoc(userDoc, {
        tasks: arrayUnion({ value: newTask, id: uuidv4() }),
      });
      setNewTask("");
      getList();
    }
  };

  const handleDelete = async (toBeRemoved) => {
    await updateDoc(userDoc, {
      tasks: arrayRemove(toBeRemoved),
    });
    getList();
  };

  const handleEdit = async (editableTask) => {
    if (editableTask.id !== editingId) {
      setEditingId(editableTask.id);
      setEditedValue(editableTask.value);
    } else {
      const newList = tasks.map((eachTask) => {
        if (eachTask.id === editableTask.id) {
          return { ...eachTask, value: editedValue };
        }
        return eachTask;
      });
      await setDoc(userDoc, {
        tasks: newList,
      });
      getList();
      setEditingId("");
    }
  };

  return (
    <div>
      <ToastContainer id = "toast-cont"  position = "top-right"/>

      <section className="to-do">

        <div className="head-nav">
          <h1>To-Do-List App</h1>
          <button className = "log-out" onClick={handleLogOut}>LogOut</button>
        </div>
        <form className="head">
          <input
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            type="text"
            placeholder="what do you have planned to do?"
            id="input-bar"
          />
          <button onClick={handleAddTask} className="add-task">
            Add task
          </button>
        </form>
        <div className="tasks">
          <h2>Tasks</h2>
          {tasks?.map((eachTask) => {
            return (
              <div className="task-list" key={eachTask.id}>
                <div className="one-task">
                  <input
                    type="text"
                    className="task"
                    readOnly = {eachTask.id !== editingId}
                    value={
                      eachTask.id === editingId ? editedValue : eachTask.value
                    }
                    onChange={(e) => setEditedValue(e.target.value)}
                  />
                  <button onClick={() => handleEdit(eachTask)} className="edit">
                    {eachTask.id === editingId ? "save" : "edit"}
                  </button>
                  <button
                    onClick={() => handleDelete(eachTask)}
                    className="delete"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}

        </div>
      </section>
    </div>
  );
}
