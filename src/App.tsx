import { Show, createContext, createResource, createSignal, getOwner } from "solid-js";

import { useClickOutside, useSaveToStorage, useAsyncAction, useAbortController, useVisibleState } from "./lib";

const C = createContext<number>();

const someFetch = () =>
  new Promise<string>((resolve, reject) => {
    setTimeout(() => {
      Math.random() > 0.5 ? resolve("resolved") : reject("Error");
    }, 2000);
  });

const Component = () => {
  const owner = getOwner();

  const [r, { refetch }] = createResource(async () => {
    useAbortController({ fallbackOwner: owner });

    await someFetch();
  });

  setTimeout(() => {
    refetch();
  }, 5000);

  const action = useAsyncAction();

  const handleClick = async () => {
    let data;

    try {
      data = await action.try(someFetch);
    } catch (error) {
      console.error(error);
    }

    console.log(data);
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

  const [valueToSave, setVal] = createSignal<number>();

  useSaveToStorage("app:data", valueToSave, { defer: false });

  const setRef = useClickOutside((e) => console.log("Clicked outside: ", e), {
    enabled: listeningEnabled,
  });

  const state = useVisibleState();

  return (
    <main>
      <Component />
      <button onClick={() => setVal(Math.random() > 0.5 ? 1 : undefined)}>click</button>
      <h1>Solid awesome hooks</h1>
      <button onClick={state.withAction("reveal", (e) => console.log(e))}>{String(state.isOpen())}</button>
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
