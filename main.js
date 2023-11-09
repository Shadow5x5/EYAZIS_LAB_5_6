const recognition = new webkitSpeechRecognition();
recognition.continuous = true;

const currentDate = new Date();
const options = { year: "numeric", month: "long", day: "numeric" };
const formattedDate = currentDate.toLocaleDateString("ru-RU", options);

recognition.onstart = () => {
    notifyListening();
};

recognition.onresult = (event) => {
    const transcript = event.results[event.results.length - 1][0].transcript;
    populateVoices();
    console.log("Результат:", transcript);
    if (
        transcript.toLowerCase().includes("антон") &&
        transcript.toLowerCase().includes("открой калькулятор")
    ) {
        window.open("Calculator:///");
    } else if (
        transcript.toLowerCase().includes("антон") &&
        transcript.toLowerCase().includes("открой календарь")
    ) {
        window.open("OutlookCal:///");
    } else if (
        transcript.toLowerCase().includes("антон") &&
        transcript.toLowerCase().includes("открой настройки")
    ) {
        window.open("ms-settings:");
    } else if (
        transcript.toLowerCase().includes("антон") &&
        transcript.toLowerCase().includes("какое сегодня число")
    ) {
        const currentDate = new Date();
        const options = { year: "numeric", month: "long", day: "numeric" };
        const formattedDate = currentDate.toLocaleDateString("ru-RU", options);
        speakDate(formattedDate);
    } else if (
        (transcript.toLowerCase().includes("антон") &&
            transcript.toLowerCase().includes("прочитай текст")) ||
        transcript.toLowerCase().includes("прочитайте текст")
    ) {
        readText();
    } else if (
        transcript.toLowerCase().includes("антон") &&
        transcript.toLowerCase().includes("пауза")
    ) {
        const speechSynthesis = window.speechSynthesis;
        if (speechSynthesis.speaking) {
            speechSynthesis.pause();
        }
    } else if (
        transcript.toLowerCase().includes("антон") &&
        transcript.toLowerCase().includes("возобновить")
    ) {
        const speechSynthesis = window.speechSynthesis;
        if (speechSynthesis.paused) {
            speechSynthesis.resume();
        }
    }
};

recognition.onend = () => {
    notifyListeningFinished();
    startListening();
};

function startListening() {
    recognition.start();
}

function notifyListening() {
    alert("Начало распознавания...");
}

function notifyListeningFinished() {
    alert("Распознавание завершено.");
}

function notifyResult(result) {
    alert("Результат: " + result);
}

function speakDate(date) {
    const utterance = new SpeechSynthesisUtterance(date);
    const speechSynthesis = window.speechSynthesis;

    utterance.lang = "ru-RU";
    const voices = speechSynthesis.getVoices();
    console.log(voices);

    const voice = voices.find((voice) => voice.name === 'Microsoft Pavel - Russian (Russia)');

    utterance.voice = voice;
    speechSynthesis.speak(utterance);
}

function readText() {
    const textInput = document.getElementById("textInput").value;
    const volume = document.getElementById("volumeSlider").value;
    const rate = document.getElementById("rateSlider").value;
    const selectedVoice = document.getElementById("voiceSelect").value;

    const utterance = new SpeechSynthesisUtterance(textInput);
    const speechSynthesis = window.speechSynthesis;

    utterance.lang = "ru-RU";
    utterance.volume = parseFloat(volume);
    utterance.rate = parseFloat(rate);

    const voices = speechSynthesis.getVoices();
    const selectedVoiceObj = voices.find(
        (voice) => voice.name === selectedVoice
    );
    utterance.voice = selectedVoiceObj;

    speechSynthesis.speak(utterance);
}

function populateVoices() {
    const voiceSelect = document.getElementById("voiceSelect");
    const speechSynthesis = window.speechSynthesis;

    const voices = speechSynthesis.getVoices();
    voices.forEach(function (voice) {
        const option = document.createElement("option");
        option.value = voice.name;
        option.textContent = voice.name + " (" + voice.lang + ")";
        voiceSelect.appendChild(option);
    });
}
window.onload = populateVoices;
window.speechSynthesis.onvoiceschanged = populateVoices;

startListening();
