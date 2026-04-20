// CONFIGURACIONES GLOBALES (Versatilidad 2.0)
const GAS_URL = "https://script.google.com/macros/s/AKfycbzDJni77NAjWJng-ogPCMhr3QEHKKkgi7I2Vvegqamwb1udpgGeCamGO9bjuNrY4sE4/exec";

// Materiales 3D (Textura metálica mejorada con corrección de profundidad para las líneas)
const metalMat = new THREE.MeshStandardMaterial({ 
  color: 0x8a9ba8, // Tono acero
  metalness: 0.9,  // Muy metálico
  roughness: 0.2,  // Acero pulido
  polygonOffset: true,
  polygonOffsetFactor: 1, // Empuja las caras sólidas hacia atrás
  polygonOffsetUnits: 2   // Asegura que el borde neón siempre gane
});

// Helper para crear piezas de metal con borde de neón
function createPlate(w, h, d, x, y, z) {
  const geo = new THREE.BoxGeometry(w, h, d);
  const mesh = new THREE.Mesh(geo, metalMat);
  mesh.position.set(x, y, z);
  
  // Suave línea de borde de neón para máximo contraste (Cian)
  const edges = new THREE.EdgesGeometry(geo);
  const neonLine = new THREE.LineSegments(
    edges, 
    new THREE.LineBasicMaterial({ color: 0x00f3ff, linewidth: 2, transparent: true, opacity: 0.85 })
  );
  mesh.add(neonLine); // Se adhiere al bloque de metal
  return mesh;
}

