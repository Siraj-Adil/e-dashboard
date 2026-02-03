import styled from 'styled-components';

const StyledInputDiv = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    color: black;
    padding: 1rem;
    border-radius: 10px;

    &:has(input:focus) {
        background-color: #d6eaff;
    }
`;

const StyledInput = styled.input`
    border: 1px solid grey;
    padding: 0.5rem;
    border-radius: 0.5rem;
`;

const StyledError = styled.p`
    color: red;
`;

export default function FormInput({
    nameKey,
    typeProp,
    label,
    placeholder,
    disbaleFlag,
    requiredFlag,
    eleVal,
    eleValSetter,
    setTouchedStates,
    formErrorStates,
}) {
    return (
        <StyledInputDiv>
            <label htmlFor={nameKey}>{label}</label>
            <StyledInput
                name={nameKey}
                type={typeProp}
                required={requiredFlag}
                disabled={disbaleFlag}
                placeholder={placeholder}
                value={eleVal[nameKey]}
                onChange={(evt) => {
                    eleValSetter({
                        ...eleVal,
                        [nameKey]: evt.target.value,
                    });
                    if (setTouchedStates) {
                        setTouchedStates((prevTouchedStates) => ({
                            ...prevTouchedStates,
                            [nameKey]: true,
                        }));
                    }
                }}
            />
            {formErrorStates && formErrorStates[nameKey] && (
                <StyledError>{formErrorStates[nameKey]}</StyledError>
            )}
        </StyledInputDiv>
    );
}
