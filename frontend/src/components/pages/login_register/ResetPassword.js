import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { clearErrors, setIsUpdated, resetPasswordApi } from '../../../redux/features/forgot_password/ForgotPasswordSlice';
import { useNavigate, useParams } from 'react-router-dom';
import Loader from '../../partials/Loader';
const ResetPassword = (props) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { error, isUpdated, loading } = useSelector(state => state.forgot_password);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const params = useParams();
    const resetUserPasswordSubmit = (e) => {
        e.preventDefault();
        dispatch(resetPasswordApi({ password: newPassword, confirmPassword: confirmPassword, token: params.token }));
    }
    useEffect(() => {
        if (error) {
            toast.dismiss();
            toast.error(error);
            dispatch(clearErrors());
        }
        if (isUpdated === true && loading === false) {
            toast.dismiss();
            toast.success("Password reset successfully.");
            dispatch(setIsUpdated(false));
            navigate("/login-signup")
        }
    }, [error, loading, isUpdated, dispatch, navigate]);
    return (
        <>
            {loading ? <Loader /> :
                <div className='container'>
                    <div className='row mt-5'>
                        <div className='col-md-6'>
                            <form method='post' onSubmit={resetUserPasswordSubmit}>
                                <h1>Reset Password</h1>
                                <div className="form-outline mb-4">
                                    <input type="password" id="newPassword" name="newPassword" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="form-control" autoComplete='current-password' />
                                    <label className="form-label" htmlFor="newPassword">Password</label>
                                </div>

                                <div className="form-outline mb-4">
                                    <input type="password" id="confirmPassword" name="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="form-control" autoComplete='current-password' />
                                    <label className="form-label" htmlFor="confirmPassword">Confirm password</label>
                                </div>
                                <button type="submit" className="btn btn-primary btn-block mb-3">Update</button>
                            </form>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}

export default ResetPassword