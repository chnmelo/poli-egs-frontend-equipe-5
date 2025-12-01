import { useState, useEffect } from "react";
import { Button } from "@headlessui/react";
import axios from "axios";
import { toast } from "react-toastify";

interface ModalLikesProps {
  projectId: string;
  initialLikes?: number;
  initialLikedUsers?: string[];
}

export default function ModalLikes({ projectId, initialLikes, initialLikedUsers }: ModalLikesProps) {
  const [likes, setLikes] = useState<number>(initialLikes || 0);
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(false);

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
    if (!identifier && visitorId) {
        identifier = `anon_${visitorId}`;
    }

    if (identifier && usersList) {
        return usersList.includes(identifier);
    }
    return false;
  };

  useEffect(() => {
    if (initialLikes !== undefined) setLikes(initialLikes);
    if (initialLikedUsers !== undefined) setIsLiked(checkIsLiked(initialLikedUsers));
  }, [initialLikes, initialLikedUsers]);

  const handleLike = async () => {
    if (loading) return;
    setLoading(true);

    const token = localStorage.getItem("authToken");
    let url = `/projetos/${projectId}/curtir/?`;

    if (token) {
        url += `id_token=${token}`;
    } else {
        const vId = getVisitorId();
        url += `visitor_id=${vId}`;
    }
  
    try {
      const response = await axios.post(url, {});
      
      if (response.data.msg === 'Projeto descurtido com sucesso!') {
          setIsLiked(false);
      } else if (response.data.msg === 'Projeto curtido com sucesso!') {
          setIsLiked(true);
      }
      
      if (response.data.curtidas !== undefined) {
        setLikes(response.data.curtidas);
      }
      
    } catch (error) {
      console.error("Erro ao curtir:", error);
      toast.error("Erro ao processar a curtida.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="inline-flex items-center gap-2">
        <Button
            onClick={handleLike}
            disabled={loading}
            className={`text-dark-color h-full w-5 transition-transform hover:scale-110 inline-flex items-center gap-1 justify-center ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            title={isLiked ? "Descurtir" : "Curtir"}
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
        <span className="text-sm font-semibold text-gray-700 select-none min-w-[20px] text-right">
            {likes}
        </span>
    </div>
  );
}