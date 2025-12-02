import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import HeaderUser from "../../components/HeaderUser";
import Footer from "../../components/Footer";
import { UserCircleIcon, KeyIcon } from "@heroicons/react/24/outline";

export default function Profile() {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    // O interceptor do main.tsx injeta o token no Header automaticamente.
    axios.get(`/users/me/`)
      .then((res) => {
        setUsername(res.data.username || "");
        setEmail(res.data.email || "");
        if (res.data.username) localStorage.setItem("userName", res.data.username);
      })
      .catch((err) => {
        console.error(err);
        if (err.response?.status !== 401) {
            toast.error("Erro ao carregar dados do perfil.");
        }
      });
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password && password !== confirmPassword) {
      toast.error("As senhas não coincidem!");
      return;
    }
    
    if (password && password.length < 6) {
        toast.error("A senha deve ter no mínimo 6 caracteres.");
        return;
    }

    setLoading(true);
    try {
      const payload = {
        username: username,
        ...(password ? { password } : {})
      };

      await axios.put(`/users/me/`, payload);
      
      toast.success("Perfil atualizado com sucesso!");
      localStorage.setItem("userName", username);
      
      if (password) {
        toast.info("Senha alterada. Por favor, faça login novamente.");
        setTimeout(() => {
            localStorage.clear();
            window.location.href = "/login";
        }, 2000);
      } else {
        // Limpa campos de senha se só mudou o nome
        setPassword("");
        setConfirmPassword("");
      }
      
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Erro ao atualizar perfil.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <HeaderUser />
      <div className="min-h-[80vh] bg-gray-100 flex flex-col items-center py-10 px-4">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg">
          <div className="flex items-center gap-3 mb-6 border-b pb-4">
            <UserCircleIcon className="h-10 w-10 text-primary-color" />
            <h1 className="text-2xl font-bold text-gray-800">Meu Perfil</h1>
          </div>

          <form onSubmit={handleUpdate} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500 cursor-not-allowed"
              />
              <span className="text-xs text-gray-500">O e-mail não pode ser alterado.</span>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome de Usuário</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-color focus:outline-none"
                placeholder="Seu nome"
                required
              />
            </div>

            <div className="pt-4 border-t mt-4">
              <div className="flex items-center gap-2 mb-4 text-gray-800">
                <KeyIcon className="h-5 w-5" />
                <h2 className="font-semibold">Alterar Senha (Opcional)</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nova Senha</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-color focus:outline-none"
                    placeholder="Deixe em branco para manter a atual"
                    autoComplete="new-password"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar Nova Senha</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-color focus:outline-none"
                    placeholder="Confirme a nova senha"
                    disabled={!password}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg text-white font-bold text-lg transition-colors ${
                loading ? "bg-gray-400 cursor-not-allowed" : "bg-primary-color hover:bg-blue-800"
              }`}
            >
              {loading ? "Salvando..." : "Salvar Alterações"}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}