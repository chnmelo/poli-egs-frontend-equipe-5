import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { XMarkIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import axios from 'axios';

interface ModalPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  data: any; // Objeto com os dados do artigo ou produto
  type: 'artigo' | 'produto';
}

export default function ModalPreview({ isOpen, onClose, title, data, type }: ModalPreviewProps) {
  if (!data) return null;

  const handleDownload = async () => {
    const endpoint = type === 'artigo' ? 'view_pdf_artigo' : 'view_pdf_produto';
    try {
      const response = await axios.get(`${import.meta.env.VITE_url_backend}/${endpoint}/${data.id}`);
      const url = response.data.url;
      if (url) {
        window.open(url, '_blank');
      } else {
        alert('URL do arquivo não encontrada.');
      }
    } catch (error) {
      console.error('Erro ao obter o arquivo:', error);
      alert('Erro ao abrir o arquivo.');
    }
  };

  // Função auxiliar para renderizar listas (equipe, palavras-chave)
  const renderList = (list: any[]) => {
    if (Array.isArray(list) && list.length > 0) {
      return list.join(', ');
    }
    return 'Não informado';
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-900/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 sm:my-8 sm:w-full sm:max-w-4xl"
          >
            {/* Header */}
            <div className="bg-primary-color px-4 py-3 sm:px-6 flex justify-between items-center">
              <DialogTitle as="h3" className="text-lg font-semibold leading-6 text-white">
                Visualizar: {title}
              </DialogTitle>
              <button
                type="button"
                className="text-white hover:text-gray-300 focus:outline-none"
                onClick={onClose}
              >
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>

            {/* Body */}
            <div className="px-4 py-5 sm:p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              
              {/* Título e Status */}
              <div className="border-b pb-4">
                <h2 className="text-2xl font-bold text-gray-900">{data.titulo}</h2>
                <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset mt-2 ${
                  data.revisado === 'Aprovado' || data.status === 'Aprovado' 
                    ? 'bg-green-50 text-green-700 ring-green-600/20' 
                    : (data.revisado === 'Reprovado' || data.status === 'Reprovado')
                    ? 'bg-red-50 text-red-700 ring-red-600/20'
                    : 'bg-yellow-50 text-yellow-800 ring-yellow-600/20'
                }`}>
                  {data.revisado || data.status || 'Status Desconhecido'}
                </span>
              </div>

              {/* Detalhes Principais */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Equipe/Autores</h4>
                  <p className="mt-1 text-sm text-gray-900">{renderList(data.equipe)}</p>
                </div>

                {type === 'artigo' && (
                  <>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Área de Pesquisa</h4>
                      <p className="mt-1 text-sm text-gray-900">{data.tema || 'Não informado'}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Data/Semestre</h4>
                      <p className="mt-1 text-sm text-gray-900">{data.data || 'Não informado'}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Palavras-chave</h4>
                      <p className="mt-1 text-sm text-gray-900">{renderList(data.palavras_chave)}</p>
                    </div>
                  </>
                )}

                {type === 'produto' && (
                  <>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Tipo de Produto</h4>
                      <p className="mt-1 text-sm text-gray-900">{data.tipo || 'Não informado'}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Semestre</h4>
                      <p className="mt-1 text-sm text-gray-900">{data.semestre || 'Não informado'}</p>
                    </div>
                  </>
                )}
              </div>

              {/* Descrição e Resumo */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Descrição</h4>
                  <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-md">
                    {data.descricao || 'Sem descrição.'}
                  </p>
                </div>

                {type === 'artigo' && data.resumo && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Resumo</h4>
                    <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-md">
                      {data.resumo}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Footer com Ação */}
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="button"
                className="inline-flex w-full justify-center rounded-md bg-primary-color px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 sm:ml-3 sm:w-auto items-center gap-2"
                onClick={handleDownload}
              >
                <ArrowDownTrayIcon className="h-4 w-4" />
                Visualizar Arquivo
              </button>
              <button
                type="button"
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                onClick={onClose}
              >
                Fechar
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}