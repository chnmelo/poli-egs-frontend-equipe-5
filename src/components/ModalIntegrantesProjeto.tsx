import React from 'react';

interface IntegranteProps {
  isOpen: boolean;
  onClose: () => void;
  integrante: {
    Nome?: string;
    Minibio?: string;
    Foto?: string;
    Lattes?: string;
    LinkedIn?: string;
    GitHub?: string;
    Contato?: string;
  } | null;
}

const ModalIntegrantesProjeto: React.FC<IntegranteProps> = ({ isOpen, onClose, integrante }) => {
  if (!isOpen || !integrante) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-md relative shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl font-bold"
        >
          ✕
        </button>

        {/* Foto de perfil */}
        {integrante.Foto && (
          <img
            src={integrante.Foto}
            alt={`Foto de ${integrante.Nome}`}
            className="w-32 h-32 rounded-full object-cover mx-auto mb-4"
          />
        )}

        {/* Nome */}
        {integrante.Nome && (
          <h2 className="text-2xl font-bold text-center mb-2">{integrante.Nome}</h2>
        )}

        {/* Mini bio */}
        {integrante.Minibio && (
          <p className="text-center text-gray-700 mb-4">{integrante.Minibio}</p>
        )}

        {/* Links clicáveis */}
        <div className="flex flex-col gap-2 text-center">
          {integrante.Lattes && (
            <a
              href={integrante.Lattes}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Currículo Lattes
            </a>
          )}
          {integrante.LinkedIn && (
            <a
              href={integrante.LinkedIn}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Perfil no LinkedIn
            </a>
          )}
          {integrante.GitHub && (
            <a
              href={integrante.GitHub}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              GitHub
            </a>
          )}
          {integrante.Contato && (
            <a
              href={integrante.Contato.includes('@') ? `mailto:${integrante.Contato}` : integrante.Contato}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Contato
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModalIntegrantesProjeto;