import { createContext, useContext, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

const UserLoginStatusContext = createContext();

function UserLoginStatusProvider({ children }) {
    const [accessToken, setAccessToken] = useState(null);
    const [user, setUser] = useState(null);
    const [loadingUser, setLoadingUser] = useState(true);
    const intervalIdRef = useRef;

    async function getAccessToken() {
        try {
            let result = await fetch(
                import.meta.env.VITE_BACKEND_URI + '/refresh-token',
                {
                    method: 'post',
                    credentials: 'include', // sends httpOnly cookie (and ALLOW saving cookie in browser) if it is not there cookie send by backend will NOT be saved in browser
                }
            );
            result = await result.json();
            if (result && result.user && result.accessToken && !result.error) {
                login(result.user, result.accessToken);
            } else {
                if (result.error) {
                    logout();
                    // Only show toast for unexpected backend errors
                    if (result.error !== 'Missing refresh token') {
                        toast.error(result.error);
                    }
                }
            }
        } catch (err) {
            console.log(err);
            toast.error('Failure to retrieve access Token');
        } finally {
            setLoadingUser(false);
        }
    }

    useEffect(function () {
        getAccessToken();
    }, []);

    function login(userObj, token) {
        setUser(userObj);
        setAccessToken(token);
        // Auto refresh the token every (2/3rd or 3/4th of Access Token lifetime)
        if (!intervalIdRef.current) {
            intervalIdRef.current = setInterval(
                getAccessToken,
                process.env.NODE_ENV === 'production'
                    ? (600 * 1000 * 2) / 3
                    : (15 * 1000 * 2) / 3
            );
        }
    }

    async function logout() {
        try {
            let result = await fetch(
                import.meta.env.VITE_BACKEND_URI + '/logout',
                {
                    method: 'post',
                    credentials: 'include',
                }
            );
            result = await result.json();
            if (result && result.success) {
                toast.success('User logged out successfully!');
                setUser(null);
                setAccessToken(null);
                if (intervalIdRef.current) {
                    clearInterval(intervalIdRef.current);
                    intervalIdRef.current = null;
                }
            } else if (result.error !== 'Missing refresh token') {
                toast.error(result['error']);
            }
        } catch (err) {
            console.log(err);
            toast.error('Failure to log out user, try again');
        }
    }

    return (
        <UserLoginStatusContext.Provider
            value={{ loadingUser, user, accessToken, login, logout }}
        >
            {children}
        </UserLoginStatusContext.Provider>
    );
}

function useUserLoginStatus() {
    const context = useContext(UserLoginStatusContext);
    if (context === undefined)
        throw new Error(
            'User Login Status context was used outside of UserLoginStatusProvider'
        );
    return context;
}

export { UserLoginStatusProvider, useUserLoginStatus };
