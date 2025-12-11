import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

const AddProductPage = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();

    const onSubmit = (data) => {
        // Here we would upload image to Firebase Storage and save doc to Firestore
        console.log(data);
        alert('Product Added Successfully! (Simulation)');
        navigate('/admin');
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl bg-white rounded shadow my-8">
            <h1 className="text-2xl font-bold mb-6">Add New Product</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                    label="Product Title"
                    placeholder="e.g., Silk Saree"
                    {...register('title', { required: 'Title is required' })}
                    error={errors.title?.message}
                />

                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="Price"
                        type="number"
                        placeholder="999"
                        {...register('price', { required: 'Price is required' })}
                        error={errors.price?.message}
                    />
                    <Input
                        label="Original Price"
                        type="number"
                        placeholder="1999"
                        {...register('originalPrice')}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="Category"
                        placeholder="Sarees"
                        {...register('category', { required: 'Category is required' })}
                        error={errors.category?.message}
                    />
                    <Input
                        label="Discount %"
                        type="number"
                        placeholder="50"
                        {...register('discount')}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                        className="w-full rounded-md border border-gray-300 p-2 text-sm focus:ring-primary focus:border-primary"
                        rows="4"
                        {...register('description')}
                    ></textarea>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Image Link (Mock)</label>
                    <Input
                        placeholder="https://..."
                        {...register('image', { required: 'Image URL is required' })}
                        error={errors.image?.message}
                    />
                    <p className="text-xs text-gray-500 mt-1">In real app, this would be a file upload input.</p>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                    <Button type="button" variant="ghost" onClick={() => navigate('/admin')}>Cancel</Button>
                    <Button type="submit" variant="primary">Add Product</Button>
                </div>
            </form>
        </div>
    );
};

export default AddProductPage;
