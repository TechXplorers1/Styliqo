import React from 'react';
import { categories } from '../../data/mockData';
import { Link } from 'react-router-dom';
import LazyImage from '../common/LazyImage';

const CategoryRow = () => {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-6">
                {categories.map((category) => (
                    <Link
                        key={category.id}
                        to={`/category/${category.name.toLowerCase()}`}
                        className="flex flex-col items-center cursor-pointer group"
                    >
                        <div className="w-full aspect-square rounded-full overflow-hidden border-2 border-gray-200 group-hover:border-primary group-hover:shadow-lg transition-all duration-300 transform group-hover:scale-105">
                            <LazyImage
                                src={category.image}
                                alt={category.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <span className="text-xs md:text-sm mt-3 text-gray-800 font-medium text-center group-hover:text-primary transition-colors">
                            {category.name}
                        </span>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default CategoryRow;
