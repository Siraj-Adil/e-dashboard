import { Link } from 'react-router-dom';
import styled from 'styled-components';

const StyledLink = styled(Link)`
    padding: 1rem;
    color: #6a6969;
    text-decoration: underline;
    font-size: 0.8rem;
`;

export default function Question({ url, children }) {
    return <StyledLink to={url}>{children}</StyledLink>;
}
