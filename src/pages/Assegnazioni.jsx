import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Assegnazioni = () => {
  const [assegnazioni, setAssegnazioni] = useState([]);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchAssegnazioni = async () => {
      try {
        const response = await axios.get('/api/assegnazioni');
        console.log('Risposta ricevuta:', response.data);
        setAssegnazioni(response.data);
      } catch (error) {
        console.error('Errore nel recupero delle assegnazioni:', error.response || error);
        setError('Errore nel recupero delle assegnazioni. Riprova più tardi.');
      }
    };
    fetchAssegnazioni();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Assegnazioni</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>} {/* Mostra il messaggio di errore */}
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2">Autista</th>
            <th className="py-2">Veicolo</th>
            <th className="py-2">Data</th>
          </tr>
        </thead>
        <tbody>
          {assegnazioni.length > 0 ? (
            assegnazioni.map((assegnazione) => (
              <tr key={assegnazione.id} className="text-center"> {/* Usa un identificatore unico */}
                <td className="py-2">{assegnazione.autista}</td>
                <td className="py-2">{assegnazione.veicolo}</td>
                <td className="py-2">{new Date(assegnazione.data).toLocaleString()}</td> {/* Formatta la data */}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center py-2">Nessuna assegnazione trovata.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Assegnazioni;