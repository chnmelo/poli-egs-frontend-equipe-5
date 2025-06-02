import { Table } from "react-bootstrap";
import HeaderAdmin from "../../components/HeaderAdmin";
import { useEffect, useState } from "react";
import axios from "axios";
import ModalResponderDuvida from "../../components/ModalResponderDuvida.tsx";
import ModalDeleteDuvida from "../../components/ModalDeleteDuvida.tsx";
import React from 'react';

interface DuvidaType {
    id: string;
    titulo: string;
    postado: boolean;
    mensagem: string;
    autor: string;
    email: string;
    resposta?: string;
    data_de_envio;
}

const columns = [
    { key: "titulo", label: "Título" },
    { key: "status", label: "Status" },
    { key: "acoes", label: "Ações" },
];

function GestaoAdmin() {
    const [Input, setInput] = useState<string>("");
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [Duvida, setDuvida] = useState<DuvidaType[]>([]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInput(event.target.value);
    };

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_url_backend}/duvidas/`)
            .then(response => {
                console.log("DÚVIDAS RECEBIDAS:", response.data);

                const duvidas = response.data.duvidas;
                const email = localStorage.getItem("email")
                var duvidas_ordenadas = []
                for (var i = 0; i < duvidas.length; i++){
                    if(duvidas[i].visualizacoes.includes(email)) {
                        duvidas_ordenadas.push(duvidas[i]);
                    } else {
                        duvidas_ordenadas.unshift(duvidas[i]);
                    }
                }
                setDuvida(duvidas_ordenadas || []);

            })
            .catch(error => console.error('Erro ao buscar dúvidas:', error));
    }, []);

    /*checar se ta funcionando posteriormente*/
    function togglePublicacao(duvida: { id: string; postado: boolean }) {
        const token = localStorage.getItem('authToken');
        if (!token) {
            console.error('Token não encontrado');
            return;
        }

        axios.put(
            `${import.meta.env.VITE_url_backend}/duvida_publicado/${duvida.id}/?id_token=${token}`,
            null,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        )
            .then(() => {
                setDuvida(prev =>
                    prev.map(duvidaItem =>
                        duvidaItem.id === duvida.id ? { ...duvidaItem, postado: !duvidaItem.postado } : duvidaItem
                    )
                );
            })
            .catch(error => console.error('Erro ao atualizar status:', error));
    }
    /*checar se ta funcionando posteriormente*/

    const handleUpdate = () => {
        axios.get(`${import.meta.env.VITE_url_backend}/duvidas/`).then(response => {
            setDuvida(response.data.duvidas || []);
        }).catch(error => {
            console.error('Erro ao atualizar duvida', error);
        });
    };

    const handleVisualizacao = (duvida) => {
        const token = localStorage.getItem('authToken');
        const email = localStorage.getItem('email');

        if (duvida.visualizacoes.includes(email)) { return; }

        axios.put(`${import.meta.env.VITE_url_backend}/duvida_visualizacao/${duvida.id}/${email}/?id_token=${token}`, null,{
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then(response => {
            console.log(response.data)
            duvida.visualizacoes.push(email)
        })
        .catch(error => console.log(error))

        
    }

    const filteredDuvida = Array.isArray(Duvida) ? Duvida.filter((duvida) => {
        const input = Input.toLowerCase();
        return (
            duvida.titulo?.toLowerCase().includes(input) ||
            duvida.email?.toLowerCase().includes(input) ||
            duvida.autor?.toLowerCase().includes(input)
        );
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
                        <React.Fragment key={duvida.id}>
                            <tr className="border border-light-color">
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
                                                handleVisualizacao(duvida);
                                            }
                                        }}
                                    >
                                        {column.key === "acoes" ? (
                                            <div className="flex justify-center items-center gap-4">
                                                <ModalResponderDuvida duvida={duvida} handleUpdate={handleUpdate}/>
                                                <ModalDeleteDuvida
                                                    id={duvida.id}
                                                    title={duvida.titulo}
                                                    handleUpdate={() => {}}
                                                />
                                            </div>
                                        ) : column.key === "status" ? (
                                            <div className="flex items-center justify-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    checked={duvida.postado}
                                                    onChange={() => togglePublicacao(duvida)}
                                                />
                                                <span className="text-sm">Postado</span>
                                            </div>
                                        ) : column.key === "titulo" ? (
                                            duvida.visualizacoes.includes(localStorage.getItem("email")) ?
                                                duvida.titulo : <strong>{duvida.titulo}</strong>
                                        ) : null}
                                    </td>
                                ))}
                            </tr>
                            {expandedId === duvida.id && (
                              <tr className="bg-gray-100">
                                <td colSpan={columns.length} className="p-4 text-left text-gray-800">
                                  <strong>Mensagem:</strong> {duvida.mensagem}
                                  <br />
                                  <strong>Autor:</strong> {duvida.autor}
                                  <br />
                                  <strong>E-mail:</strong> {duvida.email}
                                  <br />
                                  <strong>Resposta:</strong> {duvida.resposta || "Ainda não respondida."}
                                  <br />
                                  <strong>Data de envio:</strong> {new Date(duvida.data_de_envio).toLocaleDateString('pt-BR')}
                                  <br />
                                  <strong>Hora de envio:</strong> {new Date(duvida.data_de_envio).toLocaleTimeString('pt-BR', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </td>
                              </tr>
                            )}
                        </React.Fragment>
                    ))}
                    </tbody>
                </Table>
            </div>
        </>
    );
}

export default GestaoAdmin;
