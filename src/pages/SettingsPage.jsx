import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { updateProfile } from 'firebase/auth'; // Import direct from firebase/auth
import { ArrowLeft, User, Moon, Sun, Save, Check } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import useThemeStore from '../store/useThemeStore';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { auth } from '../lib/firebase'; // Ensure we have the auth instance

const SettingsPage = () => {
    const navigate = useNavigate();
    const { user, setUser } = useAuthStore();
    const { isDarkMode, toggleTheme } = useThemeStore();
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const { register, handleSubmit, setValue } = useForm({
        defaultValues: {
            displayName: user?.displayName || '',
        }
    });

    useEffect(() => {
        if (user?.displayName) {
            setValue('displayName', user.displayName);
        }
    }, [user, setValue]);

    const onSubmit = async (data) => {
        if (!auth.currentUser) return;
        setLoading(true);
        setSuccessMessage('');

        try {
            await updateProfile(auth.currentUser, {
                displayName: data.displayName
            });

            // Update local store
            setUser({ ...user, displayName: data.displayName });

            setSuccessMessage('Profile updated successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Failed to update profile.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`min-h-screen pb-20 md:pb-8 transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
            <div className={`bg-gradient-to-r ${isDarkMode ? 'from-gray-800 to-gray-900 border-b border-gray-700' : 'from-pink-600 via-purple-600 to-indigo-600'} text-white shadow-lg mb-8`}>
                <div className="container mx-auto px-4 py-8">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/profile')}
                            className="p-2 hover:bg-white/20 rounded-full transition-colors"
                        >
                            <ArrowLeft className="w-6 h-6" />
                        </button>
                        <h1 className="text-3xl font-bold">Settings</h1>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 max-w-2xl space-y-6">

                {/* Profile Settings */}
                <div className={`rounded-2xl shadow-sm p-6 ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'}`}>
                    <div className="flex items-center gap-3 mb-6">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-gray-700 text-purple-400' : 'bg-purple-100 text-purple-600'}`}>
                            <User className="w-5 h-5" />
                        </div>
                        <h2 className="text-xl font-bold">Profile Settings</h2>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <Input
                                label="Display Name"
                                placeholder="Enter your name"
                                {...register('displayName', { required: 'Name is required' })}
                                className={`${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : ''}`}
                                labelClassName={`${isDarkMode ? 'text-gray-300' : ''}`}
                            />
                        </div>

                        <div className="flex items-center justify-between mt-6">
                            {successMessage && (
                                <div className="flex items-center text-green-500 text-sm font-medium animate-in fade-in">
                                    <Check className="w-4 h-4 mr-1" />
                                    {successMessage}
                                </div>
                            )}
                            <div className={successMessage ? '' : 'ml-auto'}>
                                <Button type="submit" variant="primary" disabled={loading} className="flex items-center gap-2">
                                    <Save className="w-4 h-4" />
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Appearance Settings */}
                <div className={`rounded-2xl shadow-sm p-6 ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'}`}>
                    <div className="flex items-center gap-3 mb-6">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-gray-700 text-amber-400' : 'bg-amber-100 text-amber-600'}`}>
                            {isDarkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                        </div>
                        <h2 className="text-xl font-bold">Appearance</h2>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-xl border transition-colors ${isDarkMode ? 'border-gray-700 bg-gray-700/30' : 'border-gray-100 bg-gray-50'}">
                        <div>
                            <div className="font-medium mb-1">Dark Mode</div>
                            <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                Switch between light and dark themes
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={toggleTheme}
                            className={`w-14 h-7 rounded-full p-1 transition-colors duration-300 ease-in-out ${isDarkMode ? 'bg-purple-600' : 'bg-gray-200'}`}
                        >
                            <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${isDarkMode ? 'translate-x-7' : 'translate-x-0'}`} />
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default SettingsPage;
