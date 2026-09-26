//#region src/js/common/reveal.js
function initReveal() {
	if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
	const groups = [
		[".hero__content > *", 85],
		[".about__intro, .about .feature", 85],
		[".services .section-heading, .service-card", 55],
		[".reasons .section-title, .reason", 75],
		[".team .section-heading, .master-card", 70],
		[".prices .section-heading, .prices__lists, .prices__gift", 90],
		[".reviews .section-heading, .review", 75],
		[".works .section-heading, .works__gallery", 90],
		[".booking-banner__container > div, .booking-banner__container > button", 100],
		[".legal-content__container > *", 80]
	];
	const targets = [];
	for (const [selector, step] of groups) document.querySelectorAll(selector).forEach((element, index) => {
		element.dataset.reveal = "";
		element.style.setProperty("--reveal-delay", `${Math.min(index * step, 280)}ms`);
		targets.push(element);
	});
	if (!targets.length) return;
	document.documentElement.classList.add("motion-ready");
	const observer = new IntersectionObserver((entries) => {
		for (const entry of entries) {
			if (!entry.isIntersecting) continue;
			entry.target.classList.add("is-visible");
			observer.unobserve(entry.target);
		}
	}, {
		threshold: .08,
		rootMargin: "0px 0px -5% 0px"
	});
	targets.forEach((target) => observer.observe(target));
}
//#endregion
//#region src/js/app.js
initReveal();
//#endregion
