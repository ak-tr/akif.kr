const copyCodeSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"><path fill="currentColor" d="M9 18q-.825 0-1.412-.587T7 16V4q0-.825.588-1.412T9 2h9q.825 0 1.413.588T20 4v12q0 .825-.587 1.413T18 18zm0-2h9V4H9zm-4 6q-.825 0-1.412-.587T3 20V7q0-.425.288-.712T4 6t.713.288T5 7v13h10q.425 0 .713.288T16 21t-.288.713T15 22zm4-6V4z"/></svg>'
const copyButtonLabel = `<div class="flex items-center gap-1">${copyCodeSvg}<div>Copy code</div></div>`;

const copiedCodeSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"><path fill="currentColor" d="m10 13.6l5.9-5.9q.275-.275.7-.275t.7.275t.275.7t-.275.7l-6.6 6.6q-.3.3-.7.3t-.7-.3l-2.6-2.6q-.275-.275-.275-.7t.275-.7t.7-.275t.7.275z"/></svg>'
const copiedButtonLabel = `<div class="flex items-center gap-1">${copiedCodeSvg}<div>Copied</div></div>`

const addCopyCodeButtons = () => {
    const codeBlocks = Array.from(document.querySelectorAll("pre"));

    for (const codeBlock of codeBlocks) {
        const wrapper = document.createElement("div");
        wrapper.style.position = "relative";

        const copyButtonContainer = document.createElement("div");
        copyButtonContainer.className = "absolute top-1 right-1 w-full h-[90%] pointer-events-none flex justify-end items-start";

        const copyButton = document.createElement("button");
        copyButton.className = "sticky top-2 right-2 rounded-md text-white hover:text-white/75 bg-[#17191E] bg-opacity-75 px-3 py-2 text-xs leading-4 rounded z-10 pointer-events-auto";
        copyButton.innerHTML = copyButtonLabel;

        codeBlock?.parentNode?.insertBefore(wrapper, codeBlock);
        wrapper.appendChild(codeBlock);
        wrapper.appendChild(copyButtonContainer);
        copyButtonContainer.appendChild(copyButton);

        copyButton.addEventListener("click", async () => {
            await copyCode(codeBlock, copyButton);
        });
    }
}

const copyCode = async (block: HTMLPreElement, button: HTMLButtonElement) => {
    const code = block.querySelector("code");
    const text = code?.innerText;

    await navigator.clipboard.writeText(text ?? "");

    button.innerHTML = copiedButtonLabel;

    setTimeout(() => {
        button.innerHTML = copyButtonLabel;
    }, 2000);
}

document.addEventListener("astro:page-load", () => {
    addCopyCodeButtons();
});
