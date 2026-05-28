# Optimized System Prompt: CoupleFit 3-Day Strength Program Migration

This document serves as the **final optimized prompt** and **system instruction package** to execute the migration of the CoupleFit application to a gender-neutral, progressive **3-Day Strength Program**. 

---

## SECTION 1: CORE APPLICATION INSTRUCTIONS

You are a senior frontend developer and fitness UX expert. Your task is to refactor the **CoupleFit** codebase to transition from the old 4-day, gender-divided plan ("Him" vs "Her" - Michael vs Lina) to a unified **3-Day Strength Program** based on the UMT Fitness curriculum.

### Core Architecture Principles:
1. **Remove Gender Divisions:** Eliminate the dual "Lina" and "Michael" exercise profiles from the data layer. Both partners will now follow the **same exercise base** at the same training station.
2. **Individualized Load Customization:** Even though partners share the same exercise, they customize their difficulty individually by adjusting the load (adding/removing weight), range of motion (ROM), or tempo according to their fitness level. The UI must reflect this shared-station but independent-load dynamic.
3. **Descriptive Training Days:** Replace the generic "Day 1, 2, and 3" names with motivating, engaging Spanish titles:
   - **Día 1: Cimientos de Poder (Fuerza Total & Estabilidad Core)**
   - **Día 2: Esculpiendo el Templo (Tensión Mecánica & Empuje-Tracción)**
   - **Día 3: Rendimiento Atlético (Bisagra, Cadena Posterior & Potencia)**
4. **Video Tutorial Integration:** Every exercise must have its corresponding YouTube tutorial link embedded directly as a clickable, premium tutorial button in the UI.
5. **Detailed Progression Mechanics:** Integrate clear, actionable scientific progression guidelines in the "Science & Tips" tab, detailing the 6 ways to achieve progressive overload (Volume, Weight, ROM, Tempo, Density, and Technique).

---

## SECTION 2: WORKOUT DATABASE SCHEMA (`src/data/workoutData.js`)

Overwrite `src/data/workoutData.js` with the following unified database structure. Both partners share the movement, but the notes indicate how each can customize their progression.

