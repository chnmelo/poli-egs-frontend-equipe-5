import { useState, useEffect } from "react";
import { Button, Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import axios from "axios";
import { toast } from "react-toastify";

interface ModalLikesProps {
  projectId: string;
  initialLikes?: number;
  initialLikedUsers?: string[];
}

export default function ModalLikes({ projectId, initialLikes, initialLikedUsers }: ModalLikesProps) {
  const [open, setOpen] = useState(false);
  const [likes, setLikes] = useState<number>(initialLikes || 0);
  const [isLiked, setIsLiked] = useState(false);

  const handleShow = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Função para pegar ou criar um ID de visitante anônimo
  const getVisitorId = () => {
    let visitorId = localStorage.getItem("visitorId");
    if (!visitorId) {
      visitorId = crypto.randomUUID();
      localStorage.setItem("visitorId", visitorId);
    }
    return visitorId;
  };

  const checkIsLiked = (usersList: string[]) => {
    const email = localStorage.getItem('email');
    const visitorId = localStorage.getItem("visitorId");
    
    let identifier = email;
    // Se não estiver logado, tenta identificar pelo ID de visitante
    if (!identifier && visitorId) {
        identifier = `anon_${visitorId}`;
    }

    if (identifier && usersList) {
        return usersList.includes(identifier);
    }
    return false;
  };

  // Atualiza estado se as props mudarem (ex: recarregamento da lista pai)
  useEffect(() => {
    if (initialLikes !== undefined) setLikes(initialLikes);
    if (initialLikedUsers !== undefined) setIsLiked(checkIsLiked(initialLikedUsers));
  }, [initialLikes, initialLikedUsers]);

  // Garante dados frescos ao abrir o modal
  useEffect(() => {
    if (open) {
      fetchProjectLikes();
    }
  }, [open]);

  const handleLike = () => {
    const token = localStorage.getItem("authToken");
    let url = `/projetos/${projectId}/curtir?`;

    if (token) {
        url += `id_token=${token}`;
    } else {
        const vId = getVisitorId();
        url += `visitor_id=${vId}`;
    }
  
    axios.post(url, {})
      .then((response) => {
        if (response.data.msg === 'Projeto descurtido com sucesso!') {
            setIsLiked(false);
        } else if (response.data.msg === 'Projeto curtido com sucesso!') {
            setIsLiked(true);
        }
        setLikes(response.data.curtidas);
      })
      .catch((error) => {
        console.error("Erro ao curtir:", error);
        toast.error("Erro ao processar a curtida.");
      });
  };
  
  const fetchProjectLikes = async () => {
    try {
      const response = await axios.get(`/projetos/${projectId}`);
      setLikes(response.data.curtidas);
      if (response.data.user_curtidas_email) {
          setIsLiked(checkIsLiked(response.data.user_curtidas_email));
      }
    } catch (error) {
      console.error("Erro ao obter curtidas:", error);
    }
  };

  return (
    <>
        <Button
            onClick={handleShow}
            // CORREÇÃO AQUI: 'inline-flex' para respeitar o alinhamento da tabela
            className="text-dark-color h-full w-5 transition-transform hover:scale-110 inline-flex items-center gap-1 justify-center"
            title={isLiked ? "Você curtiu este projeto" : "Clique para curtir"}
        >
            {isLiked ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-red-500">
                    <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                </svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6 text-gray-500 hover:text-red-500 transition-colors">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                </svg>
            )}
        </Button>

        <Dialog open={open} onClose={handleClose} className="relative z-10">
            <DialogBackdrop className="fixed inset-0 bg-black bg-opacity-60 transition-opacity" />
            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
                    <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-2xl transition-all sm:w-full sm:max-w-lg">
                        <div className="bg-gradient-to-br from-blue-50 to-white px-6 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <DialogTitle as="h3" className="text-lg font-bold text-blue-800">
                                Curtir Projeto
                            </DialogTitle>
                            <div className="mt-3 text-sm text-gray-700">
                                <p>
                                    Este projeto possui <span className="font-semibold text-blue-600">{likes !== null ? likes : 0}</span> {likes === 1 ? "curtida" : "curtidas"}.
                                </p>
                            </div>
                        </div>
                        <div className="bg-gray-100 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                            <button
                                type="button"
                                onClick={handleLike}
                                className={`inline-flex w-full justify-center rounded-md px-4 py-2 text-sm font-semibold text-white shadow-md transition sm:ml-3 sm:w-auto ${isLiked ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                            >
                                {isLiked ? 'Descurtir' : 'Curtir'}
                            </button>
                            <button
                                type="button"
                                onClick={handleClose}
                                className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-50 sm:mt-0 sm:w-auto"
                            >
                                Fechar
                            </button>
                        </div>
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    </>
  );
}