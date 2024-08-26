// Escucha el evento de envío del formulario y genera el fractal
document.getElementById('formulario-fractal').addEventListener('submit', function(evento) {
    evento.preventDefault();
    
    const parteReal = parseFloat(document.getElementById('real').value);
    const parteImaginaria = parseFloat(document.getElementById('imaginario').value);
    const maxIteraciones = parseInt(document.getElementById('iteraciones').value);
    const valorColor = document.getElementById('color').value;

    dibujarFractal(parteReal, parteImaginaria, maxIteraciones, valorColor);
});

// Dibuja el fractal en el lienzo
function dibujarFractal(parteReal, parteImaginaria, maxIteraciones, valorColor) {
    const lienzo = document.getElementById('lienzo-fractal');
    const ctx = lienzo.getContext('2d');
    const imagenDatos = ctx.createImageData(lienzo.width, lienzo.height);
    
    const anchoPixel = 4 / lienzo.width;
    const altoPixel = 3 / lienzo.height;

    let xActual = 0;

    function dibujarPaso() {
        if (xActual < lienzo.width) {
            for (let y = 0; y < lienzo.height; y++) {
                let zx = xActual * anchoPixel - 2;
                let zy = y * altoPixel - 1.5;
                let iteracion = 0;

                while (zx * zx + zy * zy < 4 && iteracion < maxIteraciones) {
                    const tmp = zx * zx - zy * zy + parteReal;
                    zy = 2 * zx * zy + parteImaginaria;
                    zx = tmp;
                    iteracion++;
                }

                const indicePixel = (xActual + y * lienzo.width) * 4;
                const color = iteracion === maxIteraciones ? 0 : (iteracion / maxIteraciones) * 255;
                const colorRgb = hexAColorRgb(valorColor);
                imagenDatos.data[indicePixel] = color * (colorRgb.r / 255); // Rojo
                imagenDatos.data[indicePixel + 1] = color * (colorRgb.g / 255); // Verde
                imagenDatos.data[indicePixel + 2] = color * (colorRgb.b / 255); // Azul
                imagenDatos.data[indicePixel + 3] = 255; // Alfa
            }
            ctx.putImageData(imagenDatos, 0, 0);
            xActual++;
            requestAnimationFrame(dibujarPaso);
        }
    }

    dibujarPaso();
}

// Actualiza la vista previa del color seleccionado
function actualizarVistaPreviaColor() {
    const valorColor = document.getElementById('color').value;
    document.getElementById('vista-previa-color').style.backgroundColor = valorColor;
}

// Convierte un valor hexadecimal a un objeto RGB
function hexAColorRgb(hex) {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return { r, g, b };
}

// Inicializa la vista previa del color al cargar la página
actualizarVistaPreviaColor();
