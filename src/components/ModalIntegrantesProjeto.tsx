import React from "react";
import { Dialog } from "@headlessui/react";
import {
  X,
  Linkedin,
  Github,
  BookOpenText,
  UsersRound,
} from "lucide-react";

interface Integrante {
  Nome: string;
  Minibio: string;
  Email: string;
  Lattes?: string;
  GitHub?: string;
  LinkedIn?: string;
  RedeSocial?: string;
  Foto?: string;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  integrante: Integrante | null;
}

const ModalIntegrantesProjeto: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  integrante,
}) => {
  if (!integrante) return null;

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
          {/* Botão Fechar */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>

          {/* Foto */}
          {integrante.Foto && (
            <div className="flex justify-center -mt-14 mb-4">
              <img
                src={integrante.Foto}
                alt={`Foto de ${integrante.Nome}`}
                className="w-24 h-24 rounded-full border-4 border-white shadow-md"
              />
            </div>
          )}

          {/* Nome */}
          <Dialog.Title className="text-center text-2xl font-semibold">
            {integrante.Nome}
          </Dialog.Title>

          {/* Minibio */}
          <div className="mt-2 text-center">
            <p className="font-medium text-gray-700">Minibio</p>
            <p className="text-gray-600">{integrante.Minibio}</p>
          </div>

          {/* Contato */}
          <div className="mt-2 text-center">
            <p className="font-medium text-gray-700">E-mail/Contato</p>
            <p className="text-gray-600">{integrante.Email}</p>
          </div>

          {/* Links com ícones */}
          <div className="mt-6 grid grid-cols-2 gap-4 px-4">
            {integrante.Lattes && (
              <a
                href={integrante.Lattes}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 text-blue-600 hover:underline"
              >
                <BookOpenText size={20} />
                Lattes
              </a>
            )}
            {integrante.GitHub && (
              <a
                href={integrante.GitHub}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 text-blue-600 hover:underline"
              >
                <Github size={20} />
                GitHub
              </a>
            )}
            {integrante.LinkedIn && (
              <a
                href={integrante.LinkedIn}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 text-blue-600 hover:underline"
              >
                <Linkedin size={20} />
                LinkedIn
              </a>
            )}
            {integrante.RedeSocial && (
              <a
                href={integrante.RedeSocial}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 text-blue-600 hover:underline"
              >
                <UsersRound size={20} />
                Rede Social
              </a>
            )}
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default ModalIntegrantesProjeto;
