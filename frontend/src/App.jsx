import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ProtectedLayout from './ui/ProtectedLayout';
import Homepage from './pages/Homepage';
import AddProduct from './pages/AddProduct';
import Update from './pages/Update';
import Profile from './pages/Profile';
import AppLayout from './ui/AppLayout';
import Login from './pages/Login';
import PageNotFound from './pages/PageNotFound';
import GlobalStyles from './styles/GlobalStyles';
import Signup from './pages/Signup';
import Products from './pages/Products';
import UnProtectedLayout from './ui/UnProtectedRoute';
import { Toaster } from 'react-hot-toast';
import { UserLoginStatusProvider } from './context/UserLoginStatusContext';

function App() {
    return (
        <UserLoginStatusProvider>
            <GlobalStyles />
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Homepage />} />
                    <Route
                        element={
                            <ProtectedLayout>
                                <AppLayout />
                            </ProtectedLayout>
                        }
                    >
                        <Route path="/products" element={<Products />} />
                        <Route path="/products/add" element={<AddProduct />} />
                        <Route
                            path="/products/update/:id"
                            element={<Update />}
                        />
                        <Route path="/products/update" element={<Update />} />
                        <Route path="/profile" element={<Profile />} />
                    </Route>
                    <Route
                        path="login"
                        element={
                            <UnProtectedLayout>
                                <Login />
                            </UnProtectedLayout>
                        }
                    />
                    <Route
                        path="signup"
                        element={
                            <UnProtectedLayout>
                                <Signup />
                            </UnProtectedLayout>
                        }
                    />
                    <Route path="*" element={<PageNotFound />} />
                </Routes>
            </BrowserRouter>
            <Toaster
                position="top-center"
                gutter={12}
                containerStyle={{ margin: '8px' }}
                toastOptions={{
                    success: {
                        duration: 3000,
                    },
                    error: {
                        duration: 5000,
                    },
                    style: {
                        fontSize: '16px',
                        maxWidth: '500px',
                        padding: '16px 24px',
                        backgroundColor: 'white',
                        color: 'var(--color-grey-700)',
                    },
                }}
            />
        </UserLoginStatusProvider>
    );
}

export default App;
