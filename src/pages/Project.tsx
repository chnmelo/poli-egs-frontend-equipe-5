import { useEffect, useState } from 'react';
import { CalendarIcon, Cog8ToothIcon, FolderIcon, UserGroupIcon, UserIcon, HeartIcon, TrashIcon } from '@heroicons/react/20/solid';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';
import Footer from '../components/Footer';
import iconImage from '../images/avatar.png'; // Verifique se o caminho está correto
import Header from '../components/Header';
import backgroundImage from '../images/mainpage.jpg'; // Verifique se o caminho está correto
import ModalIntegrantesProjeto from '../components/ModalIntegrantesProjeto';
import { toast } from 'react-toastify';

function Project() {
  const { slug } = useParams();
  const navigate = useNavigate();
  
  // Estados Unificados
  const [Data, setData] = useState<any>({});
  const [images, setImg] = useState<string | undefined>();
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [comentarios, setComentarios] = useState<any[]>([]);
  
  // Estados do Modal
  const [modalIntegranteAberto, setModalIntegranteAberto] = useState(false);
  const [integranteSelecionado, setIntegranteSelecionado] = useState<any>(null);
  
  // Estados para o comentário
  const [commentText, setCommentText] = useState("");
  
  const token = localStorage.getItem('authToken');
  const userName = localStorage.getItem('userName');

  // Função auxiliar para obter ID do YouTube
  const getYouTubeID = (url: string) => {
    if (!url) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : '';
  };

  const videoId = Data.pitch ? getYouTubeID(Data.pitch) : '';

  // Manipulação do clique no integrante
  const handleClickIntegrante = async (pessoa: any) => {
    if (typeof pessoa === 'string') {
      setIntegranteSelecionado({ Nome: pessoa });
      setModalIntegranteAberto(true);
    } else {
      const integranteFormatado = {
          Nome: pessoa.nomeCompleto || pessoa.Nome || "Nome não disponível",
          Minibio: pessoa.minibio || pessoa.Minibio || "",
          Foto: iconImage, // Foto padrão inicial
          Lattes: pessoa.lattes || pessoa.Lattes || "",
          LinkedIn: pessoa.linkedin || pessoa.LinkedIn || "",
          GitHub: pessoa.github || pessoa.GitHub || "",
          Email: pessoa.email || pessoa.Email || "",
          RedeSocial: pessoa.redeSocial || pessoa.RedeSocial || "",
      };
      
      // Tenta buscar foto personalizada
      try {
        if (pessoa.id) {
            const response = await axios.get(`${import.meta.env.VITE_url_backend}/view_fotos_integrantes/${pessoa.id}`);
            if (response.data.url){
            integranteFormatado.Foto = response.data.url;
            }
        }
      } catch (error) {
        console.log("Sem foto personalizada, usando padrão.");
      }
      
      setIntegranteSelecionado(integranteFormatado);
      setModalIntegranteAberto(true);
    }
  };

  // useEffect ÚNICO para buscar dados
  useEffect(() => {
    if (slug) {
      const fetchData = async () => {
        try {
          // 1. Busca dados do projeto
          const response = await axios.get(`${import.meta.env.VITE_url_backend}/projetos/${slug}`);
          const projeto = response.data;
          const projectId = projeto.id;

          const equipeFormatada = (projeto.equipe || []).map((pessoa: any) => {
            if (typeof pessoa === 'string') return { nomeCompleto: pessoa };
            if (pessoa.Nome) return { ...pessoa, nomeCompleto: pessoa.Nome };
            return pessoa;
          });

          setData({ ...projeto, equipe: equipeFormatada });
          setComentarios(projeto.comentarios || []);

          // 2. Busca Logo e Galeria se houver ID
          if (projectId) {
            // Logo
            axios.get(`${import.meta.env.VITE_url_backend}/view_logo_projeto/${projectId}`)
              .then((res) => setImg(res.data.url))
              .catch(() => console.log("Logo não encontrada"));

            // Galeria
            axios.get(`${import.meta.env.VITE_url_backend}/view_fotos_projeto/${projectId}`)
              .then((res) => setGalleryImages(res.data.urls || []))
              .catch(() => setGalleryImages([]));
          } else {
             // Fallback para buscar logo pelo slug se o ID falhar (mantendo sua lógica original)
             axios.get(`${import.meta.env.VITE_url_backend}/view_logo_projeto/${slug}`)
             .then((res) => setImg(res.data.url))
             .catch(() => {});
          }

        } catch (error) {
          console.error("Erro ao carregar projeto:", error);
          toast.error("Erro ao carregar projeto.");
        }
      };
      fetchData();
    }
  }, [slug]);

  const handleSendComment = async () => {
    if (!commentText.trim()) return;

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_url_backend}/projetos/${Data.id}/comentar?usuario=${userName}&comentario=${commentText}&id_token=${token}`
      );

      if (response.data.comentarios) {
        setComentarios(response.data.comentarios);
      } else {
        // Fallback local caso o backend não retorne a lista atualizada
        const novoComentario = {
            username: userName,
            comentario: commentText,
            data: new Date().toLocaleDateString('pt-BR')
        };
        setComentarios([...comentarios, novoComentario]);
      }
      
      setCommentText("");
      toast.success("Comentário enviado!"); 

    } catch (error: any) {
      console.error("Erro ao enviar comentário:", error);
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        toast.error("Sua sessão expirou. Faça login novamente.");
        localStorage.clear();
        setTimeout(() => navigate('/login'), 2000);
      } else {
        toast.error(error.response?.data?.detail || "Erro ao enviar comentário.");
      }
    }
  };

  const handleDeleteComment = async (comentario: any) => {
    if (!window.confirm("Deseja realmente apagar este comentário?")) return;

    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_url_backend}/projetos/${Data.id}/comentar`,
        {
          params: { id_token: token }, 
          data: comentario 
        }
      );

      if (response.data.comentarios) {
        setComentarios(response.data.comentarios);
        toast.success("Comentário removido!");
      }
    } catch (error: any) {
        console.error("Erro ao deletar:", error);
        toast.error("Erro ao excluir comentário.");
    }
  };

  return (
    <>
      <Header />
      
      {/* Seção Hero */}
      <section
        className="relative bg-cover bg-center h-[50vh] text-white"
        style={{ backgroundImage: `url(${images || backgroundImage})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-70" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full p-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4">{Data.titulo}</h1>
          <p className="text-lg md:text-xl max-w-3xl">{Data.resumo}</p>
        </div>
      </section>

      <main className="flex flex-col gap-14 px-[10vw] lg:px-[15vw] mb-20 pb-20 -mt-16">
        
        {/* Sobre o Projeto e Likes */}
        <section className="bg-white shadow-2xl rounded-lg p-8 z-10">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-3xl font-bold text-gray-800">Sobre o Projeto</h2>
            <div className="flex items-center gap-2 text-gray-600">
              <button className="p-2 rounded-full transition-colors hover:bg-red-100">
                <HeartIcon className="h-8 w-8 text-red-500" />
              </button>
              <span className="font-semibold text-lg">{Data.curtidas || 0}</span>
            </div>
          </div>

          {/* Imagem Thumb e Descrição */}
          <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
            <div className="flex-shrink-0">
              <div className="h-32 w-32 md:h-48 md:w-48 rounded-full overflow-hidden border-4 border-gray-200 shadow-md flex items-center justify-center">
                <img className="w-full h-full object-cover" src={images || iconImage} alt="Project Thumbnail" />
              </div>
            </div>
            <div className="flex flex-col justify-center text-center md:text-left w-full">
               <p className="text-gray-700 text-lg leading-relaxed">
                {Data.descricao || "Descrição do projeto não disponível."}
              </p>
            </div>
          </div>
        </section>

        {/* Galeria */}
        {galleryImages.length > 0 && (
          <section className="bg-white shadow-2xl rounded-lg p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Galeria</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {galleryImages.map((url, index) => (
                <div key={index} className="overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                  <img src={url} alt={`Imagem da galeria ${index}`} className="w-full h-full object-cover"/>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Vídeo do pitch */}
        {videoId && (
          <section className="bg-white shadow-2xl rounded-lg p-8 flex flex-col items-center w-full">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 self-start">Vídeo de Apresentação</h2>
            <div className="aspect-w-16 aspect-h-9 w-full h-[400px]">
              <iframe
                className="w-full h-full rounded-lg"
                src={`https://www.youtube.com/embed/${videoId}`}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              ></iframe>
            </div>
          </section>
        )}

        {/* GRID DE INFORMAÇÕES (Equipe, Tech, etc) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* 1. Equipe */}
            <section className="flex flex-col border border-gray-200 bg-white rounded-lg shadow-md overflow-hidden">
                <div className="flex items-center bg-blue-600 text-white px-4 py-3">
                    <UserGroupIcon className="h-5 w-5 mr-2" />
                    <h2 className="text-base font-semibold">Equipe</h2>
                </div>
                <div className="p-4">
                    <ul className="list-disc ml-5 text-gray-700">
                        {Array.isArray(Data.equipe) && Data.equipe.map((pessoa: any, index: number) => (
                            <li
                                key={index}
                                className="cursor-pointer text-blue-600 hover:underline hover:text-blue-800"
                                onClick={() => handleClickIntegrante(pessoa)}
                            >
                                {pessoa.nomeCompleto || "Nome não disponível"}
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* 2. Tecnologias */}
            <section className="flex flex-col border border-gray-200 bg-white rounded-lg shadow-md overflow-hidden">
                <div className="flex items-center bg-blue-600 text-white px-4 py-3">
                    <Cog8ToothIcon className="h-5 w-5 mr-2" />
                    <h2 className="text-base font-semibold">Tecnologias</h2>
                </div>
                <div className="p-4 flex flex-wrap gap-2">
                    {Data.tecnologias_utilizadas?.map((tech: string, index: number) => (
                        <span key={index} className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                            {tech}
                        </span>
                    ))}
                </div>
            </section>

             {/* 3. Cliente / Parceiro */}
             <section className="flex flex-col border border-gray-200 bg-white rounded-lg shadow-md overflow-hidden">
                <div className="flex items-center bg-blue-600 text-white px-4 py-3">
                    <UserIcon className="h-5 w-5 mr-2" />
                    <h2 className="text-base font-semibold">Parceiro</h2>
                </div>
                <div className="p-4">
                    <p className="text-gray-700">{Data.cliente || "Não informado"}</p>
                </div>
            </section>

            {/* 4. Semestre */}
            <section className="flex flex-col border border-gray-200 bg-white rounded-lg shadow-md overflow-hidden">
                <div className="flex items-center bg-blue-600 text-white px-4 py-3">
                    <CalendarIcon className="h-5 w-5 mr-2" />
                    <h2 className="text-base font-semibold">Semestre</h2>
                </div>
                <div className="p-4">
                    <p className="text-gray-700">{Data.semestre || "Não informado"}</p>
                </div>
            </section>

            {/* 5. Links Úteis */}
            <section className="flex flex-col border border-gray-200 bg-white rounded-lg shadow-md overflow-hidden">
                <div className="flex items-center bg-blue-600 text-white px-4 py-3">
                    <FolderIcon className="h-5 w-5 mr-2" />
                    <h2 className="text-base font-semibold">Links Úteis</h2>
                </div>
                <div className="p-4 flex flex-col gap-2">
                     {Data.link_repositorio && (
                        <a href={Data.link_repositorio} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            Repositório GitHub
                        </a>
                     )}
                     {Data.video_tecnico && (
                        <a href={Data.video_tecnico} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            Vídeo Técnico
                        </a>
                     )}
                     {!Data.link_repositorio && !Data.video_tecnico && <span className="text-gray-500">Nenhum link disponível</span>}
                </div>
            </section>

        </div>

        {/* Seção de Comentários */}
        <section className="bg-white shadow-2xl rounded-lg p-8 mt-4">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Comentários</h2>
          <hr className="border-t border-gray-200 mb-6" />

          {/* Formulário */}
          <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
            {token ? (
              <>
                <h3 className="text-lg font-medium mb-3 text-gray-800">Deixe seu comentário</h3>
                <textarea
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Escreva o que você achou deste projeto..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                ></textarea>
                <div className="flex justify-end mt-3">
                  <button
                    onClick={handleSendComment}
                    disabled={!commentText.trim()}
                    className={`px-6 py-2 rounded-md text-white font-semibold transition-colors ${
                      commentText.trim() 
                        ? "bg-blue-600 hover:bg-blue-700" 
                        : "bg-gray-400 cursor-not-allowed"
                    }`}
                  >
                    Enviar
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-600 mb-2">Faça login para comentar.</p>
                <Link to="/login" className="text-blue-600 font-bold hover:underline">Ir para Login</Link>
              </div>
            )}
          </div>

          {/* Lista */}
          <div className="flex flex-col gap-4">
            {comentarios && comentarios.length > 0 ? (
              comentarios.map((comentario: any, index: number) => (
                <div key={index} className="flex items-start bg-white p-4 rounded-lg border border-gray-100 relative group shadow-sm">
                  <div className="flex-shrink-0 mr-4">
                     <img
                        src={iconImage}
                        alt="Avatar"
                        className="w-10 h-10 rounded-full bg-gray-200"
                      />
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-baseline mb-1">
                      <h4 className="text-md font-bold text-gray-900">{comentario.username || "Usuário"}</h4>
                      <span className="text-xs text-gray-500">{comentario.data}</span>
                    </div>
                    <p className="text-gray-700">{comentario.comentario}</p>
                  </div>
                  
                  {userName && comentario.username === userName && (
                    <button 
                        onClick={() => handleDeleteComment(comentario)}
                        className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                        title="Excluir"
                    >
                        <TrashIcon className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-6 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                  <p className="text-gray-500 italic">Seja o primeiro a comentar!</p>
              </div>
            )}
          </div>
        </section>

      </main>

      <ModalIntegrantesProjeto
        isOpen={modalIntegranteAberto}
        onClose={() => setModalIntegranteAberto(false)}
        integrante={integranteSelecionado}
      />
      
      <Footer />
    </>
  );
}

export default Project;