import React from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../utils/cn';

const NextArrow = ({ onClick, className }) => (
    <div
        className={cn(className, "absolute right-2 top-1/2 -translate-y-1/2 z-10 cursor-pointer text-white hover:text-primary transition bg-black/20 hover:bg-white/80 rounded-full p-1")}
        onClick={onClick}
        style={{ ...className.style, display: 'block' }} // Ensure visibility
    >
        <ChevronRight className="w-6 h-6" />
    </div>
);

const PrevArrow = ({ onClick, className }) => (
    <div
        className={cn(className, "absolute left-2 top-1/2 -translate-y-1/2 z-10 cursor-pointer text-white hover:text-primary transition bg-black/20 hover:bg-white/80 rounded-full p-1")}
        onClick={onClick}
        style={{ ...className.style, display: 'block' }}
    >
        <ChevronLeft className="w-6 h-6" />
    </div>
);

const Carousel = ({ children, settings, className }) => {
    const defaultSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 4000,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        ...settings
    };

    return (
        <div className={cn("relative", className)}>
            <Slider {...defaultSettings}>
                {children}
            </Slider>
        </div>
    );
};

export default Carousel;
