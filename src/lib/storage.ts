// Gerenciamento de dados local (localStorage)
import { Cliente, Visita, DashboardStats } from './types';

const STORAGE_KEYS = {
  CLIENTES: 'agrovisita_clientes',
  VISITAS: 'agrovisita_visitas',
};

// Clientes
export const getClientes = (): Cliente[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEYS.CLIENTES);
  return data ? JSON.parse(data) : [];
};

export const saveCliente = (cliente: Cliente): void => {
  const clientes = getClientes();
  const index = clientes.findIndex(c => c.id === cliente.id);
  if (index >= 0) {
    clientes[index] = cliente;
  } else {
    clientes.push(cliente);
  }
  localStorage.setItem(STORAGE_KEYS.CLIENTES, JSON.stringify(clientes));
};

export const getClienteById = (id: string): Cliente | undefined => {
  return getClientes().find(c => c.id === id);
};

export const deleteCliente = (id: string): void => {
  const clientes = getClientes().filter(c => c.id !== id);
  localStorage.setItem(STORAGE_KEYS.CLIENTES, JSON.stringify(clientes));
};

// Visitas
export const getVisitas = (): Visita[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEYS.VISITAS);
  return data ? JSON.parse(data) : [];
};

export const saveVisita = (visita: Visita): void => {
  const visitas = getVisitas();
  const index = visitas.findIndex(v => v.id === visita.id);
  if (index >= 0) {
    visitas[index] = visita;
  } else {
    visitas.push(visita);
  }
  localStorage.setItem(STORAGE_KEYS.VISITAS, JSON.stringify(visitas));
};

export const getVisitaById = (id: string): Visita | undefined => {
  return getVisitas().find(v => v.id === id);
};

export const getVisitasByCliente = (clienteId: string): Visita[] => {
  return getVisitas().filter(v => v.clienteId === clienteId);
};

export const deleteVisita = (id: string): void => {
  const visitas = getVisitas().filter(v => v.id !== id);
  localStorage.setItem(STORAGE_KEYS.VISITAS, JSON.stringify(visitas));
};

// Dashboard Stats
export const getDashboardStats = (): DashboardStats => {
  const visitas = getVisitas();
  const clientes = getClientes();
  
  // Visitas do mês atual
  const now = new Date();
  const mesAtual = now.getMonth();
  const anoAtual = now.getFullYear();
  
  const visitasMes = visitas.filter(v => {
    const dataVisita = new Date(v.dataVisita);
    return dataVisita.getMonth() === mesAtual && dataVisita.getFullYear() === anoAtual;
  }).length;
  
  // Propriedades visitadas (únicas) no mês
  const propriedadesVisitadas = new Set(
    visitas
      .filter(v => {
        const dataVisita = new Date(v.dataVisita);
        return dataVisita.getMonth() === mesAtual && dataVisita.getFullYear() === anoAtual;
      })
      .map(v => v.clienteId)
  ).size;
  
  // Principais culturas
  const culturasMap = new Map<string, number>();
  visitas.forEach(v => {
    const count = culturasMap.get(v.cultura) || 0;
    culturasMap.set(v.cultura, count + 1);
  });
  
  const principaisCulturas = Array.from(culturasMap.entries())
    .map(([cultura, count]) => ({ cultura, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
  
  // Últimas 5 visitas
  const ultimasVisitas = [...visitas]
    .sort((a, b) => new Date(b.dataVisita).getTime() - new Date(a.dataVisita).getTime())
    .slice(0, 5);
  
  return {
    visitasMes,
    propriedadesVisitadas,
    principaisCulturas,
    ultimasVisitas,
  };
};

// Busca
export const searchVisitas = (query: string): Visita[] => {
  const visitas = getVisitas();
  const lowerQuery = query.toLowerCase();
  
  return visitas.filter(v => 
    v.clienteNome.toLowerCase().includes(lowerQuery) ||
    v.fazendaNome.toLowerCase().includes(lowerQuery) ||
    v.cultura.toLowerCase().includes(lowerQuery) ||
    v.responsavelTecnico.toLowerCase().includes(lowerQuery)
  );
};
