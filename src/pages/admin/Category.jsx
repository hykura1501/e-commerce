import  { useState } from "react";
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
  ChevronDown,
  ChevronRight,
  Filter,
  Download,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";
const categories = [
  {
    id: "1",
    name: "Electronics",
    description: "All electronic devices and accessories",
    sales: 25000,
    stock: 1500,
    added: "29 Dec 2022",
    children: [
      {
        id: "1-1",
        name: "Smartphones",
        description: "Our smartphone include all the big brands",
        sales: 3245,
        stock: 132,
        added: "21 Oct 2022",
      },
      {
        id: "1-2",
        name: "Audio",
        description:
          "Our big range of audio devices makes it easy to upgrade your device at a great price",
        sales: 10405,
        stock: 400,
        added: "12 Dec 2022",
        children: [
          {
            id: "1-2-1",
            name: "Headphones",
            description: "Premium quality headphones",
            sales: 5200,
            stock: 200,
            added: "12 Dec 2022",
          },
          {
            id: "1-2-2",
            name: "Speakers",
            description: "Wireless and wired speakers",
            sales: 5205,
            stock: 200,
            added: "12 Dec 2022",
          },
        ],
      },
      {
        id: "1-3",
        name: "PC Desktop",
        description: "Our computers include all the big brands",
        sales: 1100,
        stock: 98,
        added: "21 Oct 2022",
      },
    ],
  },
  {
    id: "2",
    name: "Fashion",
    description: "Trendy fashion items",
    sales: 28000,
    stock: 2500,
    added: "24 Dec 2022",
    children: [
      {
        id: "2-1",
        name: "Bag & Pouch",
        description: "Great fashion, great selections, great prices",
        sales: 15020,
        stock: 901,
        added: "29 Dec 2022",
      },
      {
        id: "2-2",
        name: "Shoes",
        description: "Whatever your activity needs are, we've got you covered",
        sales: 11902,
        stock: 1201,
        added: "21 Oct 2022",
      },
      {
        id: "2-3",
        name: "Hat",
        description: "Great fashion, great selections, great prices",
        sales: 720,
        stock: 720,
        added: "19 Sep 2022",
      },
    ],
  },
  {
    id: "3",
    name: "Accessories",
    description: "Various accessories",
    sales: 15000,
    stock: 3000,
    added: "19 Sep 2022",
    children: [
      {
        id: "3-1",
        name: "Watch",
        description:
          "Our range of watches are perfect whether you're looking to upgrade",
        sales: 4901,
        stock: 451,
        added: "24 Dec 2022",
      },
      {
        id: "3-2",
        name: "Camera",
        description:
          "You'll find exactly what you're looking for with our huge range of cameras",
        sales: 329,
        stock: 199,
        added: "10 Aug 2022",
      },
    ],
  },
  {
    id: "4",
    name: "Camera",
    description:
      "You'll find exactly what you're looking for with our huge range of cameras",
    sales: 329,
    stock: 199,
    added: "10 Aug 2022",
  },
];

const CategoryRow = ({ category, level }) => {
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
            {category?.children && (
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
            {!category?.children && <div className="w-4" />}
            <div className="w-8 h-8 bg-muted rounded-lg shrink-0" />
            <div>
              <div className="font-medium">{category.name}</div>
              <div className="text-sm text-muted-foreground">
                {category.description}
              </div>
            </div>
          </div>
        </TableCell>
        <TableCell>{category.sales.toLocaleString()}</TableCell>
        <TableCell>{category.stock.toLocaleString()}</TableCell>
        <TableCell>{category.added}</TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </TableCell>
      </TableRow>
      {isExpanded &&
        category?.children &&
        category?.children.map((child) => (
          <CategoryRow key={child.id} category={child} level={level + 1} />
        ))}
    </>
  );
};

export default function Category() {
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
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button>+ Add Category</Button>
        </div>
      </div>

      <div className="rounded-lg border bg-card">
        <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between p-4 border-b">
          <div className="relative w-full md:w-80">
            <Input placeholder="Search category..." className="pl-4" />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <input type="checkbox" className="rounded border-input" />
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-1">
                  Category
                  <ChevronDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-1">
                  Sales
                  <ChevronDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-1">
                  Stock
                  <ChevronDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-1">
                  Added
                  <ChevronDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <CategoryRow key={category.id} category={category} level={0} />
            ))}
          </TableBody>
        </Table>

        <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between p-4 border-t">
          <div className="text-sm text-muted-foreground">
            Showing 1-10 from 15
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-primary text-primary-foreground"
            >
              1
            </Button>
            <Button variant="outline" size="sm">
              2
            </Button>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
