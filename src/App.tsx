import { useSearchParams } from "@solidjs/router";
import { type Component, createEffect } from "solid-js";
import CounterBlock from "./components/counter-block";
import { minutes, seconds, setMinutes, setSeconds } from "./counter";
import { isPlaying, play, setPlay, stop } from "./player";

const App: Component = () => {
  const [searchParams, setSearchParams] = useSearchParams();

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
        <CounterBlock />
        <div class="flex items-center gap-4">
          <button
            type="button"
            onclick={() =>
              updateConfig({ type: "minutes", value: minutes() - 1 })
            }
            class="btn btn-sm"
          >
            - min
          </button>
          <p>{minutes()} min</p>
          <button
            type="button"
            onclick={() =>
              updateConfig({ type: "minutes", value: minutes() + 1 })
            }
            class="btn btn-sm"
          >
            + min
          </button>
        </div>
        <div class="flex items-center gap-4">
          <button
            type="button"
            onclick={() =>
              updateConfig({ type: "seconds", value: seconds() - 1 })
            }
            class="btn btn-sm"
          >
            - sec
          </button>
          <p>{seconds()} sec</p>
          <button
            type="button"
            onclick={() =>
              updateConfig({ type: "seconds", value: seconds() + 1 })
            }
            class="btn btn-sm"
          >
            + sec
          </button>
        </div>

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
