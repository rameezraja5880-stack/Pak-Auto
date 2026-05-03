// State
const pageType = document.body.getAttribute('data-page') || 'index';
let currentCategory = 'All';
let filteredVehicles = [...vehiclesData];
let itemsDisplayed = 0;
const ITEMS_PER_PAGE = 12;
let compareList = [];

// DOM Elements
const listingsGrid = document.getElementById('listingsGrid');
const loadMoreBtn = document.getElementById('loadMoreBtn');
const resultsCount = document.getElementById('resultsCount');
const currentCategoryTitle = document.getElementById('currentCategoryTitle');
const navLinks = document.querySelectorAll('.top-nav-links a');
const searchForm = document.getElementById('searchForm');
const searchBrand = document.getElementById('searchBrand');
const reviewsGrid = document.getElementById('reviewsGrid');

// Compare DOM Elements
const compareCount = document.getElementById('compareCount');
const openCompareBtn = document.getElementById('openCompareBtn');
const compareModal = document.getElementById('compareModal');
const closeCompareBtn = document.getElementById('closeCompareBtn');
const compareGrid = document.getElementById('compareGrid');
const clearCompareBtn = document.getElementById('clearCompareBtn');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Populate brands in search dropdown
    populateBrandsDropdown();

    // Apply initial filters based on page
    applyFilters();

    // Render reviews
    renderReviews();
});

// Event Listeners
loadMoreBtn.addEventListener('click', () => {
    renderListings(true);
});

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();

        // Update active class
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');

        // Filter by category
        currentCategory = link.getAttribute('data-category');
        currentCategoryTitle.textContent = currentCategory === 'All' ? 'All Vehicles' : currentCategory + 's';

        applyFilters();
    });
});

searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    applyFilters();
});

// Populate Brands dynamically based on all data
function populateBrandsDropdown() {
    const allBrands = [...new Set(vehiclesData.map(v => v.brand))].sort();
    searchBrand.innerHTML = '<option value="">Any Brand</option>';
    allBrands.forEach(brand => {
        searchBrand.innerHTML += `<option value="${brand}">${brand}</option>`;
    });
}

// Apply Filters (Category + Search Form)
function applyFilters() {
    const searchTypeEl = document.getElementById('searchType');
    const searchBrandEl = document.getElementById('searchBrand');
    const searchPriceEl = document.getElementById('searchPrice');

    const typeVal = searchTypeEl ? searchTypeEl.value : '';
    const brandVal = searchBrandEl ? searchBrandEl.value : '';
    const priceVal = searchPriceEl ? searchPriceEl.value : '';

    filteredVehicles = vehiclesData.filter(v => {
        // Page level filters
        if (pageType === 'used-cars' && v.condition !== 'Used') return false;
        if (pageType === 'new-cars' && v.condition !== 'New') return false;
        if (pageType === 'electric-cars' && v.fuelType !== 'Electric') return false;
        if (pageType === 'leasing' && v.condition !== 'New') return false;

        // Category Filter
        if (currentCategory !== 'All' && v.type !== currentCategory) return false;

        // Form Filters
        if (typeVal && v.type !== typeVal) return false;
        if (brandVal && v.brand !== brandVal) return false;
        if (priceVal && v.price > parseInt(priceVal)) return false;

        return true;
    });

    // Reset and render
    itemsDisplayed = 0;
    listingsGrid.innerHTML = '';
    renderListings();
}

// Format Price
function formatPrice(price) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(price);
}

