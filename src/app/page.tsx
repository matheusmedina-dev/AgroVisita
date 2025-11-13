'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, TrendingUp, Users, MapPin, Sprout, Calendar, User, FileText } from 'lucide-react';
import { getDashboardStats } from '@/lib/storage';
import type { DashboardStats } from '@/lib/types';
import Navbar from '@/components/custom/navbar';

export default function HomePage() {
  const [stats, setStats] = useState<DashboardStats>({
    visitasMes: 0,
    propriedadesVisitadas: 0,
    principaisCulturas: [],
    ultimasVisitas: [],
  });

  useEffect(() => {
    setStats(getDashboardStats());
  }, []);

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
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">Dashboard</h1>
            <p className="text-gray-600">Acompanhe suas visitas agronômicas</p>
          </div>
          
          <Link
            href="/visitas/nova"
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all shadow-lg hover:shadow-xl hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            Nova Visita
          </Link>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
          {/* Visitas do Mês */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 p-3 rounded-xl">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-3xl font-bold text-gray-800">{stats.visitasMes}</span>
            </div>
            <h3 className="text-gray-600 font-medium">Visitas este mês</h3>
          </div>

          {/* Propriedades Visitadas */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-emerald-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-emerald-100 p-3 rounded-xl">
                <MapPin className="w-6 h-6 text-emerald-600" />
              </div>
              <span className="text-3xl font-bold text-gray-800">{stats.propriedadesVisitadas}</span>
            </div>
            <h3 className="text-gray-600 font-medium">Propriedades visitadas</h3>
          </div>

          {/* Principais Culturas */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-amber-500 hover:shadow-xl transition-shadow sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-amber-100 p-3 rounded-xl">
                <Sprout className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="text-gray-800 font-semibold text-lg">Principais Culturas</h3>
            </div>
            <div className="space-y-2">
              {stats.principaisCulturas.length > 0 ? (
                stats.principaisCulturas.slice(0, 3).map((item, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <span className="text-gray-700 capitalize">{item.cultura}</span>
                    <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full font-semibold">
                      {item.count}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">Nenhuma visita registrada</p>
              )}
            </div>
          </div>
        </div>

        {/* Últimas Visitas */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Últimas Visitas</h2>
            <Link
              href="/visitas"
              className="text-green-600 hover:text-green-700 font-semibold text-sm hover:underline"
            >
              Ver todas
            </Link>
          </div>

          {stats.ultimasVisitas.length > 0 ? (
            <div className="space-y-4">
              {stats.ultimasVisitas.map((visita) => (
                <div
                  key={visita.id}
                  className="p-4 border border-gray-200 rounded-xl hover:border-green-500 hover:shadow-md transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="w-4 h-4 text-gray-500" />
                        <h3 className="font-semibold text-gray-800">{visita.clienteNome}</h3>
                        <span className="text-gray-500 text-sm">• {visita.fazendaNome}</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Sprout className="w-4 h-4" />
                          <span className="capitalize">{visita.cultura}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(visita.dataVisita)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          <span>{visita.responsavelTecnico}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          visita.status === 'concluida'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {visita.status === 'concluida' ? 'Concluída' : 'Rascunho'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 mb-4">Nenhuma visita registrada ainda</p>
              <Link
                href="/visitas/nova"
                className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-semibold"
              >
                <Plus className="w-4 h-4" />
                Registrar primeira visita
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
