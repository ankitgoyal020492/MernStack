import moment from 'moment';
import React, { useState } from 'react'
import MetaData from '../layout/MetaData';
import { Link } from 'react-router-dom';
import ChangePassword from './ChangePassword';

const Profile = ({ user, defaultImage }) => {
    const [showModal, setShowModal] = useState(false);
    const handleClose = () => setShowModal(false);
    return (
        <>
            <MetaData title={"User Profile"} />
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <div className="card">
                            <div className="card-body">
                                <div className="text-center mb-3">
                                    <img src={user.avatar.url} alt="User Avatar" className="img-fluid img-thumbnail profile_page_avatar rounded-circle" onError={({ currentTarget }) => {
                                        currentTarget.onerror = null; // prevents looping
                                        currentTarget.src = defaultImage;
                                    }} />
                                </div>
                                <h3 className="card-title text-center mb-3">{user.name}</h3>
                                <p className="card-text text-center text-uppercase text-muted">{user.role}</p>
                                <ul className="list-group list-group-flush">
                                    <li className="list-group-item">
                                        <strong>Email:</strong> {user.email}
                                    </li>
                                    <li className="list-group-item">
                                        <strong>Joined:</strong> {moment(user.createdAt).format("DD MMM YYYY")}
                                    </li>
                                </ul>
                                <div className="text-center mt-4">
                                    <Link to={"/user/orders"} className="btn btn-secondary me-3">My Orders</Link>
                                    <Link to={"#"} onClick={() => setShowModal(true)} className="btn btn-info  me-3">Change Password</Link>
                                    <Link to={"/user/edit"} className="btn btn-primary">Edit Profile</Link>
                                </div>
                                {user.role === "admin" &&
                                    <div className="text-center mt-4">
                                        <Link to={"/admin/dashboard"} className="btn btn-danger  me-3">Dashboard</Link>
                                    </div>
                                }

                            </div>
                        </div>

                    </div>
                </div>
            </div>
            {showModal &&
                <ChangePassword
                    showModal={showModal}
                    handleClose={handleClose}
                />
            }
        </>

    )
}

export default Profile