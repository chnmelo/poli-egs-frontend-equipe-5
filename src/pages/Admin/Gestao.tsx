import { Table } from "react-bootstrap";
import HeaderAdmin from "../../components/HeaderAdmin";
import { useEffect, useState } from "react";
import axios from "axios";
import ModalResponderDuvida from "../../components/ModalResponderDuvida.tsx";
import ModalDeleteDuvida from "../../components/ModalDeleteDuvida.tsx";

const columns = [
    { key: "titulo", label: "Título" },
    { key: "status", label: "Status" },
    { key: "acoes", label: "Ações" },
];

function GestaoAdmin() {
    const [Input, setInput] = useState<string>("");
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [Duvida, setDuvida] = useState([]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInput(event.target.value);
    };

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_url_backend}/duvidas/`)
            .then(response => {
                console.log("DÚVIDAS RECEBIDAS:", response.data);
                setDuvida(response.data.duvidas || []);

            })
            .catch(error => console.error('Erro ao buscar dúvidas:', error));
    }, []);

    /*checar se ta funcionando*/
    const handleApprove = (duvida) => {
        const token = localStorage.getItem('authToken');
        axios.put(`${import.meta.env.VITE_url_backend}/duvida_publicado/${duvida.id}/`, null, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })
            .then(() => handleUpdate())
            .catch(error => console.error('Erro ao publicar resposta:', error));
    };
    /*checar se ta funcionando*/
    const handleReprove = (duvida) => {
        const token = localStorage.getItem('authToken');
        axios.put(`${import.meta.env.VITE_url_backend}/duvida_publicado/${duvida.id}/`, null, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })
            .then(() => window.location.reload())
            .catch(error => console.error('Erro ao privar resposta:', error));
    };
    /*checar se ta funcionando*/

    const handleUpdate = () => {
        axios.get(`${import.meta.env.VITE_url_backend}/duvidas/`).then(response => {
            setDuvida(response.data.duvidas);
        }).catch(error => {
            console.error('Erro ao atualizar duvida', error);
        });
    };
    /*checar se ta funcionando*/

    const filteredDuvida = Array.isArray(Duvida) ? Duvida.filter((duvida) => {
        const input = Input.toLowerCase();
        return duvida.titulo?.toLowerCase().includes(input);
    }) : [];

    return (

        <>
            <HeaderAdmin />
            <div className="flex flex-col px-[13vw] pt-10 gap-6">
                <section className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-start text-dark-color">Gestão de Dúvidas e Sugestões</h1>
                </section>
                <input
                    type="search"
                    name="searchbar"
                    id="searchbar"
                    className="rounded-full w-full h-[5vh] border border-light-color indent-2 bg-[#D8DBE2]"
                    placeholder="Pesquise por título, nome ou e-mail"
                    value={Input}
                    onChange={handleInputChange}
                />
            </div>
            <div className="px-[13vw] pt-10">
                <Table className="h-auto w-full">
                    <thead>
                    <tr>
                        {columns.map((column) => (
                            <th
                                key={column.key}
                                className={`py-3 ${
                                    column.key === "titulo" ? "text-left pl-3" : "text-center"
                                }`}
                            >
                                {column.label}
                            </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {filteredDuvida.map((duvida) => (
                        <>
                            <tr key={duvida.id} className="border border-light-color">
                                {columns.map((column) => (
                                    <td
                                        key={column.key}
                                        className={`py-3 ${
                                            column.key === "titulo"
                                                ? "text-left pl-3 cursor-pointer hover:underline"
                                                : column.key === "acoes"
                                                    ? "text-center"
                                                    : "text-right pr-3"
                                        }`}
                                        onClick={() => {
                                            if (column.key === "titulo") {
                                                setExpandedId(expandedId === duvida.id ? null : duvida.id);
                                            }
                                        }}
                                    >
                                        {column.key === "acoes" ? (
                                            <div className="flex justify-center items-center gap-4">
                                                <ModalResponderDuvida duvida={duvida} />
                                                <ModalDeleteDuvida
                                                    id={duvida.id}
                                                    title={duvida.titulo}
                                                    handleUpdate={() => {}}
                                                />
                                            </div>
                                        ) : column.key === "status" ? (
                                            <label className="flex items-center gap-2 justify-end">
                                                <input
                                                    type="checkbox"
                                                    checked={duvida.publicado === true}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            handleApprove(duvida);
                                                        } else {
                                                            handleReprove(duvida);
                                                        }
                                                    }}
                                                />
                                                Postado
                                            </label>
                                        ) : column.key === "titulo" ? (
                                            duvida.titulo
                                        ) : null}
                                    </td>
                                ))}
                            </tr>
                            {expandedId === duvida.id && (
                                <tr key={`msg-${duvida.id}`} className="bg-gray-100">
                                    <td colSpan={columns.length} className="p-4 text-left text-gray-800">
                                        <strong>Mensagem:</strong> {duvida.mensagem}
                                        <br />
                                        <strong>Autor:</strong> {duvida.autor} — <strong>Email:</strong> {duvida.email}
                                        <br />
                                        <strong>Resposta:</strong> {duvida.resposta || "Ainda não respondida."}
                                    </td>
                                </tr>
                            )}
                        </>
                    ))}
                    </tbody>
                </Table>
            </div>
        </>
    );
}

export default GestaoAdmin;
