import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../stylesheets/ResultsPage.css';
import bgImage from '../assets/ba1b5feec77ec1fc9d27c36047d092f5787f5336.jpg';
import { useQuiz } from '../context/QuizContext';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

const PRODUCTS_ENDPOINT = 'https://jeval.com.au/collections/hair-care/products.json?page=1';

// Define Product type based on API
interface Product {
  id: number;
  title: string;
  body_html: string;
  tags: string[];
  images: { src: string }[];
  variants: { price: string }[];
}

const ResultsPage = () => {
  const navigate = useNavigate();
  const { resetQuiz, answers } = useQuiz();

  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sliderIndex, setSliderIndex] = useState(0);
  const [wishlist, setWishlist] = useState<number[]>(() => {
    const stored = localStorage.getItem('wishlist');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(PRODUCTS_ENDPOINT);
        const data = await res.json();
        setProducts(data.products || []);
      } catch (err) {
        setError('Failed to fetch products.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    // Filter products based on answers (title, body_html, tags)
    if (!products.length) return;
    const lowerAnswers = answers.map(a => a.toLowerCase());
    const filtered = products.filter((product: Product) => {
      const title = product.title?.toLowerCase() || '';
      const desc = product.body_html?.toLowerCase() || '';
      const tags = (product.tags || []).map((t: string) => t.toLowerCase()).join(' ');
      return lowerAnswers.some(ans =>
        title.includes(ans) || desc.includes(ans) || tags.includes(ans)
      );
    });
    let sorted = filtered.length ? filtered : products;
    // Move wishlisted products to the front
    sorted = [
      ...sorted.filter((p: Product) => wishlist.includes(p.id)),
      ...sorted.filter((p: Product) => !wishlist.includes(p.id)),
    ];
    setFilteredProducts(sorted);
    setSliderIndex(0);
  }, [products, answers, wishlist]);

  const handleReset = () => {
    resetQuiz();
    navigate('/question-1');
  };

  const handlePrev = () => {
    setSliderIndex(i => Math.max(i - 2, 0));
  };
  const handleNext = () => {
    setSliderIndex(i => Math.min(i + 2, filteredProducts.length - 2));
  };

  const toggleWishlist = (id: number) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((wid) => wid !== id) : [...prev, id]
    );
  };

  return (
    <div
      className="results-bg"
      style={{
        ['--results-bg' as any]: `url(${bgImage})`
      }}
    >
      <div className="results-overlay" />
      <div className="results-content">
        <h1 className="results-title">Build you everyday self care routine.</h1>
        <p className="results-desc">
          Perfect for if you're looking for soft, nourished skin, our moisturizing body washes are made with skin-natural nutrients that work with your skin to replenish moisture. With a light formula, the bubbly lather leaves your skin feeling cleansed and cared for. And by choosing relaxing fragrances you can add a moment of calm to the end of your day.
        </p>
        <button
          className="results-retake-btn"
          onClick={handleReset}
        >
          Retake the quiz
        </button>
        <div className="results-slider-section">
          <h2 style={{color: '#fff'}}>Recommended for you</h2>
          {loading ? (
            <div style={{color: '#fff'}}>Loading products...</div>
          ) : error ? (
            <div style={{color: 'red'}}>{error}</div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button onClick={handlePrev} disabled={sliderIndex === 0}>&lt;</button>
              <div style={{ display: 'flex', overflow: 'hidden', width: 500 }}>
                {filteredProducts.slice(sliderIndex, sliderIndex + 2).map((product: Product) => (
                  <div key={product.id} className="results-card" style={{ minWidth: 240, margin: 8, background: '#fff', borderRadius: 8 }}>
                    <img src={product.images?.[0]?.src} alt={product.title} style={{ width: '100%', height: 180, objectFit: 'cover', borderRadius: '8px 8px 0 0' }} draggable={false} />
                    <div className="results-card-title" style={{ fontWeight: 'bold', margin: '8px 0' }}>{product.title}</div>
                    <div className="results-card-price" style={{ color: '#333', marginBottom: 8 }}>
                      ${product.variants?.[0]?.price}
                    </div>
                    <button
                      className="wishlist-btn"
                      onClick={() => toggleWishlist(product.id)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 24 }}
                      aria-label={wishlist.includes(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
                    >
                      {wishlist.includes(product.id) ? <FaHeart color="red" /> : <FaRegHeart color="#aaa" />}
                    </button>
                  </div>
                ))}
              </div>
              <button onClick={handleNext} disabled={sliderIndex + 2 >= filteredProducts.length}>&gt;</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultsPage; 