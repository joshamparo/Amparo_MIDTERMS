import { useEffect, useState } from "react";
import axios from "axios";
function App() {
 const [students, setStudents] = useState([]);
 const [name, setName] = useState("");
 const [course, setCourse] = useState("");
 const [age, setAge] = useState("");
 const [editingId, setEditingId] = useState(null);

 useEffect(() => {
   axios.get("/students")
     .then((response) => {
       setStudents(response.data);
     })
     .catch((error) => {
       console.error("Error fetching students:", error);
     });
 }, []);

 const reloadStudents = () => {
   axios .get("/students")
     .then((response) => {
       setStudents(response.data);
     })
     .catch((error) => {
       console.error("Error fetching students:", error);
     });
 };

 const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    if (editingId) {
      await axios.put(`/students/${editingId}`, {
        name,
        course,
        age: Number(age),
      });
      setEditingId(null);
    } else {
      await axios.post("/students", {
        name,
        course,
        age: Number(age),
      });
    }
    setName("");
    setCourse("");
    setAge("");
    reloadStudents();
  } catch (error) {
    console.error("Error saving student:", error);
  }
};

 const handleEdit = (student) => {
   setEditingId(student._id);
   setName(student.name);
   setCourse(student.course);
   setAge(student.age);
 };

 const handleDelete = async (id) => {
   try {
     await axios.delete(`/students/${id}`);
     reloadStudents();
   } catch (error) {
     console.error("Error deleting student:", error);
   }
 };

 return (
<div style={{ textAlign: "center", marginTop: "20px" }}>
<h1>Student Management System</h1>
<h2>{editingId ? "Edit Student" : "Add Students"}</h2>
<form onSubmit={handleSubmit}>
       <input
         placeholder="Name"
         value={name}
         onChange={(e) => setName(e.target.value)}
         required
                />
       <br />
       <br />
     <input
         placeholder="Course"
         value={course}
         onChange={(e) => setCourse(e.target.value)}
         required
                 />
      <br />
      <br />
    <input
         type="number"
         placeholder="Age"
         value={age}
         onChange={(e) => setAge(e.target.value)}
         required
                />
      <br />
      <br />
      <button type="submit">
         {editingId ? "Update Student" : "Add Student"}
       </button>
      </form>
       <h2>Students</h2>
        {students.length === 0 ? (
      <p>No students yet.</p>
       ) : (
       students.map((student) => (
      <div key={student._id} style={{ marginBottom: "10px" }}>
      <p>
        {student.name} - {student.course} - {student.age}
       </p>
      <button onClick={() => handleEdit(student)}>Edit</button>{" "}
      <button onClick={() => handleDelete(student._id)}>Delete</button>
      </div>
       ))
     )}
</div>
 );
}
export default App;