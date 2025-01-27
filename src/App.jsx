import React, { useState, useEffect, memo } from 'react';
import './App.css';

// Componente para exibir cada produto
const ProductItem = memo(({ product, onAddToCart }) => {
  // Retorna o HTML para exibir o produto
  return (
    <li>
      <img src={product.image} alt={product.title} style={{ width: '100px', height: 'auto' }} />
      <div>
        <h3>{product.title}</h3>
        <p>{product.descriptions}</p>
        <p>Preço: R$ {product.value.toFixed(2)}</p>
        <button onClick={() => onAddToCart(product)}>Adicionar ao Carrinho</button>
      </div>
    </li>
  );
});

// Componente para exibir os detalhes do carrinho
const CartDetails = memo(({ cart, onRemoveFromCart, totalPrice }) => {
  // Retorna o HTML para exibir os detalhes do carrinho
  return (
    <div className="cart-details">
      <ul>
        {Object.values(cart).map((item) => (
          <li key={item.id}>
            <img src={item.image} alt={item.title} className="cart-image" />
            <div>
              <h3>{item.title}</h3>
              <p>Quantidade: {item.quantity}</p>
              <p>Preço: R$ {item.value.toFixed(2)}</p>
            </div>
            <button onClick={() => onRemoveFromCart(item.id)}>Remover</button>
          </li>
        ))}
      </ul>
      <h3>Total: R$ {totalPrice}</h3>
    </div>
  );
});

// Componente principal do aplicativo
const App = () => {
  // Estado do carrinho
  const [products, setProducts] = useState([]); // Produtos disponíveis
  const [cart, setCart] = useState({}); // Itens no carrinho
  const [totalPrice, setTotalPrice] = useState(''); // Preço total do carrinho
  const [cartCount, setCartCount] = useState(0); // Número de itens no carrinho

  // Carregar produtos do arquivo JSON
  useEffect(() => {
    // Faz uma requisição GET para o arquivo JSON
    fetch('/products.json')
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error('Erro ao carregar produtos:', error));
  }, []);

  // Carregar o carrinho do localStorage ao iniciar o componente
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Salvar o carrinho no localStorage sempre que ele mudar
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Carregar o valor total do localStorage
  useEffect(() => {
    const savedTotalPrice = localStorage.getItem('totalPrice');
    if (savedTotalPrice) {
      setTotalPrice(savedTotalPrice);
    }
  }, []);

  // Atualizar o totalPrice no localStorage
  useEffect(() => {
    const totalPrice = Object.values(cart).reduce((total, item) => total + item.value * item.quantity, 0).toFixed(2);
    setTotalPrice(totalPrice);
    localStorage.setItem('totalPrice', totalPrice);
  }, [cart]);

  // Atualizar o cartCount
  useEffect(() => {
    const cartCount = Object.values(cart).reduce((total, item) => total + item.quantity, 0);
    setCartCount(cartCount);
  }, [cart]);

  // Função para adicionar um produto ao carrinho
  const addToCart = (product) => {
    setCart((prevCart) => {
      const newCart = { ...prevCart };
      if (newCart[product.id]) {
        newCart[product.id].quantity += 1;
      } else {
        newCart[product.id] = { ...product, quantity: 1 };
      }
      return newCart;
    });
  };

  // Função para remover um produto do carrinho
  const removeFromCart = (productId) => {
    setCart((prevCart) => {
      const newCart = { ...prevCart };
      if (newCart[productId].quantity > 1) {
        newCart[productId].quantity -= 1;
      } else {
        delete newCart[productId];
      }
      return newCart;
    });
  };

  // Função para obter o número total de itens no carrinho
  const getTotalItems = () => {
    return Object.values(cart).reduce((total, item) => total + item.quantity, 0);
  };

  // Retorna o HTML para exibir o aplicativo
  return (
    <div>
      <div className='h1'>
        <h1>Carrinho de Compras</h1>
        <span className="cart-icon">
          <img src="https://cdn-icons-png.flaticon.com/512/5166/5166615.png" alt="Ícone do carrinho" className='iconeCarrinho' />
          <span className="cart-count">{cartCount}</span>
        </span>
      </div>
      <h2>Produtos</h2>
      <ul>
        {products.map((product) => (
          <ProductItem key={product.id} product={product} onAddToCart={addToCart} />
        ))}
      </ul>
      <h2>Itens no Carrinho: {getTotalItems()}</h2>
      <h3>Detalhes do Carrinho:</h3>
      <CartDetails cart={cart} onRemoveFromCart={removeFromCart} totalPrice={totalPrice} />
    </div>
  );
};

// Exporta o componente App
export default App;