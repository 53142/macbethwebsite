/*
 * Modal
 *
 * Pico.css - https://picocss.com
 * Copyright 2019-2024 - Licensed under MIT
 */

// Config
const isOpenClass = "modal-is-open";
const openingClass = "modal-is-opening";
const closingClass = "modal-is-closing";
const scrollbarWidthCssVar = "--pico-scrollbar-width";
const animationDuration = 400; // ms
let visibleModal = null;

// Toggle modal
const toggleModal = (event) => {
  if (event) event.preventDefault();

  let src = event?.currentTarget?.src;
  const modal = document.getElementById("modal");
  if (!modal) return;

  modal.open ? closeModal() : openModal(modal, src);
};

// Open modal
const openModal = (modal, src) => {
  const { documentElement: html } = document;
  const scrollbarWidth = getScrollbarWidth();

  modal.innerHTML = `
    <article style="max-width: 90vw; max-height: 90vh; overflow: hidden; display: flex; flex-direction: column; align-items: center; text-align: center;">
      <img src="${src}" alt="Macbeth and Banquo with the Witches" style="max-width: 100%; height: auto; border-radius: var(--border-radius);">
      <button aria-label="Close" rel="prev" data-target="modal" style="margin: 20px; padding: 10px 15px;">Close</button>
    </article>
  `;

  const button = modal.querySelector("button");
  if (button) {
    button.addEventListener("click", toggleModal);
  }

  if (scrollbarWidth) {
    html.style.setProperty(scrollbarWidthCssVar, `${scrollbarWidth}px`);
  }

  html.classList.add(isOpenClass, openingClass);
  setTimeout(() => {
    visibleModal = modal;
    html.classList.remove(openingClass);
  }, animationDuration);

  modal.showModal();
};

// Close modal
const closeModal = () => {
  if (!visibleModal) return;

  const { documentElement: html } = document;
  html.classList.add(closingClass);
  
  setTimeout(() => {
    html.classList.remove(closingClass, isOpenClass);
    html.style.removeProperty(scrollbarWidthCssVar);
    visibleModal.close();
    visibleModal = null;
  }, animationDuration);
};

// Close with a click outside
document.addEventListener("click", (event) => {
  if (!visibleModal) return;
  const modalContent = visibleModal.querySelector("article");
  if (!modalContent.contains(event.target)) {
    closeModal();
  }
});

// Close with Esc key
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && visibleModal) {
    closeModal();
  }
});

// Get scrollbar width
const getScrollbarWidth = () => window.innerWidth - document.documentElement.clientWidth;

// Is scrollbar visible
const isScrollbarVisible = () => document.body.scrollHeight > window.innerHeight;
