export interface DayContent {
  day: number;
  title: string;
  emoji: string;
  spark: string;
  exercise: {
    title: string;
    instructions: string[];
    fields: { label: string; placeholder: string; multiline?: boolean }[];
  };
}

export interface PhaseContent {
  phase: number;
  title: string;
  subtitle: string;
  emoji: string;
  days: DayContent[];
}

export const introContent = {
  warning: "⚠️ ADVERTENCIA: No leas esto. Hazlo.",
  welcome: `Bienvenido a la plataforma de lanzamiento.

Si tienes este cuaderno en tus manos (o en tu pantalla), es porque algo dentro de ti ya hizo "clic". Has leído "EL BIG BANG DE LOS NEGOCIOS", o estás a punto de hacerlo, y entiendes la teoría: el universo premia a los creadores y castiga a los conformistas.

Pero saberlo no es suficiente.

El cementerio de los negocios está lleno de personas que sabían lo que tenían que hacer, pero nunca hicieron nada al respecto. Se quedaron orbitando sus sueños sin atreverse a aterrizar.

Este cuaderno no es para leer. Es una herramienta de trabajo sucia. Es el martillo con el que vas a romper las cadenas de tu mentalidad de empleado. Aquí no venimos a filosofar, venimos a reprogramar.`,
  howToUse: `Tienes por delante 30 días de entrenamiento intensivo. No te saltes ninguno. El proceso es acumulativo:

🔴 Fase 1 (Días 1-10): Destruiremos tu gravedad actual (miedos y excusas).
🔵 Fase 2 (Días 11-20): Construiremos el reactor (mentalidad de jefe).
🟢 Fase 3 (Días 21-30): Iniciaremos la cuenta regresiva (estrategia de salida).`,
  rules: [
    { emoji: "🎯", title: "Honestidad Brutal", description: "Nadie va a leer lo que escribas aquí excepto tú. Si te mientes en el papel, te estás robando a ti mismo. Escribe la verdad, aunque duela." },
    { emoji: "⚡", title: "Acción Imperfecta", description: "No busques la respuesta \"correcta\" o \"bonita\". Busca la respuesta visceral. Escribe rápido, sin editar." },
    { emoji: "🚀", title: "Sin pausas", description: "La inercia es la fuerza más poderosa del universo. Haz un ejercicio al día. Si paras durante 3 días, la gravedad del sistema te volverá a atrapar." }
  ],
  closing: `Estás a punto de provocar tu propio Big Bang. Va a haber ruido, va a haber calor y va a haber caos. Pero al final, habrá un nuevo universo: el tuyo.

Capitán, tome el mando. El despegue comienza en la página siguiente.`
};

