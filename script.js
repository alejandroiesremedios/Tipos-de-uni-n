// CONFIGURACIONES GLOBALES (Versatilidad 2.0)
const GAS_URL = "https://script.google.com/macros/s/AKfycbxrjVvPkjC83NB1krzh_F8oeGk_JQNZJFtlY9-ycBZTN0aUFZXKJcbPEsgx9RWv0j7W/exec";

const metalMat = new THREE.MeshStandardMaterial({
  color: 0xc0ced8,       // acero pulido — gris azulado frío
  metalness: 0.88,
  roughness: 0.12,
  polygonOffset: true,
  polygonOffsetFactor: 1,
  polygonOffsetUnits: 1
});

const weldMat = new THREE.MeshStandardMaterial({
  color: 0xd4883a,       // cordón de soldadura — ámbar/dorado metálico
  metalness: 0.55,
  roughness: 0.45,
  emissive: 0xb05010,
  emissiveIntensity: 0.18
});

function createPlate(w, h, d, x, y, z) {
  const geo = new THREE.BoxGeometry(w, h, d);
  const mesh = new THREE.Mesh(geo, metalMat);
  mesh.position.set(x, y, z);
  const edges = new THREE.EdgesGeometry(geo);
  const neonLine = new THREE.LineSegments(
    edges,
    new THREE.LineBasicMaterial({ color: 0x4fc3f7, linewidth: 2, transparent: true, opacity: 0.55 })
  );
  mesh.add(neonLine);
  return mesh;
}

