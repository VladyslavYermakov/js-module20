const API_KEY = "55488164-a39d12eb388c39119286251f6";
const BASE_URL = "https://pixabay.com/api/";

const form = document.getElementById("search-form");
const gallery = document.querySelector(".gallery");
const loadMoreBtn = document.querySelector(".load-more");

let searchQuery = "";
let page = 1;

form.addEventListener("submit", onSearch);
loadMoreBtn.addEventListener("click", onLoadMore);

async function onSearch(e) {
    e.preventDefault();

    try {
        const query = e.currentTarget.query.value.trim();
        if (!query) return;

        searchQuery = query;
        page = 1;
        gallery.innerHTML = "";
        loadMoreBtn.classList.add("is-hidden");

        const data = await fetchImages(searchQuery, page);
        if (!data || !data.hits.length) return; 

        renderImages(data.hits);
        loadMoreBtn.classList.remove("is-hidden");
    } catch (error) {
        console.error(error);
    }
}

async function onLoadMore() {
    try {
        page += 1;

        const data = await fetchImages(searchQuery, page);
        if (!data || !data.hits.length) {
            loadMoreBtn.classList.add("is-hidden");
            return;
        }

        renderImages(data.hits);

        const lastCard = gallery.lastElementChild;
        if (lastCard) {
        lastCard.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
        }

        if (data.hits.length < 12) {
            loadMoreBtn.classList.add("is-hidden");
        }
    } catch (error) {
        console.log(error);
    }
}

async function fetchImages(query, page) {
    try {
        const url = `${BASE_URL}?image_type=photo&orientation=horizontal&q=${query}&page=${page}&per_page=12&key=${API_KEY}`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Помилка запиту");
        }
        return await response.json();
    } catch (err) {
        console.log(err);
    }
}

function renderImages(images) {
    images.forEach(image => {
        const item = document.createElement("li");
        item.classList.add("photo-card");

        item.innerHTML = `
        <div class = "photo-card">
        <img src="${image.webformatURL}" alt="${image.tags}" />
        <div class="stats">
            <p class="stats-item">
            <i class="material-icons">thumb_up</i>
            ${image.likes}
            </p>
            <p class="stats-item">
            <i class="material-icons">visibility</i>
            ${image.views}
            </p>
            <p class="stats-item">
            <i class="material-icons">comment</i>
            ${image.comments}
            </p>
            <p class="stats-item">
            <i class="material-icons">cloud_download</i>
            ${image.downloads}
            </p>
        </div>
        </div>
        `;

        gallery.appendChild(item);
    });
}