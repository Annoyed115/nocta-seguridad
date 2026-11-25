"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { FLY_MS, HOLD_MS, RISE_MS } from "./intro-timing";

const IntroSign = dynamic(() => import("./IntroSign"), { ssr: false });

// Skip the opening (the visit did not start on the home page, it played already, or reduced motion), go 3D, or stay flat
// without WebGL. Read on every mount: reaching the home page from another page (the logo, the menu) must not play it.
let webgl: boolean | undefined;
const getMode = () => {
  const html = document.documentElement.classList;
  if (!html.contains("intro-on") || html.contains("intro-done") || matchMedia("(prefers-reduced-motion: reduce)").matches) return "skip";
  return (webgl ??= !!document.createElement("canvas").getContext("webgl2")) ? "3d" : "flat";
};
const noSubscription = () => () => {};
const WAIT_3D_MS = 2500; // longest wait for the 3D code; after that the flat logo plays the opening
const SKIP_ON = ["pointerdown", "keydown", "wheel", "touchstart"] as const;
const TOTAL = RISE_MS + HOLD_MS + FLY_MS;
const ARRIVE = "cubic-bezier(0.33, 1, 0.68, 1)"; // easeOutCubic: the same curve the 3D spin slows with, so both settle together

/** easeInOutCubic: lifts off gently, glides, settles gently. */
const ease = (t: number) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2);

/** The headline slides in (halfway through the flight, or at once on skip); `done` also shows the bar's logo where the sign landed. */
const html = (...names: string[]) => document.documentElement.classList.add(...names);

/**
 * Opening of the home page. An alarm glow breathes while the 3D sign loads; then, on one clock (the sign's animation,
 * which the 3D turn also reads), it rises out of the light turning, lands face-on and catches a sweep of light, rests,
 * and glides along an arc onto the bar's logo while the field clears. Any input skips it. Everything unmounts at the end.
 */
export function Intro() {
  const state = useSyncExternalStore(noSubscription, getMode, () => "flat");
  const [go, setGo] = useState(false);
  const [flat, setFlat] = useState(false);
  const [done, setDone] = useState(false);
  const use3d = state === "3d" && !flat;
  const field = useRef<HTMLDivElement>(null);
  const logo = useRef<HTMLDivElement>(null);
  const clock = useRef<Animation | null>(null);

  // Start when the 3D sign has painted, or without it after the wait (or at once without WebGL).
  useEffect(() => {
    if (state === "skip" || go) return;
    const timer = setTimeout(
      () => {
        setFlat(true);
        setGo(true);
      },
      state === "flat" ? 0 : WAIT_3D_MS,
    );
    return () => clearTimeout(timer);
  }, [state, go]);

  // Any tap, key or scroll ends the opening at once (0.3 s, quicker than arriving): nobody has to sit through it.
  useEffect(() => {
    if (state === "skip" || done) return;
    const skip = () => {
      html("intro-words");
      field.current
        ?.animate({ opacity: [1, 0] }, { duration: 300, easing: "ease-in", fill: "forwards" })
        .finished.then(() => {
          html("intro-done");
          setDone(true);
        });
    };
    SKIP_ON.forEach((e) => addEventListener(e, skip, { once: true, passive: true }));
    return () => SKIP_ON.forEach((e) => removeEventListener(e, skip));
  }, [state, done]);

  // The choreography, every part started on the same frame.
  useEffect(() => {
    const el = logo.current;
    const target = document.querySelector("header img")?.getBoundingClientRect();
    if (!go || !el || !field.current || !target) return;
    const { clientWidth, clientHeight } = document.documentElement; // the fixed field's size, without the scrollbar
    const dx = target.left + target.width / 2 - clientWidth / 2;
    const dy = target.top + target.height / 2 - clientHeight / 2;
    const scale = target.width / el.offsetWidth;
    const at = (ms: number) => ms / TOTAL;

    // Rise from below the screen, rest in the centre, then the flight along a quadratic arc (up first, then across), shrinking.
    const flight = Array.from({ length: 25 }, (_, i) => {
      const e = ease(i / 24);
      const x = 2 * (1 - e) * e * 0.3 * dx + e * e * dx; // control point (0.3 dx, 0.9 dy)
      const y = 2 * (1 - e) * e * 0.9 * dy + e * e * dy;
      return { offset: at(RISE_MS + HOLD_MS + (FLY_MS * i) / 24), translate: `calc(-50% + ${x}px) calc(-50% + ${y}px)`, scale: String(1 + (scale - 1) * e) };
    });
    const main = el.animate(
      [{ offset: 0, translate: "-50% 100vh", scale: "1", easing: ARRIVE }, { offset: at(RISE_MS), translate: "-50% -50%", scale: "1" }, ...flight],
      { duration: TOTAL, fill: "forwards" },
    );
    const parts = [
      main,
      // The dark field clears during the flight.
      field.current.animate(
        [{ backgroundColor: "#141110" }, { offset: at(RISE_MS + HOLD_MS), backgroundColor: "#141110" }, { offset: at(RISE_MS + HOLD_MS + FLY_MS * 0.9), backgroundColor: "transparent" }, { backgroundColor: "transparent" }],
        { duration: TOTAL, fill: "forwards" },
      ),
      // One sweep of light as it lands, finished before the flight begins.
      el.animate({ opacity: [1, 1], backgroundPosition: ["150% 0", "-50% 0"] }, { pseudoElement: "::after", delay: RISE_MS - 150, duration: 750, easing: "ease-in-out" }),
    ];
    const img = el.querySelector("img");
    if (!use3d && img) parts.push(img.animate({ transform: ["perspective(1500px) rotateY(-720deg)", "none"] }, { duration: RISE_MS, easing: ARRIVE }));
    const t0 = document.timeline.currentTime;
    parts.forEach((a) => (a.startTime = t0));
    clock.current = main;

    const words = setTimeout(() => html("intro-words"), RISE_MS + HOLD_MS + FLY_MS / 4); // the headline moves as soon as the field starts to clear
    main.finished.then(
      () => {
        html("intro-words", "intro-done");
        setDone(true);
      },
      () => {}, // cancelled
    );
    return () => {
      clearTimeout(words);
      parts.forEach((a) => a.cancel());
    };
  }, [go, use3d]);

  if (done || state === "skip") return null;

  return (
    <div ref={field} className={`intro ${go ? "go" : ""}`} aria-hidden>
      <div ref={logo} className="intro-logo">
        <Image src="/brand/logo-1024.png" alt="" fill sizes="637px" preload className={use3d ? "opacity-0" : ""} />
        {use3d && (
          <div className="absolute -inset-[15%]">
            <IntroSign clock={clock} onPainted={() => setGo(true)} />
          </div>
        )}
      </div>
    </div>
  );
}
