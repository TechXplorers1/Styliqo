import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { loginUser } from '../lib/firebase';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import useAuthStore from '../store/useAuthStore';

const LoginPage = () => {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
    const navigate = useNavigate();
    const setUser = useAuthStore(state => state.setUser);

    const onSubmit = async (data) => {
        try {
            const userCredential = await loginUser(data.email, data.password);
            setUser(userCredential.user);
            if (data.email === 'admin@gmail.com') {
                navigate('/admin');
            } else {
                navigate('/profile');
            }
        } catch (error) {
            console.error(error);
            alert('Login Failed: ' + error.message);
        }
    };

    return (
        <div className="min-h-screen bg-pink-50 flex items-center justify-center p-4 relative">
            <button
                onClick={() => navigate('/')}
                className="absolute top-4 left-4 p-2 bg-white rounded-full shadow-md text-gray-600 hover:text-primary transition-colors z-10"
                aria-label="Go Back"
            >
                <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md overflow-hidden">
                <div className="bg-gradient-to-r from-primary to-purple-600 p-6 text-center">
                    <h1 className="text-2xl font-bold text-white mb-1">Welcome Back</h1>
                    <p className="text-white/80 text-sm">Login to continue shopping</p>
                </div>

                <div className="p-8">
                    <h2 className="text-xl font-bold text-center mb-6 text-gray-800">Login to Styliqo</h2>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <Input
                            label="Email Address"
                            type="email"
                            placeholder="admin@example.com"
                            {...register('email', { required: 'Email is required' })}
                            error={errors.email?.message}
                        />

                        <Input
                            label="Password"
                            type="password"
                            placeholder="••••••••"
                            {...register('password', { required: 'Password is required' })}
                            error={errors.password?.message}
                        />

                        <div className="flex items-center justify-between text-xs">
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input type="checkbox" className="rounded text-primary focus:ring-primary" />
                                <span className="text-gray-600">Remember Me</span>
                            </label>
                            <span className="text-primary font-bold cursor-pointer hover:underline">Forgot Password?</span>
                        </div>

                        <Button
                            type="submit"
                            className="w-full shadow-md"
                            isLoading={isSubmitting}
                        >
                            Login
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Don't have an account? {' '}
                            <Link to="/register" className="text-primary font-bold hover:underline">
                                Sign Up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
