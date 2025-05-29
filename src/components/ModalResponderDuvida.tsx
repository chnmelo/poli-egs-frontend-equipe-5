import {
    Dialog,
    DialogBackdrop,
    DialogPanel,
    DialogTitle
} from "@headlessui/react";
import { useState } from "react";
import { DuvidaInt } from "../pages/Admin/Gestao";
import axios from "axios";

export default function ModalResponderDuvida({ duvida }: { duvida: DuvidaInt }) {
    const [open, setOpen] = useState(false);
    const handleShow = () => setOpen(true);

    const [UpdatedDuvida, setUpdatedDuvida] = useState({
        id: duvida.id || "",
        titulo: duvida.titulo || "",
        mensagem: duvida.mensagem || "",
        autor: duvida.autor || "",
        email: duvida.email|| "",
        visualizacoes: duvida.visualizacoes|| "Pendente",
        publicado: duvida.publicado|| "Privado",
        resposta: duvida.resposta|| "",
    });

    const handleUpdateDuvida = () => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            console.error('Token não encontrado. Usuário não está autenticado.');
            return;
        }

        const UpdatedDuvidaWithDefaults = {
            id: duvida.id || "",
            titulo: duvida.titulo || "",
            mensagem: duvida.mensagem || "",
            autor: duvida.autor || "",
            email: duvida.email|| "",
            visualizacoes: UpdatedDuvida.visualizacoes|| "Pendente",
            publicado: UpdatedDuvida.publicado|| "Privado",
            resposta: UpdatedDuvida.resposta|| "",
        };

        axios.put(`${import.meta.env.VITE_url_backend}/duvidas_add/${duvida.id}?id_token=${token}`, UpdatedDuvidaWithDefaults, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        })
            .then(() => {
                window.location.reload();
                setOpen(false);
            })
            .catch(error => {
                console.error('Erro ao atualizar duvida:', error.response ? error.response.data : error.message);
            });
    };

    return (
        <>
            <button
                onClick={handleShow}
                className="bg-primary-color text-white px-5 py-2 rounded-md shadow-md font-semibold transition duration-300 flex items-center justify-center gap-2 min-w-[120px]"
            >
                Responder
            </button>


            <Dialog open={open} onClose={setOpen} className="relative z-10">
                <DialogBackdrop className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-[40vw]">
                            <div className="bg-[#D8DBE2] pt-5 sm:p-4 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                        <DialogTitle as="h2" className="text-lg font-semibold leading-6 text-dark-color">
                                            Responder: {duvida.titulo}
                                        </DialogTitle>
                                    </div>
                                </div>
                            </div>

                            <form onSubmit={(e) => e.preventDefault()}>
                                <div className="grid grid-cols-2 justify-start pt-4 px-6 gap-y-[2vh]">
                                    {[
                                        { label: "Título", key: "titulo", placeholder: "" },
                                        { label: "Mensagem", key: "mensagem", placeholder: "" },
                                        { label: "Autor", key: "autor", placeholder: "" },
                                        { label: "E-mail", key: "email", placeholder: "" },
                                        { label: "Resposta", key: "resposta", placeholder: "", type: "" },
                                    ].map(({ label, key, placeholder, type = "text" }) => (
                                        <div key={key}>
                                            <h3 className="text-lg font-semibold">{label}</h3>
                                            <input
                                                type={type}
                                                name={key}
                                                id={key}
                                                placeholder={placeholder}
                                                value={UpdatedDuvida[key as keyof typeof UpdatedDuvida] as string}
                                                className="focus:outline-none border-b-2 w-[15vw]"
                                                onChange={(e) => setUpdatedDuvida({
                                                    ...UpdatedDuvida,
                                                    [key]: e.target.value
                                                })}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </form>

                            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                <button
                                    type="button"
                                    onClick={handleUpdateDuvida}
                                    className="inline-flex w-full justify-center rounded-md bg-primary-color px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-neutral-400 sm:ml-3 sm:w-auto"
                                >
                                    Enviar
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setOpen(false)}
                                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </DialogPanel>
                    </div>
                </div>
            </Dialog>
        </>
    );
}
