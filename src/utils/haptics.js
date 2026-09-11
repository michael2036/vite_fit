// navigator.vibrate is unsupported on iOS Safari and any non-mobile browser,
// and throws in some locked-down embedded webviews. Centralizing the guard
// here means every tap handler doesn't need its own try/catch.
export function triggerHaptic(pattern = 20) {
    try {
        if (navigator.vibrate) navigator.vibrate(pattern);
    } catch (e) {
        // haptics are a nice-to-have; silently ignore if blocked or unsupported
    }
}
