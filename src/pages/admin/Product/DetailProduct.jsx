import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { Edit } from "lucide-react";
import routes from "@/config/routes";
import { Link, useSearchParams } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProduct } from "@/services/productServices";
import ProductStatus from "@/components/ProductStatus";
import { getProductReviews } from "@/services/reviewServices";
import ProductReview from "@/components/ReviewItem";
import ProductTag from "@/components/ProductTag";

export default function DetailProduct() {
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const [reviews, setReviews] = useState([]);

  const [paging, setPaging] = useState({
    totalPages: 0,
    size: 5,
    totalItems: 0,
  });

  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = parseInt(searchParams.get("page")) || 1;
  useEffect(() => {
    const fetchData = async (id, currentPage, size) => {
      const [productData, reviewsData] = await Promise.all([
        getProduct(id),
        getProductReviews({
          id,
          page: currentPage,
          size,
        }),
      ]);
      if (productData.status === 200) {
        setProduct(productData.data.product);
      }
      if (reviewsData.status === 200) {
        setReviews(reviewsData.data.reviews);
        setPaging({
          totalPages: reviewsData.data.paging.total_page,
          size: reviewsData.data.paging.page_size,
          totalItems: reviewsData.data.paging.total_item,
        });
      }
    };
    fetchData(id, currentPage, paging.size);
  }, [id, currentPage, paging.size]);

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-3">
            <Link to={routes.dashboard} className="hover:text-primary">
              Dashboard
            </Link>
            <span>/</span>
            <Link to={routes.product} className="hover:text-primary">
              Product List
            </Link>
            <span>/</span>
            <span>Product Details</span>
          </div>
          <h1 className="text-3xl font-bold">{product?.product_name}</h1>
        </div>
        <Link to={`${routes.editProduct}/${id}`}>
          <Button variant="outline">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Images</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center">
                <Carousel
                  opts={{
                    align: "start",
                  }}
                  className="w-full max-w-sm"
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
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Product Reviews</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {reviews.length ? (
                reviews.map((review, index) => (
                  <div key={index} className="space-y-2">
                    <ProductReview review={review} />
                  </div>
                ))
              ) : (
                <p>No reviews available</p>
              )}
            </CardContent>
            {paging.totalPages > 1 && (
              <div className="p-4 border-t border-border flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => setSearchParams({ page: currentPage - 1 })}
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
                          currentPage === page + 1
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
                    disabled={currentPage === paging.totalPages}
                    onClick={() => setSearchParams({ page: currentPage + 1 })}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>

        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Product Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Product Name</h3>
                <div className="flex items-center space-x-2">
                  <p>{product?.product_name}</p>
                  <ProductTag tag={product?.tag}/>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p>{product?.description}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Price</h3>
                <p className="text-2xl font-bold">${product?.price}</p>
                {parseFloat(product?.discount) && (
                  <p className="text-sm text-muted-foreground">
                    {parseFloat(product?.discount) * 100}% off
                  </p>
                )}
              </div>
              <div>
                <h3 className="font-semibold mb-2">Quantity in Stock</h3>
                <p>{product?.stock}</p>
              </div>
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
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
