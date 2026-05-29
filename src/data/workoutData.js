export const workoutPlan = {
  D1: [
    {
      id: 'D1-WU',
      category: 'Preparación Fisiológica',
      name: 'Calentamiento: Cardio y Movilidad (10 min)',
      description: '10 minutos de activación ligera de cardio y movilidad para tren inferior y empujes. Alternativa: Bicicleta estática y bandas de resistencia.',
      sets: '1',
      reps: '600',
      sharedEquipment: 'Cinta, Elíptica o Bicicleta Estática',
      videoUrl: 'https://www.youtube.com/watch?v=3qyWpJ34dWw',
      videoUrlAlternative: 'https://www.youtube.com/watch?v=oMcSAyzyQX4',
      measurementType: 'time',
      hasAlternative: true,
      progressionNotes: {
        michael: 'Cinta inclinada o elíptica a ritmo moderado (zona 2 cardíaca).',
        lina: 'Cinta ligera o bicicleta estática enfocada en movilidad articular dinámica.'
      }
    },
    {
      id: 'D1-1',
      category: 'Patrón Sentadilla (Tren Inferior)',
      name: 'Sentadillas con Barra / Mancuerna o Prensa de Piernas',
      description: 'Sentadilla profunda usando barra libre y discos en rack o mancuerna/kettlebell pesada pegada al pecho. Excelente para cuadríceps y glúteos. Alternativa: Prensa de Piernas inclinada de placas.',
      sets: '3-4',
      reps: '10-12',
      sharedEquipment: 'Rack de Barra y Discos / Mancuernas / Prensa de Piernas de Placas',
      videoUrl: 'https://www.youtube.com/watch?v=f-Vf2yRRqOg',
      hasAlternative: true,
      progressionNotes: {
        michael: 'Carga pesada enfocado en profundidad máxima con barra o Prensa a 140kg.',
        lina: 'Carga moderada con foco en la postura recta y descenso controlado con mancuerna, o Prensa cuidando rodillas.'
      }
    },
    {
      id: 'D1-2',
      category: 'Tracción Horizontal (Espalda)',
      name: 'Remo Inclinado con Barra / Mancuerna o Remo en Máquina',
      description: 'Tracción bilateral usando barra con discos o mancuernas para desarrollar espalda alta. Alternativa: Máquina selectorizada de remo sentado (pulley/placas).',
      sets: '3-4',
      reps: '10-12',
      sharedEquipment: 'TRX / Barra y Discos / Mancuernas / Máquina de Remo de Placas',
      videoUrl: 'https://www.youtube.com/watch?v=IEky4NL3LLQ',
      videoUrlAlternative: 'https://www.youtube.com/watch?v=6gvmcqr226U',
      hasAlternative: true,
      progressionNotes: {
        michael: 'Remo inclinado pesado con barra y discos o máquina convergente de palancas.',
        lina: 'Remo en TRX o Máquina de placas buscando retracción escapular estricta.'
      }
    },
    {
      id: 'D1-3',
      category: 'Fuerza Unilateral (Estabilidad)',
      name: 'Split Squat con Mancuerna / Barra o Prensa Unilateral',
      description: 'Trabajo unilateral sosteniendo mancuernas o barra en los hombros para estabilidad y fuerza. Alternativa: Prensa horizontal a una sola pierna.',
      sets: '2-3',
      reps: '8-10 por lado',
      sharedEquipment: 'Banco Plano / Mancuernas / Barra con Discos / Prensa Horizontal de Placas',
      videoUrl: 'https://www.youtube.com/watch?v=Wcmg-3iHwjQ',
      hasAlternative: true,
      progressionNotes: {
        michael: 'Sentadilla Búlgara con mancuernas pesadas o prensa unilateral explosiva.',
        lina: 'Split Squat con peso libre progresando en rango de movimiento, o prensa horizontal.'
      }
    },
    {
      id: 'D1-4',
      category: 'Empuje Vertical (Hombros)',
      name: 'Press de Hombro con Barra / Mancuernas o Prensa de Hombro',
      description: 'Empuje vertical estricto con barra libre pesada de pie o mancuernas sentado. Alternativa: Máquina de placas selectorizada de empuje vertical.',
      sets: '2-3',
      reps: '10-12',
      sharedEquipment: 'Barra y Discos / Mancuernas / Máquina de Hombros selectorizada',
      videoUrl: 'https://www.youtube.com/watch?v=22gQUcvcW1o',
      hasAlternative: true,
      progressionNotes: {
        michael: 'Press Militar de pie libre con barra olímpica, o máquina cargada pesada.',
        lina: 'Press de hombro con mancuernas sentada, o máquina selectorizada para máxima estabilidad.'
      }
    },
    {
      id: 'D1-5',
      category: 'Aislamiento Posterior (Isquios)',
      name: 'Curl de Isquios en Fitball o Camilla Sentado',
      description: 'Flexión de rodilla y activación de isquiotibiales en pelota de estabilidad. Alternativa: Camilla selectorizada de Leg Curl Sentado de placas.',
      sets: '2-3',
      reps: '10-12',
      sharedEquipment: 'Pelota de Estabilidad / Colchoneta / Camilla Leg Curl Sentado de Placas',
      videoUrl: 'https://www.youtube.com/watch?v=spowfx8sOKM',
      hasAlternative: true,
      progressionNotes: {
        michael: 'Elevación de cadera máxima con Fitball o curl sentado en camilla pesada.',
        lina: 'Control del retorno lento y contracción sostenida en la máquina de placas.'
      }
    },
    {
      id: 'D1-6',
      category: 'Aislamiento Superior (Tríceps)',
      name: 'Copa de Tríceps con Mancuerna / Barra o Polea de Cables',
      description: 'Aislamiento para la cabeza larga del tríceps usando mancuerna pesada a dos manos o barra. Alternativa: Extensión de tríceps en polea alta con cuerda.',
      sets: '2-3',
      reps: '10-12',
      sharedEquipment: 'Mancuernas / Barra Romana / Estación de Poleas con Cuerda',
      videoUrl: 'https://www.youtube.com/watch?v=LXkCrxn3caQ',
      videoUrlAlternative: 'https://www.youtube.com/watch?v=2-LAMcpzODU',
      hasAlternative: true,
      progressionNotes: {
        michael: 'Extensiones pesadas con mancuerna o barra, o jalón de tríceps en polea al fallo.',
        lina: 'Extensiones con polea buscando aislamiento estricto y codos fijos.'
      }
    },
    {
      id: 'D1-7',
      category: 'Estabilidad Core / Anti-Rotación',
      name: 'Arrastre de Kettlebell en Plancha o Core de Placas',
      description: 'Plancha alta anti-rotación arrastrando peso. Alternativa: Plancha estática tocando hombros o kettlebell pesada.',
      sets: '2-3',
      reps: '8-10 por lado',
      sharedEquipment: 'Colchoneta / Kettlebells de Peso Libre',
      videoUrl: 'https://www.youtube.com/watch?v=6bBaM_ot1pE',
      progressionNotes: {
        michael: 'Arrastre lateral con Kettlebell de 16-24 kg, estabilizando cadera.',
        lina: 'Mantener la plancha firme controlando la respiración sin rotación lumbar.'
      }
    },
    {
      id: 'D1-8',
      category: 'Cadena Posterior / Correctivo',
      name: 'Supermans o Extensor Lumbar en Máquina',
      description: 'Elevación boca abajo de torso y piernas en colchoneta. Excelente corrector postural general para espalda baja. Alternativa: Extensor lumbar en banco a 45° o máquina selectorizada lumbar de placas.',
      sets: '2-3',
      reps: '10-12',
      sharedEquipment: 'Colchoneta / Banco de Extensión Lumbar / Máquina Lumbar de Placas',
      videoUrl: 'https://www.youtube.com/watch?v=dKCTIFR1sCc',
      hasAlternative: true,
      progressionNotes: {
        michael: 'Extensión isométrica controlada en suelo, o máquina controlando la contracción de glúteos.',
        lina: 'Movimiento respiratorio controlado en suelo o banco.'
      }
    }
  ],
  D2: [
    {
      id: 'D2-WU',
      category: 'Preparación Fisiológica',
      name: 'Calentamiento: Cardio y Movilidad (10 min)',
      description: '10 minutos de activación ligera de cardio y movilidad para torso. Alternativa: Elíptica de palancas o bicicleta estática.',
      sets: '1',
      reps: '600',
      sharedEquipment: 'Cinta, Elíptica o Bicicleta Estática',
      videoUrl: 'https://www.youtube.com/watch?v=1e528F0pYPg',
      videoUrlAlternative: 'https://www.youtube.com/watch?v=oMcSAyzyQX4',
      measurementType: 'time',
      hasAlternative: true,
      progressionNotes: {
        michael: 'Elíptica movilizando brazos o remo ergómetro para preparar el tren superior.',
        lina: 'Bicicleta estática suave y movilidad de hombros con banda elástica.'
      }
    },
    {
      id: 'D2-1',
      category: 'Empuje Horizontal (Pecho)',
      name: 'Press de Banca Plano con Barra / Mancuernas o Máquina de Pecho',
      description: 'Levantamiento de fuerza para pectoral con barra olímpica libre o mancuernas. Alternativa: Máquina de Chest Press de placas selectorizada.',
      sets: '3-4',
      reps: '10-12',
      sharedEquipment: 'Banco Plano con Barra y Discos / Mancuernas / Máquina de Chest Press',
      videoUrl: 'https://www.youtube.com/watch?v=hm_TrCkhJgo',
      hasAlternative: true,
      progressionNotes: {
        michael: 'Press de banca clásico con barra olímpica libre, o máquina convergente de placas pesada.',
        lina: 'Press plano con mancuernas, o máquina de placas para cuidar hombros.'
      }
    },
    {
      id: 'D2-2',
      category: 'Fuerza Unilateral (Tren Inferior)',
      name: 'Zancadas Inversas con Mancuernas / Barra o Sentadilla Smith (Multipower)',
      description: 'Zancada hacia atrás con barra libre o mancuernas. Alternativa: Zancadas o sentadilla guiada en máquina Multipower.',
      sets: '3-4',
      reps: '8-10 por lado',
      sharedEquipment: 'Mancuernas / Barra y Discos / Máquina Multipower (Smith)',
      videoUrl: 'https://www.youtube.com/watch?v=xrPteyQLGAo',
      hasAlternative: true,
      progressionNotes: {
        michael: 'Zancadas inversas con mancuernas o barra, o prensa unilateral enfocada en cuádriceps.',
        lina: 'Zancadas inversas libres o búlgara guiada en Multipower para máxima estabilidad.'
      }
    },
    {
      id: 'D2-3',
      category: 'Tracción Posterior / Postural',
      name: 'Pájaros con Mancuerna o Pec Deck Invertido',
      description: 'Aislamiento de deltoides posterior usando mancuernas. Alternativa: Máquina selectorizada de aperturas inversas (Pec Deck).',
      sets: '2-3',
      reps: '10-12',
      sharedEquipment: 'Mancuernas Ligeras / Máquina de Aperturas / Pec Deck',
      videoUrl: 'https://www.youtube.com/watch?v=hf7jnF45N_I',
      hasAlternative: true,
      progressionNotes: {
        michael: 'Pájaros inclinados con mancuernas, o pec deck invertido contrayendo espalda alta.',
        lina: 'Aperturas inversas en máquina selectorizada de placas aislando deltoides posterior.'
      }
    },
    {
      id: 'D2-4',
      category: 'Cadena Posterior / Glúteos',
      name: 'Hip Thrust Libre con Barra / Discos o Hip Thrust en Máquina',
      description: 'Extensión de cadera para glúteos con barra libre y banco. Alternativa: Máquina selectorizada de Hip Thrust o Multipower.',
      sets: '2-3',
      reps: '10-12',
      sharedEquipment: 'Barra, Discos y Banco / Máquina de Hip Thrust',
      videoUrl: 'https://www.youtube.com/watch?v=76t0z3Tdx6Q',
      videoUrlAlternative: 'https://www.youtube.com/watch?v=FJNPGhF1R-Y',
      hasAlternative: true,
      progressionNotes: {
        michael: 'Hip thrust libre pesado con barra olímpica, o máquina de carga de discos.',
        lina: 'Hip thrust en máquina guiada selectorizada enfocándose en la contracción apical.'
      }
    },
    {
      id: 'D2-5',
      category: 'Fuerza Lateral (Tren Inferior)',
      name: 'Sentadilla Cosaca con Mancuerna o Máquina Aductora',
      description: 'Desplazamiento lateral profundo con mancuerna o peso corporal. Alternativa: Máquina aductora de placas selectorizada.',
      sets: '2-3',
      reps: '8-10 por lado',
      sharedEquipment: 'Espacio Libre / Mancuernas / Máquina Aductora',
      videoUrl: 'https://www.youtube.com/watch?v=0lLIWWSmMm4',
      hasAlternative: true,
      progressionNotes: {
        michael: 'Sentadillas cosacas sosteniendo una kettlebell o mancuerna en copa.',
        lina: 'Sentadillas cosacas libres asistidas, ganando flexibilidad lateral.'
      }
    },
    {
      id: 'D2-6',
      category: 'Aislamiento Hombros (Lateral)',
      name: 'Elevación Lateral con Mancuerna o Elevación en Polea',
      description: 'Amplitud de deltoides lateral con mancuernas. Alternativa: Elevación con polea baja y cable.',
      sets: '2-3',
      reps: '10-12',
      sharedEquipment: 'Mancuernas / Estación de Cables / Polea Baja',
      videoUrl: 'https://www.youtube.com/watch?v=XPPfnSEATJA',
      hasAlternative: true,
      progressionNotes: {
        michael: 'Laterales pesados con mancuernas, o polea con cable cruzado para tensión continua.',
        lina: 'Laterales con mancuernas ligeras a altas repeticiones o polea suave.'
      }
    },
    {
      id: 'D2-7',
      category: 'Core / Rotación',
      name: 'Rotación con Banda Elástica o Rotación en Polea de Cables',
      description: 'Rotación de torso contra resistencia usando banda elástica. Alternativa: Rotación en polea media de cables.',
      sets: '2-3',
      reps: '8-10 por lado',
      sharedEquipment: 'Estación de Cables / Poleas / Banda Elástica',
      videoUrl: 'https://www.youtube.com/watch?v=L5J3juj8PYg',
      videoUrlAlternative: 'https://www.youtube.com/watch?v=58GS24huLx4',
      hasAlternative: true,
      progressionNotes: {
        michael: 'Rotación de tronco explosiva en polea media, resistiendo la excéntrica.',
        lina: 'Rotación con banda de resistencia enfocada en oblicuo interno/externo.'
      }
    },
    {
      id: 'D2-8',
      category: 'Fuerza Isométrica Core',
      name: 'Plancha Frontal o Plancha Lateral',
      description: 'Bloqueo abdominal para rigidez lumbar y del core.',
      sets: '2-3',
      reps: '20-30 seg',
      sharedEquipment: 'Colchoneta',
      videoUrl: 'https://www.youtube.com/watch?v=rCk2uctmMwc',
      measurementType: 'time',
      progressionNotes: {
        michael: 'Plancha activa contrayendo core, glúteos y empujando el suelo.',
        lina: 'Plancha en antebrazos controlando respiración diafragmática.'
      }
    }
  ],
  D3: [
    {
      id: 'D3-WU',
      category: 'Preparación Fisiológica',
      name: 'Calentamiento: Cardio y Movilidad (10 min)',
      description: '10 minutos de activación ligera para cadena posterior. Alternativa: Bicicleta estática y movilidad de cadera.',
      sets: '1',
      reps: '600',
      sharedEquipment: 'Cinta, Elíptica o Bicicleta Estática',
      videoUrl: 'https://www.youtube.com/watch?v=divaflydT7M',
      videoUrlAlternative: 'https://www.youtube.com/watch?v=oMcSAyzyQX4',
      measurementType: 'time',
      hasAlternative: true,
      progressionNotes: {
        michael: 'Cinta inclinada a paso rápido o elíptica progresiva preparando caderas.',
        lina: 'Bicicleta estática suave y estiramientos dinámicos de isquiotibiales.'
      }
    },
    {
      id: 'D3-1',
      category: 'Patrón Bisagra (Cadena Posterior)',
      name: 'Peso Muerto con Barra / Discos o Hiperextensiones en Banco',
      description: 'Peso muerto convencional pesado usando barra libre y discos. Alternativa: Extensión lumbar en banco de 45° con disco o Multipower.',
      sets: '3-4',
      reps: '10-12',
      sharedEquipment: 'Plataforma de Discos / Barra / Banco de Hiperextensión 45°',
      videoUrl: 'https://www.youtube.com/watch?v=rw4E6qodyyk',
      hasAlternative: true,
      progressionNotes: {
        michael: 'Peso Muerto convencional libre desde el suelo pesado buscando el fallo.',
        lina: 'Peso muerto rumano con mancuernas, o banco de hiperextensiones a 45°.'
      }
    },
    {
      id: 'D3-2',
      category: 'Tracción Vertical (Espalda)',
      name: 'Dominadas Libres / Asistidas o Jalón al Pecho en Polea',
      description: 'Tracción vertical suspendida usando el propio peso. Alternativa: Jalón al pecho selectorizado de placas en polea alta.',
      sets: '3-4',
      reps: '10-12',
      sharedEquipment: 'Barra de Dominadas / Máquina de Jalón de Placas',
      videoUrl: 'https://www.youtube.com/watch?v=JGeRYIZdojU',
      videoUrlAlternative: 'https://www.youtube.com/watch?v=LWSSa1SPges',
      hasAlternative: true,
      progressionNotes: {
        michael: 'Dominadas libres o lastradas, o jalón al pecho en máquina pesada.',
        lina: 'Jalón al pecho selectorizado abriendo bien el pecho y bajando codos.'
      }
    },
    {
      id: 'D3-3',
      category: 'Fuerza Unilateral (Tren Inferior)',
      name: 'Subidas al Cajón con Mancuerna o Sentadilla/Zancada en Multipower',
      description: 'Empuje unilateral subiendo a cajón con mancuernas. Alternativa: Zancadas o sentadilla guiada en máquina Multipower.',
      sets: '2-3',
      reps: '8-10 por lado',
      sharedEquipment: 'Cajón Pliométrico / Mancuernas / Máquina Multipower (Smith)',
      videoUrl: 'https://www.youtube.com/watch?v=DxUNi119Qzs',
      hasAlternative: true,
      progressionNotes: {
        michael: 'Subidas al cajón pesadas controlando excéntrica, o zancadas Multipower.',
        lina: 'Subidas a cajón asistidas buscando empuje plantar del cuadrícep.'
      }
    },
    {
      id: 'D3-4',
      category: 'Empuje Inclinado (Pecho/Hombros)',
      name: 'Press Inclinado con Barra / Mancuernas o Prensa Pecho Inclinada',
      description: 'Empuje inclinado para pectoral superior usando barra libre o mancuernas. Alternativa: Máquina selectorizada inclinada de empuje.',
      sets: '2-3',
      reps: '10-12',
      sharedEquipment: 'Mancuernas / Banco Inclinado con Barra / Máquina de Press Inclinado',
      videoUrl: 'https://www.youtube.com/watch?v=Fv5EYoJfRt4',
      hasAlternative: true,
      progressionNotes: {
        michael: 'Press inclinado con barra olímpica libre o máquina selectorizada pesada.',
        lina: 'Press inclinado con mancuernas o máquina de placas cuidando rango articular.'
      }
    },
    {
      id: 'D3-5',
      category: 'Fuerza Unilateral Cruzada (Glúteos)',
      name: 'Zancadas Cruzadas con Mancuernas o Patada de Glúteo en Polea',
      description: 'Zancada cruzada atrás con mancuernas para glúteo medio. Alternativa: Extensión de cadera en polea baja con cable.',
      sets: '2-3',
      reps: '8-10 por lado',
      sharedEquipment: 'Zona de Mancuernas / Estación de Polea Baja',
      videoUrl: 'https://www.youtube.com/watch?v=XoglWOLQJVA',
      hasAlternative: true,
      progressionNotes: {
        michael: 'Zancadas cruzadas dinámicas de pie con mancuernas medias.',
        lina: 'Zancadas curtsy controladas con peso corporal, buscando glúteo medio.'
      }
    },
    {
      id: 'D3-6',
      category: 'Aislamiento Superior (Bíceps)',
      name: 'Curl de Bíceps con Mancuernas / Barra o Curl en Máquina',
      description: 'Flexión de codo usando mancuernas o barra libre con discos. Alternativa: Curl de bíceps en polea baja o máquina de placas selectorizada.',
      sets: '2-3',
      reps: '10-12',
      sharedEquipment: 'Mancuernas / Barra Z y Discos / Camilla de Bíceps o Máquina selectorizada',
      videoUrl: 'https://www.youtube.com/watch?v=SB41wiGbkaw',
      hasAlternative: true,
      progressionNotes: {
        michael: 'Curl supino de pie controlando la fase excéntrica completa sin balancear el torso.',
        lina: 'Curl martillo o supino con mancuernas en banco inclinado para estiramiento óptimo.'
      }
    },
    {
      id: 'D3-7',
      category: 'Core / Anti-Rotación Estática',
      name: 'Press Pallof / Anti-Rotación (Anti-Rotation Presses)',
      description: 'Isométrico anti-rotación sosteniendo tensión lateral y empujando al frente. Crucial para oblicuos e integridad del tronco.',
      sets: '2-3',
      reps: '8-10 por lado',
      sharedEquipment: 'Estación de Poleas o Banda Elástica',
      videoUrl: 'https://www.youtube.com/watch?v=9rN0mNLOxXc',
      progressionNotes: {
        michael: 'Empuje lento en polea pesada sosteniendo 2s al frente en máxima extensión.',
        lina: 'Usa banda elástica sosteniendo el bloqueo estático alineado perfectamente con el esternón.'
      }
    },
    {
      id: 'D3-8',
      category: 'Resistencia Core Dinámica',
      name: 'Abdominales Tuck Up o Máquina Crunch Abdominal',
      description: 'Flexión simultánea de cadera y abdomen en colchoneta. Alternativa: Máquina de abdominales selectorizada crunch de placas.',
      sets: '2-3',
      reps: '10-12',
      sharedEquipment: 'Colchoneta / Máquina Ab Crunch de Placas',
      videoUrl: 'https://www.youtube.com/watch?v=_ytHhpMgFTI',
      hasAlternative: true,
      progressionNotes: {
        michael: 'Realiza el Tuck Up de forma explosiva al cerrar y frena la extensión del cuerpo suspendido.',
        lina: 'Movimiento fluido controlando que la lumbar no se arquee dolorosamente en la extensión.'
      }
    }
  ]
};

