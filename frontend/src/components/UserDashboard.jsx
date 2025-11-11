import React, { useEffect, useRef, useState } from "react";
import Nav from "./Nav";
import { categories } from "../Category";
import CategoryCard from "./CategoryCard";
import { FaCircleChevronLeft } from "react-icons/fa6";
import { FaCircleChevronRight } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { useGetShopByCity } from "../hooks/useGetShopByCity";
import { useGetItemsByCity } from "../hooks/useGetItemsByCity";
import FoodCard from "./FoodCard";
import { useGetAllItems } from "../hooks/useGetAllItems";
import Pagination from "./Pagination";

const UserDashboard = () => {
  const catScrollRef = useRef(null);
  const shopScrollRef = useRef(null);
  const [showLeftCatButton, setShowLeftCatButton] = useState(false);
  const [showRightCatButton, setShowRightCatButton] = useState(true);

  const [showLeftShopButton, setShowLeftShopButton] = useState(false);
  const [showRightShopButton, setShowRightShopButton] = useState(true);
  const [page, setPage] = useState(1);
  
  const { city, error, itemsByCity } = useSelector((state) => state.user);
  console.log('Current city:', city);
  console.log('Items by city:', itemsByCity);
  const { shopByCity } = useSelector((state) => state.shop);
  console.log('Shops by city:', shopByCity);
  const dispatch = useDispatch();

  // Ensure shopByCity is always an array
  const safeShopByCity = Array.isArray(shopByCity) ? shopByCity : [];
  const safeItemsByCity = Array.isArray(itemsByCity) ? itemsByCity : [];


  // Use the custom hooks to fetch shops and items by city (with fallback)
  const currentCity = city || "Saidulajab Extension";
  
  // Fetch data specific to user dashboard
  useGetItemsByCity(currentCity);
  useGetShopByCity(currentCity);
 const { items, totalPages, loading } = useGetAllItems(page);

  const handleScroll = (ref, setShowLeft, setShowRight) => {
    const elem = ref.current;
    if (elem) {
      requestAnimationFrame(() => {
        const scrollLeft = elem.scrollLeft;
        const clientWidth = elem.clientWidth;
        const scrollWidth = elem.scrollWidth;

        // Check if content actually needs scrolling with buffer
        const needsScrolling = scrollWidth > clientWidth + 5;

        setShowLeft(scrollLeft > 1);

        // Very precise end detection
        const scrollProgress = scrollLeft + clientWidth;
        const maxScroll = scrollWidth;
        const threshold = 3; // 3px threshold

        const isAtEnd =
          !needsScrolling || scrollProgress >= maxScroll - threshold;

        setShowRight(!isAtEnd);
      });
    }
  };

  const scrollHandler = (ref, direction) => {
    if (ref.current) {
      ref.current.scrollBy({
        left: direction === "left" ? -200 : 200,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const catScrollElement = catScrollRef.current;
    const shopScrollElement = shopScrollRef.current;
    
    // Check initial state with a small delay to ensure DOM is fully rendered
    setTimeout(() => {
      if (catScrollElement) {
        handleScroll(catScrollRef, setShowLeftCatButton, setShowRightCatButton);
      }
      if (shopScrollElement) {
        handleScroll(shopScrollRef, setShowLeftShopButton, setShowRightShopButton);
      }
    }, 100);

    // Category scroll listeners
    const catScrollListener = () => {
      handleScroll(catScrollRef, setShowLeftCatButton, setShowRightCatButton);
    };

    // Shop scroll listeners
    const shopScrollListener = () => {
      handleScroll(shopScrollRef, setShowLeftShopButton, setShowRightShopButton);
    };

    // Add event listeners with null checks
    if (catScrollElement) {
      catScrollElement.addEventListener("scroll", catScrollListener);
    }
    if (shopScrollElement) {
      shopScrollElement.addEventListener("scroll", shopScrollListener);
    }

    // Handle window resize
    const resizeListener = () => {
      if (catScrollElement) {
        handleScroll(catScrollRef, setShowLeftCatButton, setShowRightCatButton);
      }
      if (shopScrollElement) {
        handleScroll(shopScrollRef, setShowLeftShopButton, setShowRightShopButton);
      }
    };

    window.addEventListener("resize", resizeListener);

    // Cleanup function
    return () => {
      if (catScrollElement) {
        catScrollElement.removeEventListener("scroll", catScrollListener);
      }
      if (shopScrollElement) {
        shopScrollElement.removeEventListener("scroll", shopScrollListener);
      }
      window.removeEventListener("resize", resizeListener);
    };
  }, []);

  return (
    <div className="w-screen min-h-screen flex flex-col gap-5 items-center bg-[#ff9f6] overflow-y-auto">
      <Nav />
      <div className="w-full max-w-6xl flex flex-col gap-5 items-start p-[10px]">
        <h1 className="text-gray-800 text-2xl sm:text-3xl">
          Inspiration for your first order.
        </h1>
        <div className="w-full flex items-center gap-6 relative">
          {showLeftCatButton && (
            <button
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white p-2 rounded-full shadow-lg hover:bg-[#e64528] z-10"
              onClick={() => scrollHandler(catScrollRef, "left")}
            >
              <FaCircleChevronLeft size={30} />
            </button>
          )}
          <div
            className="w-full flex overflow-x-auto gap-4 pb-2"
            ref={catScrollRef}
          >
            {categories.map((category, index) => (
              <CategoryCard key={index} data={category} />
            ))}
          </div>
          {showRightCatButton && (
            <button
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white p-2 rounded-full shadow-lg hover:bg-[#e64528] z-10"
              onClick={() => scrollHandler(catScrollRef, "right")}
            >
              <FaCircleChevronRight size={30} />
            </button>
          )}
        </div>
      </div>

      <div className="w-full max-w-6xl flex flex-col gap-5 items-start p-[10px]">
        <h1 className="text-gray-800 text-2xl sm:text-3xl">
          Best Shop in {currentCity}.
        </h1>
        <div className="w-full flex items-center gap-6 relative">
          {showLeftShopButton && (
            <button className="absolute left-0 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white p-2 rounded-full shadow-lg hover:bg-[#e64528] z-10"
              onClick={() => scrollHandler(shopScrollRef, "left")}
            >
              <FaCircleChevronLeft size={30} />
            </button>
          )}
          <div className="w-full flex overflow-x-auto gap-4 pb-2" ref={shopScrollRef}>
            {safeShopByCity.map((shop, index) => (
              <CategoryCard key={index} data={shop} />
            ))}
          </div>
          {showRightShopButton && (
            <button className="absolute right-0 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white p-2 rounded-full shadow-lg hover:bg-[#e64528] z-10"
              onClick={() => scrollHandler(shopScrollRef, "right")}
            >
              <FaCircleChevronRight size={30} />
            </button>
          )}
        </div>
      </div>

      <div className="w-full max-w-6xl flex flex-col gap-5 items-start p-[10px]">
        <h1 className="text-gray-800 text-2xl sm:text-3xl">
          Suggested Food Items
        </h1>
        {error && <p className="text-red-500"> {error}</p>}
        <div className="w-full h-auto flex flex-wrap gap-[20px] justify-center">
            {safeItemsByCity.map((item, index) => (
              <FoodCard key={index} data={item} />
            ))}
          </div>

      </div>

      <div className="w-full max-w-6xl flex flex-col gap-5 items-start p-[10px]">
        <h1 className="text-gray-800 text-2xl sm:text-3xl">All Food Items</h1>
        {error && <p className="text-red-500">{error}</p>}

        {loading ? (
          <p className="text-gray-500 text-center w-full">Loading...</p>
        ) : (
          <>
            <div className="w-full h-auto flex flex-wrap gap-[20px] justify-center">
              {items.length > 0 ? (
                items.map((item, index) => <FoodCard key={index} data={item} />)
              ) : (
                <p className="text-gray-600">No items available</p>
              )}
            </div>

            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={(newPage) => setPage(newPage)}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