// =============================================
// BANCO DE DATOS — 8 preguntas por unión (40 total)
// Terminología: español primero, inglés entre corchetes
// Normas: siempre con descripción entre paréntesis
// Todas las respuestas son localizables en la teoría
// =============================================
const jointData = {
  tope: {
    id: "tope",
    name: "Unión a Tope (Butt joint)",
    desc: "Piezas situadas en el mismo plano (135°–180°). Alta eficiencia mecánica.",
    teoria: `<b>Normativa Técnica:</b> UNE-EN ISO&nbsp;17659 (terminología normalizada de las soldaduras) / AWS&nbsp;A3.0 (términos y definiciones estándar de soldadura).<br>
             <b>PCU - Penetración Completa en la Unión [CJP (Complete Joint Penetration)]:</b> En uniones críticas según AWS&nbsp;D1.1 (código de soldadura estructural en acero), garantiza la continuidad metalúrgica en todo el espesor de la junta.<br>
             <b>Espesores y Preparación:</b>
             <ul>
               <li><b>Menos de 3 mm:</b> Bordes rectos, unión en I [I-butt]. Preparación mínima o nula.</li>
               <li><b>Más de 3 mm:</b> Apertura de biseles en V, en U o en X.</li>
               <li><b>Bisel en X (Doble V):</b> Recomendado a partir de espesores medios para la <b>neutralización de tensiones residuales de contracción</b>, al equilibrar el aporte de calor por ambas caras.</li>
             </ul>
             <b>Apertura de raíz [Root gap]:</b> Espacio entre piezas que asegura la penetración completa del cordón de raíz.<br>
             <b>Factor Crítico:</b> Un ángulo de bisel demasiado estrecho (menor de 60° total) aumenta el riesgo de <b>falta de fusión</b> en las caras del bisel.`,
    questions: [
      {
        text: "¿Cuál es la orientación relativa entre piezas que define una unión a tope?",
        options: ["Entre 135° y 180° (piezas en el mismo plano)", "Entre 5° y 90° (piezas perpendiculares)", "Entre 0° y 5° (piezas superpuestas)", "Entre 30° y 135° (bordes en ángulo)"],
        correct: "Entre 135° y 180° (piezas en el mismo plano)"
      },
      {
        text: "¿Qué norma establece la terminología normalizada de las soldaduras?",
        options: ["UNE-EN ISO 17659", "AWS D1.1", "EN 1090", "ISO 9001"],
        correct: "UNE-EN ISO 17659"
      },
      {
        text: "¿Qué preparación se utiliza en espesores menores de 3 mm en una unión a tope?",
        options: ["Bordes rectos, unión en I (I-butt)", "Bisel en V con apertura de raíz", "Bisel en X (Doble V)", "Chaflán en U con cordón de respaldo"],
        correct: "Bordes rectos, unión en I (I-butt)"
      },
      {
        text: "¿Qué garantiza la PCU - Penetración Completa en la Unión en uniones críticas según AWS D1.1?",
        options: ["La continuidad metalúrgica en todo el espesor de la junta", "Que la soldadura se realiza solo por una cara", "Que el refuerzo de la cara supera los 3 mm", "La eliminación completa del soplado magnético"],
        correct: "La continuidad metalúrgica en todo el espesor de la junta"
      },
      {
        text: "¿Por qué se recomienda el bisel en X (Doble V) a partir de espesores medios?",
        options: ["Para la neutralización de tensiones residuales de contracción", "Para aumentar la zona afectada térmicamente", "Para reducir el ángulo de ataque del electrodo", "Para eliminar el soplado magnético"],
        correct: "Para la neutralización de tensiones residuales de contracción"
      },
      {
        text: "¿Cuál es el propósito de la apertura de raíz (Root gap) en una unión a tope con bisel?",
        options: ["Asegurar la penetración completa del cordón de raíz", "Aumentar la dureza del metal base", "Reducir el consumo de gas de protección", "Evitar el uso de electrodos de bajo hidrógeno"],
        correct: "Asegurar la penetración completa del cordón de raíz"
      },
      {
        text: "¿Qué defecto provoca un ángulo de bisel demasiado estrecho (menor de 60° total)?",
        options: ["Aumenta el riesgo de falta de fusión en las caras del bisel", "Mejora el acabado superficial del cordón", "Reduce la zona afectada térmicamente", "Aumenta la velocidad de avance del proceso"],
        correct: "Aumenta el riesgo de falta de fusión en las caras del bisel"
      },
      {
        text: "¿A partir de qué espesor se recomienda abrir biseles en V, U o X en una unión a tope?",
        options: ["Más de 3 mm", "Más de 10 mm", "Más de 1,5 mm", "Más de 20 mm"],
        correct: "Más de 3 mm"
      }
    ],
    build: (group) => {
      group.add(createPlate(80, 10, 250, -40.1, 0, 0));
      group.add(createPlate(80, 10, 250, 40.1, 0, 0));
    }
  },
  t: {
    id: "t",
    name: "Unión en T (T-joint)",
    desc: "Piezas perpendiculares entre sí (5°–90°). Base de la ingeniería estructural.",
    teoria: `<b>Normativa Técnica:</b> UNE-EN ISO&nbsp;17659 (terminología normalizada de las soldaduras) / AWS&nbsp;A3.0 (términos y definiciones estándar de soldadura).<br>
             <b>Espesor de garganta [Throat thickness]:</b> Distancia mínima de la raíz a la cara del cordón en ángulo [Fillet weld]. Es el parámetro que define la resistencia real de la unión.<br>
             <b>Aplicaciones:</b> Vigas armadas y rigidizadores estructurales.<br>
             <b>Desgarre laminar [Lamellar tearing]:</b> Fallo por planos de debilidad en la placa base. Característico de uniones de gran espesor y alta restricción.<br>
             <b>Pie de la soldadura [Toe]:</b> Zona donde el cordón conecta con el metal base. Es el punto más probable de inicio de grietas por fatiga si la transición es brusca.<br>
             <b>Mejora Técnica:</b> En uniones en T sometidas a cargas dinámicas extremas, se recomienda biselado previo en la pieza vertical para asegurar penetración total.`,
    questions: [
      {
        text: "¿Qué parámetro define la resistencia real de un cordón en ángulo (Fillet weld) en una unión en T?",
        options: ["El espesor de garganta (Throat thickness)", "La longitud del cateto", "El ancho de la cara de la soldadura", "El ángulo de inclinación de la pieza horizontal"],
        correct: "El espesor de garganta (Throat thickness)"
      },
      {
        text: "¿Qué es el espesor de garganta (Throat thickness)?",
        options: ["La distancia mínima de la raíz a la cara del cordón en ángulo", "El ancho total del cordón de soldadura", "La profundidad de penetración en la placa base", "El espacio entre las dos piezas antes de soldar"],
        correct: "La distancia mínima de la raíz a la cara del cordón en ángulo"
      },
      {
        text: "¿En qué aplicaciones estructurales es más típica la unión en T?",
        options: ["Vigas armadas y rigidizadores estructurales", "Tuberías de presión circular", "Uniones selladas en recipientes estancos", "Chapas de revestimiento decorativo"],
        correct: "Vigas armadas y rigidizadores estructurales"
      },
      {
        text: "¿Qué fallo estructural es característico de la placa base en uniones en T de gran espesor y alta restricción?",
        options: ["Desgarre laminar (Lamellar tearing)", "Fisuración en frío por hidrógeno", "Inclusión de escoria intermitente", "Solape de borde (Overlap)"],
        correct: "Desgarre laminar (Lamellar tearing)"
      },
      {
        text: "¿En qué zona de la unión en T es más probable el inicio de una grieta por fatiga?",
        options: ["En el pie de la soldadura (Toe)", "En el centro exacto del metal fundido", "En el interior de la raíz sin fundir", "En la cara superior del refuerzo"],
        correct: "En el pie de la soldadura (Toe)"
      },
      {
        text: "¿Qué ángulo entre piezas define una unión en T?",
        options: ["Entre 5° y 90°", "Entre 135° y 180°", "Entre 0° y 5°", "Entre 30° y 135°"],
        correct: "Entre 5° y 90°"
      },
      {
        text: "¿Qué preparación se recomienda en una unión en T sometida a cargas dinámicas extremas?",
        options: ["Biselado previo en la pieza vertical para asegurar penetración total", "Soldadura por puntos espaciados uniformemente", "Reducción del espesor de garganta al mínimo", "Uso de adhesivos epóxicos entre las placas"],
        correct: "Biselado previo en la pieza vertical para asegurar penetración total"
      },
        text: "¿Por qué es peligrosa una transición brusca del cordón con el metal base en el pie de la soldadura (Toe)?",
        options: ["Actúa como concentrador de tensiones e inicia grietas por fatiga", "Reduce el espesor de garganta útil disponible en la unión", "Impide el enfriamiento homogéneo del cordón de soldadura", "Aumenta la zona afectada térmicamente de forma global"],
        correct: "Actúa como concentrador de tensiones e inicia grietas por fatiga"
      }
    ],
    build: (group) => {
      group.add(createPlate(160, 10, 250, 0, 0, 0));
      group.add(createPlate(10, 80, 250, 0, 45, 0));
    }
  },
  solape: {
    id: "solape",
    name: "Unión a Solape (Lap joint)",
    desc: "Piezas superpuestas (0°–5°). Muy común en el sector automotriz.",
    teoria: `<b>Normativa Técnica:</b> UNE-EN ISO&nbsp;17659 (terminología normalizada de las soldaduras) / AWS&nbsp;A3.0 (términos y definiciones estándar de soldadura).<br>
             <b>Excentricidad de la carga:</b> Principal desventaja estructural; los ejes de las piezas no están alineados, lo que genera <b>momentos flectores indeseados</b> en la junta.<br>
             <b>Distribución de cordones según AWS:</b> Para soportar esfuerzos de cizalladura de forma equilibrada, se recomiendan <b>cordones longitudinales y transversales combinados</b>.<br>
             <b>Solapamiento mínimo:</b> Se recomienda <b>4 o 5 veces el espesor de la chapa más delgada</b> para asegurar la transferencia efectiva de cargas.<br>
             <b>Soldadura de tapón [Plug weld]:</b> Soldadura en agujeros <b>circulares</b> practicados en una de las chapas solapadas.<br>
             <b>Soldadura de ojal [Slot weld]:</b> Soldadura en agujeros <b>alargados</b> practicados en una de las chapas solapadas.<br>
             <b>Ventaja:</b> Tolerancia dimensional alta; no requiere preparación de bordes compleja.`,
    questions: [
      {
        text: "¿Cuál es el principal inconveniente estructural de la unión a solape?",
        options: ["La excentricidad de la carga genera momentos flectores indeseados", "La dificultad operativa de acceso para el proceso GMAW", "La necesidad de mecanizado de precisión de las caras", "El excesivo tiempo acumulado de enfriamiento natural"],
        correct: "La excentricidad de la carga genera momentos flectores indeseados"
      },
      {
        text: "¿Qué ángulo entre piezas caracteriza a la unión a solape?",
        options: ["Entre 0° y 5°", "Entre 5° y 90°", "Entre 135° y 180°", "Entre 30° y 135°"],
        correct: "Entre 0° y 5°"
      },
      {
        text: "¿Cómo recomienda AWS distribuir los cordones en una unión a solape sometida a cizalladura?",
        options: ["Cordones longitudinales y transversales combinados", "Solo cordones de penetración completa", "Soldadura de tapón central exclusivamente", "Cordones diagonales únicamente"],
        correct: "Cordones longitudinales y transversales combinados"
      },
      {
        text: "¿Cuál es el solapamiento mínimo recomendado para asegurar la transferencia efectiva de cargas?",
        options: ["4 o 5 veces el espesor de la chapa más delgada", "Exactamente 10 mm independientemente del espesor", "La mitad del ancho de la placa superior", "Basta con que los bordes se toquen un milímetro"],
        correct: "4 o 5 veces el espesor de la chapa más delgada"
      },
      {
        text: "¿Cómo se denomina la soldadura en agujeros circulares de una chapa solapada?",
        options: ["Soldadura de tapón (Plug weld)", "Soldadura de ojal (Slot weld)", "Soldadura de costura continua", "Soldadura de recargue superficial"],
        correct: "Soldadura de tapón (Plug weld)"
      },
      {
        text: "¿Cómo se denomina la soldadura en agujeros alargados de una chapa solapada?",
        options: ["Soldadura de ojal (Slot weld)", "Soldadura de tapón (Plug weld)", "Soldadura orbital de costura", "Soldadura fuerte por capilaridad"],
        correct: "Soldadura de ojal (Slot weld)"
      },
      {
        text: "¿Cuál es la principal ventaja dimensional de la unión a solape?",
        options: ["Tolerancia dimensional alta; no requiere preparación de bordes compleja", "Resistencia a tracción superior a la obtenida en la unión a tope", "Permite mayor penetración en la zona de la raíz de la junta", "Elimina por completo todos los esfuerzos de flexión lateral"],
        correct: "Tolerancia dimensional alta; no requiere preparación de bordes compleja"
      },
      {
        text: "¿Por qué la excentricidad de la carga genera momentos flectores en la unión a solape?",
        options: ["Porque los ejes de las piezas no están alineados", "Porque impide realizar cordones longitudinales", "Porque obliga a usar electrodos de gran diámetro", "Porque reduce el área de solapamiento disponible"],
        correct: "Porque los ejes de las piezas no están alineados"
      }
    ],
    build: (group) => {
      group.add(createPlate(80, 10, 250, -20, 0, 0));
      group.add(createPlate(80, 10, 250, 20, 10, 0));
    }
  },
  esquina: {
    id: "esquina",
    name: "Unión en Esquina (Corner joint)",
    desc: "Bordes que se tocan en ángulo (30°–135°). Creación de volúmenes y cajas metálicas.",
    teoria: `<b>Normativa Técnica:</b> UNE-EN ISO 17659 (terminología normalizada de las soldaduras) / AWS A3.0 (términos y definiciones estándar de soldadura).<br>
             <b>Configuraciones principales:</b>
             <ul>
               <li><b>Esquina abierta:</b> Facilita la <b>penetración de raíz</b> al permitir el acceso del arco al vértice interno.</li>
               <li><b>Esquina cerrada:</b> Utilizada cuando se requiere un <b>acabado estético liso</b> tras el esmerilado de la arista exterior (mobiliario metálico).</li>
             </ul>
             <b>Recipientes a presión:</b> Se utiliza una configuración de <b>bisel doble (K o X) con cordón de respaldo interno</b> para garantizar estanqueidad y resistencia.<br>
             <b>Defecto crítico:</b> La falta de penetración en la raíz actúa como <b>concentrador de tensiones</b>, facilitando el fallo estructural progresivo.`,
    questions: [
      {
        text: "¿Qué ángulo entre piezas define una unión en esquina?",
        options: ["Entre 30° y 135°", "Entre 0° y 5°", "Entre 135° y 180°", "Entre 5° y 90°"],
        correct: "Entre 30° y 135°"
      },
      {
        text: "¿Qué ventaja tiene la 'esquina abierta' frente a la 'esquina cerrada'?",
        options: ["Facilita la penetración de raíz al permitir el acceso del arco al vértice interno", "Proporciona un acabado estético liso tras el proceso de esmerilado", "Reduce el volumen total de material de aportación necesario", "Evita la necesidad de utilizar gas de protección externa"],
        correct: "Facilita la penetración de raíz al permitir el acceso del arco al vértice interno"
      },
      {
        text: "¿Cuándo se emplea preferentemente la 'esquina cerrada'?",
        options: ["Cuando se requiere un acabado estético liso tras el esmerilado exterior", "Cuando se necesita máxima penetración de raíz", "En recipientes a presión de alta resistencia", "Cuando el espesor supera los 20 mm"],
        correct: "Cuando se requiere un acabado estético liso tras el esmerilado exterior"
      },
      {
        text: "¿Qué configuración se emplea en recipientes a presión para garantizar estanqueidad y resistencia?",
        options: ["Bisel doble (K o X) con cordón de respaldo interno", "Esquina abierta sin preparación adicional", "Soldadura de puntos espaciados por el exterior", "Fusión autógena de los filos externos"],
        correct: "Bisel doble (K o X) con cordón de respaldo interno"
      },
      {
        text: "¿Por qué es crítica la falta de penetración en la raíz de una unión en esquina?",
        options: ["Actúa como concentrador de tensiones, facilitando el fallo estructural progresivo", "Aumenta innecesariamente el peso de la pieza", "Cambia la composición metalúrgica del metal base", "Obliga a usar corrientes de soldadura más bajas"],
        correct: "Actúa como concentrador de tensiones, facilitando el fallo estructural progresivo"
      },
      {
        text: "¿En qué tipo de producto es especialmente útil la 'esquina cerrada'?",
        options: ["Mobiliario metálico que requiere acabado liso", "Tanques y recipientes a presión industrial", "Vigas armadas de gran altura", "Tuberías de sección circular"],
        correct: "Mobiliario metálico que requiere acabado liso"
      },
      {
        text: "¿Qué función cumple el cordón de respaldo interno en uniones en esquina de recipientes a presión?",
        options: ["Garantizar la estanqueidad y resistencia de la unión", "Sustituir la necesidad de bisel previo", "Reducir el tiempo de soldadura total", "Eliminar el riesgo de desgarre laminar"],
        correct: "Garantizar la estanqueidad y resistencia de la unión"
      },
      {
        text: "¿Qué ángulo define la esquina abierta frente a la cerrada como ventaja operativa?",
        options: ["Que permite el acceso del arco al vértice interno para la penetración de raíz", "Que reduce el ángulo total de la junta a menos de 30°", "Que elimina la necesidad de gas de protección", "Que garantiza siempre un acabado liso exterior"],
        correct: "Que permite el acceso del arco al vértice interno para la penetración de raíz"
      }
    ],
    build: (group) => {
      group.add(createPlate(80, 10, 250, 0, 0, 0));
      group.add(createPlate(10, 80, 250, 45, -45, 0));
    }
  },
  canto: {
    id: "canto",
    name: "Unión de Canto (Edge joint)",
    desc: "Bordes paralelos unidos (0°–30°). Aplicada en uniones de sellado estanco.",
    teoria: `<b>Normativa Técnica:</b> UNE-EN ISO 17659 (terminología normalizada de las soldaduras) / AWS A3.0 (términos y definiciones estándar de soldadura).<br>
             <b>Ingeniería de fallo:</b> Muy susceptible a fallar bajo esfuerzos de <b>tracción perpendicular</b> o de <b>palanca [Cleavage]</b>; actúan directamente en la base del cordón.<br>
             <b>Soldadura de canto [Edge Weld] según AWS A3.0:</b> Fusión completa de los bordes adyacentes de placas <b>paralelas</b>, a diferencia de la unión a tope donde las placas son <b>colineales</b>.<br>
             <b>Limitación estructural:</b> No puede soportar esfuerzos de <b>flexión o impacto</b> considerables.<br>
             <b>Uso:</b> Limitado a <b>sellado estanco en espesores finos</b>.<br>
             <b>Proceso recomendado:</b> En espesores muy finos, el proceso <b>GTAW (TIG) con corriente pulsada</b> es preferible para evitar la perforación excesiva del material.`,
    questions: [
      {
        text: "¿Qué ángulo entre piezas caracteriza a la unión de canto?",
        options: ["Entre 0° y 30°", "Entre 30° y 135°", "Entre 135° y 180°", "Entre 5° y 90°"],
        correct: "Entre 0° y 30°"
      },
      {
        text: "¿Bajo qué tipos de esfuerzos es más probable que falle una unión de canto?",
        options: ["Tracción perpendicular y palanca (Cleavage)", "Compresión axial pura", "Vibración ultrasónica de baja frecuencia", "Cargas hidrostáticas estables"],
        correct: "Tracción perpendicular y palanca (Cleavage)"
      },
      {
        text: "¿Dónde actúan los esfuerzos de palanca (Cleavage) en una unión de canto?",
        options: ["En la base del cordón de soldadura", "En la zona central del metal fundido", "En la cara exterior visible del cordón", "En el centro de la zona afectada térmicamente"],
        correct: "En la base del cordón de soldadura"
      },
        text: "Según AWS A3.0, ¿qué diferencia a la soldadura de canto (Edge Weld) de una soldadura a tope?",
        options: ["En la Edge Weld se funden bordes de placas paralelas; en la tope, las placas son colineales", "No existe ninguna diferencia técnica real, son sinónimos exactos", "La Edge Weld solo se aplica bajo condiciones submarinas extremas", "La soldadura a tope no requiere ningún tipo de preparación de bordes"],
        correct: "En la Edge Weld se funden bordes de placas paralelas; en la tope, las placas son colineales"
      },
      {
        text: "¿Qué proceso es preferible en espesores muy finos para evitar la perforación excesiva?",
        options: ["GTAW (TIG) con corriente pulsada", "SMAW (Electrodo recubierto) con electrodos celulósicos", "Arco sumergido (SAW) de alta corriente", "Corte por plasma manual reconvertido"],
        correct: "GTAW (TIG) con corriente pulsada"
      },
      {
        text: "¿Para qué tipo de aplicación queda limitada la unión de canto?",
        options: ["Sellado estanco en espesores finos", "Estructuras metálicas sometidas a cargas dinámicas", "Recipientes a presión de gran espesor", "Vigas armadas de construcción civil"],
        correct: "Sellado estanco en espesores finos"
      },
      {
        text: "¿Cuál es la limitación estructural más importante de una unión de canto?",
        options: ["No puede soportar esfuerzos de flexión o impacto considerables", "Es imposible de mecanizar tras realizar la soldadura final", "No admite el proceso industrial GMAW (MIG/MAG) estándar", "Requiere precalentamiento superior a los quinientos grados"],
        correct: "No puede soportar esfuerzos de flexión o impacto considerables"
      },
      {
        text: "¿Qué característica distingue a las placas en una soldadura de canto (Edge Weld)?",
        options: ["Son placas paralelas cuyos bordes adyacentes se funden completamente", "Son placas colineales unidas en el mismo plano", "Son placas perpendiculares unidas por el canto", "Son placas superpuestas unidas por tapones"],
        correct: "Son placas paralelas cuyos bordes adyacentes se funden completamente"
      }
    ],
    build: (group) => {
      group.add(createPlate(10, 80, 250, -5.1, 0, 0));
      group.add(createPlate(10, 80, 250, 5.1, 0, 0));
    }
  }
};

