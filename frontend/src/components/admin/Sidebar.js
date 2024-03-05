import React from 'react'
import { FaHome, FaJediOrder, FaTachometerAlt, FaUserAstronaut } from 'react-icons/fa'
import { Link } from 'react-router-dom'

const Sidebar = () => {
    return (
        <>
            <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white">
               
                <ul className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center text-white align-items-sm-start" id="menu">
                    <li className="nav-item text-white">
                        <Link to="#" className="nav-link align-middle px-0">
                            <FaHome className='text-white'/> <span className="ms-1 d-none d-sm-inline text-white">Dashboard</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="#submenu1" data-bs-toggle="collapse" className="nav-link px-0 align-middle">
                            <FaTachometerAlt className='text-white'/> <span className="ms-1 d-none d-sm-inline text-white">Products</span> </Link>
                        <ul className="collapse show nav flex-column ms-1" id="submenu1" data-bs-parent="#menu">
                            <li className="w-100">
                                <Link to="/admin/products" className="nav-link px-0"> List  </Link>
                            </li>
                            <li>
                            <Link to="/admin/product/add" className="nav-link px-0"> Add  </Link>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <Link to="/admin/orders" className="nav-link px-0 align-middle">
                            <FaJediOrder className='text-white' /> <span className="ms-1 d-none d-sm-inline text-white">Orders</span></Link>
                    </li>
                    <li>
                        <Link to="/admin/users" className="nav-link px-0 align-middle">
                            <FaUserAstronaut className='text-white' /> <span className="ms-1 d-none d-sm-inline text-white">Users</span></Link>
                    </li>
                </ul>
              
            </div>


        </>
    )
}

export default Sidebar