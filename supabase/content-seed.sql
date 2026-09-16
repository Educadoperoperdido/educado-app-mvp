-- ============================================================
-- Contenido real de "Educado, Pero Perdido" para lessons y journal_prompts
-- Ejecuta esto en el SQL Editor de Supabase DESPUÉS de schema.sql
-- ============================================================

insert into public.lessons (chapter_number, chapter_title, title, content_short, category, sort_order) values

-- Capítulo 1: Domina tu mente, entiende tus emociones
(1, 'Domina tu mente, entiende tus emociones',
 'Conócete antes de cambiar el mundo',
 'El primer paso para cambiar cualquier cosa afuera es entenderte a ti mismo primero. Antes de reaccionar hoy, pregúntate: ¿esta reacción viene de la situación de ahora, o de un patrón que ya cargas de antes?',
 'ei', 1),

(1, 'Domina tu mente, entiende tus emociones',
 'La calma se entrena, no se espera',
 'La calma no llega sola en el momento en que la necesitas — se construye con práctica en los momentos tranquilos, para que esté disponible cuando todo se complica.',
 'ei', 2),

-- Capítulo 2: Hábitos que construyen tu mejor versión
(2, 'Hábitos que construyen tu mejor versión',
 'Un hábito tarda más de lo que crees',
 'La investigación sugiere que una acción nueva tarda entre dos y tres meses en volverse automática. Si abandonas a la tercera semana porque "se siente forzado", no estás fallando: te estás deteniendo justo antes de que se volviera más fácil.',
 'habitos', 1),

(2, 'Hábitos que construyen tu mejor versión',
 'Cuerpo sano, mente clara',
 'Tu alimentación y tu descanso no son temas aparte de tu productividad o tu ánimo — son la base sobre la que se sostiene todo lo demás. Cuidar esa base es la rutina más rentable que existe.',
 'habitos', 2),

-- Capítulo 3: Conecta, comunica y crea vínculos reales
(3, 'Conecta, comunica y crea vínculos reales',
 'Negocia por interés, no por posición',
 'Discutir por posiciones ("yo quiero esto") lleva a un empate. Entender el interés detrás de la posición ("necesito esto porque...") abre soluciones que ninguna de las dos partes había visto.',
 'relaciones', 1),

(3, 'Conecta, comunica y crea vínculos reales',
 'La empatía sin perderte a ti mismo',
 'Conectar con alguien no significa desaparecer tus propias necesidades para complacerlo. La conexión real ocurre cuando ambas partes pueden ser honestas sin miedo a romper la relación.',
 'relaciones', 2),

-- Capítulo 4: Piensa mejor, decide mejor
(4, 'Piensa mejor, decide mejor',
 'Tu mente te engaña sin que lo notes',
 'Los sesgos cognitivos distorsionan tus decisiones de forma invisible — no porque seas descuidado, sino porque así funciona la mente humana. Nombrar el sesgo es el primer paso para no caer en él.',
 'decisiones', 1),

(4, 'Piensa mejor, decide mejor',
 'Actuar con propósito, no por impulso',
 'Una decisión tomada por impulso resuelve la incomodidad de hoy. Una decisión tomada con criterio resuelve el problema real. Antes de decidir, pregúntate cuál de las dos estás haciendo.',
 'decisiones', 2),

-- Capítulo 5: Dinero sin miedo
(5, 'Dinero sin miedo',
 'Domina tus finanzas antes de que ellas te dominen',
 'Un plan financiero simple —sin excel complicado ni jerga— es lo que separa a quien controla su dinero de quien es controlado por él. Empieza por saber, con exactitud, cuánto entra y cuánto sale.',
 'dinero', 1),

(5, 'Dinero sin miedo',
 'Activos vs. pasivos: la distinción que cambia todo',
 'Un activo pone dinero en tu bolsillo. Un pasivo lo saca. Muchas cosas que parecen inversiones (el carro, ciertas compras "de estatus") son en realidad pasivos disfrazados.',
 'dinero', 2),

-- Capítulo 6: De trabajador a creador de riqueza
(6, 'De trabajador a creador de riqueza',
 'Lo que ganas al entender los mercados',
 'No necesitas ser experto en bolsa para beneficiarte de ella. Invertir con constancia, incluso en instrumentos simples como un fondo indexado, ofrece con el tiempo rendimientos que una cuenta de ahorro tradicional no puede dar.',
 'dinero', 1),