// =============================================
// CLASE 3D
// =============================================
class App3D {
  constructor(canvasId) {
    this.container = document.getElementById(canvasId);
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(38, this.container.clientWidth / this.container.clientHeight, 1, 3000);
    this.camera.position.set(220, 140, 420);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;
    this.container.appendChild(this.renderer.domElement);

    // === ÓRBITA ===
    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.06;
    this.controls.autoRotate = true;          // C — Animación de entrada
    this.controls.autoRotateSpeed = 1.4;
    this.autoRotating = true;

    // Detener rotación automática al interactuar
    this.renderer.domElement.addEventListener('mousedown', () => {
      this.controls.autoRotate = false;
      this.autoRotating = false;
    });
    this.renderer.domElement.addEventListener('touchstart', () => {
      this.controls.autoRotate = false;
      this.autoRotating = false;
    });

    // === ILUMINACIÓN ESTUDIO DE TRES PUNTOS (E) ===
    // Luz ambiente suave y fría
    const ambientLight = new THREE.AmbientLight(0x1a2a50, 1.3);
    this.scene.add(ambientLight);

    // Key light — cálida principal (top-front-right)
    const keyLight = new THREE.DirectionalLight(0xfff3c8, 1.5);
    keyLight.position.set(200, 320, 220);
    this.scene.add(keyLight);

    // Fill light — azul-frío de relleno (left-low)
    const fillLight = new THREE.DirectionalLight(0xb0c8ff, 0.65);
    fillLight.position.set(-220, 60, -80);
    this.scene.add(fillLight);

    // Rim light — contraluz blanco para separar la pieza del fondo
    const rimLight = new THREE.DirectionalLight(0xffffff, 0.85);
    rimLight.position.set(0, -70, -280);
    this.scene.add(rimLight);

    // === GRUPO DE MODELOS ===
    this.modelGroup = new THREE.Group();
    this.scene.add(this.modelGroup);

    // === BOTONES DE VISTA RÁPIDA (F) ===
    this.container.style.position = 'relative';
    const viewBar = document.createElement('div');
    viewBar.style.cssText = [
      'position:absolute', 'bottom:12px', 'right:12px',
      'display:flex', 'gap:6px', 'z-index:10'
    ].join(';');

    const views = [
      { label: '⬆ Superior', pos: [0.001, 420,   0], up: [0, 0, -1] }, // cenital — up apunta a -Z
      { label: '⬛ Frontal',  pos: [0,       0, 370], up: [0, 1,  0] }, // alzado — Y=0 → solo sección
      { label: '➡ Lateral',  pos: [370,      0,   0], up: [0, 1,  0] }, // perfil — Y=0 → solo sección
    ];
    views.forEach(v => {
      const btn = document.createElement('button');
      btn.textContent = v.label;
      btn.title = 'Vista ' + v.label.replace(/^[^ ]+ /, '');
      btn.style.cssText = [
        'background:rgba(20,40,90,0.72)', 'color:#e8edf8',
        'border:1px solid rgba(160,195,255,0.28)', 'border-radius:6px',
        'padding:5px 10px', 'font-size:0.71rem',
        "font-family:'Source Sans 3',sans-serif",
        'cursor:pointer', 'backdrop-filter:blur(8px)',
        'font-weight:600', 'letter-spacing:0.02em',
        'transition:background 0.18s,transform 0.12s'
      ].join(';');
      btn.addEventListener('mouseenter', () => {
        btn.style.background = 'rgba(30,58,110,0.95)';
        btn.style.transform = 'translateY(-1px)';
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.background = 'rgba(20,40,90,0.72)';
        btn.style.transform = 'translateY(0)';
      });
      btn.addEventListener('click', () => this.setView(v.pos, v.up));
      viewBar.appendChild(btn);
    });
    this.container.appendChild(viewBar);

    window.addEventListener('resize', () => {
      if (!this.container) return;
      this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    });
    this.animate();
  }

