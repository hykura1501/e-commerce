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
import { Filter, Eye, Trash2, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import routes from "@/config/routes";
import { useSearchParams } from "react-router-dom";
import { getAllUsers, deleteUser } from "@/services/userServices";
import useDebounce from "@/hooks/useDebounce";
import { useEffect, useState } from "react";
import formatDate from "@/lib/formatDate";
import MyAlertDialog from "@/components/MyAlertDialog";
import { MyPagination } from "@/components/Pagination";

export default function Customer() {
  const [paging, setPaging] = useState({
    totalPages: 0,
    pageSize: 20,
    totalItems: 0,
  });

  const [searchParams, setSearchParams] = useSearchParams();

  const [users, setUsers] = useState([]);

  const currentPage = parseInt(searchParams.get("page")) || 1;

  const [search, setSearch] = useState(searchParams.get("search") || "");

  const debounceSearchValue = useDebounce(search, 500);

  useEffect(() => {
    const fetchUsers = async ({ currentPage, pageSize, search }) => {
      const response = await getAllUsers({
        page: currentPage,
        per_page: pageSize,
        search,
      });
      if (response.status === 200) {
        setUsers(response.data.users);
        setPaging({
          totalPages: response.data.paging.total_pages,
          pageSize: response.data.paging.per_page,
          totalItems: response.data.paging.total_items,
        });
      }
    };
    fetchUsers({
      currentPage,
      pageSize: paging.pageSize,
      search: debounceSearchValue,
    });
  }, [currentPage, debounceSearchValue]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);

    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set("search", value);
    } else {
      newParams.delete("search");
    }
    setSearchParams(newParams);
  };

  const handleDeleteUser = async (userId) => {
    const response = await deleteUser(userId);
    if (response.status === 204) {
      const newUsers = users.filter((user) => user.user_id !== userId);
      setUsers(newUsers);
      setOpen(true);
    }
  };

  const [open, setOpen] = useState(false);

  const handleContinue = () => {
    setOpen(false);
  };

  return (
    <div className="container mx-auto p-6">
      <MyAlertDialog
        isShown={open}
        setIsShown={setOpen}
        handleContinue={handleContinue}
        title="Customer deleted successfully"
      />
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">Customer</h1>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <span>Dashboard</span>
            <span>/</span>
            <span>Customer List</span>
          </div>
        </div>
      </div>
      <div className="rounded-lg border bg-card">
        <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between p-4 border-b">
          <div className="relative w-full md:w-80">
            <Input
              placeholder="Search customer..."
              className="pl-4"
              value={search}
              onChange={handleSearch}
            />
          </div>
          {/* <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button> */}
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <input type="checkbox" className="rounded border-input" />
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-1">
                  Customer Name
                  <ChevronDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>
                <div className="flex items-center gap-1">Address</div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-1">
                  Created
                  <ChevronDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.length > 0 ? (
              users?.map((user) => (
                <TableRow key={user.user_id}>
                  <TableCell>
                    <input type="checkbox" className="rounded border-input" />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img src={user.avatar} alt="avatar" className="w-8 h-8" />
                      <div>
                        <div className="font-medium">{user.fullname}</div>
                        <div className="text-sm text-muted-foreground">
                          {user.username}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {user.phone ? user.phone : "No provided"}
                  </TableCell>
                  <TableCell>
                    {user.address ? user.address : "No provided"}
                  </TableCell>

                  <TableCell>{`${formatDate(user.created_at)}`}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Link to={`${routes.customerDetail}/${user.user_id}`}>
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      {/* <Button variant="ghost" size="icon" onClick={() => handleDeleteUser(user?.user_id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button> */}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="flex flex-col items-center">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-xl">
                              Are you sure you want to delete this customer?
                            </AlertDialogTitle>
                          </AlertDialogHeader>
                          <AlertDialogDescription></AlertDialogDescription>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteUser(user?.user_id)}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan="8" className="text-center">
                  No customers found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        {paging?.totalPages > 0 && (
          <MyPagination
            currentPage={currentPage}
            setCurrentPage={(page) => {
              setSearchParams({ page });
            }}
            totalPages={paging.totalPages}
            totalPagesToDisplay={10}
          />
        )}
      </div>
    </div>
  );
}
