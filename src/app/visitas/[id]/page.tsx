'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, User, Sprout, MapPin, Thermometer, Droplets, Wind, CloudRain, Image as ImageIcon } from 'lucide-react';
import { getVisitaById } from '@/lib/storage';
import type { Visita } from '@/lib/types';
import Navbar from '@/components/custom/navbar';

export default function VisitaDetalhesPage() {
  const params = useParams();
  const router = useRouter();
  const [visita, setVisita] = useState<Visita | null>(null);

  useEffect(() => {
    if (params.id) {
      const visitaData = getVisitaById(params.id as string);
      if (visitaData) {
        setVisita(visitaData);
      } else {
        router.push('/visitas');
      }
    }
  }, [params.id, router]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  if (!visita) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <p className="text-gray-500">Carregando...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <Navbar />

      <main className="container mx-auto px-4 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar
          </button>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
                Detalhes da Visita
              </h1>
              <p className="text-gray-600">{visita.clienteNome} - {visita.fazendaNome}</p>
            </div>
            
            <span
              className={`px-4 py-2 rounded-full text-sm font-semibold self-start sm:self-center ${
                visita.status === 'concluida'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-yellow-100 text-yellow-700'
              }`}
            >
              {visita.status === 'concluida' ? 'Concluída' : 'Rascunho'}
            </span>
          </div>
        </div>

        {/* Informações Principais */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-green-100 p-3 rounded-xl">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Data da Visita</p>
                <p className="font-semibold text-gray-800">{formatDate(visita.dataVisita)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-100 p-3 rounded-xl">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Responsável Técnico</p>
                <p className="font-semibold text-gray-800">{visita.responsavelTecnico}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-amber-100 p-3 rounded-xl">
                <Sprout className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Cultura</p>
                <p className="font-semibold text-gray-800 capitalize">{visita.cultura}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Detalhes da Cultura */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Informações da Cultura</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Variedade</p>
              <p className="font-semibold text-gray-800">{visita.variedade || 'Não informado'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Estádio Fenológico</p>
              <p className="font-semibold text-gray-800">{visita.estadioFenologico}</p>
            </div>
          </div>
        </div>

        {/* Condições Climáticas */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Condições Climáticas</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {visita.condicoesClimaticas.temperatura && (
              <div className="flex items-center gap-3">
                <Thermometer className="w-5 h-5 text-red-500" />
                <div>
                  <p className="text-xs text-gray-500">Temperatura</p>
                  <p className="font-semibold text-gray-800">{visita.condicoesClimaticas.temperatura}°C</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3">
              <Droplets className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-xs text-gray-500">Chuva</p>
                <p className="font-semibold text-gray-800 capitalize">
                  {visita.condicoesClimaticas.chuva === 'sim' ? 'Sim' : visita.condicoesClimaticas.chuva === 'nao' ? 'Não' : 'Garoa'}
                </p>
              </div>
            </div>
            {visita.condicoesClimaticas.mmChuva !== undefined && (
              <div className="flex items-center gap-3">
                <CloudRain className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-xs text-gray-500">Precipitação</p>
                  <p className="font-semibold text-gray-800">{visita.condicoesClimaticas.mmChuva} mm</p>
                </div>
              </div>
            )}
            {visita.condicoesClimaticas.umidade && (
              <div className="flex items-center gap-3">
                <Droplets className="w-5 h-5 text-cyan-500" />
                <div>
                  <p className="text-xs text-gray-500">Umidade</p>
                  <p className="font-semibold text-gray-800">{visita.condicoesClimaticas.umidade}%</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3">
              <Wind className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-xs text-gray-500">Vento</p>
                <p className="font-semibold text-gray-800 capitalize">
                  {visita.condicoesClimaticas.vento === 'fraco' ? 'Fraco' : visita.condicoesClimaticas.vento === 'moderado' ? 'Moderado' : 'Forte'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Fotos da Visita */}
        {visita.fotos && visita.fotos.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <ImageIcon className="w-6 h-6 text-purple-600" />
              <h2 className="text-xl font-bold text-gray-800">Fotos da Visita</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {visita.fotos.map((foto, index) => (
                <div key={index} className="relative aspect-square rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow">
                  <img
                    src={foto}
                    alt={`Foto ${index + 1} da visita`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Diagnóstico */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Diagnóstico Geral</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">Estado Nutricional</p>
              <p className="text-gray-600">{visita.diagnostico.estadoNutricional || 'Não informado'}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">Pragas</p>
              <p className="text-gray-600">{visita.diagnostico.pragas || 'Não informado'}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">Doenças</p>
              <p className="text-gray-600">{visita.diagnostico.doencas || 'Não informado'}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">Plantas Daninhas</p>
              <p className="text-gray-600">{visita.diagnostico.plantasDaninhas || 'Não informado'}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">Condições do Solo</p>
              <p className="text-gray-600">{visita.diagnostico.condicoesSolo || 'Não informado'}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">Manejo</p>
              <p className="text-gray-600">{visita.diagnostico.manejo || 'Não informado'}</p>
            </div>
          </div>
        </div>

        {/* Recomendações */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Recomendações Técnicas</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">Adubação / Correção do Solo</p>
              <p className="text-gray-600">{visita.recomendacoes.adubacao || 'Não informado'}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">Aplicações Fitossanitárias</p>
              <p className="text-gray-600">{visita.recomendacoes.aplicacoesFitossanitarias || 'Não informado'}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">Manejo de Irrigação</p>
              <p className="text-gray-600">{visita.recomendacoes.manejoIrrigacao || 'Não informado'}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">Observações Gerais</p>
              <p className="text-gray-600">{visita.recomendacoes.observacoesGerais || 'Não informado'}</p>
            </div>
          </div>
        </div>

        {/* Localização GPS */}
        {(visita.latitude && visita.longitude) && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="w-6 h-6 text-green-600" />
              <h2 className="text-xl font-bold text-gray-800">Localização GPS</h2>
            </div>
            <p className="text-gray-600">
              Latitude: {visita.latitude}, Longitude: {visita.longitude}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
