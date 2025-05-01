import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import {
  Calendar,
  CreditCard,
  Truck,
  MapPin,
  UserCircle,
  Phone,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getOrderById } from "@/services/orderServices";
import capitalFirstLetter from "@/lib/capitalFirstLetter";
import formatDate from "@/lib/formatDate";
import routes from "@/config/routes";

export default function OrderDetail() {
  const { id } = useParams();

  const [order, setOrder] = useState({});

  useEffect(() => {
    const fetchOrder = async () => {
      const response = await getOrderById(id);
      if (response.status === 200) {
        setOrder(response.data.order);
      }
    };
    fetchOrder();
  }, [id]);

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Orders</h1>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>Orders</span>
              <span>/</span>
              <span>Orders Detail</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">
                  Order #{order?.order_id}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div className="text-sm">
                <div className="font-medium">Added</div>
                <div className="text-muted-foreground">
                  {formatDate(order?.order_date)}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              <div className="text-sm">
                <div className="font-medium">Payment Method</div>
                <div className="text-muted-foreground">Online</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Truck className="h-4 w-4 text-muted-foreground" />
              <div className="text-sm">
                <div className="font-medium">Shipping Fee</div>
                <div className="text-muted-foreground">$0</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Customer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src={order?.user?.avatar}
                alt="avatar"
                className="w-4 h-4 rounded-lg"
              />
              <div className="text-sm">
                <div className="font-medium">Full name</div>
                <div className="text-muted-foreground">
                  {order?.user?.fullname}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <UserCircle className="h-4 w-4 text-muted-foreground" />
              <div className="text-sm">
                <div className="font-medium">Username</div>
                <div className="text-muted-foreground">
                  @{order?.user?.username}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <div className="text-sm">
                <div className="font-medium">Phone</div>
                <div className="text-muted-foreground">
                  {order?.user?.phone}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Address</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div className="text-sm text-muted-foreground">
                  {order?.user?.address}
                </div>
              </div>
            </div>
            <Separator />
            <CardTitle>Order Status</CardTitle>
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
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mt-6">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Order List</CardTitle>
                <Badge variant="secondary">
                  {order?.details?.length} Products
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-12 gap-4 text-sm text-muted-foreground">
                  <div className="col-span-4">Product</div>
                  <div className="col-span-2">Category</div>
                  <div className="col-span-2">Quantity</div>
                  <div className="col-span-2">Price</div>
                  <div className="col-span-2">Total</div>
                </div>
                <Separator />
                <div className="flex flex-col gap-2">
                  {order?.details?.map((item) => {
                    return (
                      <Link
                        to={`${routes.detailProduct}/${item?.product?.id}`}
                        key={item?.product?.id}
                      >
                        <div className="grid grid-cols-12 gap-4 items-center">
                          <div className="col-span-4 flex items-center gap-3">
                            <img
                              src={item?.product?.images[0]}
                              alt={item?.product?.name}
                              className="w-10 h-10 rounded-lg"
                            />
                            <div>
                              <div className="font-medium">
                                {item?.product?.name}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {item?.product?.manufacturer?.manufacturer_name}
                              </div>
                            </div>
                          </div>
                          <div className="col-span-2 text-sm">
                            {item?.product?.category?.category_name}
                          </div>
                          <div className="col-span-2 text-sm">
                            {item?.quantity}
                          </div>
                          <div className="col-span-2 text-sm">
                            ${item?.product?.price}
                          </div>
                          <div className="col-span-2 text-sm font-medium">
                            ${item?.subtotal}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
                <Separator />
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">${order?.total}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping Fee</span>
                    <span className="font-medium">$0</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Grand Total</span>
                    <span className="font-medium">${order?.total}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
