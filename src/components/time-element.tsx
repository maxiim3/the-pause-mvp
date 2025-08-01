import type { Component } from "solid-js";

interface TimeElementProps {
  value: number;
  label: string;
}

const TimeElement: Component<TimeElementProps> = (props) => {
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
export default TimeElement;
