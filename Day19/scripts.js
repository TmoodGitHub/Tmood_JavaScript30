const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

const rgb = document.querySelector('.rgb');
let rmax = 127;
let rmin = 127;
let gmin = 127;
let gmax = 127;
let bmin = 127;
let bmax = 127;

rgb.addEventListener('change', (event) => {
  if (event.target.name === 'rmin') {
    rmin = event.target.value;
  } else if (event.target.name === 'rmax') {
    rmax = event.target.value;
  } else if (event.target.name === 'gmin') {
    gmin = event.target.value;
  } else if (event.target.name === 'gmax') {
    gmax = event.target.value;
  } else if (event.target.name === 'bmin') {
    bmin = event.target.value;
  } else if (event.target.name === 'bmax') {
    bmax = event.target.value;
  }
});

function getVideo() {
  navigator.mediaDevices
    .getUserMedia({
      video: true,
      audio: false,
    })
    .then((localMediaStream) => {
      video.srcObject = localMediaStream;
      video.play();
    })
    .catch((err) => {
      console.error('Uh oh:', err);
    });
}

function paintToCanvas() {
  const width = video.videoWidth;
  const height = video.videoHeight;
  canvas.width = width;
  canvas.height = height;

  return setInterval(() => {
    ctx.drawImage(video, 0, 0, width, height);
    // take out the pixels
    let pixels = ctx.getImageData(0, 0, width, height);

    // mess with the pixels
    // pixels = redEffect(pixels);
    // pixels = rgbSplit(pixels);
    // ctx.globalAlpha = 0.8;
    pixels = greenScreen(pixels);

    // put the pixels back
    ctx.putImageData(pixels, 0, 0);
  }, 16);
}

function takePhoto() {
  // play the sound
  snap.currentTime = 0;
  snap.play();

  // take the data out of the canvas
  const data = canvas.toDataURL('image/jpeg');
  const link = document.createElement('a');
  link.href = data;
  link.setAttribute('download', 'hansome');
  link.textContent = 'Download Image';
  link.innerHTML = `<img src="${data}" alt="Hansome Man" />`;
  strip.insertBefore(link, strip.firstChild);
}

function redEffect(pixels) {
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i + 0] = pixels.data[i + 0] + 100; // RED
    pixels.data[i + 1] = pixels.data[i + 1] - 50; // GREEN
    pixels.data[i + 2] = pixels.data[i + 2] * 0.5; // BLUE
  }
  return pixels;
}

function rgbSplit(pixels) {
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i - 200] = pixels.data[i + 0]; // RED
    pixels.data[i + 100] = pixels.data[i + 1]; // GREEN
    pixels.data[i - 250] = pixels.data[i + 2]; // BLUE
  }
  return pixels;
}

function greenScreen(pixels) {
  const levels = {};

  document.querySelectorAll('.rgb input').forEach((input) => {
    levels[input.name] = input.value;
  });

  for (let i = 0; i < pixels.data.length; i = i + 4) {
    let red = pixels.data[i + 0];
    let green = pixels.data[i + 1];
    let blue = pixels.data[i + 2];
    let alpha = pixels.data[i + 3];

    if (red >= rmin && green >= gmin && blue >= bmin && red <= rmax && green <= gmax && blue <= bmax) {
      // take em out by reducing alpha to zero
      pixels.data[i + 3] = 0;
    }
  }

  return pixels;
}

getVideo();

video.addEventListener('canplay', paintToCanvas);
