import { useEffect, useState } from "react";
import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:5000",
});

const ManageDonations = () => {
  const [donations, setDonations] = useState([]);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Student");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    setLoading(true);
    try {
      const response = await API.get("/donations");
      setDonations(response.data);
    } catch (err) {
      setError("Failed to fetch donations");
    } finally {
      setLoading(false);
    }
  };

  const addDonation = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !amount || isNaN(amount)) {
      setError("Please enter valid name and amount.");
      return;
    }

    try {
      await API.post("/donations", { name, amount, category });
      setName("");
      setAmount("");
      setCategory("Student");
      fetchDonations();
    } catch (err) {
      setError("Failed to add donation");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Manage Donations</h2>

      <form onSubmit={addDonation} style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
        <input
          type="text"
          placeholder="Donor Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="Student">Student</option>
          <option value="Alumni">Alumni</option>
        </select>
        <button type="submit">Add Donation</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {loading ? (
        <p>Loading donations...</p>
      ) : (
        <ul>
          {donations.map((donation) => (
            <li key={donation.id}>
              <strong>{donation.name}</strong> donated ₹{donation.amount} ({donation.category})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ManageDonations;
