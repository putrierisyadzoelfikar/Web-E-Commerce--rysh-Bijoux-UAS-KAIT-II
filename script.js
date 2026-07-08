// Data Default dengan Jalur File Gambar dari Folder assets/
const initialProducts = [
    { id: 1, name: "Céleste Ring", category: "La Promesse", price: 699000, img: "assets/celeste-ring.jpg", stock: 10, desc: "Crafted from premium 925 Sterling Silver finished with a thick layer of 18K Gold Plating for a luxurious shine." },
    { id: 2, name: "Élise Ring", category: "La Promesse", price: 749000, img: "assets/elise-ring.jpg", stock: 5, desc: "Exclusive sapphire cut wrapped in stunning 18-karat white gold that captivates the eye flawlessly." },
    { id: 3, name: "Étoile Necklace", category: "Lumière", price: 1099000, img: "assets/etoile-necklace.jpg", stock: 7, desc: "A sparkling star pendant necklace radiating the elegance and subtle cosmic beauty of modern women." },
    { id: 4, name: "Amour Necklace", category: "Lumière", price: 1199000, img: "assets/amour-necklace.jpg", stock: 4, desc: "Heart-designed premium necklace full of artistic detail, perfect for eternal promise tokens." },
    { id: 5, name: "Aurora Earrings", category: "Éclat", price: 599000, img: "assets/aurora-earrings.jpg", stock: 12, desc: "Earrings adorned with beautiful opal stones reflecting the magical iridescent Northern Lights dawn." },
    { id: 6, name: "Pearl Drop Earrings", category: "Éclat", price: 699000, img: "assets/pearl-drop-earrings.jpg", stock: 8, desc: "Specially selected organic natural saltwater pearls showcasing legendary white luxurious luster." },
    { id: 7, name: "Grace Bracelet", category: "Grâce", price: 799000, img: "assets/grace-bracelet.jpg", stock: 3, desc: "Gold solid chain bracelet with an exclusive complex finely woven pattern built by master artisans." },
    { id: 8, name: "Éternité Bracelet", category: "Grâce", price: 899000, img: "assets/eternite-bracelet.jpg", stock: 6, desc: "A flawless symbol of an infinite bond entirely encrusted with the finest micro diamonds gems." },
    { id: 9, name: "Luna Anklet", category: "Rêverie", price: 499000, img: "assets/luna-anklet.jpg", stock: 15, desc: "Luxury delicate anklet decorated with a graceful tiny polished crescent moon gold ornament." },
    { id: 10, name: "Fleur Anklet", category: "Rêverie", price: 549000, img: "assets/fleur-anklet.jpg", stock: 2, desc: "Flower petal soft motif anklet masterfully crafted from solid rare Indonesian rose gold." }
];

// PEMBERSIH OTOMATIS BENTROK DATA: Jika di LocalStorage masih ada emoji (ciri khas ada simbol 💍), langsung reset total ke asset gambar.
let storedProducts = localStorage.getItem('erysh_products');
if (storedProducts && storedProducts.includes('💍')) {
    localStorage.removeItem('erysh_products');
    storedProducts = null;
}

let products = JSON.parse(storedProducts) || initialProducts;
if(!localStorage.getItem('erysh_products')) {
    localStorage.setItem('erysh_products', JSON.stringify(products));
}

let cart = JSON.parse(localStorage.getItem('belanjo_cart')) || [];
let currentCategory = 'all';
let searchQuery = '';
let maxPrice = 3000000;

