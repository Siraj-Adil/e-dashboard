import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserLoginStatus } from '../context/UserLoginStatusContext';
import FullPageSpinner from './FullPageSpinner';

export default function ProtectedLayout({ children }) {
    // const auth = localStorage.getItem('user');   // Old code when user object and accessToken was in localSTorage
    const { loadingUser, user, accessToken } = useUserLoginStatus();
    const auth = Boolean(user && accessToken);
    const navigate = useNavigate();

    useEffect(
        function () {
            if (!loadingUser && !auth) navigate('/login');
        },
        [loadingUser, auth, navigate]
    );

    if (loadingUser) return <FullPageSpinner />;

    return auth ? children : null;
}
