
const properties = [
    {
        id: 1,
        name: "Modern Family Apartment",
        location: "Kigali, Kicukiro",
        type: "Apartment",
        price: 250000,
        beds: 2,
        baths: 1,
        area: 85,
        image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=900&q=80",
        description: "A bright, comfortable sample apartment with a modern living area."
    },
    {
        id: 2,
        name: "Green Garden House",
        location: "Kigali, Rebero",
        type: "House",
        price: 450000,
        beds: 3,
        baths: 2,
        area: 140,
        image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=900&q=80",
        description: "A sample family house with spacious rooms and a garden setting."
    },
    {
        id: 3,
        name: "Cozy City Studio",
        location: "Kigali, Kimihurura",
        type: "Studio",
        price: 150000,
        beds: 1,
        baths: 1,
        area: 40,
        image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=900&q=80",
        description: "A compact sample studio suitable for simple city living."
    },
    {
        id: 4,
        name: "Elegant City Apartment",
        location: "Kigali, Nyarutarama",
        type: "Apartment",
        price: 550000,
        beds: 3,
        baths: 2,
        area: 125,
        image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80",
        description: "A sample apartment with a spacious interior and stylish finish."
    },
    {
        id: 5,
        name: "Quiet Family Home",
        location: "Kigali, Kabeza",
        type: "House",
        price: 350000,
        beds: 3,
        baths: 2,
        area: 110,
        image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=900&q=80",
        description: "A sample home with several rooms and a peaceful residential setting."
    },
    {
        id: 6,
        name: "Simple Starter Studio",
        location: "Kigali, Remera",
        type: "Studio",
        price: 100000,
        beds: 1,
        baths: 1,
        area: 32,
        image: "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=900&q=80",
        description: "A small sample studio for people looking for a budget-friendly space."
    }
];

const propertyList = document.getElementById("property-list");
const searchForm = document.getElementById("search-form");
const locationInput = document.getElementById("location");
const typeInput = document.getElementById("property-type");
const priceInput = document.getElementById("max-price");
const resultsCount = document.getElementById("results-count");
const emptyMessage = document.getElementById("empty-message");
const favoritesToggle = document.getElementById("favorites-toggle");
const favoriteCount = document.getElementById("favorite-count");
const showAllButton = document.getElementById("show-all");
const modal = document.getElementById("property-modal");
const modalDetails = document.getElementById("modal-details");
const closeModalButton = document.getElementById("close-modal");
const toast = document.getElementById("toast");

let favorites = [];

try {
    const savedFavorites = JSON.parse(
        localStorage.getItem("rentease-favorites") || "[]"
    );

    if (Array.isArray(savedFavorites)) {
        favorites = savedFavorites;
    }
} catch (error) {
    favorites = [];
}

let favoritesOnly = false;
let visibleProperties = [...properties];

function formatPrice(price) {
    return "RWF " + price.toLocaleString("en-US");
}

function saveFavorites() {
    localStorage.setItem("rentease-favorites", JSON.stringify(favorites));
}

function updateFavoriteCount() {
    favoriteCount.textContent = favorites.length;
}

function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}

function renderProperties(items) {
    visibleProperties = items;

    propertyList.innerHTML = items.map(property => {
        const isFavorite = favorites.includes(property.id);

        return `
            <article class="property-card">
                <div class="property-image">
                    <img
                        src="${property.image}"
                        alt="${property.name}"
                        loading="lazy"
                    >
                    <span class="property-type">${property.type}</span>

                    <button
                        class="favorite-button ${isFavorite ? "active" : ""}"
                        data-favorite="${property.id}"
                        aria-label="Toggle favorite for ${property.name}"
                        aria-pressed="${isFavorite}"
                    >${isFavorite ? "♥" : "♡"}</button>
                </div>

                <div class="property-info">
                    <h3>${property.name}</h3>
                    <p class="property-location">📍 ${property.location}</p>

                    <div class="property-features">
                        <span>🛏 ${property.beds} beds</span>
                        <span>🛁 ${property.baths} baths</span>
                        <span>▧ ${property.area} m²</span>
                    </div>

                    <div class="property-bottom">
                        <div class="property-price">
                            <strong>${formatPrice(property.price)}</strong>
                            <span>per month · sample price</span>
                        </div>

                        <button
                            class="details-button"
                            data-details="${property.id}"
                        >Details</button>
                    </div>
                </div>
            </article>
        `;
    }).join("");

    resultsCount.textContent =
        `${items.length} sample propert${items.length === 1 ? "y" : "ies"} found`;

    emptyMessage.hidden = items.length !== 0;
    updateFavoriteCount();
}

function applyFilters() {
    const location = locationInput.value.trim().toLowerCase();
    const type = typeInput.value;
    const maxPrice = priceInput.value;

    let filtered = properties.filter(property => {
        const matchesLocation =
            property.location.toLowerCase().includes(location);

        const matchesType =
            type === "all" || property.type === type;

        const matchesPrice =
            maxPrice === "all" || property.price <= Number(maxPrice);

        const matchesFavorite =
            !favoritesOnly || favorites.includes(property.id);

        return matchesLocation &&
            matchesType &&
            matchesPrice &&
            matchesFavorite;
    });

    renderProperties(filtered);
    showAllButton.hidden = !favoritesOnly;
}

searchForm.addEventListener("submit", event => {
    event.preventDefault();
    applyFilters();
});

favoritesToggle.addEventListener("click", () => {
    favoritesOnly = !favoritesOnly;

    favoritesToggle.innerHTML = favoritesOnly
        ? '♡ Show All Properties (<span id="favorite-count">' + favorites.length + '</span>)'
        : '♡ My Favorites (<span id="favorite-count">' + favorites.length + '</span>)';

    applyFilters();
});

showAllButton.addEventListener("click", () => {
    favoritesOnly = false;
    favoritesToggle.innerHTML =
        '♡ My Favorites (<span id="favorite-count">' + favorites.length + '</span>)';

    applyFilters();
});

propertyList.addEventListener("click", event => {
    const favoriteButton = event.target.closest("[data-favorite]");
    const detailsButton = event.target.closest("[data-details]");

    if (favoriteButton) {
        const id = Number(favoriteButton.dataset.favorite);

        if (favorites.includes(id)) {
            favorites = favorites.filter(favoriteId => favoriteId !== id);
            showToast("Removed from favorites");
        } else {
            favorites.push(id);
            showToast("Added to favorites");
        }

        saveFavorites();
        applyFilters();
    }

    if (detailsButton) {
        const id = Number(detailsButton.dataset.details);
        const property = properties.find(item => item.id === id);

        if (!property) return;

        modalDetails.innerHTML = `
            <h2>${property.name}</h2>
            <img src="${property.image}" alt="${property.name}">
            <p class="property-location">📍 ${property.location}</p>
            <h3>${formatPrice(property.price)} / month</h3>
            <p>${property.description}</p>
            <p style="margin-top: 12px; color: #748078;">
                Demo listing only. This property and price have not
                been verified. No real booking is available.
            </p>
        `;

        modal.hidden = false;
    }
});

closeModalButton.addEventListener("click", () => {
    modal.hidden = true;
});

modal.addEventListener("click", event => {
    if (event.target === modal) {
        modal.hidden = true;
    }
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        modal.hidden = true;
    }
});

renderProperties(properties);
