import { useEffect, useState } from 'react';
import { ArrowLeftIcon, CalendarIcon, Cog8ToothIcon, FolderIcon, UserGroupIcon, UserIcon, HeartIcon } from '@heroicons/react/20/solid';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Footer from '../components/Footer';
import iconImage from '../images/avatar.png';
import Header from '../components/Header';
import backgroundImage from '../images/mainpage.jpg';
import ModalIntegrantesProjeto from '../components/ModalIntegrantesProjeto';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";

function Project() {
  const { slug } = useParams();
  const [Data, setData] = useState({});
  const [images, setImg] = useState();
  const [comentarios, setComentarios] = useState([]);
  const [modalIntegranteAberto, setModalIntegranteAberto] = useState(false);
  const [integranteSelecionado, setIntegranteSelecionado] = useState<any>(null);
  const [fotoIntegrante, setFotoIntegrante] = useState([])
  const [images_project, setImages_project] = useState([])


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
  
  const getFotoIntegrante = (int,integranteFormatado) => {
      
  }


  useEffect(() => {

    axios.get(`${import.meta.env.VITE_url_backend}/projetos/${slug}`).then((response) => {
      const projeto = response.data;

    const equipeFormatada = (projeto.equipe || []).map((pessoa) => {
      if (typeof pessoa === 'string') return { nomeCompleto: pessoa };
      if (pessoa.Nome) return { ...pessoa, nomeCompleto: pessoa.Nome };
      return pessoa;
    });
    setImages_project(projeto.imagens || []);
    setData({ ...projeto, equipe: equipeFormatada });
    setComentarios(projeto.comentarios || []);
  });

  axios.get(`${import.meta.env.VITE_url_backend}/view_logo_projeto/${slug}`).then((response) => {
    setImg(response.data.url);
    });
 }, [slug]);

  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <Header />
      
      {/* Seção Hero */}
      <section
        className="relative bg-cover bg-center h-96"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white px-4">
          <h1 className="text-5xl font-bold mb-6 text-center">{Data.titulo}</h1>
        </div>
      </section>

      <main className="flex flex-col gap-14 px-[13vw] mb-20 pb-20">
        
        {/* Carousel projeto */}
        <section className="flex flex-col items-center w-full mt-12">
          <Carousel 
          className='flex flex-col md:flex-row items-center gap-4 bg-white shadow-lg rounded-lg p-4 md:p-4 max-w-4xl w-full'
          showThumbs={false} 
          autoPlay={false}>
            {Data.pitch && (<div>
              <iframe
                width="560"
                height="400"
                src={"https://www.youtube.com/embed/" + Data.pitch}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              ></iframe>
              <p className="legend">Video demonstração</p>
            </div>)}
            {images_project.map((image, index) => (
              <div key={index}>
                <img src={image} style={{height: 400, width: 560}} alt={`Project Image ${index + 1}`}/>
                <p className="legend">Imagem {index + 1}</p>
              </div>
              ))}
          </Carousel>
        </section>

        {/* Imagem e descrição do projeto */}
        <section className="flex justify-center w-full">
          <div className="flex flex-col md:flex-row items-center gap-5 bg-white shadow-lg rounded-lg p-6 md:p-8 max-w-4xl w-full">
            <div className="flex-shrink-0">
              <div className="h-32 w-32 md:h-48 md:w-48 rounded-full overflow-hidden border-4 border-gray-200 shadow-md flex items-center justify-center">
                <img className="w-full h-full object-cover" src={images || iconImage} alt="Project Thumbnail" />
              </div>
            </div>
            <div className="flex flex-col justify-center text-center md:text-left">
              <p className="text-gray-700 text-lg md:text-xl leading-relaxed">
                {Data.descricao || "Descrição do projeto não disponível."}
              </p>
              <div 
                className="mt-4 inline-flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded w-30 ml-auto">
                <HeartIcon className="h-6 w-6 mr-2" />
                {Data.curtidas || 0} Likes
              </div>
            </div>
          </div>
        </section>
        
        {/* Vídeo do pitch */}
        {/* <section className="flex flex-col items-center w-full mt-12">
          <iframe
            width="560"
            height="315"
            src={"https://www.youtube.com/embed/" + Data.pitch}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        </section> */}

        {/* Informações do projeto */}
        <div className="w-full flex justify-center">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">

            <section className="flex flex-col border border-light-color rounded-lg shadow-md pb-4">
              <div className="flex items-center bg-blue-600 text-white rounded-t-lg px-4 py-2 transition-colors hover:bg-blue-700">
                <UserGroupIcon className="h-5 w-5 mr-2" />
                <h2 className="text-base font-semibold">Equipe</h2>
              </div>
                {Array.isArray(Data.equipe) &&
                  Data.equipe.map((pessoa, index) => (
                    <li
                      key={index}
                      className="cursor-pointer text-blue-600 hover:underline list-disc ml-6"
                      onClick={() =>{
                        handleClickIntegrante(pessoa)
                        .then(() =>setModalIntegranteAberto(true))
                      }}
                    >
                      {pessoa.nomeCompleto || "Nome não disponível"}
                    </li>
                  ))}
			</section>

            <section className="flex flex-col border border-light-color rounded-lg shadow-md pb-4">
              <div className="flex items-center bg-blue-600 text-white rounded-t-lg px-4 py-2 transition-colors hover:bg-blue-700">
                <Cog8ToothIcon className="h-5 w-5 mr-2" />
                <h2 className="text-base font-semibold">Tecnologias Utilizadas</h2>
              </div>
              <ul className="px-4 py-2 text-gray-700">
                {Data.tecnologias_utilizadas?.map((tech, index) => (
                  <li key={index}>{tech}</li>
                ))}
              </ul>
            </section>

            <section className="flex flex-col border border-light-color rounded-lg shadow-md pb-4">
              <div className="flex items-center bg-blue-600 text-white rounded-t-lg px-4 py-2 transition-colors hover:bg-blue-700">
                <UserIcon className="h-5 w-5 mr-2" />
                <h2 className="text-base font-semibold">Pessoa/Organização Parceira</h2>
              </div>
              <p className="px-4 py-2 text-gray-700">{Data.cliente || "Informação não disponível"}</p>
            </section>

            <section className="flex flex-col border border-light-color rounded-lg shadow-md pb-4">
              <div className="flex items-center bg-blue-600 text-white rounded-t-lg px-4 py-2 transition-colors hover:bg-blue-700">
                <CalendarIcon className="h-5 w-5 mr-2" />
                <h2 className="text-base font-semibold">Semestre</h2>
              </div>
              <p className="px-4 py-2 text-gray-700">{Data.semestre || "Informação não disponível"}</p>
            </section>

            <section className="flex flex-col border border-light-color rounded-lg shadow-md pb-4">
              <div className="flex items-center bg-blue-600 text-white rounded-t-lg px-4 py-2 transition-colors hover:bg-blue-700">
                <FolderIcon className="h-5 w-5 mr-2" />
                <h2 className="text-base font-semibold">Links Úteis</h2>
              </div>
              <div className="px-4 py-2 space-y-1">
                <p className="text-blue-600 underline">
                  <a href={Data.link_repositorio} target="_blank" rel="noopener noreferrer">Link para Repositório no GitHub</a>
                </p>
                <p className="text-blue-600 underline">
                  <a href={Data.video_tecnico} target="_blank" rel="noopener noreferrer">Link para Vídeo Técnico</a>
                </p>
              </div>
            </section>
          </div>
        </div>
        
        {/* Seção de Comentários */}
        <section className="mt-10">
          <hr className="border-t border-gray-300 my-4" />
          <h2 className="text-2xl font-semibold mb-4">Comentários</h2>
          <div className="flex flex-col gap-4">
            {comentarios.length > 0 ? (
              comentarios.map((comentario, index) => (
                <div key={index} className="flex items-center border-b border-gray-200 py-2">
                  <img
                    src={iconImage}
                    alt="Ícone do usuário"
                    className="w-8 h-8 rounded-full mr-3"
                  />
                  <div className="flex-grow">
                    <p className="font-medium">{comentario.username}</p> {/* Exibindo o email do usuário */}
                    <p>{comentario.data}</p> {/* Exibindo data */}
                    <p>{comentario.comentario}</p> {/* Exibindo o comentário */}
                  </div>
                </div>
              ))
            ) : (
              <p>Não há comentários ainda.</p> // Caso não haja comentários
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
