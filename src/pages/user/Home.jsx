import { useState, useEffect } from "react";
import SideBar from "@/layouts/users/components/SideBar";
import icon_service1 from "@/assets/icon-service-car.png";
import icon_service2 from "@/assets/icon-service-contact.png";
import icon_service3 from "@/assets/icon-service-security.png";
import { useDarkMode } from "@/components/DarkModeContext";

import { getHomeProducts } from "@/services/productServices";
import { FullWidthCarousel } from "@/components/FullWidthCarousel";

const Home = () => {
  const { darkMode } = useDarkMode();

  const [homeProducts, setHomeProducts] = useState({});

  useEffect(() => {
    const fetchHomeProducts = async (max) => {
      const response = await getHomeProducts(max);
      if (response.status === 200) {
        setHomeProducts(response.data);
      }
    };
    fetchHomeProducts(10);
  }, []);

  return (
    <div
      className={`max-w-full mx-auto px-[50px] py-12 ${
        darkMode ? "bg-gray-900 text-white" : ""
      }`}
    >
      <>
        <SideBar />
      </>
      <div className="flex justify-between items-center mb-8">
        <div className="space-y-4">
          <div className="flex items-center gap-20">
            <h2
              className={`text-3xl font-semibold ${
                darkMode ? "text-white" : ""
              }`}
            >
              Best Selling Product
            </h2>
          </div>
        </div>
      </div>

      <div>
        <FullWidthCarousel products={homeProducts?.bestSellingProducts} />
      </div>

      <div className="flex justify-between items-center my-8">
        <div className="space-y-4">
          <div className="flex items-center gap-20">
            <h2
              className={`text-3xl font-semibold ${
                darkMode ? "text-white" : ""
              }`}
            >
              Discounted Products
            </h2>
          </div>
        </div>
      </div>
      <div>
        <FullWidthCarousel products={homeProducts?.highestDiscountProducts} />
      </div>

      <div className="flex justify-between items-center my-8">
        <div className="space-y-4">
          <div className="flex items-center gap-20">
            <h2
              className={`text-3xl font-semibold ${
                darkMode ? "text-white" : ""
              }`}
            >
              New Arrivals
            </h2>
          </div>
        </div>
      </div>

      <div>
        <FullWidthCarousel products={homeProducts?.newProducts} />
      </div>

      <div className="flex justify-between items-center my-8">
        <div className="space-y-4">
          <div className="flex items-center gap-20">
            <h2
              className={`text-3xl font-semibold ${
                darkMode ? "text-white" : ""
              }`}
            >
              Featured Products
            </h2>
          </div>
        </div>
      </div>

      <div>
        <FullWidthCarousel products={homeProducts?.featuredProducts} />
      </div>

      {/* Services Section */}
      <div
        className={`flex mt-14 items-center mb-10 justify-evenly ${
          darkMode ? "text-white" : ""
        }`}
      >
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
            <p className={darkMode ? "text-gray-300" : ""}>
              {service.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
