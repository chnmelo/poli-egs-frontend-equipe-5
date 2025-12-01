import React, { useEffect, useState } from 'react';
import { Listbox } from '@headlessui/react';
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/20/solid';
import axios from 'axios';
import { useParams, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
<<<<<<< HEAD
import backgroundImage from '../images/mainpage.jpg';
import Loading from '../components/Loading';
=======
import backgroundImage from '../assets/mainpage.jpg';
>>>>>>> bb14ec5 (bug fix)

function Projects() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const [input, setInput] = useState(searchQuery || slug || "");
  const [inputMembers, setInputMembers] = useState('');
  const [themes, setThemes] = useState(null);
  const [semester, setSemester] = useState('');
  const [cards, setCards] = useState([]);
  const [selectedSemesters, setSelectedSemesters] = useState([]);
  const [images, setImages] = useState({});
  const [loading, setLoading] = useState(true);

  const themeFilters = [
      { title: 'Inteligência Artificial', key_words: "Inteligência Artificial, IA, machine learning, aprendizado de máquina, redes neurais, algoritmo inteligente" },
      { title: 'Ciência de Dados', key_words: "Ciência de dados, Data Science, Análise de dados, Mineração de dados" },
      { title: 'Finanças', key_words: "Finanças, Financeiro, Economia, Investimentos, Fintech" },
      { title: 'Dívida Técnica', key_words: "Dívida Técnica, Código legado, Refatoração, Débito técnico, Manutenção de código" },
      { title: 'Gestão', key_words: "Gestão, Gerenciamento, Planejamento, Administração, Liderança, Indicadores Chave de Desempenho" },
      { title: 'LGPD', key_words: "LGPD, Lei Geral de Proteção de Dados, Dados Pessoais, Proteção de Dados, Vazamento de dados, Segurança da Informação, Anonimização" },
      { title: 'Saúde', key_words: "Saúde, Sistema de Saúde, Paciente, Exame, Diagnóstico, Atendimento médico, Hospital, Hospitalar" },
      { title: 'Educação', key_words: "Educação, Ensino, Professor, Aprendizagem, EAD, Pedagógico, Educacional, Alfabetização" }
  ]
  

  useEffect(() => {
    setLoading(true);
    setInput(searchQuery);
    setThemes(location.state?.themes ? location.state?.themes : null)
    axios.get(`/projetos/`)
      .then((response) => {
        const data = response.data.projetos;
        setCards(data);

<<<<<<< HEAD
=======
        // Extrai semestres únicos
>>>>>>> bb14ec5 (bug fix)
        const semesters = data.map((project) => project.semestre);
        const uniqueSemesters = [...new Set(semesters)];
        setSelectedSemesters(uniqueSemesters);
      })
      .catch((error) => {
        console.error('Erro ao buscar os projetos:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [searchQuery]);
  
  const resetFilters = () => {
    setInput('');
    setInputMembers('');
    setThemes(null);
    setSemester('');
  };

  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  const handleInputMembersChange = (event) => {
    setInputMembers(event.target.value);
  };

    const fetchLogo = async (id: string) => {
      try {
        const response = await axios.get(`/view_logo_projeto/${id}/`);
        if (response.data && response.data.url) {
          setLogos(prevLogos => ({ ...prevLogos, [id]: response.data.url }));
        }
      } catch (error) {
        console.error('Erro ao buscar logo do projeto:', error);
      }
    };


  const filteredCards = Array.isArray(cards)
  ? cards.filter((project) => {
      const searchInput = input.toLowerCase();
      const searchMembers = inputMembers.toLowerCase();
      const searchThemes = themes?.key_words?.toLowerCase().split(/, | e /) || themeFilters.map(theme => theme.key_words.toLowerCase().split(/, | e /)).flat();
      const searchSemester = semester.toLowerCase();
      const projectThemes = project.tema?.toLowerCase().split(/, | e /)

      const palavrasChave = Array.isArray(project.palavras_chave)
        ? project.palavras_chave.join(' ').toLowerCase()
        : '';
      
      const checker = (arr, target) => target.every(e => arr.includes(e));

      // Lógica corrigida para extrair nomes de integrantes, sejam strings ou objetos
      const projectMembersStr = project.equipe
        ? (Array.isArray(project.equipe)
            ? project.equipe.map((p: any) => 
                typeof p === 'string' ? p : (p.nomeCompleto || p.Nome || '')
              ).join(' ')
            : project.equipe.toString()
          ).toLowerCase()
        : '';

      return (
        (project.titulo?.toLowerCase().includes(searchInput) ||
          palavrasChave.includes(searchInput) ||
          project.tema?.toLowerCase().includes(searchInput)) &&
        projectMembersStr.includes(searchMembers) &&
        (themes == null ? true : checker(searchThemes, projectThemes)) &&
        project.semestre?.toLowerCase().includes(searchSemester)
      );
    })
  : [];

  return (
    <>
      <Header />

      <section
        className="relative bg-cover bg-center h-96"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white px-4">
          <h1 className="text-5xl font-bold mb-6 text-center">Projetos</h1>
          <p className="text-2xl mb-8 text-center">Explore nossos projetos e iniciativas</p>
          <div className="flex w-full max-w-lg">
            <input
              type="search"
              name="searchbar"
              id="searchbar"
              className="w-full h-16 px-6 rounded-l-full bg-white bg-opacity-20 text-white placeholder-white outline-none focus:bg-white focus:text-black transition-colors duration-300"
              placeholder="Pesquise por nome, tema, palavra-chave"
              value={input}
              onChange={handleInputChange}
            />
            <button
              className="bg-blue-600 h-16 px-6 rounded-r-full hover:bg-blue-700 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-4.35-4.35M17 11A6 6 0 1111 5a6 6 0 016 6z"
                />
              </svg>
            </button>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4 flex flex-col lg:flex-row gap-8">
          {/* Filtro de Pesquisa */}
          <div className="w-full lg:w-1/4 bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6">Filtrar Projetos</h2>
            <form>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Área do projeto:</label>
                <Listbox value={themeFilters.map(theme => theme.title)} onChange={setThemes}>
                  <div className="relative">
                    <Listbox.Button className="relative w-full h-12 pl-3 pr-10 text-left bg-white rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <span className="block truncate">{themes?.title || 'Selecione uma área'}</span>
                      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                        <ChevronDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </span>
                    </Listbox.Button>
                    <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg">
                      {themeFilters.map((theme, index) => (
                        
                        <Listbox.Option
                          key={index}
                          value={theme}
                          className={({ active }) =>
                            `cursor-default select-none relative py-2 pl-10 pr-4 ${
                              active ? 'text-white bg-blue-600' : 'text-gray-900'
                            }`
                          }
                        >
                          {({ selected }) => (
                            <>
                              <span
                                className={`block truncate ${
                                  selected ? 'font-medium' : 'font-normal'
                                }`}
                              >
                                {theme.title}
                              </span>
                              {selected ? (
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-white">
                                  <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                </span>
                              ) : null}
                            </>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </div>
                </Listbox>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Ano/Semestre:</label>
                <Listbox value={semester} onChange={setSemester}>
                  <div className="relative">
                    <Listbox.Button className="relative w-full h-12 pl-3 pr-10 text-left bg-white rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <span className="block truncate">{semester || 'Selecione um semestre'}</span>
                      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                        <ChevronDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </span>
                    </Listbox.Button>
                    <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg">
                      {selectedSemesters.map((sem, index) => (
                        <Listbox.Option
                          key={index}
                          value={sem}
                          className={({ active }) =>
                            `cursor-default select-none relative py-2 pl-10 pr-4 ${
                              active ? 'text-white bg-blue-600' : 'text-gray-900'
                            }`
                          }
                        >
                          {({ selected }) => (
                            <>
                              <span
                                className={`block truncate ${
                                  selected ? 'font-medium' : 'font-normal'
                                }`}
                              >
                                {sem}
                              </span>
                              {selected ? (
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-white">
                                  <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                </span>
                              ) : null}
                            </>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </div>
                </Listbox>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">
                  Pesquisar (nome, palavra-chave):
                </label>
                <input
                  type="text"
                  className="w-full h-12 px-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: Tracy-TD, Inteligência Artificial..."
                  value={input}
                  onChange={handleInputChange}
                />
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2">Integrantes:</label>
                <input
                  type="text"
                  className="w-full h-12 px-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: Ana Karla, Arthur Xavier..."
                  value={inputMembers}
                  onChange={handleInputMembersChange}
                />
              </div>

              <button
                type="button" 
                onClick={resetFilters} 
                className="w-full h-12 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition-colors"
              >
                Remover Filtros
              </button>
            </form>
          </div>

          {/* Lista de Projetos com Loading */}
          <div className="w-full lg:w-3/4">
            {loading ? (
              <Loading />
            ) : (
              <>
                {filteredCards.filter(project => project.revisado === "Aprovado").length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {filteredCards
                      .filter(project => project.revisado === "Aprovado")
                      .map((project) => (
                        <div
                          key={project.id}
                          className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col"
                        >
                          <img
                            src={images[project.id] || backgroundImage}
                            alt={project.titulo}
                            className="w-full h-48 object-cover"
                          />
                          <div className="p-6 flex flex-col flex-grow">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="text-2xl font-bold text-blue-600">{project.titulo}</h3>
                              <div className="flex items-center text-gray-600">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-6 w-6 mr-1 mt-1 mb-1"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                                </svg>
                                <span>{project.curtidas || 0}</span>
                              </div>
                            </div>
                            <p className="text-gray-700 flex-grow">{project.descricao}</p>
                            <button
                              onClick={() => navigate(`/projetos/${project.id}/`)}
                              className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                            >
                              Ver mais
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-600">Nenhum projeto encontrado.</p>
                )}
              </>
            )}
          </div>

        </div>
      </section>

      <Footer />
    </>
  );
}

export default Projects;