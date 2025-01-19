import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Landing/Navbar';
import Footer from '../components/Landing/Footer';
import ProductImageGallery from '../components/ProductDetail/ProductImageGallery';
import ProductInfo from '../components/ProductDetail/ProductInfo';
// import RelatedProducts from '../components/ProductDetail/RelatedProducts';
import { getProductById } from '../services/productService'; // Import getProductById

export default function ProductDetailPage() {
  const { productId } = useParams(); // Get the productId from the URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(productId); // Fetch product by ID
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
        setError('Product not found');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-pink-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
          {/* Product Images */}
          <ProductImageGallery images={product.images} />

          {/* Product Info */}
          <ProductInfo product={product} />
        </div>

        {/* Related Products */}
        {/* <RelatedProducts currentProductId={product._id} /> */}
      </main>

      <Footer />
    </div>
  );
}