// Render Listings
function renderListings(append = false) {
    if (!append) {
        itemsDisplayed = 0;
        listingsGrid.innerHTML = '';
    }

    const nextItems = filteredVehicles.slice(itemsDisplayed, itemsDisplayed + ITEMS_PER_PAGE);

    if (nextItems.length === 0 && itemsDisplayed === 0) {
        listingsGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted);">No vehicles found matching your criteria.</p>';
        loadMoreBtn.style.display = 'none';
        resultsCount.textContent = '0 results';
        return;
    }

    nextItems.forEach((vehicle, index) => {
        const isCompared = compareList.some(c => c.id === vehicle.id);

        const card = document.createElement('div');
        card.className = 'vehicle-card';
        card.innerHTML = `
            <div class="card-image" style="position: relative;" onmouseover="this.querySelector('.gallery-overlay').style.opacity='1'" onmouseout="this.querySelector('.gallery-overlay').style.opacity='0'">
                <div class="condition-badge">${vehicle.condition}</div>
                <img src="${vehicle.images[0]}" alt="${vehicle.brand} ${vehicle.model}" id="img-${vehicle.id}" onerror="this.src=FALLBACK_IMAGE" style="width: 100%; height: 220px; object-fit: cover;">
                <div class="gallery-overlay" style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.3s; cursor: pointer;" onclick="openGalleryModal('${vehicle.id}')">
                    <button class="btn btn-primary" style="pointer-events: none;"><i class="fa-solid fa-images"></i> View Gallery</button>
                </div>
            </div>
            <div class="card-content">
                <div style="font-size: 0.8rem; color: var(--primary-color); font-weight: 600; margin-bottom: 5px;">${vehicle.type}</div>
                <h4 class="card-title" style="cursor: pointer; text-decoration: none; color: inherit; transition: color 0.2s;" onmouseover="this.style.color='var(--primary-color)'" onmouseout="this.style.color='inherit'" onclick="openGalleryModal('${vehicle.id}')">${vehicle.brand} ${vehicle.model} ${vehicle.year}</h4>
                <div class="card-price">${formatPrice(vehicle.price)}</div>
                
                <div class="card-specs">
                    <div><i class="fa-solid fa-gauge-high"></i> ${vehicle.mileage.toLocaleString()} mi</div>
                    <div><i class="fa-solid fa-gas-pump"></i> ${vehicle.fuelType}</div>
                    <div><i class="fa-solid fa-calendar"></i> ${vehicle.year}</div>
                    <div><i class="fa-solid fa-gear"></i> ${vehicle.engine}</div>
                </div>
                
                <p class="card-desc">${vehicle.description}</p>
                
                <div class="card-footer">
                    <div class="location"><i class="fa-solid fa-location-dot"></i> ${vehicle.location}</div>
                    <label class="compare-checkbox">
                        <input type="checkbox" onchange="toggleCompare('${vehicle.id}')" ${isCompared ? 'checked' : ''}> Compare
                    </label>
                </div>
            </div>
        `;

        // Add a dataset state for gallery index
        card.querySelector('.card-image').dataset.currentIndex = 0;

        listingsGrid.appendChild(card);
    });

    itemsDisplayed += nextItems.length;
    resultsCount.textContent = `Showing ${itemsDisplayed} of ${filteredVehicles.length} results`;

    if (itemsDisplayed >= filteredVehicles.length) {
        loadMoreBtn.style.display = 'none';
    } else {
        loadMoreBtn.style.display = 'inline-block';
    }
}

// Gallery Modal Variables & Logic
let currentGalleryVehicle = null;
let currentGalleryIndex = 0;
let galleryAutoSlideInterval = null;

window.openGalleryModal = function (id) {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
        alert("Please login first to view the full details and gallery.");
        window.location.href = "login.html?redirect=" + encodeURIComponent(window.location.href);
        return;
    }

    const vehicle = vehiclesData.find(v => v.id === id);
    if (!vehicle) return;

    currentGalleryVehicle = vehicle;
    currentGalleryIndex = 0;

    const titleEl = document.getElementById('galleryVehicleTitle');
    const priceEl = document.getElementById('galleryVehiclePrice');
    if (titleEl) titleEl.textContent = `${vehicle.year} ${vehicle.brand} ${vehicle.model}`;
    if (priceEl) priceEl.textContent = formatPrice(vehicle.price);

    const mileageEl = document.getElementById('galleryMileage');
    const fuelEl = document.getElementById('galleryFuel');
    const yearEl = document.getElementById('galleryYear');
    const engineEl = document.getElementById('galleryEngine');
    const descEl = document.getElementById('galleryDescription');

    if (mileageEl) mileageEl.textContent = vehicle.mileage.toLocaleString();
    if (fuelEl) fuelEl.textContent = vehicle.fuelType;
    if (yearEl) yearEl.textContent = vehicle.year;
    if (engineEl) engineEl.textContent = vehicle.engine;
    if (descEl) descEl.textContent = vehicle.description;

    updateGalleryView();
    renderGalleryThumbnails();

    const modal = document.getElementById('vehicleGalleryModal');
    if (modal) {
        modal.style.display = 'block';
        startAutoSlide();
    }
};

