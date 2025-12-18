// ---------- Products search: type to filter and let the glow guide you ----------
function filterProducts() {
    const input = document.getElementById('searchInput');
    const products = document.getElementsByClassName('product');
    const term = input ? input.value.toLowerCase() : '';
    let visibleCount = 0;

    for (let i = 0; i < products.length; i++) {
        const name = products[i].getAttribute('data-name');
        if (name && name.includes(term)) {
            products[i].style.display = '';
            visibleCount++;
        } else {
            products[i].style.display = 'none';
        }
    }

    const noResults = document.getElementById('noResults');
    if (noResults) {
        noResults.style.display = visibleCount === 0 ? 'block' : 'none';
    }
}
