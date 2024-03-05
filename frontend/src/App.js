import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Suspense, lazy, useEffect } from "react";
import { Toaster } from 'react-hot-toast';

//CSS
import './App.css';
import './assets/css/bootstrap.min.css';
import './assets/css/style.css';
import './assets/css/tiny-slider.css';

//Redux
import { useDispatch, useSelector } from "react-redux";
import { getLoggedInUser } from "./redux/features/user/userLoginRegisterSlice";

//Pages
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Loader from "./components/partials/Loader";
import ProtectedRoute from "./components/ProtectedRoutes";
import Users from "./components/admin/Users";
import ProductReviews from "./components/admin/ProductReviews";

const Dashboard  = lazy(() => import("./components/admin/Dashboard"));
const ProductListing = lazy(() => import("./components/admin/ProductListing"));
const ProductForm = lazy(() => import("./components/admin/ProductForm"));

const ResetPassword  = lazy(() => import("./components/pages/login_register/ResetPassword"));
const Cart  = lazy(() => import("./components/pages/Cart"));
const Checkout  = lazy(() => import("./components/pages/Checkout"));
const Pay  = lazy(() => import("./components/pages/Pay"));
const Orders  = lazy(() => import("./components/pages/Orders"));
const OrderDetail  = lazy(() => import("./components/pages/OrderDetail"));

const ProductDetail = lazy(() => import("./components/pages/ProductDetail"));
const Home = lazy(() => import("./components/pages/Home"));
const Products = lazy(() => import("./components/pages/Products"));
const LoginRegister = lazy(() => import("./components/pages/login_register/LoginRegister"));
const EditProfile = lazy(() => import("./components/users/EditProfile"));
const Profile = lazy(() => import("./components/users/Profile"));
const OrderListing = lazy(() => import("./components/admin/OrderListing"));

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, user, loading, defaultImage } = useSelector(state => state.user);
  

  useEffect(() => {
    dispatch(getLoggedInUser());
  }, [dispatch])
  window.addEventListener("contextmenu", (e)=>e.preventDefault());
  return loading ? <Loader /> : (
    <BrowserRouter>
      <Header isAuthenticated={isAuthenticated} user={user} defaultImage={defaultImage}/>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetail isAuthenticated={isAuthenticated}/>} />
          <Route exact path="/products" element={<Products />} />
          <Route path="/products/:keyword" element={<Products />} />
          <Route path="/cart" element={<Cart isAuthenticated={isAuthenticated}/>} />
          
          {/* Not logged In Route */}
          <Route
            path="/login-signup"
            element={
              <ProtectedRoute isAuthenticated={!isAuthenticated} loading={loading} redirect={"/user/profile"}>
                <LoginRegister />
              </ProtectedRoute>
            }
          />
          <Route
            path="/password/reset/:token"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated ? false : true} loading={loading}>
                <ResetPassword />
              </ProtectedRoute>
            }
          />
          
          {/* Logged In User Routes */}
          <Route path="/user/*"
            element={<ProtectedRoute isAuthenticated={isAuthenticated ? true : false} loading={loading} /> }
          >
            <Route path="profile" element={<Profile user={user} defaultImage={defaultImage} />} />
            <Route path="edit" element={<EditProfile user={user} defaultImage={defaultImage}/>} />
            <Route path="checkout" element={<Checkout isAuthenticated={isAuthenticated}/>} />
            <Route path="pay" element={<Pay isAuthenticated={isAuthenticated}/>} />
            <Route path="orders" element={<Orders isAuthenticated={isAuthenticated}/>} />
            <Route path="order_detail/:id" element={<OrderDetail isAuthenticated={isAuthenticated}/>} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin/*"
            element={<ProtectedRoute isAuthenticated={true} loading={loading} adminOnly={true} admin={user?.role === "admin" ? true : false}/> }
          >
            <Route path="dashboard" element={<Dashboard user={user} defaultImage={defaultImage} />} />
            <Route path="products" element={<ProductListing user={user} defaultImage={defaultImage} />} />
            <Route path={"product/edit/:id"} element={<ProductForm user={user} defaultImage={defaultImage} />} />
            <Route path={"product/add"} element={<ProductForm user={user} defaultImage={defaultImage} />} />
            <Route path={"orders"} element={<OrderListing user={user} defaultImage={defaultImage} />} />
            <Route path={"order/detail/:id"} element={<OrderDetail user={user} defaultImage={defaultImage} />} />
            <Route path={"users"} element={<Users user={user} defaultImage={defaultImage} />} />
            <Route path={"product/reviews/:id"} element={<ProductReviews user={user} defaultImage={defaultImage} />} />
          </Route>
          <Route path="*" element={<Home />} />
        </Routes>
      </Suspense>
      <Footer />
      <Toaster position="bottom-center" />
    </BrowserRouter>
  );
}

export default App;
