import { useEffect, useState } from "react";

const ManageDonations = () => {
  const [donations, setDonations] = useState([]);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Student");

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      const response = await fetch("http://localhost:5000/donations");
      if (!response.ok) throw new Error("Failed to fetch donations");

      const data = await response.json();
      setDonations(data);
    } catch (error) {
      console.error(error);
    }
  };

  const addDonation = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/donations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, amount, category }),
      });

      if (!response.ok) throw new Error("Failed to add donation");

      fetchDonations();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Manage Donations</h1>
      <form onSubmit={addDonation}>
        <input type="text" placeholder="Donor Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} required />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="Student">Student</option>
          <option value="Alumni">Alumni</option>
        </select>
        <button type="submit">Add Donation</button>
      </form>
      <ul>
        {donations.map((donation) => (
          <li key={donation.id}>
            {donation.name} donated ${donation.amount} ({donation.category})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageDonations;
