import { createContext, useContext, useState, useCallback } from 'react';
import { Spinner } from '../components/shared/UI/spinner';

const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
    const [loadingState, setLoadingState] = useState({
        isLoading: false,
        message: ''
    });

    const startLoading = useCallback((message = '') => {
        setLoadingState({ isLoading: true, message });
    }, []);

    const stopLoading = useCallback(() => {
        setLoadingState({ isLoading: false, message: '' });
    }, []);

    return (
        <LoadingContext.Provider value={{ ...loadingState, startLoading, stopLoading }}>
            {children}
            {loadingState.isLoading && (
                <Spinner fullPage message={loadingState.message} />
            )}
        </LoadingContext.Provider>
    );
};

export const useLoading = () => {
    const context = useContext(LoadingContext);
    if (!context) {
        throw new Error('useLoading must be used within a LoadingProvider');
    }
    return context;
};
