import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link } from "react-router-dom";
import routes from "@/config/routes";
import {
  getAllCategories,
  deleteCategory as apiDeleteCategory,
} from "@/services/categoryServices";
import formatDate from "@/lib/formatDate";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  ChevronDown,
  ChevronRight,
  Download,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";
import { AlertDialogDescription } from "@radix-ui/react-alert-dialog";

const CategoryRow = ({ category, level, handleDeleteCategory }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      <TableRow>
        <TableCell>
          <input type="checkbox" className="rounded border-input" />
        </TableCell>
        <TableCell>
          <div
            className="flex items-center gap-3"
            style={{ paddingLeft: `${level * 24}px` }}
          >
            {category?.children?.length > 0 && (
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            )}
            {!category?.children?.length && <div className="w-4" />}
            <img
              src={category?.thumbnail}
              alt={category?.name}
              className="w-8 h-8"
            />
            <div>
              <div className="font-medium">{category.name}</div>
              <div className="text-sm text-muted-foreground">
                {category.description}
              </div>
            </div>
          </div>
        </TableCell>
        {/* <TableCell>{category?.sales?.toLocaleString()}</TableCell> */}
        <TableCell>{category?.product_in_category}</TableCell>
        <TableCell>{formatDate(category?.created_at)}</TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            <Link to={`${routes.detailCategory}/${category.category_id}`}>
              <Button variant="ghost" size="icon">
                <Eye className="h-4 w-4" />
              </Button>
            </Link>
            <Link to={`${routes.editCategory}/${category.category_id}`}>
              <Button variant="ghost" size="icon">
                <Pencil className="h-4 w-4" />
              </Button>
            </Link>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="flex flex-col items-center">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-xl">
                    Are you sure you want to delete this category?
                  </AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogDescription></AlertDialogDescription>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleDeleteCategory(category.category_id)}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </TableCell>
      </TableRow>
      {isExpanded &&
        category?.children?.map((child) => (
          <CategoryRow
            key={child.category_id}
            category={child}
            level={level + 1}
            handleDeleteCategory={handleDeleteCategory}
          />
        ))}
    </>
  );
};

export default function Category() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await getAllCategories();
      if (response.status === 200) {
        setCategories(response.data.tree_categories);
      }
    };

    fetchCategories();
  }, []);

  const deleteCategory = async (categoryId) => {
    try {
      const response = await apiDeleteCategory(categoryId);
      const updatedCategories = removeCategoryById(categories, categoryId);
      setCategories(updatedCategories);
    } catch (error) {
      console.error("Failed to delete category:", error);
    }
  };

  const removeCategoryById = (categories, categoryId) => {
    return categories
      .filter((category) => category.category_id !== categoryId)
      .map((category) => ({
        ...category,
        children: removeCategoryById(category.children || [], categoryId),
      }));
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <span>Dashboard</span>
            <span>/</span>
            <span>Categories</span>
          </div>
          <h1 className="text-2xl font-semibold">Categories</h1>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          {/* <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button> */}
          <Link to={routes.addCategory} className="btn btn-primary">
            <Button>+ Add Category</Button>
          </Link>
        </div>
      </div>
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <input type="checkbox" className="rounded border-input" />
              </TableHead>
              <TableHead>Category</TableHead>
              {/* <TableHead>Sales</TableHead> */}
              <TableHead>No. Products</TableHead>
              <TableHead>Added</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <CategoryRow
                key={category.category_id}
                category={category}
                level={0}
                handleDeleteCategory={deleteCategory}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