export const expertTips = [
  {
    profile: 'generic',
    icon: 'Activity',
    title: 'Sobrecarga Progresiva',
    description: 'La clave del progreso es el aumento gradual de la demanda sobre el sistema musculoesquelético. Intenta aumentar el peso, las repeticiones o mejorar el rango de movimiento (ROM) en cada sesión.'
  },
  {
    profile: 'generic',
    icon: 'CheckCircle',
    title: 'Tiempos de Descanso',
    description: 'Respeta los tiempos de descanso para optimizar la recuperación del ATP celular. Dedica entre 90-120 segundos para ejercicios multiarticulares pesados y 60-90 segundos para ejercicios de aislamiento.'
  },
  {
    profile: 'generic',
    icon: 'Activity',
    title: 'Registro de Pesos',
    description: 'Anotar tus cargas y repeticiones te da un mapa preciso de tu fuerza. Utiliza la función de sugerencia de pesos (Smart Inputs) para superar tu rendimiento de la semana anterior.'
  },
  {
    profile: 'generic',
    icon: 'CheckCircle',
    title: 'Recuperación Activa',
    description: 'El crecimiento muscular ocurre durante el descanso. Prioriza entre 7 y 8 horas de sueño profundo y mantén un consumo proteico adecuado (1.6 a 2.0g por kg de peso corporal) para optimizar la síntesis proteica.'
  }
];

