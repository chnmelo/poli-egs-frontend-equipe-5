import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../assets/backgroundlogin.jpg';
import PasswordStrengthMeter from '../components/PasswordStrengthMeter';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Requisitos de senha
  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
  });

  useEffect(() => {
    setPasswordRequirements({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      specialChar: /[^A-Za-z0-9]/.test(password),
    });
  }, [password]);

  const allRequirementsMet = Object.values(passwordRequirements).every(Boolean);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("As senhas não coincidem!");
      return;
    }

    if (!allRequirementsMet) {
      setError("A senha não atende a todos os requisitos.");
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@(poli\.br|ecomp\.poli\.br|upe\.br)$/;
    if (!emailRegex.test(email)) {
      setError("Apenas e-mails dos domínios @poli.br, @ecomp.poli.br ou @upe.br são permitidos.");
      return;
    }
    
    try {
      const response = await fetch(`/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          password,
          is_admin: false,
        }),
      });

      if (response.ok) {
        setRegistrationSuccess(true);
      } else {
        const data = await response.json();
        setError(data.message || "O endereço de e-mail já existe.");
      }
    } catch (error) {
      console.error('Erro de rede:', error);
      setError('Erro de rede. Verifique sua conexão.');
    }
  };

  if (registrationSuccess) {
    return (
      <div
        className="flex items-center justify-center min-h-screen"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div
          className="p-10 rounded-lg shadow-lg w-full max-w-md text-center"
          style={{
            backgroundColor: 'rgba(187, 170, 170, 0.205)',
            backdropFilter: 'blur(15px)',
          }}
        >
          <h2 className="text-3xl font-bold mb-6 text-white">Verifique seu E-mail</h2>
          <p className="text-white mb-6">
            Cadastro realizado com sucesso! Um link de verificação foi enviado para o seu e-mail. Por favor, clique no link para ativar sua conta.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition duration-300"
          >
            Ir para o Login
          </button>
        </div>
      </div>
    );
  }

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
        onClick={() => navigate('/')}
        className="absolute top-4 left-4 bg-blue-500 text-white py-1 px-4 rounded shadow hover:bg-blue-700 transition duration-300 text-sm"
      >
        Voltar
      </button>

      <div
        className="p-10 rounded-lg shadow-lg w-full max-w-md"
        style={{
          backgroundColor: 'rgba(187, 170, 170, 0.205)',
          backdropFilter: 'blur(15px)',
        }}
      >
        <h2 className="text-3xl font-bold text-center mb-6 text-white">Registrar</h2>

        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="mb-4">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nome de usuário"
              className="w-full py-3 px-4 rounded-xl bg-white bg-opacity-10 text-white border-transparent focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-300 hover:border hover:border-white/30"
              required
            />
          </div>

          <div className="mb-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full py-3 px-4 rounded-xl bg-white bg-opacity-10 text-white border-transparent focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-300 hover:border hover:border-white/30"
              autoComplete="off"
              required
            />
          </div>

          <div className="relative mb-4">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Senha"
              className="w-full py-3 px-4 rounded-xl bg-white bg-opacity-10 text-white border-transparent focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-300 hover:border hover:border-white/30"
              autoComplete="new-password"
              required
            />
            <div
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
              onClick={() => setShowPassword(!showPassword)}
            >
              <span className="text-white cursor-pointer">{showPassword ? <FaEyeSlash /> : <FaEye />}</span>
            </div>
            
          </div>
          {password && <PasswordStrengthMeter password_value={password} />}

          <div className="relative mb-4">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirmar Senha"
              className={`w-full py-3 px-4 rounded-xl bg-white bg-opacity-10 text-white border-transparent focus:outline-none focus:ring-2 transition duration-300 hover:border hover:border-white/30 ${
                confirmPassword && (password !== confirmPassword ? 'focus:ring-red-500' : 'focus:ring-green-500')
              }`}
              autoComplete="new-password"
              required
            />
            <div
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <span className="text-white cursor-pointer">{showConfirmPassword ? <FaEyeSlash /> : <FaEye />}</span>
            </div>
            {confirmPassword && password !== confirmPassword && (
              <p className="text-red-500 text-xs mt-1">As senhas não coincidem.</p>
            )}
          </div>

          <div className="mb-4 text-white text-sm">
            <p className={passwordRequirements.length ? 'text-green-400' : ''}>✓ Pelo menos 8 caracteres</p>
            <p className={passwordRequirements.uppercase ? 'text-green-400' : ''}>✓ Uma letra maiúscula</p>
            <p className={passwordRequirements.lowercase ? 'text-green-400' : ''}>✓ Uma letra minúscula</p>
            <p className={passwordRequirements.number ? 'text-green-400' : ''}>✓ Um número</p>
            <p className={passwordRequirements.specialChar ? 'text-green-400' : ''}>✓ Um caractere especial</p>
          </div>

          {error && <p className="mb-4 text-center text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={!allRequirementsMet || password !== confirmPassword}
            className="w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed"
          >
            Registrar
          </button>

          <div className="mt-4 text-center">
            <p className="text-white">
              Já tem uma conta?{' '}
              <a href="/login" className="text-blue-300 underline">
                Faça login
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;

