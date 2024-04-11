// Function to fetch data from the server
function fetchData(url) {
    return fetch(url).then(response => response.json());
  }
  
  // Function to render product details
function renderProduct(product) {
  const productsContainer = document.getElementById('products');
  if (!productsContainer) {
      console.error('Products container not found!');
      return;
  }

  const cartData = JSON.parse(localStorage.getItem('cart')) || [];
  const existingProduct = cartData.find(item => item.title === product.title);

  const productDiv = document.createElement('div');
  productDiv.classList.add('product');
  productDiv.innerHTML = `
      <img src="${product.image}" alt="${product.title}">
      <h3>${product.title}</h3>
      <p>Price: $${product.price}</p>
      <p>Compare_at_Price: $${product.compare_at_price}</p>
      <p class="vendor">Vendor: ${product.vendor}</p>
      ${product.badge_text ? `<span class="badge">${product.badge_text}</span>` : ''}
      <h6 class="text">${product.badge_text}</h6>
      <button class="add-to-cart-button" data-product='${JSON.stringify(product)}'>
          ${existingProduct ? `Add to Cart (${existingProduct.quantity})` : 'Add to Cart'}
      </button>
  `;
  productsContainer.appendChild(productDiv);
}

  
  // Function to render products based on category
  function filterProducts(category) {
    fetchData('https://cdn.shopify.com/s/files/1/0564/3685/0790/files/multiProduct.json')
      .then(data => {
        const productsContainer = document.getElementById('products');
        if (!productsContainer) {
          console.error('Products container not found!');
          return;
        }
  
        productsContainer.innerHTML = '';
        data.categories.forEach(cat => {
          if (cat.category_name.toLowerCase() === category.toLowerCase() || category === 'all') {
            cat.category_products.forEach(product => renderProduct(product));
          }
        });
      });
  }
  
  // Function to search products
  function searchProducts() {
    const searchInput = document.getElementById('searchInput').value.trim().toLowerCase();
    fetchData('https://cdn.shopify.com/s/files/1/0564/3685/0790/files/multiProduct.json')
      .then(data => {
        const productsContainer = document.getElementById('products');
        
        productsContainer.innerHTML = '';
        data.categories.forEach(category => {
          category.category_products.forEach(product => {
            if (product.title.toLowerCase().includes(searchInput) ||
                product.vendor.toLowerCase().includes(searchInput) ||
                (product.badge_text && product.badge_text.toLowerCase().includes(searchInput)) ||
                category.category_name.toLowerCase() === searchInput) {
              renderProduct(product);
            }
          });
        });
      });
  }
// Event listener for Add to Cart button clicks
document.addEventListener('click', function(event) {
  if (event.target.classList.contains('add-to-cart-button')) {
      const product = JSON.parse(event.target.getAttribute('data-product'));
      const quantity = 1; // Assume default quantity of 1 for now

      // Confirm with the user before adding the product to the cart
      const confirmed = confirm('Are you sure you want to add this product to the cart?');
      if (confirmed) {
          let message = '';
          const cart = JSON.parse(localStorage.getItem('cart')) || [];
          const existingProduct = cart.find(item => item.title === product.title);

          if (existingProduct) {
              existingProduct.quantity++; // Increase quantity if product already exists in cart
              message = `Product added to cart. Total quantity for "${existingProduct.title}" in cart: ${existingProduct.quantity}`;
          } else {
              cart.push({ ...product, quantity }); // Include quantity in the product object
              message = 'Product added to cart successfully!';
          }
          
          localStorage.setItem('cart', JSON.stringify(cart));
        alert(message);

        // Update the button text with the updated quantity
        const addButton = event.target;
        const updatedProduct = cart.find(item => item.title === product.title);
        addButton.textContent = `Add to Cart (${updatedProduct.quantity})`;

      }
  }
});


// Function to delete item from cart
function deleteItem(index) {
  let cartData = JSON.parse(localStorage.getItem('cart'));
  if (cartData[index].quantity > 1) {
      // If the quantity is more than 1, decrement it by 1
      cartData[index].quantity--;
  } else {
      // If the quantity is 1, remove the item from the cart
      cartData.splice(index, 1);
  }
  localStorage.setItem('cart', JSON.stringify(cartData));
  location.reload(); // Refresh the page to reflect changes
}





// Function to calculate total amount
function calculateTotalAmount(cartData) {
  return cartData.reduce((total, item) => total + (item.price * item.quantity), 0);
}

document.addEventListener('DOMContentLoaded', function() {
    const cartData = JSON.parse(localStorage.getItem('cart'));
    const cartItemsContainer = document.getElementById('cart-items');
    const totalAmountElement = document.getElementById('total-amount');
    
    if (cartData && cartData.length > 0) {
        cartData.forEach(product => {
            renderCartItem(product);
        });
        const totalAmount = calculateTotalAmount(cartData);
        totalAmountElement.textContent = `Total Amount: $${totalAmount.toFixed(2)}`;
    } else {
        cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
        totalAmountElement.textContent = 'Total Amount: $0.00';
    }
});


    document.querySelectorAll('.button').forEach(button => {
        button.addEventListener('click', () => {
            const category = button.textContent.toLowerCase();
            fetchData('https://cdn.shopify.com/s/files/1/0564/3685/0790/files/multiProduct.json')
                .then(data => {
                    const productsContainer = document.getElementById('products');
                    productsContainer.innerHTML = '';
                    data.categories.forEach(cat => {
                        if (cat.category_name.toLowerCase() === category || category === 'all') {
                            cat.category_products.forEach(product => renderProduct(product));
                        }
                    });
                });
        });
    });
    
    document.getElementById('searchInput').addEventListener('keyup', () => {
        const searchInput = document.getElementById('searchInput').value.trim().toLowerCase();
        fetchData('https://cdn.shopify.com/s/files/1/0564/3685/0790/files/multiProduct.json')
            .then(data => {
                const productsContainer = document.getElementById('products');
                productsContainer.innerHTML = '';
                data.categories.forEach(category => {
                    category.category_products.forEach(product => {
                        if (product.title.toLowerCase().includes(searchInput) || 
                            product.vendor.toLowerCase().includes(searchInput) || 
                            (product.badge_text && product.badge_text.toLowerCase().includes(searchInput)) ||
                            category.category_name.toLowerCase() == searchInput) {
                            renderProduct(product);
                        }
                    });
                });
            });
    });
    
    fetchData('https://cdn.shopify.com/s/files/1/0564/3685/0790/files/multiProduct.json')
        .then(data => {
            data.categories.forEach(category => category.category_products.forEach(product => renderProduct(product)));
    });