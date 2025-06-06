import { useState } from "react";

export default function ModalCadastrarIntegrante({ adicionarIntegrante }) {
  const [nome, setNome] = useState("");
  const [open, setOpen] = useState(false);

  const handleAdd = () => {
    if (nome.trim() !== "") {
      adicionarIntegrante(nome.trim());
      setNome("");
      setOpen(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="px-3 py-1 bg-primary-color text-white rounded"
      >
        + Adicionar
      </button>

      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-[300px]">
            <h3 className="text-lg font-semibold mb-4">Adicionar integrante</h3>
            <input
              type="text"
              placeholder="Nome do integrante"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="border p-2 w-full mb-4 rounded"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 border rounded"
              >
                Cancelar
              </button>
              <button
                onClick={handleAdd}
                className="px-4 py-2 bg-primary-color text-white rounded"
              >
                Adicionar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
