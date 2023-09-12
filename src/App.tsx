import { Show, createEffect, createSignal } from "solid-js";

import { useClickOutside, useSaveToStorage, useAsyncAction } from "./lib";

const someFetch = () =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 2000);
  });

const Component = () => {
  const action = useAsyncAction();

  const handleClick = async () => {
    action.try(
      async () => {
        const data = await someFetch();

        if (Math.random() > 0.5) throw new Error();

        // handle ssomthing with data
      },
      {
        catchHandler: (error, setErrorMessage) => setErrorMessage("Fetch failed"),
        finallyHandler: () => console.log("log from `finally` block!"),
      }
    );
  };

  return (
    <section>
      <button onClick={handleClick} disabled={action.state() === "pending"}>
        click
      </button>
      <button onClick={action.reset} disabled={action.state() !== "errored"}>
        ResetError
      </button>
      <Show when={action.errorMessage()}>{(errorMessage) => <p>{errorMessage()}</p>}</Show>
    </section>
  );
};

function App() {
  const [listeningEnabled, setListeningEnabled] = createSignal(true);

  const [valueToSave, setVal] = createSignal(123);

  useSaveToStorage("app:data", valueToSave, { defer: false });

  const setRef = useClickOutside((e) => console.log("Clicked outside: ", e), {
    enabled: listeningEnabled,
  });

  return (
    <main>
      <Component />
      <button onClick={() => setVal(Math.random())}>click</button>
      <h1>Solid awesome hooks</h1>
      <section>
        <h2>useClickOutside</h2>
        <button ref={setRef} onClick={() => setListeningEnabled((e) => !e)}>
          Click outside (see the console) {listeningEnabled() ? "enabled" : "disabled"}
        </button>
      </section>
    </main>
  );
}

export default App;
