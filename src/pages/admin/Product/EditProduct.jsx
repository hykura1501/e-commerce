import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Check } from "lucide-react";
import routes from "@/config/routes";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProduct, updateProduct } from "@/services/productServices";
import { getAllCategories } from "@/services/categoryServices";
import { getManufacturers } from "@/services/categoryServices";
import SelectCategory from "@/components/SelectCategory";
import ImagePicker from "@/components/ImagePicker";
import capitalFirstLetter from "@/lib/capitalFirstLetter";
import MyAlertDialog from "@/components/MyAlertDialog";
import { useNavigate } from "react-router-dom";


const productTags = ["New", "Featured", "Sale"];

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    product_name: "",
    description: "",
    price: 0,
    stock: 0,
    images: [],
    newImages: [],
    discount: 0,
    category: {},
    manufacturer: {},
    tag: "New",
  });

  const [categories, setCategories] = useState([]);
  const [manufacturer, setManufacturer] = useState([]);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    const fetchData = async (id) => {
      const [productResponse, categoriesResponse, manufacturerResponse] = await Promise.all([
        getProduct(id),
        getAllCategories(),
        getManufacturers(),
      ]);
      if (productResponse.status === 200) {
        setProduct(productResponse.data.product);
      }
      if (categoriesResponse.status === 200) {
        setCategories(categoriesResponse.data.tree_categories);
      }
      if (manufacturerResponse.status === 200) {
        setManufacturer(manufacturerResponse.data.manufacturers);
      }
    };
    fetchData(id);
  }, [id]);

  const handleSelectedCategory = (category_id) => {
    setProduct({ ...product, category: {
      category_id: category_id,
    } });
  };

  const handleSelectedImage = (images) => {
    setProduct((prev) => ({ ...prev, newImages: images }));
  };

  const handleChangeInitialImages = (images) => { 
    setProduct((prev) => ({ ...prev, images: images }));
  }

  const handleSaveProduct = async () => { 
    const formData = new FormData();
    formData.append("product_name", product.product_name);
    formData.append("description", product.description);
    formData.append("price", product.price);
    formData.append("stock", product.stock);
    formData.append("category_id", product.category.category_id);
    formData.append("discount", product.discount);
    product?.newImages?.forEach((image) => {
      formData.append("images", image);
    });
    product?.images?.forEach((image) => {
      formData.append("old_image_urls", image);
    });
    formData.append("tag", product.tag);
    formData.append("manufacturer_id", product.manufacturer.manufacturer_id);
    const response = await updateProduct(formData, id);
    if (response.status === 200) {
      setShowDialog(true);
    } else {
      console.log("Failed to update product");
    }
  }

  const handleContinue = () => { 
    navigate(`${routes.detailProduct}/${id}`);
  }

  return (
    <div className="container mx-auto p-6">
      <MyAlertDialog isShown={showDialog} setIsShown={setShowDialog} handleContinue={handleContinue}/>
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Link to={routes.dashboard} className="hover:text-primary">
              Dashboard
            </Link>
            <span>/</span>
            <Link to={routes.product} className="hover:text-primary">
              Product List
            </Link>
            <span>/</span>
            <span>Edit Product</span>
          </div>
          <h1 className="text-2xl font-semibold">Edit Product</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>General Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="product-name">Product Name</Label>
                <Input
                  id="product-name"
                  value={product?.product_name}
                  onChange={(e) =>
                    setProduct({ ...product, product_name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={product?.description}
                  onChange={(e) =>
                    setProduct({ ...product, description: e.target.value })
                  }
                  className="min-h-[150px]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Product Image */}
          <ImagePicker
            imageName={"Product Image"}
            title={"Media"}
            onChange={handleSelectedImage}
            onChangeInitialImages={handleChangeInitialImages}
            multiple={true}
            image_urls={product?.images}
          />

          <Card>
            <CardHeader>
              <CardTitle>Other Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="base-price">Base Price</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1.5">$</span>
                  <Input
                    id="base-price"
                    value={product?.price}
                    onChange={(e) =>
                      setProduct({ ...product, price: e.target.value })
                    }
                    placeholder="Type base price here..."
                    className="pl-6"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="discount-value">Discount Percentage (%)</Label>
                <Input
                  min="0"
                  type="number"
                  max="100"
                  id="discount-value"
                  value={`${product?.discount * 100}`}
                  onChange={(e) =>
                    setProduct({ ...product, discount: e.target.value / 100 })
                  }
                  placeholder="Type discount percentage..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={product?.stock}
                  onChange={(e) =>
                    setProduct({ ...product, stock: e.target.value })
                  }
                  placeholder="Type product quantity here..."
                  min="0"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Category</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Product Category</Label>
                <SelectCategory
                  categories={categories}
                  label={"Product Category"}
                  onChange={handleSelectedCategory}
                  selectedCategory={product?.category?.category_id?.toString()}
                />
              </div>
              <div className="space-y-2">
                <Label>Product Tags</Label>
                <Select value={capitalFirstLetter(product?.tag)} onValueChange={(value) => setProduct({ ...product, tag: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select tags" />
                  </SelectTrigger>
                  <SelectContent>
                    {productTags.map((tag) => (
                      <SelectItem key={tag} value={tag}>
                        {tag}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Manufacturer</Label>
                <Select
                  value={product?.manufacturer?.manufacturer_id}
                  onValueChange={(value) =>
                    setProduct({ ...product, manufacturer: { manufacturer_id: value } })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select manufacturer" />
                  </SelectTrigger>
                  <SelectContent>
                    {manufacturer.map((manufacturer) => (
                      <SelectItem key={manufacturer.manufacturer_id} value={manufacturer.manufacturer_id}>
                        {manufacturer.manufacturer_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex items-center space-x-2 mt-4">
          <Button variant="ghost" onClick={() => navigate(routes.product)}>
            <X className="h-4 w-4" />
            Cancel
          </Button>
          <Button onClick={handleSaveProduct}>
            <Check className="h-4 w-4" />
            Save Product
          </Button>
        </div>
    </div>
  );
}
