import { useState, useEffect } from "react";

const QUERY = "(max-width: 767px)";

/**
 * Matches Tailwind `max-md` (viewport width under 768px).
 * Returns `null` until the first client measurement so callers can defer work (e.g. skip loading TensorFlow on phones without flashing desktop-only bundles on first paint).
 */
export function useIsMobile() {
    const [isMobile, setIsMobile] = useState(
        /** @type {boolean | null} */ (null)
    );

    useEffect(() => {
        const mq = window.matchMedia(QUERY);
        const update = () => setIsMobile(mq.matches);
        update();
        mq.addEventListener("change", update);
        return () => mq.removeEventListener("change", update);
    }, []);

    return isMobile;
}
