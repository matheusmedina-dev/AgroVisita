'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, MapPin } from 'lucide-react';
import { saveCliente } from '@/lib/storage';
import type { Cliente } from '@/lib/types';
import Navbar from '@/components/custom/navbar';

export default function NovoClientePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nomeProdutor: '',
    nomeFazenda: '',
    localizacao: '',
    telefone: '',
    email: '',
    whatsapp: '',
    culturaPrincipal: '',
    areaCultivada: '',
    tipoSistema: 'convencional' as Cliente['tipoSistema'],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGetLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setFormData((prev) => ({
            ...prev,
            localizacao: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
          }));
          alert('Localização capturada com sucesso!');
        },
        (error) => {
          alert('Erro ao obter localização: ' + error.message);
        }
      );
    } else {
      alert('Geolocalização não disponível neste navegador');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const cliente: Cliente = {
      id: Date.now().toString(),
      nomeProdutor: formData.nomeProdutor,
      nomeFazenda: formData.nomeFazenda,
      localizacao: formData.localizacao,
      telefone: formData.telefone,
      email: formData.email,
      whatsapp: formData.whatsapp,
      culturaPrincipal: formData.culturaPrincipal,
      areaCultivada: parseFloat(formData.areaCultivada),
      tipoSistema: formData.tipoSistema,
      dataCadastro: new Date().toISOString(),
    };

    saveCliente(cliente);
    setLoading(false);
    router.push('/clientes');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <Navbar />

      <main className="container mx-auto px-4 py-6 sm:py-8 max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/clientes"
            className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-semibold mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">Novo Cliente</h1>
          <p className="text-gray-600">Cadastre uma nova propriedade rural</p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
          <div className="space-y-6">
            {/* Dados do Produtor */}
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-green-500">
                Dados do Produtor
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nome do Produtor *
                  </label>
                  <input
                    type="text"
                    name="nomeProdutor"
                    value={formData.nomeProdutor}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                    placeholder="Ex: João Silva"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nome da Fazenda *
                  </label>
                  <input
                    type="text"
                    name="nomeFazenda"
                    value={formData.nomeFazenda}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                    placeholder="Ex: Fazenda Santa Rita"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Localização *
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      name="localizacao"
                      value={formData.localizacao}
                      onChange={handleChange}
                      required
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                      placeholder="Ex: Cidade, Estado ou coordenadas"
                    />
                    <button
                      type="button"
                      onClick={handleGetLocation}
                      className="px-4 py-3 bg-green-100 text-green-700 rounded-xl hover:bg-green-200 transition-all"
                      title="Capturar GPS"
                    >
                      <MapPin className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Telefone *
                  </label>
                  <input
                    type="tel"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                    placeholder="(00) 00000-0000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    WhatsApp
                  </label>
                  <input
                    type="tel"
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                    placeholder="(00) 00000-0000"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">E-mail</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                    placeholder="email@exemplo.com"
                  />
                </div>
              </div>
            </div>

            {/* Dados da Propriedade */}
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-green-500">
                Dados da Propriedade
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Cultura Principal *
                  </label>
                  <input
                    type="text"
                    name="culturaPrincipal"
                    value={formData.culturaPrincipal}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                    placeholder="Ex: Soja, Milho, Café"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Área Cultivada (ha) *
                  </label>
                  <input
                    type="number"
                    name="areaCultivada"
                    value={formData.areaCultivada}
                    onChange={handleChange}
                    required
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                    placeholder="Ex: 50.5"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tipo de Sistema de Cultivo *
                  </label>
                  <select
                    name="tipoSistema"
                    value={formData.tipoSistema}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all bg-white"
                  >
                    <option value="convencional">Convencional</option>
                    <option value="plantio-direto">Plantio Direto</option>
                    <option value="cultivo-minimo">Cultivo Mínimo</option>
                    <option value="organico">Orgânico</option>
                    <option value="ilp">ILP (Integração Lavoura-Pecuária)</option>
                    <option value="ilpf">ILPF (Integração Lavoura-Pecuária-Floresta)</option>
                    <option value="agroflorestal">Sistema Agroflorestal</option>
                    <option value="hidroponico">Hidropônico</option>
                    <option value="outro">Outro</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Botões */}
          <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t border-gray-200">
            <Link
              href="/clientes"
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all text-center"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-5 h-5" />
              {loading ? 'Salvando...' : 'Salvar Cliente'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
