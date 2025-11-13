// Tipos do AgroVisita

export interface Cliente {
  id: string;
  nomeProdutor: string;
  nomeFazenda: string;
  localizacao: string;
  latitude?: number;
  longitude?: number;
  telefone: string;
  email: string;
  whatsapp?: string;
  culturaPrincipal: string;
  areaCultivada: number; // em hectares
  tipoSistema: 'convencional' | 'organico' | 'plantio-direto' | 'cultivo-minimo' | 'ilp' | 'ilpf' | 'agroflorestal' | 'hidroponico' | 'outro';
  dataCadastro: string;
}

export interface CondicoesClimaticas {
  temperatura?: number;
  chuva: 'sim' | 'nao' | 'garoa';
  mmChuva?: number; // milímetros de chuva
  umidade?: number;
  vento: 'fraco' | 'moderado' | 'forte';
}

export interface Diagnostico {
  estadoNutricional: string;
  pragas: string;
  doencas: string;
  plantasDaninhas: string;
  condicoesSolo: string;
  manejo: string;
}

export interface Recomendacoes {
  adubacao: string;
  aplicacoesFitossanitarias: string;
  manejoIrrigacao: string;
  observacoesGerais: string;
}

export interface Visita {
  id: string;
  dataVisita: string;
  responsavelTecnico: string;
  empresa: string;
  clienteId: string;
  clienteNome: string; // denormalizado para facilitar busca
  fazendaNome: string;
  cultura: string;
  variedade: string;
  estadioFenologico: string;
  condicoesClimaticas: CondicoesClimaticas;
  diagnostico: Diagnostico;
  recomendacoes: Recomendacoes;
  fotos: string[]; // URLs das fotos
  latitude?: number;
  longitude?: number;
  status: 'rascunho' | 'concluida';
  dataCriacao: string;
}

export interface DashboardStats {
  visitasMes: number;
  propriedadesVisitadas: number;
  principaisCulturas: { cultura: string; count: number }[];
  ultimasVisitas: Visita[];
}
