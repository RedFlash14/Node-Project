import React, { useState, useEffect } from "react";
import axios from "axios";

const API = "http://localhost:5000";

const styles = {
  container: {
    maxWidth: "500px",
    margin: "50px auto",
    padding: "30px",
    border: "1px solid #ccc",
    borderRadius: "10px",
    boxShadow: "0px 0px 10px rgba(0,0,0,0.1)",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f9f9f9",
  },
  heading: {
    textAlign: "center",
    marginBottom: "20px",
  },
  input: {
    display: "block",
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "16px",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    marginLeft: "200px",
    borderRadius: "5px",
    fontSize: "16px",
    cursor: "pointer",

  },
  button1: {
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    fontSize: "16px",
    cursor: "pointer"
  },
  switchText: {
    color: "#007bff",
    textAlign: "center",
    marginTop: "10px",
    cursor: "pointer",
  },
  studentList: {
    marginTop: "20px",
    paddingLeft: "20px",
  },
};

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [authMode, setAuthMode] = useState("login");
  const [form, setForm] = useState({ username: "", password: "" });
  const [student, setStudent] = useState({ firstName: "", lastName: "", course: "", batch: "" });
  const [students, setStudents] = useState([]);

  const handleAuth = async () => {
    try {
      const endpoint = authMode === "login" ? "/login" : "/signup";
      const res = await axios.post(`${API}${endpoint}`, form);
      if (res.data.token) {
        setToken(res.data.token);
        localStorage.setItem("token", res.data.token);
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      alert(err.response?.data?.message || "An error occurred");
    }
  };

  const addStudent = async () => {
    try {
      await axios.post(`${API}/students`, { ...student, token });
      setStudent({ firstName: "", lastName: "", course: "", batch: "" });
      fetchStudents();
    } catch (err) {
      alert("Error adding student");
    }
  };

  const fetchStudents = async () => {
    const res = await axios.get(`${API}/students`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setStudents(res.data);
  };

  const logout = async () => {
    await axios.post(`${API}/logout`, { token });
    setToken("");
    localStorage.removeItem("token");
  };

  useEffect(() => {
    if (token) fetchStudents();
  }, [token]);

  if (!token) {
    return (
      <div style={styles.container}>
        <h2 style={styles.heading}>{authMode === "login" ? "Login" : "Sign Up"}</h2>
        <input
          style={styles.input}
          placeholder="Username"
          onChange={e => setForm({ ...form, username: e.target.value })}
        />
        <input
          style={styles.input}
          placeholder="Password"
          type="password"
          onChange={e => setForm({ ...form, password: e.target.value })}
        />
        <button style={styles.button} onClick={handleAuth}>
          {authMode === "login" ? "Login" : "Sign Up"}
        </button>
        <p style={styles.switchText} onClick={() => setAuthMode(authMode === "login" ? "signup" : "login")}>
          Switch to {authMode === "login" ? "Sign Up" : "Login"}
        </p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Welcome!</h2>
      <button style={{ ...styles.button1, backgroundColor: "gray", marginBottom: "20px" }} onClick={logout}>
        Logout
      </button>
      <h3>Add Student</h3>
      <input
        style={styles.input}
        placeholder="First Name"
        value={student.firstName}
        onChange={e => setStudent({ ...student, firstName: e.target.value })}
      />
      <input
        style={styles.input}
        placeholder="Last Name"
        value={student.lastName}
        onChange={e => setStudent({ ...student, lastName: e.target.value })}
      />
      <input
        style={styles.input}
        placeholder="Course"
        value={student.course}
        onChange={e => setStudent({ ...student, course: e.target.value })}
      />
      <input
        style={styles.input}
        placeholder="Batch"
        value={student.batch}
        onChange={e => setStudent({ ...student, batch: e.target.value })}
      />
      <button style={styles.button} onClick={addStudent}>
        Add Student
      </button>
      <h3>Student List</h3>
      <ul style={styles.studentList}>
        {students.map((s, i) => (
          <li key={i}>
            {s.firstName} {s.lastName} - {s.course} ({s.batch})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
