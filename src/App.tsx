import { createSignal } from "solid-js";

import { useClickOutside } from "./lib";

function App() {
  const [listeningEnabled, setListeningEnabled] = createSignal(true);

  const setRef = useClickOutside((e) => console.log("Clicked outside: ", e), {
    enabled: listeningEnabled,
  });

  return (
    <main>
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
