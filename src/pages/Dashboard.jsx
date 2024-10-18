import React, { useState, useEffect } from 'react';

function Dashboard() {
  const [assegnazioni, setAssegnazioni] = useState([]);
  const [filteredAssegnazioni, setFilteredAssegnazioni] = useState([]);
  const [filter, setFilter] = useState({ autista: '', bus: '' });

  useEffect(() => {
    // Fetch data from your API (replace with actual API)
    fetch('/api/assegnazioni')
      .then((res) => res.json())
      .then((data) => {
        setAssegnazioni(data);
        setFilteredAssegnazioni(data);
      });
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter({ ...filter, [name]: value });
    const filtered = assegnazioni.filter(
      (item) =>
        (filter.autista ? item.autista.includes(filter.autista) : true) &&
        (filter.bus ? item.bus.includes(filter.bus) : true)
    );
    setFilteredAssegnazioni(filtered);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="flex space-x-4 mb-6">
        <input
          type="text"
          name="autista"
          placeholder="Filtra per Autista"
          value={filter.autista}
          onChange={handleFilterChange}
          className="p-2 border rounded-lg"
        />
        <input
          type="text"
          name="bus"
          placeholder="Filtra per Bus"
          value={filter.bus}
          onChange={handleFilterChange}
          className="p-2 border rounded-lg"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAssegnazioni.map((assegnazione) => (
          <div key={assegnazione.id} className="p-4 border rounded-lg">
            <h3 className="text-lg font-bold">{assegnazione.bus}</h3>
            <p>Autista: {assegnazione.nomeautista} {assegnazione.cognomeautista}</p>
            <p>Data: {assegnazione.datapartenza}</p>
            <p>Telefono: {assegnazione.telefono}</p>
            <button className="mt-2 text-blue-500">Visualizza Dettagli</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
