export class Modal {
    constructor() {
        this.modalEl = document.querySelector(".modal");
        this.modalHeaderContentEl = document.querySelector(
            ".modal__header-content"
        );
        this.modalBodyEl = document.querySelector(".modal__body");
        this.closeButtonEl = document.querySelector(".modal__close");
        this.closeButtonEl.addEventListener(
            "click",
            this.closeModal.bind(this)
        );
        this.approveButtonEl = document.querySelector(".modal__approve-button");
        this.approveButtonEl.addEventListener(
            "click",
            this.closeModal.bind(this)
        );
        this.denyButtonEl = document.querySelector(".modal__deny-button");
        this.denyButtonEl.addEventListener("click", this.closeModal.bind(this));
    }

    closeModal() {
        this.modalEl.classList.remove("modal--active");
    }
}