window.closeGalleryModal = function () {
    const modal = document.getElementById('vehicleGalleryModal');
    if (modal) {
        modal.style.display = 'none';
        stopAutoSlide();
    }
};

function updateGalleryView() {
    if (!currentGalleryVehicle) return;
    const imgUrl = currentGalleryVehicle.images[currentGalleryIndex];
    const mainImg = document.getElementById('galleryMainImage');
    if (mainImg) mainImg.src = imgUrl;

    document.querySelectorAll('.gallery-thumbnail').forEach((thumb, idx) => {
        if (idx === currentGalleryIndex) {
            thumb.classList.add('active');
        } else {
            thumb.classList.remove('active');
        }
    });
}

function renderGalleryThumbnails() {
    if (!currentGalleryVehicle) return;
    const container = document.getElementById('galleryThumbnails');
    if (!container) return;

    container.innerHTML = currentGalleryVehicle.images.map((img, idx) =>
        `<img src="${img}" class="gallery-thumbnail ${idx === 0 ? 'active' : ''}" onclick="setGalleryIndex(${idx})" onerror="this.src=FALLBACK_IMAGE">`
    ).join('');
}

window.setGalleryIndex = function (index) {
    currentGalleryIndex = index;
    updateGalleryView();
    resetAutoSlide();
};

window.nextGalleryImage = function () {
    if (!currentGalleryVehicle) return;
    currentGalleryIndex = (currentGalleryIndex + 1) % currentGalleryVehicle.images.length;
    updateGalleryView();
};

window.prevGalleryImage = function () {
    if (!currentGalleryVehicle) return;
    currentGalleryIndex = (currentGalleryIndex - 1 + currentGalleryVehicle.images.length) % currentGalleryVehicle.images.length;
    updateGalleryView();
};

function startAutoSlide() {
    stopAutoSlide();
    galleryAutoSlideInterval = setInterval(() => {
        window.nextGalleryImage();
    }, 3000);
}

function stopAutoSlide() {
    if (galleryAutoSlideInterval) {
        clearInterval(galleryAutoSlideInterval);
        galleryAutoSlideInterval = null;
    }
}

function resetAutoSlide() {
    stopAutoSlide();
    startAutoSlide();
}

