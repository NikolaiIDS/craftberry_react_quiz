import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../stylesheets/ResultsPage.css';
import bgImage from '../assets/ba1b5feec77ec1fc9d27c36047d092f5787f5336.jpg';
import { useQuiz } from '../context/QuizContext';

const PRODUCTS_ENDPOINT = 'https://jeval.com.au/collections/hair-care/products.json?page=1';

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

  const isQuizCompleted = answers.every(answer => answer && answer.trim() !== '');
  
  useEffect(() => {
    if (!isQuizCompleted) {
      navigate('/question-1');
    }
  }, [isQuizCompleted, navigate]);

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
    if (!products.length) return;
    
    const validAnswers = answers.filter(a => a && a.trim() !== '').map(a => a.toLowerCase());
    
    if (validAnswers.length === 0) {
      let sorted = [...products];
      sorted = [
        ...sorted.filter((p: Product) => wishlist.includes(p.id)),
        ...sorted.filter((p: Product) => !wishlist.includes(p.id)),
      ];
      setFilteredProducts(sorted);
      setSliderIndex(0);
      return;
    }
    
    const filtered = products.filter((product: Product) => {
      const title = product.title?.toLowerCase() || '';
      const desc = product.body_html?.toLowerCase() || '';
      const tags = (product.tags || []).map((t: string) => t.toLowerCase()).join(' ');
      return validAnswers.some(ans =>
        title.includes(ans) || desc.includes(ans) || tags.includes(ans)
      );
    });
    
    let sorted = filtered.length ? filtered : products;
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
    const currentPage = Math.floor(sliderIndex / 2);
    const prevPage = currentPage - 1;
    if (prevPage >= 0) {
      setSliderIndex(prevPage * 2);
    }
  };
  const handleNext = () => {
    const totalPages = Math.ceil(filteredProducts.length / 2);
    const currentPage = Math.floor(sliderIndex / 2);
    const nextPage = currentPage + 1;
    if (nextPage < totalPages) {
      setSliderIndex(nextPage * 2);
    }
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
        <div className="results-text-container">
          <h1 className="results-title">Build you everyday self care routine.</h1>
          <p className="results-desc">
            Perfect for if you're looking for soft, nourished skin, our moisturizing body washes are made with skin-natural nutrients that work with your skin to replenish moisture. With a light formula, the bubbly lather leaves your skin feeling cleansed and cared for. And by choosing relaxing fragrances you can add a moment of calm to the end of your day.
          </p>
        </div>
        <button
          className="results-retake-btn"
          onClick={handleReset}
        >
          Retake the quiz
        </button>
        <div className="results-slider-section">
          <div className="results-content-wrapper">
            <div className="results-text-card">
              <h2 className="results-slider-title">Our products</h2>
              <p className="results-slider-description">
                Discover our carefully curated selection of premium hair care products designed to refresh, nourish, and revitalize your hair. From hydrating shampoos to strengthening treatments, each product is formulated with natural ingredients to give you healthy, vibrant hair that feels refreshed all day long.
              </p>
            </div>
            <button 
              className="results-slider-arrow"
              onClick={handlePrev} 
              disabled={Math.floor(sliderIndex / 2) === 0}
              aria-label="Previous slide"
            >
              &lt;
            </button>
            <div className="results-slider-wrapper">
              <div className="results-slider-container">
                <div className="results-slider">
                  {filteredProducts.slice(sliderIndex, sliderIndex + 2).map((product: Product) => (
                    <div key={product.id} className="custom-card-narrow">
                      <div className="custom-card-image-container">
                        <img src={product.images?.[0]?.src} alt={product.title} className="results-card-img custom-card-img" draggable={false} />
                        <button
                          className={`wishlist-btn${wishlist.includes(product.id) ? ' active' : ''}`}
                          onClick={() => toggleWishlist(product.id)}
                          aria-label={wishlist.includes(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
                        >
                          {wishlist.includes(product.id) ? (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="red">
                              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                            </svg>
                          ) : (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="#aaa">
                              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                            </svg>
                          )}
                        </button>
                      </div>
                      <div className="results-card-content">
                        <div className="results-card-title">{product.title}</div>
                        <div className="results-card-price">${product.variants?.[0]?.price}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="results-slider-dots">
                  {Array.from({ length: Math.ceil(filteredProducts.length / 2) }, (_, index) => (
                    <svg
                      key={index}
                      width="10" height="10" viewBox="0 0 10 10"
                      className={`results-slider-dot${sliderIndex === index * 2 ? ' active' : ''}`}
                      onClick={() => setSliderIndex(index * 2)}
                      aria-label={`Go to slide ${index + 1}`}
                    >
                      <circle cx="5" cy="5" r="4" />
                    </svg>
                  ))}
                </div>
              </div>
            </div>
            <button 
              className="results-slider-arrow"
              onClick={handleNext} 
              disabled={Math.floor(sliderIndex / 2) + 1 >= Math.ceil(filteredProducts.length / 2)}
              aria-label="Next slide"
            >
              &gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage; 