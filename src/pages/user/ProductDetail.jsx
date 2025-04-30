import star_full from "@/assets/icon-star-full.png";
import Product from "@/components/Product";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const listItems = [];

for (let i = 0; i < 5; i++) {
  listItems.push(
    <span key={i}>
      <img src={star_full} />
    </span>
  );
}

import { useState } from "react";
import { getProduct } from "@/services/productServices";
import { getProductReviews } from "@/services/reviewServices";

import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Minus, Plus, Star, StarHalf } from "lucide-react";
import ProductStatus from "@/components/ProductStatus";
import ProductTag from "@/components/ProductTag";
import { Badge } from "@/components/ui/badge";
import ProductReview from "@/components/ReviewItem";
import { createReview } from "@/services/reviewServices";
import { addToCart, getCart } from "@/services/cartServices";
import updateLocalCart from "@/lib/updateCart";
const ProductDetail = ({ user, setIsOpenCart, setCartItems, cartItems }) => {
  const { id } = useParams();

  const [reviews, setReviews] = useState([]);

  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = searchParams.get("page") || 1;

  const [product, setProduct] = useState({});

  const [paging, setPaging] = useState({
    totalPages: 0,
    pageSize: 4,
    totalItems: 0,
  });

  useEffect(() => {
    const fetchData = async (id, currentPage, pageSize) => {
      const [productData, reviewsData] = await Promise.all([
        getProduct(id),
        getProductReviews({
          id: id,
          page: currentPage,
          size: pageSize,
        }),
      ]);
      if (productData.status === 200) {
        
        setProduct(productData.data.product);
      }
      if (reviewsData.status === 200) {
        setReviews(reviewsData.data.reviews);
        setPaging({
          totalPages: reviewsData.data.paging.total_page,
          pageSize: reviewsData.data.paging.page_size,
          totalItems: reviewsData.data.paging.total_item,
        });
      }
    };
    fetchData(id, currentPage, paging.pageSize);
  }, [currentPage, id]);

  const [newReview, setNewReview] = useState("");
  const [newRating, setNewRating] = useState(0);

  const handleAddReview = async () => {
    if (newReview.trim() && newRating > 0) {
      const newReviewObj = {
        content: newReview,
        rating: newRating,
        product_id: id,
      };

      const response = await createReview(newReviewObj);

      if (response.status === 201) {
        setReviews([
          ...reviews,
          {
            id: 10,
            content: newReview,
            rating: newRating,
            posted_at: new Date().toISOString(),
            user: {
              fullname: user?.fullname,
              avatar: user?.avatar,
            },
          },
          ,
        ]);
        setNewReview("");
        setNewRating(0);
      }
    }
  };

  const handleAddToCart = async () => {
    if (cartItems?.isLocal) {
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
                name: product?.name,
                price: product?.price,
                discount: product?.discount,
                images: [product?.images[0]?.image_url],
                tag: product?.tag,
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
    const response = await addToCart(parseInt(id));

    if (response.status === 200) {
      const cart = await getCart();
      setCartItems({ items: cart.data.cart, isLocal: false });
      setIsOpenCart(true);
    }
  };

  return (
    <div
      className={` px-[130px] 
       dark:bg-gray-900 dark:text-white bg-white text-black
      `}
    >
      <div className="flex flex-col gap-5 my-5">
        <h1 className="text-2xl font-bold">Product Detail</h1>
      </div>
      <Card>
        <div className="my-8 grid grid-cols-3">
          <div className="flex items-center justify-center">
            <Carousel
              opts={{
                align: "start",
              }}
              className="w-full max-w-sm mx-14"
            >
              <CarouselContent>
                {product?.images?.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="p-1">
                      <Card>
                        <CardContent className="flex aspect-square items-center justify-center p-6">
                          <img
                            src={image}
                            alt={`Product image ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
          <Card className="mr-10 col-span-2">
            <CardHeader>
              <CardTitle>Product Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Product Name</h3>
                <div className="flex items-center space-x-2">
                  <p>{product?.name}</p>
                  <ProductTag tag={product?.tag} />
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p>{product?.description}</p>
              </div>
              <div className="flex items-start gap-20">
                <div>
                  <h3 className="font-semibold mb-2">Price</h3>
                  <p className="text-2xl font-bold">${product?.price}</p>
                  {product?.discount > 0 && (
                    <p className="text-sm text-muted-foreground">
                      {parseFloat(product?.discount) * 100}% off
                    </p>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Quantity in Stock</h3>
                  <p>{product?.stock}</p>
                </div>
              </div>
              <div className="flex items-center gap-20">
                <div>
                  <h3 className="font-semibold mb-2">Category</h3>
                  <Badge>{product?.category?.category_name}</Badge>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Manufacturer</h3>
                  <Badge className="bg-green-600 hover:bg-green-400">
                    {product?.manufacturer?.manufacturer_name}
                  </Badge>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Status</h3>
                  <ProductStatus stock={product?.stock} />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Button onClick={handleAddToCart}>+ Add to cart</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </Card>
      <div className="grid grid-cols-2"></div>
      {product?.relatedProducts?.length > 0 && (
        <div>
          <div className="font-bold text-3xl mt-5">Related Products</div>
          <div className="grid grid-cols-4 gap-10 mt-5 h-auto">
            {product?.relatedProducts?.map((item) => (
              <Product
                cartItems={cartItems}
                setCartItems={setCartItems}
                setIsOpenCart={setIsOpenCart}
                key={item?.id}
                id={item?.id}
                name={item?.name}
                price={item?.price}
                image={item?.images[0].image_url}
                discount={item?.discount}
                tag={item?.tag}
              />
            ))}
          </div>
        </div>
      )}
      <Card className="mt-5 dark:bg-gray-800 dark:text-white">
        <CardHeader>
          <CardTitle>Product Reviews</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          {reviews?.length ? (
            reviews?.map((review, index) => (
              <div key={index} className="space-y-2">
                <ProductReview review={review} />
              </div>
            ))
          ) : (
            <p className="dark:text-gray-400">No reviews available</p>
          )}
        </CardContent>
        <div className="space-y-4 p-4 border rounded-md dark:border-gray-700">
          <h3 className="text-lg font-bold">Add a Review</h3>
          <textarea
            value={newReview}
            onChange={(e) => setNewReview(e.target.value)}
            placeholder="Write your review here..."
            className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
          />
          <div className="flex items-center space-x-4">
            <label htmlFor="rating" className="font-medium dark:text-white">
              Rating:
            </label>
            <select
              id="rating"
              value={newRating}
              onChange={(e) => setNewRating(Number(e.target.value))}
              className="p-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
            >
              <option value="0">Select Rating</option>
              {[1, 2, 3, 4, 5].map((rate) => (
                <option key={rate} value={rate}>
                  {rate} Star{rate > 1 && "s"}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={handleAddReview}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500"
          >
            Submit
          </button>
        </div>
        {paging.totalPages > 1 && (
          <div className="p-4 border-t border-border flex items-center justify-between dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage == 1}
                onClick={() =>
                  setSearchParams({ page: parseInt(currentPage) - 1 })
                }
              >
                Previous
              </Button>
              {[...Array(paging.totalPages).keys()].map((page) => {
                return (
                  <Button
                    key={page}
                    variant="outline"
                    size="sm"
                    className={
                      currentPage == page + 1
                        ? "bg-primary text-primary-foreground"
                        : ""
                    }
                    onClick={() => {
                      setSearchParams({ page: page + 1 });
                    }}
                  >
                    {page + 1}
                  </Button>
                );
              })}
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage == paging.totalPages}
                onClick={() =>
                  setSearchParams({ page: parseInt(currentPage) + 1 })
                }
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ProductDetail;
