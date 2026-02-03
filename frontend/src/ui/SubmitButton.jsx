import styled from 'styled-components';

const StyledSubmitButton = styled.button`
    background-color: #008000;
    padding: 0.5rem 1.5rem 0.5rem 1.5rem;
    border-radius: 8px;
    color: white;
    border: 2px solid grey;
    margin: 1rem;
    transition: all 0.05s;

    &:hover {
        background-color: #01ce01;
    }
`;

export default function SubmitButton({ text }) {
    return <StyledSubmitButton type="submit">{text}</StyledSubmitButton>;
}
