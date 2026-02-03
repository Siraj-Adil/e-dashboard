import styled from "styled-components";

const StyledButton = styled.div`
    height: 2rem;
    width: 5rem;
    color: white;
    display: flex;
    padding: 0.2rem;
    align-items: center;
    justify-content: center;

    &:hover {
        color: yellow;
    }
`;

function NavbarLink({ children }) {
    return <StyledButton>{children}</StyledButton>;
}

export default NavbarLink;
