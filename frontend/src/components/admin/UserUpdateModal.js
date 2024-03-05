import React, { useEffect, useState } from 'react'
import Modal from 'react-bootstrap/Modal';
import toast from 'react-hot-toast';
import { useUpdateUserMutation } from '../../redux/api/adminUserApi';
const UserUpdateModal = (props) => {
    const { userData } = props;
    const [updateUser, { isLoading, isError, error, isSuccess }] = useUpdateUserMutation();
    const [user, setUser] = useState({
        name: userData.name,
        email: userData.email,
        id: userData.id,
        role: userData.role
    });

    const updateUserFn = async (e) => {
        e.preventDefault();
        await updateUser(user)
    }
    useEffect(() => {
        if (isError) {
            toast.dismiss();
            toast.error(error.data.error);
        }
        if (isSuccess === true && isLoading === false) {
            toast.dismiss();
            toast.success("User updated successfully.");
            props.handleClose();
        }
    }, [error, isLoading, isSuccess, props, isError]);

    const setUserUpdateData = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value })
    }
    return (
        <>
            <Modal show={props.showModal}
                onHide={props.handleClose}
                backdrop="static"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Update User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form method='post' onSubmit={updateUserFn}>
                        <div className="form-outline mb-4">
                            <label className="form-label" htmlFor="name">Name</label>
                            <input type="text" id="name" name="name" value={user.name} onChange={setUserUpdateData} className="form-control" />
                        </div>

                        <div className="form-outline mb-4">
                            <label className="form-label" htmlFor="registeremailEmail">Email</label>
                            <input type="email" id="email" name="email" value={user.email} onChange={setUserUpdateData} className="form-control" autoComplete='username' />
                        </div>
                        <div className="form-outline mb-4">
                            <label className="form-label" htmlFor="status">Role</label>
                            <select className="form-control" value={user.role} id="role" name="role" onChange={setUserUpdateData}>
                                <option value={""}>--Select--</option>
                                <option value="admin">Admin</option>
                                <option value="user">User</option>
                            </select>
                        </div>
                        <button type="submit" className="btn btn-primary btn-block mb-3">Update</button>
                    </form>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default UserUpdateModal