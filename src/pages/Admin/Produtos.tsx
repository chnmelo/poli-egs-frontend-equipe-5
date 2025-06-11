import { Table } from "react-bootstrap";
import HeaderAdmin from "../../components/HeaderAdmin";
import { SetStateAction, useEffect, useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import ModalDeleteProduto from "../../components/ModalDeleteProduto";
import ModalUpdateProduto from "../../components/ModalUpdateProduto";
import { FaFileUpload } from "react-icons/fa";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const columns = [
  { key: "titulo", label: "Titulo" },
  { key: "editar", label: "Editar" },
  { key: "excluir", label: "Excluir" },
  { key: "status", label: "Status" },
  { key: "botao", label: "" },
  { key: "botao2", label: "" },
];

function ProdutosAdmin () {
  const [Input, setInput] = useState<string>("");
  const [file, setFile] = useState<File | undefined>();  
  const [changedTitle, setChangedTitle] = useState(true);
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {setInput(event.target.value);};
  const [Produto, setProduto] = useState([]);
  const [open, setOpen] = useState(false)
  const [formValid, setFormValid] = useState(false);
  const [NewProduto, setNewProduto] = useState({
    titulo: '',
    descricao: '',
    equipe: [] as string[],
    tipo: '',
    semestre: '',
    id: '',
    arquivo: '#',
    status: "",
  })

  const userIsAdmin = localStorage.getItem('isAdmin') === 'true'; // Verificando se o usuário é admin no localStorage
  if (!userIsAdmin) {
    // Se não for admin, redireciona para a página de usuário
    return <Navigate to="/user-produtos" />;
  }

  const validateFormWithData = (produtoData) => {
    const requiredFields = [
      'titulo',
      'tipo',
      'descricao',
      'equipe',
      'semestre',
      'arquivo'
    ];

    return requiredFields.every(field => {
      const value = produtoData[field];
      if (typeof value === 'string') {
        return value.trim() !== '';
      } else if (Array.isArray(value)) {
        return value.length > 0;
      }
      return false;
    });
  };

  const validateForm = () => {
    return validateFormWithData(NewProduto);
  };
    
  // Função para atualizar o NewProject e verificar a validação
  const handleChangeProduto = (field, value) => {
    const updatedProduto = {...NewProduto, [field]: value};   // Primeira atualização do estado
    setNewProduto(updatedProduto);
    const isValid = validateFormWithData(updatedProduto);    // Validação imediata com o estado atualizado
    setFormValid(isValid);
  };
  
    const handleUpdate = () => {
    axios.get(`${import.meta.env.VITE_url_backend}/produtos/`).then(response => {
      setProduto(response.data);
    }).catch(error => {
      console.error('Erro ao atualizar produto', error.response.data.detail || '');
    });
  };

  async function uploadPdf(e: React.FormEvent<HTMLInputElement>) {
    const target = e.target as HTMLInputElement & {
      files: FileList;
    };
    setFile(target.files[0]);
  }

  const handleApprove = (produto) => {
    const token = localStorage.getItem('authToken');
    axios.put(`${import.meta.env.VITE_url_backend}/produto_revisado/${produto.id}/?novo_revisado=Aprovado&id_token=${token}`, null,{
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then(response => {window.location.reload();
      })
        .catch(error => console.error('Erro ao aprovar produto:', error));
  }

  const handleReprove = (produto) => {
    const token = localStorage.getItem('authToken');
    axios.put(`${import.meta.env.VITE_url_backend}/produto_revisado/${produto.id}/?novo_revisado=Reprovado&id_token=${token}`, null,{
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then(response => {

        window.location.reload();
      })
        .catch(error => console.error('Erro ao reprovar produto:', error));
  }

  const handlePdfUpload = (id: string) => {
      const formData = new FormData();
      formData.append('file', file);
      axios.post(`${import.meta.env.VITE_url_backend}/upload_pdf_artigo/${id}/`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
      })
      .then(response => {
        window.location.reload();
        setOpen(false);
      })
      .catch(error => console.log('Erro ao fazer upload do PDF:', error))
  }

  const handlePost = () => {
    const token = localStorage.getItem('authToken');

    if (!token) {
      alert('Token de autenticação não encontrado.');
      return;
    }

     // Verificar novamente se todos os campos obrigatórios estão preenchidos
    if (!validateForm()) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
  
    // Função auxiliar para converter string em array
    const stringToArray = (value) => {
      return typeof value === 'string' && value.trim() 
        ? value.split(',').map(item => item.trim()) 
        : [];
    };

    // Conversão usando a função auxiliar
    const equipeArray = stringToArray(NewProduto.equipe);

    // Atualiza os dados do projeto com os arrays processados
    const NewProdutoWithDefaults = {
      id: NewProduto.id || "default-id",
      titulo: NewProduto.titulo,
      tipo: NewProduto.tipo,
      descricao: NewProduto.descricao,
      equipe: equipeArray,
      semestre: NewProduto.semestre,
      arquivo: NewProduto.arquivo || '#',
      status: NewProduto.status || "Pendente",
    };

    axios.post(`${import.meta.env.VITE_url_backend}/produtos_add?id_token=${token}`, NewProdutoWithDefaults, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
    .then(response => {
      handlePdfUpload(response.data.produto.id)
      toast.success("Produto cadastrado com sucesso!");
    })
      .catch(error => {
      setChangedTitle(false)
      toast.error(`Erro ao adicionar artigo: ${error.response.data.detail}`)});
  };
  
  useEffect(() => {
    if (open) {
      // Quando o modal é aberto, verifica a validade do formulário
      setFormValid(validateForm());
    } else {
      // Quando o modal é fechado, reset do NewProject para o estado inicial
      setNewProduto({
        titulo: "",
        descricao: "",
        equipe: "",
        tipo: "",
        semestre: "",
        id: "",
        arquivo: '#',
        status: "",
      });
    }
  }, [open]);


//
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_url_backend}/produtos/`).then(function (response) {
      setProduto(response.data)



    })
  }, []);

  const filteredProduto = Array.isArray(Produto.produtos) ? Produto.produtos.filter((produto) => {
    const input = Input.toLowerCase();
    return (
      produto.titulo?.toLowerCase().includes(input) ||
      produto.tipo?.toLowerCase().includes(input)
    );
  }) : [];

  const semesterGenerator = (): string[] => {
    const current = new Date();
    const currentYear = current.getFullYear();
    const currentMonth = current.getMonth();

    const semesters: string[] = [];

    for (let year = 2023; year <= currentYear; year++) {
      semesters.push(`${year}.1`);
      if (year < currentYear || currentMonth >= 6) {
        semesters.push(`${year}.2`);
      }
    }

    return semesters.reverse();
    };

  return (
    <>
      <HeaderAdmin />
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
    />
      <div className="flex flex-col px-[13vw] pt-10 gap-6">
        <section className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-start text-dark-color">Produtos</h1>
          <button
            type="submit"
            onClick={() => setOpen(true)}
            className="rounded-md bg-primary-color h-full w-[15vw] text-white"
          >
            Novo produto
          </button>
        </section>
        <input
          type="search"
          name="searchbar"
          id="searchbar"
          className="rounded-full w-full h-[5vh] border border-light-color indent-2 bg-[#D8DBE2]"
          placeholder="Pesquise por título, tipo de produto"
          value={Input}
          onChange={handleInputChange}
        />
      </div>
      <div className="px-[13vw] pt-10">
        <Table className="h-auto w-full">
          <thead>
            {columns.map((column) => (
              <th
                key={column.key}
                className={column.key === "titulo" ? "text-left" : "text-right"}
              >
                {column.label}
              </th>
            ))}
          </thead>
          <tbody>
            {filteredProduto.map((produto) => (
              <tr key={produto.id} className="border border-light-color">
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={`items-center py-3 ${
                      column.key === "titulo" ? "text-left pl-3" : "text-right pr-3"
                    }`}
                  >
                    {column.key === "editar" ? (
                      <ModalUpdateProduto produto={produto} />

                    ) : column.key === "excluir" ? (
                      <ModalDeleteProduto
                        title={produto.titulo}
                        id={produto.id}
                        handleUpdate={handleUpdate}
                      />

                    ) : column.key === "status" ? (
                      produto.status

                    ) : column.key === "botao" &&
                      (produto.status === "Pendente") ? (
                      <button
                        type="button"
                        className="px-3 py-2 bg-primary-color text-white rounded-xl hover:bg-blue-700 transition duration-300"
                        onClick={() => handleApprove(produto)}
                      >
                        Aprovar
                      </button>

                    ) : column.key === "botao2" &&
                      (produto.status === "Pendente") ? (
                      <button
                        type="button"
                        className="px-3 py-2 bg-red-800 text-white rounded-xl hover:bg-red-700 transition duration-300"
                        onClick={() => handleReprove(produto)}
                      >
                        Reprovar
                      </button>
                    ) : column.key === "botao" &&
                      (produto.status === "Reprovado") ? (
                        <button
                          type="button"
                          className="px-3 py-2 bg-primary-color text-white rounded-xl hover:bg-blue-700 transition duration-300"
                          onClick={() => handleApprove(produto)}
                        >
                          Aprovar
                        </button>
                    ) : column.key === "botao2" &&
                      (produto.status === "Aprovado") ? (
                        <button
                          type="button"
                          className="px-3 py-2 bg-red-800 text-white rounded-xl hover:bg-red-700 transition duration-300"
                          onClick={() => handleReprove(produto)}
                        >
                          Reprovar
                        </button>
                    ) : column.key === "botao2" &&
                        (produto.status === "Reprovado" ) ? (
                        <div> </div>
                    ) : column.key === "botao" &&
                        (produto.status === "Aprovado" ) ? (
                        <div> </div>
                    ) : (
                        produto.titulo
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      <Dialog open={open} onClose={setOpen} className="relative z-10">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
        />
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-[40vw] data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
            >
              <div className="bg-[#D8DBE2] pb-4 pt-5 sm:p-5 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <DialogTitle as="h2" className="text-lg font-semibold leading-6 text-gray-900">
                      Cadastrar novo produto
                    </DialogTitle>
                  </div>
                </div>
              </div>
              <form action="POST">
                <div className="grid grid-cols-2 justify-items-center pt-3 gap-y-[2vh]">
                  <div>
                    <h3 className="text-lg font-semibold">Título <span className="text-red-500">*</span></h3>
                    <input
                      type="text"
                      name="titulo"
                      id="titulo"
                      placeholder="Título"
                      className="focus:outline-none border-b-2 w-[15vw]"
                      onChange={(e) => {
                        setChangedTitle(true)
                        handleChangeProduto('titulo', e.target.value)}}
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Tipo de produto <span className="text-red-500">*</span></h3>
                    <select
                      name="tipo"
                      id="tipo"
                      className="focus:outline-none border-b-2 w-[15vw]"
                      onChange={(e) => handleChangeProduto('tipo', e.target.value)}
                      defaultValue=""
                    >
                      <option value="" disabled>Escolha um tipo</option>
                      <option value="Outros">Outros</option>
                      <option value="Patente de Software">Patente de Software</option>
                      <option value="Registro de Software">Registro de Software</option>
                      <option value="Startup">Startup</option>
                      <option value="Artigos e Relatórios Técnicos">Artigos e Relatórios Técnicos</option>
                      <option value="Plataforma Online">Plataforma Online</option>
                      <option value="TCC">TCC</option>
                      <option value="Dissertação e Tese">Dissertação e Tese</option>
                    </select>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Descrição <span className="text-red-500">*</span></h3>
                    <input type="text" name="descricao" id="descricao" placeholder="descrição" className="focus:outline-none border-b-2 w-[15vw]" onChange={(e) => handleChangeProduto('descricao', e.target.value)}/>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Semestre <span className="text-red-500">*</span></h3>
                    <select
                      name="semestre"
                      id="semestre"
                      value={NewProduto.semestre}
                      className="focus:outline-none border-b-2 w-[15vw]"
                      onChange={(e) => handleChangeProduto( 'semestre', e.target.value )}>
                      <option value="">Selecione um semestre</option>
                      {semesterGenerator().map((semestre) => (
                          <option key={semestre} value={semestre}>{semestre}</option>))}
                    </select>
                  </div>
                  <div className="w-[15vw] relative">
                    <input
                      type="file"
                      id="file-upload"
                      className="hidden"
                      onChange={uploadPdf}
                    />
                    <label
                      htmlFor="file-upload"
                      className={`absolute flex items-center px-3 py-2 rounded-md w-full text-dark-color text-xs font-semibold cursor-pointer ${
                        !file ? "bg-green-500" : "bg-[#D8DBE2]"
                      } hover:opacity-60 select-none whitespace-nowrap`}
                      style={{
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {file ? <span>{file.name}</span> : <span>Subir PDF</span>}
                      <FaFileUpload className="ml-2" />
                    </label>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Equipe <span className="text-red-500">*</span></h3>
                    <input type="text" name="equipe" id="equipe" placeholder="Pessoa1,Pessoa2,Pessoa3" className="focus:outline-none border-b-2 w-[15vw]" onChange={(e) => handleChangeProduto('equipe', e.target.value)}/>
                  </div>
                </div>
              </form>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  className={`inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto ${
                    changedTitle && formValid 
                      ? "bg-primary-color hover:bg-blue-700" 
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                  onClick={handlePost}
                  disabled={!formValid || !changedTitle}
                >
                  Enviar
                </button>
                <button
                  type="button"
                  data-autofocus
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

  )
}

export default ProdutosAdmin
