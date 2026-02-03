import styled from "styled-components";
import Footer from "../ui/Footer";
import Navbar from "../ui/Navbar";

const StyledGrid = styled.div`
    display: grid;
    grid-template-rows: 1fr 8fr 1fr;
    height: 100vh;
`;

const StyledForm = styled.form`
    display: flex;
    flex-direction: column;
    max-width: 80%;
    gap: 1rem;
    margin: auto;
    padding: 3rem;
    background-color: white;
`;

const StyledDiv = styled.div`
    display: flex;
    justify-content: space-between;
    gap: 10rem;
    padding: 0 1rem;
`;

const StyledH2 = styled.h2`
    color: purple;
    padding-left: 1rem;
`;

function Signup() {
    return (
        <StyledGrid>
            <Navbar />
            <StyledForm>
                <StyledH2>Signup Form</StyledH2>
                <StyledDiv>
                    <label htmlFor="name">Name</label>
                    <input name="name" type="text" />
                </StyledDiv>
                <StyledDiv>
                    <label htmlFor="name">Email</label>
                    <input name="name" type="text" />
                </StyledDiv>
                <StyledDiv>
                    <label htmlFor="name">Password</label>
                    <input name="name" type="password" />
                </StyledDiv>

            </StyledForm>
            <Footer />
        </StyledGrid>
    );
}

export default Signup;
