import React from 'react'
import { Link, useLocation } from 'react-router-dom';
import { FaUserAstronaut, FaShoppingCart } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../../redux/features/user/userLoginRegisterSlice';
import toast from 'react-hot-toast';
const Header = (props) => {
    const { isAuthenticated, user, defaultImage } = props;
    const dispatch = useDispatch();
    const logout = () => {
        dispatch(logoutUser());
        toast.success("User logged out successfully.");
    }
    const { cartItems } = useSelector(state => state.cart);
    const { pathname }  = useLocation();
    return (
        <nav className="custom-navbar navbar navbar navbar-expand-md navbar-dark bg-dark" arial-label="Furni navigation bar">

            <div className="container">
                <Link className="navbar-brand" to="/">Furni<span>.</span></Link>

                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarsFurni" aria-controls="navbarsFurni" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarsFurni">
                    <ul className="custom-navbar-nav navbar-nav ms-auto mb-2 mb-md-0">
                        <li className={pathname === "/" ? "nav-item active" : ""}>
                            <Link className="nav-link" to="/">Home</Link>
                        </li>
                        <li className={pathname === "/products" ? "nav-item active" : ""}><Link className="nav-link" to="/products">Shop</Link></li>
                        <li className={pathname === "/about" ? "nav-item active" : ""}><Link className="nav-link" to="/about-us">About us</Link></li>
                        <li className={pathname === "/services" ? "nav-item active" : ""}><Link className="nav-link" to="/services">Services</Link></li>
                        <li className={pathname === "/blogs" ? "nav-item active" : ""}><Link className="nav-link" to="/blogs">Blog</Link></li>
                        <li className={pathname === "/contact" ? "nav-item active" : ""}><Link className="nav-link" to="/contact">Contact us</Link></li>
                    </ul>

                    <ul className="custom-navbar-cta navbar-nav mb-2 mb-md-0 ms-5">
                        {!isAuthenticated ?
                            <li><Link className="nav-link" to="/login-signup"><FaUserAstronaut /></Link></li>
                            :
                            <li className="nav-item dropdown">
                                <Link className="nav-link dropdown-toggle" to="#" id="navbarDropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    <img alt='user_profile' src={user.avatar.url} className='profile_pic' onError={({ currentTarget }) => {
                                        currentTarget.onerror = null; // prevents looping
                                        currentTarget.src = defaultImage;
                                    }} /> <span>{user.name}</span>
                                </Link>
                                <ul className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                                    <li><Link className="dropdown-item" to={"/user/profile"}>Dashboard</Link></li>
                                    <li><Link className="dropdown-item" to="/user/orders">Orders</Link></li>
                                    <li><Link className="dropdown-item" to="#" onClick={logout}>Logout</Link></li>
                                </ul>
                            </li>
                        }
                        <li><Link className="nav-link" to="/cart"><FaShoppingCart />
                            {cartItems.length > 0 &&
                                <span className="position-absolute p-1 bg-danger border border-light rounded-circle">
                                    <span className="visually-hidden">{cartItems.length}</span>
                                </span>
                            }
                        </Link></li>
                    </ul>
                </div>
            </div>

        </nav>
    )
}

export default Header
