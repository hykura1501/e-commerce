import { Suspense, useEffect, useState } from "react";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { SelectGroup, SelectLabel } from "@/components/ui/select";

import { useSearchParams } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { DualRangeSlider } from "@/components/ui/DualRangeSlider";
import { getAllCategories } from "@/services/categoryServices";
import { getProducts } from "@/services/productServices";
import capitalFirstLetter from "@/lib/capitalFirstLetter";
import Product from "@/components/Product";

export default function SearchPage({ setIsOpenCart, setCartItems, cartItems }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const [values, setValues] = useState([0, 2000]);

  const [categories, setCategories] = useState([]);

  const [products, setProducts] = useState([]);

  const keyword = searchParams.get("keyword");

  const currentPage = searchParams.get("page") || 1;

  const price_min = searchParams.get("price_min") || 0;

  const price_max = searchParams.get("price_max") || 1000;

  const category_id = searchParams.get("category_id") || "";

  const tag = searchParams.get("tag") || "";

  const order = searchParams.get("order") || "";

  const [paging, setPaging] = useState({
    pageSize: 6,
    totalItems: 0,
    totalPages: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      const [categoriesData, productData] = await Promise.all([
        getAllCategories(),
        getProducts({
          page: currentPage,
          per_page: paging.pageSize,
          search: keyword,
          price_max,
          price_min,
          category_id,
          tag,
          order
        }),
      ]);
      if (categoriesData.status === 200) {
        setCategories(categoriesData.data.categories);
      }
      if (productData.status === 200) {
        setProducts(productData.data.products);
        setPaging({
          pageSize: productData.data.paging.per_page,
          totalItems: productData.data.paging.total_items,
          totalPages: productData.data.paging.total_pages,
        });
      }
    };
    fetchData();
  }, [keyword, currentPage, price_min, price_max, category_id, tag, order]);

  const applyPriceFilter = () => {
    const params = new URLSearchParams(searchParams);
    params.set("price_min", values[0]);
    params.set("price_max", values[1]);
    setSearchParams(params);
  };

  return (
    <div className="container mx-auto px-[70px] py-8">
      <h1 className="text-3xl font-bold mb-8">Product Search</h1>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        <div className="md:col-span-1">
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-2">Price Range</h2>
              <DualRangeSlider
                className="mt-10"
                label={(value) => value}
                value={values}
                onValueChange={setValues}
                min={0}
                max={2000}
                step={5}
              />
              <Button className="w-full mt-5" onClick={applyPriceFilter}>
                Apply
              </Button>
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-2">Tags</h2>
              <div className="space-y-2">
                <RadioGroup
                  value={tag}
                  onValueChange={(value) => {
                    const params = new URLSearchParams(searchParams);
                    params.set("tag", value);
                    setSearchParams(params);
                  }}
                >
                  {["new", "sale", "featured"].map((item) => {
                    return (
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value={item} id={item} />
                        <Label htmlFor={item}>{capitalFirstLetter(item)}</Label>
                      </div>
                    );
                  })}
                </RadioGroup>
              </div>
            </div>
            <div className="w-full">
              <h2 className="text-lg font-semibold mb-2">Category</h2>
              <Select
                className="w-full"
                value={category_id}
                onValueChange={(value) => {
                  const params = new URLSearchParams(searchParams);
                  if (value === "All") {
                    params.delete("category_id");
                  } else {
                    params.set("category_id", value);
                  }
                  setSearchParams(params);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Category</SelectLabel>
                    <SelectItem value="All" key={""}>
                      All
                    </SelectItem>
                    {categories?.map((category) => (
                      <SelectItem
                        key={category?.category_id}
                        value={`${category?.category_id}`}
                      >
                        {category?.category_name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <Button
              className="w-full"
              onClick={() => {
                const params = new URLSearchParams(searchParams);
                params.delete("price_min");
                params.delete("price_max");
                params.delete("category_id");
                params.delete("tag");
                setSearchParams(params);
              }}
            >
              Clear Filters
            </Button>
          </div>
        </div>
        <div className="md:col-span-4">
          <div className="mb-4 items-end">
            <Select
              onValueChange={(value) => {
                const params = new URLSearchParams(searchParams);
                params.set("order", value);
                setSearchParams(params);
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price_asc">Price: Low to High</SelectItem>
                <SelectItem value="price_desc">Price: High to Low</SelectItem>
                <SelectItem value="product_name_asc">Name: A to Z</SelectItem>
                <SelectItem value="product_name_desc">Name: Z to A</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Suspense fallback={<div>Loading products...</div>}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products?.map((product) => (
                <Product
                  key={product.product_id}
                  cartItems={cartItems}
                  setCartItems={setCartItems}
                  setIsOpenCart={setIsOpenCart}
                  id={product?.product_id}
                  name={product?.product_name}
                  price={product?.price}
                  image={product?.images[0]}
                  discount={product?.discount}
                  tag={product?.tag}
                />
              ))}
            </div>
          </Suspense>
          {paging.totalPages > 1 && (
            <div className="p-4 border-t border-border flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                {`Showing ${(currentPage - 1) * paging.pageSize + 1}-${(currentPage - 1) * paging.pageSize + products.length
                  } from ${paging.totalItems} products`}
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage == 1}
                  onClick={() => {
                    const params = new URLSearchParams(searchParams);
                    params.set("page", parseInt(currentPage) - 1);
                    setSearchParams(params);
                  }}
                >
                  Previous
                </Button>

                {[...Array(paging.totalPages).keys()].map((page) => (
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
                      const params = new URLSearchParams(searchParams);
                      params.set("page", page + 1); // Cập nhật tham số page
                      setSearchParams(params);
                    }}
                  >
                    {page + 1}
                  </Button>
                ))}

                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage == paging.totalPages}
                  onClick={() => {
                    const params = new URLSearchParams(searchParams);
                    params.set("page", parseInt(currentPage) + 1); // Cập nhật tham số page
                    setSearchParams(params);
                  }}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
