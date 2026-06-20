import { useState } from "react";
import { api } from "../services/api";

export function DomainForm() {
  const [domain, setDomain] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domain) return;
    await api.post("/scans/", { domain: `https://${domain}` });
    // TODO: refresh scan table
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Domain
        <input
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          placeholder="example.com"
        />
      </label>
      <button type="submit">Scan</button>
    </form>
  );
}


