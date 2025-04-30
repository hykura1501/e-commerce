import { Link } from "react-router-dom";
import ProductTag from "./ProductTag";
import routes from "@/config/routes";
import { Card } from "./ui/card";
import { addToCart, getCart } from "@/services/cartServices";
import updateLocalCart from "@/lib/updateCart";

const Product = ({
  cartItems,
  setCartItems,
  setIsOpenCart,
  id,
  name,
  price,
  discount,
  image,
  tag,
  ...props
}) => {
  const handleAddToCart = async () => {
    if (cartItems.isLocal) {
      const isExisted = cartItems?.items?.some((item) => item.product.id == id);
      setCartItems((prev) => {
        let newItems;
        if (isExisted) {
          newItems = prev.items.map((item) => {
            if (item.product.id == id) {
              return {
                ...item,
                quantity: item.quantity + 1,
              };
            }
            return item;
          });
        } else {
          newItems = [
            ...prev.items,
            {
              product: {
                id,
                name,
                price,
                discount,
                images: [image],
                tag,
              },
              quantity: 1,
            },
          ];
        }
        updateLocalCart({ items: newItems });
        return { items: newItems, isLocal: true };
      });
      setIsOpenCart(true);
      return;
    }

    const response = await addToCart(id);

    if (response.status === 200) {
      const cart = await getCart();
      setCartItems({
        items: cart.data.cart,
        isLocal: false,
      });
      setIsOpenCart(true);
    }
  };

  return (
    <Link
      to={`${routes.productDetail}/${id}`}
      className="cursor-pointer min-w-[300px] flex flex-col gap-2 w-full"
    >
      <Card className="flex flex-col justify-center items-center w-full h-full group relative dark:bg-gray-800 dark:text-white bg-white">
        <span className="absolute top-3 left-3">
          {discount && (
            <button className="bg-[#DB4444] text-white px-2 py-1 rounded-md">
              {`-${discount * 100}%`}
            </button>
          )}
        </span>
        <span className="absolute top-3 right-3">
          <ProductTag tag={tag} />
        </span>
        <div className="group overflow-hidden flex justify-center p-8">
          <img src={image} alt={name} />
        </div>

        <div className="flex flex-col p-4 gap-3 w-full">
          <div className="flex justify-between items-center">
            <h1 className="text-lg font-medium dark:text-white">{name}</h1>
            <div className="flex flex-col items-end">
              <span className="text-lg font-bold">${price}</span>
              {discount && (
                <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                  ${(price / (1 - discount)).toFixed(2)}
                </span>
              )}
            </div>
          </div>

          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={(e) => {
                e.preventDefault();
                handleAddToCart();
              }}
              className="bg-black text-white py-2 rounded-md hover:bg-gray-800 duration-300 w-full dark:hover:bg-gray-600"
            >
              Add to cart
            </button>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default Product;
