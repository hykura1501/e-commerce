import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import {
  Calendar as CalendarIcon,
  Filter,
  ChevronDown,
  User,
  Phone,
  MapPin,
  Clock,
} from "lucide-react";
import formatDate from "@/lib/formatDate";
import { useEffect, useState } from "react";
import { getOrderHistory, getOrderHistoryById } from "@/services/orderServices";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import capitalFirstLetter from "@/lib/capitalFirstLetter";

import { format } from "date-fns";

import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getUserById } from "@/services/userServices";
import routes from "@/config/routes";

export default function CustomerDetail() {

  const navigate = useNavigate();

  const { id } = useParams();

  const [user, setUser] = useState({});

  const [date, setDate] = useState();

  const [searchParams, setSearchParams] = useSearchParams();

  const [paging, setPaging] = useState({
    pageSize: 8,
    totalPages: 0,
    totalItems: 0,
  });

  const [orders, setOrders] = useState([]);

  const currentPage = searchParams.get("page") || 1;

  const order = searchParams.get("order") || "id_asc";
  const status = searchParams.get("status") || "";
  const _date = searchParams.get("date") || "";

  useEffect(() => {
    const fetchData = async () => {
      const [userData, orderData] = await Promise.all([
        getUserById(id),
        getOrderHistoryById(id, order, _date, status, currentPage, paging.pageSize),
      ]);
      if (userData.status === 200) {
        setUser(userData.data.user);
      }
      if (orderData.status === 200) {
        setOrders(orderData.data.orders);
        setPaging({
          pageSize: orderData.data.paging.per_page,
          totalPages: orderData.data.paging.total_pages,
          totalItems: orderData.data.paging.total_items,
        });
      }
    };

    fetchData();
  }, [currentPage, order, status, _date]);

  const handleSortTotal = () => {
    let order = searchParams.get("order");
    if (order === "total_desc") {
      order = "total_asc";
    } else {
      order = "total_desc";
    }
    const params = new URLSearchParams(searchParams);
    params.set("order", order);
    setSearchParams(params);
  };

  const handleSortDate = () => {
    let order = searchParams.get("order");
    if (order === "date_desc") {
      order = "date_asc";
    } else {
      order = "date_desc";
    }
    const params = new URLSearchParams(searchParams);
    params.set("order", order);
    setSearchParams(params);
  };

  const handleSortId = () => {
    let order = searchParams.get("order");
    if (order === "id_desc") {
      order = "id_asc";
    } else {
      order = "id_desc";
    }
    const params = new URLSearchParams(searchParams);
    params.set("order", order);
    setSearchParams(params);
  };

  return (
    <div className="container mx-auto p-6 px-[50px]">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-1">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <div className="relative">
                <img
                  className="w-[200px] h-[200px] rounded-full"
                  src={user?.avatar}
                  alt={user?.username}
                />
              </div>
              <h2 className="mt-4 text-xl font-semibold">{user?.fullname}</h2>
              <p className="text-sm text-muted-foreground">@{user?.username}</p>

              <div className="w-full mt-6 space-y-4">
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1 text-left">
                    <div className="text-sm text-muted-foreground">User ID</div>
                    <div className="text-sm font-medium">
                      #ID-{user?.user_id}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1 text-left">
                    <div className="text-sm text-muted-foreground">
                      Phone Number
                    </div>
                    <div className="text-sm font-medium">
                      {user?.phone ? user?.phone : "Not Provided"}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1 text-left">
                    <div className="text-sm text-muted-foreground">
                      Delivery Address
                    </div>
                    <div className="text-sm font-medium">
                      {user?.address ? user?.address : "Not Provided"}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1 text-left">
                    <div className="text-sm text-muted-foreground">Join At</div>
                    <div className="text-sm font-medium">
                      {formatDate(user?.created_at)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-3 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <svg
                      className="w-6 h-6 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Total Balance
                    </p>
                    <div className="flex items-baseline gap-2">
                      <h3 className="text-2xl font-bold">{1243}</h3>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
                    <svg
                      className="w-6 h-6 text-orange-600 dark:text-orange-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Total Orders
                    </p>
                    <div className="flex items-baseline gap-2">
                      <h3 className="text-2xl font-bold">
                        {paging?.totalItems}
                      </h3>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <svg
                      className="w-6 h-6 text-blue-600 dark:text-blue-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Total Amounts
                    </p>
                    <div className="flex items-baseline gap-2">
                      <h3 className="text-2xl font-bold">
                        {orders
                          ?.reduce((sum, value) => {
                            return sum + parseFloat(value?.total);
                          }, 0)
                          ?.toFixed(2)}
                      </h3>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Transaction History</CardTitle>
              <div className="flex items-center gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className={cn(
                        "w-[280px] justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      {date ? format(date, "PPP") : <span>Select Date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(date) => {
                        setDate(date);
                        const params = new URLSearchParams(searchParams);
                        params.set("date", format(date, "yyyy-MM-dd"));
                        setSearchParams(params);
                      }}
                    />
                  </PopoverContent>
                </Popover>

                <Select
                  onValueChange={(value) => {
                    const params = new URLSearchParams(searchParams);
                    params.set("status", value);
                    setSearchParams(params);
                  }}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Status</SelectLabel>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <Button
                  onClick={() => {
                    const params = new URLSearchParams(searchParams);
                    params.delete("status");
                    params.delete("date");
                    params.delete("order");
                    setSearchParams(params);
                  }}
                >
                  Clear filters
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <div className="flex items-center gap-1">
                        Order ID
                        {order === "id_desc" ? (
                          <ChevronDown
                            className="h-4 w-4"
                            onClick={handleSortId}
                          />
                        ) : (
                          <ChevronDown
                            className="h-4 w-4 transform rotate-180"
                            onClick={handleSortId}
                          />
                        )}
                      </div>
                    </TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>
                      <div className="flex items-center gap-1">
                        Total
                        {order === "total_desc" ? (
                          <ChevronDown
                            className="h-4 w-4"
                            onClick={handleSortTotal}
                          />
                        ) : (
                          <ChevronDown
                            className="h-4 w-4 transform rotate-180"
                            onClick={handleSortTotal}
                          />
                        )}
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center gap-1">Status</div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center gap-1">
                        Date
                        {order === "date_desc" ? (
                          <ChevronDown
                            className="h-4 w-4"
                            onClick={handleSortDate}
                          />
                        ) : (
                          <ChevronDown
                            className="h-4 w-4 transform rotate-180"
                            onClick={handleSortDate}
                          />
                        )}
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders?.length > 0 ? (
                    orders?.map((order) => (
                      <TableRow key={order?.order_id} onClick={() => navigate(`${routes.orderDetail}/${order?.order_id}`)}>
                        <TableCell className="font-medium">
                          #{order?.order_id}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <img
                              src={order?.details[0]?.product?.images[0]}
                              alt={order?.details[0]?.id}
                              className="w-12 h-12 rounded-lg"
                            />
                            <div>
                              <div className="font-medium">
                                {order?.details[0]?.product?.name}
                              </div>
                              {order?.details.length > 1 && (
                                <div className="text-sm text-muted-foreground">
                                  + {order?.details.length - 1} other items
                                </div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>${order.total}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              order.status === "pending"
                                ? "border-orange-200 bg-orange-100 text-orange-700 dark:border-orange-800 dark:bg-orange-900 dark:text-orange-300"
                                : order.status === "completed"
                                ? "border-green-200 bg-green-100 text-green-700 dark:border-green-800 dark:bg-green-900 dark:text-green-300"
                                : "border-red-200 bg-red-100 text-red-700 dark:border-red-800 dark:bg-red-900 dark:text-red-300"
                            }
                          >
                            {capitalFirstLetter(order?.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(order?.order_date)}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">
                        No orders found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              {paging.totalPages > 1 && (
                <div className="p-4 border-t border-border flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    {`Showing ${(currentPage - 1) * paging.pageSize + 1}-${
                      (currentPage - 1) * paging.pageSize + orders.length
                    } from ${paging.totalItems} orders`}
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
                            const params = new URLSearchParams(searchParams);
                            params.set("page", parseInt(page) + 1);
                            setSearchParams(params);
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
                      onClick={() => {
                        const params = new URLSearchParams(searchParams);
                        params.set("page", parseInt(currentPage) + 1);
                        setSearchParams(params);
                      }}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
