import { Table } from "react-bootstrap";
import HeaderUser from "../../components/HeaderUser";
import { useEffect, useState } from "react";
import axios from "axios";
import ModalDelete from "../../components/ModalDelete";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import ModalUpdate from "../../components/ModalUpdate";
import ModalComment from "../../components/ModalComment";
import ModalLikes from "../../components/ModalLikes";
import { FaFileUpload } from "react-icons/fa";
import { Navigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ModalCadastrarIntegrante from "../../components/ModalCadastrarIntegrante";
import Loading from "../../components/Loading";
import { EyeIcon, LockClosedIcon } from "@heroicons/react/20/solid";
import RichTextEditor from "../../components/RichTextEditor";

const columns = [
  { key: "titulo", label: "Titulo", align: "text-left pl-3" },
  { key: "equipe", label: "Autores", align: "text-left" },
  { key: "preview", label: "Visualizar", align: "text-center" },
  { key: "curtir", label: "Curtir", align: "text-center" },
  { key: "comentar", label: "Comentar", align: "text-center" },
  { key: "revisar", label: "Status", align: "text-center" }, 
];

function Userprojects() {
  const [Input, setInput] = useState<string>("");
  const [Project, setProject] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [formValid, setFormValid] = useState(false);
  const [loading, setLoading] = useState(true);

  const [NewProject, setNewProject] = useState({
    titulo: "",
    descricao: "",
    equipe: [],
    cliente: "",
    pitch: "",
    tema: "",
    semestre: "",
    video_tecnico: "",
    tecnologias_utilizadas: [] as string[],
    palavras_chave: [] as string[],
    id: "",
    link_repositorio: "",
    revisado: "",
    curtidas: 0,
    user_curtidas_email: [] as string[],
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [changedTitle, setChangedTitle] = useState(true);
  const [equipeTemp, setEquipeTemp] = useState<string[]>([]);
  const [editIntegrante,setEditIntegrante] = useState(null);

  const userIsAdmin = localStorage.getItem("isAdmin") === "true"; 

  if (userIsAdmin) {
    return <Navigate to="/admin-projects" />;
  }

  const getStatusBadge = (status: string) => {
    let styles = "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ";
    
    switch (status) {
      case "Aprovado":
        styles += "bg-green-50 text-green-700 ring-green-600/20";
        break;
      case "Reprovado":
        styles += "bg-red-50 text-red-700 ring-red-600/20";
        break;
      case "Pendente":
      default:
        styles += "bg-yellow-50 text-yellow-800 ring-yellow-600/20";
        break;
    }

    return (
      <span className={styles}>
        {status}
      </span>
    );
  };

  const renderEquipe = (equipe: any) => {
    if (!equipe) return "Não informado";
    if (typeof equipe === "string") return equipe;
    if (Array.isArray(equipe)) {
        return equipe.map(membro => {
            if (typeof membro === 'string') return membro;
            return membro.nomeCompleto || membro.Nome || "";
        }).filter(Boolean).join(", ");
    }
    return "Formato inválido";
  };

  const validateFormWithData = (projectData) => {
    const requiredFields = [
      "titulo",
      "cliente",
      "semestre",
      "pitch",
      'equipe',
      "link_repositorio",
      "descricao",
      "tema",
      "tecnologias_utilizadas",
      "video_tecnico",
      "palavras_chave",
    ];

    return requiredFields.every((field) => {
      const value = projectData[field];

      if (typeof value === "string") {
        return value.trim() !== "";
      } else if (Array.isArray(value)) {
        return value.length > 0;
      }
      return false;
    });
  };

  const validateForm = () => {
    return validateFormWithData(NewProject);
  };

  const handleChangeProject = (field, value) => {
    const updatedProject = { ...NewProject, [field]: value };
    setNewProject(updatedProject);

    const isValid = validateFormWithData(updatedProject);
    setFormValid(isValid);
  };

  const handleUpdate = () => {
    axios
      .get(`/projetos/`)
      .then((response) => setProject(response.data.projetos || [])) 
      .catch((error) => console.error("Erro ao atualizar projetos:", error));
  };


  const handleLogoUpload = (id: string) => {

    if (!selectedFile) {
      setOpen(false);
      return
    }

    const token = localStorage.getItem('authToken')
    const formData = new FormData();

    formData.append('file', selectedFile);
    axios.post(`/upload_logo_projeto/${id}/?id_token=${token}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
    })
    .then(response => {
      setOpen(false);
      return;
    })
    .catch((error) => console.log("Erro ao fazer upload da logo:", error));
  };

  const handleFotosUpload = (id: string, equipe) => {
    
    if (equipe.map(integrante => {if (integrante.foto) integrante.foto}).length == 0 ) return;

    const token = localStorage.getItem('authToken')
    const formData = new FormData();

    equipe.forEach((integrante) => {
      if (integrante.foto instanceof File) {
        formData.append('files', integrante.foto);
        formData.append('file_ids', integrante.id);
      }
    })

    axios.post(`/upload_fotos_integrantes/?id_token=${token}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    })
    .catch(error => console.log('Erro ao fazer upload da logo:', error))
  }

  const handlePost = () => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      alert("Token de autenticação não encontrado.");
      return;
    }

    if (!validateForm()) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    const stringToArray = (value) => {
      if (Array.isArray(value)) return value;
      if (typeof value === "string")
        return value
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      return [];
    };

    const tecnologiasArray = stringToArray(NewProject.tecnologias_utilizadas);
    const equipeArray = stringToArray(NewProject.equipe);
    const palavrasChaveArray = stringToArray(NewProject.palavras_chave);
    const userCurtidasEmailArray = stringToArray(
      NewProject.user_curtidas_email
    );

    const NewProjectWithDefaults = {
      id: NewProject.id || "default-id",
      titulo: NewProject.titulo,
      tema: NewProject.tema,
      palavras_chave: palavrasChaveArray,
      descricao: NewProject.descricao,
      cliente: NewProject.cliente,
      semestre: NewProject.semestre,
      equipe: NewProject.equipe.map(({foto, ...resto}) => resto),
      link_repositorio: NewProject.link_repositorio,
      tecnologias_utilizadas: tecnologiasArray,
      video_tecnico: NewProject.video_tecnico,
      pitch: NewProject.pitch,
      revisado: NewProject.revisado || "Pendente",
      curtidas: NewProject.curtidas || 0,
      user_curtidas_email: userCurtidasEmailArray,
    };

    axios.post(`/projeto_add/?id_token=${token}`, NewProjectWithDefaults, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
    })
    .then((response) => {
      handleFotosUpload(response.data.projeto.id, NewProject.equipe);
      return response.data.projeto.id
    })
    .then((response) => {
      handleLogoUpload(response);
      toast.success("Projeto cadastrado com sucesso!");
      return;
    })
    .then(response => {
      setProject([...Project, NewProjectWithDefaults])
      setOpen(false);
    })
    .catch(error => {
      console.error('Erro ao adicionar projeto:', error);
      setChangedTitle(false)
      toast.error(`Erro ao cadastrar projeto: ${error.response?.data?.detail || 'Verifique sua conexão'}`);
    });
  };

  useEffect(() => {
    if (open) {
      setFormValid(validateForm());
    } else {
      setNewProject({
        titulo: "",
        descricao: "",
        equipe: [],
        cliente: "",
        pitch: "",
        tema: "",
        semestre: "",
        video_tecnico: "",
        tecnologias_utilizadas: [],
        palavras_chave: [],
        id: "",
        link_repositorio: "",
        revisado: "",
        curtidas: 0,
        user_curtidas_email: [],
      });
    }
  }, [open]);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`/projetos/`)
      .then((response) => setProject(response.data.projetos || []))
      .catch((error) => console.error("Erro ao carregar projetos:", error))
      .finally(() => setLoading(false));
  }, []);

  const filteredProject = Array.isArray(Project)
    ? Project.filter((project) => {
        const input = Input.toLowerCase();
        
        const checkEquipe = (equipe: any) => {
            if (!equipe) return false;
            if (typeof equipe === 'string') return equipe.toLowerCase().includes(input);
            if (Array.isArray(equipe)) {
                return equipe.some((membro: any) => {
                    const nome = typeof membro === 'string' ? membro : (membro.nomeCompleto || membro.Nome || "");
                    return nome.toLowerCase().includes(input);
                });
            }
            return false;
        };
        // ---------------------------------

        return (
          project.titulo?.toLowerCase().includes(input) ||
          project.palavras_chave?.some((p: string) => p.toLowerCase().includes(input)) ||
          project.tema?.toLowerCase().includes(input) ||
          checkEquipe(project.equipe) // Adiciona a verificação de autores
        );
      })
    : [];

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
      <HeaderUser />
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
          <h1 className="text-2xl font-bold text-start text-dark-color ">
            Projetos
          </h1>
          <button
            type="submit"
            onClick={() => setOpen(true)}
            className="rounded-md bg-primary-color h-full w-[15vw] text-white"
          >
            Novo projeto
          </button>
        </section>
        <input
          type="search"
          name="searchbar"
          id="searchbar"
          className="rounded-full w-full h-[5vh] border border-light-color indent-2 bg-[#D8DBE2] "
          placeholder="Pesquise por título, tema, palavra-chave ou autor"
          value={Input}
          onChange={(e) => setInput(e.target.value)}
        />
      </div>
      <div className="px-[13vw] pt-10">
        {loading ? (
          <Loading />
        ) : (
          <Table className="h-auto w-full">
            <thead>
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className={column.align}
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredProject.map((project) => (
                <tr key={project.id} className="border border-light-color">
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={`items-center py-3 ${column.align}`}
                    >
                      {column.key === "preview" ? (
                        <a 
                          href={`/projetos/${project.id}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-block text-dark-color hover:text-blue-600 transition-colors"
                          title="Visualizar projeto"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </a>
                      ) : column.key === "equipe" ? (
                        <span className="text-sm text-gray-700 truncate block max-w-[200px]" title={renderEquipe(project.equipe)}>
                            {renderEquipe(project.equipe)}
                        </span>
                      ) : column.key === "editar" ? (
                        <ModalUpdate project={project} handleFotosUpload={handleFotosUpload} />
                      ) : column.key === "excluir" ? (
                        <ModalDelete
                          title={project.titulo}
                          id={project.id}
                          handleUpdate={handleUpdate}
                        />
                      
                      ) : column.key === "comentar" ? (
                        project.revisado === "Aprovado" ? (
                          <ModalComment projectId={project.id}></ModalComment>
                        ) : (
                          <span 
                            className="text-gray-400 cursor-not-allowed inline-flex justify-center" 
                            title="Apenas projetos aprovados podem receber comentários."
                          >
                             <LockClosedIcon className="h-4 w-4" />
                          </span>
                        )
                      ) : column.key === "curtir" ? (
                        project.revisado === "Aprovado" ? (
                          <ModalLikes 
                            projectId={project.id} 
                            initialLikes={project.curtidas}
                            initialLikedUsers={project.user_curtidas_email}
                          />
                        ) : (
                          <span 
                            className="text-gray-400 cursor-not-allowed inline-flex justify-center" 
                            title="Apenas projetos aprovados podem receber curtidas."
                          >
                             <LockClosedIcon className="h-4 w-4" />
                          </span>
                        )

                      ) : column.key === "revisar" ? (
                        getStatusBadge(project.revisado)
                      ) : (
                        project.titulo
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </Table>
        )}
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
              <div className="bg-[#D8DBE2] pt-5 sm:p-3 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <DialogTitle
                      as="h2"
                      className="text-lg font-semibold leading-6 text-dark-color"
                    >
                      Cadastrar novo projeto
                    </DialogTitle>
                  </div>
                </div>
              </div>
              <form action="POST">
                <div className="grid grid-cols-2 justify-start pt-4 px-6 gap-y-[2vh]">
                  <div className="col-span-2 flex items-center gap-4 mt-2">
                    <ModalCadastrarIntegrante
                      integrante={editIntegrante}
                      integrantes={NewProject.equipe}
                      setIntegrantes={(e) => handleChangeProject('equipe',e)}
                      onClose={() => {setEditIntegrante(null)}}
                    />
                    <div className="flex flex-wrap gap-2 max-w-[80%]">
                      {NewProject.equipe.length > 0 ? (
                        NewProject.equipe.map((int, idx) => (
                          <span
                            key={idx}
                            className="inline-block bg-blue-200 text-blue-800 rounded px-2 py-1 text-sm"
                          >
                            <button 
                            className="cursor-pointer text-blue-600 hover:underline text:bold list-disc"
                            onClick={(e) => {
                              e.preventDefault()
                              setEditIntegrante(int)
                            }}>
                            {int.nomeCompleto}
                            </button>
                            <button 
                            className="cursor-pointer text-red-600 hover:underline text:bold list-disc ml-3"
                            onClick={(e) => {
                              e.preventDefault()
                              handleChangeProject('equipe',NewProject.equipe.filter(i => i !== int))
                            }}>
                              X
                            </button>
                          </span>
                        ))
                      ) : (
                        <p className="text-gray-500">
                          Nenhum integrante adicionado
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Titulo <span className="text-red-500">*</span></h3>
                    <input type="text" name="titulo" id="titulo" placeholder="Titulo" className="focus:outline-none border-b-2 w-[15vw]" onChange={(e) =>{ setChangedTitle(true); handleChangeProject("titulo", e.target.value) }}/>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Organização Parceira <span className="text-red-500">*</span></h3>
                    <input type="text" name="cliente" id="cliente" placeholder="Ex: POLI/UPE" className="focus:outline-none border-b-2 w-[15vw]" onChange={(e) => handleChangeProject("cliente", e.target.value)}/>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Tema <span className="text-red-500">*</span></h3>
                    <input type="text" name="tema" id="tema" placeholder="Ex: Engenharia de Software" className="focus:outline-none border-b-2 w-[15vw]" onChange={(e) => handleChangeProject("tema", e.target.value)}/>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Semestre <span className="text-red-500">*</span></h3>
                    <select name="semestre" id="semestre" value={NewProject.semestre} className="focus:outline-none border-b-2 w-[15vw]" onChange={(e) => handleChangeProject('semestre',e.target.value)}>
                      <option value="">Selecione um semestre</option>
                      {semesterGenerator().map((semestre) => (<option key={semestre} value={semestre}>{semestre}</option>))}
                    </select>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Tecnologias Utilizadas <span className="text-red-500">*</span></h3>
                    <input type="text" name="tecnologias" id="tecnologias" placeholder="Tecnologia1,Tecnologia2,Tecnologia3" className="focus:outline-none border-b-2 w-[15vw]" onChange={(e) => handleChangeProject("tecnologias_utilizadas", e.target.value)}/>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Link do Pitch <span className="text-red-500">*</span></h3>
                    <input type="text" name="pitch" id="pitch" placeholder="Pitch" className="focus:outline-none border-b-2 w-[15vw]" onChange={(e) => handleChangeProject("pitch", e.target.value)}/>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Link do Vídeo Técnico <span className="text-red-500">*</span></h3>
                    <input type="text" name="video" id="video" placeholder="Vídeo Técnico" className="focus:outline-none border-b-2 w-[15vw]" onChange={(e) => handleChangeProject("video_tecnico", e.target.value)}/>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Repositório <span className="text-red-500">*</span></h3>
                    <input type="text" name="repositorio" id="repositorio" placeholder="Repositório" className="focus:outline-none border-b-2 w-[15vw]" onChange={(e) => handleChangeProject("link_repositorio", e.target.value)}/>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Palavras Chave <span className="text-red-500">*</span></h3>
                    <input type="text" name="palavras" id="palavras" placeholder="Palavra1,Palavra2,Palavra3" className="focus:outline-none border-b-2 w-[15vw]" onChange={(e) => handleChangeProject("palavras_chave", e.target.value)}/>
                  </div>
                  <div className="mb-10">
                    <h3 className="text-lg font-semibold">Descrição <span className="text-red-500">*</span></h3>
                    <input type="text" name="descricao" id="descricao" placeholder="Descrição" className="focus:outline-none border-b-2 w-[15vw]" onChange={(e) => handleChangeProject("descricao", e.target.value)}/>
                  </div>
                  <div className="w-[15vw] relative">
                    <input type="file" className="hidden" name="logo" id="logo" onChange={(e: any) => setSelectedFile(e.target.files[0])}/>
                    <label htmlFor="logo" className={`absolute flex items-center justify-center px-3 py-2 rounded-md w-full text-dark-color text-xs font-semibold cursor-pointer ${!selectedFile ? "bg-green-500" : "bg-[#D8DBE2]"} hover:opacity-60 select-none whitespace-nowrap`}>
                      {selectedFile ? <span>Modificar Logo</span> : <span>Atualizar Logo</span>}
                      <FaFileUpload className="ml-2" />
                    </label>
                  </div>
                </div>
              </form>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  className={`inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto ${formValid && changedTitle ? "bg-primary-color hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"}`}
                  onClick={handlePost}
                  disabled={!formValid}
                >
                  Enviar
                </button>
                <button
                  type="button"
                  data-autofocus
                  onClick={() => { setOpen(false); }}
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

export default Userprojects;