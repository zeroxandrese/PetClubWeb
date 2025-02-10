import React, { useState } from "react";
import petClubApiReports from '../api/apiReports';

interface FetchButtonProps {
  endpoint: string;
  label: string;
  onDataFetched?: (data: any) => void;
}

const FetchButton: React.FC<FetchButtonProps> = ({ endpoint, label, onDataFetched }) => {
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await petClubApiReports.get(endpoint);
      onDataFetched && onDataFetched(response.data);
    } catch (error) {
      console.error(`Error fetching data from ${endpoint}:`, error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={fetchData} className="update-button" disabled={loading} style={{ margin: 10 }}>
      {loading ? "Loading..." : label}
    </button>
  );
};

export { FetchButton };