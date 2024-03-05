import React, { useEffect, useState } from 'react'
import Modal from 'react-bootstrap/Modal';
import toast from 'react-hot-toast';
import { useEditOrderMutation } from '../../redux/api/adminOrderApi';
const OrderStatusModal = (props) => {
    const [editOrder, { isLoading, isError, error, isSuccess }] = useEditOrderMutation();
    const [status, setStatus] = useState(props.orderStatus);

    const updateOrderStatus = async (e) => {
        e.preventDefault();
        await editOrder({ id: props.id, formData: {status} })
    }
    useEffect(() => {
        if (isError) {
            toast.dismiss();
            toast.error(error.data.error);
        }
        if (isSuccess === true && isLoading === false) {
            toast.dismiss();
            toast.success("Order updated successfully.");
            props.handleClose();
        }
    }, [error, isLoading, isSuccess, props]);
    return (
        <>
            <Modal show={props.showModal}
                onHide={props.handleClose}
                backdrop="static"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Update Order</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form method='post' onSubmit={updateOrderStatus}>

                        <div className="form-outline mb-4">
                            <label className="form-label" htmlFor="status">Status</label>
                            <select className="form-control" value={status} id="status" name="status" onChange={(e) => setStatus(e.target.value)}>
                                <option value={""}>--Select--</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Canceled">Canceled</option>
                                <option value="Processing">Processing</option>
                            </select>
                        </div>
                        <button type="submit" className="btn btn-primary btn-block mb-3">Update</button>
                    </form>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default OrderStatusModal