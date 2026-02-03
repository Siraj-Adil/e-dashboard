import { useEffect, useState } from 'react';
import styled from 'styled-components';
import StyledForm from '../ui/Form';
import FormInput from '../ui/FormInput';
import SubmitButton from '../ui/SubmitButton';
import CancelButton from '../ui/CancelButton';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useUserLoginStatus } from '../context/UserLoginStatusContext';

const StyledDiv = styled.div`
    height: 100%;
    width: 50%;
    margin: auto;
    background-color: white;
    padding: 2rem;
`;

function AddProduct() {
    const initialFormState = {
        name: '',
        price: '',
        brand: '',
        category: '',
    };
    const initialTouchedState = {
        name: false,
        price: false,
        brand: false,
        category: false,
    };
    const [loading, setLoading] = useState(false);
    const [formStates, setFormStates] = useState(initialFormState);
    const [errorStates, setErrorStates] = useState(initialFormState);
    const [touchedStates, setTouchedStates] = useState(initialTouchedState);
    const navigate = useNavigate();
    const { accessToken } = useUserLoginStatus();

    // Form Validation on every input field change
    useEffect(
        function () {
            handleValidation(false);
        },
        [formStates]
    );

    // Form Validation Function
    function handleValidation(isOutsideUseEffect = true) {
        let anyError = false;

        // Validating Price
        const shouldValidatePrice = isOutsideUseEffect || touchedStates.price; // always true if outside useEffect hook
        if (shouldValidatePrice && !formStates['price']) {
            setErrorStates((prevErrorStates) => ({
                ...prevErrorStates,
                price: 'Price cannot be empty.',
            }));
            anyError = true;
        } else if (
            shouldValidatePrice &&
            (formStates['price'] < 1 || formStates['price'] > 1000000)
        ) {
            setErrorStates((prevErrorStates) => ({
                ...prevErrorStates,
                price: 'Price should be betweeb 1$ - 1000000$.',
            }));
            anyError = true;
        } else {
            setErrorStates((prevErrorStates) => ({
                ...prevErrorStates,
                price: '',
            }));
        }

        // Validating Name
        const shouldValidateName = isOutsideUseEffect || touchedStates.name; // always true if outside useEffect hook
        if (shouldValidateName && !formStates['name']) {
            setErrorStates((prevErrorStates) => ({
                ...prevErrorStates,
                name: 'Name cannot be empty.',
            }));
            anyError = true;
        } else {
            setErrorStates((prevErrorStates) => ({
                ...prevErrorStates,
                name: '',
            }));
        }

        // Validating Brand
        const shouldValidateBrand = isOutsideUseEffect || touchedStates.brand; // always true if outside useEffect hook
        if (shouldValidateBrand && !formStates['brand']) {
            setErrorStates((prevErrorStates) => ({
                ...prevErrorStates,
                brand: 'Brand cannot be empty.',
            }));
            anyError = true;
        } else {
            setErrorStates((prevErrorStates) => ({
                ...prevErrorStates,
                brand: '',
            }));
        }

        // Validating Category
        const shouldValidateCategory =
            isOutsideUseEffect || touchedStates.category; // always true if outside useEffect hook
        if (shouldValidateCategory && !formStates['category']) {
            setErrorStates((prevErrorStates) => ({
                ...prevErrorStates,
                category: 'Category cannot be empty.',
            }));
            anyError = true;
        } else {
            setErrorStates((prevErrorStates) => ({
                ...prevErrorStates,
                category: '',
            }));
        }
        return anyError;
    }

    // Add Product
    async function handleSubmit(evt) {
        evt.preventDefault();

        // VALIDATIONS IN CASE HTML VALIDATIONS ARE BYPASSED
        if (handleValidation(true)) return;

        setLoading(true);
        try {
            let result = await fetch(
                import.meta.env.VITE_BACKEND_URI + '/add-product',
                {
                    method: 'post',
                    body: JSON.stringify({ ...formStates }),
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `bearer ${accessToken}`,
                    },
                }
            );
            result = await result.json();
            if (
                result &&
                result.product &&
                result.product._id &&
                !result.error
            ) {
                toast.success('Product addedd successfully');
                navigate('/products');
            } else {
                toast.error(result.error);
            }
        } catch (err) {
            console.log(err);
            toast.error('Failure to add product');
        } finally {
            setLoading(false);
        }
    }

    return (
        <StyledDiv>
            <h2 style={{ marginLeft: '1rem' }}>Add Product</h2>
            <StyledForm onSubmit={(evt) => handleSubmit(evt)}>
                <FormInput
                    nameKey="name"
                    typeProp="text"
                    label="Enter Product Name"
                    placeholder="Name"
                    requiredFlag={false}
                    disbaleFlag={false}
                    eleVal={formStates}
                    eleValSetter={setFormStates}
                    setTouchedStates={setTouchedStates}
                    formErrorStates={errorStates}
                />
                <FormInput
                    nameKey="price"
                    typeProp="number"
                    label="Enter Product Price"
                    placeholder="Price"
                    requiredFlag={false}
                    disbaleFlag={false}
                    eleVal={formStates}
                    eleValSetter={setFormStates}
                    setTouchedStates={setTouchedStates}
                    formErrorStates={errorStates}
                />
                <FormInput
                    nameKey="brand"
                    typeProp="text"
                    label="Enter Product Brand"
                    placeholder="Brand"
                    requiredFlag={false}
                    disbaleFlag={false}
                    eleVal={formStates}
                    eleValSetter={setFormStates}
                    setTouchedStates={setTouchedStates}
                    formErrorStates={errorStates}
                />
                <FormInput
                    nameKey="category"
                    typeProp="text"
                    label="Enter Product Category"
                    placeholder="Category"
                    requiredFlag={false}
                    disbaleFlag={false}
                    eleVal={formStates}
                    eleValSetter={setFormStates}
                    setTouchedStates={setTouchedStates}
                    formErrorStates={errorStates}
                />
                <div style={{ alignSelf: 'flex-end' }}>
                    <SubmitButton
                        text={!loading ? 'Add Product' : 'Adding...'}
                    />
                    <CancelButton
                        text="Reset"
                        initialFormState={initialFormState}
                        eleValSetter={setFormStates}
                        initialTouchedState={initialTouchedState}
                        setTouchedStates={setTouchedStates}
                    />
                </div>
            </StyledForm>
        </StyledDiv>
    );
}

export default AddProduct;
