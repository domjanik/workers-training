try {
  importScripts(
    "//fandom-ae-assets.s3.amazonaws.com/performance-tests/main.js"
  );
  importScripts(
    "//cdnjs.cloudflare.com/ajax/libs/moment.js/2.24.0/moment.min.js"
  );
} catch (e) {
  console.error(e);
}

const messages = {
  startCounting: "startCounting",
  stopCounting: "stopCounting",
  message: "message",
  calculateFibonacci: "calculateFibonacci",
};

let countingStarted = false;
let currentNumber = 0;

const counting = () => {
  setInterval(() => {
    if (countingStarted) {
      currentNumber++;
    }
  }, 100);
  console.log("Worker: Counting started");
};

const startCounting = () => {
  countingStarted = true;
  counting();
};

const stopCounting = () => {
  countingStarted = false;
};

const message = (e) => {
  console.log(
    `[${currentNumber}] Received message from main script: ${e.data}`
  );
};

const calculateFibonacci = (n) => {
  console.log("[Worker] Calculating Fibonacci: " + n);
  if (typeof n != "number") {
    n = 100;
  }
  if (n <= 1) return n;
  return calculateFibonacci(n - 1) + calculateFibonacci(n - 2);
};

const messageCallbacks = {
  [messages.startCounting]: startCounting,
  [messages.stopCounting]: stopCounting,
  [messages.message]: message,
  [messages.calculateFibonacci]: calculateFibonacci,
};

onmessage = function (e) {
  try {
    messageCallbacks[e.data](e);
  } catch (e) {
    console.error("Invalid Message: ", e);
  }
};
