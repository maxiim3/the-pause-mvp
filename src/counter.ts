import { createEffect, createSignal } from "solid-js";
import { DEFAULT_COUNTER_MINUTES, DEFAULT_COUNTER_SECONDS } from "./constants";
import { Accessor, Setter } from "solid-js/types/server/reactive.js";

const [minutes, setMinutes] = createSignal(DEFAULT_COUNTER_MINUTES);
const [seconds, setSeconds] = createSignal(DEFAULT_COUNTER_SECONDS);

const countDown = () => {
  setMinutes(prev => {
    return seconds() === 0 ? prev - 1 : prev
  });

  setSeconds(prev => {
    return prev === 0 ? 59 : prev - 1
  });
};

export {
  minutes,
  setMinutes,

  seconds,
  setSeconds,

  countDown
}
