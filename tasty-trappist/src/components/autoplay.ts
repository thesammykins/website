import { readable } from "svelte/store";

// One page-wide clock keeps CSS and canvas autoplay in sync, including islands
// that hydrate after the reduced-motion introduction has already finished.
export const autoplay = readable(true, (set) => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer: ReturnType<typeof setTimeout> | undefined;

    const sync = () => {
        clearTimeout(timer);
        set(true);
        if (motion.matches) timer = setTimeout(() => set(false), 4000);
    };

    motion.addEventListener("change", sync);
    sync();

    return () => {
        clearTimeout(timer);
        motion.removeEventListener("change", sync);
    };
});
