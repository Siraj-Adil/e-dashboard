import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import Navbar from './Navbar';
import Footer from './Footer';

const StyledGrid = styled.div`
    display: grid;
    grid-template-rows: minmax(10vh, auto) minmax(80vh, 1fr) minmax(10vh, auto);
    min-height: 100vh;
`;

function AppLayout() {
    return (
        <StyledGrid>
            <Navbar />
            <Outlet />
            <Footer />
        </StyledGrid>
    );
}

export default AppLayout;