/**
 * Dynamically generates 3 months of progressive workout logs for the Test User.
 * Spaced out 3 times a week (Mon, Wed, Fri) over 12 weeks = 36 sessions.
 * Showcases realistic progressive overload, biological day-to-day noise,
 * wellness fluctuations (good/bad days), and accurate muscle/CNS fatigue dips.
 */
export function seedMockDataForTestUser() {
  const baseWeights = {
    'D1-1': 16, 'D1-2': 30, 'D1-3': 8, 'D1-4': 12, 'D1-5': 0, 'D1-6': 10, 'D1-7': 12, 'D1-8': 0,
    'D2-1': 40, 'D2-2': 10, 'D2-3': 6, 'D2-4': 50, 'D2-5': 0, 'D2-6': 6, 'D2-7': 15, 'D2-8': 0,
    'D3-1': 50, 'D3-2': 35, 'D3-3': 10, 'D3-4': 30, 'D3-5': 8, 'D3-6': 8, 'D3-7': 10, 'D3-8': 0
  };

  const increments = {
    'D1-1': 1.0, 'D1-2': 1.25, 'D1-3': 0.5, 'D1-4': 0.5, 'D1-5': 0, 'D1-6': 0.5, 'D1-7': 0.5, 'D1-8': 0,
    'D2-1': 1.5, 'D2-2': 0.5, 'D2-3': 0.25, 'D2-4': 2.0, 'D2-5': 0.5, 'D2-6': 0.25, 'D2-7': 0.5, 'D2-8': 0,
    'D3-1': 2.5, 'D3-2': 1.5, 'D3-3': 0.5, 'D3-4': 1.25, 'D3-5': 0.5, 'D3-6': 0.5, 'D3-7': 0.5, 'D3-8': 0
  };

  const dayOrder = ['D1', 'D2', 'D3'];
  const dayNames = { 'D1': 'Titán', 'D2': 'Encélado', 'D3': 'Mimas' };
  const mockLogs = [];
  
  const totalWeeks = 12;
  const now = Date.now();
  
  // Track previous tonnage per workout day for scoring
  const tonnageHistoryByDay = { 'D1': [], 'D2': [], 'D3': [] };

  for (let w = 0; w < totalWeeks; w++) {
    // Generate D1 (Mon), D2 (Wed), D3 (Fri)
    for (let d = 0; d < 3; d++) {
      const day = dayOrder[d];
      const routine = workoutPlan[day];
      
      // Calculate historical date (3 workouts per week, Mon/Wed/Fri)
      const weeksAgo = totalWeeks - 1 - w;
      const dayOffset = (2 - d) * 2; // Fri is 0, Wed is 2, Mon is 4 days offset
      const timestamp = now - (weeksAgo * 7 * 24 * 3600 * 1000) - (dayOffset * 24 * 3600 * 1000) - (2 * 3600 * 1000);
      const dateStr = new Date(timestamp).toISOString();

      // 1. BIOLOGICAL FLUCTUATIONS: Simulate Sleep, CNS Fatigue & Soreness
      // Test user is generally consistent, but has occasional fatigue drops (BJJ or bad night)
      const randSleep = Math.random();
      const sleepState = randSleep > 0.85 ? 'poor' : randSleep > 0.65 ? 'excellent' : 'normal';
      
      const randCns = Math.random();
      const cnsState = randCns > 0.85 ? 'exhausted' : randCns > 0.65 ? 'tired' : 'fresh';
      
      const randDOMS = Math.random();
      const sorenessState = randDOMS > 0.90 ? 'very_sore' : randDOMS > 0.70 ? 'sore' : 'recovered';

      // Calculate real biological auto-regulation scaling factor
      const sleepFactor = sleepState === 'excellent' ? 1.0 : sleepState === 'normal' ? 0.95 : 0.85;
      const cnsFactor = cnsState === 'fresh' ? 1.0 : cnsState === 'tired' ? 0.90 : 0.75;
      const sorenessFactor = sorenessState === 'recovered' ? 1.0 : sorenessState === 'sore' ? 0.95 : 0.85;
      const autoRegulationFactor = Math.min(sleepFactor, cnsFactor, sorenessFactor);

      // Random session duration (38 to 58 minutes) representing pacing
      const sessionDuration = 2280 + Math.floor(Math.random() * 1200); 
      
      const exercisesLogged = routine.map(ex => {
        const isTimeBased = ex.measurementType === 'time';
        const numSets = ex.id.includes('WU') ? 1 : (ex.id === 'D1-1' || ex.id === 'D2-1' || ex.id === 'D3-1') ? 4 : 3;
        
        // Randomly select option (75% free weights/primary, 25% machines/alternative)
        const selectedOption = ex.hasAlternative && (Math.random() > 0.75) ? 'alternative' : 'primary';

        const sets = [];
        for (let s = 1; s <= numSets; s++) {
          if (isTimeBased) {
            let repsVal = 30; // default plancha
            if (ex.id.includes('WU')) {
              // Warmup: ~10 minutes, slight variance representing exact machine time
              repsVal = 570 + Math.floor(Math.random() * 60); 
            } else if (ex.id === 'D2-8') {
              // Plancha: fluctuates between 20 and 40 seconds depending on fatigue
              const basePlancha = 25 + Math.floor(autoRegulationFactor * 10);
              repsVal = basePlancha + Math.floor(Math.random() * 6) - 3;
            }
            sets.push({
              setNum: s,
              weight: 0,
              reps: Math.max(15, repsVal),
              alFallo: false,
              completed: true
            });
          } else {
            const baseW = baseWeights[ex.id] || 0;
            const inc = increments[ex.id] || 0;
            
            // Calculate base progression weight
            let weight = baseW > 0 ? baseW + (inc * w) : 0;
            
            if (weight > 0) {
              // Apply biological auto-regulation
              weight = weight * autoRegulationFactor;
              
              // Apply day-to-day strength noise (biological variance of ±5%)
              const strengthNoise = 0.95 + (Math.random() * 0.1); 
              weight = weight * strengthNoise;
              
              // Adjust weight based on leverage differences for machine alternatives
              if (selectedOption === 'alternative') {
                if (ex.id === 'D1-1' || ex.id === 'D1-3' || ex.id === 'D2-4' || ex.id === 'D3-4') {
                  // Leg press or chest press machine handles more leverage weight
                  weight = weight * (1.2 + Math.random() * 0.2);
                } else if (ex.id === 'D1-2' || ex.id === 'D1-5' || ex.id === 'D2-3' || ex.id === 'D3-6') {
                  // Cable systems or machines with multiple pulleys reduce weight
                  weight = weight * (0.85 + Math.random() * 0.1);
                }
              }
              
              // Round to nearest 0.5kg for iron loading realism
              weight = Math.round(weight * 2) / 2;
            }

            const targetReps = ex.reps.includes('-') ? parseInt(ex.reps.split('-')[1]) : parseInt(ex.reps) || 10;
            
            // Reps fatigue: slightly lower reps in later sets, also influenced by CNS fatigue
            const repsNoise = s === 1 ? 0 : s === 2 ? -1 : -2;
            const fatigueModifier = autoRegulationFactor < 0.9 ? -1 : 0;
            
            // Reps fluctuate biologically (±1 rep of target)
            const reps = Math.max(6, targetReps + repsNoise + fatigueModifier + Math.floor(Math.random() * 3) - 1);
            
            // final set is pushed to failure, or a random set if pushed hard
            const alFallo = s === numSets && (Math.random() > 0.25); 

            sets.push({
              setNum: s,
              weight: weight,
              reps: reps,
              alFallo: alFallo,
              completed: true
            });
          }
        }

        return {
          exerciseId: ex.id,
          exerciseName: ex.name,
          category: ex.category,
          selectedOption: selectedOption,
          sets: sets,
          duration: isTimeBased ? (ex.id.includes('WU') ? 600 : 90) : 180 + Math.floor(Math.random() * 90), // realistic set execution times
          restDuration: ex.id.includes('WU') ? 15 : 60 + Math.floor(Math.random() * 40) // active rest log
        };
      });

      // Calculate total mechanical tonnage for this session
      let currentTonnage = 0;
      exercisesLogged.forEach(ex => {
        ex.sets.forEach(s => {
          if (s.completed && s.weight > 0 && s.reps > 0) {
            currentTonnage += s.weight * s.reps;
          }
        });
      });

      // 2. VOLUME PROGRESSIVE SCORE: Compare tonnage chronologically to last same-day workout
      const sameDayHistory = tonnageHistoryByDay[day];
      let volumeScore = 30; // default for first sessions
      let overloadDelta = 0;

      if (sameDayHistory.length > 0) {
        const prevTonnage = sameDayHistory[sameDayHistory.length - 1];
        if (prevTonnage > 0 && currentTonnage > 0) {
          const volumeIndex = currentTonnage / prevTonnage;
          overloadDelta = Math.round(((currentTonnage - prevTonnage) / prevTonnage) * 100);
          // Score scales down if they did less volume due to fatigue
          volumeScore = Math.round(Math.min(1.0, volumeIndex) * 30);
        }
      }
      sameDayHistory.push(currentTonnage);

      // 3. PACING SCORE: 10 points for good tempo
      const avgSecondsPerEx = sessionDuration / exercisesLogged.length;
      let pacingScore = 10;
      if (avgSecondsPerEx > 480) {
        pacingScore = Math.max(5, Math.round(10 - (avgSecondsPerEx - 480) / 60));
      }

      // Completion Score is always 100% (60 points) since test user is perfect at completing routines
      const completionScore = 60;

      // Final score contains realistic dips and peaks (ranging from 74 to 100)
      const score = Math.min(100, completionScore + volumeScore + pacingScore);

      mockLogs.push({
        id: `seeded-session-${w}-${day}`,
        user: 'test',
        day: day,
        dayName: dayNames[day],
        date: dateStr,
        duration: sessionDuration,
        score: score,
        tonnage: currentTonnage,
        exercises: exercisesLogged,
        wellness: {
          sleep: sleepState,
          cns: cnsState,
          soreness: sorenessState,
          factor: autoRegulationFactor
        }
      });
    }
  }

  // Return sorted by date descending (newest first)
  return mockLogs.sort((a, b) => new Date(b.date) - new Date(a.date));
}

