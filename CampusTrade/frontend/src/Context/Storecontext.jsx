import { createContext, useEffect, useState } from "react";
import productService from "../services/productService";
import toast from "react-hot-toast";
import { product_list as asset_list } from "../assets/assets";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
    const [productList, setProductList] = useState([]);
    const [cartItems, setCartItems] = useState({});
    const [rentalDays, setRentalDays] = useState({}); // { productId: numberOfDays }
    const [wishlistItems, setWishlistItems] = useState(() => {
        const saved = localStorage.getItem('wishlist');
        return saved ? JSON.parse(saved) : [];
    });
    const [orderHistory, setOrderHistory] = useState(() => {
        const saved = localStorage.getItem('orderHistory');
        return saved ? JSON.parse(saved) : [];
    });
    const [loading, setLoading] = useState(true);

    // Normalize a backend product so every item has both 'name' and 'image' fields
    const normalizeBackendProduct = (product) => {
        return {
            ...product,
            // Ensure 'name' always exists (backend uses 'title')
            name: product.name || product.title || 'Untitled Product',
            // Ensure 'image' always exists (backend uses 'images[]')
            image: product.image || (product.images && product.images.length > 0 ? product.images[0] : null),
        };
    };

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const data = await productService.getAllProducts();
            
            // Safely extract products from response (handles various response shapes)
            let backendProducts = [];
            if (data && Array.isArray(data.products)) {
                backendProducts = data.products.map(normalizeBackendProduct);
            } else if (data && Array.isArray(data)) {
                backendProducts = data.map(normalizeBackendProduct);
            }

            if (backendProducts.length > 0) {
                // Merge backend products with local assets for a rich catalog
                // Backend products take priority; only add local assets that don't conflict
                const backendNames = new Set(backendProducts.map(p => (p.name || p.title || '').toLowerCase()));
                const uniqueLocalAssets = asset_list.filter(item => 
                    !backendNames.has((item.name || '').toLowerCase())
                );
                setProductList([...backendProducts, ...uniqueLocalAssets]);
            } else {
                // No backend products — use full local asset list as fallback
                setProductList(asset_list);
            }
        } catch (error) {
            // Backend unreachable — gracefully fall back to local data
            setProductList(asset_list);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
    }, [wishlistItems]);

    useEffect(() => {
        localStorage.setItem('orderHistory', JSON.stringify(orderHistory));
    }, [orderHistory]);

    const addToCart = (itemId) => {
        setCartItems((prev) => ({
            ...prev,
            [itemId]: (prev[itemId] || 0) + 1
        }));
        // Default rental days to 1 for new items
        setRentalDays((prev) => ({
            ...prev,
            [itemId]: prev[itemId] || 1
        }));
        toast.success("Added to cart");
    };

    const removeFromCart = (itemId) => {
        setCartItems((prev) => {
            const newCart = { ...prev };
            if (newCart[itemId] > 1) {
                newCart[itemId] -= 1;
            } else {
                delete newCart[itemId];
                // Clean up rental days too
                setRentalDays((prevDays) => {
                    const newDays = { ...prevDays };
                    delete newDays[itemId];
                    return newDays;
                });
            }
            return newCart;
        });
    };

    const updateRentalDays = (itemId, days) => {
        const parsedDays = Math.max(1, Math.min(30, parseInt(days) || 1));
        setRentalDays((prev) => ({
            ...prev,
            [itemId]: parsedDays
        }));
    };

    const toggleWishlist = (itemId) => {
        setWishlistItems(prev => {
            if (prev.includes(itemId)) {
                toast.success("Removed from wishlist");
                return prev.filter(id => id !== itemId);
            } else {
                toast.success("Added to wishlist");
                return [...prev, itemId];
            }
        });
    };

    const getItemPrice = (itemInfo) => {
        // Use rentDaily first, fall back to price for rental items
        if (itemInfo.availability === 'Rent') {
            return itemInfo.rentDaily || itemInfo.price || 0;
        }
        return itemInfo.price || 0;
    };

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (let item in cartItems) {
            if (cartItems[item] > 0) {
                let itemInfo = productList.find((product) => product._id === item);
                if (itemInfo) {
                    const unitPrice = getItemPrice(itemInfo);
                    const qty = cartItems[item];
                    if (itemInfo.availability === 'Rent') {
                        const days = rentalDays[item] || 1;
                        totalAmount += unitPrice * qty * days;
                    } else {
                        totalAmount += unitPrice * qty;
                    }
                }
            }
        }
        return totalAmount;
    };

    const addOrder = (order) => {
        setOrderHistory(prev => [order, ...prev]);
    };

    const contextValue = {
        productList,
        cartItems,
        setCartItems,
        rentalDays,
        updateRentalDays,
        wishlistItems,
        toggleWishlist,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        getItemPrice,
        fetchProducts,
        loading,
        orderHistory,
        addOrder
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;