```javascript
export const workoutPlan = {
  D1: [
    {
      id: 'D1-1',
      category: 'Patrón Sentadilla (Tren Inferior)',
      name: 'Sentadillas en Copa (Goblet Squats)',
      description: 'Sentadilla profunda sosteniendo una mancuerna o kettlebell pegada al pecho. Excelente para la postura y fuerza de cuadríceps.',
      sets: '3-4',
      reps: '10-12',
      sharedEquipment: 'Zona de Mancuernas / Kettlebells',
      videoUrl: 'https://www.youtube.com/watch?v=f-Vf2yRRqOg',
      progressionNotes: {
        michael: 'Carga pesada enfocado en profundidad máxima (RIR 2).',
        lina: 'Carga moderada controlando la bajada en 3 segundos para tensión mecánica.'
      }
    },
    {
      id: 'D1-2',
      category: 'Tracción Horizontal (Espalda)',
      name: 'Remo en Suspensión TRX o Remo Inclinado (Bent Row)',
      description: 'Tracción bilateral para desarrollar fuerza en la espalda alta y mejorar la estabilidad escapular.',
      sets: '3-4',
      reps: '10-12',
      sharedEquipment: 'Estación de TRX / Barra y Discos',
      videoUrl: 'https://www.youtube.com/watch?v=IEky4NL3LLQ',
      videoUrlAlternative: 'https://www.youtube.com/watch?v=6gvmcqr226U',
      progressionNotes: {
        michael: 'Remo inclinado con barra libre pesada para fuerza bruta.',
        lina: 'Remo en TRX ajustando la inclinación corporal para controlar la resistencia.'
      }
    },
    {
      id: 'D1-3',
      category: 'Fuerza Unilateral (Estabilidad)',
      name: 'Zancadas Unilaterales / Sentadilla Búlgara (Split Squats)',
      description: 'Trabajo a una sola pierna para corregir desequilibrios musculares, potenciar la estabilidad y fuerza de glúteos.',
      sets: '2-3',
      reps: '8-10 por lado',
      sharedEquipment: 'Banco Plano & Mancuernas',
      videoUrl: 'https://www.youtube.com/watch?v=Wcmg-3iHwjQ',
      progressionNotes: {
        michael: 'Sentadilla Búlgara pesada con mancuernas a los costados.',
        lina: 'Split Squat con peso libre progresando la profundidad (ROM) al suelo.'
      }
    },
    {
      id: 'D1-4',
      category: 'Empuje Vertical (Hombros)',
      name: 'Press de Hombro por Encima de la Cabeza (Overhead Press)',
      description: 'Empuje vertical estricto para esculpir hombros (deltoides) y fortalecer los tríceps.',
      sets: '2-3',
      reps: '10-12',
      sharedEquipment: 'Mancuernas / Barra de Peso Libre',
      videoUrl: 'https://www.youtube.com/watch?v=22gQUcvcW1o',
      progressionNotes: {
        michael: 'Press Militar de pie con barra olímpica, core activado.',
        lina: 'Press de hombro con mancuernas sentada para máximo aislamiento deltoides.'
      }
    },
    {
      id: 'D1-5',
      category: 'Aislamiento Posterior (Isquios)',
      name: 'Curl de Isquiotibiales en Fitball (Stability Ball Leg Curl)',
      description: 'Flexión de rodilla suspendida en pelota de estabilidad. Fortalece isquios, glúteos y el control del core.',
      sets: '2-3',
      reps: '10-12',
      sharedEquipment: 'Fitball / Colchoneta',
      videoUrl: 'https://www.youtube.com/watch?v=spowfx8sOKM',
      progressionNotes: {
        michael: 'Eleva la cadera al máximo y realiza una pausa isométrica de 2s al contraer.',
        lina: 'Controla el retorno lento de la pelota para maximizar la fase excéntrica.'
      }
    },
    {
      id: 'D1-6',
      category: 'Aislamiento Superior (Tríceps)',
      name: 'Extensiones de Tríceps (Triceps Extensions)',
      description: 'Aislamiento específico para la cabeza larga del tríceps, mejorando la fuerza de empuje y definición.',
      sets: '2-3',
      reps: '10-12',
      sharedEquipment: 'Mancuerna Única / Estación de Poleas',
      videoUrl: 'https://www.youtube.com/watch?v=LXkCrxn3caQ',
      progressionNotes: {
        michael: 'Extensiones tras nuca pesadas o fondos estrictos.',
        lina: 'Extensiones con polea de cuerda buscando contracción máxima abajo.'
      }
    },
    {
      id: 'D1-7',
      category: 'Estabilidad Core / Anti-Rotación',
      name: 'Arrastre de Kettlebell en Plancha Alta (Tall Plank KB Drags)',
      description: 'Plancha alta isométrica mientras arrastras lateralmente una kettlebell por debajo del cuerpo. Rígido control del core anti-rotación.',
      sets: '2-3',
      reps: '8-10 por lado',
      sharedEquipment: 'Colchoneta & Kettlebell / Mancuerna',
      videoUrl: 'https://www.youtube.com/watch?v=6bBaM_ot1pE',
      progressionNotes: {
        michael: 'Usa una kettlebell de 16-24 kg, evitando cualquier balanceo de cadera.',
        lina: 'Usa carga ligera enfocada en mantener la línea del cuerpo perfectamente paralela al suelo.'
      }
    },
    {
      id: 'D1-8',
      category: 'Cadena Posterior / Correctivo',
      name: 'Supermans (Extensión Lumbar)',
      description: 'Elevación simultánea de brazos y piernas en prono. Excelente corrector postural para fortalecer la espalda baja y glúteos.',
      sets: '2-3',
      reps: '10-12',
      sharedEquipment: 'Colchoneta',
      videoUrl: 'https://www.youtube.com/watch?v=dKCTIFR1sCc',
      progressionNotes: {
        michael: 'Sostén la contracción arriba por 3 segundos en cada repetición.',
        lina: 'Movimiento fluido y controlado coordinando con la respiración.'
      }
    }
  ],
  D2: [
    {
      id: 'D2-1',
      category: 'Empuje Horizontal (Pecho)',
      name: 'Press de Banca Plano (Bench Press)',
      description: 'El clásico levantamiento de empuje horizontal para desarrollar fuerza en pecho, hombro anterior y tríceps.',
      sets: '3-4',
      reps: '10-12',
      sharedEquipment: 'Banco Plano & Barra / Mancuernas',
      videoUrl: 'https://www.youtube.com/watch?v=hm_TrCkhJgo',
      progressionNotes: {
        michael: 'Press de banca con barra olímpica buscando sobrecarga progresiva de peso.',
        lina: 'Press plano con mancuernas para mayor rango de movimiento y seguridad articular.'
      }
    },
    {
      id: 'D2-2',
      category: 'Fuerza Unilateral (Tren Inferior)',
      name: 'Zancadas Inversas con Mancuernas (Reverse Lunges)',
      description: 'Zancada hacia atrás que reduce el impacto en las rodillas mientras activa intensamente glúteos e isquiotibiales.',
      sets: '3-4',
      reps: '8-10 por lado',
      sharedEquipment: 'Zona de Pesas Libres',
      videoUrl: 'https://www.youtube.com/watch?v=xrPteyQLGAo',
      progressionNotes: {
        michael: 'Zancadas inversas pesadas alternando piernas de forma fluida.',
        lina: 'Zancadas enfocadas en el empuje desde el talón delantero para activar glúteos.'
      }
    },
    {
      id: 'D2-3',
      category: 'Tracción Posterior / Postural',
      name: 'Aperturas Inversas / Pájaros (Reverse Flyes)',
      description: 'Aislamiento del deltoides posterior e interescapulares, vital para balancear empujes pesados y mejorar la postura.',
      sets: '2-3',
      reps: '10-12',
      sharedEquipment: 'Mancuernas Ligeras',
      videoUrl: 'https://www.youtube.com/watch?v=hf7jnF45N_I',
      progressionNotes: {
        michael: 'Vuelos posteriores controlando el descenso sin balanceos.',
        lina: 'Pájaros sentados con el torso inclinado, apretando escápulas 1s al final.'
      }
    },
    {
      id: 'D2-4',
      category: 'Cadena Posterior / Glúteos',
      name: 'Hip Thrusts o Puentes de Glúteo (Bridges)',
      description: 'Extensión de cadera con apoyo escapular para aislar y desarrollar la fuerza del glúteo mayor.',
      sets: '2-3',
      reps: '10-12',
      sharedEquipment: 'Banco & Barra o Colchoneta',
      videoUrl: 'https://www.youtube.com/watch?v=76t0z3Tdx6Q',
      videoUrlAlternative: 'https://www.youtube.com/watch?v=FJNPGhF1R-Y',
      progressionNotes: {
        michael: 'Hip Thrust con barra cargada pesada y bloqueo arriba de 1s.',
        lina: 'Hip Thrust con mancuerna o disco centrado en la conexión mente-músculo.'
      }
    },
    {
      id: 'D2-5',
      category: 'Fuerza Lateral (Tren Inferior)',
      name: 'Sentadillas Laterales / Cosacas (Lateral Squats)',
      description: 'Desplazamientos laterales profundos que mejoran la flexibilidad activa, movilidad de cadera y fuerza de aductores.',
      sets: '2-3',
      reps: '8-10 por lado',
      sharedEquipment: 'Zona Libre (Cuerpo Corporal o KB)',
      videoUrl: 'https://www.youtube.com/watch?v=0lLIWWSmMm4',
      progressionNotes: {
        michael: 'Sentadillas cosacas sosteniendo una kettlebell ligera en el pecho (Goblet style).',
        lina: 'Sentadillas laterales fluidas con peso corporal, buscando ganar profundidad semana a semana.'
      }
    },
    {
      id: 'D2-6',
      category: 'Aislamiento Hombros (Lateral)',
      name: 'Elevaciones Laterales (Lateral Raises)',
      description: 'El ejercicio clave para desarrollar la porción media del deltoides y conseguir amplitud en el tren superior.',
      sets: '2-3',
      reps: '10-12',
      sharedEquipment: 'Mancuernas Ligeras',
      videoUrl: 'https://www.youtube.com/watch?v=XPPfnSEATJA',
      progressionNotes: {
        michael: 'Elevaciones estrictas sin impulso. Baja lento en 3 segundos.',
        lina: 'Doble progresión: domina las 12 reps con forma impecable antes de subir el peso.'
      }
    },
    {
      id: 'D2-7',
      category: 'Core / Rotación',
      name: 'Rotaciones con Banda (Banded) o en Polea (Cable Rotations)',
      description: 'Rotación horizontal de torso contra resistencia. Ejercicio excelente de potencia rotacional y fuerza de oblicuos.',
      sets: '2-3',
      reps: '8-10 por lado',
      sharedEquipment: 'Estación de Poleas o Banda Elástica',
      videoUrl: 'https://www.youtube.com/watch?v=L5J3juj8PYg',
      videoUrlAlternative: 'https://www.youtube.com/watch?v=58GS24huLx4',
      progressionNotes: {
        michael: 'Rotación explosiva en polea media con retorno ultra controlado.',
        lina: 'Rotación con banda elástica, sintiendo la contracción isométrica del oblicuo.'
      }
    },
    {
      id: 'D2-8',
      category: 'Fuerza Isométrica Core',
      name: 'Plancha Frontal Isométrica (Front Plank)',
      description: 'Bloqueo abdominal estático para desarrollar resistencia y rigidez en la faja lumbopélvica.',
      sets: '2-3',
      reps: '20-30 seg',
      sharedEquipment: 'Colchoneta',
      videoUrl: 'https://www.youtube.com/watch?v=rCk2uctmMwc',
      progressionNotes: {
        michael: 'Plancha activa contrayendo glúteos, cuádriceps y empujando activamente el suelo.',
        lina: 'Mantén respiración diafragmática calmada manteniendo una línea neutra perfecta.'
      }
    }
  ],
  D3: [
    {
      id: 'D3-1',
      category: 'Patrón Bisagra (Cadena Posterior)',
      name: 'Peso Muerto Convencional o Rumano (Deadlifts)',
      description: 'El ejercicio definitivo de tracción de cadena posterior. Desarrolla fuerza bruta en glúteos, isquios, espalda baja y agarre.',
      sets: '3-4',
      reps: '10-12',
      sharedEquipment: 'Plataforma / Barra y Discos',
      videoUrl: 'https://www.youtube.com/watch?v=rw4E6qodyyk',
      progressionNotes: {
        michael: 'Peso Muerto convencional desde el suelo con barra olímpica pesada (RIR 2).',
        lina: 'Peso Muerto Rumano (RDL) enfocándose en llevar la cadera atrás y sentir estiramiento en isquios.'
      }
    },
    {
      id: 'D3-2',
      category: 'Tracción Vertical (Espalda)',
      name: 'Jalón al Pecho (Lat Pulldowns) o Dominadas (Pullups)',
      description: 'Tracción vertical para desarrollar amplitud dorsal, fuerza de agarre y salud escapular.',
      sets: '3-4',
      reps: '10-12',
      sharedEquipment: 'Polea Alta de Jalón / Barra de Dominadas',
      videoUrl: 'https://www.youtube.com/watch?v=JGeRYIZdojU',
      videoUrlAlternative: 'https://www.youtube.com/watch?v=LWSSa1SPges',
      progressionNotes: {
        michael: 'Dominadas estrictas libres o lastradas. Rango completo (colgado total a barbilla arriba).',
        lina: 'Jalón al pecho en polea inclinando levemente el torso y llevando los codos a los bolsillos.'
      }
    },
    {
      id: 'D3-3',
      category: 'Fuerza Unilateral (Tren Inferior)',
      name: 'Subidas al Cajón con Mancuernas (Step Ups)',
      description: 'Empuje unilateral en cajón para aislar los cuadríceps y glúteos, reforzando la rodilla y el tobillo.',
      sets: '2-3',
      reps: '8-10 por lado',
      sharedEquipment: 'Cajón Pliométrico & Mancuernas',
      videoUrl: 'https://www.youtube.com/watch?v=DxUNi119Qzs',
      progressionNotes: {
        michael: 'Subidas explosivas a cajón de 60cm controlando la bajada en 3s sin dejarse caer.',
        lina: 'Subidas controladas a cajón de 45cm asistiendo el empuje únicamente con la pierna elevada.'
      }
    },
    {
      id: 'D3-4',
      category: 'Empuje Inclinado (Pecho/Hombros)',
      name: 'Press de Banca Inclinado (Incline Bench Press)',
      description: 'Empuje en ángulo inclinado para desarrollar la porción clavicular del pectoral (pecho superior) y tríceps.',
      sets: '2-3',
      reps: '10-12',
      sharedEquipment: 'Banco Inclinado & Barra / Mancuernas',
      videoUrl: 'https://www.youtube.com/watch?v=Fv5EYoJfRt4',
      progressionNotes: {
        michael: 'Press inclinado con barra buscando máxima fuerza e hipertrofia.',
        lina: 'Press inclinado con mancuernas para cuidar la articulación del hombro y estabilizar.'
      }
    },
    {
      id: 'D3-5',
      category: 'Fuerza Unilateral Cruzada (Glúteos)',
      name: 'Zancadas Cruzadas / Reverencia (Curtsy Lunges)',
      description: 'Zancada cruzada hacia atrás en ángulo diagonal. Activación masiva del glúteo medio y estabilizadores laterales.',
      sets: '2-3',
      reps: '8-10 por lado',
      sharedEquipment: 'Zona Libre & Mancuernas',
      videoUrl: 'https://www.youtube.com/watch?v=XoglWOLQJVA',
      progressionNotes: {
        michael: 'Zancadas cruzadas dinámicas cargando mancuernas pesadas a los lados.',
        lina: 'Zancadas de reverencia enfocándose en el control de la rodilla delantera para evitar valgo.'
      }
    },
    {
      id: 'D3-6',
      category: 'Aislamiento Superior (Bíceps)',
      name: 'Curl de Bíceps con Mancuernas (Biceps Curls)',
      description: 'Ejercicio de aislamiento para flexores de codo, aumentando la fuerza del bíceps braquial.',
      sets: '2-3',
      reps: '10-12',
      sharedEquipment: 'Mancuernas en Banco o De Pie',
      videoUrl: 'https://www.youtube.com/watch?v=SB41wiGbkaw',
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
      name: 'Abdominales Tuck Up (Tuck Ups)',
      description: 'Flexión de cadera y abdomen simultánea sentándose en los isquiones. Gran activación global del recto abdominal.',
      sets: '2-3',
      reps: '10-12',
      sharedEquipment: 'Colchoneta',
      videoUrl: 'https://www.youtube.com/watch?v=_ytHhpMgFTI',
      progressionNotes: {
        michael: 'Realiza el Tuck Up de forma explosiva al cerrar y frena la extensión del cuerpo suspendido.',
        lina: 'Movimiento fluido controlando que la lumbar no se arquee dolorosamente en la extensión.'
      }
    }
  ]
};

export const expertTips = [
  {
    profile: 'both',
    icon: 'Activity',
    title: 'Dinámica de Entrenamiento en Pareja',
    description: 'Aprovechen la estación compartida al máximo. Mientras uno realiza su serie activa, el otro descansa y asiste con la carga. Esto maximiza la densidad del entrenamiento sin ocupar múltiples estaciones en el gimnasio.'
  },
  {
    profile: 'both',
    icon: 'CheckCircle',
    title: 'Progreso Individualizado',
    description: 'Comparten el movimiento, pero NO la carga. Cada uno debe llevar su propio registro de pesos y progresar mediante el método que mejor se adapte a su nivel actual (Sobrecarga de Peso, Volumen, ROM o Tempo).'
  },
  {
    profile: 'lina',
    icon: 'ShieldAlert',
    title: 'Monitoreo de Energía & Glucosa',
    description: 'Lina, debido a tu susceptibilidad a la hipoglucemia, prioriza consumir carbohidratos de bajo índice glucémico y proteína 90 minutos antes de entrenar. Si la sesión supera los 45 minutos, toma sorbos de agua con electrolitos.'
  },
  {
    profile: 'michael',
    icon: 'Activity',
    title: 'Autorregulación & BJJ',
    description: 'Michael, si tuviste una noche de sparring dura de BJJ, autorregula reduciendo los sets de 4 a 3 o baja la intensidad. La recuperación del Sistema Nervioso Central (SNC) es prioritaria.'
  },
  {
    profile: 'both',
    icon: 'CheckCircle',
    title: 'La Regla de los Supersets',
    description: 'Para terminar la rutina en menos de 60 minutos, pueden realizar los ejercicios de forma alternada (Supersets). Por ejemplo, alternar Sentadilla (D1-1) con Remo (D1-2) para optimizar el tiempo de descanso.'
  }
];
```

