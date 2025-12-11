import React, { useState } from 'react';
import { cn } from '../../utils/cn';

const LazyImage = ({ src, alt, className, ...props }) => {
    const [isLoading, setIsLoading] = useState(true);

    return (
        <div className={cn("relative overflow-hidden bg-gray-200", className)}>
            {isLoading && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                    <span className="sr-only">Loading...</span>
                </div>
            )}
            <img
                src={src}
                alt={alt}
                className={cn(
                    "w-full h-full object-cover transition-opacity duration-300",
                    isLoading ? "opacity-0" : "opacity-100"
                )}
                onLoad={() => setIsLoading(false)}
                loading="lazy"
                {...props}
            />
        </div>
    );
};

export default LazyImage;
