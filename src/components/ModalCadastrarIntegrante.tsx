import { useState } from "react";
import { Dialog, DialogTitle, DialogPanel, DialogBackdrop } from "@headlessui/react";
import { FaFileUpload } from "react-icons/fa";

export default function ModalCadastrarIntegrante({ integrantes, setIntegrantes, onClose }) {
  const [open, setOpen] = useState(false);

  const [nomeCompleto, setNomeCompleto] = useState("");
  const [foto, setFoto] = useState(null);
  const [minibio, setMinibio] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [github, setGithub] = useState("");
  const [lattes, setLattes] = useState("");
  const [email, setEmail] = useState("");

  const isFormValid =
    nomeCompleto.trim() &&
    minibio.trim() &&
    linkedin.trim() &&
    lattes.trim() &&
    email.trim();

  const handleAdd = () => {
    if (!isFormValid) return;

    const novoIntegrante = {
      nomeCompleto,
      foto,
      minibio,
      linkedin,
      github,
      lattes,
      email,
    };

    setIntegrantes([...integrantes, novoIntegrante]);

    setNomeCompleto("");
    setFoto(null);
    setMinibio("");
    setLinkedin("");
    setGithub("");
    setLattes("");
    setEmail("");
    setOpen(false);
    if(onClose) onClose();
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-md bg-primary-color px-4 py-2 text-white hover:bg-blue-700 transition"
      >
        + Adicionar integrante
      </button>

      <Dialog open={open} onClose={setOpen} className="relative z-50">
        <DialogBackdrop className="fixed inset-0 bg-black bg-opacity-50" />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="w-full max-w-xl rounded-lg bg-white shadow-lg">
            <div className="bg-[#D8DBE2] pt-5 sm:p-3 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                  <DialogTitle as="h2" className="text-lg font-semibold leading-6 text-dark-color">
                    Cadastrar novo integrante
                  </DialogTitle>
                </div>
              </div>
            </div>

            <form className="px-6 pt-4 grid grid-cols-2 gap-y-[2vh] gap-x-6">
              <div>
                <h3 className="text-lg font-semibold">
                  Nome completo <span className="text-red-500">*</span>
                </h3>
                <input
                  type="text"
                  placeholder="Nome completo"
                  value={nomeCompleto}
                  onChange={(e) => setNomeCompleto(e.target.value)}
                  className="focus:outline-none border-b-2 w-full"
                />
              </div>

              <div className="relative w-full">
                <input
                  type="file"
                  accept="image/*"
                  id="foto"
                  className="hidden"
                  onChange={(e) => setFoto(e.target.files[0])}
                />
                <label
                  htmlFor="foto"
                  className={`flex items-center px-3 py-2 rounded-md w-full text-dark-color text-xs font-semibold cursor-pointer select-none bg-[#D8DBE2] hover:opacity-60`}
                  style={{
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                  }}
                  title={foto ? foto.name : "Enviar Foto"}
                >
                  {foto ? "Modificar Foto" : "Enviar Foto"}
                  <FaFileUpload className="ml-2" />
                </label>
              </div>

              <div className="col-span-2">
                <h3 className="text-lg font-semibold">
                  Minibio <span className="text-red-500">*</span>
                </h3>
                <textarea
                  rows={3}
                  placeholder="Breve descrição"
                  value={minibio}
                  onChange={(e) => setMinibio(e.target.value)}
                  className="focus:outline-none border-b-2 w-full"
                />
              </div>

              <div>
                <h3 className="text-lg font-semibold">
                  LinkedIn <span className="text-red-500">*</span>
                </h3>
                <input
                  type="url"
                  placeholder="URL do LinkedIn"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  className="focus:outline-none border-b-2 w-full"
                />
              </div>

              <div>
                <h3 className="text-lg font-semibold">GitHub (opcional)</h3>
                <input
                  type="url"
                  placeholder="URL do GitHub"
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                  className="focus:outline-none border-b-2 w-full"
                />
              </div>

              <div>
                <h3 className="text-lg font-semibold">
                  Lattes <span className="text-red-500">*</span>
                </h3>
                <input
                  type="url"
                  placeholder="URL do Lattes"
                  value={lattes}
                  onChange={(e) => setLattes(e.target.value)}
                  className="focus:outline-none border-b-2 w-full"
                />
              </div>

              <div>
                <h3 className="text-lg font-semibold">
                  E-mail ou contato <span className="text-red-500">*</span>
                </h3>
                <input
                  type="email"
                  placeholder="Email institucional"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="focus:outline-none border-b-2 w-full"
                />
              </div>
            </form>

            <div className="bg-gray-50 px-6 py-4 sm:flex sm:flex-row-reverse sm:px-6 mt-6">
              <button
                type="button"
                disabled={!isFormValid}
                onClick={handleAdd}
                className={`inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto ${
                  isFormValid ? "bg-primary-color hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                Adicionar
              </button>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  if(onClose) onClose();
                }}
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
              >
                Cancelar
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}