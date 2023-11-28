import { useEffect, useMemo } from "react";
import "./App.css";

function App() {
  let myWorker, myServiceWorker;
  const runWorker = () => {
    myWorker = new Worker("./worker.js");
  };

  const calculateFibonacci = (n) => {
    console.log("[App] Calculating Fibonacci: " + n);
    if (n === 0) return 0;
    if (n === 1) return 1;

    return calculateFibonacci(n - 1) + calculateFibonacci(n - 2);
  };

  const msgWorker = (msg) => {
    myWorker.postMessage(msg);
    sendAnalyticsEvent(msg);
  };

  const sendAnalyticsEvent = (event) => {
    return fetch(
      "http://localhost:1234/__track?event=" + event + "&time=" + Date.now()
    );
  };

  const serviceWorker = async () => {
    if ("serviceWorker" in navigator) {
      try {
        myServiceWorker = await navigator.serviceWorker.register("./sw.js");
        console.log("Service Worker Registered");
      } catch (error) {
        console.log("Service Worker Registration Failed");
      }
    }
  };

  useEffect(() => {
    runWorker();
    serviceWorker();
    return () => {
      myWorker.terminate();
    };
  }, []);

  return (
    <div className="container">
      <button onClick={() => msgWorker("startCounting")}>Start Counting</button>
      <button onClick={() => msgWorker("message")}>Message Worker</button>
      <button onClick={() => calculateFibonacci(5)}>
        Calculate Fibonacci (Without Worker)
      </button>
      <button onClick={() => msgWorker("calculateFibonacci")}>
        Calculate Fibonacci (Worker)
      </button>
      <button onClick={() => msgWorker("stopCounting")}>Stop Counting</button>
      <div className="ui-section">
        <button onClick={() => console.log("Clicked!")}>Console log</button>
        <div className="hover-me">Hover me!</div>
      </div>
    </div>
  );
}

export default App;