---

## SECTION 3: DETAILED TRAINING STAGES & PHASES (EXPLANATIONS)

The application UI must clearly explain each training stage and phase so the user can easily follow along during a session.

### 1. Las Fases del Entrenamiento Diario:
* **Fase 1: Activación y Movilidad (Calentamiento General):**
  - **Duración:** 5 a 10 minutos.
  - **Objetivo:** Incrementar la temperatura central del cuerpo, lubricar articulaciones y activar el sistema neuromuscular a través de cardio ligero y rotaciones específicas (caderas/hombros).
* **Fase 2: Bloque de Fuerza Principal (Ejercicios 1 a 4):**
  - **Objetivo:** Estimular fibras de contracción rápida, reclutar unidades motoras y sobrecargar progresivamente los patrones de movimiento primarios (Sentadilla, Empuje, Bisagra, Tracción).
  - **Esquema:** Sets pesados con descanso completo de 1.5 a 2 minutos.
* **Fase 3: Bloque Accesorio y Core (Ejercicios 5 a 8):**
  - **Objetivo:** Corregir asimetrías unilaterales, potenciar la estabilidad core anti-rotación e hipertrofiar grupos musculares secundarios (isquiotibiales, brazos, hombro posterior).
  - **Esquema:** Sets continuados con mayor enfoque en volumen y tensión mecánica. Descanso de 60 a 90 segundos.
