import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { useMyOrdersQuery } from "../../redux/api/orderApi";
import Loader from "../partials/Loader";
import TableHOC from "../admin/TableHOC";
import { FaEdit, FaRupeeSign } from "react-icons/fa";

const column = [
  {
    Header: "ID",
    accessor: "_id",
  },
  {
    Header: "Quantity",
    accessor: "quantity",
  },
  {
    Header: "Amount",
    accessor: "amount",
  },
  {
    Header: "Status",
    accessor: "status",
  },
  {
    Header: "Action",
    accessor: "action",
  },
];

const Orders = () => {

  const { isLoading, data, isError, error } = useMyOrdersQuery();

  const [rows, setRows] = useState([]);

  if (isError) {
    const err = error;
    toast.error(err.data.error);
  }

  useEffect(() => {
    if (data)
      setRows(
        data.orders.map((i) => ({
          _id: i._id,
          amount: <><FaRupeeSign /> {i.totalPrice}</>,
          quantity: i.orderItems.length,
          status: (
            <span
              className={
                i.orderStatus === "Processing"
                  ? "text-danger"
                  : i.orderStatus === "Shipped"
                  ? "text-primary"
                  : "text-success"
              }
            >
              {i.orderStatus}
            </span>
          ),
          action: <Link to={`/user/order_detail/${i._id}`}><FaEdit /></Link>,
        }))
      );
  }, [data]);

  const Table = TableHOC(
    column,
    rows,
    "dashboard-product-box",
    "My Orders",
    rows.length > 20
  )();
  return (
    <div className="container mt-4">
      {isLoading ? <Loader /> : Table}
    </div>
  );
};

export default Orders;