// Datos de las Uniones: Módulos con Teoría Normativa Densa (ISO/AWS) y Banco de Preguntas
const jointData = {
  tope: {
    id: "tope",
    name: "Unión a Tope (Butt joint)",
    desc: "Placas alineadas en el mismo plano (135° - 180°). Alta eficiencia mecánica.",
    teoria: `<b>Normativa Técnica:</b> UNE-EN ISO 17659 / AWS A3.0.<br>
             <b>Concepto CJP:</b> En uniones críticas según AWS D1.1, se exige <b>CJP (Complete Joint Penetration)</b>, que garantiza la continuidad metalúrgica en todo el espesor de la junta.<br>
             <b>Espesores y Preparación:</b>
             <ul>
               <li><b>< 3 mm:</b> Bordes rectos (I-butt). Preparación mínima o nula.</li>
               <li><b>> 3 mm:</b> Apertura de biseles (V, U, X).</li>
               <li><b>Bisel en X (Doble V):</b> Recomendado a partir de espesores medios para lograr la <b>neutralización de tensiones residuales de contracción</b> al equilibrar el aporte de calor por ambas caras.</li>
             </ul>
             <b>Factor Crítico:</b> La correcta preparación evita la falta de penetración y asegura la integridad ante cargas de fatiga.`,
    questions: [
      {
        text: "¿Cuál es la principal ventaja metalúrgica y mecánica de aplicar un bisel en X (doble V) frente a uno en V simple en espesores mayores a 12mm?",
        options: ["Neutralización de tensiones residuales de contracción", "Aumento de la zona afectada térmicamente (ZAT)", "Reducción del ángulo de ataque del electrodo", "Eliminación completa del soplado magnético"],
        correct: "Neutralización de tensiones residuales de contracción"
      },
      {
        text: "En una unión a tope crítica según AWS D1.1, ¿qué garantiza una preparación CJP (Complete Joint Penetration)?",
        options: ["Continuidad metalúrgica en todo el espesor de la junta", "Que la soldadura se ha realizado solo por una cara", "Que el refuerzo de la cara supera los 3mm", "La utilización de electrodos celulósicos exclusivamente"],
        correct: "Continuidad metalúrgica en todo el espesor de la junta"
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
    desc: "Piezas perpendiculares (5° - 90°). Base de la ingeniería estructural.",
    teoria: `<b>Normativa Técnica:</b> ISO 17659 / AWS A3.0.<br>
             <b>Dimensionamiento:</b> La resistencia se define por el <b>espesor de garganta (Throat thickness)</b> del cordón en ángulo (fillet), que es la distancia mínima de la raíz a la cara.<br>
             <b>Aplicaciones:</b> Vigas armadas y rigidizadores.<br>
             <b>Factor Crítico (Fallo de base):</b> En uniones de gran espesor y alta restricción, existe un alto riesgo de <b>desgarre laminar (Lamellar tearing)</b>, un fallo por planos de debilidad en la placa base.<br>
             <b>Mejora Técnica:</b> Puede requerir biselado previo en la pieza vertical para asegurar penetración total.`,
    questions: [
      {
        text: "¿Qué parámetro de diseño define la resistencia real de un cordón en ángulo en una unión en T?",
        options: ["El espesor de garganta (Throat thickness)", "La longitud del cateto (Leg length)", "El ancho de la cara de la soldadura", "El ángulo de inclinación de la pieza horizontal"],
        correct: "El espesor de garganta (Throat thickness)"
      },
      {
        text: "Ante grandes esfuerzos de restricción en uniones en T de alto espesor, ¿qué fallo estructural es característico de la placa base?",
        options: ["Desgarre laminar (Lamellar tearing)", "Fisuración en frío por hidrógeno", "Inclusión de escoria intermitente", "Solape de borde (Overlap)"],
        correct: "Desgarre laminar (Lamellar tearing)"
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
    desc: "Piezas superpuestas (0° - 5°). Muy común en el sector automotriz.",
    teoria: `<b>Normativa Técnica:</b> ISO 17659 / AWS A3.0.<br>
             <b>Análisis de Esfuerzos:</b> Su principal desventaja es la <b>excentricidad de la carga</b>, que genera momentos flectores indeseados en la junta.<br>
             <b>Configuración Estructural:</b> AWS recomienda combinar <b>cordones longitudinales y transversales</b> para soportar esfuerzos de cizalladura de forma equilibrada.<br>
             <b>Ventaja:</b> Tolerancia dimensional alta, no requiere preparación de bordes compleja.`,
    questions: [
      {
        text: "Desde el punto de vista del cálculo de estructuras, ¿cuál es el principal inconveniente de la unión a solape?",
        options: ["Excentricidad de la carga que genera momentos flectores", "Dificultad de acceso para el proceso GMAW", "Necesidad de mecanizado previo de las caras solapadas", "Excesivo tiempo de enfriamiento natural"],
        correct: "Excentricidad de la carga que genera momentos flectores"
      },
      {
        text: "En uniones a solape sometidas a cizalladura, ¿cómo se distribuyen idealmente los cordones según AWS?",
        options: ["Cordones longitudinales y transversales combinados", "Solo cordones de penetración completa", "Soldadura de tapón (Plug) central exclusivamente", "Soldadura fuerte por capilaridad superficial"],
        correct: "Cordones longitudinales y transversales combinados"
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
    desc: "Bordes que se tocan en ángulo (30° - 135°). Creación de volúmenes.",
    teoria: `<b>Normativa Técnica:</b> ISO 17659 / AWS A3.0.<br>
             <b>Configuraciones:</b>
             <ul>
               <li><b>Esquina abierta:</b> Facilita enormemente la <b>penetración de raíz</b> al permitir el acceso del arco al vértice interno.</li>
               <li><b>Esquina cerrada:</b> Utilizada cuando se requiere un acabado liso externo.</li>
             </ul>
             <b>Tanques y Presión:</b> Para aplicaciones robustas se utiliza una configuración de <b>bisel doble (K o X) y cordón de respaldo interno</b> para garantizar estanqueidad y resistencia.`,
    questions: [
      {
        text: "¿Qué ventaja operativa presenta una preparación de 'esquina abierta' frente a la 'esquina cerrada'?",
        options: ["Facilita la penetración de raíz en todo el espesor", "Reduce el volumen de material de aportación necesario", "Evita la necesidad de usar gas de protección", "Aumenta la velocidad de avance del proceso SAW"],
        correct: "Facilita la penetración de raíz en todo el espesor"
      },
      {
        text: "En recipientes a presión rectangulares, ¿cuál es la configuración más robusta para una unión en esquina?",
        options: ["Esquina con bisel doble y cordón de respaldo interno", "Soldadura de puntos por el exterior únicamente", "Unión simple sin preparación de bordes", "Fusión autógena de los filos externos"],
        correct: "Esquina con bisel doble y cordón de respaldo interno"
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
    desc: "Bordes paralelos unidos (0° - 30°). Soldaduras de sellado.",
    teoria: `<b>Normativa Técnica:</b> ISO 17659 / AWS A3.0.<br>
             <b>Ingeniería de Fallo:</b> Es muy susceptible a fallar bajo esfuerzos de tracción perpendicular o esfuerzos de <b>palanca (Cleavage)</b> en la base del cordón.<br>
             <b>Terminología AWS:</b> La <b>Edge Weld</b> se define por la fusión completa de los bordes adyacentes de placas paralelas, a diferencia de una unión a tope donde las placas son colineales.<br>
             <b>Uso:</b> Limitado a sellado estanco en espesores finos.`,
    questions: [
      {
        text: "¿Bajo qué tipo de esfuerzos mecánicos es más probable que falle prematuramente una unión de canto?",
        options: ["Esfuerzos de tracción perpendicular y palanca (Cleavage)", "Esfuerzos de compresión axial pura", "Vibración ultrasónica de baja frecuencia", "Cargas hidrostáticas estables"],
        correct: "Esfuerzos de tracción perpendicular y palanca (Cleavage)"
      },
      {
        text: "Según la terminología AWS A3.0, ¿cuál es la diferencia entre una 'Edge Weld' y una soldadura a tope?",
        options: ["En la 'Edge Weld' se funden completamente los bordes metálicos adyacentes de placas paralelas", "No hay diferencia, son sinónimos exactos", "La 'Edge Weld' solo se aplica bajo agua", "La soldadura a tope requiere siempre fundente granulado"],
        correct: "En la 'Edge Weld' se funden completamente los bordes metálicos adyacentes de placas paralelas"
      }
    ],
    build: (group) => {
      group.add(createPlate(10, 80, 250, -5.1, 0, 0));
      group.add(createPlate(10, 80, 250, 5.1, 0, 0));
    }
  }
};

class App3D {
  constructor(canvasId) {
    this.container = document.getElementById(canvasId);
    this.scene = new THREE.Scene();
    
    // Camera
    this.camera = new THREE.PerspectiveCamera(45, this.container.clientWidth / this.container.clientHeight, 1, 1000);
    this.camera.position.set(150, 150, 300);
    
    // Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.container.appendChild(this.renderer.domElement);
    
    // Controls
    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    
    // Lights
    const ambLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(100, 200, 100);
    this.scene.add(dirLight);
    const backLight = new THREE.DirectionalLight(0xffffff, 0.3);
    backLight.position.set(-100, -100, -100);
    this.scene.add(backLight);

    // Group for active model
    this.modelGroup = new THREE.Group();
    this.scene.add(this.modelGroup);

    // Resize handler
    window.addEventListener('resize', () => {
      if(!this.container) return;
      this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    });

    this.animate();
  }

  loadModel(type) {
    // Limpiar modelo anterior
    while(this.modelGroup.children.length > 0){ 
        this.modelGroup.remove(this.modelGroup.children[0]); 
    }
    
    if (jointData[type]) {
      jointData[type].build(this.modelGroup);
      // Resetear cámara
      this.camera.position.set(150, 150, 300);
      this.controls.target.set(0,0,0);
      this.controls.update();
    }
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
}

// INICIALIZACIÓN
const studyApp = new App3D('studyCanvas');
let examApp = null; 

// ==========================================
// MODO ESTUDIO
// ==========================================
studyApp.loadModel('tope'); // inicial
// Cargar textos iniciales de Tope para que no aparezca vacío
document.getElementById('infoTitle').textContent = jointData.tope.name;
document.getElementById('infoDesc').textContent = jointData.tope.desc;
document.getElementById('infoTheory').innerHTML = jointData.tope.teoria;

  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      // UI update
      document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      
      // Data update
      const type = e.target.dataset.type;
      const data = jointData[type];
      document.getElementById('infoTitle').textContent = data.name;
      document.getElementById('infoDesc').textContent = data.desc;
      document.getElementById('infoTheory').innerHTML = data.teoria;
      
      // 3D update
      studyApp.loadModel(type);
    });
  });

// ==========================================
// SISTEMA DE EXAMEN
// ==========================================
const modulesData = {
  "1º GM Soldadura": [
    "Mecanizado",
    "Soldadura en Atmósfera Natural"
  ],
  "2º GM Soldadura": [
    "Montaje",
    "Trazado",
    "Soldadura en Atmósfera Protegida (SAP)"
  ],
  "1º GS Construcciones Metálicas": [
    "Procesos de Corte y Preparación",
    "Grafismo y Representación en Fab. Mecánica"
  ],
  "2º GS Construcciones Metálicas": [
    "Diseño de Estructuras Metálicas",
    "Procesos de Unión y Montaje"
  ]
};

document.getElementById('studentCourse').addEventListener('change', (e) => {
  const modSelect = document.getElementById('studentModule');
  modSelect.innerHTML = '<option value="" disabled selected>Selecciona tu módulo...</option>';
  modSelect.disabled = false;
  modSelect.style.borderColor = 'var(--border)';
  
  const course = e.target.value;
  if (modulesData[course]) {
    modulesData[course].forEach(mod => {
      const opt = document.createElement('option');
      opt.value = opt.textContent = mod;
      modSelect.appendChild(opt);
    });
  }
});

// Pre-rellenar fecha de hoy
const dateInput = document.getElementById('examDate');
const today = new Date();
const offset = today.getTimezoneOffset();
const localToday = new Date(today.getTime() - (offset*60*1000)).toISOString().split('T')[0];
dateInput.value = localToday;

// Vigilante de fecha
dateInput.addEventListener('change', (e) => {
  const warning = document.getElementById('dateWarning');
  if (e.target.value !== localToday) {
    warning.style.display = 'block';
  } else {
    warning.style.display = 'none';
  }
});

let examSequence = [];
let currentQuestionIndex = 0;
let score = 0; // 2 pts per correct
const MAX_QUESTIONS = 5;
const TIME_LIMIT = 20; // Segundos por pregunta
let timeLeft = TIME_LIMIT;
let timerInterval = null;

document.getElementById('btnStartExam').addEventListener('click', () => {
  const nombre = document.getElementById('studentName').value;
  const curso = document.getElementById('studentCourse').value;
  const modulo = document.getElementById('studentModule').value;
  const fecha = document.getElementById('examDate').value;
  
  if (!nombre.trim() || !curso.trim() || !modulo.trim() || !fecha) {
    document.getElementById('studentName').style.borderColor = !nombre ? 'red' : '#cbd5e1';
    document.getElementById('studentCourse').style.borderColor = !curso ? 'red' : '#cbd5e1';
    document.getElementById('studentModule').style.borderColor = !modulo ? 'red' : '#cbd5e1';
    document.getElementById('examDate').style.borderColor = !fecha ? 'red' : '#cbd5e1';
    // Modificar temporalmente el botón para avisar
    const btn = document.getElementById('btnStartExam');
    btn.textContent = "❌ Rellena todos tus datos arriba";
    setTimeout(() => btn.textContent = "Comenzar Prueba", 3000);
    return;
  }
  
  // 1. ELIMINACIÓN FÍSICA DE LA TEORÍA (No se puede volver atrás)
  const studyPanel = document.getElementById('studyPanel');
  if (studyPanel) {
    studyPanel.remove(); 
  }
  
  // 2. CAMBIAR FASE
  document.getElementById('examPanel').style.display = 'block';
  
  // Inicializar canvas de examen si no existe
  if (!examApp) {
    examApp = new App3D('examCanvas');
  }

  startExam();
});

function startExam() {
  // Extraer todas las preguntas del banco de datos (2 por unión = 10 en total)
  let banco = [];
  Object.keys(jointData).forEach(key => {
    jointData[key].questions.forEach(q => {
      banco.push({ text: q.text, options: q.options, correct: q.correct, type: key });
    });
  });
  
  // Mezclar lista de preguntas y quedarse con MAX_QUESTIONS (5)
  examSequence = banco.sort(() => Math.random() - 0.5).slice(0, MAX_QUESTIONS);
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
      // Tiempo agotado: Forzar fallo por tiempo
      const correct = examSequence[currentQuestionIndex].correct;
      checkAnswer(null, correct, null, true);
    }
  }, 1000);
}

function loadQuestion() {
  const currentQ = examSequence[currentQuestionIndex];
  
  // Cargar modelo 3D relacionado de fondo para dar contexto
  examApp.loadModel(currentQ.type);
  
  // Girar la cámara aleatoriamente para dinamismo
  examApp.camera.position.set(
    (Math.random() > 0.5 ? 1 : -1) * (150 + Math.random() * 100),
    100 + Math.random() * 100,
    (Math.random() > 0.5 ? 1 : -1) * (200 + Math.random() * 100)
  );
  examApp.controls.update();

  document.getElementById('currentQuestionNum').textContent = currentQuestionIndex + 1;
  document.getElementById('btnNextQuestion').style.display = 'none';
  
  // Modificar la pregunta visualmente
  document.querySelector('.exam-controls h3').textContent = currentQ.text;

  // Generar opciones barajadas
  const optionsGrid = document.getElementById('examOptions');
  optionsGrid.innerHTML = '';
  
  let shuffledOptions = [...currentQ.options].sort(() => Math.random() - 0.5);
  
  shuffledOptions.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.textContent = opt;
    btn.onclick = () => checkAnswer(opt, currentQ.correct, btn);
    optionsGrid.appendChild(btn);
  });
  
  // Iniciar cronómetro
  startTimer();
}

