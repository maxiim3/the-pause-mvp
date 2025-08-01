import { createSignal } from "solid-js";

const [isPlaying, setPlay] = createSignal(false);

const play = () => {
  setPlay(true);
};
const stop = () => {
  setPlay(false);
};

export { isPlaying, setPlay, play, stop }
