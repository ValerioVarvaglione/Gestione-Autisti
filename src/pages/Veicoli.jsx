import React, { useEffect, useState } from 'react';
import { getVeicoli, createAutista } from '../api'; // Import corretto delle funzioni

const Veicoli = () => {
  const [veicoli, setVeicoli] = useState([]);

  useEffect(() => {
    const fetchVeicoli = async () => {
      const response = await getVeicoli();
      setVeicoli(response.data);
    };
    fetchVeicoli();
  }, []);

  // Aggiungi la logica per creare un autista o veicolo come necessario

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gestione Veicoli</h1>
      {/* Qui andrai a visualizzare la lista di veicoli */}
    </div>
  );
};

export default Veicoli;
