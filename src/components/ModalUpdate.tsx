import { Button, Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { PencilSquareIcon } from '@heroicons/react/20/solid';
import axios from "axios";
import { ProjectInt } from "../pages/Projects";
import { useEffect, useState } from "react";
import ModalCadastrarIntegrante from "../components/ModalCadastrarIntegrante";

export default function ModalUpdate({ project }: { project: ProjectInt }) {
  const [open, setOpen] = useState(false);
  const handleShow = () => setOpen(true);

  const [UpdatedProject, setUpdatedProject] = useState({
    titulo: project.titulo || "",
    descricao: project.descricao || "",
    equipe: Array.isArray(project.equipe) ? project.equipe.join(", ") : "",
    cliente: project.cliente || "",
    pitch: project.pitch || "",
    tema: project.tema || "",
    semestre: project.semestre || "",
    video_tecnico: project.video_tecnico || "",
    tecnologias_utilizadas: Array.isArray(project.tecnologias_utilizadas) ? project.tecnologias_utilizadas.join(", ") : "",
    palavras_chave: Array.isArray(project.palavras_chave) ? project.palavras_chave.join(", ") : "",
    id: project.id || "",
    link_repositorio: project.link_repositorio || "",
    revisado: project.revisado || "",
    curtidas: project.curtidas || 0,
    user_curtidas_email: project.user_curtidas_email || [],
  });

  const [integrantes, setIntegrantes] = useState<Integrante[]>([]);

  useEffect(() => {
  if (open) {
    // Preenche o estado integrantes a partir do project.equipe
    if (Array.isArray(project.equipe) && project.equipe.length > 0) {
      const integrantesFromProject = project.equipe.map(nome => ({ nomeCompleto: nome }));
      setIntegrantes(integrantesFromProject);
    } else {
      setIntegrantes([]);
    }
  }
}, [open, project.equipe]);

  useEffect(() => {
    if (integrantes.length > 0) {
      const nomes = integrantes.map(i => i.nomeCompleto);
      setUpdatedProject(prev => ({ ...prev, equipe: nomes.join(", ") }));
    } else {
      setUpdatedProject(prev => ({ ...prev, equipe: "" }));
    }
  }, [integrantes]);

  function stringToArray(str: string): string[] {
    return typeof str === 'string' && str.trim()
      ? str.split(',').map(item => item.trim()).filter(item => item.length > 0)
      : [];
  }

  const handleUpdateProject = () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.error('Token não encontrado. Usuário não está autenticado.');
      return;
    }

    const tecnologiasArray = stringToArray(UpdatedProject.tecnologias_utilizadas);
    const palavrasChaveArray = stringToArray(UpdatedProject.palavras_chave);
    const equipeArray = stringToArray(UpdatedProject.equipe);

    const UpdatedProjectWithDefaults = {
      id: project.id,
      titulo: UpdatedProject.titulo || "Título não informado",
      tema: UpdatedProject.tema || "Tema não informado",
      palavras_chave: palavrasChaveArray.length > 0 ? palavrasChaveArray : [],
      descricao: UpdatedProject.descricao || "Sem descrição",
      cliente: UpdatedProject.cliente || "Cliente não informado",
      semestre: UpdatedProject.semestre || "Semestre não informado",
      equipe: equipeArray.length > 0 ? equipeArray : [],
      link_repositorio: UpdatedProject.link_repositorio || "Link não informado",
      tecnologias_utilizadas: tecnologiasArray.length > 0 ? tecnologiasArray : [],
      video_tecnico: UpdatedProject.video_tecnico || "Vídeo não informado",
      pitch: UpdatedProject.pitch || "Pitch não informado",
      revisado: project.revisado,
      curtidas: project.curtidas,
      user_curtidas_email: project.user_curtidas_email,
    };

    axios.put(`${import.meta.env.VITE_url_backend}/projetos/${project.id}?id_token=${token}`, UpdatedProjectWithDefaults, {
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
        console.error('Erro ao atualizar projeto:', error.response ? error.response.data : error.message);
      });
  };

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

  const ableSemesters = semesterGenerator();

    return(
        <>
        <Button onClick={handleShow} className="text-dark-color h-full w-5">
            <PencilSquareIcon className="h-5 w-5"/>
        </Button>

        <Dialog open={open} onClose={setOpen} className="relative z-10">
        <DialogBackdrop transition className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"/>
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-[40vw] data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div className="bg-[#D8DBE2] pt-5 sm:p-4 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                  <DialogTitle as="h2" className="text-lg font-semibold leading-6 text-dark-color">
                    Atualizar: {project.titulo}
                  </DialogTitle>
                </div>
              </div>
            </div>
            <form action="POST">
              <div className="grid grid-cols-2 justify-start pt-4 px-6 gap-y-[2vh]">
                <div className="col-span-2 mt-2">
                  <h3 className="text-lg font-semibold flex items-center gap-1">
                    Equipe <span className="text-red-500">*</span>
                  </h3>
                </div>

                <div className="col-span-2 flex items-center gap-4 mt-1">
                  <ModalCadastrarIntegrante integrantes={integrantes} setIntegrantes={setIntegrantes} onClose={() => { }} />
                  <div className="flex flex-wrap gap-2 max-w-[80%]">
                    {integrantes.length > 0 ? (
                      integrantes.map((int, idx) => (
                        <span key={idx} className="inline-block bg-blue-200 text-blue-800 rounded px-2 py-1 text-sm">
                          {int.nomeCompleto}
                        </span>
                      ))
                    ) : (
                      <p className="text-gray-500">Nenhum integrante adicionado</p>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Titulo</h3>
                  <input type="text" name="titulo" id="titulo" placeholder="Titulo" value={UpdatedProject.titulo} className="focus:outline-none border-b-2 w-[15vw]" onChange={(e) => (setUpdatedProject({...UpdatedProject, titulo:e.target.value}))}/>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Cliente</h3>
                  <input type="text" name="titulo" id="titulo" placeholder="Ex: POLI/UPE" value={UpdatedProject.cliente} className="focus:outline-none border-b-2 w-[15vw]" onChange={(e) => (setUpdatedProject({...UpdatedProject, cliente:e.target.value}))}/>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Tema</h3>
                  <input type="text" name="titulo" id="titulo" placeholder="Ex: Engenharia de Software" value={UpdatedProject.tema} className="focus:outline-none border-b-2 w-[15vw]" onChange={(e) => (setUpdatedProject({...UpdatedProject, tema:e.target.value}))}/>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Semestre</h3>
                  <select
                    name="semestre"
                    id="semestre"
                    value={UpdatedProject.semestre}
                    className="focus:outline-none border-b-2 w-[15vw]"
                     onChange={(e) => setUpdatedProject({ ...UpdatedProject, semestre: e.target.value })}
>
                      <option value="">Selecione um semestre</option>
                        {ableSemesters.map((semestre) => (<option key={semestre} value={semestre}>
                        {semestre}
                      </option>))}
                  </select>                </div>
                <div>
                  <h3 className="text-lg font-semibold">Tecnologias Utilizadas</h3>
                  <input type="text" name="titulo" id="titulo" placeholder="Tecnologia1,Tecnologia2,Tecnologia3" value={UpdatedProject.tecnologias_utilizadas} className="focus:outline-none border-b-2 w-[15vw]" onChange={(e) => (setUpdatedProject({...UpdatedProject, tecnologias_utilizadas:e.target.value}))}/>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Link do Pitch</h3>
                  <input type="text" name="titulo" id="titulo" placeholder="Pitch" value={UpdatedProject.pitch} className="focus:outline-none border-b-2 w-[15vw]" onChange={(e) => (setUpdatedProject({...UpdatedProject, pitch:e.target.value}))}/>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Link do Vídeo Técnico</h3>
                  <input type="text" name="titulo" id="titulo" placeholder="Vídeo Técnico" value={UpdatedProject.video_tecnico} className="focus:outline-none border-b-2 w-[15vw]" onChange={(e) => (setUpdatedProject({...UpdatedProject, video_tecnico:e.target.value}))}/>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Repositório</h3>
                  <input type="text" name="titulo" id="titulo" placeholder="Repositório" value={UpdatedProject.link_repositorio} className="focus:outline-none border-b-2 w-[15vw]" onChange={(e) => (setUpdatedProject({...UpdatedProject, link_repositorio:e.target.value}))}/>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Palavras Chave</h3>
                  <input type="text" name="titulo" id="titulo" placeholder="Palavra1,Palavra2,Palavra3" value={UpdatedProject.palavras_chave} className="focus:outline-none border-b-2 w-[15vw]" onChange={(e) => (setUpdatedProject({...UpdatedProject, palavras_chave:e.target.value}))}/>
                </div>
                <div className="mb-10">
                  <h3 className="text-lg font-semibold">Descrição</h3>
                  <input type="text" name="titulo" id="titulo" placeholder="Descrição" value={UpdatedProject.descricao} className="focus:outline-none border-b-2 w-[15vw]" onChange={(e) => (setUpdatedProject({...UpdatedProject, descricao:e.target.value}))}/>
                </div>
              </div>
            </form>
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="button"
                className="inline-flex w-full justify-center rounded-md bg-primary-color px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-neutral-400 sm:ml-3 sm:w-auto"
                onClick={handleUpdateProject}
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