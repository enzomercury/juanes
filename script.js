// Enlace al modelo de Teachable Machine
const URL = "./my_model/";

let model, webcam, labelContainer, maxPredictions;

// Inicializa el modelo y la cámara
async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    // Carga el modelo y los metadatos
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    // Configura la cámara
    const flip = true;
    webcam = new tmImage.Webcam(400, 400, flip);
    await webcam.setup();
    await webcam.play();
    window.requestAnimationFrame(loop);

    // Añade la cámara al DOM
    document.getElementById("webcam-container").appendChild(webcam.canvas);
    labelContainer = document.getElementById("label-container");
    for (let i = 0; i < maxPredictions; i++) {
        labelContainer.appendChild(document.createElement("div"));
    }
}

// Función para predecir en cada frame
async function loop() {
    webcam.update();
    await predict();
    window.requestAnimationFrame(loop);
}

// Realiza la predicción del modelo
async function predict() {
    const prediction = await model.predict(webcam.canvas);
    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction = prediction[i].className + ": " + prediction[i].probability.toFixed(2);
        labelContainer.childNodes[i].innerHTML = classPrediction;
    }

    // Muestra el resultado principal
    const resultText = document.getElementById("result-text");
    const topPrediction = prediction[0];
    resultText.textContent = `${topPrediction.className} (${(topPrediction.probability * 100).toFixed(2)}%)`;

    // Cambia color según el tipo de material
    if (topPrediction.className === "Reciclable") {
        resultText.style.color = "#388e3c"; // Verde
    } else {
        resultText.style.color = "#d32f2f"; // Rojo
    }
}
