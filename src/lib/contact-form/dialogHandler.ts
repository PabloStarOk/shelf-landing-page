// TODO: Add aria-live and aria-busy.
const FETCH_TIMEOUT = 120000; // Two minutes.

const dialogModal: HTMLDialogElement = document.querySelector("#dialog") as HTMLDialogElement;
const dialogContent: HTMLParagraphElement = document.querySelector("#dialog-content") as HTMLParagraphElement;
const dialogCloseButton: HTMLButtonElement = document.querySelector("#dialog-button") as HTMLButtonElement;
const checkIconWrapper = document.getElementById('check-icon-wrapper') as HTMLDivElement;
const errorIconWrapper = document.getElementById('error-icon-wrapper') as HTMLDivElement;
const loadingIcon = document.getElementById('loading-icon') as HTMLDivElement;
const checkIcon = document.getElementById('check-icon') as HTMLDivElement;
const errorIcon = document.getElementById('error-icon') as HTMLDivElement;

const dialogMessages: Map<string, string> = new Map([
    ["loading", "Estamos enviando el formulario, por favor espere."],
    ["success", "Formulario enviado con éxito."],
    ["error", "Ocurrio un problema enviando el formulario, por favor intentelo de nuevo."],
    ["timeout", "El tiempo de espera concluyo y no pudo ser enviado el formulario, por favor intentelo de nuevo."]
]);

function disableEscKey(enable: boolean) {
    if (enable) {
        document.addEventListener('keydown', handleKeyDown);
    } else {
        document.removeEventListener('keydown', handleKeyDown);
    }
}

function handleKeyDown(event: HTMLElementEventMap["keydown"]) {
    if (event.key === 'Escape') event.preventDefault();
}

export function openDialog(abortController: AbortController, isRequestResolved: boolean): NodeJS.Timeout {
    dialogContent.textContent = dialogMessages.get("loading") as string;
    dialogModal.showModal();
    document.body.style.overflow = 'hidden';
    disableEscKey(true);
    return setTimeout(() => {
        if (!isRequestResolved)
            abortController.abort();
    }, FETCH_TIMEOUT)
}

export function showDialogResult(ok: boolean, messageType: string) {
    loadingIcon?.classList.add('hide');
    loadingIcon.style.display = 'none';

    if (ok) {
        checkIconWrapper.hidden = false;
        checkIcon.classList.add('show');
    }
    else {
        errorIconWrapper.hidden = false;
        errorIcon.classList.add('show');
    }

    dialogContent.textContent = dialogMessages.get(messageType) as string;
    dialogCloseButton.disabled = false;
    disableEscKey(false);
}