(6, 'De trabajador a creador de riqueza',
 'El poder silencioso del interés compuesto',
 'Fabián invirtió $1,000 en un fondo que sigue al S&P 500. Con un rendimiento promedio del 10% anual, su inversión se acercó a $2,600 en diez años, sin elegir una sola empresa ni revisar el mercado a diario. El tiempo invertido, no el conocimiento técnico, hizo el trabajo.',
 'dinero', 2),

-- Capítulo 7: Tu vida digital, tu nuevo mundo real
(7, 'Tu vida digital, tu nuevo mundo real',
 'Sé dueño de tu tiempo, tus datos y tu reputación',
 'El mundo digital no es un espacio aparte de tu vida real — es una extensión de ella. Tu huella digital, tu tiempo de pantalla y tu manera de usar la tecnología dicen tanto de ti como tus decisiones fuera de línea.',
 'tecnologia', 1),

(7, 'Tu vida digital, tu nuevo mundo real',
 'Cómo hablarle bien a una IA',
 'La diferencia entre una respuesta mediocre y una útil casi siempre está en qué tan bien planteaste la pregunta, no en qué herramienta usaste. Dale contexto, sé específico, pide el formato que necesitas, y corrige en vez de empezar de cero.',
 'tecnologia', 2),

-- Capítulo 8: Liderazgo y voz profesional
(8, 'Liderazgo y voz profesional',
 'Influir no depende de tu título',
 'Puedes liderar sin un puesto formal. La influencia real nace de cómo te presentas, cómo comunicas y cómo tratas a quienes te rodean — no de lo que dice tu tarjeta de presentación.',
 'relaciones', 1),

(8, 'Liderazgo y voz profesional',
 'Negocia tu valor con datos, no con esperanza',
 'Pedir lo que mereces no es incómodo si llegas con datos concretos sobre tu impacto, en vez de apelar solo a la buena voluntad de quien decide.',
 'relaciones', 2),

-- Capítulo 9: Envejecer con propósito
(9, 'Envejecer con propósito',
 'Tu segunda mitad no es cuesta abajo',
 'Envejecer con propósito no significa tener todas las respuestas resueltas. Significa dejar de tratar las preguntas importantes como "para algún día" y empezar a tratarlas como preguntas para esta etapa que ya estás viviendo.',
 'proposito', 1),

(9, 'Envejecer con propósito',
 'La incomodidad señala por dónde empezar',
 'De todos los temas que te generan dudas sobre esta etapa de tu vida, el que más te incomoda casi siempre es la señal más confiable de por dónde empezar — no una razón para seguir evitándolo.',
 'proposito', 2),

-- Capítulo 10: De leer a actuar
(10, 'De leer a actuar',
 'Sentirte inspirado no es lo mismo que haber cambiado',
 'Terminar un libro y sentirte motivado no es igual a haber cambiado algo real. Confundir esas dos cosas es exactamente lo que hace que tantas buenas ideas se disuelvan en la rutina de siempre.',
 'habitos', 1),

(10, 'De leer a actuar',
 'Elige un solo punto de partida',
 'No puedes reformar tu vida entera el mismo lunes. Elige el área que te generó más urgencia real mientras leías — no la que "deberías" priorizar según otros — y empieza solo por ahí.',
 'habitos', 2);

-- ============================================================
-- Prompts de diario, ligados a capítulos
-- ============================================================
insert into public.journal_prompts (chapter_ref, prompt_text) values
('Capítulo 1 — Mente y emociones', '¿Qué patrón emocional notaste hoy que no viene de la situación de ahora, sino de algo más antiguo?'),
('Capítulo 2 — Hábitos', '¿Qué hábito pequeño sostuviste hoy, aunque nadie más lo notara?'),
('Capítulo 3 — Relaciones', '¿Hubo una conversación hoy donde priorizaste el interés real de la otra persona por encima de tener la razón?'),
('Capítulo 4 — Decisiones', '¿Qué decisión de hoy tomaste por impulso, y cuál tomaste con criterio? ¿Cómo se sintió la diferencia?'),
('Capítulo 5 — Dinero', '¿Qué gasto de hoy fue en realidad un pasivo disfrazado de necesidad?'),
('Capítulo 6 — Riqueza', '¿Qué tan cómodo te sientes hoy con la idea de que tu dinero trabaje por ti, aunque no lo veas de inmediato?'),
('Capítulo 7 — Vida digital', '¿Tu tiempo de pantalla de hoy reflejó a la persona que quieres ser, o a la que caes en automático?'),
('Capítulo 9 — Propósito', '¿Qué pregunta sobre esta etapa de tu vida sigues dejando para "algún día"?'),
('Decisión consciente', '¿Cómo te sentiste al elegir la opción más barata hoy? ¿Fue fácil, incómodo, satisfactorio?');
