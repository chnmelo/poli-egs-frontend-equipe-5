import { useEffect, useState } from 'react';
import { ArrowLeftIcon, CalendarIcon, Cog8ToothIcon, FolderIcon, UserGroupIcon, UserIcon, HeartIcon } from '@heroicons/react/20/solid';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Footer from '../components/Footer';
import iconImage from '../images/avatar.png';
import Header from '../components/Header';
import backgroundImage from '../images/mainpage.jpg';
import ModalIntegrantesProjeto from '../components/ModalIntegrantesProjeto';

function Project() {
  const { slug } = useParams();
  const [Data, setData] = useState({});
  const [images, setImg] = useState();
  const [comentarios, setComentarios] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);
  const [modalIntegranteAberto, setModalIntegranteAberto] = useState(false);
  const [integranteSelecionado, setIntegranteSelecionado] = useState<any>(null);
  const [fotoIntegrante, setFotoIntegrante] = useState([])


  const handleClickIntegrante = async (pessoa: any) => {
    console.log(fotoIntegrante)
    
    if (typeof pessoa === 'string') {
      setIntegranteSelecionado({ Nome: pessoa });
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
      axios.get(`${import.meta.env.VITE_url_backend}/view_fotos_integrantes/${pessoa.id}`)
      .then(response => {

        if (response.data.url){
          integranteFormatado.Foto = response.data.url
        }
        
        setIntegranteSelecionado(integranteFormatado);
      })
      .catch(error => console.log(error))
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
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-600">Seja o primeiro a comentar!</p>
            )}
          </div>
        </section>
      </main>
         <ModalIntegrantesProjeto
           isOpen={modalIntegranteAberto}
           onClose={() => {
            setFotoIntegrante(null)
            setModalIntegranteAberto(false)}}
           integrante={integranteSelecionado}
         />
      <Footer />
    </>
  );
}

export default Project;
