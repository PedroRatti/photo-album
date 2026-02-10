const openBtn = document.getElementById("openAlbumBtn");
const viewCover = document.getElementById("viewCover");
const viewAlbum = document.getElementById("viewAlbum");

openBtn.addEventListener("click", () => {
    viewCover.classList.add("is-hidden");
    viewAlbum.classList.remove("is-hidden");
});
