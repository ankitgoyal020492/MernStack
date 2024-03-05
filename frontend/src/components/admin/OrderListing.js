import {  useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import Loader from "../partials/Loader";
import TableHOC from "./TableHOC";
import { FaEye, FaTrash, FaWrench } from "react-icons/fa";
import Sidebar from "./Sidebar";
import { useAllOrdersQuery, useDeleteOrderMutation } from "../../redux/api/adminOrderApi";
import moment from "moment";
import OrderStatusModal from "./OrderStatusModal";
const column = [
    {
        Header: "#ID",
        accessor: "_id",
    },
    {
        Header: "Total Items",
        accessor: "orderItems",
    },
    {
        Header: "totalPrice",
        accessor: "totalPrice",
    },
    {
        Header: "Paid Date",
        accessor: "paidAt",
    },
    {
        Header: "Status",
        accessor: "orderStatus",
    },
    {
        Header: "Action",
        accessor: "action",
    },
];

const OrderListing = () => {
    const { isLoading, data, isError, error } = useAllOrdersQuery();
    const [deleteOrder, { isLoading: deleteIsLoading, isError: deleteIsError, error: deleteError, isSuccess: deleteIsSuccess }] = useDeleteOrderMutation();
    const [rows, setRows] = useState([]);
    const [orderStatusModal, setOrderStatusModal] = useState(false);
    const [editOrder, setEditOrder] = useState({ id: "", status: "" });

    const openOrderStatusModal = (id, status) => {
        setEditOrder({ id: id, status: status });
        setOrderStatusModal(true);
    }
    if (isError) {
        toast.error(error.data.error);
    }

    const deleteOrderData = async (e, id) => {
        e.preventDefault();
        await deleteOrder(id);
    }


    useEffect(() => {
        if (data)
            setRows(
                data.orders.map((i) => ({
                    _id: i._id,
                    orderItems: i.orderItems.length,
                    totalPrice: i.totalPrice,
                    paidAt: moment(i.paidAt).format("DD MMM YYYY"),
                    orderStatus: <>
                        <span
                            className={
                                i.orderStatus === "Processing"
                                    ? "text-danger"
                                    : i.orderStatus === "Shipped"
                                        ? "text-primary"
                                        : "text-success"
                            }>
                            {i.orderStatus}<br />
                            {i.orderStatus === "Delivered" && moment(i.deliveredAt).format("DD MMM YYYY")}
                        </span>
                    </>,
                    action: <>
                        <Link to={"#"} onClick={(e) => openOrderStatusModal(i._id, i.orderStatus)}><FaWrench /></Link>
                        <Link to={"/admin/order/detail/" + i._id} ><FaEye /></Link>
                        <Link onClick={(e) => deleteOrderData(e, i._id)}><FaTrash /></Link>
                    </>,
                }))
            );
    }, [data]);

    useEffect(() => {
        if (deleteIsError) {
            toast.error(deleteError.data.error);
        }
        if (deleteIsSuccess) {
            toast.success("Order deleted successfully");

        }
    }, [deleteIsError, deleteError, deleteIsSuccess]);

    const Table = TableHOC(
        column,
        rows,
        "dashboard-product-box",
        "Orders",
        rows.length > 20
    )();
    return (
        <div className="container-fluid">
            <div className="row flex-nowrap">
                <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-dark">
                    <Sidebar />
                </div>
                <div className="col py-3">
                    {isLoading || deleteIsLoading ? <Loader /> : Table}
                </div>
            </div>

            {orderStatusModal &&
                <OrderStatusModal id={editOrder.id} showModal={orderStatusModal} handleClose={setOrderStatusModal} orderStatus={editOrder.status} />
            }
        </div>
    );
};

export default OrderListing;