document.addEventListener('DOMContentLoaded', () => {
    const nextBtn = document.getElementById('galleryNextBtn');
    const prevBtn = document.getElementById('galleryPrevBtn');
    const closeBtn = document.getElementById('closeGalleryBtn');

    if (nextBtn) nextBtn.addEventListener('click', () => { nextGalleryImage(); resetAutoSlide(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { prevGalleryImage(); resetAutoSlide(); });
    if (closeBtn) closeBtn.addEventListener('click', closeGalleryModal);

    window.addEventListener('click', (e) => {
        const modal = document.getElementById('vehicleGalleryModal');
        if (e.target === modal) {
            closeGalleryModal();
        }
    });
});

// Compare Functionality
window.toggleCompare = function (id) {
    const isCompared = compareList.some(v => v.id === id);
    if (isCompared) {
        compareList = compareList.filter(v => v.id !== id);
    } else {
        if (compareList.length >= 2) {
            alert('You can only compare 2 vehicles at a time.');
            // Uncheck the box
            renderListings(); // re-render to fix checkbox state
            return;
        }
        const vehicle = vehiclesData.find(v => v.id === id);
        if (vehicle) compareList.push(vehicle);
    }

    compareCount.textContent = compareList.length;
    updateCompareModal();
};

function updateCompareModal() {
    if (compareList.length === 0) {
        compareGrid.innerHTML = '<p class="empty-state">Select up to 2 vehicles to compare.</p>';
        return;
    }

    compareGrid.innerHTML = compareList.map(v => `
        <div class="vehicle-card" style="box-shadow: none; border: 1px solid var(--border-color);">
            <div class="card-image" style="height: 150px;">
                <img src="${v.images[0]}" alt="${v.brand}">
            </div>
            <div class="card-content" style="padding: 15px;">
                <h4 style="margin-bottom: 10px;">${v.brand} ${v.model}</h4>
                <div style="font-size: 1.2rem; font-weight: 700; color: var(--primary-color); margin-bottom: 15px;">${formatPrice(v.price)}</div>
                
                <table style="width: 100%; font-size: 0.9rem; text-align: left; border-collapse: collapse;">
                    <tr style="border-bottom: 1px solid #eee;">
                        <td style="padding: 8px 0; color: var(--gray-color);">Condition</td>
                        <td style="padding: 8px 0; font-weight: 600;">${v.condition}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #eee;">
                        <td style="padding: 8px 0; color: var(--gray-color);">Year</td>
                        <td style="padding: 8px 0; font-weight: 600;">${v.year}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #eee;">
                        <td style="padding: 8px 0; color: var(--gray-color);">Mileage</td>
                        <td style="padding: 8px 0; font-weight: 600;">${v.mileage.toLocaleString()} mi</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #eee;">
                        <td style="padding: 8px 0; color: var(--gray-color);">Fuel</td>
                        <td style="padding: 8px 0; font-weight: 600;">${v.fuelType}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: var(--gray-color);">Engine</td>
                        <td style="padding: 8px 0; font-weight: 600;">${v.engine}</td>
                    </tr>
                </table>
                <button class="btn btn-outline btn-block mt-4" onclick="toggleCompare('${v.id}'); renderListings();">Remove</button>
            </div>
        </div>
    `).join('');
}

openCompareBtn.addEventListener('click', () => {
    compareModal.style.display = 'block';
    updateCompareModal();
});

closeCompareBtn.addEventListener('click', () => {
    compareModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === compareModal) {
        compareModal.style.display = 'none';
    }
});

clearCompareBtn.addEventListener('click', () => {
    compareList = [];
    compareCount.textContent = '0';
    updateCompareModal();
    renderListings();
});

// Render Reviews
function renderReviews() {
    reviewsGrid.innerHTML = reviewsData.map(review => {
        const stars = Array(5).fill(0).map((_, i) =>
            `<i class="fa-solid fa-star${i < review.rating ? '' : ' fa-regular'}"></i>`
        ).join('');

        return `
            <div class="review-card">
                <div class="stars">${stars}</div>
                <p class="review-text">"${review.text}"</p>
                <div class="reviewer-name">- ${review.name}</div>
            </div>
        `;
    }).join('');
}

// --- Auth Logic ---
function checkAuth() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const authBtnText = document.getElementById('authBtnText');
    const authBtn = document.getElementById('authBtn');

    if (isLoggedIn) {
        if (authBtnText) authBtnText.textContent = 'Logout';
        if (authBtn) authBtn.onclick = (e) => {
            e.preventDefault();
            localStorage.removeItem('isLoggedIn');
            alert('You have been logged out.');
            window.location.reload();
        };
    } else {
        if (authBtnText) authBtnText.textContent = 'Login / Sign Up';
        if (authBtn) authBtn.onclick = null; // default anchor behavior
    }
}

window.requireAuth = function (actionName) {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (isLoggedIn) {
        alert("Success! You have chosen to " + actionName + ". We will process this request shortly.");
        if (typeof closeGalleryModal === 'function') closeGalleryModal();
    } else {
        alert("Please login or sign in first to " + actionName + ".");
        window.location.href = "login.html?redirect=" + encodeURIComponent(window.location.href);
    }
};

document.addEventListener('DOMContentLoaded', checkAuth);

