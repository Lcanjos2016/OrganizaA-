import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3333/api';
const TOKEN_KEY = '@organizaae_token';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

export function getApiErrorMessage(error) {
  return error?.response?.data?.error?.message || error?.message || 'Erro ao conectar com o servidor.';
}

export function mapDisciplina(row) {
  return {
    id: String(row.id_disciplina),
    idDisciplina: row.id_disciplina,
    codigo: row.codigo_disciplina,
    nome: row.nome_disciplina,
    faltas: Number(row.numero_faltas || 0),
    notaFinal: row.nota_final ? String(row.nota_final) : '',
    situacao: row.situacao || '',
    nota1: Number(row.nota1 || 0),
    nota2: Number(row.nota2 || 0),
    nota3: Number(row.nota3 || 0),
    notaNecessariaPf: row.nota_necessaria_pf,
    listaNotas: [
      { id: '1', label: 'Nota1', valor: row.nota1 ? String(row.nota1) : '' },
      { id: '2', label: 'Nota2', valor: row.nota2 ? String(row.nota2) : '' },
      { id: '3', label: 'Nota3', valor: row.nota3 ? String(row.nota3) : '' },
    ],
  };
}

export function mapAtividade(row) {
  return {
    id: String(row.id_atividade),
    idAtividade: row.id_atividade,
    nome: row.topico_estudo,
    data: row.data_atividade,
    disciplina: row.nome_disciplina || row.codigo_disciplina || '',
    idDisciplina: row.id_disciplina,
    status: row.concluida ? 'concluida' : 'pendente',
    feita: Boolean(row.concluida),
    tipoAtividade: row.tipo_atividade,
  };
}

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function setAuthToken(token) {
  if (token) {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  } else {
    await AsyncStorage.removeItem(TOKEN_KEY);
  }
}

export const authApi = {
  async register(data) {
    const response = await api.post('/auth/register', data);
    await setAuthToken(response.data.token);
    return response.data;
  },

  async login(email, senha) {
    const response = await api.post('/auth/login', { email, senha });
    await setAuthToken(response.data.token);
    return response.data;
  },

  logout() {
    return setAuthToken(null);
  },
};

export const userApi = {
  me: () => api.get('/users/me').then((response) => response.data),
  update: (data) => api.patch('/users/me', data).then((response) => response.data),
  preferences: () => api.get('/users/me/preferences').then((response) => response.data),
  savePreferences: (data) =>
    api.put('/users/me/preferences', data).then((response) => response.data),
};

export const disciplineApi = {
  list: () => api.get('/disciplines').then((response) => response.data.map(mapDisciplina)),
  create: (data) => api.post('/disciplines', data).then((response) => mapDisciplina(response.data)),
  update: (id, data) => api.patch(`/disciplines/${id}`, data).then((response) => mapDisciplina(response.data)),
  remove: (id) => api.delete(`/disciplines/${id}`),
  saveGrades: (id, data) =>
    api.put(`/disciplines/${id}/grades`, data).then((response) => response.data),
  saveAbsences: (id, data) =>
    api.put(`/disciplines/${id}/absences`, data).then((response) => response.data),
};

export const activityApi = {
  list: () => api.get('/activities').then((response) => response.data.map(mapAtividade)),
  create: (data) => api.post('/activities', data).then((response) => mapAtividade(response.data)),
  update: (id, data) => api.patch(`/activities/${id}`, data).then((response) => mapAtividade(response.data)),
  remove: (id) => api.delete(`/activities/${id}`),
};

export const scheduleApi = {
  list: () => api.get('/schedules').then((response) => response.data),
  create: (data) => api.post('/schedules', data).then((response) => response.data),
  update: (id, data) => api.patch(`/schedules/${id}`, data).then((response) => response.data),
  remove: (id) => api.delete(`/schedules/${id}`),
  listClassTimes: () => api.get('/class-times').then((response) => response.data),
  createClassTime: (data) => api.post('/class-times', data).then((response) => response.data),
  removeClassTime: (id) => api.delete(`/class-times/${id}`),
};

export const reminderApi = {
  list: () => api.get('/reminders').then((response) => response.data),
  create: (data) => api.post('/reminders', data).then((response) => response.data),
  update: (id, data) => api.patch(`/reminders/${id}`, data).then((response) => response.data),
  remove: (id) => api.delete(`/reminders/${id}`),
};

export const aiApi = {
  analyzeProgress: () => api.post('/ai/progress').then((response) => response.data),
  logs: () => api.get('/ai/logs').then((response) => response.data),
};

export default api;
