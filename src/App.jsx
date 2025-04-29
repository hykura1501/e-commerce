import "./App.css";
import AdminLayout from "./layouts/admin/AdminLayout";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { privateRoutes, publicRoutes } from "@/routes/routes";
import { ThemeProvider } from "@/components/ThemeProvider";
import UserLayout from "./layouts/users/UserLayout";
import { getMe } from "@/services/userServices";
import { useEffect, useState } from "react";
import Spinner from "@/components/ui/Spinner";
import { CartSidebar } from "./components/CartSidebar";
import { getCart, updateMultipleProducts } from "./services/cartServices";
import updateLocalCart from "./lib/updateCart";
import { GoogleOAuthProvider } from '@react-oauth/google';
function App() {
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  return (
    <GoogleOAuthProvider clientId="9634303291-98us83k492ra2lcrq5g11vh7jebua5rq.apps.googleusercontent.com">
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <BrowserRouter>
          <AppContent
            user={user}
            setUser={setUser}
            checkingAuth={checkingAuth}
            setCheckingAuth={setCheckingAuth}
          />
        </BrowserRouter>
      </ThemeProvider>
    </GoogleOAuthProvider>
  );
}

const checkLocalCart = () => {
  const cartData = localStorage.getItem("cart");
  if (!cartData) {
    localStorage.setItem("cart", JSON.stringify({ items: [] }));
    return { items: [] };
  } else {
    const cart = JSON.parse(cartData);
    return cart;
  }
};

function AppContent({ user, setUser, checkingAuth, setCheckingAuth }) {
  const location = useLocation();

  const [cartItems, setCartItems] = useState({
    items: [],
    isLocal: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      const [cartData, userData] = await Promise.all([getCart(), getMe()]);
      if (cartData.status === 200) {
        setCartItems({
          items: cartData.data.items,
          isLocal: false,
        });
      } else {
        setCartItems({
          items: checkLocalCart().items,
          isLocal: true,
        });
      }
      if (userData.status === 200) {
        setUser(userData.data);
        const cart = checkLocalCart();
        if (cart.items.length > 0) {
          const items = cart.items.map((item) => ({
            product_id: item?.product?.id,
            quantity: item.quantity,
          }));
          await updateMultipleProducts(items);
          updateLocalCart({ items: [] });
          setCartItems((prev) => {
            return {
              isLocal: false,
              items: [...prev.items, ...cart.items],
            };
          });
        }
      }
      setCheckingAuth(false);
    };
    fetchData();
  }, [location.pathname, setUser, setCheckingAuth]);

  const [isOpenCart, setIsOpenCart] = useState(false);

  if (checkingAuth) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <Routes>
      {user &&
        user?.permission == 1 &&
        privateRoutes.map((route, index) => {
          let Layout = AdminLayout;
          const Page = route.components;
          return (
            <Route
              key={index}
              path={route.path}
              element={
                <Layout user={user} setUser={setUser}>
                  <Page />
                </Layout>
              }
            />
          );
        })}
      {publicRoutes.map((route, index) => {
        const Page = route.components;
        let Layout = UserLayout;
        return (
          <Route
            key={index}
            path={route.path}
            element={
              <Layout
                user={user}
                setUser={setUser}
                cartItems={cartItems}
                setCartItems={setCartItems}
                setIsOpenCart={setIsOpenCart}
              >
                <Page
                  user={user}
                  setIsOpenCart={setIsOpenCart}
                  cartItems={cartItems}
                  setCartItems={setCartItems}
                />
                <CartSidebar
                  open={isOpenCart}
                  setOpen={setIsOpenCart}
                  cartItems={cartItems}
                  setCartItems={setCartItems}
                />
              </Layout>
            }
          />
        );
      })}
    </Routes>
  );
}
export default App;
