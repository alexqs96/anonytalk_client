export async function getFile (file: File) {
  try {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
  
      reader.onloadend = () => {
        resolve(reader.result);
      };
  
      reader.onerror = () => {
        reject(new Error('Error al leer el archivo'));
      };
  
      if (file) {
        reader.readAsDataURL(file);
      } else {
        reject(new Error('Error al cargar el archivo'));
      }
    }); 
  } catch (error) {
    return ""
  }
}

export function generateUniqueCode() {
  const currentDate = new Date();
  const timestamp = currentDate.toISOString().replace(/[^0-9]/g, '');
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

  let rHex = r.toString(16).padStart(2, '0');
  let gHex = g.toString(16).padStart(2, '0');
  let bHex = b.toString(16).padStart(2, '0');

  let colorHex = '#' + rHex + gHex + bHex;

  return colorHex;
}