  // F — Transición suave a vistas ortogonales puras
  setView(targetPos, up) {
    this.controls.autoRotate = false;
    this.autoRotating = false;
    // Recentrar el pivot y orientar la cámara antes de animar
    this.controls.target.set(0, 0, 0);
    if (up) this.camera.up.set(up[0], up[1], up[2]);
    const startPos = this.camera.position.clone();
    const endPos = new THREE.Vector3(targetPos[0], targetPos[1], targetPos[2]);
    let t = 0;
    const duration = 55;
    const tick = () => {
      t++;
      const a = t / duration;
      const eased = a < 0.5 ? 2 * a * a : -1 + (4 - 2 * a) * a;  // ease-in-out quad
      this.camera.position.lerpVectors(startPos, endPos, eased);
      this.controls.update();
      if (t < duration) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  loadModel(type) {
    while (this.modelGroup.children.length > 0) {
      this.modelGroup.remove(this.modelGroup.children[0]);
    }
    if (jointData[type]) {
      jointData[type].build(this.modelGroup);
      this.camera.position.set(220, 140, 420);
      this.camera.up.set(0, 1, 0);      // restaurar orientación al cambiar de unión
      this.controls.target.set(0, 0, 0);
      this.controls.autoRotate = true;   // C — reiniciar rotación al cambiar modelo
      this.autoRotating = true;
      this.controls.update();
    }
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
}

// =============================================
// INICIALIZACIÓN
// =============================================
const studyApp = new App3D('studyCanvas');
let examApp = null;

studyApp.loadModel('tope');
document.getElementById('infoTitle').textContent = jointData.tope.name;
document.getElementById('infoDesc').textContent = jointData.tope.desc;
document.getElementById('infoTheory').innerHTML = jointData.tope.teoria;

// Registro de uniones visitadas por el alumno ('tope' se muestra por defecto)
const visitedJoints = new Set(['tope']);

document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    const type = e.target.dataset.type;
    visitedJoints.add(type);          // marcar como visto
    const data = jointData[type];
    document.getElementById('infoTitle').textContent = data.name;
    document.getElementById('infoDesc').textContent = data.desc;
    document.getElementById('infoTheory').innerHTML = data.teoria;
    studyApp.loadModel(type);
    hidePendingWarning();             // ocultar aviso si ya ha visto las que faltaban
  });
});

