'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Search, Calendar, User, Sprout, FileText, Trash2 } from 'lucide-react';
import { getVisitas, deleteVisita } from '@/lib/storage';
import type { Visita } from '@/lib/types';
import Navbar from '@/components/custom/navbar';

export default function VisitasPage() {
  const [visitas, setVisitas] = useState<Visita[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredVisitas, setFilteredVisitas] = useState<Visita[]>([]);

  useEffect(() => {
    loadVisitas();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredVisitas(visitas);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredVisitas(
        visitas.filter(
          (v) =>
            v.clienteNome.toLowerCase().includes(query) ||
            v.fazendaNome.toLowerCase().includes(query) ||
            v.cultura.toLowerCase().includes(query) ||
            v.responsavelTecnico.toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, visitas]);

  const loadVisitas = () => {
    const allVisitas = getVisitas();
    // Ordenar por data mais recente
    allVisitas.sort((a, b) => new Date(b.dataVisita).getTime() - new Date(a.dataVisita).getTime());
    setVisitas(allVisitas);
  };

  const handleDelete = (id: string, clienteNome: string) => {
    if (confirm(`Deseja realmente excluir a visita de "${clienteNome}"?`)) {
      deleteVisita(id);
      loadVisitas();
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <Navbar />

      <main className="container mx-auto px-4 py-6 sm:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">Visitas</h1>
            <p className="text-gray-600">Histórico de visitas agronômicas</p>
          </div>

          <Link
            href="/visitas/nova"
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all shadow-lg hover:shadow-xl hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            Nova Visita
          </Link>
        </div>

        {/* Busca */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por cliente, fazenda, cultura ou técnico..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>

        {/* Lista de Visitas */}
        {filteredVisitas.length > 0 ? (
          <div className="space-y-4">
            {filteredVisitas.map((visita) => (
              <div
                key={visita.id}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all border-l-4 border-green-500"
              >
                <div className="flex flex-col gap-4">
                  {/* Informações principais */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800 mb-1">
                          {visita.clienteNome}
                        </h3>
                        <p className="text-gray-600 font-medium">{visita.fazendaNome}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            visita.status === 'concluida'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}
                        >
                          {visita.status === 'concluida' ? 'Concluída' : 'Rascunho'}
                        </span>
                        <button
                          onClick={() => handleDelete(visita.id, visita.clienteNome)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-all"
                          title="Excluir visita"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4 text-green-600" />
                        <span>{formatDate(visita.dataVisita)}</span>
                      </div>

                      <div className="flex items-center gap-2 text-gray-600">
                        <User className="w-4 h-4 text-green-600" />
                        <span>{visita.responsavelTecnico}</span>
                      </div>

                      <div className="flex items-center gap-2 text-gray-600">
                        <Sprout className="w-4 h-4 text-green-600" />
                        <span className="capitalize">{visita.cultura}</span>
                      </div>

                      <div className="flex items-center gap-2 text-gray-600">
                        <FileText className="w-4 h-4 text-green-600" />
                        <span>{visita.estadioFenologico}</span>
                      </div>
                    </div>

                    {/* Diagnóstico */}
                    {visita.diagnostico && (
                      <div className="mt-4 space-y-2">
                        <h4 className="font-semibold text-gray-800 text-sm">Diagnóstico:</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                          {visita.diagnostico.estadoNutricional && (
                            <div className="p-2 bg-blue-50 rounded-lg">
                              <span className="font-medium text-blue-700">Nutricional: </span>
                              <span className="text-gray-700">{visita.diagnostico.estadoNutricional}</span>
                            </div>
                          )}
                          {visita.diagnostico.pragas && (
                            <div className="p-2 bg-red-50 rounded-lg">
                              <span className="font-medium text-red-700">Pragas: </span>
                              <span className="text-gray-700">{visita.diagnostico.pragas}</span>
                            </div>
                          )}
                          {visita.diagnostico.doencas && (
                            <div className="p-2 bg-orange-50 rounded-lg">
                              <span className="font-medium text-orange-700">Doenças: </span>
                              <span className="text-gray-700">{visita.diagnostico.doencas}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Recomendações */}
                    {visita.recomendacoes.observacoesGerais && (
                      <div className="mt-3 p-3 bg-green-50 rounded-lg">
                        <h4 className="font-semibold text-gray-800 text-sm mb-1">Observações:</h4>
                        <p className="text-sm text-gray-700 line-clamp-2">
                          {visita.recomendacoes.observacoesGerais}
                        </p>
                      </div>
                    )}

                    {/* Condições Climáticas */}
                    {visita.condicoesClimaticas && (
                      <div className="mt-3 flex flex-wrap gap-2 text-xs">
                        {visita.condicoesClimaticas.temperatura && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded">
                            🌡️ {visita.condicoesClimaticas.temperatura}
                          </span>
                        )}
                        {visita.condicoesClimaticas.chuva && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded">
                            🌧️ {visita.condicoesClimaticas.chuva}
                          </span>
                        )}
                        {visita.condicoesClimaticas.umidade && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded">
                            💧 {visita.condicoesClimaticas.umidade}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 mb-4">
              {searchQuery ? 'Nenhuma visita encontrada' : 'Nenhuma visita registrada ainda'}
            </p>
            {!searchQuery && (
              <Link
                href="/visitas/nova"
                className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-semibold"
              >
                <Plus className="w-4 h-4" />
                Registrar primeira visita
              </Link>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