* **Fase 4: Vuelta a la Calma y Descompresión:**
  - **Duración:** 5 minutos.
  - **Objetivo:** Activar el sistema parasimpático para detener la liberación de cortisol y adrenalina, acelerando los procesos de síntesis proteica y recuperación mitocondrial mediante estiramientos suaves y respiración diafragmática profunda.

---

## SECTION 4: THE 6 METHODS OF PROGRESSIVE OVERLOAD (FOR INTERACTIVE HELP / IN-APP SCIENCE & TIPS)

Present these 6 scientific ways to progress to the user dynamically inside the dashboard to educate them:

1. **Aumento de Volumen (Sets & Reps):** Incrementar la cantidad de repeticiones o series semanales manteniendo la misma carga de peso.
   - *Ejemplo:* Pasar de hacer 3 series de 8 reps a 3 series de 10 reps.
2. **Aumento de Carga (Peso):** Incrementar gradualmente la resistencia de la barra o mancuerna manteniendo la calidad del movimiento.
   - *Ejemplo:* Aumentar entre 2.5 y 5 lbs (1.25 - 2.5 kg) por semana cuando se domine el rango de repeticiones establecido.
3. **Aumento de Rango de Movimiento (ROM):** Ejecutar la misma repetición bajando más profundo o aumentando el recorrido vertical (déficits).
   - *Ejemplo:* Sentadilla Búlgara progresando de una profundidad corta -> bajada hasta rozar el suelo con la rodilla -> elevar el pie delantero para un déficit extremo.
