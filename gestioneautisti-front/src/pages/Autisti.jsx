import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Autisti = () => {
  const [autisti, setAutisti] = useState([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const fetchAutisti = async () => {
      const response = await axios.get('/api/autisti');
      setAutisti(response.data);
    };
    fetchAutisti();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gestione Autisti</h1>
      <input 
        type="text" 
        placeholder="Cerca per nome o codice fiscale..." 
        className="mb-4 p-2 border" 
        onChange={(e) => setFilter(e.target.value)}
      />
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="text-left py-2 px-4">Nome</th>
            <th className="text-left py-2 px-4">Cognome</th>
            <th className="text-left py-2 px-4">Codice Fiscale</th>
            <th className="text-left py-2 px-4">Numero Patente</th>
            <th className="text-left py-2 px-4">Scadenza Patente</th>
          </tr>
        </thead>
        <tbody>
          {autisti
            .filter(autista => 
              autista.nome.includes(filter) || autista.codFiscale.includes(filter))
            .map(autista => (
            <tr key={autista.id}>
              <td className="py-2 px-4">{autista.nome}</td>
              <td className="py-2 px-4">{autista.cognome}</td>
              <td className="py-2 px-4">{autista.codFiscale}</td>
              <td className="py-2 px-4">{autista.numPatente}</td>
              <td className="py-2 px-4">{autista.scadenzaPatente}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Autisti;
