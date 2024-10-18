const postForm = document.getElementById('postForm');
const postsContainer = document.getElementById('posts-container');
const postsPlaceholder = document.getElementById('no-posts');

function loadPosts() {
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    if (posts.length === 0) {
        postsPlaceholder.style.display = 'block';
    } else {
        postsPlaceholder.style.display = 'none';
        posts.forEach(post => {
            const newPost = document.createElement('article');
            newPost.innerHTML = `
                <h3>${post.title}</h3>
                <p>${post.content}</p>
                ${post.image ? `<img src="${post.image}" alt="Post Image" style="max-width: 200px; display: block;">` : ''}
            `;
            postsContainer.appendChild(newPost);
        });
    }
}

function savePosts(title, content, image) {
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    posts.push( {title, content, image} );
    localStorage.setItem('posts', JSON.stringify(posts));
}

function convertImageToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
    });
}

postForm.addEventListener ('submit', async function(event) {
    event.preventDefault();

    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    const image = document.getElementById('image');
    let imageBase64 = null;

    if (image.files && image.files[0]) {
        try {
            imageBase64 = await convertImageToBase64(image.files[0]);
        } catch (error) {
            console.error("Error uploading image: ", error);
        }
    }

    const newPost = document.createElement('article');
        newPost.innerHTML = `
            <h3>${title}</h3>
            <p>${content}</p>
            ${imageBase64 ? `<img src="${imageBase64}" alt="Post Image" style="max-width: 200px; display: block;">` : ''}
        `;

    postsContainer.appendChild(newPost);

    postsPlaceholder.style.display = 'none';

    savePosts(title, content, imageBase64);

    postForm.reset();
});

window.addEventListener('load', loadPosts);