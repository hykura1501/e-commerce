import { useState, useEffect } from "react";
import SideBar from "@/layouts/users/components/SideBar";
import icon_service1 from "@/assets/icon-service-car.png";
import icon_service2 from "@/assets/icon-service-contact.png";
import icon_service3 from "@/assets/icon-service-security.png";

import { getHomeProducts } from "@/services/productServices";
import { FullWidthCarousel } from "@/components/FullWidthCarousel";

const Home = ({ setIsOpenCart, setCartItems, cartItems }) => {
  const [homeProducts, setHomeProducts] = useState({});

  useEffect(() => {
    const fetchHomeProducts = async (max) => {
      const response = await getHomeProducts(max);
      if (response.status === 200) {
        setHomeProducts(response.data.products);
      }
    };
    fetchHomeProducts(10);
  }, []);

  return (
    <div className="max-w-full mx-auto px-[50px] py-12 dark:bg-gray-900 dark:text-white bg-gray-50">
      <>
        <SideBar />
      </>
      <div className="flex justify-between items-center mb-8">
        <div className="space-y-4">
          <div className="flex items-center gap-20">
            <h2 className="text-3xl font-semibold dark:text-white text-gray-900">
              Best Selling Product
            </h2>
          </div>
        </div>
      </div>

      <div>
        <FullWidthCarousel
          products={homeProducts?.best_seller}
          setIsOpenCart={setIsOpenCart}
          setCartItems={setCartItems}
          cartItems={cartItems}
        />
      </div>

      <div className="flex justify-between items-center my-8">
        <div className="space-y-4">
          <div className="flex items-center gap-20">
            <h2 className="text-3xl font-semibold dark:text-white text-gray-900">
              Discounted Products
            </h2>
          </div>
        </div>
      </div>
      <div>
        <FullWidthCarousel
          setIsOpenCart={setIsOpenCart}
          setCartItems={setCartItems}
          products={homeProducts?.highest_discount}
          cartItems={cartItems}
        />
      </div>

      <div className="flex justify-between items-center my-8">
        <div className="space-y-4">
          <div className="flex items-center gap-20">
            <h2 className="text-3xl font-semibold dark:text-white text-gray-900">
              New Arrivals
            </h2>
          </div>
        </div>
      </div>

      <div>
        <FullWidthCarousel
          setIsOpenCart={setIsOpenCart}
          setCartItems={setCartItems}
          products={homeProducts?.new_arrival}
          cartItems={cartItems}
        />
      </div>

      <div className="flex justify-between items-center my-8">
        <div className="space-y-4">
          <div className="flex items-center gap-20">
            <h2 className="text-3xl font-semibold dark:text-white text-gray-900">
              Featured Products
            </h2>
          </div>
        </div>
      </div>

      <div>
        <FullWidthCarousel
          setIsOpenCart={setIsOpenCart}
          setCartItems={setCartItems}
          products={homeProducts?.featured}
          cartItems={cartItems}
        />
      </div>

      {/* Services Section */}
      <div className="flex mt-14 items-center mb-10 justify-evenly dark:text-white">
        {[
          {
            icon: icon_service1,
            title: "FREE AND FAST DELIVERY",
            description: "Free delivery for all orders over $140",
          },
          {
            icon: icon_service2,
            title: "24/7 CUSTOMER SERVICE",
            description: "Friendly 24/7 customer support",
          },
          {
            icon: icon_service3,
            title: "MONEY BACK GUARANTEE",
            description: "We return money within 30 days",
          },
        ].map((service, index) => (
          <div key={index} className="flex flex-col items-center gap-2">
            <img src={service.icon} alt={service.title} />
            <h3 className="text-xl font-semibold">{service.title}</h3>
            <p className="dark:text-gray-300">{service.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
