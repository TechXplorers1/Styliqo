import React from 'react';
import { Star, Heart, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from './Button';
import LazyImage from './LazyImage';
import useCartStore from '../../store/useCartStore';
import useWishlistStore from '../../store/useWishlistStore';

const ProductCard = ({ product }) => {
    const addToCart = useCartStore(state => state.addItem);
    const { items: wishlistItems, toggleItem } = useWishlistStore();
    const isLiked = wishlistItems.some(i => i.id === product.id);

    const handleAddToCart = (e) => {
        e.preventDefault();
        addToCart(product);
    };

    const handleHeartClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleItem(product);
    };

    return (
        <Link to={`/product/${product.id}`} className="block group">
            <div className="bg-white rounded-lg overflow-hidden border border-gray-100 hover:shadow-card-hover transition-all duration-300">
                {/* Image Container */}
                <div className="relative aspect-[4/5] overflow-hidden">
                    <LazyImage
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full"
                    />
                    {/* Wishlist Icon */}
                    {/* Wishlist Icon */}
                    <button
                        onClick={handleHeartClick}
                        className={`absolute top-3 right-3 p-1.5 rounded-full bg-white shadow-sm hover:text-primary transition-colors ${isLiked ? 'text-red-500 fill-current' : 'text-gray-400'}`}
                    >
                        <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-3">
                    <p className="text-gray-500 text-xs font-normal truncate mb-1">{product.title}</p>

                    <div className="flex items-baseline gap-1 mt-1">
                        <span className="font-bold text-xl text-gray-900">₹{product.price}</span>
                        <span className="text-xs text-gray-500 font-normal">onwards</span>
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                        <span className="bg-gray-100 text-xs text-gray-600 px-1.5 py-0.5 rounded-full">Free Delivery</span>

                        {/* Rating Pill */}
                        <div className="flex items-center bg-green-700 text-white px-1.5 py-0.5 rounded-full text-[10px] font-bold">
                            <span className="mr-0.5">{product.rating}</span>
                            <Star className="w-2.5 h-2.5 fill-current" />
                        </div>
                    </div>

                    {/* Trusted Badge & Add to Cart */}
                    <div className="mt-3 flex items-center justify-between gap-2">
                        <div className="bg-gray-100 text-gray-500 text-[10px] uppercase font-bold px-1 rounded truncate">
                            Reviews ({product.reviews})
                        </div>
                        <Button
                            onClick={handleAddToCart}
                            variant="outline"
                            className="h-8 px-3 text-xs font-bold border-primary text-primary hover:bg-primary hover:text-white transition-colors"
                        >
                            <ShoppingCart className="w-3.5 h-3.5 mr-1" /> Add
                        </Button>
                    </div>

                </div>
            </div>
        </Link>
    );
};

export default ProductCard;
