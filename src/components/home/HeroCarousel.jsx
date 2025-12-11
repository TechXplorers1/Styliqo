import React from 'react';
import Carousel from '../common/Carousel';
import { banners } from '../../data/mockData';

const HeroCarousel = () => {
    const settings = {
        arrows: false,
        dots: true,
    };

    return (
        <div className="w-full bg-white mb-4">
            <Carousel settings={settings}>
                {banners.map((banner) => (
                    <div key={banner.id} className="outline-none">
                        <div className="relative aspect-[2/1] md:aspect-[3/1] lg:aspect-[4/1] w-full overflow-hidden">
                            <img
                                src={banner.image}
                                alt={banner.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                                {/* Optional Text Overlay */}
                                {/* <h2 className="text-white text-3xl font-bold">{banner.title}</h2> */}
                            </div>
                        </div>
                    </div>
                ))}
            </Carousel>
        </div>
    );
};

export default HeroCarousel;
