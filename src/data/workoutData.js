export const workoutPlan = {
    A: [
        {
            id: 'A0', category: 'Calentamiento General', sharedEquipment: 'Máquinas de Cardio',
            lina: { name: 'Cinta (Caminata ligera) o Elíptica', description: 'Ejercicio cardiovascular de bajo impacto para aumentar el flujo sanguíneo.', sets: 1, reps: '5-10 mins', notes: 'Ritmo suave para elevar la temperatura y ritmo cardíaco.', videoUrl: 'https://www.youtube.com/results?search_query=treadmill+warm+up+short' },
            michael: { name: 'Assault Bike, Remo o Cinta', description: 'Calentamiento cardiovascular de cuerpo completo.', sets: 1, reps: '5-10 mins', notes: 'Ritmo moderado. Prepara las articulaciones para el peso.', videoUrl: 'https://www.youtube.com/results?search_query=assault+bike+warm+up+short' }
        },
        {
            id: 'A1', category: 'Patrón Sentadilla (Pierna)', sharedEquipment: 'Zona de Pesas Libres / Racks',
            lina: { name: 'Sentadilla en Copa (Goblet Squat) con Kettlebell', description: 'Sentadilla frontal sosteniendo el peso a la altura del pecho para mayor estabilidad del core.', sets: 3, reps: '10-12', notes: 'Foco en la profundidad y postura recta.', videoUrl: 'https://www.youtube.com/results?search_query=goblet+squat+form+short' },
            michael: { name: 'Sentadilla Trasera con Barra (Back Squat)', description: 'El levantamiento rey para desarrollar fuerza bruta en el tren inferior.', sets: 4, reps: '5-8', notes: 'RIR 2. Controla la fase excéntrica.', videoUrl: 'https://www.youtube.com/results?search_query=barbell+back+squat+form+short' }
        },
        {
            id: 'A2', category: 'Empuje Horizontal (Pecho)', sharedEquipment: 'Bancos Planos',
            lina: { name: 'Press de Pecho con Mancuernas', description: 'Empuje de peso libre acostada para fortalecer el pecho y tríceps.', sets: 3, reps: '10-12', notes: 'Movimiento controlado, estiramiento completo.', videoUrl: 'https://www.youtube.com/results?search_query=dumbbell+bench+press+form+short' },
            michael: { name: 'Press de Banca con Barra', description: 'Ejercicio principal de fuerza de empuje para el tren superior.', sets: 4, reps: '5-8', notes: 'Fuerza pesada. Pide spotter si vas al límite.', videoUrl: 'https://www.youtube.com/results?search_query=barbell+bench+press+form+short' }
        },
        {
            id: 'A3', category: 'Tracción Horizontal (Espalda)', sharedEquipment: 'Zona de Remos',
            lina: { name: 'Remo Sentado en Polea (Cable Row)', description: 'Tracción horizontal que desarrolla la densidad de la espalda y mejora la postura.', sets: 3, reps: '10-12', notes: 'Aprieta las escápulas atrás.', videoUrl: 'https://www.youtube.com/results?search_query=seated+cable+row+form+short' },
            michael: { name: 'Remo Pendlay con Barra', description: 'Remo estricto desde el suelo para desarrollar fuerza explosiva en la espalda.', sets: 4, reps: '6-8', notes: 'Explosivo desde el suelo.', videoUrl: 'https://www.youtube.com/results?search_query=pendlay+row+form+short' }
        },
        {
            id: 'A4', category: 'Aislamiento Pierna', sharedEquipment: 'Máquina de Isquios',
            lina: { name: 'Curl de Isquios', description: 'Aislamiento en máquina enfocado en fortalecer la parte posterior del muslo.', sets: 3, reps: '12-15', notes: 'Movimiento lento, no uses impulso.', videoUrl: 'https://www.youtube.com/results?search_query=hamstring+curl+machine+form+short' },
            michael: { name: 'Curl de Isquios', description: 'Trabajo accesorio para prevenir lesiones y fortalecer flexores de rodilla.', sets: 3, reps: '12-15', notes: 'Mismo equipo, sube la carga.', videoUrl: 'https://www.youtube.com/results?search_query=hamstring+curl+machine+form+short' }
        },
        {
            id: 'A5', category: 'Core / Finisher', sharedEquipment: 'Zona de Colchonetas',
            lina: { name: 'Plancha Abdominal (Plank)', description: 'Ejercicio isométrico estático, fundamental para la estabilidad del core.', sets: 3, reps: '30-40s', notes: 'Mantén la respiración constante.', videoUrl: 'https://www.youtube.com/results?search_query=perfect+plank+form+short' },
            michael: { name: 'Rueda Abdominal o KB Swings', description: 'Trabajo dinámico de extensión de cadera y resistencia anti-extensión del core.', sets: 3, reps: '10-15', notes: 'Máxima extensión para control de cadera.', videoUrl: 'https://www.youtube.com/results?search_query=kettlebell+swing+form+short' }
        },
        {
            id: 'A6', category: 'Vuelta a la Calma (Movilidad)', sharedEquipment: 'Colchonetas (Juntos)',
            lina: { name: 'Movilidad Funcional (Follow Along)', description: 'Secuencia guiada para relajar la musculatura y ganar rango articular.', sets: 1, reps: '5-10 mins', notes: 'Sigan el video. Respiren profundo para relajar el cuerpo.', videoUrl: 'https://www.youtube.com/results?search_query=5+minute+full+body+mobility+cool+down+follow+along' },
            michael: { name: 'Movilidad Funcional (Follow Along)', description: 'Restauración de la movilidad articular y liberación de tensión post-entreno.', sets: 1, reps: '5-10 mins', notes: 'Sigan el video. Foco en abrir caderas y hombros.', videoUrl: 'https://www.youtube.com/results?search_query=5+minute+full+body+mobility+cool+down+follow+along' }
        }
    ],
    B: [
        {
            id: 'B0', category: 'Calentamiento General', sharedEquipment: 'Máquinas de Cardio',
            lina: { name: 'Cinta (Caminata ligera) o Elíptica', description: 'Trabajo suave para preparar los músculos de las piernas.', sets: 1, reps: '5-10 mins', notes: 'Ritmo suave para elevar la temperatura y ritmo cardíaco.', videoUrl: 'https://www.youtube.com/results?search_query=treadmill+warm+up+short' },
            michael: { name: 'Assault Bike, Remo o Cinta', description: 'Activación del sistema nervioso y aumento de temperatura corporal.', sets: 1, reps: '5-10 mins', notes: 'Ritmo moderado. Prepara las articulaciones para el peso.', videoUrl: 'https://www.youtube.com/results?search_query=rowing+machine+warm+up+short' }
        },
        {
            id: 'B1', category: 'Patrón Bisagra (Cadena Posterior)', sharedEquipment: 'Pesas Libres',
            lina: { name: 'Peso Muerto Rumano (RDL) con Mancuernas', description: 'Variante de peso muerto enfocada en el estiramiento profundo de los isquiotibiales.', sets: 3, reps: '10-12', notes: 'Siente el estiramiento en los isquios.', videoUrl: 'https://www.youtube.com/results?search_query=dumbbell+rdl+form+short' },
            michael: { name: 'Peso Muerto Convencional/Sumo con Barra', description: 'Levantamiento pesado desde el suelo para desarrollar fuerza en toda la cadena posterior.', sets: 4, reps: '5-8', notes: 'RIR 2. Protege la zona lumbar.', videoUrl: 'https://www.youtube.com/results?search_query=barbell+deadlift+form+short' }
        },
        {
            id: 'B2', category: 'Tracción Vertical (Espalda)', sharedEquipment: 'Estación de Dominadas / Poleas',
            lina: { name: 'Jalón al pecho en polea (Lat Pulldown)', description: 'Tracción vertical en polea, ideal para ganar amplitud y fuerza en la espalda alta.', sets: 3, reps: '10-12', notes: 'Pecho arriba, codos hacia abajo.', videoUrl: 'https://www.youtube.com/results?search_query=lat+pulldown+form+short' },
            michael: { name: 'Dominadas (Pull-ups) lastradas o libres', description: 'El ejercicio de peso corporal definitivo para la fuerza de tracción.', sets: 4, reps: '5-8', notes: 'Rango de movimiento completo.', videoUrl: 'https://www.youtube.com/results?search_query=perfect+pullup+form+short' }
        },
        {
            id: 'B3', category: 'Empuje Vertical / Inclinado', sharedEquipment: 'Bancos / Zona de peso libre',
            lina: { name: 'Press de Hombros con mancuernas sentada', description: 'Empuje vertical estricto con peso libre para desarrollar los deltoides.', sets: 3, reps: '10-12', notes: 'No arquear excesivamente la espalda.', videoUrl: 'https://www.youtube.com/results?search_query=seated+dumbbell+shoulder+press+form+short' },
            michael: { name: 'Press Militar o Fondos en paralelas (Dips)', description: 'Fuerza pura de empuje vertical o trabajo intensivo de tríceps/pecho inferior.', sets: 4, reps: '6-8', notes: 'Control de hombros. Explosivo al subir.', videoUrl: 'https://www.youtube.com/results?search_query=barbell+overhead+press+form+short' }
        },
        {
            id: 'B4', category: 'Aislamiento Pierna', sharedEquipment: 'Máquina Extensión Cuádriceps',
            lina: { name: 'Extensión de Cuádriceps', description: 'Aislamiento en máquina para fortalecer el músculo frontal del muslo (vasto medial).', sets: 3, reps: '12-15', notes: 'Aguanta 1 segundo arriba.', videoUrl: 'https://www.youtube.com/results?search_query=leg+extension+machine+form+short' },
            michael: { name: 'Extensión de Cuádriceps', description: 'Aislamiento para hipertrofia específica del cuádriceps.', sets: 3, reps: '12-15', notes: 'Mismo equipo, máxima contracción.', videoUrl: 'https://www.youtube.com/results?search_query=leg+extension+machine+form+short' }
        },
        {
            id: 'B5', category: 'Finisher Agarre / Funcional', sharedEquipment: 'Pasillo / Kettlebells',
            lina: { name: 'Paseo del Granjero (Carga moderada)', description: 'Caminata cargando peso para mejorar fuerza de agarre y estabilidad del core.', sets: 3, reps: '30 metros', notes: 'Pecho alto, pasos cortos y firmes.', videoUrl: 'https://www.youtube.com/results?search_query=farmers+walk+form+short' },
            michael: { name: 'Turkish Get-Ups o Paseo Granjero pesado', description: 'Movimiento complejo de levantamiento desde el suelo, clave para la movilidad en BJJ.', sets: 3, reps: '3x lado / 30m', notes: 'Ideal para BJJ: Movilidad y agarre.', videoUrl: 'https://www.youtube.com/results?search_query=turkish+get+up+form+short' }
        },
        {
            id: 'B6', category: 'Vuelta a la Calma (Movilidad)', sharedEquipment: 'Colchonetas (Juntos)',
            lina: { name: 'Estiramientos Cadena Posterior', description: 'Rutina suave enfocada en la relajación de la zona lumbar y parte trasera de las piernas.', sets: 1, reps: '5-10 mins', notes: 'Sigan el video. Foco en relajar isquios y espalda baja.', videoUrl: 'https://www.youtube.com/results?search_query=lower+body+cool+down+stretches+follow+along' },
            michael: { name: 'Estiramientos Cadena Posterior', description: 'Descarga muscular para isquiotibiales y espalda baja post-peso muerto.', sets: 1, reps: '5-10 mins', notes: 'Sigan el video. Foco en relajar isquios y espalda baja.', videoUrl: 'https://www.youtube.com/results?search_query=lower+body+cool+down+stretches+follow+along' }
        }
    ],
    C: [
        {
            id: 'C0', category: 'Calentamiento General', sharedEquipment: 'Máquinas de Cardio',
            lina: { name: 'Cinta (Caminata ligera) o Elíptica', description: 'Preparación cardiovascular y articular inicial.', sets: 1, reps: '5-10 mins', notes: 'Ritmo suave para elevar la temperatura y ritmo cardíaco.', videoUrl: 'https://www.youtube.com/results?search_query=treadmill+warm+up+short' },
            michael: { name: 'Assault Bike, Remo o Cinta', description: 'Cardio ligero para elevar pulsaciones antes de cargas pesadas.', sets: 1, reps: '5-10 mins', notes: 'Ritmo moderado. Prepara las articulaciones para el peso.', videoUrl: 'https://www.youtube.com/results?search_query=assault+bike+warm+up+short' }
        },
        {
            id: 'C1', category: 'Pierna Unilateral (Estabilidad)', sharedEquipment: 'Pesas Libres / Mancuernas',
            lina: { name: 'Zancadas (Lunges) hacia atrás', description: 'Movimiento unilateral de piernas para corregir desequilibrios y mejorar estabilidad.', sets: 3, reps: '10 por pierna', notes: 'Torso recto, baja controladamente.', videoUrl: 'https://www.youtube.com/results?search_query=reverse+lunge+form+short' },
            michael: { name: 'Sentadilla Búlgara pesada', description: 'Sentadilla a una pierna con pie elevado, requiere alto equilibrio y fuerza.', sets: 3, reps: '8-10 por pierna', notes: 'Foco en el equilibrio y profundidad.', videoUrl: 'https://www.youtube.com/results?search_query=bulgarian+split+squat+form+short' }
        },
        {
            id: 'C2', category: 'Empuje Corporal (Pecho/Tríceps)', sharedEquipment: 'Colchonetas / Paralelas',
            lina: { name: 'Flexiones (Push-ups) apoyando rodillas', description: 'Empuje horizontal adaptado usando el peso corporal para fortalecer el tren superior.', sets: 3, reps: 'Al fallo (-2)', notes: 'Baja el pecho casi hasta el suelo.', videoUrl: 'https://www.youtube.com/results?search_query=knee+push+ups+form+short' },
            michael: { name: 'Fondos en paralelas o Flexiones estrictas', description: 'Trabajo de pecho y tríceps de alta exigencia calisténica.', sets: 3, reps: '10-15', notes: 'Control excéntrico. Usa lastre si es fácil.', videoUrl: 'https://www.youtube.com/results?search_query=chest+dips+form+short' }
        },
        {
            id: 'C3', category: 'Cadena Posterior (Glúteos)', sharedEquipment: 'Zona de Barras / Bancos',
            lina: { name: 'Hip Thrust con Mancuerna o Disco', description: 'El mejor ejercicio aislado para la máxima activación y desarrollo del glúteo mayor.', sets: 3, reps: '12-15', notes: 'Aprieta glúteos arriba por 2 segundos.', videoUrl: 'https://www.youtube.com/results?search_query=barbell+hip+thrust+form+short' },
            michael: { name: 'Hip Thrust pesado con Barra', description: 'Extensión de cadera con carga máxima para potenciar la fuerza base del glúteo.', sets: 3, reps: '8-10', notes: 'Máxima extensión de cadera en cada repetición.', videoUrl: 'https://www.youtube.com/results?search_query=barbell+hip+thrust+form+short' }
        },
        {
            id: 'C4', category: 'Salud Postural y Hombros', sharedEquipment: 'Estación de Poleas',
            lina: { name: 'Face Pulls en Polea', description: 'Tracción a la cara fundamental para la salud del hombro posterior y corrección postural.', sets: 3, reps: '15', notes: 'Tira hacia tu frente, separando la cuerda.', videoUrl: 'https://www.youtube.com/results?search_query=face+pull+form+short' },
            michael: { name: 'Face Pulls pesados', description: 'Movimiento compensatorio crítico para evitar la postura encorvada del BJJ.', sets: 3, reps: '12-15', notes: 'Crucial para compensar la postura encorvada de BJJ.', videoUrl: 'https://www.youtube.com/results?search_query=face+pull+form+short' }
        },
        {
            id: 'C5', category: 'Finisher Acondicionamiento', sharedEquipment: 'Máquinas de Cardio / Kettlebells',
            lina: { name: 'Caminata rápida en cinta (Inclinada)', description: 'Cardio de baja intensidad para promover el flujo sanguíneo como cierre.', sets: 1, reps: '10-15 mins', notes: 'Cardio ligero para cerrar y asimilar el trabajo.', videoUrl: 'https://www.youtube.com/results?search_query=treadmill+incline+walk+form+short' },
            michael: { name: 'Kettlebell Snatches o Remo Ergómetro', description: 'Intervalos de alta intensidad para desarrollar la capacidad anaeróbica láctica.', sets: 3, reps: '10-12 / 1 min', notes: 'Alta intensidad (HIIT) para capacidad anaeróbica.', videoUrl: 'https://www.youtube.com/results?search_query=kettlebell+snatch+form+short' }
        },
        {
            id: 'C6', category: 'Vuelta a la Calma (Movilidad)', sharedEquipment: 'Colchonetas (Juntos)',
            lina: { name: 'Yoga Flow de Recuperación', description: 'Flujo continuo de posturas de yoga para movilidad y relajación mental.', sets: 1, reps: '10 mins', notes: 'Sigan el video. Ideal para cerrar la semana de entrenamiento.', videoUrl: 'https://www.youtube.com/results?search_query=10+minute+recovery+yoga+flow+follow+along' },
            michael: { name: 'Yoga Flow de Recuperación', description: 'Recuperación activa mediante asanas de yoga enfocadas en la descompresión.', sets: 1, reps: '10 mins', notes: 'Sigan el video. Ideal para cerrar la semana de entrenamiento.', videoUrl: 'https://www.youtube.com/results?search_query=10+minute+recovery+yoga+flow+follow+along' }
        }
    ],
    D: [
        {
            id: 'D0', category: 'Calentamiento Dinámico', sharedEquipment: 'Colchonetas libres',
            lina: { name: 'Movilidad Articular Suave', description: 'Movimientos circulares para lubricar las articulaciones antes del trabajo aeróbico.', sets: 1, reps: '5 mins', notes: 'Prepara las articulaciones para el cardio continuo.', videoUrl: 'https://www.youtube.com/results?search_query=5+minute+dynamic+warm+up+short' },
            michael: { name: 'Movilidad Específica', description: 'Movimientos dinámicos para soltar tensión muscular y calentar fluidos articulares.', sets: 1, reps: '5 mins', notes: 'Rotaciones de cadera y hombros.', videoUrl: 'https://www.youtube.com/results?search_query=dynamic+warm+up+short' }
        },
        {
            id: 'D1', category: 'Trabajo Principal: Cardio Zona 2', sharedEquipment: 'Zona de Cardio',
            lina: { name: 'Cinta Inclinada o Elíptica (Zona 2)', description: 'Cardio continuo a intensidad moderada para aumentar la densidad mitocondrial y mejorar la base metabólica.', sets: 1, reps: '30-40 mins', notes: 'Ritmo conversacional. Crucial para tu salud metabólica.', videoUrl: 'https://www.youtube.com/results?search_query=zone+2+cardio+treadmill+short' },
            michael: { name: 'Remo Estático o Bicicleta (Zona 2)', description: 'Trabajo cardiovascular aeróbico para potenciar la recuperación del entrenamiento y limpiar metabolitos.', sets: 1, reps: '30-40 mins', notes: 'Recuperación activa. No pases del ritmo conversacional.', videoUrl: 'https://www.youtube.com/results?search_query=zone+2+cardio+rowing+short' }
        },
        {
            id: 'D2', category: 'Core de Estabilidad', sharedEquipment: 'Colchonetas',
            lina: { name: 'Dead Bugs', description: 'Ejercicio de control del core y disociación de extremidades protegiendo la zona lumbar.', sets: 3, reps: '10 por lado', notes: 'Mantén la espalda baja pegada al suelo.', videoUrl: 'https://www.youtube.com/results?search_query=dead+bug+exercise+form+short' },
            michael: { name: 'Plancha Lateral (Side Plank)', description: 'Trabajo isométrico intenso para la musculatura oblicua y estabilizadores laterales.', sets: 3, reps: '30s por lado', notes: 'Alineación perfecta de la columna.', videoUrl: 'https://www.youtube.com/results?search_query=side+plank+form+short' }
        },
        {
            id: 'D3', category: 'Vuelta a la Calma', sharedEquipment: 'Colchonetas',
            lina: { name: 'Estiramiento y Respiración', description: 'Técnicas de respiración diafragmática para activar el sistema nervioso parasimpático.', sets: 1, reps: '5 mins', notes: 'Relaja el sistema nervioso.', videoUrl: 'https://www.youtube.com/results?search_query=5+minute+parasympathetic+breathing+cooldown' },
            michael: { name: 'Estiramiento y Respiración', description: 'Relajación consciente para iniciar el proceso de recuperación fisiológica.', sets: 1, reps: '5 mins', notes: 'Relaja el sistema nervioso central.', videoUrl: 'https://www.youtube.com/results?search_query=5+minute+parasympathetic+breathing+cooldown' }
        }
    ]
};

export const expertTips = [
    {
        icon: 'Activity',
        title: 'Autorregulación para Michael',
        description: 'Si tuviste una sesión de sparring/rolls muy dura en BJJ la noche anterior, reduce tus series principales de 4 a 3. El BJJ genera mucho daño muscular por contracciones isométricas; no fuerces la máquina si te sientes fatigado.'
    },
    {
        icon: 'ShieldAlert',
        title: 'Nutrición Peri-entrenamiento para Lina',
        description: 'Para evitar usar el "botón de pánico" del azúcar rápido, asegúrate de consumir una combinación de carbohidratos de bajo índice glucémico y proteína unos 90 minutos antes de entrenar (ej. avena con proteína whey).'
    },
    {
        icon: 'CheckCircle',
        title: 'Sobrecarga Progresiva (Ambos)',
        description: 'Utilicen el modelo de "Doble Progresión". Si el rango es 10-12, usen un peso con el que solo puedan sacar 10. Cuando logren sacar 12 reps en todas las series con ese mismo peso, es el momento de subir la carga.'
    }
];
