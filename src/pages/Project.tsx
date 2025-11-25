import { useEffect, useState } from 'react';
import { CalendarIcon, Cog8ToothIcon, FolderIcon, UserGroupIcon, UserIcon, HeartIcon, TrashIcon } from '@heroicons/react/20/solid';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';
import Footer from '../components/Footer';
import iconImage from '../images/avatar.png';
import Header from '../components/Header';
import backgroundImage from '../images/mainpage.jpg';
import ModalIntegrantesProjeto from '../components/ModalIntegrantesProjeto';
import { toast } from 'react-toastify';

function Project() {
  const { slug } = useParams();
  const navigate = useNavigate();
  
  const [Data, setData] = useState<any>({});
  const [images, setImg] = useState();
  const [comentarios, setComentarios] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);
  const [comentarios, setComentarios] = useState<any[]>([]);
  
  const [modalIntegranteAberto, setModalIntegranteAberto] = useState(false);
  const [integranteSelecionado, setIntegranteSelecionado] = useState<any>(null);
  
  // Estados para o novo comentário
  const [commentText, setCommentText] = useState("");
  const token = localStorage.getItem('authToken');
  const userName = localStorage.getItem('userName');

  const handleClickIntegrante = async (pessoa: any) => {
    if (typeof pessoa === 'string') {
      setIntegranteSelecionado({ Nome: pessoa });
      setModalIntegranteAberto(true);
    } else {
      const integranteFormatado = {
          Nome: pessoa.nomeCompleto || pessoa.Nome || "Nome não disponível",
          Minibio: pessoa.minibio || pessoa.Minibio || "",
          Foto: iconImage,
          Lattes: pessoa.lattes || pessoa.Lattes || "",
          LinkedIn: pessoa.linkedin || pessoa.LinkedIn || "",
          GitHub: pessoa.github || pessoa.GitHub || "",
          Email: pessoa.email || pessoa.Email || "",
          RedeSocial: pessoa.redeSocial || pessoa.RedeSocial || "",
      };
      
      try {
        const response = await axios.get(`${import.meta.env.VITE_url_backend}/view_fotos_integrantes/${pessoa.id}`);
        if (response.data.url){
          integranteFormatado.Foto = response.data.url;
        }
      } catch (error) {
        console.log("Sem foto personalizada, usando padrão.");
      }
      
      setIntegranteSelecionado(integranteFormatado);
      setModalIntegranteAberto(true);
    }
  };
  
  const getYouTubeID = (url) => {
    if (!url) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : url;
  };

  useEffect(() => {
    if (slug) {
      // 1. Busca os dados do projeto usando o slug.
      axios.get(`${import.meta.env.VITE_url_backend}/projetos/${slug}`)
        .then((response) => {
          const projeto = response.data;
          const projectId = projeto.id; // Garante que temos o ID real do projeto

          const equipeFormatada = (projeto.equipe || []).map((pessoa) => {
            if (typeof pessoa === 'string') return { nomeCompleto: pessoa };
            if (pessoa.Nome) return { ...pessoa, nomeCompleto: pessoa.Nome };
            return pessoa;
          });

          setData({ ...projeto, equipe: equipeFormatada });
          setComentarios(projeto.comentarios || []);

          // 2. Com o ID real, busca a logo e as fotos.
          if (projectId) {
            axios.get(`${import.meta.env.VITE_url_backend}/view_logo_projeto/${projectId}`)
              .then((response) => {
                setImg(response.data.url);
              })
              .catch(error => {
                console.log("Nenhuma imagem de logo encontrada:", error);
              });

            axios.get(`${import.meta.env.VITE_url_backend}/view_fotos_projeto/${projectId}`)
              .then((response) => {
                setGalleryImages(response.data.urls || []);
              })
              .catch(error => {
                console.log("Nenhuma imagem de galeria encontrada:", error);
                setGalleryImages([]);
              });
          }
        })
        .catch(error => {
          console.error("Erro ao buscar dados do projeto:", error);
        });
    }
  }, [slug]);

  const [modalOpen, setModalOpen] = useState(false);

  const videoId = getYouTubeID(Data.pitch);

  // Função para enviar o comentário
  const handleSendComment = async () => {
    if (!commentText.trim()) return;

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_url_backend}/projetos/${Data.id}/comentar?usuario=${userName}&comentario=${commentText}&id_token=${token}`
      );

      // Atualiza a lista com o retorno do backend ou insere localmente
      if (response.data.comentarios) {
        setComentarios(response.data.comentarios);
      } else {
        const novoComentario = {
            username: userName,
            comentario: commentText,
            data: new Date().toLocaleDateString('pt-BR')
        };
        setComentarios([...comentarios, novoComentario]);
      }
      
      setCommentText(""); // Limpa o campo
      toast.success("Comentário enviado!"); 

    } catch (error: any) {
      console.error("Erro ao enviar comentário:", error);
      
      // TRATAMENTO DE TOKEN EXPIRADO
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        toast.error("Sua sessão expirou. Por favor, faça login novamente.");
        localStorage.clear();
        setTimeout(() => navigate('/login'), 2000);
        return;
      }

      const msgErro = error.response?.data?.detail || "Erro ao enviar comentário.";
      toast.error(msgErro);
    }
  };

  // Função para deletar comentário (se for dono)
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
      console.error("Erro ao deletar comentário:", error);
      
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        toast.error("Sessão expirada.");
        localStorage.clear();
        navigate('/login');
      } else {
        toast.error("Erro ao excluir comentário.");
      }
    }
  };

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_url_backend}/projetos/${slug}`).then((response) => {
      const projeto = response.data;

      const equipeFormatada = (projeto.equipe || []).map((pessoa: any) => {
        if (typeof pessoa === 'string') return { nomeCompleto: pessoa };
        if (pessoa.Nome) return { ...pessoa, nomeCompleto: pessoa.Nome };
        return pessoa;
      });

      setData({ ...projeto, equipe: equipeFormatada });
      // CARREGA OS COMENTÁRIOS DO BANCO AO ABRIR A PÁGINA
      setComentarios(projeto.comentarios || []);
    });

    axios.get(`${import.meta.env.VITE_url_backend}/view_logo_projeto/${slug}`).then((response) => {
      setImg(response.data.url);
    });
 }, [slug]);

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
        {/* Vídeo do pitch */}
        <section className="flex flex-col items-center w-full mt-12">
          {Data.pitch ? (
             <iframe
             width="560"
             height="315"
             src={"https://www.youtube.com/embed/" + Data.pitch}
             title="YouTube video player"
             allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
             referrerPolicy="strict-origin-when-cross-origin"
             allowFullScreen
           ></iframe>
          ) : (
            <div className="w-full h-64 bg-gray-200 flex items-center justify-center rounded-lg">
                <p className="text-gray-500">Vídeo não disponível</p>
            </div>
          )}
        </section>

        {/* Imagem e descrição do projeto */}
        <section className="flex justify-center w-full">
          <div className="flex flex-col md:flex-row items-center gap-5 bg-white shadow-lg rounded-lg p-6 md:p-8 max-w-4xl w-full">
            <div className="flex-shrink-0">
              <div className="h-32 w-32 md:h-48 md:w-48 rounded-full overflow-hidden border-4 border-gray-200 shadow-md flex items-center justify-center">
                <img className="w-full h-full object-cover" src={images || iconImage} alt="Project Thumbnail" />
              </div>
            </div>
            <div className="flex flex-col justify-center text-center md:text-left w-full">
              <p className="text-gray-700 text-lg md:text-xl leading-relaxed">
                {Data.descricao || "Descrição do projeto não disponível."}
              </p>
              <div 
                className="mt-4 inline-flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded w-fit ml-auto">
                <HeartIcon className="h-6 w-6 mr-2" />
                {Data.curtidas || 0} Likes
              </div>
            </div>
          </div>
          <p className="text-gray-700 text-lg leading-relaxed">
            {Data.descricao || "Descrição do projeto não disponível."}
          </p>
        </section>

        {/* Galeria */}
        {galleryImages.length > 0 && (
          <section className="bg-white shadow-2xl rounded-lg p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Galeria</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {galleryImages.map((url, index) => (
                <div key={index} className="overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                  <img src={url} alt={`Imagem da galeria do projeto ${index + 1}`} className="w-full h-full object-cover"/>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Vídeo do pitch */}
        {videoId && (
          <section className="bg-white shadow-2xl rounded-lg p-8 flex flex-col items-center w-full">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 self-start">Vídeo de Apresentação</h2>
            <div className="aspect-w-16 aspect-h-9 w-full">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${videoId}`}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              ></iframe>
            </div>
          </section>
        )}

        {/* Informações Adicionais */}
        <section className="bg-white shadow-2xl rounded-lg p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Detalhes do Projeto</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              
              {/* Card Equipe */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center text-gray-700">
                  <UserGroupIcon className="h-6 w-6 mr-3 text-blue-600" />
                  <h3 className="text-xl font-semibold">Equipe</h3>
                </div>
                <ul className="list-disc list-inside pl-4 text-gray-600">
                  {Array.isArray(Data.equipe) && Data.equipe.map((pessoa, index) => (
                    <li
                      key={index}
                      className="cursor-pointer hover:text-blue-500 transition-colors"
                      onClick={() => {
                        handleClickIntegrante(pessoa).then(() => setModalIntegranteAberto(true))
                      }}
        {/* Informações do projeto */}
        <div className="w-full flex justify-center">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 w-full">

            <section className="flex flex-col border border-light-color rounded-lg shadow-md pb-4">
              <div className="flex items-center bg-blue-600 text-white rounded-t-lg px-4 py-2 transition-colors hover:bg-blue-700">
                <UserGroupIcon className="h-5 w-5 mr-2" />
                <h2 className="text-base font-semibold">Equipe</h2>
              </div>
              <div className="px-4 py-2">
                {Array.isArray(Data.equipe) &&
                  Data.equipe.map((pessoa: any, index: number) => (
                    <li
                      key={index}
                      className="cursor-pointer text-blue-600 hover:underline list-disc ml-4"
                      onClick={() => handleClickIntegrante(pessoa)}
                    >
                      {pessoa.nomeCompleto || "Nome não disponível"}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Card Tecnologias */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center text-gray-700">
                  <Cog8ToothIcon className="h-6 w-6 mr-3 text-blue-600" />
                  <h3 className="text-xl font-semibold">Tecnologias</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {Data.tecnologias_utilizadas?.map((tech, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
			</section>

            <section className="flex flex-col border border-light-color rounded-lg shadow-md pb-4">
              <div className="flex items-center bg-blue-600 text-white rounded-t-lg px-4 py-2 transition-colors hover:bg-blue-700">
                <Cog8ToothIcon className="h-5 w-5 mr-2" />
                <h2 className="text-base font-semibold">Tecnologias</h2>
              </div>
              <ul className="px-4 py-2 text-gray-700 list-disc ml-4">
                {Data.tecnologias_utilizadas?.map((tech: string, index: number) => (
                  <li key={index}>{tech}</li>
                ))}
              </ul>
            </section>

            <section className="flex flex-col border border-light-color rounded-lg shadow-md pb-4">
              <div className="flex items-center bg-blue-600 text-white rounded-t-lg px-4 py-2 transition-colors hover:bg-blue-700">
                <UserIcon className="h-5 w-5 mr-2" />
                <h2 className="text-base font-semibold">Cliente</h2>
              </div>

              {/* Card Parceiro */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center text-gray-700">
                  <UserIcon className="h-6 w-6 mr-3 text-blue-600" />
                  <h3 className="text-xl font-semibold">Parceiro</h3>
                </div>
                <p className="text-gray-600">{Data.cliente || "Não disponível"}</p>
              </div>

              {/* Card Semestre */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center text-gray-700">
                  <CalendarIcon className="h-6 w-6 mr-3 text-blue-600" />
                  <h3 className="text-xl font-semibold">Semestre</h3>
                </div>
                <p className="text-gray-600">{Data.semestre || "Não disponível"}</p>
              </div>

              {/* Card Links Úteis */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center text-gray-700">
                  <FolderIcon className="h-6 w-6 mr-3 text-blue-600" />
                  <h3 className="text-xl font-semibold">Links Úteis</h3>
                </div>
                <div className="flex flex-col space-y-1">
                  <a href={Data.link_repositorio} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    Repositório no GitHub
                  </a>
                  <a href={Data.video_tecnico} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    Vídeo Técnico
                  </a>
                </div>
              <div className="px-4 py-2 space-y-1 flex flex-col">
                {Data.link_repositorio && (
                    <a href={Data.link_repositorio} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-800">
                        Repositório no GitHub
                    </a>
                )}
                {Data.video_tecnico && (
                    <a href={Data.video_tecnico} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-800">
                        Vídeo Técnico
                    </a>
                )}
              </div>
            </div>
        </section>

        {/* Seção de Comentários */}
        <section className="bg-white shadow-2xl rounded-lg p-8 mt-10">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Comentários</h2>
          <div className="flex flex-col gap-6">
            {comentarios.length > 0 ? (
              comentarios.map((comentario, index) => (
                <div key={index} className="flex items-start border-b border-gray-200 pb-4">
                  <img
                    src={iconImage} // Idealmente, a foto do usuário viria aqui
                    alt="Avatar do usuário"
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div className="flex-grow">
                    <p className="font-semibold text-gray-800">{comentario.username}</p>
                    <p className="text-sm text-gray-500 mb-1">{new Date(comentario.data).toLocaleDateString()}</p>
                    <p className="text-gray-700">{comentario.comentario}</p>
        <section className="mt-10 w-full max-w-4xl mx-auto">
          <hr className="border-t border-gray-300 my-4" />
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Comentários</h2>

          {/* Formulário de Comentário */}
          <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
            {token ? (
              <>
                <h3 className="text-lg font-medium mb-3 text-gray-800">Deixe seu comentário</h3>
                <textarea
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
                        ? "bg-blue-600 hover:bg-blue-700 shadow-sm" 
                        : "bg-gray-400 cursor-not-allowed"
                    }`}
                  >
                    Enviar Comentário
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-600 mb-4 text-lg">Você precisa estar logado para comentar neste projeto.</p>
                <Link 
                  to="/login" 
                  className="inline-block bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition duration-300 font-medium shadow-md hover:shadow-lg"
                >
                  Fazer Login
                </Link>
              </div>
            )}
          </div>

          {/* Lista de Comentários */}
          <div className="flex flex-col gap-4">
            {comentarios && comentarios.length > 0 ? (
              comentarios.map((comentario: any, index: number) => (
                <div key={index} className="flex items-start bg-white p-4 rounded-lg shadow-sm border border-gray-100 relative group">
                  <div className="flex-shrink-0 mr-4">
                     <img
                        src={iconImage}
                        alt="Ícone do usuário"
                        className="w-12 h-12 rounded-full bg-gray-200 p-1"
                      />
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-baseline mb-1">
                      <h4 className="text-md font-bold text-gray-900">{comentario.username || "Usuário Anônimo"}</h4>
                      <span className="text-xs text-gray-500">{comentario.data}</span>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{comentario.comentario}</p>
                  </div>
                  
                  {/* Ícone de Lixeira - Só aparece se o usuário logado for o dono do comentário */}
                  {userName && comentario.username === userName && (
                    <button 
                        onClick={() => handleDeleteComment(comentario)}
                        className="absolute top-12 right-4 text-gray-400 hover:text-red-500 transition-colors p-1"
                        title="Excluir comentário"
                    >
                        <TrashIcon className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-600">Seja o primeiro a comentar!</p>
              <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                  <p className="text-gray-500 italic">Não há comentários ainda. Seja o primeiro a comentar!</p>
              </div>
            )}
          </div>
        </section>
      </main>
         <ModalIntegrantesProjeto
           isOpen={modalIntegranteAberto}
           onClose={() => {
            setFotoIntegrante([])
            setModalIntegranteAberto(false)}}
           integrante={integranteSelecionado}
         />
      <Footer />
    </>
  );
}

export default Project;