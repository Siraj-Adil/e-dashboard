import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import styled from 'styled-components';
import Footer from '../ui/Footer';
import Navbar from '../ui/Navbar';
import StyledForm from '../ui/Form';
import FormInput from '../ui/FormInput';
import SubmitButton from '../ui/SubmitButton';
import CancelButton from '../ui/CancelButton';
import Question from '../ui/Login_Signup_Question';
import { useUserLoginStatus } from '../context/UserLoginStatusContext';

const StyledGrid = styled.div`
    display: grid;
    grid-template-rows: 1fr 8fr 1fr;
    height: 100vh;
`;

const StyledModelOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    backdrop-filter: blur(2px);
    background-color: rgba(0, 0, 0, 0.3);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
`;

const StyledModelContent = styled.div`
    background: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    max-width: 30vw;
    width: 90%;
`;

function Login() {
    const initialFormState = {
        email: '',
        password: '',
    };
    const initialTouchedState = {
        email: false,
        password: false,
    };
    const [loading, setLoading] = useState(false);
    const [formStates, setFormStates] = useState(initialFormState);
    const [errorStates, setErrorStates] = useState(initialFormState);
    const [touchedStates, setTouchedStates] = useState(initialTouchedState);
    const navigate = useNavigate();
    const { login } = useUserLoginStatus();

    // Form Validation on every input field change
    useEffect(
        function () {
            handleValidation(false);
        },
        [formStates]
    );

    // Form Validation Function
    function handleValidation(isOutsideUseEffect = true) {
        let anyError = false;

        // Validating Email
        const shouldValidateEmail = isOutsideUseEffect || touchedStates.email; // always true if outside useEffect hook
        if (shouldValidateEmail && !formStates['email']) {
            setErrorStates((prevErrorStates) => ({
                ...prevErrorStates,
                email: 'Email cannot be empty.',
            }));
            anyError = true;
        } else {
            setErrorStates((prevErrorStates) => ({
                ...prevErrorStates,
                email: '',
            }));
        }

        // Validating Password
        const shouldValidatePassword =
            isOutsideUseEffect || touchedStates.password; // always true if outside useEffect hook
        if (shouldValidatePassword && !formStates['password']) {
            setErrorStates((prevErrorStates) => ({
                ...prevErrorStates,
                password: 'Password cannot be empty.',
            }));
            anyError = true;
        } else if (
            shouldValidatePassword &&
            formStates['password'].length < 8
        ) {
            setErrorStates((prevErrorStates) => ({
                ...prevErrorStates,
                password: 'Password msut be atleast 8 characters long.',
            }));
            anyError = true;
        } else {
            setErrorStates((prevErrorStates) => ({
                ...prevErrorStates,
                password: '',
            }));
        }
        return anyError;
    }

    async function handleSubmit(evt) {
        evt.preventDefault();

        // VALIDATIONS IN CASE HTML VALIDATIONS ARE BYPASSED
        if (handleValidation(true)) return;

        setLoading(true);
        try {
            let result = await fetch(
                import.meta.env.VITE_BACKEND_URI + '/getUser',
                {
                    method: 'post',
                    headers: {
                        'Content-type': 'application/json',
                    },
                    body: JSON.stringify(formStates),
                    credentials: 'include', // sends httpOnly cookie (and ALLOW saving cookie in browser) if it is not there cookie send by backend will NOT be saved in browser
                }
            );
            result = await result.json();

            if (
                result &&
                result.success &&
                result.user &&
                result.user.user_id &&
                result.auth
            ) {
                login(result.user, result.auth); // NEW Code
                // localStorage.setItem('user', JSON.stringify(result.user));   // OLD Code
                // localStorage.setItem('token', JSON.stringify(result.auth));  // OLD Code
                toast.success('User logged in successfully!');
                navigate('/products');
            } else {
                toast.error(result['error']);
            }
        } catch (err) {
            console.log(err);
            toast.error('Failure to log in user, try again');
        } finally {
            setLoading(false);
        }
    }

    return createPortal(
        <StyledGrid>
            <Navbar />
            <StyledModelOverlay>
                <StyledModelContent>
                    <h2 style={{ marginLeft: '1rem' }}>Login Form</h2>
                    <StyledForm onSubmit={handleSubmit}>
                        <FormInput
                            nameKey="email"
                            typeProp="email"
                            label="Enter Email"
                            placeholder="johndoe@email.com"
                            requiredFlag={false}
                            disbaleFlag={loading}
                            eleVal={formStates}
                            eleValSetter={setFormStates}
                            setTouchedStates={setTouchedStates}
                            formErrorStates={errorStates}
                        />
                        <FormInput
                            nameKey="password"
                            typeProp="password"
                            label="Enter Password"
                            placeholder="password"
                            requiredFlag={false}
                            disbaleFlag={loading}
                            eleVal={formStates}
                            eleValSetter={setFormStates}
                            setTouchedStates={setTouchedStates}
                            formErrorStates={errorStates}
                        />
                        <div style={{ alignSelf: 'flex-end' }}>
                            <SubmitButton
                                text={!loading ? 'LogIn' : 'Logging In...'}
                            />
                            <CancelButton
                                text="Cancel"
                                initialFormState={initialFormState}
                                eleValSetter={setFormStates}
                                navigateBack="/"
                                initialTouchedState={initialTouchedState}
                                setTouchedStates={setTouchedStates}
                            />
                        </div>
                        <Question url="/signup">
                            New user? Click here to Signup
                        </Question>
                    </StyledForm>
                </StyledModelContent>
            </StyledModelOverlay>
            <Footer />
        </StyledGrid>,
        document.querySelector('#root')
    );
}

export default Login;