4. **Variación del Tempo (Control del Ritmo):** Manipular la velocidad de ejecución. Ralentizar la fase de bajada (excéntrica) o añadir pausas estáticas en máxima tensión (isométricos).
   - *Ejemplo:* Realizar Goblet Squats bajando de forma controlada en 3-5 segundos (Fase Excéntrica Lenta 5-1-1).
5. **Aumento de Densidad (Capacidad de Trabajo):** Completar el mismo número de series y repeticiones en menos tiempo total, acortando inteligentemente los periodos de descanso.
   - *Ejemplo:* Disminuir los intervalos de descanso entre series de 90 segundos a 75 segundos progresivamente.
6. **Perfeccionamiento Técnico (Forma Impecable):** Lograr una mejor alineación de la columna, mayor estabilidad del core y una contracción más pura del músculo objetivo. Grabar la forma y eliminar cualquier impulso o balanceo.

---

## SECTION 5: STEP-BY-STEP CODE IMPLEMENTATION GUIDE

To successfully migrate the React PWA, follow these concrete implementation steps:

### STEP 1: Update the Workout Data Structure
- Overwrite `src/data/workoutData.js` with the clean 3-day data layout from **Section 2**.
- Unify the structure so that both partners leverage the shared exercises, while retaining `progressionNotes` for personalized guidance.

