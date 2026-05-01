const galleries = {
  threeD: [
    {
      title: "Space Marine Siam Style Armor",
      text: "A 3D AI workflow model with Siam-inspired armor, strong sci-fi silhouette, and cinematic presentation.",
      src: "assets/images/siam-space-marine.jpg",
    },
    {
      title: "Alay Creature",
      text: "A creature shot built for horror atmosphere, scale, and game-world storytelling.",
      src: "assets/images/alay-character.jpg",
    },
    {
      title: "Vhagar Render",
      text: "Creature presentation focused on scale, texture, and dramatic lighting.",
      src: "assets/images/vhagar-render-alt.jpg",
    },
    {
      title: "Hulk",
      text: "A bold character study built around mass, attitude, and high-contrast form.",
      src: "assets/images/black-hulk.jpg",
    },
    {
      title: "Glock Model",
      text: "A clean prop render focused on silhouette, material read, and game asset presentation.",
      src: "assets/images/glock-crock.jpg",
    },
    {
      title: "Hulk",
      text: "Hard-surface and character detail staged for a clean portfolio read.",
      src: "assets/images/front-render.jpg",
    },
    {
      title: "Dragon Concept",
      text: "A high-impact creature render staged for fantasy and game trailer mood.",
      src: "assets/images/dragon-concept.jpg",
    },
    {
      title: "Creature Sculpt",
      text: "Organic sculpting study with fantasy creature forms and close-up detail.",
      src: "assets/images/graphic-01.jpg",
    },
    {
      title: "Stylized Character Model",
      text: "A character model sheet with a clean pose for inspecting proportions and costume.",
      src: "assets/images/graphic-07.jpg",
    },
    {
      title: "Character Back View",
      text: "Turnaround work for hair, outfit shape, and production readability.",
      src: "assets/images/graphic-08.jpg",
    },
    {
      title: "Game Character Model",
      text: "A stylized character render prepared like a compact model presentation.",
      src: "assets/images/graphic-11.jpg",
    },
  ],
  graphic: [
    {
      title: "Logo Direction",
      text: "Graphic mark exploration with a sharp, memorable identity read.",
      src: "assets/images/logo-test.jpg",
    },
    {
      title: "Love Poster",
      text: "Poster artwork with character-driven composition and strong color focus.",
      src: "assets/images/love-final.jpg",
    },
    {
      title: "Yakult Visual",
      text: "A playful product-style graphic built for quick recognition.",
      src: "assets/images/yakult.jpg",
    },
    {
      title: "The Boys Poster",
      text: "Poster-style key art with a strong title lockup and cinematic composition.",
      src: "assets/images/the-boys.jpg",
    },
  ],
};

const trailers = [
  {
    title: "Inferno",
    src: "assets/video/inferno-trailer.mp4",
  },
  {
    title: "Lucid: The Dark Forest",
    src: "assets/video/lucid-dark-forest-trailer.mp4",
  },
];

const galleryState = new Map();
const lightbox = document.querySelector("[data-lightbox]");
const lightboxImage = document.querySelector("[data-lightbox-image]");
const lightboxCaption = document.querySelector("[data-lightbox-caption]");

function renderGallery(name) {
  const element = document.querySelector(`[data-gallery="${name}"]`);
  const items = galleries[name];
  galleryState.set(name, { index: 0, timer: null });

  element.innerHTML = items
    .map(
      (item, index) => `
        <article class="slide ${index === 0 ? "active" : ""}" tabindex="0" data-index="${index}">
          <img src="${item.src}" alt="${item.title}" loading="eager" />
          <div class="slide-info">
            <div>
              <h3>${item.title}</h3>
              <p>${item.text}</p>
            </div>
            <span class="slide-count">${String(index + 1).padStart(2, "0")} / ${String(items.length).padStart(2, "0")}</span>
          </div>
        </article>
      `
    )
    .join("");

  element.addEventListener("click", (event) => {
    const slide = event.target.closest(".slide");
    if (slide) openLightbox(items[Number(slide.dataset.index)]);
  });

  element.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return;
    const slide = event.target.closest(".slide");
    if (slide) openLightbox(items[Number(slide.dataset.index)]);
  });

  document
    .querySelector(`[data-gallery-prev="${name}"]`)
    .addEventListener("click", () => moveGallery(name, -1));
  document
    .querySelector(`[data-gallery-next="${name}"]`)
    .addEventListener("click", () => moveGallery(name, 1));

  startGalleryTimer(name);
}

