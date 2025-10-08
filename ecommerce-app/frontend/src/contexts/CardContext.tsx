import React, { createContext, useContext, useReducer } from 'react';
import { CartItem, Product } from '../types';

interface CartState {
  items: CartItem[];
  total: number;
}

type CartAction = 
  | { type: 'ADD_ITEM'; payload: Product }
  | { type: 'REMOVE_ITEM'; payload: number }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: number; quantity: number } }
  | { type: 'CLEAR_CART' };

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM':
      const existingItem = state.items.find(item => item.product.id === action.payload.id);
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.product.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
          total: state.total + action.payload.price
        };
      }
      return {
        ...state,
        items: [...state.items, { product: action.payload, quantity: 1 }],
        total: state.total + action.payload.price
      };
    
    case 'REMOVE_ITEM':
      const itemToRemove = state.items.find(item => item.product.id === action.payload);
      return {
        ...state,
        items: state.items.filter(item => item.product.id !== action.payload),
        total: state.total - (itemToRemove ? itemToRemove.product.price * itemToRemove.quantity : 0)
      };
    
    case 'UPDATE_QUANTITY':
      const itemToUpdate = state.items.find(item => item.product.id === action.payload.productId);
      if (!itemToUpdate) return state;
      
      const quantityDiff = action.payload.quantity - itemToUpdate.quantity;
      return {
        ...state,
        items: state.items.map(item =>
          item.product.id === action.payload.productId
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
        total: state.total + (itemToUpdate.product.price * quantityDiff)
      };
    
    case 'CLEAR_CART':
      return { items: [], total: 0 };
    
    default:
      return state;
  }
};

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
} | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [], total: 0 });

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};