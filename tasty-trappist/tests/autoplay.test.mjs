import { test } from "node:test";
import assert from "node:assert/strict";
import { autoplay } from "../src/components/autoplay.ts";

test("autoplay stops only after four seconds of reduced motion, shared by late subscribers", (t) => {
    t.mock.timers.enable({ apis: ["setTimeout"] });
    const motion = Object.assign(new EventTarget(), { matches: true });
    const originalWindow = globalThis.window;
    globalThis.window = { matchMedia: () => motion };
    const subscriptions = [];
    t.after(() => {
        for (const unsubscribe of subscriptions) unsubscribe();
        if (originalWindow === undefined) delete globalThis.window;
        else globalThis.window = originalWindow;
    });

    let playing;
    let latePlaying;
    subscriptions.push(autoplay.subscribe((value) => { playing = value; }));
    assert.equal(playing, true);
    t.mock.timers.tick(3999);
    assert.equal(playing, true, "reduced-motion introduction lasts four seconds");
    t.mock.timers.tick(1);
    assert.equal(playing, false);

    subscriptions.push(autoplay.subscribe((value) => { latePlaying = value; }));
    assert.equal(latePlaying, false, "late hydration must not restart the introduction");

    const setReducedMotion = (matches) => {
        motion.matches = matches;
        motion.dispatchEvent(new Event("change"));
    };
    setReducedMotion(false);
    t.mock.timers.tick(12000);
    assert.equal(playing, true, "normal autoplay continues beyond four seconds");
    assert.equal(latePlaying, true);

    setReducedMotion(true);
    t.mock.timers.tick(3999);
    assert.equal(playing, true, "enabling reduced motion starts a fresh four-second window");
    t.mock.timers.tick(1);
    assert.equal(playing, false);
    assert.equal(latePlaying, false);

    setReducedMotion(false);
    setReducedMotion(true);
    t.mock.timers.tick(2000);
    setReducedMotion(false);
    t.mock.timers.tick(10000);
    assert.equal(playing, true, "disabling reduced motion cancels a pending stop");
    assert.equal(latePlaying, true);
});
