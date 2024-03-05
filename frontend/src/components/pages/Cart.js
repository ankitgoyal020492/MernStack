import { Alert } from '@mui/material';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import CartItem from './CartItem';
import { addToCart, calculatePrice, removeCartItem } from '../../redux/features/product/cartSlice';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { FaRupeeSign } from 'react-icons/fa';

const Cart = ({isAuthenticated}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { productDefaultImage } = useSelector(state => state.products);
    const { cartItems, subtotal, tax, total, shippingCharges } = useSelector(state => state.cart);

    const decreaseCartItemQuantity = (item) => {
        if (item.quantity - 1 > 0) {
            dispatch(addToCart({ ...item, quantity: item.quantity - 1 }));
        }
    }
    const increaseCartItemQuantity = (item) => {
        let qty = item.quantity + 1;
        if (qty > item.stock) {
            toast.error("Quantity can't be greater than " + item.stock);
            return;
        }
        dispatch(addToCart({ ...item, quantity: qty }));
    }
    const removeCartItemHandler = (productId) => {
        dispatch(removeCartItem(productId));
    }
    useEffect(() => {
        dispatch(calculatePrice());
    }, [cartItems, dispatch]);

    const proceedsToCheckOut = () => {
        let url = "/login-signup?redirect=checkout";
        if(isAuthenticated){
            url = "/user/checkout";
        }
        navigate(url);
    }
    return (
        <div className="container-fluid pt-5">
            <div className="row px-xl-5">
                <div className="col-lg-8 table-responsive mb-5">
                    {cartItems.length > 0 ?
                        <table className="table table-bordered text-center mb-0">
                            <thead className="bg-secondary text-dark">
                                <tr>
                                    <th>Products</th>
                                    <th>Price</th>
                                    <th>Quantity</th>
                                    <th>Total</th>
                                    <th>Remove</th>
                                </tr>
                            </thead>
                            <tbody className="align-middle">
                                {cartItems.map((item, i) => (
                                    <CartItem product={item} key={i} productDefaultImage={productDefaultImage} increaseCartItemQuantity={increaseCartItemQuantity} decreaseCartItemQuantity={decreaseCartItemQuantity} removeCartItemHandler={removeCartItemHandler} />
                                ))}
                            </tbody>
                        </table>
                        : <Alert severity="info">No items in cart!</Alert>}
                </div>
                {cartItems.length > 0 &&
                    <div className="col-lg-4">
                        <form className="mb-5" action="">
                            <div className="input-group">
                                <input type="text" className="form-control p-4" placeholder="Coupon Code" />
                                <div className="input-group-append">
                                    <button className="btn btn-primary">Apply Coupon</button>
                                </div>
                            </div>
                        </form>
                        <div className="card border-secondary mb-5">
                            <div className="card-header bg-secondary border-0">
                                <h4 className="font-weight-semi-bold m-0">Cart Summary</h4>
                            </div>
                            <div className="card-body">
                                <div className="d-flex justify-content-between mb-3 pt-1">
                                    <h6 className="font-weight-medium">Subtotal</h6>
                                    <h6 className="font-weight-medium"><FaRupeeSign />{subtotal}</h6>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <h6 className="font-weight-medium">Shipping</h6>
                                    <h6 className="font-weight-medium"><FaRupeeSign />{shippingCharges}</h6>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <h6 className="font-weight-medium">Tax</h6>
                                    <h6 className="font-weight-medium"><FaRupeeSign />{tax}</h6>
                                </div>
                            </div>
                            <div className="card-footer border-secondary bg-transparent">
                                <div className="d-flex justify-content-between mt-2">
                                    <h5 className="font-weight-bold">Total</h5>
                                    <h5 className="font-weight-bold"><FaRupeeSign />{total}</h5>
                                </div>
                                <button className="btn btn-block btn-primary my-3 py-3" onClick={proceedsToCheckOut}>Proceed To Checkout</button>
                            </div>
                        </div>
                    </div>
                }
            </div>
        </div>


    )
}

export default Cart