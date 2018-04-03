const socket = io.connect('http://localhost:3000');

const cv = document.getElementById('canvas-video');
const ctx = cv.getContext('2d');
const img = new Image();

// Carregando
ctx.fillStyle = '#333';
ctx.fillText('Aguarde...', cv.width/2-30, cv.height/3);

socket.on('frame', function (data) {
  const uint8Arr = new Uint8Array(data.buffer);
  const str = String.fromCharCode.apply(null, uint8Arr);
  const base64String = btoa(str);

  img.onload = function () {
    ctx.drawImage(this, 0, 0, cv.width, cv.height);
  };
  img.src = 'data:image/png;base64,' + base64String;
});

// escuta a resposta do servidor

// envia a imagem em base64 para o webservice
function sendImgBase64(cv, socket) {
  var pngBase64 = cv.toDataURL();
  
  // envia o frame para o webservice
  socket.emit('face.recognize', {
    base64: pngBase64
  });
}

// a cada 1 segundo é enviado a imagem para o webservice
setInterval(function __sendImage() {
  sendImgBase64(cv, socket);
}, 1000);


// Pegando a imagem da webcam
if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  // Video
  const video = document.getElementById('video');

  // atualiza o canvas
  video.addEventListener('timeupdate', function() {
    ctx.drawImage(video, 0, 0, 640, 480);
  });

  // Somente o vídeo
  navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
      video.src = window.URL.createObjectURL(stream);
      video.play();
  });
}