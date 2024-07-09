const socket = io();

socket.on('productos', data => {
    const currentProductIds = new Set();

    data.forEach(element => {
        const productId = `product-${element._id}`;
        currentProductIds.add(productId);

        let productDiv = document.getElementById(productId);

        if (!productDiv) {
            productDiv = document.createElement('div');
            productDiv.classList.add('product');
            productDiv.id = productId;

            const title = document.createElement('h2');
            title.classList.add('product-title');
            productDiv.appendChild(title);

            const description = document.createElement('p');
            description.classList.add('product-description');
            productDiv.appendChild(description);

            const price = document.createElement('p');
            price.classList.add('product-price');
            productDiv.appendChild(price);

            const stock = document.createElement('p');
            stock.classList.add('product-stock');
            productDiv.appendChild(stock);

            const category = document.createElement('p');
            category.classList.add('product-category');
            productDiv.appendChild(category);

            const id = document.createElement('p');
            id.classList.add('product-id');
            productDiv.appendChild(id);

            const borrar = document.createElement('button');
            borrar.classList.add('button-delete');
            borrar.textContent = 'Borrar';
            borrar.id = `${element._id}`;
            borrar.addEventListener('click', () => {
                socket.emit('deleteProduct', element._id);
            });
            productDiv.appendChild(borrar);

            document.body.appendChild(productDiv);
        }

        productDiv.querySelector('.product-title').textContent = element.title;
        productDiv.querySelector('.product-description').textContent = element.description;
        productDiv.querySelector('.product-price').textContent = `Precio: ${element.price}`;
        productDiv.querySelector('.product-stock').textContent = `Stock: ${element.stock}`;
        productDiv.querySelector('.product-category').textContent = `Categoría: ${element.category}`;
        productDiv.querySelector('.product-id').textContent = `ID: ${element._id}`;
        productDiv.querySelector('.button-delete').id = `delete-${element._id}`;
    });

    document.querySelectorAll('.product').forEach(productDiv => {
        if (!currentProductIds.has(productDiv.id)) {
            productDiv.remove();
        }
    });
});

document.getElementById('add-product-form').addEventListener('submit', (event) => {
    event.preventDefault();

    const title = document.getElementById('product-title').value;
    const description = document.getElementById('product-description').value;
    const price = parseFloat(document.getElementById('product-price').value);
    const stock = parseInt(document.getElementById('product-stock').value);
    const category = document.getElementById('product-category').value;

    const newProduct = { title, description, price, stock, category };

    socket.emit('addProduct', newProduct);
});
