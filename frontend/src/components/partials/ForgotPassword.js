import React, { useEffect, useState } from 'react'
import Modal from 'react-bootstrap/Modal';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { clearErrors, forgotPasswordApi, setEmailSent } from '../../redux/features/forgot_password/ForgotPasswordSlice';
import Loader from './Loader';
const ForgotPassword = (props) => {
    const dispatch = useDispatch();
    const { error, emailSent, loading } = useSelector(state => state.forgot_password);
    const [forgot_email, setForgotEmail] = useState("");
    const sendForgotPasswordEmail = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.set("email", forgot_email);
        dispatch(forgotPasswordApi(formData));
    }
    useEffect(() => {
        if (error) {
            toast.dismiss();
            toast.error(error);
            dispatch(clearErrors());
        }
        if (emailSent === true && loading === false) {
            toast.dismiss();
            toast.success("Forgot Password email sent successfully.");
            dispatch(setEmailSent(false));
            props.handleClose();
        }
    }, [error, loading, emailSent, dispatch, props]);
    return (
        <>
            {loading ? <Loader /> : ""}
            <Modal show={props.showModal}
                onHide={props.handleClose}
                backdrop="static"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Forgot Password</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form method='post' onSubmit={sendForgotPasswordEmail}>

                        <div className="form-outline mb-4">
                            <input type="email" id="forgot_email" name="forgot_email" value={forgot_email} onChange={(e) => setForgotEmail(e.target.value)} className="form-control" autoComplete='current-password' />
                            <label className="form-label" htmlFor="forgot_email">Email</label>
                        </div>
                        <button type="submit" className="btn btn-primary btn-block mb-3">Update</button>
                    </form>
                </Modal.Body>
            </Modal>

        </>
    )
}

export default ForgotPassword