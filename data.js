// Realistic dummy data sets
const brands = {
    'Car': ['Toyota', 'Honda', 'Suzuki', 'BMW', 'Mercedes-Benz', 'Audi', 'Ford', 'Chevrolet'],
    'Van': ['Ford', 'Mercedes-Benz', 'Volkswagen', 'Renault', 'Peugeot', 'Citroen'],
    'Bike': ['Honda', 'Yamaha', 'Suzuki', 'Kawasaki', 'Ducati', 'BMW'],
    'Motorhome': ['Hymer', 'Burstner', 'Swift', 'Auto-Trail', 'Bailey'],
    'Caravan': ['Swift', 'Bailey', 'Elddis', 'Lunar', 'Coachman'],
    'Truck': ['Volvo', 'Scania', 'DAF', 'MAN', 'Mercedes-Benz'],
    'Electric Bike': ['Rad Power', 'Aventon', 'Specialized', 'Trek', 'Giant']
};

const models = {
    'Toyota': ['Corolla', 'Camry', 'RAV4', 'Highlander', 'Prius'],
    'Honda': ['Civic', 'Accord', 'CR-V', 'Pilot', 'Fit'],
    'Suzuki': ['Swift', 'Alto', 'Vitara', 'Jimny'],
    'BMW': ['3 Series', '5 Series', 'X3', 'X5', 'M4'],
    'Mercedes-Benz': ['C-Class', 'E-Class', 'GLC', 'Sprinter', 'Vito', 'Actros'],
    'Audi': ['A3', 'A4', 'Q5', 'Q7'],
    'Ford': ['Mustang', 'F-150', 'Transit', 'Focus', 'Explorer'],
    'Chevrolet': ['Silverado', 'Equinox', 'Malibu', 'Tahoe'],
    'Volkswagen': ['Transporter', 'Crafter', 'Caddy'],
    'Renault': ['Trafic', 'Master', 'Kangoo'],
    'Peugeot': ['Boxer', 'Expert', 'Partner'],
    'Citroen': ['Relay', 'Dispatch', 'Berlingo'],
    'Yamaha': ['MT-07', 'YZF-R1', 'Tenere 700'],
    'Kawasaki': ['Ninja 400', 'Z900', 'Versys'],
    'Ducati': ['Panigale', 'Monster', 'Multistrada'],
    'Hymer': ['B-Class', 'Exsis', 'Tramp'],
    'Burstner': ['Lyseo', 'Elegance', 'Nexxo'],
    'Swift': ['Challenger', 'Sprite', 'Elegance', 'Kon-tiki', 'Escape'],
    'Auto-Trail': ['Tracker', 'Apache', 'Frontier'],
    'Bailey': ['Unicorn', 'Pegasus', 'Phoenix', 'Autograph'],
    'Elddis': ['Avante', 'Affinity', 'Crusader'],
    'Lunar': ['Quasar', 'Lexon', 'Clubman'],
    'Coachman': ['VIP', 'Laser', 'Acadia'],
    'Volvo': ['FH', 'FM', 'FMX'],
    'Scania': ['R-Series', 'S-Series', 'P-Series'],
    'DAF': ['XF', 'CF', 'LF'],
    'MAN': ['TGX', 'TGS', 'TGM'],
    'Rad Power': ['RadRover', 'RadCity', 'RadRunner'],
    'Aventon': ['Pace', 'Level', 'Aventure'],
    'Specialized': ['Turbo Levo', 'Vado', 'Como'],
    'Trek': ['Powerfly', 'Rail', 'Allant+'],
    'Giant': ['Trance E+', 'Stance E+', 'Explore E+']
};

const locations = ['London', 'Manchester', 'Birmingham', 'Glasgow', 'Liverpool', 'Bristol', 'Edinburgh', 'Leeds'];
const conditions = ['New', 'Used'];
const fuelTypes = {
    'Car': ['Petrol', 'Diesel', 'Hybrid', 'Electric'],
    'Van': ['Diesel', 'Electric'],
    'Bike': ['Petrol', 'Electric'],
    'Motorhome': ['Diesel'],
    'Caravan': ['N/A'],
    'Truck': ['Diesel'],
    'Electric Bike': ['Electric']
};

// Helper to get random item from array
function getRandomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// Helper to get random number between min and max
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Fallback image in case network fails
const FALLBACK_IMAGE = 'https://via.placeholder.com/600x400/eeeeee/333333?text=Vehicle+Image+Unavailable';