function checkAnswer(selected, correct, clickedBtn, isTimeOut = false) {
  clearInterval(timerInterval);
  
  // Congelar botones para evitar doble respuesta
  const allBtns = document.querySelectorAll('.option-btn');
  allBtns.forEach(b => b.disabled = true);
  
  const timerLabel = document.getElementById('examTimer');
  
  if (isTimeOut) {
    timerLabel.textContent = "¡TIEMPO AGOTADO!";
    // Marcar la correcta en verde para que aprenda
    allBtns.forEach(b => {
      if (b.textContent === correct) b.classList.add('correct');
    });
  } else {
    if (selected === correct) {
      clickedBtn.classList.add('correct');
      score += 2; // 5 preguntas * 2pts = 10 pts max
    } else {
      clickedBtn.classList.add('wrong');
      // Marcar la correcta para que aprenda
      allBtns.forEach(b => {
        if (b.textContent === correct) b.classList.add('correct');
      });
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
  // Ocultar Controles
  document.querySelector('.exam-controls').style.display = 'none';
  
  // Mostrar pantalla final
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
  document.getElementById('modalSummary').textContent = `Has identificado correctamente ${score/2} de ${MAX_QUESTIONS} tipos de uniones.`;
  
  // Bajar el scroll al panel
  panel.scrollIntoView({ behavior: 'smooth', block: 'end' });
}

// =============================================
// GENERADOR DE PDF (jsPDF - Estilo Institucional)
// =============================================
function generarPDF(pdfFilename) {
  const { jsPDF } = window.jspdf;
  if (!jsPDF) throw new Error('jsPDF no cargado');
  const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });

  const PW = 210, PH = 297, M = 15, CW = PW - 2 * M;
  let y = M;

  const C = {
    blueDark:   [30, 58, 138],
    blueLight:  [219, 234, 254],
    labelBg:    [235, 240, 255],
    white:      [255, 255, 255],
    grayBorder: [203, 213, 225],
    textDark:   [15, 23, 42],
    textMid:    [71, 85, 105],
    greenBg:    [212, 237, 218],
    greenText:  [21, 87, 36],
    redBg:      [248, 215, 218],
    redText:    [114, 28, 36],
  };

  const v = (id) => {
    const el = document.getElementById(id);
    return (el && el.value) ? el.value : '---';
  };

  function drawRow(fields, rowH = 10) {
    const n = fields.length;
    const colW = CW / n;
    fields.forEach(function(field, i) {
      const label = field[0], value = field[1];
      const x = M + i * colW;
      doc.setFillColor(...C.labelBg);
      doc.rect(x, y, colW, 4, 'F');
      doc.setTextColor(...C.textMid);
      doc.setFontSize(7);
      doc.setFont('helvetica', 'bold');
      doc.text(label, x + 2, y + 3);
      doc.setFillColor(...C.white);
      doc.rect(x, y + 4, colW, rowH - 4, 'F');
      doc.setTextColor(...C.textDark);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text(String(value), x + 2, y + 8);
      doc.setDrawColor(...C.grayBorder);
      doc.rect(x, y, colW, rowH, 'S');
    });
    y += rowH;
  }

  // CABECERA
  doc.setFillColor(...C.blueDark);
  doc.rect(M, y, CW, 15, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('REPORTE DE EVALUACIÓN INTERACTIVA', PW / 2, y + 9, { align: 'center' });
  y += 20;

  // DATOS GENERALES
  drawRow([['Nombre Alumno/a', v('studentName')], ['Curso', v('studentCourse')]]);
  drawRow([['Módulo', v('studentModule')], ['Fecha', v('examDate')]]);
  y += 10;

  // RESULTADO
  const notaText = document.getElementById('scoreCircle').textContent.trim();
  const notaNum = parseFloat(notaText);
  const aprobado = notaNum >= 5;
  const scoreBg   = aprobado ? C.greenBg   : C.redBg;
  const scoreFg   = aprobado ? C.greenText : C.redText;

  doc.setFillColor(...scoreBg);
  doc.roundedRect(M, y, CW, 25, 3, 3, 'F');
  doc.setDrawColor(...scoreFg);
  doc.roundedRect(M, y, CW, 25, 3, 3, 'S');
  doc.setTextColor(...scoreFg);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('NOTA FINAL: ' + notaText + ' / 10', PW / 2, y + 14, { align: 'center' });
  doc.setFontSize(10);
  doc.text(aprobado ? 'RESULTADO: APTO' : 'RESULTADO: NO APTO / REQUIERE REFUERZO', PW / 2, y + 21, { align: 'center' });
  y += 35;

  // PIE
  doc.setDrawColor(...C.grayBorder);
  doc.line(M, PH - 15, PW - M, PH - 15);
  doc.setTextColor(...C.textMid);
  doc.setFontSize(7);
  doc.text('Documento generado automáticamente por el Sistema Interactivo de Evaluación.', PW / 2, PH - 10, { align: 'center' });

  const blob = doc.output('blob');
  const dataUri = doc.output('datauristring');
  const base64 = dataUri.split('base64,')[1];
  
  return { 
    blob: blob, 
    base64: base64 
  };
}

// =============================================
// ENVÍO AL EXCEL (GOOGLE APPS SCRIPT)
// =============================================
document.getElementById('btnEnviarDrive').addEventListener('click', async () => {
  const btn = document.getElementById('btnEnviarDrive');
  const status = document.getElementById('enviarDriveStatus');
  
  btn.disabled = true;
  btn.textContent = 'Enviando...';
  status.style.display = 'block';
  status.style.color = '#555';
  status.textContent = '⏳ Generando documento y guardando nota...';

  // Congelar formulario
  document.querySelector('.app-container').style.pointerEvents = 'none';
  document.querySelector('.app-container').style.opacity = '0.7';
  document.getElementById('evaluationPanel').style.pointerEvents = 'auto'; 

  try {
    const nombre = (document.getElementById('studentName').value || 'alumno').trim().replace(/\s+/g, '_');
    const pdfFilename = `Union3D_${nombre}.pdf`;
    
    // 1. GENERAR PDF
    const pdfResult = generarPDF(pdfFilename);

    // 2. ENVIAR A GOOGLE DRIVE (Siguiendo el estándar de oro de WPS)
    await fetch(GAS_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fecha: document.getElementById('examDate').value,
        nombre: document.getElementById('studentName').value,
        ejercicio: "SAP - Union3D", // Nombre que sale en la hoja de Excel
        tipo: "Tipos de Unión", // Nombre explícito para la carpeta en Google Drive
        nota: document.getElementById('scoreCircle').textContent,
        pdfNombre: pdfFilename,
        pdf: pdfResult.base64
      })
    });
    
    // 3. DESCARGA LOCAL PARA EL ALUMNO
    const url = URL.createObjectURL(pdfResult.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = pdfFilename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

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
