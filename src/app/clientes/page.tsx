'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Search, MapPin, Phone, Mail, Trash2 } from 'lucide-react';
import { getClientes, deleteCliente } from '@/lib/storage';
import type { Cliente } from '@/lib/types';
import Navbar from '@/components/custom/navbar';

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredClientes, setFilteredClientes] = useState<Cliente[]>([]);

  useEffect(() => {
    loadClientes();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredClientes(clientes);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredClientes(
        clientes.filter(
          (c) =>
            c.nomeProdutor.toLowerCase().includes(query) ||
            c.nomeFazenda.toLowerCase().includes(query) ||
            c.culturaPrincipal.toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, clientes]);

  const loadClientes = () => {
    setClientes(getClientes());
  };

  const handleDelete = (id: string, nome: string) => {
    if (confirm(`Deseja realmente excluir o cliente "${nome}"?`)) {
      deleteCliente(id);
      loadClientes();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <Navbar />

      <main className="container mx-auto px-4 py-6 sm:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">Clientes</h1>
            <p className="text-gray-600">Gerencie suas propriedades rurais</p>
          </div>

          <Link
            href="/clientes/novo"
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all shadow-lg hover:shadow-xl hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            Novo Cliente
          </Link>
        </div>

        {/* Busca */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por produtor, fazenda ou cultura..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>

        {/* Lista de Clientes */}
        {filteredClientes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClientes.map((cliente) => (
              <div
                key={cliente.id}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all border-t-4 border-green-500"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-1">
                      {cliente.nomeProdutor}
                    </h3>
                    <p className="text-gray-600 font-medium">{cliente.nomeFazenda}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(cliente.id, cliente.nomeProdutor)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-all"
                    title="Excluir cliente"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4 text-green-600" />
                    <span>{cliente.localizacao}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4 text-green-600" />
                    <span>{cliente.telefone}</span>
                  </div>

                  {cliente.email && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4 text-green-600" />
                      <span className="truncate">{cliente.email}</span>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <p className="text-gray-500">Cultura Principal</p>
                      <p className="font-semibold text-gray-800 capitalize">
                        {cliente.culturaPrincipal}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-500">Área</p>
                      <p className="font-semibold text-gray-800">{cliente.areaCultivada} ha</p>
                    </div>
                  </div>

                  <div className="mt-3">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        cliente.tipoSistema === 'organico'
                          ? 'bg-green-100 text-green-700'
                          : cliente.tipoSistema === 'ilp'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {cliente.tipoSistema === 'organico'
                        ? 'Orgânico'
                        : cliente.tipoSistema === 'ilp'
                        ? 'ILP'
                        : cliente.tipoSistema === 'convencional'
                        ? 'Convencional'
                        : 'Outro'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 mb-4">
              {searchQuery ? 'Nenhum cliente encontrado' : 'Nenhum cliente cadastrado ainda'}
            </p>
            {!searchQuery && (
              <Link
                href="/clientes/novo"
                className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-semibold"
              >
                <Plus className="w-4 h-4" />
                Cadastrar primeiro cliente
              </Link>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
