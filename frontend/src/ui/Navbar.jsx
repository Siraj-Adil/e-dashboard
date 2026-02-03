import { Link, NavLink, useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { useUserLoginStatus } from '../context/UserLoginStatusContext';

const StyledNavbar = styled.div`
    display: flex;
    justify-content: space-between;
    background-color: skyblue;
    padding: 0.5rem 1rem;
`;

const StyledImg = styled.img`
    height: 4rem;
    width: auto;
`;

const StyledList = styled.ul`
    display: flex;
    align-items: center;
    gap: 1rem;
`;

const StyledNavLink = styled(NavLink)`
    display: flex;
    gap: 0.5rem;
    align-items: center;
    color: white;

    &:not(.active):hover {
        color: #2d2dfa;
    }

    & svg,
    span {
        transition: all 0.05s;
    }
`;

const StyledNavNoLink = styled.div`
    display: flex;
    gap: 0.5rem;
    align-items: center;
    color: white;

    &:hover {
        color: #2d2dfa;
    }

    & svg,
    span {
        transition: all 0.05s;
    }
`;

const shimmer = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: 200px 0; }
`;

const PlaceholderLink = styled.div`
    width: 100px;
    height: 30px;
    border-radius: 4px;
    background: linear-gradient(
        to right,
        rgba(255, 255, 255, 0.3) 0%,
        rgba(255, 255, 255, 0.6) 50%,
        rgba(255, 255, 255, 0.3) 100%
    );
    background-size: 200px 100%;
    animation: ${shimmer} 1.5s linear infinite;
`;

const links = [
    {
        name: 'Products',
        href: '/products',
        icon: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                width={25}
                height={25}
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                />
            </svg>
        ),
    },
    {
        name: 'Add Products',
        href: '/products/add',
        icon: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                width={25}
                height={25}
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
            </svg>
        ),
    },
    {
        name: 'LogIn',
        href: '/login',
        icon: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                width={25}
                height={25}
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z"
                />
            </svg>
        ),
    },
    {
        name: 'SignUp',
        href: '/signup',
        icon: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                width={25}
                height={25}
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z"
                />
            </svg>
        ),
    },
    {
        name: 'Profile',
        href: '/profile',
        icon: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                width={25}
                height={25}
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
            </svg>
        ),
    },
    {
        name: 'LogOut',
        icon: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                width={25}
                height={25}
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
                />
            </svg>
        ),
    },
];

function Navbar() {
    // const auth = localStorage.getItem('user');   // Old code when user object and accessToken was in localSTorage
    const { loadingUser, user, accessToken, logout } = useUserLoginStatus();
    const auth = Boolean(user && accessToken);
    const navigate = useNavigate();
    let linksToShow = links;

    if (!loadingUser && auth) {
        linksToShow = links.filter(
            (link) => !['LogIn', 'SignUp'].includes(link.name)
        );
    } else if (!loadingUser && !auth) {
        linksToShow = links.filter(
            (link) =>
                ![
                    'Products',
                    'Add Products',
                    'Update Products',
                    'Profile',
                    'LogOut',
                ].includes(link.name)
        );
    } else {
        linksToShow = [];
    }

    function handleLogOut() {
        const confirmLogout = window.confirm(
            'Are you sure you want to logout?'
        );

        if (confirmLogout) {
            // localStorage.removeItem('user');   // OLD Code
            // localStorage.removeItem('token');   // OLD Code
            logout();
            navigate('/');
        }
    }

    return (
        <StyledNavbar>
            <Link to="/">
                <StyledImg src="website_logo.png"></StyledImg>
            </Link>
            <StyledList>
                {loadingUser
                    ? Array(3)
                          .fill(0)
                          .map((ele, idx) => <PlaceholderLink key={idx} />)
                    : linksToShow.map((link) => {
                          if (link.name != 'LogOut') {
                              return (
                                  <StyledNavLink
                                      key={link.name}
                                      to={link.href}
                                      end={true}
                                  >
                                      {link.icon}
                                      <span>{link.name}</span>
                                  </StyledNavLink>
                              );
                          } else {
                              return (
                                  <StyledNavNoLink
                                      key={link.name}
                                      onClick={handleLogOut}
                                  >
                                      {link.icon}
                                      <span>
                                          {link.name} {`(${user.name})`}
                                      </span>
                                  </StyledNavNoLink>
                              );
                          }
                      })}
            </StyledList>
        </StyledNavbar>
    );
}

export default Navbar;
