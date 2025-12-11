import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { registerUser } from '../lib/firebase';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import useAuthStore from '../store/useAuthStore';

const RegisterPage = () => {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
    const navigate = useNavigate();
    const setUser = useAuthStore(state => state.setUser);

    const onSubmit = async (data) => {
        try {
            const userCredential = await registerUser(data.email, data.password, data.fullName);
            setUser(userCredential.user);
            navigate('/');
        } catch (error) {
            console.error(error);
            alert('Registration Failed: ' + error.message);
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
                    <h1 className="text-2xl font-bold text-white mb-1">Join Styliqo</h1>
                    <p className="text-white/80 text-sm">Create an account to start shopping</p>
                </div>

                <div className="p-8">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <Input
                            label="Full Name"
                            placeholder="John Doe"
                            {...register('fullName', { required: 'Name is required' })}
                            error={errors.fullName?.message}
                        />

                        <Input
                            label="Email Address"
                            type="email"
                            placeholder="john@example.com"
                            {...register('email', { required: 'Email is required' })}
                            error={errors.email?.message}
                        />

                        <Input
                            label="Password"
                            type="password"
                            placeholder="••••••••"
                            {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 chars' } })}
                            error={errors.password?.message}
                        />

                        <Button
                            type="submit"
                            className="w-full shadow-md"
                            isLoading={isSubmitting}
                        >
                            Sign Up
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Already have an account? {' '}
                            <Link to="/login" className="text-primary font-bold hover:underline">
                                Login
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