// =============================================
// DATOS DE CURSOS Y MÓDULOS
// =============================================
const modulesData = {
  "1º GM Soldadura": ["Mecanizado", "Soldadura en Atmósfera Natural"],
  "2º GM Soldadura": ["Montaje", "Trazado", "Soldadura en Atmósfera Protegida (SAP)"],
  "1º GS Construcciones Metálicas": ["Procesos de Corte y Preparación", "Grafismo y Representación en Fab. Mecánica"],
  "2º GS Construcciones Metálicas": ["Diseño de Estructuras Metálicas", "Procesos de Unión y Montaje"]
};

document.getElementById('studentCourse').addEventListener('change', (e) => {
  const modSelect = document.getElementById('studentModule');
  modSelect.innerHTML = '<option value="" disabled selected>Selecciona tu módulo...</option>';
  modSelect.disabled = false;
  modSelect.style.borderColor = 'var(--border)';
  hideModuleWarning();           // limpiar aviso al cambiar de curso
  const course = e.target.value;
  if (modulesData[course]) {
    modulesData[course].forEach(mod => {
      const opt = document.createElement('option');
      opt.value = opt.textContent = mod;
      modSelect.appendChild(opt);
    });
  }
});

// =============================================
// VALIDACIÓN DE MÓDULO PARA ESTA ACTIVIDAD
// =============================================
const MODULO_CORRECTO = 'Soldadura en Atmósfera Protegida (SAP)';

