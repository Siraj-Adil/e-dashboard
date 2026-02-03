import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
    // "root" is the topmost <html> tag, all of these variable are defined at root <html> tag
    :root {
        background-color: aliceblue;
    }

    *{
        transition: all 0.3s;
    }
    
    body {
        margin: 0;
        padding: 0;
        font-family: "Poppins", sans-serif;
        /* color: var(--color-grey-700); */

        transition: color 0.3s, background-color 0.3s;
        min-height: 100vh;
        line-height: 1.5;
    }

    a {
        text-decoration: none;
    }

    .active{
        background-color: #2d2dfa;
        border: 1px solid black;
        border-radius: 2rem;
        padding:0.5rem;
        font-weight: bold;
        stroke-width: 2;
    }
`;

export default GlobalStyles;
