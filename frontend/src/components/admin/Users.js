import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import Loader from "../partials/Loader";
import TableHOC from "./TableHOC";
import { FaEdit, FaTrash} from "react-icons/fa";
import Sidebar from "./Sidebar";
import moment from "moment";
import { useAllUsersQuery, useDeleteUserMutation } from "../../redux/api/adminUserApi";
import UserUpdateModal from "./UserUpdateModal";
const column = [
    {
        Header: "#ID",
        accessor: "_id",
    },
    {
        Header: "Avatar",
        accessor: "avatar",
    },
    {
        Header: "Name",
        accessor: "name",
    },
    {
        Header: "Email",
        accessor: "email",
    },
    {
        Header: "Role",
        accessor: "role",
    },
    {
        Header: "Created At",
        accessor: "createdAt",
    },
    {
        Header: "Action",
        accessor: "action",
    },
];

const Users = () => {
    const { isLoading, data, isError, error } = useAllUsersQuery();
    const [deleteUser, { isLoading: deleteIsLoading, isError: deleteIsError, error: deleteError, isSuccess: deleteIsSuccess }] = useDeleteUserMutation();
    const [rows, setRows] = useState([]);
    const [userData, setUserData] = useState({ id: "", name: "", email: "", role:"" });
    const [userModal, showUserModal] = useState(false);
    if (isError) {
        toast.error(error.data.error);
    }

    const deleteUserData = async (e, id) => {
        e.preventDefault();
        await deleteUser(id);
    }

    const setUserEditData = (data) => {
        setUserData({ id: data._id, name: data.name, email: data.email, role:data.role });
        showUserModal(true);
    }

    useEffect(() => {
        if (data)
            setRows(
                data.users.map((i) => ({
                    _id: i._id,
                    avatar: <><img alt={"admin_user_avatar"} src={i.avatar?.url} className="admin_user_list_avatar" /></>,
                    name: i.name,
                    email: i.email,
                    role: <span
                        className={"firstUpperCase "+
                            (i.role === "admin"
                                ? "text-danger"
                                : "text-success")
                        }>
                        {i.role}
                    </span>,
                    createdAt: moment(i.createdAt).format("DD MMM YYYY"),
                    action: <>
                        <Link onClick={() => setUserEditData(i)} ><FaEdit /></Link>
                        <Link onClick={(e) => deleteUserData(e, i._id)}><FaTrash /></Link>
                    </>,
                }))
            );
    }, [data]);

    useEffect(() => {
        if (deleteIsError) {
            toast.error(deleteError.data.error);
        }
        if (deleteIsSuccess) {
            toast.success("User deleted successfully");

        }
    }, [deleteIsError, deleteError, deleteIsSuccess]);

    const Table = TableHOC(
        column,
        rows,
        "dashboard-product-box",
        "Users",
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
            {userModal &&
                <UserUpdateModal userData={userData} showModal={userModal} handleClose={showUserModal} />
            }
        </div>
    );
};

export default Users;