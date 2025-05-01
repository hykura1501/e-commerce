import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Edit } from "lucide-react";
import { Link } from "react-router-dom";
import routes from "@/config/routes";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCategory } from "@/services/categoryServices";

export default function DetailCategory() {
  const { id } = useParams();
  const [category, setCategory] = useState(null);

  useEffect(() => {
    const fetchCategory = async () => {
      const response = await getCategory(id);
      if (response.status === 200) {
        setCategory(response.data.category);
      } else {
        console.error("Error fetching category:", response);
      }
    };

    fetchCategory();
  }, [id]);

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <div className="space-y-1 w-full">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Link to={routes.dashboard} className="hover:text-primary">
              Dashboard
            </Link>
            <span>/</span>
            <Link to={routes.category} className="hover:text-primary">
              Categories
            </Link>
            <span>/</span>
            <span>Category Detail</span>
          </div>
          <div className="flex justify-between space-x-2 items-center w-full">
            <h1 className="text-2xl font-semibold">Category Detail</h1>
            <Link to={`${routes.editCategory}/${id}`}>
              <Button variant="outline" className="mt-2">
                <Edit className="h-4 w-4 mr-2" />
                Edit Category
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Thumbnail</CardTitle>
          </CardHeader>
          <CardContent>
            {category?.thumbnail ? (
              <img
                src={category?.thumbnail}
                alt={category?.category_name}
                className="w-full h-auto rounded-lg"
              />
            ) : (
              <div className="w-full aspect-square bg-muted rounded-lg flex items-center justify-center">
                <span className="text-muted-foreground">No thumbnail</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>General Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <h3 className="font-semibold">Parent Category</h3>
              <p>{category?.super_category_id || "No parent category"}</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">Category Name</h3>
              <p>{category?.category_name}</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">Description</h3>
              <p>{category?.description || "No description provided"}</p>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="flex items-center space-x-2 mt-6">
        <Link to={routes.category}>
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Categories
          </Button>
        </Link>
      </div>
    </div>
  );
}
