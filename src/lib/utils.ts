export async function getFile(file: File) {
  try {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onloadend = () => {
        resolve(reader.result);
      };

      reader.onerror = () => {
        reject(new Error("Error al leer el archivo"));
      };

      if (file) {
        reader.readAsDataURL(file);
      } else {
        reject(new Error("Error al cargar el archivo"));
      }
    });
  } catch (error) {
    return "";
  }
}

export function generateUniqueCode() {
  const currentDate = new Date();
  const timestamp = currentDate.toISOString().replace(/[^0-9]/g, "");
  return timestamp;
}

export function generateNickColor() {
  let r, g, b;
  do {
    r = Math.floor(Math.random() * 256);
    g = Math.floor(Math.random() * 256);
    b = Math.floor(Math.random() * 256);

    var brillo = (r * 299 + g * 587 + b * 114) / 1000;
  } while (brillo > 165);

  let rHex = r.toString(16).padStart(2, "0");
  let gHex = g.toString(16).padStart(2, "0");
  let bHex = b.toString(16).padStart(2, "0");

  let colorHex = "#" + rHex + gHex + bHex;

  return colorHex;
}

export function openFileTab(data64file: string) {
  const newTab = window.open();
  newTab?.document.write(
    `<!DOCTYPE html><head><title>Anonytalk Documento</title></head><body><iframe style="position:fixed; top:0; left:0; bottom:0; right:0; width:100%; height:100%; border:none; margin:0; padding:0; overflow:hidden; z-index:999999;" src="${data64file}"></body></html>`,
  );
  newTab?.document.close();
}

export function focusNextInput() {
  const active = document.activeElement;
  if (active?.nextElementSibling) {
    (active.nextElementSibling as HTMLElement).focus();
  }
}

export function adjustLuma(color: string) {
  const r = parseInt(color.substring(1, 3), 16);
  const g = parseInt(color.substring(3, 5), 16);
  const b = parseInt(color.substring(5, 7), 16);

  const luma = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return luma > 0.5 ? "black" : "white";
}

export function parseTime(time: Date){
  return {
    short: time.toLocaleString("es-AR", { timeZone: "America/Buenos_Aires", hour12: false, minute: "2-digit", hour: "2-digit" }),
    long: time.toLocaleString()
  }
}