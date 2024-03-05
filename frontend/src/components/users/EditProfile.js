import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setIsUpdated, updateUser } from '../../redux/features/user/userUpdateSlice';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { getLoggedInUser } from '../../redux/features/user/userLoginRegisterSlice';
import MetaData from '../layout/MetaData';
import Loader from '../partials/Loader';

const EditProfile = ({ user, defaultImage }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { error, isUpdated, loading } = useSelector(state => state.user_update);

    const [name, setUserName] = useState("");
    const [email, setUserEmail] = useState("");
    const [avatar, setAvatar] = useState("");
    const [avatarPreview, setAvatarPreview] = useState("");

    const setUpdateFormData = (e) => {
        setAvatar(e.target.files[0]);
        setAvatarPreview(URL.createObjectURL(e.target.files[0]));
    }
    const submitUpdateUserForm = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.set("name", name);
        formData.set("email", email);
        formData.set("avatar", avatar);
        dispatch(updateUser(formData));
    }

    useEffect(() => {
        if (user) {
            setUserName(user.name);
            setUserEmail(user.email);
            setAvatarPreview(user.avatar.url);
        }
        if (error) {
            toast.error(error);
        }
        if (isUpdated === true && loading === false) {
            toast.success("Profile updated successfully.");
            dispatch(setIsUpdated(false));
            dispatch(getLoggedInUser());
            navigate("/user/profile");
        }
    }, [user, error, isUpdated, navigate, loading]);

    return (
        <>
            <MetaData title={`ECOMMERCE- Update profile`} />
            {!loading ?
                <div className="container d-flex justify-content-center">
                    <div className='row'>
                        <div className='col-md-12 '>
                            <h1 className='text-center mt-5'>Edit Profile</h1>
                            <form method='post' encType='multipart/form-data' onSubmit={submitUpdateUserForm}>
                                <div className="form-outline mb-4">
                                    <input type="text" id="name" name="name" value={name} onChange={(e) => setUserName(e.target.value)} className="form-control" />
                                    <label className="form-label" htmlFor="name">Name</label>
                                </div>

                                <div className="form-outline mb-4">
                                    <input type="email" id="email" name="email" value={email} onChange={(e) => setUserEmail(e.target.value)} className="form-control" autoComplete='username' />
                                    <label className="form-label" htmlFor="email">Email</label>
                                </div>

                                <div className="form-outline mb-4">
                                    <label className="form-label" htmlFor="avatar">Profile Picture</label>
                                    <input type='file' name="avatar" id="avatar" accept='image/*' onChange={setUpdateFormData} />
                                    <img className='userRegisterProfilePic' src={avatarPreview} alt="user profile" onError={({ currentTarget }) => {
                                        currentTarget.onerror = null; // prevents looping
                                        currentTarget.src = defaultImage;
                                    }} />
                                </div>

                                <button type="submit" className="btn btn-primary btn-block mb-3">Update</button>
                            </form>
                        </div>
                    </div>
                </div>

                : <Loader />
            }
        </>
    )
}

export default EditProfile