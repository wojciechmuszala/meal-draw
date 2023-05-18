//handling of basic messages
export class StatusHandler {
    constructor(querySelector) {
        this.element = document.querySelector(querySelector);
    }

    add(statusType, message) {
        if (statusType === "success") {
            this.element.classList.add("status-info--success");
            this.element.innerHTML = message;
        } else if (statusType === "error") {
            this.element.classList.add("status-info--error");
            this.element.innerHTML = message;
        }
    }

    reset() {
        this.element.classList.remove("status-info--error");
        this.element.classList.remove("status-info--success");
        this.element.innerHTML = "";
    }
}
