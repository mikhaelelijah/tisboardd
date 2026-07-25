document.addEventListener("DOMContentLoaded", () => {

    // --- like button ---
    const likeButtons = document.querySelectorAll('.like-btn');

    likeButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Prevent the click from opening the article if we just want to like
            e.stopPropagation();

            const isLiked = btn.classList.contains('liked');
            const countSpan = btn.querySelector('.like-count');
            let currentLikes = parseInt(btn.getAttribute('data-likes'));

            if (isLiked) {
                // Unlike
                btn.classList.remove('liked');
                btn.classList.replace('text-accent', 'text-slate-500');
                countSpan.textContent = currentLikes;
            } else {
                // Like
                btn.classList.add('liked');
                btn.classList.replace('text-slate-500', 'text-accent');
                countSpan.textContent = currentLikes + 1;
            }
        });
    });

    // --- share button ---
    const shareButtons = document.querySelectorAll('.share-btn');
    const toast = document.getElementById('toast');

    shareButtons.forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.stopPropagation(); // Don't trigger article click
            const title = btn.getAttribute('data-title');

            // web api
            if (navigator.share) {
                try {
                    await navigator.share({
                        title: `TiS BOARD - ${title}`,
                        url: window.location.href
                    });
                } catch (err) {
                    console.log('Share cancelled', err);
                }
            } else {
                // Fallback: Copy link to clipboard and show toast
                navigator.clipboard.writeText(window.location.href);
                showToast();
            }
        });
    });

    function showToast() {
        toast.classList.remove('opacity-0', 'translate-y-4');
        setTimeout(() => {
            toast.classList.add('opacity-0', 'translate-y-4');
        }, 2500);
    }

    // --- search bar demo---
    const searchInput = document.getElementById('searchInput');
    const posts = document.querySelectorAll('.post-card');

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();

            posts.forEach(post => {
                const title = post.querySelector('.post-title').textContent.toLowerCase();
                if (title.includes(term)) {
                    post.style.display = 'block';
                } else {
                    post.style.display = 'none';
                }
            });
        });
    }
});

// --- view switcher (ig) ---
window.openPost = function (imgSrc, title, author, likes) {
    const galleryView = document.getElementById('galleryView');
    const singlePostView = document.getElementById('singlePostView');

    document.getElementById('spImage').src = imgSrc;
    document.getElementById('spTitle').textContent = title;

    // clean up by author
    const cleanAuthor = author.replace('by ', '');
    document.getElementById('spAuthor').textContent = author;
    document.getElementById('spAuthorInline').textContent = cleanAuthor;
    document.getElementById('spLikesCount').textContent = likes;

    // share button
    document.getElementById('spShareBtn').setAttribute('data-title', title);

    // single view
    galleryView.classList.add('hidden');
    galleryView.classList.remove('block');

    singlePostView.classList.remove('hidden');
    singlePostView.classList.add('block');

    // effect (fade in)
    setTimeout(() => {
        singlePostView.classList.remove('opacity-0');
    }, 10);

    // scroll back up
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

window.closePost = function () {
    const galleryView = document.getElementById('galleryView');
    const singlePostView = document.getElementById('singlePostView');

    // Fade out effect
    singlePostView.classList.add('opacity-0');

    setTimeout(() => {
        // Hide Single View, Show Grid
        singlePostView.classList.add('hidden');
        singlePostView.classList.remove('block');

        galleryView.classList.remove('hidden');
        galleryView.classList.add('block');

        // Scroll back to top of the grid
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 300);
};