function moveGallery(name, direction) {
  const state = galleryState.get(name);
  const items = galleries[name];
  const nextIndex = (state.index + direction + items.length) % items.length;
  setGalleryIndex(name, nextIndex);
  startGalleryTimer(name);
}

function setGalleryIndex(name, nextIndex) {
  const state = galleryState.get(name);
  const slides = document.querySelectorAll(`[data-gallery="${name}"] .slide`);
  slides[state.index].classList.remove("active");
  slides[nextIndex].classList.add("active");
  state.index = nextIndex;
}

function startGalleryTimer(name) {
  const state = galleryState.get(name);
  window.clearInterval(state.timer);
  state.timer = window.setInterval(() => moveGallery(name, 1), 4000);
}

function openLightbox(item) {
  lightboxImage.src = item.src;
  lightboxImage.alt = item.title;
  lightboxCaption.textContent = `${item.title} - ${item.text}`;
  lightbox.hidden = false;
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  lightbox.hidden = true;
  lightboxImage.src = "";
  document.body.style.overflow = "";
}

document.querySelector("[data-lightbox-close]").addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !lightbox.hidden) closeLightbox();
});

let trailerIndex = 0;
let videoAutoplayBlocked = false;
const video = document.querySelector("[data-video-player]");
const videoStage = document.querySelector("[data-video-stage]");
const videoTitle = document.querySelector("[data-video-title]");

function isVideoNearSection() {
  const rect = videoStage.getBoundingClientRect();
  return rect.bottom > 0 && rect.top < window.innerHeight;
}

async function playTrailer() {
  if (!isVideoNearSection()) return;

  try {
    video.muted = false;
    await video.play();
    videoAutoplayBlocked = false;
  } catch {
    videoAutoplayBlocked = true;
    video.muted = true;
    video.play().catch(() => undefined);
  }
}

function loadTrailer(index, shouldPlay = false) {
  trailerIndex = (index + trailers.length) % trailers.length;
  const trailer = trailers[trailerIndex];
  video.src = trailer.src;
  video.removeAttribute("poster");
  videoTitle.textContent = trailer.title;
  video.load();
  if (shouldPlay) {
    playTrailer();
  }
}

document.querySelector("[data-video-prev]").addEventListener("click", () => {
  loadTrailer(trailerIndex - 1, !video.paused);
});

document.querySelector("[data-video-next]").addEventListener("click", () => {
  loadTrailer(trailerIndex + 1, !video.paused);
});

video.addEventListener("ended", () => {
  loadTrailer(trailerIndex + 1, true);
});

function updateVideoVolume() {
  const rect = videoStage.getBoundingClientRect();
  const outsideSection = rect.bottom < 0 || rect.top > window.innerHeight;

  if (outsideSection) {
    video.volume = 0;
    video.muted = true;
    video.pause();
    return;
  }

  const viewportCenter = window.innerHeight / 2;
  const stageCenter = rect.top + rect.height / 2;
  const distance = Math.abs(stageCenter - viewportCenter);
  const fadeDistance = Math.max(window.innerHeight * 0.9, 420);
  const volume = Math.max(0, Math.min(1, 1 - distance / fadeDistance));

  video.volume = volume;
  video.muted = videoAutoplayBlocked || volume < 0.04;

  if (video.paused) {
    playTrailer();
  }
}

window.addEventListener("scroll", updateVideoVolume, { passive: true });
window.addEventListener("resize", updateVideoVolume);
document.addEventListener(
  "pointerdown",
  () => {
    if (!isVideoNearSection()) return;
    videoAutoplayBlocked = false;
    updateVideoVolume();
    playTrailer();
  },
  { once: true }
);

renderGallery("threeD");
renderGallery("graphic");
loadTrailer(0);
updateVideoVolume();
