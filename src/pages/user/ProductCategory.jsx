import ProductStatus from "@/components/ProductStatus";
import ProductTag from "@/components/ProductTag";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getProductsByCategory } from "@/services/categoryServices";
import { useEffect, useState } from "react";

import { Link, useParams } from "react-router-dom";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useSearchParams } from "react-router-dom";
import routes from "@/config/routes";
import { Button } from "@/components/ui/button";
import { addToCart, getCart } from "@/services/cartServices";
import updateLocalCart from "@/lib/updateCart";

export default function ProductCategory({
  setIsOpenCart,
  setCartItems,
  cartItems,
}) {
  const { id } = useParams();

  const [paging, setPaging] = useState({
    totalPages: 0,
    pageSize: 8,
    totalItems: 0,
  });

  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = searchParams.get("page") || 1;

  const [products, setProducts] = useState([]);
  useEffect(() => {
    const fetchProducts = async (id, currentPage, pageSize) => {
      const response = await getProductsByCategory(id, currentPage, pageSize);
      if (response.status === 200) {
        setProducts(response.data.products);
        setPaging({
          totalPages: response.data.paging.total_pages,
          pageSize: response.data.paging.per_page,
          totalItems: response.data.paging.total_items,
        });
      }
    };
    fetchProducts(id, currentPage, paging.pageSize);
  }, [id, currentPage]);

  const handleAddToCart = async (product) => {
    if (cartItems.isLocal) {
      const isExisted = cartItems?.items?.some(
        (item) => item.product.id == product.product_id
      );
      setCartItems((prev) => {
        let newItems;
        if (isExisted) {
          newItems = prev.items.map((item) => {
            if (item.product.id == product.product_id) {
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
                id: product.product_id,
                name: product.product_name,
                price: product.price,
                discount: product.discount,
                images: [product.images[0]],
                tag: product.tag,
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

    const response = await addToCart(product.product_id);
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
    <div className="container mx-auto px-[50px]">
      <h1 className="text-3xl font-semibold mb-4">Product</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products?.map((product) => (
          <Link
            to={`${routes.productDetail}/${product?.product_id}`}
            key={product?.product_id}
            className="h-full"
          >
            <Card
              key={product?.id}
              className="flex flex-col justify-center gap-2 h-full"
            >
              <CardHeader>
                <div className="relative h-48 w-full mb-4 flex justify-center">
                  <img
                    src={product?.images[0]}
                    alt={product?.product_name}
                    className="rounded-t-lg"
                  />
                </div>
                <div>
                  <CardTitle className="text-xl font-semibold">
                    {product?.product_name}
                  </CardTitle>
                  <ProductTag tag={product?.tag} />
                </div>
              </CardHeader>
              <CardContent>
                {/* <p className="text-sm text-gray-600 mb-2">
                  {product?.description}
                </p> */}
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-lg">
                    ${(product?.price * (1 - product?.discount)).toFixed(2)}
                  </span>
                  {product?.discount > 0 && (
                    <span className="text-sm text-gray-500 line-through">
                      ${product?.price}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 mb-2">
                  <Badge variant="outline">{product?.category?.category_id}</Badge>
                </div>
                <p className="text-sm text-gray-600">
                  Manufacturer: {product?.manufacturer?.manufacturer_name}
                </p>
                <p className="text-sm text-gray-600">Stock: {product?.stock}</p>
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  {product?.discount > 0 && (
                    <Badge variant="destructive" className="mr-2">
                      -{product?.discount * 100}%
                    </Badge>
                  )}
                  <ProductStatus stock={product?.stock} />
                </div>
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    handleAddToCart(product);
                  }}
                >
                  + Add to cart
                </Button>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
      {paging.totalPages > 1 && (
        <Pagination className="mt-8">
          <PaginationContent>
            <PaginationItem className="cursor-pointer">
              <PaginationPrevious
                onClick={() =>
                  setSearchParams({ page: parseInt(currentPage) - 1 })
                }
                aria-disabled={currentPage <= 1}
                tabIndex={currentPage <= 1 ? -1 : undefined}
                className={
                  currentPage <= 1
                    ? "pointer-events-none opacity-50"
                    : undefined
                }
              />
            </PaginationItem>
            {[...Array(paging.totalPages).keys()].map((page) => (
              <PaginationItem key={page} className="cursor-pointer">
                <PaginationLink
                  onClick={() => {
                    setSearchParams({ page: page + 1 });
                  }}
                  isActive={currentPage == page + 1}
                >
                  {page + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem className="cursor-pointer">
              <PaginationNext
                onClick={() =>
                  setSearchParams({ page: parseInt(currentPage) + 1 })
                }
                aria-disabled={currentPage >= paging.totalPages}
                tabIndex={currentPage >= paging.totalPages ? -1 : undefined}
                className={
                  currentPage >= paging.totalPages
                    ? "pointer-events-none opacity-50"
                    : undefined
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
