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
    color: purple;
`;

const StyledImg = styled.img`
    max-width: 50%;
    border: 1px black;
    padding: 2rem;
    pointer-events: none;
`;

const StyledButton = styled.button`
    background-color: #0093cd;
    /* background-color: #2d2dfa; */
    width: 8rem;
    padding: 0.5rem;
    border-radius: 1rem;
    border: 0.5px solid grey;
    color: white;

    &:hover {
        background-color: #004b69;
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
                    <StyledH1>E-Commerce</StyledH1>
                    <StyledH2>Landing Page</StyledH2>
                    <p>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Repudiandae, tempora doloremque. Et non ea iure nemo
                        possimus, unde blanditiis corrupti! Earum quisquam dolor
                        est eum natus adipisci inventore! Amet, quo.
                    </p>
                    <StyledButton onClick={() => navigate('/login')}>
                        Get Started
                    </StyledButton>
                </LandingPageDiv>
                <StyledImg src="landing_page_image.png" />
            </StyledHomepage>
            <Footer />
        </StyledGrid>
    );
}

export default Homepage;
