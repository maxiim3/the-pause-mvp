import {
  type Component,
  createEffect,
  createSignal,
  onCleanup,
} from "solid-js";
import { ONE_SECOND } from "../constants";
import { countDown, minutes, seconds } from "../counter";
import TimeElement from "./time-element";
import { isPlaying } from "../player";

const CounterBlock: Component = () => {
  const [timer, setTimerId] = createSignal<number>(0);

  createEffect(() => {
    if (isPlaying()) {
      const timer = setInterval(countDown, ONE_SECOND);
      setTimerId(timer);
    } else {
      clearInterval(timer());
    }
  });

  onCleanup(() => clearInterval(timer()));

  return (
    <div class="grid grid-flow-col gap-5 text-center auto-cols-max">
      <TimeElement value={minutes()} label="minutes" />
      <TimeElement value={seconds()} label="seconds" />
    </div>
  );
};

export default CounterBlock;
