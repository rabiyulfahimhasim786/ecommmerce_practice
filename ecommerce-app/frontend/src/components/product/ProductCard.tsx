import React from 'react';
import { Product } from '../../types';
import { useCart } from '../../contexts/CartContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { dispatch } = useCart();

  const addToCart = () => {
    dispatch({ type: 'ADD_ITEM', payload: product });
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <img 
        src={product.image_url || '/placeholder-image.jpg'} 
        alt={product.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2 text-gray-800">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {product.description}
        </p>
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-gray-900">${product.price}</span>
          <button
            onClick={addToCart}
            disabled={product.stock_quantity === 0}
            className={`px-4 py-2 rounded transition ${
              product.stock_quantity === 0
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
        {product.stock_quantity > 0 && (
          <p className="text-sm text-gray-500 mt-2">
            {product.stock_quantity} in stock
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductCard;