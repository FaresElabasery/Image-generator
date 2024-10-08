const UNSPLASH_ACCESS_KEY = "tt7jtSDzXkYFim6A1yl5GPJ_3pr6ZlzJ5owotnnLHX8"; // Replace with your actual key
const input = document.getElementById('inputText');
const imagesContainer = document.querySelector('.list');
const searchButton = document.getElementById('generateBtn');
const header = document.getElementById('header');

// fetching images from the Unsplash API based on the user's input
const getImages = async () => {
    const searchTerm = input.value;
    if (searchTerm.trim() == '') {
        swal('Please describe your image', 'you must fill the field', 'error')
        return;
    }

    const apiUrl = `https://api.unsplash.com/search/photos?query=${searchTerm}&per_page=30&landscape`; // Adjust per_page as needed

    const response = await fetch(apiUrl, {
        headers: {
            Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        },
    });

    if (!response.ok) {
        console.error('Unsplash API request failed:', response.status);
        return;
    }

    const data = await response.json();
    const results = data.results;
    // randomize results
    var finalResults = results.sort(() => 0.5 - Math.random()).splice(1, 10);

    if (finalResults.length === 0) {
        swal('No images found for the given search term.', 'Try another description', 'info');
        return;
    }


    displayImages(finalResults);

};

//responsible for dynamically generating and displaying images fetched from the Unsplash API. 
function displayImages(images) {
    imagesContainer.innerHTML = ''; // Clear previous results

    var count = 1;
    images.forEach(image => {
        const container = document.createElement('div');
        container.classList.add('item');
        container.style.cssText = `--position:${count}`
        imagesContainer.append(container)
        const imgElement = document.createElement('img');
        imgElement.addEventListener('mouseenter', bg)
        imgElement.src = image.urls.regular; // Use a suitable URL size (e.g., 'regular', 'small')
        imgElement.alt = image.alt_description;
        container.append(imgElement);
        count++;
    });
    download()
}
//handle click on getImages
searchButton.addEventListener('click', getImages);

// handle 'enter' key press
input.addEventListener('keypress', function (event) {
    if (event.key == 'Enter') {
        event.preventDefault();  // Prevent form submission
        getImages();  // Call the function when Enter key is pressed
    }

});

// change the background image
function bg() {
    var items = document.querySelectorAll('.item');
    items.forEach(item => {
        item.addEventListener('mouseenter', () => {
            const imageURL = item.querySelector('img').src;
            document.documentElement.style.setProperty('--background-image', `url(${imageURL})`);
            header.style.opacity = 0.3;
        });
    });
}
bg()

// handle to save image in pc
function download() {
    const allImages = document.querySelectorAll('img');
    allImages.forEach(image => {
        image.addEventListener('click', async () => {
            try {
                const response = await fetch(image.src);
                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = image.alt || 'image.jpg';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url); // Clean up the temporary URL
            } catch (error) {
                console.error('Error downloading image:', error);
            }
        });
    });
}






