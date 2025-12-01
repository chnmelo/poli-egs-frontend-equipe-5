import { Outlet, Navigate } from 'react-router-dom';

function ProtectedRoute() {
    // Verifica se existe um token salvo no armazenamento local
    const token = localStorage.getItem('authToken');

    // Se tiver token, renderiza a rota, senão manda para o login
    return token ? <Outlet/> : <Navigate to="/login"/>;
}

export default ProtectedRoute;