export const phases: PhaseContent[] = [
  {
    phase: 1,
    title: "DESCOMPRESIÓN",
    subtitle: "Rompiendo la Gravedad del Empleado",
    emoji: "🔴",
    days: [
      {
        day: 1,
        title: "El Inventario del Vacío",
        emoji: "🌑",
        spark: `"Todo gran cambio nace de una profunda incomodidad. Antes de construir nada nuevo, debes admitir que tu situación actual ya no es sostenible. A menudo, llamamos 'zona de confort' a lo que en realidad es una 'zona de estancamiento vital'. No estás cómodo, estás anestesiado por la rutina. Para emprender, necesitas honestidad brutal: no puedes llenar tu vida de éxito si primero no vacías el espacio que ahora ocupan tus excusas. Hoy no se trata de soñar, sino de mirar a la cara a tu insatisfacción y decidir que el dolor de quedarte igual es mayor que el miedo a cambiar. Esa es la verdadera chispa de ignición."`,
        exercise: {
          title: "🔥 La Auditoría del Dolor",
          instructions: [
            "Haz una lista de 5 cosas que odias de no ser el dueño de tu tiempo (ej: pedir permiso para ir al médico, el techo salarial, aguantar a un jefe incompetente).",
            "Pregunta clave: ¿Cuánto te está costando emocionalmente seguir así un año más? Ponle un precio."
          ],
          fields: [
            { label: "1. Lo que odio:", placeholder: "Escribe lo primero que odias de tu situación actual...", multiline: true },
            { label: "2. Lo que odio:", placeholder: "Segunda cosa que te frustra...", multiline: true },
            { label: "3. Lo que odio:", placeholder: "Tercera frustración...", multiline: true },
            { label: "4. Lo que odio:", placeholder: "Cuarta situación que detestas...", multiline: true },
            { label: "5. Lo que odio:", placeholder: "Quinta cosa insoportable...", multiline: true },
            { label: "💰 Precio emocional de seguir un año más:", placeholder: "¿Cuánto vale tu paz mental, tu tiempo, tu vida?", multiline: true }
          ]
        }
      },
      {
        day: 2,
        title: "Detectando la \"Materia Oscura\"",
        emoji: "🌌",
        spark: `"Existen fuerzas invisibles que gobiernan tus decisiones sin que te des cuenta. Son guiones mentales que heredaste de tus padres, profesores o de la cultura general. Voces que susurran: 'el dinero corrompe', 'busca lo seguro', 'mejor no destacar'. Estas creencias actúan como una gravedad pesada que te mantiene pegado al suelo. No son hechos, son opiniones ajenas que has adoptado como verdades absolutas. El trabajo de hoy es cuestionar la narrativa: ¿Ese pensamiento es realmente tuyo o te lo instalaron? Si una creencia no te sirve para crecer, es hora de desinstalarla."`,
        exercise: {
          title: "🔍 El Detector de Mentiras",
          instructions: [
            "Escribe 3 frases que sueles decirte para no empezar (ej: 'No tengo tiempo', 'Ya hay mucha competencia').",
            "Al lado de cada una, escribe la VERDAD objetiva que la anula."
          ],
          fields: [
            { label: "Mentira 1:", placeholder: "Lo que te dices para no empezar...", multiline: false },
            { label: "✅ Verdad 1:", placeholder: "La realidad objetiva que la destruye...", multiline: true },
            { label: "Mentira 2:", placeholder: "Otra excusa habitual...", multiline: false },
            { label: "✅ Verdad 2:", placeholder: "El hecho real que la invalida...", multiline: true },
            { label: "Mentira 3:", placeholder: "Tu tercer autoengaño...", multiline: false },
            { label: "✅ Verdad 3:", placeholder: "La verdad que lo destruye...", multiline: true }
          ]
        }
      },
      {
        day: 3,
        title: "La Falsa Gravedad del Sueldo",
        emoji: "💰",
        spark: `"El sueldo fijo a fin de mes es, paradójicamente, una de las drogas más potentes que existen. Genera una sensación de calma inmediata, pero te vuelves frágil a largo plazo. Depender de una sola fuente de ingresos es el estado financiero más riesgoso posible; si esa fuente se corta, tu estructura de vida colapsa en un instante. El emprendedor no busca el riesgo por placer, sino que diversifica para obtener seguridad real. Entender que tu 'seguridad' actual es una ilusión es el primer paso para querer construir tu propia red de protección."`,
        exercise: {
          title: "🧮 Cálculo de Fragilidad",
          instructions: [
            "Si mañana tu jefe te despide, ¿cuántos días puedes sobrevivir con tus ahorros?",
            "Escribe en grande: 'Un sueldo no es seguridad, es sedante'. Léelo en voz alta 3 veces."
          ],
          fields: [
            { label: "Días de supervivencia con ahorros actuales:", placeholder: "Sé honesto contigo mismo...", multiline: false },
            { label: "💊 Escribe aquí el mantra:", placeholder: "UN SUELDO NO ES SEGURIDAD, ES SEDANTE", multiline: false },
            { label: "¿Cómo te sentiste al leerlo en voz alta?", placeholder: "Describe tus emociones y pensamientos...", multiline: true }
          ]
        }
      },
      {
        day: 4,
        title: "El Síndrome del Astronauta Impostor",
        emoji: "👨‍🚀",
        spark: `"Justo cuando decides avanzar, tu cerebro lanza una alerta: '¿Quién eres tú para hacer esto?'. El síndrome del impostor no es una señal de incompetencia, sino un síntoma de crecimiento. Aparece porque estás saliendo de tu territorio conocido. Tu mente intenta protegerte del ridículo social manteniéndote pequeño. La verdad es que nadie se siente 100% preparado nunca. Los expertos no son seres mitológicos sin dudas; son personas que actuaron a pesar del miedo. No necesitas saberlo todo para empezar, solo necesitas saber el siguiente paso."`,
        exercise: {
          title: "🏆 El Muro de la Evidencia",
          instructions: [
            "Escribe 5 logros difíciles que hayas obtenido en tu vida (no solo laboral: aprender un idioma, superar una crisis, ayudar a alguien).",
            "Demuéstrate a ti mismo que eres capaz de resolver problemas. Un emprendedor no es un sabio, es un 'resolvedor'."
          ],
          fields: [
            { label: "🏅 Logro 1:", placeholder: "Un logro del que estés orgulloso...", multiline: true },
            { label: "🏅 Logro 2:", placeholder: "Algo difícil que superaste...", multiline: true },
            { label: "🏅 Logro 3:", placeholder: "Una meta que alcanzaste...", multiline: true },
            { label: "🏅 Logro 4:", placeholder: "Un reto que venciste...", multiline: true },
            { label: "🏅 Logro 5:", placeholder: "Algo que pensaste imposible y lograste...", multiline: true }
          ]
        }
      },
      {
        day: 5,
        title: "El Agujero Negro del \"Qué Dirán\"",
        emoji: "🕳️",
        spark: `"El miedo a la crítica absorbe más energía y sueños que cualquier fracaso económico. Nos aterra ser juzgados por la tribu. Pero debes entender una regla universal: nadie que esté construyendo algo más grande que tú te va a criticar. Los constructores entienden la dificultad. Las críticas siempre vienen de las gradas, de aquellos que están estancados en su propia inacción y se sienten amenazados por tu movimiento. Aprende a filtrar: si esa persona no tiene la vida que tú quieres, su opinión no debería tener peso en tu plan."`,
        exercise: {
          title: "😱 El Peor Escenario",
          instructions: [
            "Imagina que lanzas tu negocio y fracasas estrepitosamente. Todos se ríen.",
            "Describe esa escena aquí mismo. Y ahora responde: ¿Te mueres? ¿Vas a la cárcel? ¿O simplemente aprendes y sigues?"
          ],
          fields: [
            { label: "🎬 Describe el peor escenario posible:", placeholder: "Imagina el fracaso total, la vergüenza, las críticas...", multiline: true },
            { label: "💀 ¿Te mueres?", placeholder: "Sí / No", multiline: false },
            { label: "🔒 ¿Vas a la cárcel?", placeholder: "Sí / No", multiline: false },
            { label: "📚 ¿O simplemente aprendes y sigues?", placeholder: "Reflexiona sobre esto...", multiline: true }
          ]
        }
      },
      {
        day: 6,
        title: "El Mito de la \"Idea Perfecta\"",
        emoji: "💡",
        spark: `"Muchos aspirantes se quedan paralizados esperando la 'idea del millón' o el momento en que los astros se alineen. Spoiler: ese momento no existe. El inicio de cualquier gran proyecto es caótico, desordenado e imperfecto. La claridad no viene de pensar, viene de actuar. Una idea mediocre ejecutada hoy vale infinitamente más que una idea brillante guardada en un cajón para 'algún día'. Deja de pulir el plan en tu cabeza y empieza a ensuciarte las manos. La acción imperfecta es el único camino hacia el progreso."`,
        exercise: {
          title: "⚡ Acción Masiva Imperfecta",
          instructions: [
            "Escribe una idea de negocio que tengas (aunque sea vaga).",
            "Escribe UNA acción minúscula que podrías hacer HOY para moverla (ej: comprar el dominio web, llamar a un posible cliente, escribir el índice de un servicio)."
          ],
          fields: [
            { label: "💭 Mi idea de negocio:", placeholder: "Describe tu idea, aunque no esté perfecta...", multiline: true },
            { label: "🎯 UNA acción que haré HOY:", placeholder: "Algo pequeño pero concreto que puedo hacer ahora mismo...", multiline: true }
          ]
        }
      },
      {
        day: 7,
        title: "Identificando Parásitos Energéticos",
        emoji: "🦠",
        spark: `"Eres el promedio de las cinco personas con las que más interactúas. Si tu entorno está compuesto por personas conformistas, quejas constantes o gente sin ambición, su gravedad te arrastrará hacia abajo inevitablemente. No se trata de dejar de querer a tus amigos o familia, se trata de proteger tu energía creativa. Necesitas rodearte, aunque sea virtualmente (libros, podcasts, mentores), de personas que ya están donde tú quieres llegar. Si eres la persona más inteligente o ambiciosa de la habitación, estás en la habitación equivocada."`,
        exercise: {
          title: "🗺️ El Mapa Estelar de Relaciones",
          instructions: [
            "Dibuja un círculo contigo en el centro.",
            "Pon los nombres de tus amigos/familia cerca o lejos según cuánto influyen en ti.",
            "Marca con un (-) los que te dicen 've a lo seguro' y con un (+) los que te dicen 'arriésgate'."
          ],
          fields: [
            { label: "Personas con influencia (+) positiva:", placeholder: "Quiénes te impulsan a crecer...", multiline: true },
            { label: "Personas con influencia (-) negativa:", placeholder: "Quiénes te frenan o desaniman...", multiline: true },
            { label: "🤔 ¿Necesitas cambiar de galaxia?", placeholder: "Reflexiona sobre tu círculo de influencia...", multiline: true }
          ]
        }
      },
      {
        day: 8,
        title: "Redefiniendo al \"Jefe\"",
        emoji: "👔",
        spark: `"Todos odiamos recibir órdenes, pero pocos saben dárselas a sí mismos. Queremos la libertad del emprendedor ('hacer lo que quiera'), pero olvidamos la responsabilidad que conlleva. Ser tu propio jefe significa ser el líder más exigente y justo que jamás hayas tenido. Significa trabajar cuando nadie te mira, cumplir los plazos aunque nadie te los reclame y levantarte cuando no tienes ganas. La verdadera libertad no es la ausencia de disciplina, es la autodisciplina elegida. Si no puedes gobernarte a ti mismo, el mercado te gobernará."`,
        exercise: {
          title: "📝 El Contrato de Identidad",
          instructions: [
            "Describe a tu 'Yo Jefe'. ¿A qué hora se levanta? ¿Cómo se ve? ¿Cómo reacciona ante un problema?",
            "Desde mañana, empieza a actuar como él, aunque sigas en tu empleo actual."
          ],
          fields: [
            { label: "⏰ ¿A qué hora se levanta mi Yo Jefe?", placeholder: "Hora exacta...", multiline: false },
            { label: "👀 ¿Cómo se ve? (vestimenta, postura, actitud)", placeholder: "Descríbelo en detalle...", multiline: true },
            { label: "💪 ¿Cómo reacciona ante un problema?", placeholder: "Su mentalidad ante los obstáculos...", multiline: true },
            { label: "📋 ¿Qué hábitos tiene?", placeholder: "Sus rutinas de éxito...", multiline: true }
          ]
        }
      },
      {
        day: 9,
        title: "El Combustible del \"Por Qué\"",
        emoji: "🔥",
        spark: `"El dinero es la gasolina del vehículo, es indispensable para avanzar, pero no es el motor ni el destino. Cuando lleguen las dificultades —y llegarán—, el deseo de 'ganar más dinero' rara vez es suficiente para no rendirse. Necesitas un propósito más profundo, algo nuclear. ¿Lo haces por libertad de tiempo? ¿Para dejar un legado a tus hijos? ¿Por el desafío intelectual? Encuentra esa razón visceral que te hará levantarte de la cama cuando los resultados financieros tarden en llegar. Ese es tu verdadero motor."`,
        exercise: {
          title: "🔬 Los 5 Niveles del Porqué",
          instructions: [
            "Quiero emprender. ¿Por qué? (Respuesta superficial).",
            "¿Por qué quiero eso? (Profundiza).",
            "¿Y por qué eso es importante?",
            "(Sigue bajando hasta encontrar la razón emocional real que te hará llorar o gritar)."
          ],
          fields: [
            { label: "Nivel 1 - ¿Por qué quiero emprender?", placeholder: "Tu primera respuesta...", multiline: true },
            { label: "Nivel 2 - ¿Por qué quiero eso?", placeholder: "Profundiza más...", multiline: true },
            { label: "Nivel 3 - ¿Y por qué eso es importante?", placeholder: "Sigue cavando...", multiline: true },
            { label: "Nivel 4 - ¿Por qué eso me importa tanto?", placeholder: "Acércate a la raíz...", multiline: true },
            { label: "Nivel 5 - ¿Cuál es la razón nuclear?", placeholder: "La verdad emocional profunda...", multiline: true }
          ]
        }
      },
      {
        day: 10,
        title: "La Cuenta Regresiva (Compromiso)",
        emoji: "🚀",
        spark: `"Has pasado diez días limpiando basura mental, identificando miedos y entendiendo el terreno. Ahora llegas al punto de inflexión. No puedes ser un 'turista' en el mundo del emprendimiento; los turistas solo miran y se van cuando llueve. Debes comprometerte. Hoy decide que esto no es un hobby ni un 'vamos a ver qué pasa'. Hoy decide que vas a hacer que funcione, independientemente del tiempo que tome. Estás en la plataforma de lanzamiento: o enciendes los motores con todo lo que tienes, o te bajas de la nave. No hay puntos medios."`,
        exercise: {
          title: "📜 La Declaración de Independencia",
          instructions: [
            "Redacta una carta de renuncia (ficticia o real, pero con fecha futura) a tu 'Yo Empleado'.",
            "Escribe la declaración formal y fírmala."
          ],
          fields: [
            { label: "📅 Fecha de esta declaración:", placeholder: "Fecha de hoy...", multiline: false },
            { label: "✍️ Mi Declaración de Independencia:", placeholder: "Yo, [Tu Nombre], declaro que a partir de hoy dejo de pensar como un subordinado. Asumo la responsabilidad total de mi destino económico y emocional. El Big Bang ha comenzado.", multiline: true },
            { label: "🖊️ Firma:", placeholder: "Tu nombre completo", multiline: false }
          ]
        }
      }
    ]
  },
  {
    phase: 2,
    title: "FORMACIÓN ESTELAR",
    subtitle: "La Mentalidad del Creador",
    emoji: "🔵",
    days: [
      {
        day: 11,
        title: "El Tiempo NO es Dinero (Es Vida)",
        emoji: "⏰",
        spark: `"Nos han educado en la ecuación del empleado: te pagan por horas sentadas o por mes trabajado. Como emprendedor, esa ecuación es una trampa mortal. Debes cambiar el chip a: Valor = Dinero. No importa si tardas 10 minutos o 10 horas; si resuelves un problema grande, la recompensa es grande. Deja de vender tu calendario y empieza a vender resultados y soluciones. Tu objetivo es desconectar tus ingresos de tu presencia física. El tiempo es tu activo más escaso e irrecuperable; no lo vendas al por mayor, inviértelo en crear sistemas."`,
        exercise: {
          title: "📊 La Calculadora de Impacto",
          instructions: [
            "Identifica una tarea que haces actualmente que consume mucho tiempo pero aporta poco valor.",
            "Identifica una tarea que, si la hicieras bien una sola vez, te seguiría dando beneficios por meses.",
            "Comprométete a eliminar una hora de lo primero para dársela a lo segundo."
          ],
          fields: [
            { label: "⏳ Tarea que consume tiempo pero aporta poco:", placeholder: "Algo que haces mucho pero no te acerca a tus metas...", multiline: true },
            { label: "💎 Tarea de alto impacto a largo plazo:", placeholder: "Algo que si haces bien hoy, te beneficiará meses...", multiline: true },
            { label: "🔄 Mi compromiso de intercambio:", placeholder: "Voy a eliminar X horas de la primera para dárselas a la segunda...", multiline: true }
          ]
        }
      },
      {
        day: 12,
        title: "Sanando la Relación con el Dinero",
        emoji: "💸",
        spark: `"Muchos emprendedores tienen un 'termostato financiero' bajo; sienten culpa al cobrar o creen inconscientemente que vender es 'molestar'. En los negocios, el dinero es neutro: es simplemente una herramienta de intercambio de valor y energía. Si tu proyecto no es rentable, no podrás sostenerlo y dejarás de ayudar a la gente. Cobrar bien por un buen trabajo no es avaricia, es un deber moral para garantizar que puedes seguir sirviendo con excelencia. Quítale la carga emocional al dinero y empieza a tratarlo como lo que es: un indicador de salud de tu negocio."`,
        exercise: {
          title: "💌 La Carta de Cobro Mental",
          instructions: [
            "Escribe una cifra que te parece 'escandalosa' ganar al mes.",
            "Ahora, escribe 10 cosas buenas que harías con ese dinero.",
            "Transforma la culpa en propósito."
          ],
          fields: [
            { label: "💰 Cifra 'escandalosa' mensual:", placeholder: "Un número que te da vértigo escribir...", multiline: false },
            { label: "✨ 10 cosas buenas que haría con ese dinero:", placeholder: "1. Donar a...\n2. Invertir en...\n3. Crear empleo para...\n4. Cuidar a mi familia...\n5. etc.", multiline: true },
            { label: "🎯 Mi nuevo mantra:", placeholder: "Ganar X cantidad es mi obligación para poder impactar al mundo porque...", multiline: true }
          ]
        }
      },
      {
        day: 13,
        title: "El Fracaso como Dato (Científico)",
        emoji: "🔬",
        spark: `"En el sistema escolar nos enseñaron que el error se castiga con una mala nota y vergüenza. En el emprendimiento, el error es el precio de la matrícula. Tienes que despersonalizar el fracaso. Si lanzas una oferta y nadie compra, no significa que 'tú no vales', significa que 'la oferta no encaja'. Es un dato. El mercado te está dando comentarios valiosos para que ajustes el rumbo. Adopta la mentalidad del científico: prueba, observa el resultado, ajusta y vuelve a probar. El fracaso no es lo contrario al éxito, es parte del proceso de construcción."`,
        exercise: {
          title: "🧪 La Bitácora de Laboratorio",
          instructions: [
            "Recuerda tu último 'error' o 'vergüenza'.",
            "Tacha mentalmente la palabra 'Error' y escribe 'Hipótesis no validada'.",
            "Escribe qué aprendiste exactamente de eso."
          ],
          fields: [
            { label: "❌ Mi último 'error':", placeholder: "Describe algo que salió mal...", multiline: true },
            { label: "🔄 Reencuadre: 'Hipótesis no validada':", placeholder: "Reformúlalo como un experimento científico...", multiline: true },
            { label: "📚 Lo que aprendí exactamente:", placeholder: "Qué información valiosa obtuve que me evitará errores futuros...", multiline: true }
          ]
        }
      },
      {
        day: 14,
        title: "Vencer la Parálisis por Análisis",
        emoji: "🎯",
        spark: `"El perfeccionismo es miedo con zapatos caros. Queremos tener todo controlado, la web perfecta, el logo ideal, antes de salir al mundo. Pero el mercado es dinámico y caótico. La velocidad de implementación es mucho más importante que la perfección inicial. Es mejor un producto imperfecto en el mercado hoy, aprendiendo de clientes reales, que un producto 'perfecto' en tu mente para siempre. La parálisis por análisis es una forma sofisticada de procrastinación. Lanza lo que tengas, y mejóralo por el camino."`,
        exercise: {
          title: "⚡ La Regla del 70%",
          instructions: [
            "Piensa en una decisión que estás postergando porque 'te falta información'.",
            "Si tienes el 70% de la certeza o de la información necesaria, actúa YA.",
            "Escribe esa decisión y toma la primera medida hoy mismo."
          ],
          fields: [
            { label: "🤔 Decisión que estoy postergando:", placeholder: "Algo que debería decidir pero no lo hago...", multiline: true },
            { label: "📊 ¿Tengo el 70% de la información?", placeholder: "Sí / No - y por qué", multiline: false },
            { label: "🎬 Mi primera acción HOY:", placeholder: "Lo que voy a hacer ahora mismo...", multiline: true }
          ]
        }
      },
      {
        day: 15,
        title: "Vender es Servir (Adiós a la Timidez)",
        emoji: "🤝",
        spark: `"'No me gusta vender, yo solo quiero crear'. Error grave. Si has creado algo que soluciona un dolor real, tienes la responsabilidad ética de ofrecerlo. La venta no es engañar a nadie, es el acto de conectar tu solución con la persona que la necesita. La timidez al vender suele ser vanidad disfrazada: estás más preocupado por cómo te ves tú o qué pensarán de ti, que por ayudar al cliente. Cambia el enfoque: no estás 'pidiendo' dinero, estás ofreciendo una transformación. Vender es el acto de servicio definitivo."`,
        exercise: {
          title: "💡 El Reencuadre de la Venta",
          instructions: [
            "Describe el problema doloroso que tiene tu cliente ideal.",
            "Describe cómo se siente tu cliente DESPUÉS de usar tu producto.",
            "Repite y escribe: 'Si no vendo, les privo de esta solución'."
          ],
          fields: [
            { label: "😰 El dolor de mi cliente ideal:", placeholder: "Qué problema tiene, cómo le afecta...", multiline: true },
            { label: "😊 Cómo se siente DESPUÉS de usar mi solución:", placeholder: "La transformación que experimenta...", multiline: true },
            { label: "💪 Mi nuevo mantra de ventas:", placeholder: "Si no vendo, les privo de esta solución porque...", multiline: true }
          ]
        }
      },
      {
        day: 16,
        title: "De Consumidor a Productor",
        emoji: "🏭",
        spark: `"La sociedad se divide en un 99% de consumidores y un 1% de productores. Pasamos la vida consumiendo contenido, series, productos y opiniones de otros. Para tomar el control, debes cambiar de bando. Cada vez que sientas el impulso de distraer tu mente consumiendo algo, usa esa energía para producir. Escribe un post, contacta a un cliente, diseña una hoja de ruta. El productor crea valor; el consumidor gasta valor. Entrena tu cerebro para que la creación sea tu estado natural y el consumo sea solo tu descanso."`,
        exercise: {
          title: "🍽️ La Dieta de Creación",
          instructions: [
            "Por cada hora de contenido que consumes hoy (redes sociales, TV), debes obligarte a producir 30 minutos de algo relacionado con tu negocio.",
            "Mantén la relación 2:1 para favorecer la producción."
          ],
          fields: [
            { label: "⏱️ Horas de consumo hoy:", placeholder: "Sé honesto con el tiempo en redes, TV, etc.", multiline: false },
            { label: "✍️ Minutos de producción hoy:", placeholder: "Tiempo dedicado a crear, escribir, construir...", multiline: false },
            { label: "📝 ¿Qué voy a producir hoy?", placeholder: "Algo concreto relacionado con mi negocio...", multiline: true }
          ]
        }
      },
      {
        day: 17,
        title: "La Soledad del Mando (Autoliderazgo)",
        emoji: "🧭",
        spark: `"Cuando eres el jefe, nadie te aplaude por llegar puntual ni te felicita por enviar los correos. Nadie te dice qué hacer cada mañana. Esa libertad puede sentirse como un vacío frío y solitario si no estás preparado. Debes aprender a ser tu propio mentor y tu propio sistema de soporte. No busques validación externa constante, porque rara vez llegará. Aprende a encontrar satisfacción en el trabajo bien hecho y en tus propios avances. La soledad del mando es el precio de la independencia; abrázala y úsala para conocerte mejor."`,
        exercise: {
          title: "👥 La Reunión de Junta Unipersonal",
          instructions: [
            "Agenda una reunión contigo mismo de 10 minutos hoy.",
            "Habla contigo en tercera persona: 'A ver, [Tu Nombre], ¿qué hemos logrado hoy? ¿En qué estamos fallando?'.",
            "Escribe las conclusiones. Sé brutalmente honesto, pero constructivo."
          ],
          fields: [
            { label: "📅 Fecha y hora de mi reunión:", placeholder: "Cuándo te reunirás contigo mismo...", multiline: false },
            { label: "✅ ¿Qué hemos logrado?", placeholder: "Hablando en tercera persona sobre tus avances...", multiline: true },
            { label: "⚠️ ¿En qué estamos fallando?", placeholder: "Áreas de mejora identificadas...", multiline: true },
            { label: "🎯 Próximos pasos:", placeholder: "Acciones concretas a tomar...", multiline: true }
          ]
        }
      },
      {
        day: 18,
        title: "El Superpoder del \"NO\"",
        emoji: "🛡️",
        spark: `"Al principio, el instinto es decir 'sí' a todo por miedo a perder oportunidades. Pero para crecer, necesitas un enfoque láser. Cada vez que dices 'sí' a un compromiso irrelevante, a un cliente tóxico o a una tarea menor, estás diciendo 'no' a tu objetivo principal. Tu tiempo y tu atención son limitados. Debes convertirte en un guardián feroz de tu agenda. El éxito no viene de hacer más cosas, sino de hacer menos cosas, pero las correctas, con mayor intensidad. Aprender a decir 'no' es la herramienta de productividad más potente."`,
        exercise: {
          title: "✂️ La Poda Selectiva",
          instructions: [
            "Identifica 3 compromisos, personas o actividades que te drenan energía y no te dan retorno.",
            "Planea cómo vas a decirles 'NO' o eliminarlos de tu vida esta semana."
          ],
          fields: [
            { label: "🚫 Compromiso/persona/actividad 1:", placeholder: "Algo que drena tu energía...", multiline: true },
            { label: "🚫 Compromiso/persona/actividad 2:", placeholder: "Otro drenador de energía...", multiline: true },
            { label: "🚫 Compromiso/persona/actividad 3:", placeholder: "Tercer elemento a eliminar...", multiline: true },
            { label: "📋 Mi plan para decir NO:", placeholder: "Cómo y cuándo les comunicaré mi decisión...", multiline: true }
          ]
        }
      },
      {
        day: 19,
        title: "Tolerancia a la Incertidumbre (Surfear el Caos)",
        emoji: "🌊",
        spark: `"El empleado sabe que cobrará el día 30, pase lo que pase. El emprendedor debe aprender a vivir sin esa certeza. Al principio, no sabes si cobrarás, ni cuánto. Esa incertidumbre puede generar ansiedad paralizante o adrenalina creativa; tú eliges cómo procesarlo. Entiende que la seguridad laboral es una ilusión moderna. La única seguridad real es tu capacidad para resolver problemas y generar valor en cualquier circunstancia. Aprende a surfear el caos en lugar de resistirte a él. La adaptabilidad es tu nuevo sueldo fijo."`,
        exercise: {
          title: "🏄 El Mantra de la Ola",
          instructions: [
            "Visualízate en el mar. Viene una ola gigante (un problema imprevisto). En lugar de intentar frenarla, imagina que tomas una tabla y la surfeas.",
            "Escribe en grande: 'No busco certeza, busco oportunidad'."
          ],
          fields: [
            { label: "🌊 Visualización: La ola que viene:", placeholder: "Describe el problema/incertidumbre que enfrentas...", multiline: true },
            { label: "🏄 Cómo voy a surfearla:", placeholder: "Mi estrategia para convertir el problema en oportunidad...", multiline: true },
            { label: "💎 Mi mantra:", placeholder: "NO BUSCO CERTEZA, BUSCO OPORTUNIDAD", multiline: false }
          ]
        }
      },
      {
        day: 20,
        title: "Tu Marca Personal es tu Campo Gravitatorio",
        emoji: "🧲",
        spark: `"En un mercado saturado, necesitas una fuerza que atraiga las oportunidades hacia ti para no tener que perseguirlas siempre. Esa fuerza es tu Marca Personal. No se trata de logos, sino de reputación: quién eres, qué defiendes y, sobre todo, contra qué luchas. Si intentas agradar a todo el mundo, serás irrelevante. No tengas miedo de polarizar. Sé auténtico con tus valores y opiniones. La gente conecta con personas reales, no con corporaciones grises. Tu historia y tu voz son lo único que la competencia no puede copiar."`,
        exercise: {
          title: "📜 El Manifiesto",
          instructions: [
            "Escribe 3 cosas que tu marca/negocio defiende a muerte.",
            "Escribe 3 cosas que tu marca/negocio odia o combate."
          ],
          fields: [
            { label: "💪 Defiendo 1:", placeholder: "Un valor o principio innegociable...", multiline: true },
            { label: "💪 Defiendo 2:", placeholder: "Otro valor central de tu marca...", multiline: true },
            { label: "💪 Defiendo 3:", placeholder: "Tercer pilar de tu identidad...", multiline: true },
            { label: "⚔️ Combato 1:", placeholder: "Algo que odias y contra lo que luchas...", multiline: true },
            { label: "⚔️ Combato 2:", placeholder: "Otro enemigo de tu marca...", multiline: true },
            { label: "⚔️ Combato 3:", placeholder: "Tercer problema que quieres erradicar...", multiline: true }
          ]
        }
      }
    ]
  },
  {
    phase: 3,
    title: "EXPANSIÓN ACELERADA",
    subtitle: "El Protocolo de Salida",
    emoji: "🟢",
    days: [
      {
        day: 21,
        title: "El Prototipo Galáctico (MVP)",
        emoji: "🛸",
        spark: `"No necesitas construir la 'Estrella de la Muerte' completa para empezar. Muchos proyectos mueren por sobrecostes y retrasos antes de ver la luz. Lo que necesitas es un Producto Mínimo Viable (MVP). Es la versión más simple y económica de tu idea que, sin embargo, funciona y aporta valor. Pregúntate: ¿Cuál es la forma más rápida de resolver el problema del cliente hoy mismo? Lanza el prototipo, recoge feedback real y evoluciona el producto con el cliente, no para el cliente. Ahorra tiempo, dinero y frustración."`,
        exercise: {
          title: "🎯 Simplificación Radical",
          instructions: [
            "Toma tu idea de negocio. Quítale todo lo 'bonito' (logo, web compleja, oficina). Quédate solo con el núcleo.",
            "Define tu oferta en una frase: 'Ayudo a [Persona] a lograr [Resultado] mediante [Tu Método]'."
          ],
          fields: [
            { label: "🧹 Mi idea sin adornos:", placeholder: "El núcleo puro de lo que ofrezco...", multiline: true },
            { label: "📝 Mi oferta en una frase:", placeholder: "Ayudo a [Persona] a lograr [Resultado] mediante [Tu Método]", multiline: true }
          ]
        }
      },
      {
        day: 22,
        title: "Primer Contacto (Validación)",
        emoji: "👽",
        spark: `"Tu negocio es una alucinación colectiva hasta que alguien saca su tarjeta de crédito y paga. Los 'likes', los comentarios de 'qué buena idea' y los ánimos de amigos no son validación. El dinero es la única prueba de validación honesta, porque implica sacrificio por parte del cliente. Sal al mercado cuanto antes. Busca el 'NO' cien veces si es necesario, porque tu objetivo es encontrar qué es lo que la gente realmente valora, no lo que dicen valorar. La primera venta rompe la barrera psicológica: ahora es real."`,
        exercise: {
          title: "🎯 La Cacería de Beta-Testers",
          instructions: [
            "Lista a 5 personas que encajen con tu perfil de cliente para contactar.",
            "No les vendas, pídeles consejo: 'Estoy creando esto para resolver X problema, ¿te serviría algo así?'.",
            "Si dicen que sí, haz la pregunta mágica: '¿Lo comprarías ahora si te hago un descuento de fundador?'"
          ],
          fields: [
            { label: "👤 Beta-tester 1:", placeholder: "Nombre y cómo contactarlo...", multiline: false },
            { label: "👤 Beta-tester 2:", placeholder: "Nombre y cómo contactarlo...", multiline: false },
            { label: "👤 Beta-tester 3:", placeholder: "Nombre y cómo contactarlo...", multiline: false },
            { label: "👤 Beta-tester 4:", placeholder: "Nombre y cómo contactarlo...", multiline: false },
            { label: "👤 Beta-tester 5:", placeholder: "Nombre y cómo contactarlo...", multiline: false },
            { label: "📊 Respuestas obtenidas:", placeholder: "Registra sus respuestas aquí...", multiline: true }
          ]
        }
      },
      {
        day: 23,
        title: "Reservas de Oxígeno (Finanzas de Guerra)",
        emoji: "💨",
        spark: `"Emprender sin calculadora es suicidio. Antes de dejar tu trabajo o invertir a lo grande, necesitas conocer tu 'Número de Libertad': la cantidad exacta y mínima de dinero que necesitas para cubrir techo y comida sin lujos. No te lanzas al vacío sin paracaídas. Acumula un fondo de maniobra (6 meses de gastos es lo ideal) o asegúrate de que tu negocio paralelo ya cubre al menos el 50% de tus necesidades básicas. La desesperación financiera huele a distancia y ahuyenta a los clientes. Necesitas tranquilidad mental para tomar buenas decisiones estratégicas."`,
        exercise: {
          title: "🧮 Cálculo de Supervivencia",
          instructions: [
            "Suma tus gastos fijos IMPRESCINDIBLES mensuales.",
            "Revisa tus ahorros. ¿Cuántos meses de 'libertad' tienes cubiertos?",
            "Meta: No renuncies a tu empleo hasta tener al menos 6 meses de oxígeno o que tu negocio ya cubre el 50% de tus gastos."
          ],
          fields: [
            { label: "💵 Gastos fijos mensuales imprescindibles:", placeholder: "Suma total de alquiler, comida, servicios básicos...", multiline: false },
            { label: "🏦 Ahorros actuales:", placeholder: "Total en tu cuenta de emergencia...", multiline: false },
            { label: "📅 Meses de libertad cubiertos:", placeholder: "Ahorros ÷ Gastos mensuales = ...", multiline: false },
            { label: "🎯 Mi plan para llegar a 6 meses:", placeholder: "Estrategia para aumentar mi fondo de maniobra...", multiline: true }
          ]
        }
      },
      {
        day: 24,
        title: "Construyendo la Flota (Networking)",
        emoji: "🚀",
        spark: `"El mito del emprendedor solitario en un garaje es peligroso. En el vacío, nadie te oye gritar... a menos que tengas radio. Necesitas aliados. No busques necesariamente socios para repartir acciones, busca 'compañeros de viaje': otros emprendedores que entiendan tu locura, que estén en tu misma fase o un paso por delante. Únete a comunidades, asiste a eventos, conecta en redes. Tu red de contactos es tu red de seguridad y tu mayor acelerador. A veces, una sola conversación de 10 minutos te ahorra 10 meses de errores."`,
        exercise: {
          title: "📡 Radar de Aliados",
          instructions: [
            "Busca en LinkedIn, Instagram o grupos locales a 3 personas que estén un paso por delante de ti.",
            "Escribe sus nombres y cómo vas a interactuar con su contenido para aportar valor esta semana."
          ],
          fields: [
            { label: "🎯 Aliado 1:", placeholder: "Nombre y dónde lo encontraste...", multiline: false },
            { label: "📝 Cómo aportaré valor:", placeholder: "Comentar, compartir, ofrecer ayuda...", multiline: true },
            { label: "🎯 Aliado 2:", placeholder: "Nombre y dónde lo encontraste...", multiline: false },
            { label: "📝 Cómo aportaré valor:", placeholder: "Mi estrategia de acercamiento...", multiline: true },
            { label: "🎯 Aliado 3:", placeholder: "Nombre y dónde lo encontraste...", multiline: false },
            { label: "📝 Cómo aportaré valor:", placeholder: "Cómo construiré la relación...", multiline: true }
          ]
        }
      },
      {
        day: 25,
        title: "El Precio de tu Energía",
        emoji: "💎",
        spark: `"Poner precio a tu trabajo es una de las barreras psicológicas más duras. Si cobras barato por miedo a perder ventas, atraerás clientes problemáticos que no valoran tu tiempo y te quemarás rápidamente. El precio es una herramienta de posicionamiento: comunica la calidad de lo que ofreces. Si cobras por valor, atraes compromiso. No compitas por precio (siempre habrá alguien más barato), compite por diferenciación y resultados. Sube tus precios hasta que te dé un poco de miedo decirlos; ahí suele estar el precio justo."`,
        exercise: {
          title: "📈 La Escalera de Valor",
          instructions: [
            "Define el precio de tu producto/servicio.",
            "Ahora auméntalo un 20%. (Te dará miedo, hazlo igual).",
            "Escribe 3 razones por las que tu producto vale ese precio aumentado."
          ],
          fields: [
            { label: "💰 Precio actual:", placeholder: "Lo que cobras ahora...", multiline: false },
            { label: "💰 Precio +20%:", placeholder: "El nuevo precio que te da miedo...", multiline: false },
            { label: "💪 Razón 1 por la que lo vale:", placeholder: "Ahorro de tiempo...", multiline: true },
            { label: "💪 Razón 2 por la que lo vale:", placeholder: "Paz mental...", multiline: true },
            { label: "💪 Razón 3 por la que lo vale:", placeholder: "Resultados rápidos...", multiline: true }
          ]
        }
      },
      {
        day: 26,
        title: "Automatizando la Nave (Sistematización)",
        emoji: "⚙️",
        spark: `"Si tú tienes que hacerlo todo para que el negocio funcione, no tienes un negocio, tienes un autoempleo esclavo. Desde el día uno, piensa como si fueras a franquiciar tu proyecto. Documenta tus procesos. Crea plantillas para los correos repetitivos. Usa herramientas digitales para agendar y facturar. El objetivo es ser el Capitán que dirige el rumbo, no el mecánico que aprieta cada tornillo. Lo que se hace más de dos veces, se debe sistematizar. Tu libertad depende de qué tan bien funcione la máquina sin ti."`,
        exercise: {
          title: "📋 El Manual de Operaciones",
          instructions: [
            "Elige una tarea repetitiva (ej: enviar presupuesto, publicar en redes).",
            "Escribe el paso a paso exacto (Checklist) para que, en el futuro, puedas delegarlo a otra persona o a un software."
          ],
          fields: [
            { label: "🔄 Tarea repetitiva elegida:", placeholder: "Algo que haces frecuentemente...", multiline: false },
            { label: "📝 Paso a paso (Checklist):", placeholder: "1. Hacer X\n2. Luego Y\n3. Verificar Z\n4. Enviar a...", multiline: true }
          ]
        }
      },
      {
        day: 27,
        title: "Escudos Deflectores (Gestión del Entorno)",
        emoji: "🛡️",
        spark: `"Cuando anuncies tu 'Big Bang' y comiences a cambiar, prepárate para los impactos. 'Estás loco', 'hay crisis', '¿y la jubilación?'. El entorno intentará devolverte al promedio por miedo a perderte o por envidia inconsciente. Necesitas activar tus escudos mentales. No intentes convencer a quien no quiere ver las posibilidades; gastarás energía inútilmente. Sonríe, agradece la preocupación y sigue trabajando. Protege tu visión con celo. Tu éxito será la única explicación que necesitarán en el futuro."`,
        exercise: {
          title: "🗣️ El Guión de Defensa",
          instructions: [
            "Escribe una respuesta corta y elegante para los críticos.",
            "Úsala como un robot cuando te ataquen."
          ],
          fields: [
            { label: "💬 Mi respuesta elegante:", placeholder: "Agradezco tu preocupación, pero he evaluado los riesgos y prefiero arrepentirme de lo que hice que de lo que no me atreví a hacer.", multiline: true },
            { label: "🧘 Cómo mantendré la calma:", placeholder: "Estrategias para no engancharme en discusiones...", multiline: true }
          ]
        }
      },
      {
        day: 28,
        title: "Coordenadas de Navegación (Plan a 90 días)",
        emoji: "🗺️",
        spark: `"Mirar al infinito del largo plazo marea y paraliza. Mirar solo tus pies no te deja avanzar con dirección. El secreto de la productividad es el horizonte de 90 días (un trimestre). Es tiempo suficiente para lograr cambios tangibles y proyectos complejos, pero lo bastante corto para mantener el sentido de urgencia. Define 3 grandes objetivos para los próximos 3 meses y rompe todo en tareas semanales. Olvida el plan a 5 años por ahora; enfócate en ganar el trimestre. La ejecución diaria vence a la planificación eterna."`,
        exercise: {
          title: "🎯 La Tríada de Objetivos",
          instructions: [
            "Define solo 3 objetivos para los próximos 90 días y pégalos en tu espejo."
          ],
          fields: [
            { label: "💰 Objetivo Financiero (Facturar X):", placeholder: "Meta de ingresos para los próximos 90 días...", multiline: true },
            { label: "📦 Objetivo de Producto (Lanzar Y):", placeholder: "Qué producto/servicio lanzarás...", multiline: true },
            { label: "📣 Objetivo de Marketing (Conseguir Z leads):", placeholder: "Meta de captación de clientes potenciales...", multiline: true }
          ]
        }
      },
      {
        day: 29,
        title: "Quemando las Naves",
        emoji: "🔥",
        spark: `"Cuenta la leyenda que Hernán Cortés quemó sus barcos al llegar a tierra para que sus soldados no tuvieran la tentación de retirarse. Solo quedaba vencer o morir. A veces, en el emprendimiento, necesitas crear un 'punto de no retorno'. Puede ser anunciar tu fecha de renuncia, invertir en un programa costoso o hacer una promesa pública. Cuando eliminas la opción de retroceder a tu vida anterior, tu cerebro deja de buscar excusas y empieza a buscar soluciones desesperadamente. La necesidad agudiza el ingenio como nada más."`,
        exercise: {
          title: "⚡ El Compromiso Irreversible",
          instructions: [
            "Haz algo que te comprometa públicamente o financieramente.",
            "Compra el dominio web, paga una mentoría cara, o anuncia en redes sociales la fecha exacta de tu lanzamiento.",
            "Haz que retroceder sea vergonzoso."
          ],
          fields: [
            { label: "🔥 Mi compromiso irreversible:", placeholder: "Lo que haré HOY para quemar mis naves...", multiline: true },
            { label: "📅 Fecha límite:", placeholder: "Cuándo lo habré completado...", multiline: false },
            { label: "👥 A quién se lo anunciaré:", placeholder: "Personas ante las que me comprometeré públicamente...", multiline: true }
          ]
        }
      },
      {
        day: 30,
        title: "IGNICIÓN (El Big Bang)",
        emoji: "💥",
        spark: `"La preparación ha terminado. Ya has leído, has planeado y has reflexionado. Ahora llega la verdad. T-Menos 0. Desde hoy, deja de ser un 'aspirante' o alguien que 'lo está intentando'. Asume la identidad: eres un EMPRENDEDOR, tengas o no los resultados todavía. La identidad va primero, la realidad la sigue. No hay un diploma que te entreguen; te lo otorgas tú mismo con tu primera acción valiente. Cierra este libro. El mapa no es el territorio. Sal ahí fuera y empieza a construir tu universo."`,
        exercise: {
          title: "🚀 El Ritual de Despegue",
          instructions: [
            "Busca un momento a solas.",
            "Lee tu 'Contrato de Identidad' del Día 8.",
            "Cierra el cuaderno.",
            "Haz la primera acción real de tu Plan de 90 días.",
            "Bienvenido al universo de los que crean su propia realidad."
          ],
          fields: [
            { label: "📜 Mi contrato de identidad (del Día 8):", placeholder: "Copia aquí tu contrato de identidad...", multiline: true },
            { label: "🎬 Mi primera acción REAL hoy:", placeholder: "La acción concreta que tomaré ahora mismo...", multiline: true },
            { label: "✍️ Firma del Capitán:", placeholder: "Tu nombre - Fecha de ignición", multiline: false }
          ]
        }
      }
    ]
  }
];

export const conclusionContent = {
  title: "FIN DE LA SIMULACIÓN. INICIO DE LA MISIÓN.",
  content: `Respira por un momento. Respiración profunda.

Hace 30 días eras una persona con una idea vaga y mil miedos concretos. Hoy tienes un mapa, una mentalidad afilada y, lo más importante, una nueva identidad. Has llenado estas páginas con tus verdades, tus ambiciones y tus estrategias. Lo que tienes en este cuaderno vale más que cualquier teoría, porque es un plan trazado por ti y para ti.

Pero debo decirte la verdad final: **Planificar no es ejecutar.**

El papel aguanta todo, pero el mercado no. Ahora toca la parte difícil, la parte sucia, la parte real. Ahora toca salir de la simulación, recibir los golpes, ajustar el rumbo y seguir avanzando. No busques la perfección, busca el progreso.

**Bienvenido al universo de los que crean su propia realidad. Buen viaje, capitán.**`
};
