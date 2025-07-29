import { useState } from "react";
import axios from "axios";
import styles from "../styles/Register.module.css";

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:4000/auth/register", formData);
      setMessage(res.data.message);
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Register</h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
        <input name="confirmPassword" type="password" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} required />
        <button type="submit">Register</button>
        <p>Already have an account? <a href="/login">Login</a></p>

      </form>
      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
}