// Generate 10 relevant images using LoremFlickr (since source.unsplash.com is permanently offline)
function generateImages(type, brand, model) {
    const images = [];
    
    // Map vehicle type to relevant image keyword
    let keyword = 'car';
    if (type === 'Bike' || type === 'Electric Bike') keyword = 'motorcycle';
    else if (type === 'Van') keyword = 'van';
    else if (type === 'Motorhome' || type === 'Caravan') keyword = 'camper';
    else if (type === 'Truck') keyword = 'truck';

    const vehicleSeed = Math.floor(Math.random() * 1000000);
    
    for (let i = 1; i <= 10; i++) {
        // Appending a random parameter forces the browser to load a new unique image
        images.push(`https://loremflickr.com/600/400/${keyword}?random=${vehicleSeed}_${i}`);
    }
    return images;
}

// Main generator function
function generateVehicles(type, count) {
    const generated = [];
    const typeBrands = brands[type] || ['Generic'];
    
    for (let i = 0; i < count; i++) {
        const brand = getRandomItem(typeBrands);
        const modelList = models[brand] || ['Model X'];
        const model = getRandomItem(modelList);
        
        const isNew = Math.random() > 0.7; // 30% chance to be new
        const year = isNew ? 2024 : getRandomInt(2010, 2023);
        const condition = isNew ? 'New' : 'Used';
        const mileage = isNew ? getRandomInt(5, 500) : getRandomInt(10000, 150000);
        
        let priceBase = 0;
        if(type === 'Car') priceBase = getRandomInt(5000, 80000);
        else if(type === 'Van') priceBase = getRandomInt(8000, 40000);
        else if(type === 'Bike') priceBase = getRandomInt(1500, 25000);
        else if(type === 'Motorhome') priceBase = getRandomInt(30000, 120000);
        else if(type === 'Caravan') priceBase = getRandomInt(10000, 40000);
        else if(type === 'Truck') priceBase = getRandomInt(40000, 150000);
        else priceBase = getRandomInt(1000, 5000);
        
        // Adjust price based on age
        const price = isNew ? priceBase * 1.5 : priceBase * (year / 2024);
        
        const fTypes = fuelTypes[type] || ['Petrol'];
        const fuel = getRandomItem(fTypes);
        
        let engine = 'N/A';
        if (fuel !== 'Electric' && type !== 'Caravan') {
            engine = (getRandomInt(10, 50) / 10).toFixed(1) + 'L';
        } else if (fuel === 'Electric') {
            engine = getRandomInt(50, 150) + ' kWh';
        }

        generated.push({
            id: `${type.toLowerCase().replace(' ', '-')}-${Date.now()}-${i}`,
            type: type,
            brand: brand,
            model: model,
            price: Math.floor(price),
            condition: condition,
            mileage: mileage,
            fuelType: fuel,
            engine: engine,
            year: year,
            location: getRandomItem(locations),
            description: `A fantastic ${condition.toLowerCase()} ${year} ${brand} ${model}. Perfect for your needs. Features include premium interior, excellent condition, and reliable performance. Contact us today for a test drive.`,
            images: generateImages(type, brand, model)
        });
    }
    return generated;
}

// Generate the full dataset
const vehiclesData = [
    ...generateVehicles('Car', 100),
    ...generateVehicles('Van', 100),
    ...generateVehicles('Bike', 100),
    ...generateVehicles('Motorhome', 50),
    ...generateVehicles('Caravan', 50),
    ...generateVehicles('Truck', 50),
    ...generateVehicles('Electric Bike', 50)
];

console.log(`Generated ${vehiclesData.length} vehicles.`);

// Reviews Dummy Data
const reviewsData = [
    { name: "John Doe", rating: 5, text: "Excellent service! Found my dream car within minutes. The filtering system is incredibly easy to use." },
    { name: "Sarah Smith", rating: 4, text: "Great selection of vans. I bought one for my business and it runs perfectly. Highly recommend Pak Auto." },
    { name: "Mike Johnson", rating: 5, text: "The premium feel of this website makes browsing for bikes a joy. Trustworthy platform." },
    { name: "Emma Wilson", rating: 4, text: "Bought a used motorhome for our family trips. The description was accurate and 10 images really helped." }
];
