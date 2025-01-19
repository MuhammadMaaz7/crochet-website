import ProductCard from '../Products/ProductCard';

export default function RelatedProducts({ currentProductId }) {
  const { products } = useProduct();
  const relatedProducts = products.filter((p) => p._id !== currentProductId).slice(0, 4);

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Pacifico, cursive' }}>You May Also Like</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedProducts.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}