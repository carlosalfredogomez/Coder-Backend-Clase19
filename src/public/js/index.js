const socket = io()
const productList = document.getElementById('productos')
const thumnailsInput = document.getElementById('thumbnails')
const addProductForm = document.getElementById('add-product-form')
const tbody = productList.querySelector('tbody');

socket.on('newProduct', (product) => {
  const parsedProduct = JSON.parse(product);
  const newRow = document.createElement('tr');
  newRow.innerHTML = `
  <td>${parsedProduct._id}</td>
  <td><input type="text" value="${parsedProduct.title}" contenteditable="true" /></td>
  <td><input type="text" value="${parsedProduct.description}" contenteditable="true" /></td>
  <td><input type="text" value="${parsedProduct.code}" contenteditable="true"  /></td>
  <td><input type="text" value="${parsedProduct.price}" contenteditable="true" /></td>
  <td><input type="text" value="${parsedProduct.status}" contenteditable="true"  /></td>
  <td><input type="text" value="${parsedProduct.stock}" contenteditable="true"  /></td>
  <td><input type="text" value="${parsedProduct.category}" contenteditable="true" /></td>
  <td>
    <button class="editButton" id="editButton_${parsedProduct._id}" onclick="editProduct('${parsedProduct._id}')">Edit</button>
  </td>
  <td>
    <button class="deleteButton" id="deleteButton_${parsedProduct._id}" onclick="deleteProduct('${parsedProduct._id}')">Delete</button>
  </td>
`;

  newRow.setAttribute('id', parsedProduct._id)
  if (tbody) {
    tbody.appendChild(newRow);
  }
});


const getThumbnails = (thumbnails) => {
  const thumbnailsArray = thumbnails ? thumbnails.split(',') : [];
  const thumbnailsArrayTrimmed = thumbnailsArray.map(url => url.trim());
  return thumbnailsArrayTrimmed;
}

addProductForm.addEventListener('submit', e => {
  e.preventDefault();
  const formData = new FormData(addProductForm);
  const thumbnails = getThumbnails(thumnailsInput.value)
  const product = Object.fromEntries(formData.entries());
  const newProduct = {
    ...product,
    thumbnails
  }
  socket.emit('addProduct', JSON.stringify(newProduct))
  addProductForm.reset();
})


socket.on('productDeleted', (productId) => {
  const productItem = document.getElementById(productId)
  if (productItem) {
    productItem.remove()
  }
});

const deleteProduct = (productId) => {
  socket.emit('deleteProduct', productId);
}

const updateProduct = (productId) => {
  const row = document.getElementById(productId);

  const title = row.cells[1].querySelector("input").value;
  const description = row.cells[2].querySelector("input").value;
  const code = row.cells[3].querySelector("input").value;
  const price = row.cells[4].querySelector("input").value;
  const status = row.cells[5].querySelector("input").value;
  const stock = row.cells[6].querySelector("input").value;
  const category = row.cells[7].querySelector("input").value;

  const updatedProduct = {
    title: title,
    description: description,
    code: code,
    price: parseFloat(price),
    status: status,
    stock: parseInt(stock),
    category: category
  }

  socket.emit('updateProduct', productId, updatedProduct);
};

socket.on('updateProductInView', product => {
  const row = document.getElementById(product._id);
  row.cells[1].querySelector("input").value = product.title;
  row.cells[2].querySelector("input").value = product.description;
  row.cells[3].querySelector("input").value = product.code;
  row.cells[4].querySelector("input").value = product.price;
  row.cells[5].querySelector("input").value = product.status;
  row.cells[6].querySelector("input").value = product.stock;
  row.cells[7].querySelector("input").value = product.category;
})

socket.on('notification', notif => {
  Swal.fire({
    text: notif,
    icon: 'info',
    timer: 3000,
  });
})

