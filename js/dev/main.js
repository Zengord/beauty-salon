//#region \0vite/modulepreload-polyfill.js
(function polyfill() {
	const relList = document.createElement("link").relList;
	if (relList && relList.supports && relList.supports("modulepreload")) return;
	for (const link of document.querySelectorAll("link[rel=\"modulepreload\"]")) processPreload(link);
	new MutationObserver((mutations) => {
		for (const mutation of mutations) {
			if (mutation.type !== "childList") continue;
			for (const node of mutation.addedNodes) if (node.tagName === "LINK" && node.rel === "modulepreload") processPreload(node);
		}
	}).observe(document, {
		childList: true,
		subtree: true
	});
	function getFetchOpts(link) {
		const fetchOpts = {};
		if (link.integrity) fetchOpts.integrity = link.integrity;
		if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
		if (link.crossOrigin === "use-credentials") fetchOpts.credentials = "include";
		else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
		else fetchOpts.credentials = "same-origin";
		return fetchOpts;
	}
	function processPreload(link) {
		if (link.ep) return;
		link.ep = true;
		const fetchOpts = getFetchOpts(link);
		fetch(link.href, fetchOpts);
	}
})();
//#endregion
//#region src/components/layout/header/header.js
var menuButton = document.querySelector(".header__toggle");
var menu = document.querySelector(".header__nav");
function closeMenu() {
	menu?.classList.remove("is-open");
	menuButton?.setAttribute("aria-expanded", "false");
	menuButton?.setAttribute("aria-label", "Открыть меню");
	document.body.classList.remove("menu-open");
}
menuButton?.addEventListener("click", () => {
	const isOpen = menuButton.getAttribute("aria-expanded") !== "true";
	menu?.classList.toggle("is-open", isOpen);
	menuButton.setAttribute("aria-expanded", String(isOpen));
	menuButton.setAttribute("aria-label", isOpen ? "Закрыть меню" : "Открыть меню");
	document.body.classList.toggle("menu-open", isOpen);
});
menu?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
window.addEventListener("resize", () => {
	if (window.innerWidth > 800) closeMenu();
});
document.addEventListener("keydown", (event) => {
	if (event.key === "Escape") closeMenu();
});
document.addEventListener("click", (event) => {
	if (event.target.closest("[data-booking-open]")) closeMenu();
});
//#endregion
//#region src/components/custom/booking-dialog/booking-dialog.js
var dialog = document.querySelector("[data-booking-dialog]");
var form = dialog?.querySelector("[data-booking-form]");
var success = dialog?.querySelector("[data-booking-success]");
var dateInput = form?.elements.namedItem("date");
if (dateInput) {
	const today = /* @__PURE__ */ new Date();
	dateInput.min = (/* @__PURE__ */ new Date(today.getTime() - today.getTimezoneOffset() * 6e4)).toISOString().slice(0, 10);
}
document.querySelectorAll("[data-booking-open]").forEach((button) => {
	button.addEventListener("click", () => {
		if (!dialog || !form || !success) return;
		form.reset();
		form.hidden = false;
		success.hidden = true;
		const service = button.dataset.service;
		if (service) form.elements.namedItem("service").value = service;
		dialog.showModal();
		document.body.classList.add("dialog-open");
		form.elements.namedItem("name").focus();
	});
});
function closeDialog() {
	dialog?.close();
	document.body.classList.remove("dialog-open");
}
dialog?.querySelectorAll("[data-booking-close]").forEach((button) => button.addEventListener("click", closeDialog));
dialog?.addEventListener("close", () => document.body.classList.remove("dialog-open"));
dialog?.addEventListener("click", (event) => {
	if (event.target === dialog) closeDialog();
});
form?.addEventListener("submit", (event) => {
	event.preventDefault();
	if (!form.reportValidity()) return;
	const values = new FormData(form);
	const date = new Intl.DateTimeFormat("ru-RU", {
		day: "numeric",
		month: "long",
		year: "numeric"
	}).format(/* @__PURE__ */ new Date(`${values.get("date")}T12:00:00`));
	const message = `Здравствуйте! Хочу записаться в AURA. Имя: ${values.get("name").trim()}. Телефон: ${values.get("phone").trim()}. Услуга: ${values.get("service")}. Удобная дата: ${date}.`;
	success.querySelector("[data-booking-sms]").href = `sms:+74951234567?body=${encodeURIComponent(message)}`;
	form.hidden = true;
	success.hidden = false;
	success.querySelector("[data-booking-sms]").focus();
});
//#endregion
