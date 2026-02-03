import styled from 'styled-components';

const StyledForm = styled.form`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-top: 1rem;
    background-color: aliceblue;
`;

export default function Form({ onSubmit, children }) {
    return <StyledForm onSubmit={onSubmit}>{children}</StyledForm>;
}
