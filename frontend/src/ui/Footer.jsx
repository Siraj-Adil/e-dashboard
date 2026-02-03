import styled from "styled-components";

const StyledFooter = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: skyblue;
    color: white;
    font-size: 1rem;
`;

function Footer() {
    return <StyledFooter>E-commerce dashboard</StyledFooter>;
}

export default Footer;
