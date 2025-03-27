// Estilização do container e botões
document.head.insertAdjacentHTML('beforeend', `
    <style>
        body {
            font-family: Arial, sans-serif;
            text-align: center;
            background-color: #f4f4f4;
            margin: 0;
            padding: 20px;
        }
        #container {
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            background-color: #2e2e2e;
            padding: 20px;
            border-radius: 15px;
            box-shadow: 0px 4px 15px rgba(0,0,0,0.3);
            color: #fff;
            max-width: 800px;
            margin: auto;
            position: relative;
        }
        video, canvas, img {
            max-width: 100%;
            border-radius: 10px;
            display: none;
        }
        #capture, #switchCamera {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background-color: rgba(0, 0, 0, 0.5);
            border: 4px solid #c4ff00;
            position: absolute;
            bottom: 20px;
            cursor: pointer;
            display: flex;
            justify-content: center;
            align-items: center;
            color: #c4ff00;
            font-size: 20px;
        }
        #capture {
            left: 50%;
            transform: translateX(-50%);
        }
        #switchCamera {
            left: calc(50% + 80px);
        }
    </style>
`);

const captureButton = document.getElementById('capture');
const switchCameraButton = document.getElementById('switchCamera');
const canvas = document.getElementById('canvas');
const photo = document.getElementById('photo');
const video = document.getElementById('video');
let useFrontCamera = false;
let stream = null;

async function startCamera() {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }
    stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: useFrontCamera ? 'user' : 'environment' }
    });
    video.srcObject = stream;
    video.style.display = 'block';
    await video.play();
}

startCamera();

captureButton.addEventListener('click', async () => {
    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    await preencherInformacoes(context);
    photo.src = canvas.toDataURL('image/jpeg');
    downloadImage(photo.src);
});

switchCameraButton.addEventListener('click', () => {
    useFrontCamera = !useFrontCamera;
    startCamera();
});

function downloadImage(dataUrl) {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'foto_gps_map_camera.jpg';
    link.click();
}

async function preencherInformacoes(context) {
    const now = new Date();
    const dataHora = now.toLocaleString();
    let latitude = 'Obtendo...';
    let longitude = 'Obtendo...';

    if (navigator.geolocation) {
        await new Promise(resolve => {
            navigator.geolocation.getCurrentPosition(pos => {
                latitude = pos.coords.latitude.toFixed(6);
                longitude = pos.coords.longitude.toFixed(6);
                resolve();
            }, resolve);
        });
    }

    context.fillStyle = 'rgba(0, 0, 0, 0.6)';
    context.fillRect(10, canvas.height - 100, canvas.width - 20, 90);
    context.fillStyle = 'white';
    context.font = '16px Arial';
    context.fillText('Localização: FotoLab', 20, canvas.height - 70);
    context.fillText(`Latitude: ${latitude} | Longitude: ${longitude}`, 20, canvas.height - 50);
    context.fillText('Data e Hora: ' + dataHora, 20, canvas.height - 30);
}
