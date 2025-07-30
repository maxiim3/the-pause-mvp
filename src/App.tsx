import { useLocation, useSearchParams } from "@solidjs/router";
import {
  type Component,
  createEffect,
  createMemo,
  createSignal,
  onCleanup,
  splitProps,
} from "solid-js";

interface Counter {
  minutes: number;
  seconds: number;
}

interface AppConfig extends Partial<Counter> {
  isPlaying?: boolean;
  guided?: boolean;
}

interface SetCounterProps {
  type: "minutes" | "seconds";
  value: number;
}

interface CounterComponentProps extends AppConfig {
  setCounter: (props: SetCounterProps) => void;
}

const ONE_SECOND = 1000;
const DEFAULT_COUNTER_MINUTES = 5;
const DEFAULT_COUNTER_SECONDS = 0;

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

const Counter: Component<CounterComponentProps> = (props) => {
  const [counter, isPlaying, restProps] = splitProps(
    props,
    ["minutes", "seconds"],
    ["isPlaying"],
  );

  const [timer, setTimerId] = createSignal<number>(0);

  const countDown = () => {
    restProps.setCounter({
      type: "minutes",
      value: counter.seconds === 0 ? counter.minutes - 1 : counter.minutes,
    });
    restProps.setCounter({
      type: "seconds",
      value: counter.seconds === 0 ? 59 : counter.seconds - 1,
    });
  };

  createEffect(() => {
    if (isPlaying) {
      const timer = setInterval(countDown, ONE_SECOND);
      setTimerId(timer);
    } else {
      clearInterval(timer());
    }
  });

  onCleanup(() => clearInterval(timer()));

  return (
    <div class="grid grid-flow-col gap-5 text-center auto-cols-max">
      <TimeElement value={counter.minutes} label="minutes" />
      <TimeElement value={counter.seconds} label="seconds" />
    </div>
  );
};

const App: Component = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [minutes, setMinutes] = createSignal(DEFAULT_COUNTER_MINUTES);

  const [seconds, setSeconds] = createSignal(DEFAULT_COUNTER_SECONDS);

  const [isPlaying, setPlay] = createSignal(false);

  const play = () => {
    setPlay(true);
  };

  const stop = () => {
    setPlay(false);
  };

  const updateCounter = (props: SetCounterProps) => {
    switch (props.type) {
      case "seconds":
        return setSeconds(props.value);
      case "minutes":
        return setMinutes(props.value);
    }
  };

  const updateConfig = (
    props:
      | { type: "minutes" | "seconds"; value: number }
      | { type: "isPlaying"; value: boolean },
  ) => {
    console.log("updateConfig called with:", props);
    let newMinutes = minutes();
    let newSeconds = seconds();
    let newIsPlaying = isPlaying();

    if (props.type === "minutes") {
      newMinutes = props.value;
    } else if (props.type === "seconds") {
      newSeconds = props.value;
    } else if (props.type === "isPlaying") {
      newIsPlaying = props.value;
    }

    setSearchParams({
      minutes: newMinutes,
      seconds: newSeconds,
      isPlaying: newIsPlaying ? "true" : "false",
    });
    console.log(
      `Updated search params: minutes=${newMinutes}, seconds=${newSeconds}, isPlaying=${newIsPlaying}`,
    );
  };

  createEffect(
    () => {
      console.log("App effect ran");
      const currentMinutes = Number(searchParams.minutes);
      const currentSeconds = Number(searchParams.seconds);
      const currentIsPlaying = searchParams?.isPlaying === "true" || false;

      console.log(
        `Effect: minutes=${currentMinutes}, seconds=${currentSeconds}, isPlaying=${currentIsPlaying}`,
      );

      setMinutes(currentMinutes);
      setSeconds(currentSeconds);
      setPlay(currentIsPlaying);
    },
    null,
    { name: "coucou" },
  );

  return (
    <>
      <header class="fixed top-2 w-full h-8 rounded-4xl bg-slate-500/50">
        this is a header
      </header>
      <main class="flex flex-col gap-3 h-lvh items-center justify-center p-32">
        <Counter
          seconds={seconds()}
          minutes={minutes()}
          isPlaying={isPlaying()}
          setCounter={updateCounter}
        />
        <button
          type="button"
          onclick={() => updateConfig({ type: "seconds", value: 12 })}
          class="btn"
        >
          click
        </button>
        <p>
          min:{minutes()} sec:{seconds()} play:{isPlaying()}
        </p>

        <button type="button" onclick={play} class="btn btn-primary">
          Play
        </button>
        <button type="button" onclick={stop} class="btn btn-secondary">
          Stop
        </button>
      </main>
      <footer class="fixed bottom-2 w-full h-8 rounded-4xl bg-slate-500/50">
        this is a foote
      </footer>
    </>
  );
};

export default App;
