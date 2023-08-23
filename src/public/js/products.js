
document.addEventListener('DOMContentLoaded', () => {
  const addToCartButtons = document.querySelectorAll('.addToCartBtn');
  
  addToCartButtons.forEach(button => {
    button.addEventListener('click', async () => {
      const productId = button.getAttribute('data-product-id');

      try {
        const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ quantity: 1 }) 
        });

        if (response.ok) {
          
        } else {
          console.error('Error al agregar al carrito:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Error al enviar la solicitud:', error);
      }
    });
  });
});
