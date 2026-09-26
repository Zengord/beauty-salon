import "./main.min.js";
import "./common.min.js";
//#region src/components/custom/works/works.js
var gallery = document.querySelector("[data-gallery-viewport]");
function moveGallery(direction) {
	if (!gallery) return;
	const image = gallery.querySelector("img");
	const step = image ? image.getBoundingClientRect().width + 9 : 200;
	gallery.scrollBy({
		left: direction * step * 2,
		behavior: "smooth"
	});
}
document.querySelector("[data-gallery-prev]")?.addEventListener("click", () => moveGallery(-1));
document.querySelector("[data-gallery-next]")?.addEventListener("click", () => moveGallery(1));
gallery?.addEventListener("keydown", (event) => {
	if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
		event.preventDefault();
		moveGallery(event.key === "ArrowRight" ? 1 : -1);
	}
});
//#endregion
