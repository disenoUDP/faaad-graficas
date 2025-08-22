export const handler = ({ inputs, mechanic, sketch }) => {
  const { imagenInput, ancho, altura, slides, mostrarGrilla, Titulo } = inputs;

  const { colores } = require("@disenoudp/faaad-colores");

  let img;

  // Carga la imagen antes de setup si existe
  sketch.preload = () => {
    if (imagenInput) {
      img = sketch.loadImage(imagenInput);
    }
  };

  // Función para escalar y centrar la imagen según tu algoritmo original
  const escalarImagenFondo = () => {
    if (!img) return;

    const imgW = img.width;
    const imgH = img.height;

    sketch.push();
    sketch.translate(sketch.width / 2, sketch.height / 2);

    if (imgW > sketch.width && imgH > sketch.height) {
      sketch.image(img, -imgW / 2, -imgH / 2, imgW, imgH);
    } else if (imgW > sketch.width) {
      sketch.image(
        img,
        -((imgW * sketch.height) / imgH) / 2,
        -sketch.height / 2,
        (imgW * sketch.height) / imgH,
        sketch.height
      );
    } else if (imgH > sketch.height) {
      sketch.image(
        img,
        -sketch.width / 2,
        -((imgH * sketch.width) / imgW) / 2,
        sketch.width,
        (imgH * sketch.width) / imgW
      );
    } else {
      const wRatio = imgW / sketch.width;
      const hRatio = imgH / sketch.height;
      if (wRatio > hRatio) {
        sketch.image(
          img,
          -((imgW * sketch.height) / imgH) / 2,
          -sketch.height / 2,
          (imgW * sketch.height) / imgH,
          sketch.height
        );
      } else {
        sketch.image(
          img,
          -sketch.width / 2,
          -((imgH * sketch.width) / imgW) / 2,
          sketch.width,
          (imgH * sketch.width) / imgW
        );
      }
    }

    sketch.pop();
  };

  sketch.setup = () => {
    const separacion = 20; // separación entre slides
    const totalWidth = ancho * slides + separacion * (slides - 1);
    sketch.createCanvas(totalWidth, altura);
    sketch.noLoop(); // renderiza solo una vez
  };

  sketch.draw = () => {
    const separacion = 20;
    sketch.background(colores.udpCrema);

    sketch.background("#ffffff"); // fondo blanco para diferenciar las slides

    for (let i = 0; i < slides; i++) {
      const offsetX = i * (ancho + separacion);
      const margen = 62;

      // --- Fondo de cada slide ---
      sketch.noStroke();
      sketch.fill(colores.udpCrema);
      sketch.rect(offsetX, 0, ancho, altura);

      // --- Imagen (solo en el primer slide, puedes cambiarlo) ---
      if (img && i === 0) {
        sketch.push();
        sketch.translate(offsetX, 0);
        escalarImagenFondo();
        sketch.pop();
      }

      // --- Grilla opcional ---
      if (mostrarGrilla) {
        const cols = 20;
        const rows = 60;
        const gridWidth = ancho - margen * 2;
        const gridHeight = altura - margen * 2;

        sketch.stroke(200);
        sketch.strokeWeight(2);

        for (let c = 0; c <= cols; c++) {
          let x = offsetX + margen + (gridWidth / cols) * c;
          sketch.line(x, 0, x, altura);
        }

        for (let r = 0; r <= rows; r++) {
          let y = margen + (gridHeight / rows) * r;
          sketch.line(offsetX, y, offsetX + ancho, y);
        }

        sketch.stroke("#393939ff");
        sketch.strokeWeight(4);
        sketch.noFill();
        sketch.rect(offsetX + margen, margen, gridWidth, gridHeight);

        sketch.noStroke();
      }

      // --- Texto ---
      sketch.fill(colores.udpNegro);
      sketch.textSize(210);
      sketch.textStyle(sketch.BOLD);
      sketch.textFont("Helvetica");
      sketch.textAlign(sketch.LEFT, sketch.TOP);
      sketch.text(Titulo, offsetX + margen + 10, margen + 26);
    }

    mechanic.done();
  };
};

export const inputs = {
  ancho: { type: "number", default: 1080 },
  altura: { type: "number", default: 1350 },
  Titulo: { type: "text", default: "Título" },
  mostrarGrilla: { type: "boolean", default: false, label: "Mostrar grilla" },
  imagenInput: {
    type: "image",
    label: "Imagen",
    description: "Arrastra una imagen aquí",
  },
  slides: {
    type: "number",
    default: 1,
    label: "Cantidad de slides",
    min: 0,
    step: 1,
  },
};

export const presets = {
  post: { width: 1080, height: 1350 },
  story: { width: 1080, height: 1920 },
};

export const settings = {
  engine: require("@mechanic-design/engine-p5"),
  colores: require("@disenoudp/faaad-colores"),
  hideScaleToFit: true,
};
