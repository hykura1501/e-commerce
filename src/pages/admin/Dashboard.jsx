import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PieChart from "@/components/PieChart";
import {
  getCategoryStatistic,
  getManufacturerStatistic,
  getBestSellingProductStatistic,
  getTopCustomerStatistic,
  getRevenueStatistic,
  getNewCustomerStatistic,
} from "@/services/statisticServices";
import { useEffect, useState } from "react";
import BarChartHorizontal from "@/components/BartChartHorizontal";
import BartChar from "@/components/BartChart";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Eye, ChevronDown } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import routes from "@/config/routes";
import { getAllOrders } from "@/services/orderServices";
import formatDate from "@/lib/formatDate";
import capitalFirstLetter from "@/lib/capitalFirstLetter";
import { MyPagination } from "@/components/Pagination";

export default function DashboardPage() {

  const [categoryStatistics, setCategoryStatistics] = useState([]);
  const [manufacturerStatistics, setManufacturerStatistics] = useState([]);
  const [bestSellingProductStatistics, setBestSellingProductStatistics] =
    useState([]);
  const [topCustomerStatistics, setTopCustomerStatistics] = useState([]);
  const [revenueStatistics, setRevenueStatistics] = useState([]);
  const [newCustomerStatistics, setNewCustomerStatistics] = useState([]);

  const [searchParams, setSearchParams] = useSearchParams();

  const [orders, setOrders] = useState([]);

  const [paging, setPaging] = useState({
    totalPages: 0,
    totalItems: 0,
    pageSize: 10,
  });

  const currentPage = parseInt(searchParams.get("page")) || 1;

  const sort = searchParams.get("sort") || "date_asc";
  const status = searchParams.get("status") || "";

  useEffect(() => {
    const fetchData = async () => {
      const [
        categoryStatisticData,
        manufacturerStatisticData,
        bestSellingProductStatisticData,
        topCustomerStatisticData,
        revenueStatisticData,
        newCustomerStatisticData,
        ordersData,
      ] = await Promise.all([
        getCategoryStatistic(),
        getManufacturerStatistic(),
        getBestSellingProductStatistic(),
        getTopCustomerStatistic(),
        getRevenueStatistic(),
        getNewCustomerStatistic(),
        getAllOrders(sort, status, currentPage, paging.pageSize),
      ]);
      if (categoryStatisticData.status === 200) {
        setCategoryStatistics(categoryStatisticData.data.statistics);
      }
      if (manufacturerStatisticData.status === 200) {
        setManufacturerStatistics(manufacturerStatisticData.data.statistics);
      }
      if (bestSellingProductStatisticData.status === 200) {
        setBestSellingProductStatistics(bestSellingProductStatisticData.data.best_sellers);
      }
      if (topCustomerStatisticData.status === 200) {
        setTopCustomerStatistics(topCustomerStatisticData.data.top_customers);
      }
      if (revenueStatisticData.status === 200) {
        setRevenueStatistics(revenueStatisticData.data.revenues);
      }
      if (newCustomerStatisticData.status === 200) {
        setNewCustomerStatistics(newCustomerStatisticData.data.statistics);
      }
      if (ordersData.status === 200) {
        setOrders(ordersData.data.orders);
        setPaging({
          totalPages: ordersData.data.paging.total_page,
          totalItems: ordersData.data.paging.total_item,
          pageSize: ordersData.data.paging.page_size,
        });
      }
    };
    fetchData();
  }, [currentPage, sort, status]);

  const handleSortId = () => {
    let sort = searchParams.get("sort");
    if (sort === "id_desc") {
      sort = "id_asc";
    } else {
      sort = "id_desc";
    }
    const params = new URLSearchParams(searchParams);
    params.set("sort", sort);
    setSearchParams(params);
  };

  const handleSortTotal = () => {
    let sort = searchParams.get("sort");
    if (sort === "total_desc") {
      sort = "total_asc";
    } else {
      sort = "total_desc";
    }
    const params = new URLSearchParams(searchParams);
    params.set("sort", sort);
    setSearchParams(params);
  };

  const handleSortDate = () => {
    let sort = searchParams.get("sort");
    if (sort === "date_desc") {
      sort = "date_asc";
    } else {
      sort = "date_desc";
    }
    const params = new URLSearchParams(searchParams);
    params.set("sort", sort);
    setSearchParams(params);
  };

  return (
    <div className="p-1 space-y-6 bg-background min-h-screen w-full">
      <div className="flex items-center space-x-2">
        <h2 className="text-xl font-semibold">Statistics</h2>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BartChar
          dataKey={"Quantity"}
          chartData={newCustomerStatistics?.map((item) => {
            return {
              Quantity: item.quantity,
              month: item.month,
              year: item.year,
              monthYear: `${item.month}/${item.year}`,
            };
          })}
          label={"New customer statistics"}
        />
        <BartChar
          dataKey={"Revenue"}
          chartData={revenueStatistics?.map((item) => {
            return {
              Revenue: Math.round(item.revenue),
              month: item.month,
              year: item.year,
              monthYear: `${item.month}/${item.year}`,
            };
          })}
          label={"Revenue Data"}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BarChartHorizontal
          dataKey={{
            label: "name",
            key: "Quantity",
          }}
          chartData={bestSellingProductStatistics?.map((item) => {
            return {
              name: item.name,
              Quantity: item.quantity,
            };
          })}
          label={"Top best-selling products"}
        />
        <BarChartHorizontal
          dataKey={{
            label: "fullname",
            key: "Total",
          }}
          chartData={topCustomerStatistics?.map((item) => {
            return {
              fullname: item.fullname,
              Total: item.total,
            };
          })}
          label={"Top customers"}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <PieChart
          label={"Statistic product quantity by category"}
          chartData={categoryStatistics}
        />

        <PieChart
          label={"Statistic product quantity by manufacturer"}
          chartData={manufacturerStatistics}
        />
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-semibold">Recent Orders</h2>
          </div>
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
        </div>

        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <input type="checkbox" className="rounded border-input" />
                </TableHead>
                <TableHead>
                  <div className="flex items-center space-x-1">
                    <span>Order ID</span>
                    {sort === "id_desc" ? (
                      <ChevronDown className="h-4 w-4" onClick={handleSortId} />
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
                  <div className="flex items-center space-x-1">
                    <span>Date</span>
                    {sort === "date_desc" ? (
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
                <TableHead>Customer</TableHead>
                <TableHead>
                  <div className="flex items-center space-x-1">
                    <span>Total</span>
                    {sort === "total_desc" ? (
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
                  <div className="flex items-center space-x-1">
                    <span>Status</span>
                  </div>
                </TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders?.map((order) => (
                <TableRow
                  key={order?.order_id}
                >
                  <TableCell>
                    <input type="checkbox" className="rounded border-input" />
                  </TableCell>
                  <TableCell className="font-medium">
                    {order?.order_id}
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
                  <TableCell>{formatDate(order?.order_date)}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{order?.user?.fullname}</div>
                      <div className="text-sm text-muted-foreground">
                        {order?.user?.username}
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
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Link to={`${routes.orderDetail}/${order.order_id}`}>
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
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
    </div>
  );
}
