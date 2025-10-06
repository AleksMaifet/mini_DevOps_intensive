import {useEffect, useState} from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard.jsx';

const HomePage = ({searchQuery}) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalCount: 0,
        hasNext: false,
        hasPrev: false
    });

    const fetchProducts = async (page = 1, search = '') => {
        try {
            setLoading(true);
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/products`, {
                params: {
                    page,
                    limit: 12,
                    search
                }
            });

            setProducts(response.data.products);
            setPagination(response.data.pagination);
            setError(null);
        } catch (err) {
            console.error('Ошибка при загрузке товаров:', err);
            setError('Ошибка при загрузке товаров. Проверьте, что бэкенд запущен на порту 8080');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts(1, searchQuery);
    }, [searchQuery]);

    const handlePageChange = (page) => {
        fetchProducts(page, searchQuery);
    };

    if (loading) {
        return (
            <div className="loading">
                <div>🔄 Загружаем товары...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error">
                ❌ {error}
                <br/>
                <div style={{marginTop: '1rem', fontSize: '0.9rem'}}>
                    Убедитесь, что бэкенд запущен: <code>npm run dev:backend</code>
                </div>
            </div>
        );
    }

    return (
        <div className="home-page">

            {/* Search Results */}
            {searchQuery && (
                <div className="search-results">
                    🔍 Результаты поиска: "{searchQuery}"
                </div>
            )}

            {/* Products Section */}
            <div className="products-section">
                {products.length === 0 ? (
                    <div className="no-products">
                        😔 Товары не найдены
                    </div>
                ) : (
                    <>
                        <div className="products-grid">
                            {products.map((product) => (
                                <ProductCard key={product.id} product={product}/>
                            ))}
                        </div>

                        {pagination.totalPages > 1 && (
                            <div className="pagination">
                                <button
                                    className="pagination-button"
                                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                                    disabled={!pagination.hasPrev}
                                >
                                    ← Назад
                                </button>

                                {Array.from({length: pagination.totalPages}, (_, i) => i + 1).map((page) => (
                                    <button
                                        key={page}
                                        className={`pagination-button ${page === pagination.currentPage ? 'active' : ''}`}
                                        onClick={() => handlePageChange(page)}
                                    >
                                        {page}
                                    </button>
                                ))}

                                <button
                                    className="pagination-button"
                                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                                    disabled={!pagination.hasNext}
                                >
                                    Вперед →
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default HomePage;