function showPage(pageId) {
    document.querySelectorAll('.page-section').forEach(p => p.classList.add('hidden'));
    const targetPage = document.getElementById(pageId);
    if(targetPage) targetPage.classList.remove('hidden');
    
    if(pageId === 'admin-page') {
        renderAdminTable();
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// FIX: Menggunakan tag <img> untuk merender visual asset dari folder lokal
function renderProducts() {
    const grid = document.getElementById('productGrid');
    if(!grid) return;
    grid.innerHTML = '';
    
    const filtered = products.filter(p => 
        (currentCategory === 'all' || p.category === currentCategory) && 
        p.price <= maxPrice &&
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    if(filtered.length === 0) {
        grid.innerHTML = `<div class="col-span-full text-center text-gray-400 py-12 bg-white rounded-2xl border border-dashed"><p class="text-sm">Jewelry Collection is Not Found.</p></div>`;
        return;
    }

    filtered.forEach(p => {
        const isOutOfStock = p.stock <= 0;
        grid.innerHTML += `
            <div class="bg-white rounded-2xl p-6 border border-gray-100 flex flex-col justify-between group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div class="cursor-pointer" onclick="openDetail(${p.id})">
                    <div class="w-full h-40 bg-ivory rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300 relative overflow-hidden">
                        <img src="${p.img}" alt="${p.name}" class="w-full h-full object-cover rounded-xl" onerror="this.onerror=null; this.src='https://placehold.co/400x400?text=No+Image';">
                        <span class="absolute top-2 right-2 ${isOutOfStock ? 'bg-red-500 text-white' : 'bg-white/80 text-gray-500'} text-[9px] font-bold px-2 py-0.5 rounded-full">
                            ${isOutOfStock ? 'Habis' : `Stok: ${p.stock}`}
                        </span>
                    </div>
                    <span class="text-[10px] uppercase font-bold tracking-widest text-gold">${p.category} Collection</span>
                    <h3 class="font-title font-bold text-darkBlack text-lg mt-1 group-hover:text-gold transition-colors">${p.name}</h3>
                    <p class="text-sm font-semibold text-gray-700 mt-2">Rp ${parseInt(p.price).toLocaleString('id-ID')}</p>
                </div>
                <button onclick="addToCart(${p.id})" ${isOutOfStock ? 'disabled class="mt-4 w-full bg-gray-300 text-gray-500 text-xs py-2.5 rounded-xl uppercase tracking-wider font-medium cursor-not-allowed"' : 'class="mt-4 w-full bg-darkBlack text-white text-xs py-2.5 rounded-xl uppercase tracking-wider font-medium hover:bg-gold transition shadow-sm active:scale-95 duration-150"'} >
                    ${isOutOfStock ? 'Out of Stock' : '+ Add To Cart'}
                </button>
            </div>`;
    });
}

function filterCategory(e, category) { 
    currentCategory = category; 
    const buttons = document.querySelectorAll('#categoryButtons button');
    buttons.forEach(btn => {
        btn.classList.remove('bg-darkBlack', 'text-white');
        btn.classList.add('bg-white', 'text-gray-600');
    });
    if (e && e.currentTarget) {
        e.currentTarget.classList.remove('bg-white', 'text-gray-600');
        e.currentTarget.classList.add('bg-darkBlack', 'text-white');
    }
    renderProducts();
}

function handleSearch() {
    searchQuery = document.getElementById('searchInput').value;
    renderProducts();
}

function handlePriceFilter(val) {
    maxPrice = parseInt(val);
    document.getElementById('priceLabel').innerText = `Rp ${maxPrice.toLocaleString('id-ID')}`;
    renderProducts();
}

// FIX: Menggunakan tag <img> untuk modal detail produk
function openDetail(id) {
    const product = products.find(p => p.id === id);
    if(!product) return;
    const content = document.getElementById('modalContent');
    const isOutOfStock = product.stock <= 0;
    
    content.innerHTML = `
        <div class="text-center">
            <div class="w-40 h-40 mx-auto mb-4 overflow-hidden rounded-xl bg-ivory flex items-center justify-center">
                <img src="${product.img}" alt="${product.name}" class="w-full h-full object-cover rounded-xl" onerror="this.onerror=null; this.src='https://placehold.co/400x400?text=No+Image';">
            </div>
            <span class="text-xs uppercase text-gold font-bold tracking-wider">${product.category} Line Artisan</span>
            <h3 class="text-2xl font-bold font-title text-darkBlack my-2">${product.name}</h3>
            <p class="text-gray-600 text-sm px-2 my-4 font-light leading-relaxed">${product.desc}</p>
            <p class="text-sm text-gray-500 mb-2">Sisa Stok di Gudang: <span class="font-bold text-darkBlack">${product.stock}</span></p>
            <p class="text-2xl font-bold text-gold mb-6">Rp ${parseInt(product.price).toLocaleString('id-ID')}</p>
            <button onclick="addToCart(${product.id}); closeModal();" ${isOutOfStock ? 'disabled class="w-full bg-gray-300 text-gray-500 text-sm py-3.5 rounded-xl font-bold uppercase tracking-widest cursor-not-allowed"' : 'class="w-full bg-darkBlack text-gold text-sm py-3.5 rounded-xl font-bold uppercase tracking-widest hover:bg-gold hover:text-white transition"'} >
                ${isOutOfStock ? 'Stok Habis' : 'Acquire Asset & Add To Cart'}
            </button>
        </div>`;
    document.getElementById('detailModal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('detailModal').classList.add('hidden');
}

function toggleCartModal() {
    document.getElementById('cartModal').classList.toggle('hidden');
}

function addToCart(id) {
    const product = products.find(p => p.id === id);
    if(!product) return;
    
    const exist = cart.find(item => item.id === id);
    const currentQtyInCart = exist ? exist.quantity : 0;
    
    if (currentQtyInCart >= product.stock) {
        alert(`Maaf, Anda tidak bisa menambah barang lagi. Batas maksimal stok yang tersedia adalah ${product.stock} pcs.`);
        return;
    }

    if(exist) {
        exist.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    updateCartUI();
}

function changeQty(id, delta) {
    const item = cart.find(i => i.id === id);
    const product = products.find(p => p.id === id);
    if(!item || !product) return;
    
    if (delta > 0 && item.quantity >= product.stock) {
        alert(`Gagal menambah kuantitas. Stok produk hanya tersisa ${product.stock} pcs.`);
        return;
    }
    
    item.quantity += delta;
    if(item.quantity <= 0) {
        removeFromCart(id);
    } else {
        updateCartUI();
    }
}

function removeFromCart(id) {
    cart = cart.filter(i => i.id !== id);
    updateCartUI();
}

// FIX: Menggunakan tag <img> berukuran kecil untuk thumbnail keranjang belanja
function updateCartUI() {
    localStorage.setItem('belanjo_cart', JSON.stringify(cart));
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    document.getElementById('cartCount').innerText = count;
    document.getElementById('cartTotal').innerText = `Rp ${total.toLocaleString('id-ID')}`;
    
    const list = document.getElementById('cartItemsList');
    if(list) {
        list.innerHTML = '';
        if(cart.length === 0) {
            list.innerHTML = `<div class="text-center py-12"><span class="text-4xl block mb-2">🛍️</span><p class="text-gray-400 text-sm">Shopping Cart is Empty.</p></div>`;
        } else {
            cart.forEach(item => {
                list.innerHTML += `
                    <div class="flex items-center justify-between border-b pb-3 border-gray-100">
                        <div class="flex items-center space-x-3">
                            <div class="w-12 h-12 bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center border">
                                <img src="${item.img}" alt="${item.name}" class="w-full h-full object-cover" onerror="this.onerror=null; this.src='https://placehold.co/100x100?text=No';">
                            </div>
                            <div>
                                <h4 class="font-bold text-sm text-darkBlack">${item.name}</h4>
                                <p class="text-xs text-gold font-medium">Rp ${parseInt(item.price).toLocaleString('id-ID')} x ${item.quantity}</p>
                            </div>
                        </div>
                        <div class="flex items-center space-x-2">
                            <button onclick="changeQty(${item.id}, -1)" class="bg-gray-100 text-xs px-2.5 py-1 rounded-md hover:bg-gray-200 font-bold">-</button>
                            <span class="text-sm font-bold w-4 text-center">${item.quantity}</span>
                            <button onclick="changeQty(${item.id}, 1)" class="bg-gray-100 text-xs px-2.5 py-1 rounded-md hover:bg-gray-200 font-bold">+</button>
                            <button onclick="removeFromCart(${item.id})" class="text-red-400 hover:text-red-600 text-xs pl-2 transition">Remove</button>
                        </div>
                    </div>`;
            });
        }
    }

    const checkSummary = document.getElementById('checkoutItemsList');
    if(checkSummary && !document.getElementById('checkout-page').classList.contains('hidden')) {
        checkSummary.innerHTML = '';
        cart.forEach(item => {
            checkSummary.innerHTML += `
                <div class="flex justify-between items-center text-sm text-gray-600">
                    <span>${item.name} (x${item.quantity})</span>
                    <span class="font-semibold">Rp ${(item.price * item.quantity).toLocaleString('id-ID')}</span>
                </div>`;
        });
        document.getElementById('checkoutSubtotal').innerText = `Rp ${total.toLocaleString('id-ID')}`;
        document.getElementById('checkoutTotal').innerText = `Rp ${total.toLocaleString('id-ID')}`;
    }
}

function goToCheckoutPage() {
    if(cart.length === 0) {
        alert('Keranjang belanja Anda masih kosong!');
        return;
    }
    toggleCartModal();
    showPage('checkout-page');
    updateCartUI();
}

function processPayment(e) {
    e.preventDefault();
    const num = document.getElementById('billingPhone').value;
    if(num.length < 10) {
        document.getElementById('phoneError').classList.remove('hidden');
        return;
    }
    document.getElementById('phoneError').classList.add('hidden');
    
    for (let item of cart) {
        const targetProduct = products.find(p => p.id === item.id);
        if (!targetProduct || targetProduct.stock < item.quantity) {
            alert(`Transaksi Gagal! Stok untuk produk "${item.name}" tidak mencukupi.`);
            return;
        }
    }

    cart.forEach(item => {
        const targetProduct = products.find(p => p.id === item.id);
        if (targetProduct) {
            targetProduct.stock -= item.quantity;
        }
    });

    localStorage.setItem('erysh_products', JSON.stringify(products));

    const gateway = document.querySelector('input[name="paymentGateway"]:checked').value;
    alert(`[SIMULASI API GATEWAY SUKSES]\n\nMetode: ${gateway}\nNama: ${document.getElementById('billingName').value}\nTotal Nilai Asset: ${document.getElementById('checkoutTotal').innerText}\n\nStatus Transaksi: SETTLED (Lunas). Stok produk otomatis terpotong.`);
    
    cart = [];
    updateCartUI();
    document.getElementById('checkoutForm').reset();
    renderProducts();
    showPage('katalog-page');
}

// FIX: Menggunakan tag <img class="w-12 h-12"> untuk thumbnail pratinjau di baris Tabel Manajemen Admin
function renderAdminTable() {
    const tbody = document.getElementById('adminTableBody');
    if(!tbody) return;
    tbody.innerHTML = '';

    products.forEach(p => {
        tbody.innerHTML += `
            <tr class="hover:bg-gray-50 transition">
                <td class="p-4 w-24 text-center">
                    <div class="w-12 h-12 mx-auto overflow-hidden rounded-lg bg-gray-50 border flex items-center justify-center">
                        <img src="${p.img}" alt="${p.name}" class="w-full h-full object-cover" onerror="this.onerror=null; this.src='https://placehold.co/100x100?text=No';">
                    </div>
                </td>
                <td class="p-4 font-bold text-darkBlack">${p.name}</td>
                <td class="p-4"><span class="bg-gray-100 text-gray-600 text-xs font-semibold px-2.5 py-1 rounded-full">${p.category}</span></td>
                <td class="p-4 font-semibold text-gold">Rp ${parseInt(p.price).toLocaleString('id-ID')}</td>
                <td class="p-4 font-bold ${p.stock <= 2 ? 'text-red-500' : 'text-gray-700'}">${p.stock} Pcs</td>
                <td class="p-4 text-center space-x-2">
                    <button onclick="openAdminEditModal(${p.id})" class="text-blue-500 hover:text-blue-700 font-semibold text-xs border border-blue-200 px-2.5 py-1 rounded-md bg-blue-50/50 hover:bg-blue-50 transition">Edit</button>
                    <button onclick="deleteAdminProduct(${p.id})" class="text-red-500 hover:text-red-700 font-semibold text-xs border border-red-200 px-2.5 py-1 rounded-md bg-red-50/50 hover:bg-red-50 transition">Hapus</button>
                </td>
            </tr>`;
    });
}

function openAdminAddModal() {
    document.getElementById('adminForm').reset();
    document.getElementById('adminProductId').value = '';
    document.getElementById('adminModalTitle').innerText = 'Tambah Koleksi Perhiasan Baru';
    document.getElementById('adminModal').classList.remove('hidden');
}

function openAdminEditModal(id) {
    const p = products.find(prod => prod.id === id);
    if(!p) return;
    document.getElementById('adminProductId').value = p.id;
    document.getElementById('adminProductImg').value = p.img;
    document.getElementById('adminProductName').value = p.name;
    document.getElementById('adminProductCategory').value = p.category;
    document.getElementById('adminProductPrice').value = p.price;
    document.getElementById('adminProductStock').value = p.stock;
    document.getElementById('adminProductDesc').value = p.desc;
    
    document.getElementById('adminModalTitle').innerText = 'Edit Rincian Koleksi Masterpiece';
    document.getElementById('adminModal').classList.remove('hidden');
}

function closeAdminModal() {
    document.getElementById('adminModal').classList.add('hidden');
}

function saveAdminProduct(e) {
    e.preventDefault();
    const id = document.getElementById('adminProductId').value;
    const img = document.getElementById('adminProductImg').value;
    const name = document.getElementById('adminProductName').value;
    const category = document.getElementById('adminProductCategory').value;
    const price = parseInt(document.getElementById('adminProductPrice').value);
    const stock = parseInt(document.getElementById('adminProductStock').value);
    const desc = document.getElementById('adminProductDesc').value;

    if(id) {
        const index = products.findIndex(p => p.id == id);
        if(index !== -1) {
            products[index] = { id: parseInt(id), name, category, price, img, stock, desc };
        }
    } else {
        const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
        products.push({ id: newId, name, category, price, img, stock, desc });
    }

    localStorage.setItem('erysh_products', JSON.stringify(products));
    renderAdminTable();
    renderProducts();
    closeAdminModal();
    alert('Konfigurasi data perhiasan & jumlah stok berhasil diperbarui!');
}

function deleteAdminProduct(id) {
    if(confirm('Apakah Anda yakin ingin menghapus mahakarya perhiasan ini dari catalog utama toko?')) {
        products = products.filter(p => p.id !== id);
        localStorage.setItem('erysh_products', JSON.stringify(products));
        renderAdminTable();
        renderProducts();
    }
}

window.onload = function() {
    renderProducts();
    updateCartUI();
};
