import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import avatarIcon from '../images/avatar.png';

const ModalIntegrantesProjeto = ({ open, onClose, integrante }) => {
  if (!integrante) return null;

  const { nome, minibio, email, lattes, linkedin, github, outras_redes } = integrante;

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div className="fixed inset-0 bg-black bg-opacity-30" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all relative">
                <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600">
                  <XMarkIcon className="h-6 w-6" />
                </button>

                <div className="flex flex-col items-center text-center">
                  <img src={avatarIcon} alt="Avatar" className="w-24 h-24 rounded-full mb-4" />
                  <Dialog.Title as="h3" className="text-lg font-bold text-gray-900">
                    {nome}
                  </Dialog.Title>
                  <p className="text-gray-700 mt-2 mb-4">{minibio}</p>
                  <p className="text-sm text-gray-600">Contato: <a className="text-blue-600 underline" href={`mailto:${email}`}>{email}</a></p>

                  <div className="mt-4 flex flex-wrap justify-center gap-3">
                    {lattes && <a href={lattes} target="_blank" rel="noopener noreferrer" className="text-blue-600">Lattes</a>}
                    {linkedin && <a href={linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600">LinkedIn</a>}
                    {github && <a href={github} target="_blank" rel="noopener noreferrer" className="text-blue-600">GitHub</a>}
                    {outras_redes && <a href={outras_redes} target="_blank" rel="noopener noreferrer" className="text-blue-600">Rede Social</a>}
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ModalIntegrantesProjeto;