function showModuleWarning() {
  let card = document.getElementById('moduleWarning');
  if (!card) {
    card = document.createElement('div');
    card.id = 'moduleWarning';
    card.innerHTML = `
      <div style="display:flex;align-items:flex-start;gap:0.9rem;">
        <span style="font-size:1.6rem;line-height:1;flex-shrink:0;">⚠️</span>
        <div>
          <p style="font-weight:700;font-size:0.95rem;color:#7a3800;margin-bottom:0.25rem;">
            Módulo incorrecto para esta actividad
          </p>
          <p style="font-size:0.87rem;color:#9a4a10;line-height:1.5;">
            Este ejercicio pertenece al módulo <strong>Soldadura en Atmósfera Protegida (SAP)</strong>.
            Por favor, asegúrate de elegir tu módulo correcto antes de comenzar la prueba.
          </p>
        </div>
        <button onclick="hideModuleWarning()" title="Cerrar" style="
          margin-left:auto;flex-shrink:0;background:none;border:none;
          cursor:pointer;font-size:1.1rem;color:#9a4a10;padding:0 0.2rem;line-height:1;
        ">✕</button>
      </div>
    `;
    Object.assign(card.style, {
      display: 'none',
      background: '#fff4e6',
      border: '1.5px solid #f4a040',
      borderLeft: '5px solid #d97706',
      borderRadius: '8px',
      padding: '1rem 1.1rem',
      marginBottom: '1.25rem',
      marginTop: '-0.75rem',
      boxShadow: '0 4px 18px rgba(217,119,6,0.13)',
      animation: 'warnSlideIn 0.3s ease-out',
    });
    // Insertar justo debajo de la barra del alumno
    const bar = document.querySelector('.student-info-bar');
    bar.insertAdjacentElement('afterend', card);

    // Añadir keyframe si no existe
    if (!document.getElementById('warnAnim')) {
      const style = document.createElement('style');
      style.id = 'warnAnim';
      style.textContent = `
        @keyframes warnSlideIn {
          from { opacity:0; transform:translateY(-8px); }
          to   { opacity:1; transform:translateY(0); }
        }`;
      document.head.appendChild(style);
    }
  }
  card.style.display = 'block';
}

function hideModuleWarning() {
  const card = document.getElementById('moduleWarning');
  if (card) card.style.display = 'none';
}

document.getElementById('studentModule').addEventListener('change', (e) => {
  if (e.target.value && e.target.value !== MODULO_CORRECTO) {
    showModuleWarning();
  } else {
    hideModuleWarning();
  }
});

const dateInput = document.getElementById('examDate');
const today = new Date();
const offset = today.getTimezoneOffset();
const localToday = new Date(today.getTime() - (offset * 60 * 1000)).toISOString().split('T')[0];
dateInput.value = localToday;

dateInput.addEventListener('change', (e) => {
  const warning = document.getElementById('dateWarning');
  warning.style.display = e.target.value !== localToday ? 'block' : 'none';
});

// =============================================
// SISTEMA DE EXAMEN — 40 preguntas, selecciona 5 al azar
// =============================================
let examSequence = [];
let currentQuestionIndex = 0;
let score = 0;
const MAX_QUESTIONS = 10;
const TIME_LIMIT = 20;
let timeLeft = TIME_LIMIT;
let timerInterval = null;

document.getElementById('btnStartExam').addEventListener('click', () => {
  const nombre = document.getElementById('studentName').value;
  const curso = document.getElementById('studentCourse').value;
  const modulo = document.getElementById('studentModule').value;
  const fecha = document.getElementById('examDate').value;

  if (!nombre.trim() || !curso.trim() || !modulo.trim() || !fecha) {
    document.getElementById('studentName').style.borderColor = !nombre.trim() ? 'red' : '#cbd5e1';
    document.getElementById('studentCourse').style.borderColor = !curso ? 'red' : '#cbd5e1';
    document.getElementById('studentModule').style.borderColor = !modulo ? 'red' : '#cbd5e1';
    document.getElementById('examDate').style.borderColor = !fecha ? 'red' : '#cbd5e1';
    const btn = document.getElementById('btnStartExam');
    btn.textContent = "❌ Rellena todos tus datos arriba";
    setTimeout(() => btn.textContent = "Comenzar Prueba", 3000);
    return;
  }

  // Comprobar que ha visto todas las uniones
  const allTypes = Object.keys(jointData);  // ['tope','t','solape','esquina','canto']
  const pending = allTypes.filter(t => !visitedJoints.has(t));
  if (pending.length > 0) {
    const names = pending.map(t => jointData[t].name);
    showPendingWarning(names);
    return;
  }

  hidePendingWarning();
  const studyPanel = document.getElementById('studyPanel');
  if (studyPanel) studyPanel.remove();

  document.getElementById('examPanel').style.display = 'block';
  if (!examApp) examApp = new App3D('examCanvas');
  startExam();
});

// --- Aviso de uniones no visitadas ---
function showPendingWarning(names) {
  let card = document.getElementById('pendingWarning');
  if (!card) {
    card = document.createElement('div');
    card.id = 'pendingWarning';
    Object.assign(card.style, {
      display: 'none',
      background: '#fef2f2',
      border: '1.5px solid #fca5a5',
      borderLeft: '5px solid #b33000',
      borderRadius: '8px',
      padding: '1rem 1.1rem',
      marginTop: '1rem',
      boxShadow: '0 4px 18px rgba(179,48,0,0.12)',
      animation: 'warnSlideIn 0.3s ease-out',
    });
    document.querySelector('.start-exam-container').appendChild(card);
  }
  const list = names.map(n => `<li style="margin-bottom:0.2rem">📌 <strong>${n}</strong></li>`).join('');
  card.innerHTML = `
    <div style="display:flex;align-items:flex-start;gap:0.9rem;">
      <span style="font-size:1.6rem;line-height:1;flex-shrink:0;">🚫</span>
      <div style="flex:1">
        <p style="font-weight:700;font-size:0.95rem;color:#7a1a00;margin-bottom:0.4rem;">
          Aún no has estudiado todas las uniones
        </p>
        <p style="font-size:0.87rem;color:#9a2a10;margin-bottom:0.5rem;">
          Debes revisar los siguientes tipos antes de comenzar la prueba:
        </p>
        <ul style="font-size:0.87rem;color:#7a1a00;list-style:none;padding:0;margin:0">
          ${list}
        </ul>
      </div>
      <button onclick="hidePendingWarning()" title="Cerrar" style="
        margin-left:auto;flex-shrink:0;background:none;border:none;
        cursor:pointer;font-size:1.1rem;color:#9a2a10;padding:0 0.2rem;line-height:1;
      ">✕</button>
    </div>
  `;
  card.style.display = 'block';
  card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function hidePendingWarning() {
  const card = document.getElementById('pendingWarning');
  if (card) card.style.display = 'none';
}

function startExam() {
  // Distribución fija: 4 tope, 3 T, 1 solape, 1 esquina, 1 canto
  const distribucion = { tope: 4, t: 3, solape: 1, esquina: 1, canto: 1 };
  let selected = [];
  Object.entries(distribucion).forEach(([tipo, cantidad]) => {
    const pool = jointData[tipo].questions
      .map(q => ({ text: q.text, options: q.options, correct: q.correct, type: tipo }))
      .sort(() => Math.random() - 0.5);
    selected.push(...pool.slice(0, cantidad));
  });
  examSequence = selected.sort(() => Math.random() - 0.5); // orden aleatorio final
  currentQuestionIndex = 0;
  score = 0;
  loadQuestion();
}

function startTimer() {
  clearInterval(timerInterval);
  timeLeft = TIME_LIMIT;
  document.getElementById('examTimer').textContent = timeLeft;
  timerInterval = setInterval(() => {
    timeLeft--;
    document.getElementById('examTimer').textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      const correct = examSequence[currentQuestionIndex].correct;
      checkAnswer(null, correct, null, true);
    }
  }, 1000);
}

