import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Country, State, City } from 'country-state-city';
import { calculatePrice, saveShippingInfo } from '../../redux/features/product/cartSlice';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaRupeeSign } from 'react-icons/fa';
const Checkout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { shippingInfo, cartItems, subtotal, tax, shippingCharges, total } = useSelector((state) => state.cart);
    const { user } = useSelector((state) => state.user);

    const [name, setName] = useState(shippingInfo.name);
    const [address, setAddress] = useState(shippingInfo.address);
    const [city, setCity] = useState(shippingInfo.city);
    const [state, setState] = useState(shippingInfo.state);
    const [country, setCountry] = useState(shippingInfo.country);
    const [pinCode, setPinCode] = useState(shippingInfo.pinCode);
    const [phoneNo, setPhoneNo] = useState(shippingInfo.phoneNo);

    useEffect(() => {
        dispatch(calculatePrice());
    }, [cartItems, dispatch]);
    useEffect(() => {
        if (name === "") {
            setName(user.name);
        }
    }, []);
    const placeOrder = async () => {
        dispatch(saveShippingInfo({ name, address, country, city, state, pinCode, phoneNo }));
        try {
            const { data } = await axios.post(`/api/v1/payment/create`,
                {
                    amount: total,
                    shipping: {
                        name: name,
                        address: {
                            line1: address,
                            postal_code: pinCode,
                            city: city,
                            state: state,
                            country: country,
                        }
                    }
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            navigate("/user/pay", {
                state: { clientSecret: data.clientSecret, stripeApiKey: data.stripeApiKey }
            });
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        }
    }
    return (
        <div>
            <div className="container-fluid pt-5">
                <div className="row px-xl-5">
                    <div className="col-lg-8">
                        <div className="mb-4">
                            <h4 className="font-weight-semi-bold mb-4">Billing Address</h4>
                            <div className="row">
                                <div className="col-md-6 form-group">
                                    <label>Name</label>
                                    <input className="form-control" type="text" placeholder="Doe" value={name} onChange={(e) => setName(e.target.value)} />
                                </div>
                                <div className="col-md-6 form-group">
                                    <label>Phone No</label>
                                    <input className="form-control" type="text" placeholder="+123 456 789" value={phoneNo} onChange={(e) => setPhoneNo(e.target.value)} />
                                </div>
                                <div className="col-md-6 form-group">
                                    <label>Address </label>
                                    <input className="form-control" type="text" placeholder="123 Street" value={address} onChange={(e) => setAddress(e.target.value)} />
                                </div>
                                <div className="col-md-6 form-group">
                                    <label>Country</label>
                                    <select className="form-control" name="country" value={country} onChange={(e) => setCountry(e.target.value)}>
                                        <option value="">Country</option>
                                        {Country.getAllCountries().map((country) => (
                                            <option key={country.isoCode} value={country.isoCode}>
                                                {country.name}
                                            </option>
                                        )

                                        )}
                                    </select>
                                </div>
                                {country && (
                                    <div className="col-md-6 form-group">
                                        <label>State</label>
                                        <select
                                            className='form-control'
                                            required
                                            value={state}
                                            name={"state"}
                                            onChange={(e) => setState(e.target.value)}
                                        >
                                            <option value="">State</option>
                                            {State &&
                                                State.getStatesOfCountry(country).map((item) => (
                                                    <option key={item.isoCode} value={item.isoCode}>
                                                        {item.name}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                )}
                                {state && (
                                    <div className="col-md-6 form-group">
                                        <label>City</label>
                                        <select
                                            className='form-control'
                                            required
                                            value={city}
                                            name="city"
                                            onChange={(e) => setCity(e.target.value)}
                                        >
                                            <option value="">City</option>
                                            {State &&
                                                City.getCitiesOfState(country, state)
                                                    .map((item) => (
                                                        <option key={item.name} value={item.name}>
                                                            {item.name}
                                                        </option>
                                                    ))}
                                        </select>
                                    </div>
                                )}
                                <div className="col-md-6 form-group">
                                    <label>ZIP Code</label>
                                    <input className="form-control" type="text" placeholder="123" name='pincode' value={pinCode} onChange={(e) => setPinCode(e.target.value)} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4">
                        <div className="card border-secondary mb-5">
                            <div className="card-header bg-secondary border-0">
                                <h4 className="font-weight-semi-bold m-0">Order Total</h4>
                            </div>
                            <div className="card-body">
                                <h5 className="font-weight-medium mb-3">Products</h5>
                                {cartItems.map((product, key) => (
                                    <div className="d-flex justify-content-between mb-3 pt-1">
                                        <h6 className="font-weight-medium">{product.name}</h6>
                                        <h6 className="font-weight-medium">
                                            <span className='me-2'>{product.quantity}  x  <FaRupeeSign />{product.price + " = "}</span>
                                            <FaRupeeSign />{product.quantity * product.price}</h6>
                                    </div>
                                ))}

                                <hr className="mt-0" />
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
                            </div>
                        </div>
                        <div className="card-footer border-secondary bg-transparent d-grid gap-2 col-6 mx-auto">
                            <button className="btn btn-lg btn-block btn-primary font-weight-bold" onClick={placeOrder}>Place Order</button>
                        </div>
                    </div>
                </div>
            </div>


        </div>
    )
}

export default Checkout