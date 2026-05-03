// js/vehicle.js

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const vehicleId = urlParams.get('id');
    const container = document.getElementById('vehicleDetailsContainer');

    if (!vehicleId) {
        container.innerHTML = '<div class="text-center py-large"><h3>Vehicle ID not provided.</h3><a href="index.html" class="btn btn-primary mt-4">Back to Listings</a></div>';
        return;
    }

    const vehicle = vehiclesData.find(v => v.id === vehicleId);

    if (!vehicle) {
        container.innerHTML = '<div class="text-center py-large"><h3>Vehicle not found.</h3><a href="index.html" class="btn btn-primary mt-4">Back to Listings</a></div>';
        return;
    }

    // Update document title
    document.title = `${vehicle.brand} ${vehicle.model} - Pak Auto`;

    // Render vehicle
    const formatPrice = (price) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(price);
    
    let imagesHtml = '';
    vehicle.images.forEach((img, index) => {
        imagesHtml += `<img src="${img}" alt="${vehicle.brand} ${vehicle.model} image ${index + 1}" class="thumbnail ${index === 0 ? 'active' : ''}" onclick="changeMainImage(this, '${img}')" style="width: 100px; height: 70px; object-fit: cover; cursor: pointer; border-radius: 4px; border: 2px solid ${index === 0 ? 'var(--primary-color)' : 'transparent'}; margin-right: 10px; flex-shrink: 0;">`;
    });

    container.innerHTML = `
        <div class="vehicle-detail-layout" style="display: flex; flex-wrap: wrap; gap: 40px;">
            <div class="vehicle-gallery" style="flex: 1 1 500px;">
                <div class="main-image" style="margin-bottom: 20px; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                    <img id="mainVehicleImage" src="${vehicle.images[0]}" alt="${vehicle.brand} ${vehicle.model}" style="width: 100%; height: auto; display: block; aspect-ratio: 3/2; object-fit: cover;">
                </div>
                <div class="thumbnails-container" style="display: flex; overflow-x: auto; padding-bottom: 10px;">
                    ${imagesHtml}
                </div>
            </div>
            
            <div class="vehicle-info" style="flex: 1 1 400px;">
                <div style="font-size: 0.9rem; color: var(--primary-color); font-weight: 600; text-transform: uppercase; margin-bottom: 10px;">${vehicle.condition} ${vehicle.type}</div>
                <h1 style="font-size: 2.5rem; margin-bottom: 15px;">${vehicle.year} ${vehicle.brand} ${vehicle.model}</h1>
                <h2 style="font-size: 2rem; color: var(--primary-color); margin-bottom: 25px;">${formatPrice(vehicle.price)}</h2>
                
                <div class="specs-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 30px; background: var(--light-color); padding: 20px; border-radius: 8px;">
                    <div><i class="fa-solid fa-gauge-high" style="color: var(--gray-color); width: 20px;"></i> <strong>Mileage:</strong> ${vehicle.mileage.toLocaleString()} mi</div>
                    <div><i class="fa-solid fa-gas-pump" style="color: var(--gray-color); width: 20px;"></i> <strong>Fuel:</strong> ${vehicle.fuelType}</div>
                    <div><i class="fa-solid fa-calendar" style="color: var(--gray-color); width: 20px;"></i> <strong>Year:</strong> ${vehicle.year}</div>
                    <div><i class="fa-solid fa-gear" style="color: var(--gray-color); width: 20px;"></i> <strong>Engine:</strong> ${vehicle.engine}</div>
                    <div><i class="fa-solid fa-location-dot" style="color: var(--gray-color); width: 20px;"></i> <strong>Location:</strong> ${vehicle.location}</div>
                    <div><i class="fa-solid fa-tag" style="color: var(--gray-color); width: 20px;"></i> <strong>Condition:</strong> ${vehicle.condition}</div>
                </div>
                
                <div class="description" style="margin-bottom: 30px;">
                    <h3 style="margin-bottom: 15px; border-bottom: 1px solid var(--border-color); padding-bottom: 10px;">Description</h3>
                    <p style="line-height: 1.6; color: var(--text-color);">${vehicle.description}</p>
                    <p style="line-height: 1.6; color: var(--text-color); margin-top: 10px;">This beautiful ${vehicle.brand} is ready for its next owner. We ensure a rigorous inspection process so you can buy with confidence.</p>
                </div>
                
                <div class="actions" style="display: flex; gap: 15px;">
                    <button class="btn btn-primary" style="flex: 1; padding: 15px; font-size: 1.1rem;" onclick="alert('Contacting Seller...')"><i class="fa-solid fa-phone"></i> Contact Seller</button>
                    <button class="btn btn-outline" style="padding: 15px;" onclick="alert('Vehicle Saved!')"><i class="fa-regular fa-heart"></i> Save</button>
                </div>
            </div>
        </div>
    `;
});

window.changeMainImage = function(element, src) {
    document.getElementById('mainVehicleImage').src = src;
    document.querySelectorAll('.thumbnail').forEach(el => {
        el.style.borderColor = 'transparent';
    });
    element.style.borderColor = 'var(--primary-color)';
};
