import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const FullPageWrapper = styled.div`
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: sans-serif;
`;

const Spinner = styled.div`
    border: 8px solid #f3f3f3;
    border-top: 8px solid #3498db;
    border-radius: 50%;
    width: 60px;
    height: 60px;
    animation: ${spin} 1s linear infinite;
`;

export default function FullPageSpinner() {
    return (
        <FullPageWrapper>
            <Spinner />
        </FullPageWrapper>
    );
}
