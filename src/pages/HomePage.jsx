import React, { useState, useEffect } from 'react';
import useThemeStore from '../store/useThemeStore';
import { useSearchParams } from 'react-router-dom';
import CategoryRow from '../components/home/CategoryRow';
import ProductCard from '../components/common/ProductCard';
import FilterSidebar from '../components/home/FilterSidebar';
import Hero from '../components/home/Hero';
import { getProducts } from '../lib/firebase';
import { Filter, SlidersHorizontal, Award } from 'lucide-react';

const HomePage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeFilters, setActiveFilters] = useState({
        category: [],
        price: [],
        rating: []
    });
    const [sortOption, setSortOption] = useState('Relevance');
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const { isDarkMode } = useThemeStore();

    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const searchQuery = searchParams.get('search') || '';

    const handleFilterChange = (newFilters) => {
        setActiveFilters(newFilters);
    };

    const handleClearAll = () => {
        setActiveFilters({
            category: [],
            price: [],
            rating: []
        });
        setSortOption('Relevance');
        setSearchParams({});
    };

    // Fetch products from Firestore
    useEffect(() => {
        const unsubscribe = getProducts(
            (data) => {
                setProducts(data);
                setLoading(false);
            },
            (error) => {
                console.error("Error fetching products:", error);
                setLoading(false);
            }
        );
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        let result = [...products];

        // Filter by Category
        if (activeFilters.category.length > 0) {
            result = result.filter(p => activeFilters.category.includes(p.category));
        }

        // Filter by Price
        if (activeFilters.price.length > 0) {
            result = result.filter(p => {
                const price = p.price;
                return activeFilters.price.some(range => {
                    if (range === 'Under ₹500') return price < 500;
                    if (range === '₹500 - ₹1000') return price >= 500 && price <= 1000;
                    if (range === '₹1000 - ₹2000') return price >= 1000 && price <= 2000;
                    if (range === 'Above ₹2000') return price > 2000;
                    return false;
                });
            });
        }

        // Filter by Rating
        if (activeFilters.rating.length > 0) {
            result = result.filter(p => {
                return activeFilters.rating.some(rate => {
                    if (rate === '4.0+') return p.rating >= 4.0;
                    if (rate === '3.0+') return p.rating >= 3.0;
                    return false;
                });
            });
        }

        // Filter by Search Query
        if (searchQuery) {
            const lowerQuery = searchQuery.toLowerCase();
            result = result.filter(p =>
                p.title.toLowerCase().includes(lowerQuery) ||
                p.category.toLowerCase().includes(lowerQuery)
            );
        }

        // Sort Logic
        if (sortOption === 'Price: Low to High') {
            result.sort((a, b) => a.price - b.price);
        } else if (sortOption === 'Price: High to Low') {
            result.sort((a, b) => b.price - a.price);
        } else if (sortOption === 'Rating') {
            result.sort((a, b) => b.rating - a.rating);
        }

        setFilteredProducts(result);
    }, [activeFilters, searchQuery, sortOption, products]);


    if (loading) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-900' : ''}`}>
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className={`text-gray-600 ${isDarkMode ? 'text-gray-400' : ''}`}>Loading products...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen pb-20 transition-colors duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50/50'}`}>
            <div className="container mx-auto px-4 pt-6">

                {/* Hero Section */}
                <Hero />

                {/* Categories */}
                <div className="mb-12">
                    <div className="flex items-center justify-between mb-6 px-1">
                        <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Shop by Category</h2>
                        {/* <button className="text-primary font-bold text-sm hover:underline">View All</button> */}
                    </div>
                    <CategoryRow />
                </div>

                {/* Promotion Banner */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-700 via-amber-600 to-yellow-600 text-white shadow-xl mb-12 p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="relative z-10 text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                            <Award className="w-6 h-6 text-yellow-300" />
                            <span className="font-bold text-yellow-200 tracking-wide uppercase text-sm">Premium Membership</span>
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-2">Styliqo Gold</h2>
                        <p className="text-yellow-100 max-w-md">Unlock exclusive access to premium collections, early sales, and free express delivery on all orders.</p>
                    </div>
                    <button className="relative z-10 bg-white text-amber-900 px-8 py-3 rounded-full font-bold shadow-lg hover:bg-yellow-50 transition-colors">
                        Upgrade for ₹99
                    </button>
                    {/* Decorative Circles */}
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-yellow-500 rounded-full mix-blend-overlay opacity-20 blur-3xl"></div>
                    <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-amber-900 rounded-full mix-blend-overlay opacity-30 blur-3xl"></div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    {/* Filter Sidebar - Desktop */}
                    <FilterSidebar
                        filters={activeFilters}
                        onFilterChange={handleFilterChange}
                        onClearAll={handleClearAll}
                    />

                    {/* Main Content */}
                    <div className="flex-1 w-full">
                        {/* Toolbar */}
                        <div className={`p-4 rounded-xl shadow-sm mb-6 flex flex-wrap items-center justify-between gap-4 sticky top-20 z-20 transition-colors duration-300 ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'}`}>
                            <div>
                                <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                    All Products
                                </h2>
                                <p className={`text-sm mt-0.5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Showing {filteredProducts.length} results</p>
                            </div>

                            <div className="flex items-center gap-3">
                                {/* Mobile Filter Toggle */}
                                <button
                                    className={`lg:hidden flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-bold transition-colors ${isDarkMode ? 'text-gray-300 border-gray-700 hover:bg-gray-800' : 'text-gray-700 border-gray-200 hover:bg-gray-50'}`}
                                    onClick={() => setShowMobileFilters(!showMobileFilters)}
                                >
                                    <Filter className="w-4 h-4" /> Filters
                                </button>

                                {/* Sort Dropdown */}
                                <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border border-transparent transition-colors ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 hover:border-primary/20'}`}>
                                    <span className={`text-sm font-medium hidden sm:inline ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Sort by:</span>
                                    <select
                                        value={sortOption}
                                        onChange={(e) => setSortOption(e.target.value)}
                                        className={`bg-transparent text-sm font-bold outline-none cursor-pointer ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                                    >
                                        <option value="Relevance">Relevance</option>
                                        <option value="Price: Low to High">Price: Low to High</option>
                                        <option value="Price: High to Low">Price: High to Low</option>
                                        <option value="Rating">Rating: High to Low</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Mobile Filter Drawer (Optional implementation, currently just cond. rendering sidebar logic could go here, but sidebar is hidden on mobile via CSS) */}
                        {showMobileFilters && (
                            <div className="lg:hidden mb-6">
                                <div className={`p-4 rounded-xl border border-gray-100 shadow-lg ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Filters</h3>
                                        <button onClick={() => setShowMobileFilters(false)} className="text-gray-500">Close</button>
                                    </div>
                                    {/* Re-using components logic manually or refactor FilterSidebar to be mobile aware. For now simple mobile message or partial reuse */}
                                    {/* In a real app, wrap sidebar in a responsive drawer component */}
                                    <p className="text-sm text-gray-500 italic">Please use the desktop view for full filtering experience or rotate device.</p>
                                </div>
                            </div>
                        )}

                        {filteredProducts.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                                {filteredProducts.map(product => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <div className={`text-center py-32 rounded-2xl border border-dashed ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                                <SlidersHorizontal className={`w-16 h-16 mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-200'}`} />
                                <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>No products found</h3>
                                <p className={`mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Try adjusting your filters or search query</p>
                                <button onClick={handleClearAll} className="text-primary font-bold hover:underline">
                                    Clear all filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
