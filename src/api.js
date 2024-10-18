import axios from 'axios';

export const getAutisti = async () => {
  return await axios.get('/api/autisti');
};

export const createAutista = async (autista) => {
  return await axios.post('/api/autisti', autista);
};

export const updateAutista = async (id, autista) => {
  return await axios.put(`/api/autisti/${id}`, autista);
};

export const deleteAutista = async (id) => {
  return await axios.delete(`/api/autisti/${id}`);
};

// Nuova funzione per recuperare i veicoli
export const getVeicoli = async () => {
  return await axios.get('/api/veicoli');
};
