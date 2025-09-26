let copyButtonLabel = "Copy Code";
let codeBlocks = Array.from(document.querySelectorAll("pre"));

for (let codeBlock of codeBlocks) {
  let wrapper = document.createElement("div");
  wrapper.style.position = "relative";

  let copyButton = document.createElement("button");
  copyButton.className = "absolute top-0 right-0 bg-gray-800/75 hover:bg-gray-700 px-2 py-1 text-xs leading-4 text-white rounded";
  copyButton.innerHTML = copyButtonLabel;

  console.log(copyButton);

  codeBlock.setAttribute("tabindex", "0");
  codeBlock.appendChild(copyButton);
  // wrap codebock with relative parent element
  codeBlock?.parentNode?.insertBefore(wrapper, codeBlock);
  wrapper.appendChild(codeBlock);

  copyButton.addEventListener("click", async () => {
    await copyCode(codeBlock, copyButton);
  });
}

async function copyCode(block: HTMLPreElement, button: HTMLButtonElement) {
  let code = block.querySelector("code");
  let text = code?.innerText;

  await navigator.clipboard.writeText(text ?? "");

  // visual feedback that task is completed
  button.innerText = "Code Copied";

  setTimeout(() => {
    button.innerText = copyButtonLabel;
  }, 2000);
}
