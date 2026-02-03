import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const StyledCancelButton = styled.button`
    background-color: #a90000;
    padding: 0.5rem 1.5rem 0.5rem 1.5rem;
    border-radius: 8px;
    color: white;
    border: 2px solid grey;
    margin: 1rem;
    transition: all 0.05s;

    &:hover {
        background-color: #ff1414;
    }
`;

export default function CancelButton({
    text,
    initialFormState,
    eleValSetter,
    navigateBack,
    initialTouchedState,
    setTouchedStates,
}) {
    const navigate = useNavigate();

    function handleCancel() {
        if (!initialFormState || !eleValSetter) return;
        eleValSetter(initialFormState);
        if (initialTouchedState && setTouchedStates) {
            setTouchedStates(initialTouchedState);
        }

        if (navigateBack) {
            navigate('/');
        }
    }
    return (
        <StyledCancelButton onClick={handleCancel} type="reset">
            {text}
        </StyledCancelButton>
    );
}
