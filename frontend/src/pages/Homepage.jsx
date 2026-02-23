import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Navbar from '../ui/Navbar';
import Footer from '../ui/Footer';

const StyledGrid = styled.div`
    display: grid;
    grid-template-rows: 1fr 8fr 1fr;
    height: 100vh;
`;

const StyledHomepage = styled.div`
    width: 90%;
    display: flex;
    flex-direction: row;
    margin: auto;
    gap: 2rem;
    padding: 4rem;
    justify-content: center;
`;

const LandingPageDiv = styled.div`
    display: flex;
    flex-direction: column;
    max-width: 30%;
    padding: 2rem;
    gap: 1rem;
`;

const StyledH1 = styled.h1`
    color: #002487;
    text-transform: uppercase;
    font-size: 2.5rem;
    font-stretch: expanded;
    font-weight: 900;
`;

const StyledH2 = styled.h2`
    color: #15803d; /* Deep modern green */
    font-size: 1.4rem;
    font-weight: 800;
    margin-bottom: 1.5rem;
`;

const StyledImg = styled.img`
    max-width: 30%;
    border: 1px black;
    padding: 2rem;
    pointer-events: none;
`;

const StyledButton = styled.button`
    background-color: #002487;
    width: 12rem;
    padding: 0.65rem 1.1rem;
    border-radius: 10px;
    border: none;

    color: #ffffff;
    font-size: 0.95rem;
    font-weight: 600;
    letter-spacing: 0.02em;

    box-shadow: 0 10px 24px rgba(0, 36, 135, 0.35);
    transition: all 0.25s ease;

    &:hover {
        background-color: #001b66;
        transform: translateY(-2px);
        box-shadow: 0 14px 32px rgba(0, 36, 135, 0.45);
        cursor: pointer;
    }
`;

const StyledButton2 = styled.button`
    background-color: transparent;
    width: 12rem;
    padding: 0.65rem 1.1rem;
    border-radius: 10px;

    border: 1.5px solid #002487;
    color: #002487;

    font-size: 0.95rem;
    font-weight: 600;
    letter-spacing: 0.02em;

    transition: all 0.25s ease;

    &:hover {
        background-color: #eef2ff;
        transform: translateY(-1px);
        cursor: pointer;
    }
`;

function Homepage() {
    const navigate = useNavigate();
    return (
        <StyledGrid>
            <Navbar />

            <StyledHomepage>
                <LandingPageDiv>
                    <StyledH1>SafeMart</StyledH1>
                    <StyledH2>
                        A Secure MERN Stack E-Commerce Learning Project
                    </StyledH2>
                    <p>
                        SafeMart is a personal full-stack project built to
                        understand backend development concepts such as
                        authentication, authorization, and database operations
                        using the MERN stack.
                    </p>
                    <p>
                        ✅ JWT-based authentication using access & refresh
                        tokens
                    </p>
                    <p>✅ Secure CRUD operations with MongoDB and Express</p>
                    <p>
                        ✅ Password hashing with bcrypt and protected API routes
                    </p>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            gap: '1rem',
                        }}
                    >
                        <StyledButton onClick={() => navigate('/login')}>
                            Explore Project
                        </StyledButton>
                        <StyledButton2
                            onClick={() =>
                                window.open(
                                    'https://github.com/Siraj-Adil/e-dashboard',
                                    '_blank'
                                )
                            }
                        >
                            View Source Code
                        </StyledButton2>
                    </div>
                </LandingPageDiv>
                <StyledImg
                    src="landing_page_image.png"
                    alt="SafeMart Preview"
                />
            </StyledHomepage>
            <Footer />
        </StyledGrid>
    );
}

export default Homepage;
