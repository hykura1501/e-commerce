import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Eye,
  Pencil,
  Trash2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Link } from "react-router-dom";
import routes from "@/config/routes";
import { getProducts, deleteProduct } from "@/services/productServices";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import formatDate from "@/lib/formatDate";
import ProductStatus from "@/components/ProductStatus";
import MyAlertDialog from "@/components/MyAlertDialog";
import useDebounce from "@/hooks/useDebounce";
import { MyPagination } from "@/components/Pagination";
export default function ProductsPage() {
  const [products, setProducts] = useState([]);

  const [searchParams, setSearchParams] = useSearchParams();

  const [paging, setPaging] = useState({
    totalPages: 0,
    pageSize: 15,
    totalItems: 0,
  });

  let currentPage = parseInt(searchParams.get("page")) || 1;

  const order = searchParams.get("order") || "";

  const [search, setSearch] = useState(searchParams.get("search") || "");

  const debounceSearchValue = useDebounce(search, 500);

  useEffect(() => {
    const fetchProducts = async ({ page, per_page, search }) => {
      const response = await getProducts({
        page,
        per_page,
        search,
        order: order,
      });
      if (response.status === 200) {
        setProducts(response.data.products);
        setPaging({
          totalPages: response.data.paging.total_pages,
          pageSize: response.data.paging.per_page,
          totalItems: response.data.paging.total_items,
        });
      }
    };

    fetchProducts({
      page: currentPage,
      per_page: paging.pageSize,
      search: debounceSearchValue,
    });
  }, [currentPage, debounceSearchValue, order]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
  };

  const handleDeleteProduct = async (id) => {
    const response = await deleteProduct(id);
    const newProducts = products.filter((product) => product.product_id !== id);
    setProducts(newProducts);
    setOpen(true);
  };

  const [open, setOpen] = useState(false);

  const handleContinue = () => {
    setOpen(false);
  };

  const handleSortPrice = () => {
    let newOrder = order === "price_asc" ? "price_desc" : "price_asc";
    const params = new URLSearchParams(searchParams);
    params.set("order", newOrder);
    setSearchParams(params);
  };

  const handleSortName = () => {
    let newOrder = searchParams.get("order") === "product_name_asc" ? "product_name_desc" : "product_name_asc";
    const params = new URLSearchParams(searchParams);
    params.set("order", newOrder);
    setSearchParams(params);
  };

  const handleSortCreatedAt = () => { 
    let newOrder = searchParams.get("order") === "created_at_asc" ? "created_at_desc" : "created_at_asc";
    const params = new URLSearchParams(searchParams);
    params.set("order", newOrder);
    setSearchParams(params);
  }

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen w-full">
      <MyAlertDialog
        isShown={open}
        setIsShown={setOpen}
        handleContinue={handleContinue}
        title="Product deleted successfully"
      />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Product</h1>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <span>Dashboard</span>
            <span>/</span>
            <span>Product List</span>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          {/* <Button variant="outline">Export</Button> */}
          <Link to={routes.addProduct}>
            <Button>+ Add Product</Button>
          </Link>
        </div>
      </div>

      <div className="bg-background rounded-lg shadow">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <Input
            placeholder="Search product..."
            className="max-w-sm"
            onChange={handleSearch}
            value={search}
          />
          {/* <div className="flex items-center space-x-4">
            <Button variant="outline" className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Select Dates</span>
            </Button>
            <Button variant="outline" className="flex items-center space-x-2">
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </Button>
          </div> */}
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <input type="checkbox" className="rounded border-input" />
              </TableHead>
              <TableHead className="w-1/5">
                <div className="flex items-center gap-2">
                  <div>Product Name</div>
                  {order === "product_name_asc" ? (
                    <ChevronDown className="h-4 w-4" onClick={handleSortName} />
                  ) : (
                    <ChevronUp className="h-4 w-4" onClick={handleSortName} />
                  )}
                </div>
              </TableHead>
              <TableHead className="w-1/6">Category</TableHead>
              <TableHead className="w-1/6">Stock</TableHead>
              <TableHead className="w-1/6">
                <div className="flex items-center gap-2">
                  <div>Price</div>
                  {order === "price_asc" ? (
                    <ChevronDown
                      className="h-4 w-4"
                      onClick={handleSortPrice}
                    />
                  ) : (
                    <ChevronUp className="h-4 w-4" onClick={handleSortPrice} />
                  )}
                </div>
              </TableHead>
              <TableHead className="w-1/6">Status</TableHead>
              <TableHead className="w-1/6">
                <div className="flex items-center gap-2">
                  <div>Added</div>
                  {order === "created_at_asc" ? (
                    <ChevronDown className="h-4 w-4" onClick={handleSortCreatedAt} />
                  ) : (
                    <ChevronUp className="h-4 w-4" onClick={handleSortCreatedAt} />
                  )}
                </div>
              </TableHead>
              <TableHead className="w-1/6">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products?.map((product, index) => {
              let status = "Available";
              if (product.stock === 0) {
                status = "Out of Stock";
              } else if (product.stock <= 10) {
                status = "Low Stock";
              }
              return (
                <TableRow key={index}>
                  <TableCell>
                    <input type="checkbox" className="rounded border-input" />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <img
                        src={product?.images[0]}
                        alt={product.product_name}
                        className="h-10 w-10 rounded-md"
                      />
                      <div>
                        <div className="font-medium">{product.product_name}</div>
                        <div className="text-sm text-muted-foreground">
                          {product.variants}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{product.category.category_name}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>${product.price}</TableCell>
                  <TableCell>
                    <ProductStatus stock={product.stock} />
                  </TableCell>
                  <TableCell>{formatDate(product?.created_at)}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Link to={`${routes.detailProduct}/${product.product_id}`}>
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link to={`${routes.editProduct}/${product.product_id}`}>
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
                        <AlertDialogContent className="flex flex-col items-center w-auto">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-xl">
                              Are you sure you want to delete this product?
                            </AlertDialogTitle>
                          </AlertDialogHeader>
                          <AlertDialogDescription></AlertDialogDescription>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteProduct(product.product_id)}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {paging?.totalPages > 0 && (
          <MyPagination
            currentPage={currentPage}
            setCurrentPage={(page) => {
              const params = new URLSearchParams(searchParams);
              params.set("page", page);
              setSearchParams(params);
            }}
            totalPages={paging.totalPages}
            totalPagesToDisplay={Math.min(10, paging.totalPages)}
          />
        )}
      </div>
    </div>
  );
}
