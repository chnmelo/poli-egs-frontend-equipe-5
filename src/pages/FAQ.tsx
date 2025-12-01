import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import backgroundImage from '../assets/mainpage.jpg'; // Certifique-se de que o caminho esteja correto
import { Table } from 'react-bootstrap';
import axios from 'axios';

function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqData = [
    {
      question: 'Como posso me inscrever em um projeto?',
      answer: 'Você pode se inscrever diretamente na página de projetos ou entrando em contato com o professor responsável.',
    },
    {
      question: 'Quem pode submeter projetos ao observatório?',
      answer: 'Alunos e professores da UPE podem submeter projetos em andamento ou concluídos.',
    },
    {
      question: 'Há algum prazo para submissão de projetos?',
      answer: 'Os projetos podem ser submetidos durante todo o semestre, sem data limite específica.',
    },
    {
      question: 'Como os projetos são avaliados?',
      answer: 'Os projetos são avaliados por uma comissão composta por professores e coordenadores, com base na inovação e relevância.',
    },
    {
      question: 'Posso participar de mais de um projeto ao mesmo tempo?',
      answer: 'Sim, desde que você consiga conciliar as atividades e tenha autorização dos orientadores envolvidos.',
    },
    {
      question: 'O observatório oferece algum tipo de certificado?',
      answer: 'Sim, participantes ativos e orientadores podem receber certificados de participação ao final do projeto.',
    },
    {
      question: 'Há algum custo para participar dos projetos?',
      answer: 'Não, todos os projetos são gratuitos e promovidos pela UPE para incentivar a pesquisa e o desenvolvimento.',
    },
    {
      question: 'Posso submeter um projeto individual?',
      answer: 'Sim, tanto projetos individuais quanto em grupo são aceitos, desde que estejam alinhados com as diretrizes da UPE.',
    },
    {
      question: 'Como posso acompanhar o andamento dos projetos?',
      answer: 'Você pode acompanhar o progresso dos projetos diretamente na plataforma, através de relatórios e atualizações periódicas.',
    },
    {
      question: 'Quais áreas de conhecimento são aceitas no observatório?',
      answer: 'O observatório aceita projetos de todas as áreas do conhecimento, com foco em inovação e impacto social.',
    }
	];

	const [Input, setInput] = useState<string>("");
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [Duvida, setDuvida] = useState<DuvidaType[]>([]);

	useEffect(() => {
		axios.get(`/duvidas/`)
		    .then(response => {
		        const duvidas = response.data.duvidas;
                const apenasPostadas = duvidas.filter((d: DuvidaType) => d.postado);
                setDuvida(apenasPostadas);
		    })
		    .catch(error => console.error('Erro ao buscar dúvidas:', error));
	}, []);


	const columns = [
		{ key: "titulo", label: "Título" },
		{ key: "acoes", label: "Detalhes" },
	];

	const handleUpdate = () => {
		axios.get(`/duvidas/`)
			.then(response => { setDuvida(response.data.duvidas || []); })
			.catch(error => { console.error('Erro ao atualizar duvida', error); });
		};

		const filteredDuvida = Array.isArray(Duvida) ? Duvida.filter((duvida) => {
		const input = Input.toLowerCase();

		return (
			duvida.titulo?.toLowerCase().includes(input) ||
			duvida.mensagem?.toLowerCase().includes(input) ||
			duvida.resposta?.toLowerCase().includes(input) ||
			duvida.data_de_postagem?.toLowerCase().includes(input) ||
			duvida.autor?.toLowerCase().includes(input)
			);

	}) : [];

	const orderedDuvidas = [...filteredDuvida].sort((a, b) => {
		const dateA = new Date(a.data_de_postagem).getTime();
		const dateB = new Date(b.data_de_postagem).getTime();

		if (dateA === dateB) {
		  return a.resposta ? 1 : -1;
		}
		return dateB - dateA;
	});

	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 10;
	const totalPages = Math.ceil(orderedDuvidas.length / itemsPerPage);
	const startIndex = (currentPage - 1) * itemsPerPage;
	const paginatedDuvidas = orderedDuvidas.slice(startIndex, startIndex + itemsPerPage);

	const [mensagensExpandidas, setMensagensExpandidas] = useState<{ [key: string]: boolean }>({});
	const [respostasExpandidas, setRespostasExpandidas] = useState<{ [key: string]: boolean }>({});

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
          <h1 className="text-5xl font-bold mb-6 text-center">Perguntas Frequentes (FAQ)</h1>
          <p className="text-2xl mb-8 text-center">Tire suas dúvidas conosco</p>
        </div>
      </section>

      {/* Seção de Perguntas Frequentes */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="space-y-6">
            {faqData.map((item, index) => (
              <div key={index} className="border-b border-gray-200 pb-6">
                <button
                  className="w-full text-left flex items-center justify-between text-xl font-semibold text-gray-800 focus:outline-none"
                  onClick={() => toggleFAQ(index)}
                >
                  <span>{item.question}</span>
                  <svg
                    className={`h-6 w-6 transform transition-transform duration-200 ${
                      openIndex === index ? '-rotate-180' : 'rotate-0'
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openIndex === index && (
                  <p className="mt-4 text-gray-600">{item.answer}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

		<section
                className="relative bg-cover bg-center h-96"
                style={{ backgroundImage: `url(${backgroundImage})` }}
					>
                <div className="absolute inset-0 bg-black bg-opacity-60"></div>
                <div className="relative z-10 flex items-center justify-center h-full">
                <h1 className="text-4xl text-white font-bold text-center px-6">
                    Resposta a Dúvidas/Sugestões
                </h1>
                </div>
			</section>

  <div className="px-[13vw] py-12">
    <div className="relative mb-8">
      <input
        type="text"
        placeholder="Pesquisar"
        className="w-full border border-gray-300 rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={Input}
        onChange={(e) => setInput(e.target.value)}
      />
    </div>

	{paginatedDuvidas.map((duvida) => {
    const isExpanded = mensagensExpandidas[duvida.id] || false;
    const maxChars = 200;
    const mensagemCortada = duvida.mensagem.length > maxChars && !isExpanded;


    return (
        <div
            key={duvida.id}
            className="mb-8 p-6 bg-white rounded-2xl shadow-lg border border-gray-200"
        >
        <h2 className="text-xl font-semibold mb-3 text-gray-800">{duvida.titulo}</h2>

            <div className="mb-4">
                <p className="font-medium text-gray-700 mb-1">Dúvida/Sugestão/Comentário:</p>
            <div className="bg-gray-100 p-4 rounded-xl text-gray-800 whitespace-pre-wrap break-words">
                {mensagemCortada
                    ? duvida.mensagem.slice(0, maxChars) + "..."
                    : duvida.mensagem}
                    {duvida.mensagem.length > maxChars && (
                    <button
                        className="block text-blue-600 text-sm mt-2 underline"
                        onClick={() => setMensagensExpandidas((prev) => ({...prev, [duvida.id]: !isExpanded,
                    }))
                }
                >
                    {isExpanded ? "Mostrar menos" : "Ler mais"}
                    </button>
                    )}
            </div>
      </div>

      <div className="mb-4">
        <p className="font-medium text-gray-700 mb-1">Resposta do administrador:</p>
            <div className="bg-blue-50 p-4 rounded-xl text-gray-800 whitespace-pre-wrap break-words">
                {duvida.resposta
                ? duvida.resposta.length > maxChars && !respostasExpandidas[duvida.id]
                ? duvida.resposta.slice(0, maxChars) + "..."
                : duvida.resposta
                : <span className="italic text-gray-500">Sem resposta ainda.</span>}
                {duvida.resposta && duvida.resposta.length > maxChars && (
                <button
                    className="block text-blue-600 text-sm mt-2 underline"
                    onClick={() =>
                    setRespostasExpandidas(prev => ({
                    ...prev,
                    [duvida.id]: !prev[duvida.id],
            }))
        }
    >
      {respostasExpandidas[duvida.id] ? "Mostrar menos" : "Ler mais"}
    </button>
  )}
</div>
      </div>

      <div className="text-sm text-gray-600 flex flex-col sm:flex-row justify-between">
        <p>Autor: {duvida.autor}</p>
        <p>
          Postado em:{" "}
          {new Date(duvida.data_de_postagem).toLocaleDateString("pt-BR")} às{" "}
          {new Date(duvida.data_de_postagem).toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </div>
  );
})}
	<div className="flex justify-center items-center gap-2 mt-8">
		<button
		  disabled={currentPage === 1}
		  onClick={() => setCurrentPage((prev) => prev - 1)}
		  className={`px-4 py-2 rounded-lg border ${
		    currentPage === 1
		      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
		      : "bg-white text-blue-600 border-blue-600 hover:bg-blue-500 hover:text-white"
		  } transition`}
		>
		  Anterior
		</button>

		{Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
		  <button
		    key={page}
		    onClick={() => setCurrentPage(page)}
		    className={`px-4 py-2 rounded-lg border ${
		      currentPage === page
		        ? "bg-blue-600 text-white"
		        : "bg-white text-blue-600 border-blue-600 hover:bg-blue-500 hover:text-white"
		    } transition`}
		  >
		    {page}
		  </button>
		))}

		  <button
		    disabled={currentPage === totalPages}
		    onClick={() => setCurrentPage((prev) => prev + 1)}
		    className={`px-4 py-2 rounded-lg border ${
		      currentPage === totalPages
		        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
		        : "bg-white text-blue-600 border-blue-600 hover:bg-blue-500 hover:text-white"
		    } transition`}
		  >
		    Próximo
		  </button>
		</div>
	</div>

      <Footer />
    </>
  );
}

export default FAQ;