function loadQuestion() {
  const currentQ = examSequence[currentQuestionIndex];
  examApp.loadModel(currentQ.type);
  examApp.camera.position.set(
    (Math.random() > 0.5 ? 1 : -1) * (140 + Math.random() * 60),
    60  + Math.random() * 50,
    (Math.random() > 0.5 ? 1 : -1) * (210 + Math.random() * 70)
  );
  examApp.controls.update();
  document.getElementById('currentQuestionNum').textContent = currentQuestionIndex + 1;
  document.getElementById('btnNextQuestion').style.display = 'none';
  document.querySelector('.exam-controls h3').textContent = currentQ.text;

  const optionsGrid = document.getElementById('examOptions');
  optionsGrid.innerHTML = '';
  const shuffledOptions = [...currentQ.options].sort(() => Math.random() - 0.5);
  shuffledOptions.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.textContent = opt;
    btn.onclick = () => checkAnswer(opt, currentQ.correct, btn);
    optionsGrid.appendChild(btn);
  });
  startTimer();
}

function checkAnswer(selected, correct, clickedBtn, isTimeOut = false) {
  clearInterval(timerInterval);
  const allBtns = document.querySelectorAll('.option-btn');
  allBtns.forEach(b => b.disabled = true);
  const timerLabel = document.getElementById('examTimer');

  if (isTimeOut) {
    timerLabel.textContent = "¡TIEMPO AGOTADO!";
    allBtns.forEach(b => { if (b.textContent === correct) b.classList.add('correct'); });
  } else {
    if (selected === correct) {
      clickedBtn.classList.add('correct');
      score += 1;   // 10 preguntas × 1 pt = 10 pts máximo
    } else {
      clickedBtn.classList.add('wrong');
      allBtns.forEach(b => { if (b.textContent === correct) b.classList.add('correct'); });
    }
  }
  document.getElementById('btnNextQuestion').style.display = 'block';
}

document.getElementById('btnNextQuestion').addEventListener('click', () => {
  currentQuestionIndex++;
  if (currentQuestionIndex < MAX_QUESTIONS) {
    loadQuestion();
  } else {
    finishExam();
  }
});

function finishExam() {
  document.querySelector('.exam-controls').style.display = 'none';
  const panel = document.getElementById('evaluationPanel');
  panel.style.display = 'block';
  document.getElementById('scoreCircle').textContent = score;
  if (score >= 5) {
    document.getElementById('modalTitle').textContent = "¡Prueba Superada!";
    document.getElementById('scoreCircle').style.backgroundColor = '#16a34a';
  } else {
    document.getElementById('modalTitle').textContent = "Necesitas Mejorar";
    document.getElementById('scoreCircle').style.backgroundColor = '#dc2626';
  }
  document.getElementById('modalSummary').textContent = `Has respondido correctamente ${score} de ${MAX_QUESTIONS} preguntas.`;
  panel.scrollIntoView({ behavior: 'smooth', block: 'end' });
}

