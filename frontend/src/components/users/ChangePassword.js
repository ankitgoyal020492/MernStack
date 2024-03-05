import React, { useEffect, useState } from 'react'
import Modal from 'react-bootstrap/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { clearErrors, setIsUpdated, updateUserPassword } from '../../redux/features/user/userUpdateSlice';
import toast from 'react-hot-toast';
const ChangePassword = (props) => {
    const dispatch = useDispatch();
    const { error, isUpdated, loading } = useSelector(state => state.user_update);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const changeUserPassword = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.set("oldPassword", oldPassword);
        formData.set("newPassword", newPassword);
        formData.set("confirmPassword", confirmPassword);
        dispatch(updateUserPassword(formData));
    }
    useEffect(() => {
        if (error) {
            toast.dismiss();
            toast.error(error);
            dispatch(clearErrors());
        }
        if (isUpdated === true && loading === false) {
            toast.dismiss();
            toast.success("Password updated successfully.");
            dispatch(setIsUpdated(false));
            props.handleClose();
        }
    }, [error, loading, isUpdated, dispatch, props]);
    return (
        <>
            <Modal show={props.showModal}
                onHide={props.handleClose}
                backdrop="static"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Change Password</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form method='post' onSubmit={changeUserPassword}>

                        <div className="form-outline mb-4">
                            <input type="password" id="oldPassword" name="oldPassword" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} className="form-control" autoComplete='current-password' />
                            <label className="form-label" htmlFor="oldPassword">Old Password</label>
                        </div>
                        <div className="form-outline mb-4">
                            <input type="password" id="newPassword" name="newPassword" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="form-control" autoComplete='current-password' />
                            <label className="form-label" htmlFor="newPassword">New Password</label>
                        </div>

                        <div className="form-outline mb-4">
                            <input type="password" id="confirmPassword" name="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="form-control" autoComplete='current-password' />
                            <label className="form-label" htmlFor="confirmPassword">Confirm password</label>
                        </div>
                        <button type="submit" className="btn btn-primary btn-block mb-3">Update</button>
                    </form>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default ChangePassword