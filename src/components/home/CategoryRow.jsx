import React from 'react';
import { categories } from '../../data/mockData';
import { Link } from 'react-router-dom';
import LazyImage from '../common/LazyImage';

const CategoryRow = () => {
    return (
        <div className="bg-white py-6 mb-6">
            <div className="flex space-x-6 overflow-x-auto px-4 pb-4 no-scrollbar">
                {categories.map((category) => (
                    <Link
                        key={category.id}
                        to={`/category/${category.name.toLowerCase()}`}
                        className="flex flex-col items-center min-w-[70px] cursor-pointer group"
                    >
                        <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border border-gray-200 group-hover:border-primary transition-colors duration-300">
                            <LazyImage
                                src={category.image}
                                alt={category.name}
                                className="w-full h-full"
                            />
                        </div>
                        <span className="text-[11px] md:text-xs mt-3 text-gray-800 font-normal whitespace-nowrap group-hover:text-primary transition-colors">
                            {category.name}
                        </span>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default CategoryRow;
