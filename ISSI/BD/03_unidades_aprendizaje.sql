-- ==================================================================
-- 3. INSERCIÓN DE UNIDADES DE APRENDIZAJE (MANDATORIAS Y OPTATIVAS)
-- ==================================================================
INSERT INTO
    unidad_de_aprendizaje (
        id,
        nombre,
        credito,
        carrera,
        semestre,
        tipo
    )
VALUES
    -- ISC (Ingenieria en Sistemas Computacionales) - OBLIGATORIAS
    (
        'UA0001',
        'Fundamentos de Programación',
        7.5,
        'Ingenieria en Sistemas Computacionales',
        1,
        'OBLIGATORIA'
    ),
    (
        'UA0002',
        'Matemáticas Discretas',
        10.5,
        'Ingenieria en Sistemas Computacionales',
        1,
        'OBLIGATORIA'
    ),
    (
        'UA0003',
        'Cálculo',
        7.5,
        'Ingenieria en Sistemas Computacionales',
        1,
        'OBLIGATORIA'
    ),
    (
        'UA0004',
        'Análisis Vectorial',
        7.5,
        'Ingenieria en Sistemas Computacionales',
        1,
        'OBLIGATORIA'
    ),
    (
        'UA0005',
        'Comunicación Oral y Escrita',
        7.5,
        'Ingenieria en Sistemas Computacionales',
        1,
        'OBLIGATORIA'
    ),
    (
        'UA0006',
        'Álgebra Lineal',
        7.5,
        'Ingenieria en Sistemas Computacionales',
        2,
        'OBLIGATORIA'
    ),
    (
        'UA0007',
        'Cálculo Aplicado',
        9.0,
        'Ingenieria en Sistemas Computacionales',
        2,
        'OBLIGATORIA'
    ),
    (
        'UA0008',
        'Mecánica y Electromagnetismo',
        10.5,
        'Ingenieria en Sistemas Computacionales',
        2,
        'OBLIGATORIA'
    ),
    (
        'UA0009',
        'Ingeniería, Ética y Sociedad',
        9.0,
        'Ingenieria en Sistemas Computacionales',
        2,
        'OBLIGATORIA'
    ),
    (
        'UA0010',
        'Fundamentos Económicos',
        7.5,
        'Ingenieria en Sistemas Computacionales',
        2,
        'OBLIGATORIA'
    ),
    (
        'UA0011',
        'Algoritmos y Estructuras de Datos',
        7.5,
        'Ingenieria en Sistemas Computacionales',
        2,
        'OBLIGATORIA'
    ),
    (
        'UA0012',
        'Ecuaciones Diferenciales',
        9.0,
        'Ingenieria en Sistemas Computacionales',
        3,
        'OBLIGATORIA'
    ),
    (
        'UA0013',
        'Circuitos Eléctricos',
        10.5,
        'Ingenieria en Sistemas Computacionales',
        3,
        'OBLIGATORIA'
    ),
    (
        'UA0014',
        'Fundamentos de Diseño Digital',
        7.5,
        'Ingenieria en Sistemas Computacionales',
        3,
        'OBLIGATORIA'
    ),
    (
        'UA0015',
        'Bases de Datos',
        7.5,
        'Ingenieria en Sistemas Computacionales',
        3,
        'OBLIGATORIA'
    ),
    (
        'UA0016',
        'Finanzas Empresariales',
        7.5,
        'Ingenieria en Sistemas Computacionales',
        3,
        'OBLIGATORIA'
    ),
    (
        'UA0017',
        'Paradigmas de Programación',
        7.5,
        'Ingenieria en Sistemas Computacionales',
        3,
        'OBLIGATORIA'
    ),
    (
        'UA0018',
        'Análisis y Diseño de Algoritmos',
        7.5,
        'Ingenieria en Sistemas Computacionales',
        3,
        'OBLIGATORIA'
    ),
    (
        'UA0019',
        'Probabilidad y Estadística',
        9.0,
        'Ingenieria en Sistemas Computacionales',
        4,
        'OBLIGATORIA'
    ),
    (
        'UA0020',
        'Matemáticas Avanzadas para la Ingeniería',
        9.0,
        'Ingenieria en Sistemas Computacionales',
        4,
        'OBLIGATORIA'
    ),
    (
        'UA0021',
        'Electrónica Analógica',
        7.5,
        'Ingenieria en Sistemas Computacionales',
        4,
        'OBLIGATORIA'
    ),
    (
        'UA0022',
        'Diseño de Sistemas Digitales',
        7.5,
        'Ingenieria en Sistemas Computacionales',
        4,
        'OBLIGATORIA'
    ),
    (
        'UA0023',
        'Tecnologías para el Desarrollo de Aplicaciones Web',
        7.5,
        'Ingenieria en Sistemas Computacionales',
        4,
        'OBLIGATORIA'
    ),
    (
        'UA0024',
        'Sistemas Operativos',
        7.5,
        'Ingenieria en Sistemas Computacionales',
        4,
        'OBLIGATORIA'
    ),
    (
        'UA0025',
        'Teoría de la Computación',
        7.5,
        'Ingenieria en Sistemas Computacionales',
        4,
        'OBLIGATORIA'
    ),
    (
        'UA0026',
        'Procesamiento Digital de Señales',
        7.5,
        'Ingenieria en Sistemas Computacionales',
        5,
        'OBLIGATORIA'
    ),
    (
        'UA0027',
        'Instrumentación y Control',
        7.5,
        'Ingenieria en Sistemas Computacionales',
        5,
        'OBLIGATORIA'
    ),
    (
        'UA0028',
        'Arquitectura de Computadoras',
        7.5,
        'Ingenieria en Sistemas Computacionales',
        5,
        'OBLIGATORIA'
    ),
    (
        'UA0029',
        'Análisis y Diseño de Sistemas',
        7.5,
        'Ingenieria en Sistemas Computacionales',
        5,
        'OBLIGATORIA'
    ),
    (
        'UA0030',
        'Formulación y Evaluación de Proyectos Informáticos',
        6.0,
        'Ingenieria en Sistemas Computacionales',
        5,
        'OBLIGATORIA'
    ),
    (
        'UA0031',
        'Compiladores',
        7.5,
        'Ingenieria en Sistemas Computacionales',
        5,
        'OBLIGATORIA'
    ),
    (
        'UA0032',
        'Redes de Computadoras',
        7.5,
        'Ingenieria en Sistemas Computacionales',
        5,
        'OBLIGATORIA'
    ),
    (
        'UA0033',
        'Sistemas en Chip',
        7.5,
        'Ingenieria en Sistemas Computacionales',
        6,
        'OBLIGATORIA'
    ),
    (
        'UA0036',
        'Métodos Cuantitativos para la Toma de Decisiones',
        7.5,
        'Ingenieria en Sistemas Computacionales',
        6,
        'OBLIGATORIA'
    ),
    (
        'UA0037',
        'Ingeniería de Software',
        7.5,
        'Ingenieria en Sistemas Computacionales',
        6,
        'OBLIGATORIA'
    ),
    (
        'UA0038',
        'Inteligencia Artificial',
        7.5,
        'Ingenieria en Sistemas Computacionales',
        6,
        'OBLIGATORIA'
    ),
    (
        'UA0039',
        'Aplicaciones para Comunicaciones en Red',
        7.5,
        'Ingenieria en Sistemas Computacionales',
        6,
        'OBLIGATORIA'
    ),
    (
        'UA0040',
        'Desarrollo de Aplicaciones Móviles Nativas',
        7.5,
        'Ingenieria en Sistemas Computacionales',
        7,
        'OBLIGATORIA'
    ),
    (
        'UA0043',
        'Sistemas Distribuidos',
        7.5,
        'Ingenieria en Sistemas Computacionales',
        7,
        'OBLIGATORIA'
    ),
    (
        'UA0044',
        'Administración de Servicios en Red',
        7.5,
        'Ingenieria en Sistemas Computacionales',
        7,
        'OBLIGATORIA'
    ),
    (
        'UA0045',
        'Estancia Profesional',
        12.0,
        'Ingenieria en Sistemas Computacionales',
        8,
        'OBLIGATORIA'
    ),
    (
        'UA0046',
        'Desarrollo de Habilidades Sociales para la Alta Dirección',
        3.0,
        'Ingenieria en Sistemas Computacionales',
        8,
        'OBLIGATORIA'
    ),
    (
        'UA0047',
        'Trabajo Terminal II',
        12.0,
        'Ingenieria en Sistemas Computacionales',
        8,
        'OBLIGATORIA'
    ),
    (
        'UA0048',
        'Gestión Empresarial',
        7.5,
        'Ingenieria en Sistemas Computacionales',
        8,
        'OBLIGATORIA'
    ),
    (
        'UA0049',
        'Liderazgo Personal',
        7.5,
        'Ingenieria en Sistemas Computacionales',
        8,
        'OBLIGATORIA'
    ),
    (
        'UA0050',
        'Trabajo Terminal I',
        12.0,
        'Ingenieria en Sistemas Computacionales',
        8,
        'OBLIGATORIA'
    ),
    -- IIA (Ingenieria en Inteligencia Artificial) - OBLIGATORIAS
    (
        'UA0051',
        'Fundamentos de Programación',
        7.5,
        'Ingenieria en Inteligencia Artificial',
        1,
        'OBLIGATORIA'
    ),
    (
        'UA0052',
        'Matemáticas Discretas',
        7.5,
        'Ingenieria en Inteligencia Artificial',
        1,
        'OBLIGATORIA'
    ),
    (
        'UA0053',
        'Cálculo',
        10.5,
        'Ingenieria en Inteligencia Artificial',
        1,
        'OBLIGATORIA'
    ),
    (
        'UA0054',
        'Comunicación Oral y Escrita',
        7.5,
        'Ingenieria en Inteligencia Artificial',
        1,
        'OBLIGATORIA'
    ),
    (
        'UA0055',
        'Fundamentos Económicos',
        7.5,
        'Ingenieria en Inteligencia Artificial',
        1,
        'OBLIGATORIA'
    ),
    (
        'UA0056',
        'Algoritmos y Estructuras de Datos',
        7.5,
        'Ingenieria en Inteligencia Artificial',
        2,
        'OBLIGATORIA'
    ),
    (
        'UA0057',
        'Álgebra Lineal',
        9.0,
        'Ingenieria en Inteligencia Artificial',
        2,
        'OBLIGATORIA'
    ),
    (
        'UA0058',
        'Mecánica y Electromagnetismo',
        10.5,
        'Ingenieria en Inteligencia Artificial',
        2,
        'OBLIGATORIA'
    ),
    (
        'UA0059',
        'Ingeniería, Ética y Sociedad',
        9.0,
        'Ingenieria en Inteligencia Artificial',
        2,
        'OBLIGATORIA'
    ),
    (
        'UA0060',
        'Liderazgo Personal',
        7.5,
        'Ingenieria en Inteligencia Artificial',
        2,
        'OBLIGATORIA'
    ),
    (
        'UA0061',
        'Análisis y Diseño de Algoritmos',
        7.5,
        'Ingenieria en Inteligencia Artificial',
        3,
        'OBLIGATORIA'
    ),
    (
        'UA0062',
        'Cálculo Aplicado',
        7.5,
        'Ingenieria en Inteligencia Artificial',
        3,
        'OBLIGATORIA'
    ),
    (
        'UA0063',
        'Ecuaciones Diferenciales',
        9.0,
        'Ingenieria en Inteligencia Artificial',
        3,
        'OBLIGATORIA'
    ),
    (
        'UA0064',
        'Fundamentos de Diseño Digital',
        7.5,
        'Ingenieria en Inteligencia Artificial',
        3,
        'OBLIGATORIA'
    ),
    (
        'UA0065',
        'Bases de Datos',
        7.5,
        'Ingenieria en Inteligencia Artificial',
        3,
        'OBLIGATORIA'
    ),
    (
        'UA0066',
        'Finanzas Empresariales',
        7.5,
        'Ingenieria en Inteligencia Artificial',
        3,
        'OBLIGATORIA'
    ),
    (
        'UA0067',
        'Teoría de la Computación',
        7.5,
        'Ingenieria en Inteligencia Artificial',
        4,
        'OBLIGATORIA'
    ),
    (
        'UA0068',
        'Probabilidad y Estadística',
        9.0,
        'Ingenieria en Inteligencia Artificial',
        4,
        'OBLIGATORIA'
    ),
    (
        'UA0069',
        'Matemáticas Avanzadas para la Ingeniería',
        9.0,
        'Ingenieria en Inteligencia Artificial',
        4,
        'OBLIGATORIA'
    ),
    (
        'UA0070',
        'Fundamentos de Inteligencia Artificial',
        7.5,
        'Ingenieria en Inteligencia Artificial',
        4,
        'OBLIGATORIA'
    ),
    (
        'UA0071',
        'Diseño de Sistemas Digitales',
        7.5,
        'Ingenieria en Inteligencia Artificial',
        4,
        'OBLIGATORIA'
    ),
    (
        'UA0072',
        'Análisis y Diseño de Sistemas',
        7.5,
        'Ingenieria en Inteligencia Artificial',
        4,
        'OBLIGATORIA'
    ),
    (
        'UA0073',
        'Procesamiento de Señales',
        7.5,
        'Ingenieria en Inteligencia Artificial',
        5,
        'OBLIGATORIA'
    ),
    (
        'UA0074',
        'Paradigmas de Programación',
        7.5,
        'Ingenieria en Inteligencia Artificial',
        5,
        'OBLIGATORIA'
    ),
    (
        'UA0075',
        'Tecnologías para el Desarrollo de Aplicaciones Web',
        7.5,
        'Ingenieria en Inteligencia Artificial',
        5,
        'OBLIGATORIA'
    ),
    (
        'UA0076',
        'Procesamiento Digital de Señales',
        7.5,
        'Ingenieria en Inteligencia Artificial',
        5,
        'OBLIGATORIA'
    ),
    (
        'UA0077',
        'Gestión Empresarial',
        7.5,
        'Ingenieria en Inteligencia Artificial',
        5,
        'OBLIGATORIA'
    ),
    (
        'UA0078',
        'Aprendizaje de Máquina',
        7.5,
        'Ingenieria en Inteligencia Artificial',
        6,
        'OBLIGATORIA'
    ),
    (
        'UA0079',
        'Tecnologías de Lenguaje Natural',
        7.5,
        'Ingenieria en Inteligencia Artificial',
        6,
        'OBLIGATORIA'
    ),
    (
        'UA0080',
        'Cómputo Paralelo',
        7.5,
        'Ingenieria en Inteligencia Artificial',
        6,
        'OBLIGATORIA'
    ),
    (
        'UA0081',
        'Ingeniería de Software para Sistemas Inteligentes',
        7.5,
        'Ingenieria en Inteligencia Artificial',
        6,
        'OBLIGATORIA'
    ),
    (
        'UA0082',
        'Metodología de la Investigación y Divulgación Científica',
        7.5,
        'Ingenieria en Inteligencia Artificial',
        6,
        'OBLIGATORIA'
    ),
    (
        'UA0083',
        'Visión Artificial',
        7.5,
        'Ingenieria en Inteligencia Artificial',
        7,
        'OBLIGATORIA'
    ),
    (
        'UA0084',
        'Reconocimiento de Voz',
        7.5,
        'Ingenieria en Inteligencia Artificial',
        7,
        'OBLIGATORIA'
    ),
    (
        'UA0085',
        'Algoritmos Bioinspirados',
        7.5,
        'Ingenieria en Inteligencia Artificial',
        7,
        'OBLIGATORIA'
    ),
    (
        'UA0086',
        'Redes Neuronales y Aprendizaje Profundo',
        7.5,
        'Ingenieria en Inteligencia Artificial',
        7,
        'OBLIGATORIA'
    ),
    (
        'UA0089',
        'Formulación y Evaluación de Proyectos Informáticos',
        7.5,
        'Ingenieria en Inteligencia Artificial',
        8,
        'OBLIGATORIA'
    ),
    (
        'UA0090',
        'Trabajo Terminal I',
        12.0,
        'Ingenieria en Inteligencia Artificial',
        8,
        'OBLIGATORIA'
    ),
    (
        'UA0091',
        'Trabajo Terminal II',
        12.0,
        'Ingenieria en Inteligencia Artificial',
        8,
        'OBLIGATORIA'
    ),
    (
        'UA0092',
        'Estancia Profesional',
        12.0,
        'Ingenieria en Inteligencia Artificial',
        8,
        'OBLIGATORIA'
    ),
    (
        'UA0093',
        'Desarrollo de Habilidades Sociales para la Alta Dirección',
        3.0,
        'Ingenieria en Inteligencia Artificial',
        8,
        'OBLIGATORIA'
    ),
    -- LCD (Licenciatura en Ciencia de Datos) - OBLIGATORIAS
    (
        'UA0096',
        'Fundamentos de Programación',
        7.5,
        'Licenciatura en Ciencia de Datos',
        1,
        'OBLIGATORIA'
    ),
    (
        'UA0097',
        'Matemáticas Discretas',
        10.5,
        'Licenciatura en Ciencia de Datos',
        1,
        'OBLIGATORIA'
    ),
    (
        'UA0098',
        'Cálculo',
        7.5,
        'Licenciatura en Ciencia de Datos',
        1,
        'OBLIGATORIA'
    ),
    (
        'UA0099',
        'Comunicación Oral y Escrita',
        7.5,
        'Licenciatura en Ciencia de Datos',
        1,
        'OBLIGATORIA'
    ),
    (
        'UA0100',
        'Introducción a la Ciencia de Datos',
        6.0,
        'Licenciatura en Ciencia de Datos',
        1,
        'OBLIGATORIA'
    ),
    (
        'UA0101',
        'Algoritmos y Estructuras de Datos',
        7.5,
        'Licenciatura en Ciencia de Datos',
        2,
        'OBLIGATORIA'
    ),
    (
        'UA0102',
        'Álgebra Lineal',
        7.5,
        'Licenciatura en Ciencia de Datos',
        2,
        'OBLIGATORIA'
    ),
    (
        'UA0103',
        'Cálculo Multivariable',
        10.5,
        'Licenciatura en Ciencia de Datos',
        2,
        'OBLIGATORIA'
    ),
    (
        'UA0104',
        'Ética y Legalidad',
        9.0,
        'Licenciatura en Ciencia de Datos',
        2,
        'OBLIGATORIA'
    ),
    (
        'UA0105',
        'Fundamentos Económicos',
        7.5,
        'Licenciatura en Ciencia de Datos',
        2,
        'OBLIGATORIA'
    ),
    (
        'UA0106',
        'Análisis y Diseño de Algoritmos',
        7.5,
        'Licenciatura en Ciencia de Datos',
        3,
        'OBLIGATORIA'
    ),
    (
        'UA0107',
        'Programación para Ciencia de Datos',
        7.5,
        'Licenciatura en Ciencia de Datos',
        3,
        'OBLIGATORIA'
    ),
    (
        'UA0108',
        'Probabilidad',
        10.5,
        'Licenciatura en Ciencia de Datos',
        3,
        'OBLIGATORIA'
    ),
    (
        'UA0109',
        'Bases de Datos',
        7.5,
        'Licenciatura en Ciencia de Datos',
        3,
        'OBLIGATORIA'
    ),
    (
        'UA0110',
        'Métodos Numéricos',
        10.5,
        'Licenciatura en Ciencia de Datos',
        3,
        'OBLIGATORIA'
    ),
    (
        'UA0111',
        'Finanzas Empresariales',
        7.5,
        'Licenciatura en Ciencia de Datos',
        3,
        'OBLIGATORIA'
    ),
    (
        'UA0112',
        'Desarrollo de Aplicaciones Web',
        7.5,
        'Licenciatura en Ciencia de Datos',
        4,
        'OBLIGATORIA'
    ),
    (
        'UA0113',
        'Cómputo de Alto Desempeño',
        9.0,
        'Licenciatura en Ciencia de Datos',
        4,
        'OBLIGATORIA'
    ),
    (
        'UA0114',
        'Estadística',
        10.5,
        'Licenciatura en Ciencia de Datos',
        4,
        'OBLIGATORIA'
    ),
    (
        'UA0115',
        'Base de Datos Avanzadas',
        10.5,
        'Licenciatura en Ciencia de Datos',
        4,
        'OBLIGATORIA'
    ),
    (
        'UA0116',
        'Desarrollo de Aplicaciones para Análisis de Datos',
        7.5,
        'Licenciatura en Ciencia de Datos',
        4,
        'OBLIGATORIA'
    ),
    (
        'UA0117',
        'Liderazgo Personal',
        7.5,
        'Licenciatura en Ciencia de Datos',
        4,
        'OBLIGATORIA'
    ),
    (
        'UA0118',
        'Minería de Datos',
        7.5,
        'Licenciatura en Ciencia de Datos',
        5,
        'OBLIGATORIA'
    ),
    (
        'UA0119',
        'Matemáticas Avanzadas para Ciencia de Datos',
        10.5,
        'Licenciatura en Ciencia de Datos',
        5,
        'OBLIGATORIA'
    ),
    (
        'UA0120',
        'Procesos Estocásticos',
        10.5,
        'Licenciatura en Ciencia de Datos',
        5,
        'OBLIGATORIA'
    ),
    (
        'UA0121',
        'Aprendizaje de Máquina e Inteligencia Artificial',
        7.5,
        'Licenciatura en Ciencia de Datos',
        5,
        'OBLIGATORIA'
    ),
    (
        'UA0122',
        'Analítica y Visualización de Datos',
        7.5,
        'Licenciatura en Ciencia de Datos',
        5,
        'OBLIGATORIA'
    ),
    (
        'UA0123',
        'Metodología de la Investigación y Divulgación Científica',
        7.5,
        'Licenciatura en Ciencia de Datos',
        5,
        'OBLIGATORIA'
    ),
    (
        'UA0124',
        'Modelado Predictivo',
        7.5,
        'Licenciatura en Ciencia de Datos',
        6,
        'OBLIGATORIA'
    ),
    (
        'UA0125',
        'Procesamiento de Lenguaje Natural',
        4.5,
        'Licenciatura en Ciencia de Datos',
        6,
        'OBLIGATORIA'
    ),
    (
        'UA0126',
        'Análisis de Series de Tiempo',
        4.5,
        'Licenciatura en Ciencia de Datos',
        6,
        'OBLIGATORIA'
    ),
    (
        'UA0127',
        'Analítica Avanzada de Datos',
        7.5,
        'Licenciatura en Ciencia de Datos',
        6,
        'OBLIGATORIA'
    ),
    (
        'UA0130',
        'Big Data',
        7.5,
        'Licenciatura en Ciencia de Datos',
        7,
        'OBLIGATORIA'
    ),
    (
        'UA0131',
        'Modelos Econométricos',
        4.5,
        'Licenciatura en Ciencia de Datos',
        7,
        'OBLIGATORIA'
    ),
    (
        'UA0132',
        'Trabajo Terminal I',
        12.0,
        'Licenciatura en Ciencia de Datos',
        7,
        'OBLIGATORIA'
    ),
    (
        'UA0133',
        'Administración de Proyectos de TI',
        10.5,
        'Licenciatura en Ciencia de Datos',
        7,
        'OBLIGATORIA'
    ),
    (
        'UA0136',
        'Desarrollo de Habilidades Sociales para la Alta Dirección',
        6.0,
        'Licenciatura en Ciencia de Datos',
        8,
        'OBLIGATORIA'
    ),
    (
        'UA0137',
        'Gestión Empresarial',
        10.5,
        'Licenciatura en Ciencia de Datos',
        8,
        'OBLIGATORIA'
    ),
    (
        'UA0138',
        'Trabajo Terminal II',
        12.0,
        'Licenciatura en Ciencia de Datos',
        8,
        'OBLIGATORIA'
    ),
    (
        'UA0139',
        'Estancia Profesional',
        4.5,
        'Licenciatura en Ciencia de Datos',
        8,
        'OBLIGATORIA'
    ),
    -- OPTATIVAS
    (
        'UA0140',
        'Tópicos Selectos de Criptografía',
        7.5,
        'Ingenieria en Sistemas Computacionales',
        6,
        'OPTATIVA'
    ),
    (
        'UA0141',
        'Introducción a la Criptografía',
        7.5,
        'Ingenieria en Sistemas Computacionales',
        6,
        'OPTATIVA'
    ),
    (
        'UA0142',
        'Seguridad Informática',
        7.5,
        'Ingenieria en Sistemas Computacionales',
        6,
        'OPTATIVA'
    ),
    (
        'UA0143',
        'Aseguramiento de Calidad de Software y Patrones de Diseño',
        7.5,
        'Ingenieria en Sistemas Computacionales',
        6,
        'OPTATIVA'
    ),
    (
        'UA0144',
        'Gestión de Empresas de Alta Tecnología',
        7.5,
        'Ingenieria en Sistemas Computacionales',
        6,
        'OPTATIVA'
    ),
    (
        'UA0145',
        'Herramientas Estadísticas para Análisis de Datos',
        7.5,
        'Ingenieria en Sistemas Computacionales',
        6,
        'OPTATIVA'
    ),
    (
        'UA0146',
        'Algoritmos Genéticos',
        7.5,
        'Ingenieria en Sistemas Computacionales',
        6,
        'OPTATIVA'
    ),
    (
        'UA0147',
        'Bases de Datos No Relacionales',
        7.5,
        'Ingenieria en Sistemas Computacionales',
        6,
        'OPTATIVA'
    ),
    (
        'UA0148',
        'Sistemas Embebidos',
        7.5,
        'Ingenieria en Sistemas Computacionales',
        6,
        'OPTATIVA'
    ),
    (
        'UA0149',
        'Tópicos Selectos de Computación I',
        7.5,
        'Ingenieria en Sistemas Computacionales',
        6,
        'OPTATIVA'
    ),
    (
        'UA0150',
        'Aprendizaje de Máquina (ISC)',
        7.5,
        'Ingenieria en Sistemas Computacionales',
        6,
        'OPTATIVA'
    ),
    (
        'UA0151',
        'Instrumentación Virtual',
        7.5,
        'Ingenieria en Sistemas Computacionales',
        6,
        'OPTATIVA'
    ),
    (
        'UA0152',
        'Gráficos por Computadora',
        7.5,
        'Ingenieria en Sistemas Computacionales',
        6,
        'OPTATIVA'
    ),
    (
        'UA0153',
        'Autómatas Celulares',
        7.5,
        'Ingenieria en Sistemas Computacionales',
        6,
        'OPTATIVA'
    ),
    (
        'UA0154',
        'Análisis de Imagen',
        7.5,
        'Ingenieria en Sistemas Computacionales',
        7,
        'OPTATIVA'
    ),
    (
        'UA0155',
        'Frameworks de Desarrollo Web Cliente y Servidor',
        7.5,
        'Ingenieria en Sistemas Computacionales',
        7,
        'OPTATIVA'
    ),
    (
        'UA0156',
        'Ingeniería Económica',
        7.5,
        'Ingenieria en Sistemas Computacionales',
        7,
        'OPTATIVA'
    ),
    (
        'UA0157',
        'Minería de Datos (ISC)',
        7.5,
        'Ingenieria en Sistemas Computacionales',
        7,
        'OPTATIVA'
    ),
    (
        'UA0158',
        'Internet de las Cosas',
        7.5,
        'Ingenieria en Sistemas Computacionales',
        7,
        'OPTATIVA'
    ),
    (
        'UA0159',
        'Tópicos Selectos de Computación II',
        7.5,
        'Ingenieria en Sistemas Computacionales',
        7,
        'OPTATIVA'
    ),
    (
        'UA0160',
        'Aplicaciones de Instrumentación Virtual',
        7.5,
        'Ingenieria en Sistemas Computacionales',
        7,
        'OPTATIVA'
    ),
    (
        'UA0161',
        'Procesamiento de Lenguaje Natural (ISC)',
        7.5,
        'Ingenieria en Sistemas Computacionales',
        7,
        'OPTATIVA'
    ),
    (
        'UA0162',
        'Realidad Virtual y Aumentada',
        7.5,
        'Ingenieria en Sistemas Computacionales',
        7,
        'OPTATIVA'
    ),
    (
        'UA0163',
        'Sistemas Complejos',
        7.5,
        'Ingenieria en Sistemas Computacionales',
        7,
        'OPTATIVA'
    ),
    (
        'UA0164',
        'Aplicaciones de Lenguaje Natural',
        7.5,
        'Ingenieria en Inteligencia Artificial',
        6,
        'OPTATIVA'
    ),
    (
        'UA0165',
        'Cómputo en la Nube',
        7.5,
        'Ingenieria en Inteligencia Artificial',
        6,
        'OPTATIVA'
    ),
    (
        'UA0166',
        'Interacción Humano-Máquina',
        7.5,
        'Ingenieria en Inteligencia Artificial',
        6,
        'OPTATIVA'
    ),
    (
        'UA0167',
        'Minería de Datos (IIA)',
        7.5,
        'Ingenieria en Inteligencia Artificial',
        6,
        'OPTATIVA'
    ),
    (
        'UA0168',
        'Programación de Dispositivos Móviles',
        7.5,
        'Ingenieria en Inteligencia Artificial',
        6,
        'OPTATIVA'
    ),
    (
        'UA0169',
        'Propiedad Intelectual (IIA)',
        7.5,
        'Ingenieria en Inteligencia Artificial',
        6,
        'OPTATIVA'
    ),
    (
        'UA0170',
        'Sistemas Multiagentes',
        7.5,
        'Ingenieria en Inteligencia Artificial',
        6,
        'OPTATIVA'
    ),
    (
        'UA0171',
        'Temas Selectos de Inteligencia Artificial',
        7.5,
        'Ingenieria en Inteligencia Artificial',
        7,
        'OPTATIVA'
    ),
    (
        'UA0172',
        'Técnicas de Programación para Robots Móviles',
        7.5,
        'Ingenieria en Inteligencia Artificial',
        7,
        'OPTATIVA'
    ),
    (
        'UA0173',
        'Tópicos Selectos de Algoritmos Bioinspirados',
        7.5,
        'Ingenieria en Inteligencia Artificial',
        7,
        'OPTATIVA'
    ),
    (
        'UA0174',
        'Big Data (IIA)',
        7.5,
        'Ingenieria en Inteligencia Artificial',
        7,
        'OPTATIVA'
    ),
    (
        'UA0175',
        'Aplicaciones de Inteligencia Artificial en Sistemas Embebidos',
        7.5,
        'Ingenieria en Inteligencia Artificial',
        7,
        'OPTATIVA'
    ),
    (
        'UA0176',
        'Innovación y Emprendimiento Tecnológico (IIA)',
        7.5,
        'Ingenieria en Inteligencia Artificial',
        7,
        'OPTATIVA'
    ),
    (
        'UA0177',
        'Aplicaciones de Sistemas Multiagentes',
        7.5,
        'Ingenieria en Inteligencia Artificial',
        7,
        'OPTATIVA'
    ),
    (
        'UA0178',
        'Bioinformática Básica',
        7.5,
        'Licenciatura en Ciencia de Datos',
        6,
        'OPTATIVA'
    ),
    (
        'UA0179',
        'Ciberseguridad',
        7.5,
        'Licenciatura en Ciencia de Datos',
        6,
        'OPTATIVA'
    ),
    (
        'UA0180',
        'Estadística Avanzada',
        7.5,
        'Licenciatura en Ciencia de Datos',
        6,
        'OPTATIVA'
    ),
    (
        'UA0181',
        'Propiedad Intelectual (LCD)',
        7.5,
        'Licenciatura en Ciencia de Datos',
        6,
        'OPTATIVA'
    ),
    (
        'UA0182',
        'Simulación Básica',
        7.5,
        'Licenciatura en Ciencia de Datos',
        6,
        'OPTATIVA'
    ),
    (
        'UA0183',
        'Sistemas de Información Geográfica',
        7.5,
        'Licenciatura en Ciencia de Datos',
        6,
        'OPTATIVA'
    ),
    (
        'UA0184',
        'Bioinformática Avanzada',
        7.5,
        'Licenciatura en Ciencia de Datos',
        7,
        'OPTATIVA'
    ),
    (
        'UA0185',
        'Protección de Datos',
        7.5,
        'Licenciatura en Ciencia de Datos',
        7,
        'OPTATIVA'
    ),
    (
        'UA0186',
        'Temas Selectos de Aprendizaje Profundo',
        7.5,
        'Licenciatura en Ciencia de Datos',
        7,
        'OPTATIVA'
    ),
    (
        'UA0187',
        'Innovación y Emprendimiento Tecnológico (LCD)',
        7.5,
        'Licenciatura en Ciencia de Datos',
        7,
        'OPTATIVA'
    ),
    (
        'UA0188',
        'Simulación Avanzada',
        7.5,
        'Licenciatura en Ciencia de Datos',
        7,
        'OPTATIVA'
    ),
    (
        'UA0189',
        'Temas Selectos de Inteligencia Artificial (LCD)',
        7.5,
        'Licenciatura en Ciencia de Datos',
        7,
        'OPTATIVA'
    ),
    (
        'UA0190',
        'Temas Selectos de Procesamiento de Lenguaje Natural',
        7.5,
        'Licenciatura en Ciencia de Datos',
        7,
        'OPTATIVA'
    );