### STEP 2: Refactor `Dashboard.jsx`
- Replace the Day selector buttons (`Day A, B, C, D`) with a premium 3-day selector:
  - **Día 1: Cimientos de Poder** (Fuerza Total / Estabilidad Core)
  - **Día 2: Esculpiendo el Templo** (Tensión Mecánica / Empuje-Tracción)
  - **Día 3: Rendimiento Atlético** (Bisagra / Cadena Posterior / Potencia)
- Adapt the preview grid to map correct keys (`D1`, `D2`, `D3`).

### STEP 3: Refactor `TrainingMode.jsx` (Immersive Mode)
- Modify the split-screen card: instead of showing different exercises, render the **unified exercise name and description** at the top with the embedded **YouTube tutorial link**.
- Render two distinct customized sections side-by-side at the bottom:
  - **Zona Michael (BJJ/Fuerza):** Display Michael's custom progression notes, target reps, sets, and a personalized weight tracking input.
  - **Zona Lina (Hipertrofia):** Display Lina's custom progression notes, target reps, sets, and a personalized weight/rep tracker.
- Maintain all modern HIG interactions: backdrop blur, haptics on complete, safe margins, and swipe gestures.

### STEP 4: Integrate detailed explanations
- Render the 4 training stages as an interactive header or sidebar inside the training carousel so partners know what stage they are in (e.g. *Fase 1: Activación*, *Fase 2: Fuerza Principal*).
- Integrate the **6 Progressive Overload Methods** directly in the "Science & Tips" tab inside the control panel.

### STEP 5: Verify build & PWA compliance
- Run static checks and ensure `npm run build` is successful.
- Check service workers and installability in home screen.
