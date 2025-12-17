import React, { useState } from 'react';
import useThemeStore from '../../store/useThemeStore';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FilterSection = ({ title, options, selectedOptions = [], onChange, isOpenDefault = false }) => {
    const [isOpen, setIsOpen] = useState(isOpenDefault);

    const handleCheckboxChange = (option) => {
        let newSelected;
        if (selectedOptions.includes(option)) {
            newSelected = selectedOptions.filter(item => item !== option);
        } else {
            newSelected = [...selectedOptions, option];
        }
        onChange(newSelected);
    };

    return (
        <div className="border-b border-gray-200 py-4 last:border-0 dark:border-gray-700">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex w-full items-center justify-between text-sm font-bold text-gray-800 mb-2 dark:text-white"
            >
                {title}
                {isOpen ? <ChevronUp className="w-4 h-4 text-gray-500 dark:text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />}
            </button>

            {isOpen && (
                <div className="mt-2 space-y-2">
                    {options.map((option) => (
                        <label key={option} className="flex items-center space-x-3 cursor-pointer group">
                            <div className="relative flex items-center">
                                <input
                                    type="checkbox"
                                    className="peer w-4 h-4 border-2 border-gray-300 rounded text-primary focus:ring-0 checked:bg-primary checked:border-primary transition-all dark:border-gray-600 dark:bg-gray-700 dark:checked:bg-primary dark:checked:border-primary"
                                    checked={selectedOptions.includes(option)}
                                    onChange={() => handleCheckboxChange(option)}
                                />
                            </div>
                            <span className="text-gray-600 text-sm group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-gray-200">{option}</span>
                        </label>
                    ))}
                </div>
            )}
        </div>
    );
};

const FilterSidebar = ({ filters, onFilterChange, onClearAll }) => {
    const { isDarkMode } = useThemeStore();

    // Helper to update specific filter category
    const updateFilter = (category, selectedValues) => {
        onFilterChange({ ...filters, [category]: selectedValues });
    };

    return (
        <div className="w-64 flex-shrink-0 hidden lg:block pr-6">
            <div className={`rounded p-4 sticky top-24 ${isDarkMode ? 'bg-gray-800 border border-gray-700 text-gray-200' : 'bg-white border border-gray-200 text-gray-800'}`}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Filters</h2>
                    <span
                        className="text-xs text-primary font-bold cursor-pointer uppercase hover:underline"
                        onClick={onClearAll}
                    >
                        Clear All
                    </span>
                </div>

                <FilterSection
                    title="Category"
                    options={['Western', 'Men', 'Kids', 'Jewellery', 'Footwear']}
                    selectedOptions={filters.category}
                    onChange={(vals) => updateFilter('category', vals)}
                    isOpenDefault={true}
                />

                <FilterSection
                    title="Price"
                    options={['Under ₹500', '₹500 - ₹1000', '₹1000 - ₹2000', 'Above ₹2000']}
                    selectedOptions={filters.price}
                    onChange={(vals) => updateFilter('price', vals)}
                    isOpenDefault={true}
                />

                <FilterSection
                    title="Rating"
                    options={['4.0+', '3.0+']}
                    selectedOptions={filters.rating}
                    onChange={(vals) => updateFilter('rating', vals)}
                />
            </div>
        </div>
    );
};

export default FilterSidebar;
