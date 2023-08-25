import { createSignal } from "solid-js";

import { useClickOutside, useSaveToStorage } from "./lib";

function App() {
  const [listeningEnabled, setListeningEnabled] = createSignal(true);

  const [valueToSave, setVal] = createSignal(123);

  useSaveToStorage("app:data", valueToSave, {defer: false});

  const setRef = useClickOutside((e) => console.log("Clicked outside: ", e), {
    enabled: listeningEnabled,
  });

  return (
    <main>
      <button onClick={() => setVal(Math.random())}>click</button>
      <h1>Solid awesome hooks</h1>
      <section>
        <h2>useClickOutside</h2>
        <button ref={setRef} onClick={() => setListeningEnabled((e) => !e)}>
          Click outside (see the console){" "}
          {listeningEnabled() ? "enabled" : "disabled"}
        </button>
      </section>
    </main>
  );
}

export default App;
