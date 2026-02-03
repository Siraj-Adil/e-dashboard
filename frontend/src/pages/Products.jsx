import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useUserLoginStatus } from '../context/UserLoginStatusContext';

const StyledDiv = styled.div`
    min-height: 100%;
    width: 50%;
    margin: auto;
    background-color: white;
    padding: 2rem;
    display: flex;
    flex-direction: column;
`;

const StyledHeader = styled.div`
    background-color: #a5dea5;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
    justify-content: space-between;
    border-radius: 8px;
    height: 3rem;
    margin: 1rem 0rem 1rem 0rem;
    overflow: hidden;

    & > :not(:last-child) {
        border-right: 1px solid #b8b8b8;
    }

    & > :hover {
        background-color: #00d400;
    }
`;

const StyledOuter = styled.div`
    border-radius: 8px;
    overflow: hidden;

    & > :not(:last-child) {
        border-bottom: 1px solid #b8b8b8;
    }
`;

const StyledSearch = styled.input`
    box-sizing: border-box;
    background-color: aliceblue;
    padding: 0.5rem;
    width: 30%;
    align-self: center;
    border: 1px solid grey;
    border-radius: 0.8rem;
    transition: all 0.3s;
    outline: none;

    &:focus {
        width: 100%;
        margin: 0.7rem 0rem 0.7rem 0rem;
    }
`;

const StyledUL = styled.ul`
    background-color: #ffc3fc;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
    justify-content: space-between;
    height: 3rem;
    overflow: hidden;

    & > :not(:last-child) {
        border-right: 1px solid #b8b8b8;
    }

    & > :hover {
        background-color: #ff88f9;
    }
`;

const Content = styled.div`
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    height: 100%;
    width: 100%;
`;

const StyledLoadingProduct = styled.div`
    border-radius: 8px;
    background-color: #b9baff;
    padding: 1rem;
    text-align: center;
`;

const StyledNoProductFound = styled.div`
    border-radius: 8px;
    background-color: #ffc4c4;
    padding: 1rem;
    text-align: center;
`;

const StyledLink = styled(Link)`
    text-decoration: underline;
`;

const DeleteButton = styled.button`
    background-color: #ff8a8a;
    padding: 0.4rem;
    border: 1px solid white;
    border-radius: 5px;

    &:hover {
        background-color: #ff3636;
        cursor: pointer;
    }
`;

const UpdateButton = styled.button`
    background-color: #e4ff94;
    padding: 0.4rem;
    border: 1px solid white;
    border-radius: 5px;

    &:hover {
        background-color: #effc00;
        cursor: pointer;
    }
`;

function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [dots, setDots] = useState(0);
    const navigate = useNavigate();
    const searchRef = useRef();
    const { accessToken } = useUserLoginStatus();

    // Loading animation
    useEffect(function () {
        function updateDots() {
            setDots((prev) => (prev === 3 ? 0 : prev + 1));
        }
        const interval = setInterval(updateDots, 500);

        return function cleanup() {
            clearTimeout(interval);
        };
    }, []);

    // Fetching products
    useEffect(function () {
        fetchFunction();
    }, []);

    // Actual fetch function to call
    async function fetchFunction() {
        setLoading(true);
        try {
            let results = await fetch(
                import.meta.env.VITE_BACKEND_URI + '/get-products',
                {
                    method: 'get',
                    headers: {
                        'Content-type': 'application/json',
                        Authorization: `bearer ${accessToken}`,
                    },
                }
            );
            results = await results.json();
            if (results && !results['error']) {
                results = results['products'].map((item, idx) => ({
                    ...item,
                    s_no: idx + 1,
                }));
                setProducts(results);
            } else {
                toast.error(results['error']);
            }
        } catch (err) {
            console.log(err);
            toast.error('Failure to get products');
        } finally {
            setLoading(false);
        }
    }

    // Delete Products
    async function handleDelete(product_id) {
        const confirmLogout = window.confirm(
            'Are you sure you want to delete this product?'
        );

        if (!confirmLogout) return;

        try {
            let result = await fetch(
                `${import.meta.env.VITE_BACKEND_URI}/product/${product_id}`,
                {
                    method: 'delete',
                    headers: {
                        Authorization: `bearer ${accessToken}`,
                    },
                }
            );
            result = await result.json();
            if (result.success && !result.error) {
                toast.success('Product deleted successfully');
                fetchFunction();
            } else {
                toast.error(result['error']);
            }
        } catch (err) {
            console.log(err);
            toast.error('Failure to delete product');
        }
    }

    // Search Products
    async function searchProducts(key) {
        if (key) {
            // Abort previous request if it exists
            if (searchRef.current) {
                searchRef.current.abort();
            }

            // Create a new controller
            searchRef.current = new AbortController();

            setLoading(true);
            try {
                let results = await fetch(
                    `${import.meta.env.VITE_BACKEND_URI}/search/${key}`,
                    {
                        method: 'get',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `bearer ${accessToken}`,
                        },
                        signal: searchRef.current.signal,
                    }
                );
                results = await results.json();
                if (!results.error) {
                    results = results['products'].map((item, idx) => ({
                        ...item,
                        s_no: idx + 1,
                    }));
                    setProducts(results);
                } else {
                    toast.error(results.error);
                }
            } catch (err) {
                if (err.name !== 'AbortError') {
                    console.log(err);
                    toast.error('Failure to search products');
                }
            } finally {
                setLoading(false);
            }
        } else {
            fetchFunction();
        }
    }

    return (
        <StyledDiv>
            <h2 style={{ marginLeft: '1rem' }}>Products</h2>
            <StyledSearch
                type="text"
                placeholder="Search Product..."
                onChange={(evt) => searchProducts(evt.target.value)}
            />
            <StyledHeader>
                <Content>S. No</Content>
                <Content>Name</Content>
                <Content>Price</Content>
                <Content>Brand</Content>
                <Content>Category</Content>
                <Content>Operations</Content>
            </StyledHeader>
            {loading ? (
                <StyledLoadingProduct>
                    Loading Products{'.'.repeat(dots)}
                </StyledLoadingProduct>
            ) : products?.length > 0 ? (
                <StyledOuter>
                    {products.map((product) => (
                        <StyledUL key={product._id}>
                            <Content>{product.s_no}</Content>
                            <Content>{product.name}</Content>
                            <Content>
                                {product.price} {'$'}
                            </Content>
                            <Content>{product.brand}</Content>
                            <Content>{product.category}</Content>
                            <Content>
                                <DeleteButton
                                    onClick={() => handleDelete(product._id)}
                                >
                                    Delete
                                </DeleteButton>
                                <UpdateButton
                                    onClick={() =>
                                        navigate(
                                            `/products/update/${product._id}`
                                        )
                                    }
                                >
                                    Update
                                </UpdateButton>
                            </Content>
                        </StyledUL>
                    ))}
                </StyledOuter>
            ) : (
                <StyledNoProductFound>
                    <StyledLink to="/products/add">
                        No Product Found, Click here to add new Product
                    </StyledLink>
                </StyledNoProductFound>
            )}
        </StyledDiv>
    );
}

export default Products;
