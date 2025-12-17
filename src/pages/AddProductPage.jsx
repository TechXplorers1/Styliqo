import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import ConfirmationModal from '../components/common/ConfirmationModal';
import SuccessModal from '../components/common/SuccessModal';
import { addProduct, getProduct, updateProduct, uploadImage } from '../lib/firebase';

const AddProductPage = () => {
    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const { id } = useParams(); // Get ID if in edit mode
    const [loading, setLoading] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [pendingFormData, setPendingFormData] = useState(null);
    const [successModal, setSuccessModal] = useState({ isOpen: false, message: '' });

    const isEditMode = !!id;

    useEffect(() => {
        if (isEditMode) {
            setLoading(true);
            getProduct(id).then(product => {
                if (product) {
                    setValue('title', product.title);
                    setValue('price', product.price);
                    setValue('originalPrice', product.originalPrice);
                    setValue('stockQuantity', product.stockQuantity);
                    setValue('category', product.category);
                    setValue('discount', product.discount);
                    setValue('description', product.description);
                    setValue('productUrl', product.productUrl);
                    if (product.image) {
                        setImagePreview(product.image);
                    }
                }
                setLoading(false);
            }).catch(err => {
                console.error("Error fetching product:", err);
                setLoading(false);
            });
        }
    }, [id, isEditMode, setValue]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const onSubmit = async (data) => {
        // If in edit mode, show confirmation modal first
        if (isEditMode) {
            setPendingFormData(data);
            setShowUpdateModal(true);
            return;
        }

        // For new products, proceed directly
        await performSubmit(data);
    };

    const performSubmit = async (data) => {
        setLoading(true);
        try {
            let imageUrl = imagePreview;

            if (imageFile) {
                // Upload new image if selected
                imageUrl = await uploadImage(imageFile);
            } else if (data.productUrl) {
                // If no file but URL is provided, use URL as image
                imageUrl = data.productUrl;
            } else if (!isEditMode && !imageUrl) {
                // Require image or URL for new products if not provided
                alert("Please select an image or provide a Product URL");
                setLoading(false);
                return;
            }

            const productData = {
                title: data.title,
                price: Number(data.price),
                originalPrice: Number(data.originalPrice),
                stockQuantity: Number(data.stockQuantity),
                category: data.category,
                discount: Number(data.discount),
                description: data.description,
                productUrl: data.productUrl,
                image: imageUrl
            };

            if (isEditMode) {
                await updateProduct(id, productData);
                setSuccessModal({ isOpen: true, message: 'Product updated successfully!' });
            } else {
                await addProduct(productData);
                setSuccessModal({ isOpen: true, message: 'Product added successfully!' });
            }
        } catch (error) {
            console.error("Error saving product:", error);
            if (error.code === 'storage/unauthorized' || error.message.includes('Network Error') || error.message.includes('CORS')) {
                alert("Image upload failed due to permission or network issues.\n\nThis is commonly caused by CORS policy blocks on 'localhost'.\n\nPlease check the instructions in your terminal to fix this, or use an image URL instead.");
            } else {
                alert("Failed to save product: " + error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    if (loading && isEditMode && !imagePreview) {
        return <div className="p-8 text-center">Loading product details...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl bg-white rounded shadow my-8">
            {/* Header with back button */}
            <div className="flex items-center gap-3 mb-6">
                <button
                    onClick={() => navigate('/admin')}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    type="button"
                >
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <h1 className="text-2xl font-bold">{isEditMode ? 'Edit Product' : 'Add New Product'}</h1>
            </div>

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
                        label="Stock Quantity"
                        type="number"
                        placeholder="100"
                        {...register('stockQuantity', { required: 'Stock Quantity is required' })}
                        error={errors.stockQuantity?.message}
                    />
                    <Input
                        label="Discount %"
                        type="number"
                        placeholder="50"
                        {...register('discount')}
                    />
                </div>

                <Input
                    label="Category"
                    placeholder="Sarees"
                    {...register('category', { required: 'Category is required' })}
                    error={errors.category?.message}
                />

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                        className="w-full rounded-md border border-gray-300 p-2 text-sm focus:ring-primary focus:border-primary"
                        rows="4"
                        {...register('description')}
                    ></textarea>
                </div>

                <Input
                    label="Product / Image URL"
                    placeholder="https://example.com/image.jpg"
                    {...register('productUrl')}
                />

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full border border-gray-300 p-2 rounded"
                    />
                    {imagePreview && (
                        <div className="mt-2">
                            <img src={imagePreview} alt="Preview" className="h-32 object-contain border rounded" />
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-3 mt-6">
                    <Button type="button" variant="ghost" onClick={() => navigate('/admin')}>Cancel</Button>
                    <Button type="submit" variant="primary" disabled={loading}>
                        {loading ? 'Saving...' : (isEditMode ? 'Update Product' : 'Add Product')}
                    </Button>
                </div>
            </form>

            {/* Update Confirmation Modal */}
            <ConfirmationModal
                isOpen={showUpdateModal}
                onClose={() => {
                    setShowUpdateModal(false);
                    setPendingFormData(null);
                }}
                onConfirm={() => {
                    setShowUpdateModal(false);
                    if (pendingFormData) {
                        performSubmit(pendingFormData);
                    }
                }}
                title="Update Product?"
                message="Are you sure you want to edit this product?"
                confirmText="Edit"
                confirmVariant="primary"
                cancelText="Cancel"
            />

            {/* Success Modal */}
            <SuccessModal
                isOpen={successModal.isOpen}
                onClose={() => {
                    setSuccessModal({ isOpen: false, message: '' });
                    navigate('/admin');
                }}
                title="Success!"
                message={successModal.message}
            />
        </div>
    );
};

export default AddProductPage;
