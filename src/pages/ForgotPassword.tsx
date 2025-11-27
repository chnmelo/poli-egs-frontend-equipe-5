import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import backgroundImage from '../images/backgroundlogin.jpg';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!email) {
      setError('Por favor, insira seu e-mail.');
      return;
    }

    try {
      await axios.post(`/forgot-password/`, { email });
      setMessage('Se um usuário com este e-mail existir, um link de recuperação de senha será enviado.');
    } catch (err) {
      setError('Ocorreu um erro ao tentar enviar o link. Tente novamente mais tarde.');
      console.error('Erro na recuperação de senha:', err);
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <button
        onClick={() => navigate('/login')}
        className="absolute top-4 left-4 bg-blue-500 text-white py-1 px-4 rounded shadow hover:bg-blue-700 transition duration-300 text-sm"
      >
        Voltar para o Login
      </button>

      <div
        className="p-14 rounded-lg shadow-lg w-96"
        style={{
          backgroundColor: 'rgba(187, 170, 170, 0.205)',
          backdropFilter: 'blur(15px)',
        }}
      >
        <h2 className="text-3xl font-bold text-center mb-6 text-white">Recuperar Senha</h2>

        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="mb-4 relative">
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Digite seu e-mail"
              className="w-full py-3 px-4 rounded-xl bg-white bg-opacity-10 text-white border-transparent focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-300 hover:border hover:border-white/30"
              autoComplete="off"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition duration-300"
          >
            Enviar Link de Recuperação
          </button>

          {message && <p className="mt-4 text-center text-green-300">{message}</p>}
          {error && <p className="mt-4 text-center text-red-400">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
