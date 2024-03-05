import React, { useEffect, useState } from 'react'
import MetaData from '../../layout/MetaData';
import {useDispatch, useSelector} from 'react-redux';
import { loginUser, registerUser } from '../../../redux/features/user/userLoginRegisterSlice';
import Loader from '../../partials/Loader';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import ForgotPassword from '../../partials/ForgotPassword';

const LoginRegister = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [tab, setTab] = useState("login");
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [showModal, setShowModal] = useState(false);
    const handleClose = () => setShowModal(false);
    
    const {error, loading, isAuthenticated} = useSelector(state => state.user);
    const [user, setUser] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        registerCheck: false
    });

    const [avatar, setAvatar] = useState("");
    const [avatarPreview, setAvatarPreview] = useState("/images/default-profile.jpg");

    const setRegisterFormData = (e) => {
        if (e.target.name === "avatar") {
            setAvatar(e.target.files[0]);
            setAvatarPreview(URL.createObjectURL(e.target.files[0]));
        } else {
            setUser({
                ...user,
                [e.target.name]: e.target.name === "registerCheck" ? e.target.checked : e.target.value
            });
        }
    }
    const submitLoginForm = (e) => {
        e.preventDefault();
        dispatch(loginUser({email: loginEmail, password: loginPassword}))
    }

    const submitRegisterForm = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.set("name", user.name);
        formData.set("email", user.email);
        formData.set("password", user.password);
        formData.set("confirmPassword", user.confirmPassword);
        formData.set("avatar", avatar);
        dispatch(registerUser(formData));
    }

    useEffect(()=>{
        if(error){
            return () => { toast.error(error) }
        }
        if(isAuthenticated){
            navigate("/user/profile");
            return;
        }
    }, [error, isAuthenticated, navigate])
    return (
        <>
            <MetaData title={`ECOMMERCE- ${tab}`} />
            {!loading ?
            <div className="container">
                <div className='loginRegisterDiv'>
                    <ul className="nav nav-pills nav-justified mb-3" id="ex1" role="tablist">
                        <li className="nav-item" role="presentation">
                            <a onClick={(e) => setTab("login")} className={`" nav-link " ${tab === "login" ? "active" : ""}`} id="tab-login" data-mdb-toggle="pill" href="#pills-login" role="tab"
                                aria-controls="pills-login" aria-selected="true">Login</a>
                        </li>
                        <li className="nav-item" role="presentation">
                            <a onClick={(e) => setTab("register")} className={`" nav-link " ${tab === "register" ? "active" : ""}`} id="tab-register" data-mdb-toggle="pill" href="#pills-register" role="tab"
                                aria-controls="pills-register" aria-selected="false">Register</a>
                        </li>
                    </ul>
                    <div className="tab-content">
                        <div className={`" tab-pane fade " ${tab === "login" ? "show active" : ""}`} id="pills-login" role="tabpanel" aria-labelledby="tab-login">
                            <form method='post' onSubmit={(e) => submitLoginForm(e)}>
                                <div className="form-outline mb-4">
                                    <input value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} type="email" id="loginEmail" name="loginEmail" className="form-control" autoComplete='username' />
                                    <label className="form-label" htmlFor="loginEmail">Email</label>
                                </div>

                                <div className="form-outline mb-4">
                                    <input value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} type="password" id="loginPassword" name="loginPassword" className="form-control" autoComplete='current-password' />
                                    <label className="form-label" htmlFor="loginPassword">Password</label>
                                </div>

                                <div className="row mb-4">
                                    <div className="col-md-12 d-flex justify-content-end">
                                        <Link to="#!" onClick={(e) => setShowModal(true)}>Forgot password?</Link>
                                    </div>
                                </div>

                                <div className="text-center">
                                    <button type="submit" className="btn btn-primary btn-block mb-4">Sign in</button>
                                    <p>Not a member? <a href="#!">Register</a></p>
                                </div>
                            </form>
                        </div>
                        <div className={`" tab-pane fade " ${tab === "register" ? "show active" : ""}`} id="pills-register" role="tabpanel" aria-labelledby="tab-register">
                            <form method='post' encType='multipart/form-data' onSubmit={submitRegisterForm}>
                                <div className="form-outline mb-4">
                                    <input type="text" id="name" name="name" value={user.name} onChange={setRegisterFormData} className="form-control" />
                                    <label className="form-label" htmlFor="name">Name</label>
                                </div>

                                <div className="form-outline mb-4">
                                    <input type="email" id="email" name="email" value={user.email} onChange={setRegisterFormData} className="form-control" autoComplete='username' />
                                    <label className="form-label" htmlFor="registeremailEmail">Email</label>
                                </div>

                                <div className="form-outline mb-4">
                                    <input type="password" id="password" name="password" value={user.password} onChange={setRegisterFormData} className="form-control" autoComplete='current-password' />
                                    <label className="form-label" htmlFor="password">Password</label>
                                </div>

                                <div className="form-outline mb-4">
                                    <input type="password" id="confirmPassword" name="confirmPassword" value={user.confirmPassword} onChange={setRegisterFormData} className="form-control" autoComplete='current-password' />
                                    <label className="form-label" htmlFor="confirmPassword">Confirm password</label>
                                </div>
                                <div className="form-outline mb-4">
                                    <label className="form-label" htmlFor="registerRepeatPassword">Profile Picture</label>
                                    <input type='file' name="avatar" id="avatar" accept='image/*' onChange={setRegisterFormData} />
                                    <img className='userRegisterProfilePic' src={avatarPreview} alt="user profile" />
                                </div>

                                <div className="form-check d-flex justify-content-center mb-4">
                                    <input className="form-check-input me-2" type="checkbox" id="registerCheck" name="registerCheck"
                                        aria-describedby="registerCheckHelpText" value={1} onChange={setRegisterFormData} checked={user.registerCheck} />
                                    <label className="form-check-label" htmlFor="registerCheck">
                                        I have read and agree to the terms
                                    </label>
                                </div>

                                <button type="submit" className="btn btn-primary btn-block mb-3">Sign in</button>
                            </form>
                        </div>
                    </div>
                </div>
                {showModal &&
                <ForgotPassword
                    showModal={showModal}
                    handleClose={handleClose}
                />
            }
            </div>
            : <Loader />
            }
        </>
    )
}

export default LoginRegister