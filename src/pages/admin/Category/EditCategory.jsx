import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save } from 'lucide-react';
import { Link } from "react-router-dom";
import routes from "@/config/routes";
import React, { useEffect, useState } from "react";
import ImagePicker from "@/components/ImagePicker";
import SelectCategory from "@/components/SelectCategory";
import { getAllCategories, getCategory, updateCategory } from "@/services/categoryServices";
import { useNavigate, useParams } from "react-router-dom";

export default function EditCategory() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState({
    super_category_id: 0,
    category_name: "",
    description: "",
    thumbnail: [],
    thumbnail_url: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      const [categoriesResponse, categoryResponse] = await Promise.all([
        getAllCategories(),
        getCategory(id)
      ]);

      if (categoryResponse.status === 200) {
        setCategory({
          ...categoryResponse.data.category,
          thumbnail: [categoryResponse.data.category.thumbnail]
        });
      }

      if (categoriesResponse.status === 200) {
        setCategories(categoriesResponse.data.tree_categories);
      }
    };

    fetchData();
  }, [id]);

  const handleSelectedCategory = (category_id) => {
    setCategory({ ...category, super_category_id: category_id });
  };

  const handleSelectedImage = (images) => {
    setCategory({ ...category, thumbnail_url: images[0], thumbnail: [] });
  };

  const handleUpdateCategory = async () => {
    const formData = new FormData();
    formData.append("thumbnail", category.thumbnail[0]);
    if (category.thumbnail_url) { 
      formData.append("thumbnail", category.thumbnail_url);
    }

    if (category.super_category_id && category.super_category_id != 0) { 
      formData.append("super_category_id", category.super_category_id);
    }

    formData.append("category_name", category.category_name);
    formData.append("description", category.description);
    
    const response = await updateCategory(id, formData);
    if (response.status === 200) {
      navigate(`${routes.detailCategory}/${id}`);
    } else {
      console.error("Error updating category:", response);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Link to={routes.dashboard} className="hover:text-primary">
              Dashboard
            </Link>
            <span>/</span>
            <Link to={routes.category} className="hover:text-primary">
              Categories
            </Link>
            <span>/</span>
            <span>Edit Category</span>
          </div>
          <h1 className="text-2xl font-semibold">Edit Category</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ImagePicker
          title="Thumbnail"
          imageName="Photo"
          multiple={false}
          onChange={handleSelectedImage}
          image_urls={category?.thumbnail}
        />

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>General Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="parent-category">Parent Category</Label>
              <SelectCategory
                categories={categories}
                label="Select super category"
                selectedCategory={category?.super_category_id ? category.super_category_id?.toString() : "0"}
                onChange={handleSelectedCategory}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category-name">Category Name</Label>
              <Input
                id="category-name"
                placeholder="Type category name here..."
                value={category?.category_name}
                onChange={(e) =>
                  setCategory({ ...category, category_name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Type category description here..."
                className="min-h-[150px]"
                value={category?.description || ""}
                onChange={(e) =>
                  setCategory({ ...category, description: e.target.value })
                }
              />
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="flex items-center space-x-2 mt-6">
        <Link to={routes.category}>
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Cancel
          </Button>
        </Link>
        <Button onClick={handleUpdateCategory}>
          <Save className="h-4 w-4 mr-2" />
          Update Category
        </Button>
      </div>
    </div>
  );
}

