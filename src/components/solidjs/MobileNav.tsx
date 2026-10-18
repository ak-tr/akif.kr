import Link from "@/solid/Link.tsx";
import {NAVIGATION} from '@/consts';
import {For} from "solid-js";

export default function MobileNav() {
  let buttonRef: HTMLButtonElement;
  let menuRef: HTMLDivElement;

  const toggleMenu = () => {
    const isNavHidden = document.body.style.overflow === '';
    menuRef.classList.toggle('translate-x-full', !isNavHidden);
    menuRef.classList.toggle('translate-x-0', isNavHidden);
    document.body.style.overflow = isNavHidden ? 'hidden' : '';
  }

  return (
    <>
      <button aria-label="Toggle Menu" class="sm:hidden" ref={buttonRef} onClick={toggleMenu}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
             class="text-white h-7 w-7">
          <path fill-rule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clip-rule="evenodd"/>
        </svg>
      </button>
      <div ref={menuRef}
        class="translate-x-full fixed left-0 top-0 z-[60] h-full w-full transform bg-black duration-300 ease-in-out">
        <div class="flex justify-end">
          <button class="mr-4 mt-7 h-7 w-7" aria-label="Toggle Menu" onClick={toggleMenu}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                 class="text-white">
              <path fill-rule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clip-rule="evenodd"/>
            </svg>
          </button>
        </div>
        <nav class="mt-8">
          <For each={NAVIGATION}>
            {({href, title}) => (
              <div class="px-6 py-3 border-b border-neutral-900">
                <Link href={href} class="font-mono text-3xl tracking-tight text-white">
                  {title}
                </Link>
              </div>
            )}
          </For>
        </nav>
      </div>
    </>
  )
}