// =============================================
// GENERADOR DE PDF
// =============================================
function generarPDF(pdfFilename) {
  const { jsPDF } = window.jspdf;
  if (!jsPDF) throw new Error('jsPDF no cargado');
  const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
  const PW = 210, PH = 297, M = 15, CW = PW - 2 * M;
  let y = M;
  const C = {
    blueDark: [30, 58, 138], blueLight: [219, 234, 254],
    labelBg: [235, 240, 255], white: [255, 255, 255],
    grayBorder: [203, 213, 225], textDark: [15, 23, 42],
    textMid: [71, 85, 105], greenBg: [212, 237, 218],
    greenText: [21, 87, 36], redBg: [248, 215, 218], redText: [114, 28, 36]
  };
  const v = (id) => { const el = document.getElementById(id); return (el && el.value) ? el.value : '---'; };

  function drawRow(fields, rowH = 10) {
    const n = fields.length, colW = CW / n;
    fields.forEach(function (field, i) {
      const label = field[0], value = field[1], x = M + i * colW;
      doc.setFillColor(...C.labelBg); doc.rect(x, y, colW, 4, 'F');
      doc.setTextColor(...C.textMid); doc.setFontSize(7); doc.setFont('helvetica', 'bold');
      doc.text(label, x + 2, y + 3);
      doc.setFillColor(...C.white); doc.rect(x, y + 4, colW, rowH - 4, 'F');
      doc.setTextColor(...C.textDark); doc.setFontSize(9); doc.setFont('helvetica', 'normal');
      doc.text(String(value), x + 2, y + 8);
      doc.setDrawColor(...C.grayBorder); doc.rect(x, y, colW, rowH, 'S');
    });
    y += rowH;
  }

  doc.setFillColor(...C.blueDark); doc.rect(M, y, CW, 15, 'F');
  doc.setTextColor(255, 255, 255); doc.setFontSize(14); doc.setFont('helvetica', 'bold');
  doc.text('REPORTE DE EVALUACIÓN INTERACTIVA', PW / 2, y + 9, { align: 'center' });
  y += 20;
  drawRow([['Nombre Alumno/a', v('studentName')], ['Curso', v('studentCourse')]]);
  drawRow([['Módulo', v('studentModule')], ['Fecha', v('examDate')]]);
  y += 8;

  // --- DESGLOSE DE RESULTADOS ---
  const notaText = document.getElementById('scoreCircle').textContent.trim();
  const notaNum  = parseFloat(notaText);
  const aciertos = Math.round(notaNum);        // 10 preguntas × 1 pt = nota directa
  const fallos   = MAX_QUESTIONS - aciertos;
  const aprobado = notaNum >= 5;

  // Encabezado del bloque desglose
  doc.setFillColor(240, 244, 255);
  doc.roundedRect(M, y, CW, 6, 2, 2, 'F');
  doc.setDrawColor(...C.grayBorder);
  doc.roundedRect(M, y, CW, 6, 2, 2, 'S');
  doc.setTextColor(...C.textMid); doc.setFontSize(7); doc.setFont('helvetica', 'bold');
  doc.text('DESGLOSE DE RESULTADOS', M + 3, y + 4.2);
  y += 6;

  // Tres columnas: Aciertos | Fallos | Sistema de puntuación
  const col = CW / 3;

  // Col 1 — Aciertos
  doc.setFillColor(212, 237, 218); doc.rect(M,         y, col, 18, 'F');
  doc.setDrawColor(...C.grayBorder); doc.rect(M,        y, col, 18, 'S');
  doc.setTextColor(21, 87, 36); doc.setFontSize(20); doc.setFont('helvetica', 'bold');
  doc.text(String(aciertos), M + col / 2, y + 12, { align: 'center' });
  doc.setFontSize(7); doc.setFont('helvetica', 'normal');
  doc.text('PREGUNTAS CORRECTAS', M + col / 2, y + 16.5, { align: 'center' });

  // Col 2 — Fallos
  doc.setFillColor(248, 215, 218); doc.rect(M + col,   y, col, 18, 'F');
  doc.setDrawColor(...C.grayBorder); doc.rect(M + col,  y, col, 18, 'S');
  doc.setTextColor(114, 28, 36); doc.setFontSize(20); doc.setFont('helvetica', 'bold');
  doc.text(String(fallos), M + col + col / 2, y + 12, { align: 'center' });
  doc.setFontSize(7); doc.setFont('helvetica', 'normal');
  doc.text('PREGUNTAS FALLADAS', M + col + col / 2, y + 16.5, { align: 'center' });

  // Col 3 — Sistema de puntuación
  doc.setFillColor(235, 240, 255); doc.rect(M + col*2, y, col, 18, 'F');
  doc.setDrawColor(...C.grayBorder); doc.rect(M + col*2,y, col, 18, 'S');
  doc.setTextColor(...C.textDark); doc.setFontSize(7.5); doc.setFont('helvetica', 'bold');
  doc.text('Sistema de puntuación', M + col*2 + col / 2, y + 5.5, { align: 'center' });
  doc.setFontSize(7); doc.setFont('helvetica', 'normal');
  doc.setTextColor(...C.textMid);
  doc.text(`${MAX_QUESTIONS} preguntas × 1 pt = 10 pts máx.`, M + col*2 + col / 2, y + 9.5,  { align: 'center' });
  doc.text('Acierto: +1 pt  |  Fallo: 0 pts',                M + col*2 + col / 2, y + 13,    { align: 'center' });
  doc.text('(Sin penalización por error)',                     M + col*2 + col / 2, y + 16.5,  { align: 'center' });

  y += 24;

  // --- NOTA FINAL ---
  const scoreBg = aprobado ? C.greenBg : C.redBg;
  const scoreFg = aprobado ? C.greenText : C.redText;
  doc.setFillColor(...scoreBg); doc.roundedRect(M, y, CW, 25, 3, 3, 'F');
  doc.setDrawColor(...scoreFg); doc.roundedRect(M, y, CW, 25, 3, 3, 'S');
  doc.setTextColor(...scoreFg); doc.setFontSize(24); doc.setFont('helvetica', 'bold');
  doc.text('NOTA FINAL: ' + notaText + ' / 10', PW / 2, y + 14, { align: 'center' });
  doc.setFontSize(10);
  doc.text(aprobado ? 'RESULTADO: APTO' : 'RESULTADO: NO APTO / REQUIERE REFUERZO', PW / 2, y + 21, { align: 'center' });
  y += 35;
  doc.setDrawColor(...C.grayBorder); doc.line(M, PH - 15, PW - M, PH - 15);
  doc.setTextColor(...C.textMid); doc.setFontSize(7);
  doc.text('Documento generado automáticamente por el Sistema Interactivo de Evaluación.', PW / 2, PH - 10, { align: 'center' });

  const blob = doc.output('blob');
  const dataUri = doc.output('datauristring');
  const base64 = dataUri.split('base64,')[1];
  return { blob, base64 };
}

// =============================================
// ENVÍO A GOOGLE DRIVE
// =============================================
document.getElementById('btnEnviarDrive').addEventListener('click', async () => {
  const btn = document.getElementById('btnEnviarDrive');
  const status = document.getElementById('enviarDriveStatus');
  btn.disabled = true;
  btn.textContent = 'Enviando...';
  status.style.display = 'block';
  status.style.color = '#555';
  status.textContent = '⏳ Generando documento y guardando nota...';
  document.querySelector('.app-container').style.pointerEvents = 'none';
  document.querySelector('.app-container').style.opacity = '0.7';
  document.getElementById('evaluationPanel').style.pointerEvents = 'auto';

  try {
    const nombre = (document.getElementById('studentName').value || 'alumno').trim().replace(/\s+/g, '_');
    const pdfFilename = `Union3D_${nombre}.pdf`;
    const pdfResult = generarPDF(pdfFilename);

    await fetch(GAS_URL, {
      method: 'POST', mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fecha: document.getElementById('examDate').value,
        nombre: document.getElementById('studentName').value,
        ejercicio: "Tipos de Unión",
        modulo: "SAP",
        tipo: "Tipos de Unión",
        nota: document.getElementById('scoreCircle').textContent,
        pdfNombre: pdfFilename,
        pdf: pdfResult.base64
      })
    });

    const url = URL.createObjectURL(pdfResult.blob);
    const a = document.createElement('a');
    a.href = url; a.download = pdfFilename;
    document.body.appendChild(a); a.click();
    document.body.removeChild(a); URL.revokeObjectURL(url);

    btn.textContent = '¡Enviado!';
    status.style.color = '#16a34a';
    status.textContent = '✅ Datos guardados y PDF generado correctamente.';
  } catch (err) {
    console.error("Error", err);
    btn.disabled = false;
    btn.textContent = 'Reintentar envío';
    status.style.color = '#dc2626';
    status.textContent = '❌ Error al enviar.';
  }
});
