import { Link, useSearchParams } from "react-router-dom";
import { Search, ShoppingCart, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useState, useRef, useEffect } from "react";
import CategoriesNav from "@/components/CategoryNav";
import { logout } from "@/services/authServices";
import { useNavigate } from "react-router-dom";
import routes from "@/config/routes";
import { getAllCategories } from "@/services/categoryServices";
import { Input } from "@/components/ui/input";
import ModeToggle from "@/components/ModeToggle";
import { clearToken } from "@/lib/token";

const Header = ({ user, setUser, cartItems, setCartItems, setIsOpenCart }) => {
  const [showCategories, setShowCategories] = useState(false);
  const categoriesRef = useRef(null);
  const navigate = useNavigate();

  const handleBlur = (e) => {
    if (!categoriesRef.current.contains(e.relatedTarget)) {
      setShowCategories(false);
    }
  };

  const handleLogout = async () => {
    clearToken();
    navigate("/");
    setUser(null);
  };
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const [categoriesData] = await Promise.all([getAllCategories()]);
      if (categoriesData.status === 200) {
        setCategories(categoriesData.data.tree_categories);
      }
    };
    fetchData();
  }, []);

  const [searchParams, setSearchParams] = useSearchParams();

  const [keyword, setKeyword] = useState(searchParams.get("keyword") || "");

  return (
    <header className="bg-white text-black dark:bg-gray-900 dark:text-white fixed w-full top-0 z-50 h-20">
      <nav className="px-[50px]">
        <div className="container py-3 mx-auto flex justify-between items-center">
          <div className="flex items-center justify-between w-7/12">
            <div className="text-2xl font-bold">
              <Link to={routes.home}>E-commerce</Link>
            </div>
            <div className="relative" ref={categoriesRef}>
              <Button
                variant="ghost"
                onClick={() => setShowCategories(!showCategories)}
                onBlur={handleBlur}
              >
                All Categories
              </Button>
              {showCategories && (
                <div className="absolute top-full mt-2 left-0 bg-white dark:bg-gray-800 shadow-lg border dark:border-gray-700 rounded z-40">
                  <CategoriesNav categories={categories} />
                </div>
              )}
            </div>
            <div className="hidden md:flex space-x-8">
              <div className="gap-4 w-96 px-5 py-1 flex items-center rounded">
                <Input
                  className="w-full py-2 rounded-md bg-transparent outline-none dark:placeholder-gray-400 dark:text-white"
                  type="text"
                  placeholder="What are you looking for?"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
                <button>
                  <Search
                    onClick={() => navigate(`/search?keyword=${keyword}`)}
                    className="h-4 w-4 text-gray-900 dark:text-white"
                  />
                </button>
              </div>
            </div>
          </div>
          <div className="hidden md:flex gap-6 items-center w-5/12 justify-end">
            <div
              className="relative cursor-pointer"
              onClick={() => setIsOpenCart(true)}
            >
              <ShoppingCart
                className="text-muted-foreground dark:text-gray-400"
                size={26}
              />
              <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {cartItems?.items?.length}
              </span>
            </div>
            <ModeToggle />
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar>
                    <AvatarImage src={user.avatar} />
                    {/* <AvatarFallback>CN</AvatarFallback> */}
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {user?.permission === 1 && (
                    <Link to={routes.dashboard}>
                      <DropdownMenuItem>
                        <User className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                      </DropdownMenuItem>
                    </Link>
                  )}
                  <DropdownMenuItem onClick={() => navigate(routes.profile)}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to={routes.login}>
                <Button>Log in</Button>
              </Link>
            )}
          </div>
        </div>
        <hr />
      </nav>
    </header>
  );
};

export default Header;
