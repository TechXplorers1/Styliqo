import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';

const Hero = () => {
    const navigate = useNavigate();

    return (
        <div className="relative bg-gray-900 text-white rounded-2xl overflow-hidden shadow-2xl mb-12 mx-4 md:mx-0">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0">
                <img
                    src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop"
                    alt="Fashion Background"
                    className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/60 to-transparent"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 px-8 py-16 md:py-24 md:px-16 max-w-3xl">
                <span className="inline-block py-1 px-3 rounded-full bg-pink-500/20 text-pink-300 text-xs font-bold uppercase tracking-wider mb-4 border border-pink-500/30">
                    New Collection 2025
                </span>
                <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
                    Redefine Your <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
                        Everyday Style
                    </span>
                </h1>
                <p className="text-gray-300 text-lg mb-8 max-w-lg leading-relaxed">
                    Discover the latest trends in ethnic and western wear. Premium quality at prices you'll love.
                </p>
                <div className="flex flex-wrap gap-4">
                    <Button
                        variant="primary"
                        size="lg"
                        className="rounded-full px-8 h-12 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all transform hover:-translate-y-1"
                        onClick={() => navigate('/category/all')}
                    >
                        Shop Now <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                    <Button
                        variant="outline"
                        size="lg"
                        className="rounded-full px-8 h-12 border-white text-white hover:bg-white hover:text-gray-900 transition-all"
                        onClick={() => navigate('/category/western')}
                    >
                        View Lookbook
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Hero;
