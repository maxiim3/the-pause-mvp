import { useLocation, useSearchParams } from "@solidjs/router";
import {
  type Component,
  createEffect,
  createMemo,
  createSignal,
  onCleanup,
} from "solid-js";

interface Counter {
  minutes: number;
  seconds: number;
}

interface AppConfig extends Partial<Counter> {
  isPlaying?: boolean;
  guided?: boolean;
}

const TimeElement: Component<{ value: number; label: string }> = (props) => {
  return (
    <div class="flex flex-col">
      <span class="countdown font-mono text-5xl">
        <span style={{ "--value": props.value }} aria-live="polite">
          {props.value}
        </span>
      </span>
      {props.label}
    </div>
  );
};

const Counter: Component<AppConfig> = (props) => {
  const [counter, setCounter] = createSignal<Counter>({
    minutes: props.minutes,
    seconds: props.seconds,
  });

  const countDown = () => {
    setCounter((prev) => {
      const { minutes, seconds } = prev;

      return {
        minutes: seconds === 0 ? minutes - 1 : minutes,
        seconds: seconds === 0 ? 59 : seconds - 1,
      };
    });
  };

  const timer = setInterval(countDown, 1000);

  onCleanup(() => clearInterval(timer));

  return (
    <div class="grid grid-flow-col gap-5 text-center auto-cols-max">
      <TimeElement value={counter().minutes} label="minutes" />
      <TimeElement value={counter().seconds} label="seconds" />
    </div>
  );
};

const App: Component = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [minutes, setMinutes] = createSignal(
    Number(searchParams?.minutes as string) || 2,
  );

  const [seconds, setSeconds] = createSignal(
    Number(searchParams?.seconds as string) || 0,
  );

  const updateConfig = () => {
    const newMinutes = 3;
    const newSeconds = 58;

    setMinutes(newMinutes);
    setSeconds(newSeconds);
    setSearchParams({ minutes: newMinutes, seconds: newSeconds });
  };

  return (
    <>
      <header>this is a header</header>
      <main>
        <Counter seconds={seconds()} minutes={minutes()} />
        <button onClick={updateConfig} class="btn">
          click { minutes()} {seconds()}
        </button>
      </main>
      <footer>this is a foote</footer>
    </>
  );
};

export default App;
