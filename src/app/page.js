"use client";

import { useState } from "react";

const endPoint="https://localhost:7024/api/acl/scan"

export default function Home() {
  const [searchMode, setSearchMode] = useState("All");
  const [rootPath, setRootPath] = useState("");
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleScan = async () => {
    if (!rootPath) {
      alert("Please enter a folder path");
      return;
    }

    setLoading(true);
    setMessage("");
    setResults([]);

    try {
      const response = await fetch(endPoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ searchMode, rootPath }),
      });

      if (!response.ok) {
        const err = await response.json();
        setMessage(err.message || "Error scanning folder");
        setLoading(false);
        return;
      }

      const data = await response.json();
      setResults(data.results);
      setMessage(data.message);
    } catch (err) {
      setMessage("Error connecting to backend");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = (name) => {
    alert(`Remove action clicked for ${name}`);
  };

  const handleEdit = (name) => {
    alert(`Edit action clicked for ${name}`);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2>ACL Scanner Demo Tool</h2>

      <div style={{ marginBottom: "10px" }}>
        <label style={{ marginRight: "10px" }}>Search Mode:</label>
        <select
          value={searchMode}
          onChange={(e) => setSearchMode(e.target.value)}
        >
          <option value="All">All</option>
          <option value="WellKnown">Well Known</option>
          <option value="Specific">Specific</option>
        </select>
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label style={{ marginRight: "10px" }}>Root Path:</label>
        <input
          type="text"
          value={rootPath}
          onChange={(e) => setRootPath(e.target.value)}
          placeholder="C:\"
          style={{ width: "300px" }}
        />
      </div>

      <div style={{ marginBottom: "20px" }}>
        <button onClick={handleScan} disabled={loading}>
          {loading ? "Scanning..." : "Execute"}
        </button>
      </div>

      {message && (
        <p>
          <strong>{message}</strong>
        </p>
      )}

      {results.length > 0 && (
        <table
          border="1"
          cellPadding="5"
          style={{ borderCollapse: "collapse", width: "100%" }}
        >
          <thead>
            <tr style={{ backgroundColor: "#f0f0f0" }}>
              <th>Name</th>
              <th>Full Path</th>
              <th>Files</th>
              <th>SubFolders</th>
              <th>User</th>
              <th>Rights</th>
              <th>Search Mode</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {results.map((item, index) => (
              <tr key={index}>
                <td>{item.name}</td>
                <td>{item.fullPath}</td>
                <td>{item.files}</td>
                <td>{item.subFolders}</td>
                <td>{item.user}</td>
                <td>{item.rights}</td>
                <td>{item.searchMode}</td>
                <td>
                  <button
                    onClick={() => handleRemove(item.name)}
                    style={{ marginRight: "5px" }}
                  >
                    Remove
                  </button>
                  <button onClick={() => handleEdit(item.name)}>Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {results.length === 0 && !loading && <p>No results to display</p>}
    </div>
  );
}
