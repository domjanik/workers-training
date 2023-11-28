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

const startCalculateFibonacci = () => {
  calculateFibonacci(100);
};

const calculateFibonacci = (nTerms) => {
  function fibonacci(num) {
    if (num < 2) {
      return num;
    } else {
      return fibonacci(num - 1) + fibonacci(num - 2);
    }
  }

  if (nTerms <= 0) {
    console.log("Enter a positive integer.");
  } else {
    for (let i = 0; i < nTerms; i++) {
      console.log(fibonacci(i));
    }
  }
};

const messageCallbacks = {
  [messages.startCounting]: startCounting,
  [messages.stopCounting]: stopCounting,
  [messages.message]: message,
  [messages.calculateFibonacci]: startCalculateFibonacci,
};

onmessage = function (e) {
  try {
    messageCallbacks[e.data](e);
  } catch (e) {
    console.error("Invalid Message: ", e);
  }
};
