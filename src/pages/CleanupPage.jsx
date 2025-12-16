import React, { useState } from 'react';
import { deleteSareesAndKurtis } from '../lib/firebase';
import Button from '../components/common/Button';
import { Trash2, CheckCircle, AlertCircle } from 'lucide-react';

const CleanupPage = () => {
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [result, setResult] = useState(null);

    const handleCleanup = async () => {
        if (!window.confirm('Are you sure you want to delete all Sarees and Kurtis from the database? This action cannot be undone.')) {
            return;
        }

        setStatus('loading');
        setResult(null);

        try {
            const res = await deleteSareesAndKurtis();
            setResult(res);
            setStatus(res.success ? 'success' : 'error');
        } catch (error) {
            setResult({ success: false, error: error.message });
            setStatus('error');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Trash2 className="w-8 h-8 text-red-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Database Cleanup</h1>
                    <p className="text-gray-600">Remove Sarees and Kurtis products from Firestore</p>
                </div>

                {status === 'idle' && (
                    <div className="space-y-4">
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <p className="text-sm text-yellow-800">
                                <strong>Warning:</strong> This will permanently delete all products in the "Sarees" and "Kurtis" categories from your Firestore database.
                            </p>
                        </div>
                        <Button
                            variant="primary"
                            className="w-full bg-red-600 hover:bg-red-700"
                            onClick={handleCleanup}
                        >
                            <Trash2 className="w-5 h-5 mr-2" />
                            Delete Sarees & Kurtis
                        </Button>
                    </div>
                )}

                {status === 'loading' && (
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-gray-600">Deleting products...</p>
                    </div>
                )}

                {status === 'success' && result && (
                    <div className="space-y-4">
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
                            <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="font-bold text-green-900">Cleanup Successful!</p>
                                <p className="text-sm text-green-700 mt-1">
                                    Deleted {result.deletedCount} products from the database.
                                </p>
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => window.location.href = '/admin'}
                        >
                            Return to Admin Dashboard
                        </Button>
                    </div>
                )}

                {status === 'error' && result && (
                    <div className="space-y-4">
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="font-bold text-red-900">Cleanup Failed</p>
                                <p className="text-sm text-red-700 mt-1">{result.error}</p>
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => setStatus('idle')}
                        >
                            Try Again
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CleanupPage;
