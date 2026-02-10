function pad4(n) {
    return String(n).padStart(4, "0");
}

function buildPhotos(from, to, altPrefix = "Foto") {
    const arr = [];
    for (let i = from; i <= to; i++) {
        const id = pad4(i);
        arr.push({
            src: `assets/photos/${id}.jpg`,
            thumb: `assets/thumbs/${id}_thumb.jpg`,
            alt: `${altPrefix} ${i}`,
        });
    }
    return arr;
}

export const ALBUM = {
    title: "Meu Álbum",
    subtitle: "2024–2026",
    coverImage: "assets/photos/cover.jpg",
    backCoverImage: "assets/photos/back.jpg",

    pages: [
        {
            title: "Viagem",
            photos: buildPhotos(1, 27),
        },
        // outras páginas…
    ],
};
