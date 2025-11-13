'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, MapPin, Cloud, Droplets, Wind, Thermometer, CloudRain } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/custom/navbar';
import PhotoUpload from '@/components/custom/photo-upload';

export default function NovaVisitaPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [clientes, setClientes] = useState<any[]>([]);
  const [selectedCliente, setSelectedCliente] = useState<any | null>(null);
  const [photos, setPhotos] = useState<string[]>([]);
  const [user, setUser] = useState<any>(null);

  const [formData, setFormData] = useState({
    dataVisita: new Date().toISOString().split('T')[0],
    responsavelTecnico: '',
    empresa: '',
    clienteId: '',
    cultura: '',
    variedade: '',
    estadioFenologico: '',
    // Condições climáticas
    temperatura: '',
    chuva: 'nao' as 'sim' | 'nao' | 'garoa',
    mmChuva: '',
    umidade: '',
    vento: 'fraco' as 'fraco' | 'moderado' | 'forte',
    // Diagnóstico
    estadoNutricional: '',
    pragas: '',
    doencas: '',
    plantasDaninhas: '',
    condicoesSolo: '',
    manejo: '',
    // Recomendações
    adubacao: '',
    aplicacoesFitossanitarias: '',
    manejoIrrigacao: '',
    observacoesGerais: '',
    // Localização
    latitude: '',
    longitude: '',
  });

  useEffect(() => {
    checkAuth();
    loadClientes();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/login');
    } else {
      setUser(user);
    }
  };

  const loadClientes = async () => {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .order('nome_produtor', { ascending: true });

    if (data) {
      setClientes(data);
    }
  };

  useEffect(() => {
    if (formData.clienteId) {
      const cliente = clientes.find((c) => c.id === formData.clienteId);
      setSelectedCliente(cliente || null);
    } else {
      setSelectedCliente(null);
    }
  }, [formData.clienteId, clientes]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
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
            latitude: latitude.toFixed(6),
            longitude: longitude.toFixed(6),
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

  const handleSubmit = async (e: React.FormEvent, status: 'rascunho' | 'concluida') => {
    e.preventDefault();
    setLoading(true);

    if (!selectedCliente) {
      alert('Selecione um cliente');
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('visitas')
        .insert([
          {
            data_visita: formData.dataVisita,
            responsavel_tecnico: formData.responsavelTecnico,
            empresa: formData.empresa,
            cliente_id: formData.clienteId,
            cliente_nome: selectedCliente.nome_produtor,
            fazenda_nome: selectedCliente.nome_fazenda,
            cultura: formData.cultura,
            variedade: formData.variedade,
            estadio_fenologico: formData.estadioFenologico,
            temperatura: formData.temperatura ? parseFloat(formData.temperatura) : null,
            chuva: formData.chuva,
            mm_chuva: formData.mmChuva ? parseFloat(formData.mmChuva) : null,
            umidade: formData.umidade ? parseFloat(formData.umidade) : null,
            vento: formData.vento,
            estado_nutricional: formData.estadoNutricional,
            pragas: formData.pragas,
            doencas: formData.doencas,
            plantas_daninhas: formData.plantasDaninhas,
            condicoes_solo: formData.condicoesSolo,
            manejo: formData.manejo,
            adubacao: formData.adubacao,
            aplicacoes_fitossanitarias: formData.aplicacoesFitossanitarias,
            manejo_irrigacao: formData.manejoIrrigacao,
            observacoes_gerais: formData.observacoesGerais,
            fotos: photos,
            latitude: formData.latitude ? parseFloat(formData.latitude) : null,
            longitude: formData.longitude ? parseFloat(formData.longitude) : null,
            status,
            user_id: user?.id,
          },
        ])
        .select();

      if (error) throw error;

      alert('Visita salva com sucesso!');
      router.push('/visitas');
    } catch (error: any) {
      alert('Erro ao salvar visita: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <Navbar />

      <main className="container mx-auto px-4 py-6 sm:py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/visitas"
            className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-semibold mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">Nova Visita</h1>
          <p className="text-gray-600">Registre uma nova visita agronômica</p>
        </div>

        {/* Formulário */}
        <form className="space-y-6">
          {/* Informações Básicas */}
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-green-500">
              Informações Básicas
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Data da Visita *
                </label>
                <input
                  type="date"
                  name="dataVisita"
                  value={formData.dataVisita}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Responsável Técnico *
                </label>
                <input
                  type="text"
                  name="responsavelTecnico"
                  value={formData.responsavelTecnico}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                  placeholder="Seu nome"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Empresa</label>
                <input
                  type="text"
                  name="empresa"
                  value={formData.empresa}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                  placeholder="Nome da empresa"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Cliente / Propriedade *
                </label>
                <select
                  name="clienteId"
                  value={formData.clienteId}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all bg-white"
                >
                  <option value="">Selecione um cliente</option>
                  {clientes.map((cliente) => (
                    <option key={cliente.id} value={cliente.id}>
                      {cliente.nome_produtor} - {cliente.nome_fazenda}
                    </option>
                  ))}
                </select>
              </div>

              {clientes.length === 0 && (
                <div className="sm:col-span-2 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                  <p className="text-sm text-yellow-800">
                    Nenhum cliente cadastrado.{' '}
                    <Link href="/clientes/novo" className="font-semibold underline">
                      Cadastre um cliente primeiro
                    </Link>
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Cultura */}
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-green-500">
              Cultura
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Cultura *
                </label>
                <input
                  type="text"
                  name="cultura"
                  value={formData.cultura}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                  placeholder="Ex: Soja, Milho"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Variedade
                </label>
                <input
                  type="text"
                  name="variedade"
                  value={formData.variedade}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                  placeholder="Ex: BRS 123"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Estádio Fenológico *
                </label>
                <input
                  type="text"
                  name="estadioFenologico"
                  value={formData.estadioFenologico}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                  placeholder="Ex: V4, R1"
                />
              </div>
            </div>
          </div>

          {/* Condições Climáticas */}
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-green-500 flex items-center gap-2">
              <Cloud className="w-6 h-6 text-green-600" />
              Condições Climáticas
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                  <Thermometer className="w-4 h-4" />
                  Temperatura (°C)
                </label>
                <input
                  type="number"
                  name="temperatura"
                  value={formData.temperatura}
                  onChange={handleChange}
                  step="0.1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                  placeholder="Ex: 25.5"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                  <Droplets className="w-4 h-4" />
                  Chuva
                </label>
                <select
                  name="chuva"
                  value={formData.chuva}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all bg-white"
                >
                  <option value="nao">Não</option>
                  <option value="garoa">Garoa</option>
                  <option value="sim">Sim</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                  <CloudRain className="w-4 h-4" />
                  Precipitação (mm)
                </label>
                <input
                  type="number"
                  name="mmChuva"
                  value={formData.mmChuva}
                  onChange={handleChange}
                  step="0.1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                  placeholder="Ex: 15.5"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Umidade (%)
                </label>
                <input
                  type="number"
                  name="umidade"
                  value={formData.umidade}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                  placeholder="Ex: 70"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                  <Wind className="w-4 h-4" />
                  Vento
                </label>
                <select
                  name="vento"
                  value={formData.vento}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all bg-white"
                >
                  <option value="fraco">Fraco</option>
                  <option value="moderado">Moderado</option>
                  <option value="forte">Forte</option>
                </select>
              </div>
            </div>
          </div>

          {/* Diagnóstico */}
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-green-500">
              Diagnóstico Geral
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Estado Nutricional das Plantas
                </label>
                <textarea
                  name="estadoNutricional"
                  value={formData.estadoNutricional}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all resize-none"
                  placeholder="Descreva o estado nutricional observado..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Pragas</label>
                  <textarea
                    name="pragas"
                    value={formData.pragas}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all resize-none"
                    placeholder="Pragas identificadas..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Doenças
                  </label>
                  <textarea
                    name="doencas"
                    value={formData.doencas}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all resize-none"
                    placeholder="Doenças identificadas..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Plantas Daninhas
                </label>
                <textarea
                  name="plantasDaninhas"
                  value={formData.plantasDaninhas}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all resize-none"
                  placeholder="Plantas daninhas presentes..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Condições do Solo
                  </label>
                  <textarea
                    name="condicoesSolo"
                    value={formData.condicoesSolo}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all resize-none"
                    placeholder="Observações sobre o solo..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Manejo Atual
                  </label>
                  <textarea
                    name="manejo"
                    value={formData.manejo}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all resize-none"
                    placeholder="Práticas de manejo observadas..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Recomendações */}
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-green-500">
              Recomendações Técnicas
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Adubação / Correção do Solo
                </label>
                <textarea
                  name="adubacao"
                  value={formData.adubacao}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all resize-none"
                  placeholder="Recomendações de adubação..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Aplicações Fitossanitárias
                </label>
                <textarea
                  name="aplicacoesFitossanitarias"
                  value={formData.aplicacoesFitossanitarias}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all resize-none"
                  placeholder="Produtos e dosagens recomendadas..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Manejo de Irrigação / Cobertura
                </label>
                <textarea
                  name="manejoIrrigacao"
                  value={formData.manejoIrrigacao}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all resize-none"
                  placeholder="Recomendações de irrigação..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Observações Gerais
                </label>
                <textarea
                  name="observacoesGerais"
                  value={formData.observacoesGerais}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all resize-none"
                  placeholder="Outras observações importantes..."
                />
              </div>
            </div>
          </div>

          {/* Localização e Fotos */}
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-green-500">
              Localização e Fotos
            </h2>

            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Latitude
                  </label>
                  <input
                    type="text"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                    placeholder="-15.123456"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Longitude
                  </label>
                  <input
                    type="text"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                    placeholder="-47.123456"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleGetLocation}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-green-100 text-green-700 rounded-xl hover:bg-green-200 transition-all font-semibold"
              >
                <MapPin className="w-5 h-5" />
                Capturar Localização GPS
              </button>

              {/* Upload de Fotos */}
              <PhotoUpload photos={photos} onPhotosChange={setPhotos} maxPhotos={10} />
            </div>
          </div>

          {/* Botões */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/visitas"
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all text-center"
            >
              Cancelar
            </Link>
            <button
              type="button"
              onClick={(e) => handleSubmit(e, 'rascunho')}
              disabled={loading}
              className="flex-1 px-6 py-3 border-2 border-green-600 text-green-600 rounded-xl font-semibold hover:bg-green-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Salvar Rascunho
            </button>
            <button
              type="button"
              onClick={(e) => handleSubmit(e, 'concluida')}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-5 h-5" />
              {loading ? 'Salvando...' : 'Concluir Visita'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
