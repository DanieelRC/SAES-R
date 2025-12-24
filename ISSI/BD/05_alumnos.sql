-- ==================================================
-- Datos de Alumnos y Estudiantes
-- ==================================================
-- Descripción: Inserta alumnos con sus datos personales, kardex y estado académico
-- Orden de ejecución: 5
-- Prerequisito: Ejecutar 04_grupos_horarios.sql
-- ==================================================

USE SAES;

SET FOREIGN_KEY_CHECKS = 0;

DELETE FROM datos_personales WHERE tipo_usuario = 'alumno';

INSERT INTO
    datos_personales (
        id,
        contrasena,
        tipo_usuario,
        nombre,
        ape_paterno,
        ape_materno,
        fecha_nacimiento,
        RFC,
        tipo_sangre,
        CURP,
        nacionalidad,
        calle,
        num_exterior,
        num_interior,
        codigo_postal,
        colonia,
        delegacion,
        ciudad,
        telefono,
        email,
        grado,
        situacion,
        calificacion,
        carrera
    )
VALUES
    -- ===== 10 Alumnos IIA =====
    (
        '2024630101',
        '$2b$10$FVM7xU.TbCeLwfOmDq1QeeF0DCu6FlpuS8f.hqSL55HmZojG1ZbNG',
        'alumno',
        'María',
        'Gómez',
        'Sánchez',
        '2006-03-21',
        'RFC2024630101',
        'A+',
        'CURP2024630101',
        'mexicana',
        'Calle Ferrer',
        '123',
        'n/a',
        '01234',
        'Colonia Central',
        'Delegacion GAM',
        'CDMX',
        '550101',
        'prueba12837a@gmail.com',
        NULL,
        'activo',
        8.5,
        'Ingenieria en Inteligencia Artificial'
    ),
    (
        '2024630102',
        '$2b$10$FVM7xU.TbCeLwfOmDq1QeeF0DCu6FlpuS8f.hqSL55HmZojG1ZbNG',
        'alumno',
        'Luis',
        'Hernández',
        'Cruz',
        '2005-11-05',
        'RFC2024630102',
        'O-',
        'CURP2024630102',
        'mexicana',
        'Calle Cocos',
        '123',
        'n/a',
        '01234',
        'Colonia Central',
        'Delegacion Iztacalco',
        'CDMX',
        '550102',
        'prueba12837a@gmail.com',
        NULL,
        'activo',
        8.5,
        'Ingenieria en Inteligencia Artificial'
    ),
    (
        '2024630103',
        '$2b$10$FVM7xU.TbCeLwfOmDq1QeeF0DCu6FlpuS8f.hqSL55HmZojG1ZbNG',
        'alumno',
        'Diego',
        'Ruiz',
        'Salazar',
        '2006-04-12',
        'RFC2024630103',
        'O+',
        'CURP2024630103',
        'mexicana',
        'Calle Robles',
        '234',
        'n/a',
        '01240',
        'Colonia Industrial',
        'Delegacion Azcapotzalco',
        'CDMX',
        '550103',
        '2024630103@ipn.mx',
        NULL,
        'activo',
        7.8,
        'Ingenieria en Inteligencia Artificial'
    ),
    (
        '2024630104',
        '$2b$10$FVM7xU.TbCeLwfOmDq1QeeF0DCu6FlpuS8f.hqSL55HmZojG1ZbNG',
        'alumno',
        'Isabella',
        'Castro',
        'Reyes',
        '2006-06-30',
        'RFC2024630104',
        'A-',
        'CURP2024630104',
        'mexicana',
        'Calle Naranjos',
        '567',
        'n/a',
        '01241',
        'Colonia Centro',
        'Delegacion Cuauhtémoc',
        'CDMX',
        '550104',
        '2024630104@ipn.mx',
        NULL,
        'activo',
        8.9,
        'Ingenieria en Inteligencia Artificial'
    ),
    (
        '2024630105',
        '$2b$10$FVM7xU.TbCeLwfOmDq1QeeF0DCu6FlpuS8f.hqSL55HmZojG1ZbNG',
        'alumno',
        'Mateo',
        'Vargas',
        'Mendoza',
        '2006-02-18',
        'RFC2024630105',
        'B+',
        'CURP2024630105',
        'mexicana',
        'Calle Eucaliptos',
        '890',
        'n/a',
        '01242',
        'Colonia Roma',
        'Delegacion Cuauhtémoc',
        'CDMX',
        '550105',
        '2024630105@ipn.mx',
        NULL,
        'activo',
        8.2,
        'Ingenieria en Inteligencia Artificial'
    ),
    (
        '2024630106',
        '$2b$10$FVM7xU.TbCeLwfOmDq1QeeF0DCu6FlpuS8f.hqSL55HmZojG1ZbNG',
        'alumno',
        'Camila',
        'Ortiz',
        'Mora',
        '2006-08-25',
        'RFC2024630106',
        'AB+',
        'CURP2024630106',
        'mexicana',
        'Calle Pinos',
        '123',
        'n/a',
        '01243',
        'Colonia Condesa',
        'Delegacion Cuauhtémoc',
        'CDMX',
        '550106',
        '2024630106@ipn.mx',
        NULL,
        'activo',
        7.5,
        'Ingenieria en Inteligencia Artificial'
    ),
    (
        '2024630107',
        '$2b$10$FVM7xU.TbCeLwfOmDq1QeeF0DCu6FlpuS8f.hqSL55HmZojG1ZbNG',
        'alumno',
        'Santiago',
        'Ramos',
        'Silva',
        '2006-01-09',
        'RFC2024630107',
        'O-',
        'CURP2024630107',
        'mexicana',
        'Calle Cedros',
        '456',
        'n/a',
        '01244',
        'Colonia Polanco',
        'Delegacion Miguel Hidalgo',
        'CDMX',
        '550107',
        '2024630107@ipn.mx',
        NULL,
        'activo',
        8.6,
        'Ingenieria en Inteligencia Artificial'
    ),
    (
        '2024630108',
        '$2b$10$FVM7xU.TbCeLwfOmDq1QeeF0DCu6FlpuS8f.hqSL55HmZojG1ZbNG',
        'alumno',
        'Valentina',
        'Navarro',
        'Guzmán',
        '2006-03-15',
        'RFC2024630108',
        'A+',
        'CURP2024630108',
        'mexicana',
        'Calle Sauces',
        '789',
        'n/a',
        '01245',
        'Colonia Del Valle',
        'Delegacion Benito Juárez',
        'CDMX',
        '550108',
        '2024630108@ipn.mx',
        NULL,
        'activo',
        9.1,
        'Ingenieria en Inteligencia Artificial'
    ),
    (
        '2024630109',
        '$2b$10$FVM7xU.TbCeLwfOmDq1QeeF0DCu6FlpuS8f.hqSL55HmZojG1ZbNG',
        'alumno',
        'Sebastián',
        'Aguilar',
        'Ríos',
        '2006-05-22',
        'RFC2024630109',
        'B-',
        'CURP2024630109',
        'mexicana',
        'Calle Olmos',
        '234',
        'n/a',
        '01246',
        'Colonia Nápoles',
        'Delegacion Benito Juárez',
        'CDMX',
        '550109',
        '2024630109@ipn.mx',
        NULL,
        'activo',
        7.9,
        'Ingenieria en Inteligencia Artificial'
    ),
    (
        '2024630110',
        '$2b$10$FVM7xU.TbCeLwfOmDq1QeeF0DCu6FlpuS8f.hqSL55HmZojG1ZbNG',
        'alumno',
        'Regina',
        'Flores',
        'Vega',
        '2006-07-08',
        'RFC2024630110',
        'O+',
        'CURP2024630110',
        'mexicana',
        'Calle Álamos',
        '567',
        'n/a',
        '01247',
        'Colonia San Rafael',
        'Delegacion Cuauhtémoc',
        'CDMX',
        '550110',
        '2024630110@ipn.mx',
        NULL,
        'activo',
        8.4,
        'Ingenieria en Inteligencia Artificial'
    ),
    -- ===== 10 Alumnos LCD =====
    (
        '2024630201',
        '$2b$10$FVM7xU.TbCeLwfOmDq1QeeF0DCu6FlpuS8f.hqSL55HmZojG1ZbNG',
        'alumno',
        'Ana',
        'Díaz',
        'Flores',
        '2006-01-10',
        'RFC2024630201',
        'AB-',
        'CURP2024630201',
        'mexicana',
        'Calle Tulipanes',
        '123',
        'n/a',
        '01230',
        'Colonia Sur',
        'Delegacion Coyoacán',
        'CDMX',
        '550201',
        '2024630201@ipn.mx',
        NULL,
        'activo',
        9.2,
        'Licenciatura en Ciencia de Datos'
    ),
    (
        '2024630202',
        '$2b$10$FVM7xU.TbCeLwfOmDq1QeeF0DCu6FlpuS8f.hqSL55HmZojG1ZbNG',
        'alumno',
        'Carlos',
        'López',
        'García',
        '2005-07-15',
        'RFC2024630202',
        'B+',
        'CURP2024630202',
        'mexicana',
        'Calle Primavera',
        '456',
        'n/a',
        '01231',
        'Colonia Oriente',
        'Delegacion Benito Juárez',
        'CDMX',
        '550202',
        '2024630202@ipn.mx',
        NULL,
        'activo',
        6.5,
        'Licenciatura en Ciencia de Datos'
    ),
    (
        '2024630203',
        '$2b$10$FVM7xU.TbCeLwfOmDq1QeeF0DCu6FlpuS8f.hqSL55HmZojG1ZbNG',
        'alumno',
        'Ximena',
        'Medina',
        'Carrillo',
        '2006-02-28',
        'RFC2024630203',
        'B+',
        'CURP2024630203',
        'mexicana',
        'Calle Cipreses',
        '789',
        'n/a',
        '01251',
        'Colonia Guerrero',
        'Delegacion Cuauhtémoc',
        'CDMX',
        '550203',
        '2024630203@ipn.mx',
        NULL,
        'activo',
        8.1,
        'Licenciatura en Ciencia de Datos'
    ),
    (
        '2024630204',
        '$2b$10$FVM7xU.TbCeLwfOmDq1QeeF0DCu6FlpuS8f.hqSL55HmZojG1ZbNG',
        'alumno',
        'Gabriel',
        'Sandoval',
        'Bravo',
        '2006-04-16',
        'RFC2024630204',
        'A+',
        'CURP2024630204',
        'mexicana',
        'Calle Abetos',
        '234',
        'n/a',
        '01252',
        'Colonia Morelos',
        'Delegacion Cuauhtémoc',
        'CDMX',
        '550204',
        '2024630204@ipn.mx',
        NULL,
        'activo',
        8.8,
        'Licenciatura en Ciencia de Datos'
    ),
    (
        '2024630205',
        '$2b$10$FVM7xU.TbCeLwfOmDq1QeeF0DCu6FlpuS8f.hqSL55HmZojG1ZbNG',
        'alumno',
        'Renata',
        'Herrera',
        'Pantoja',
        '2006-06-11',
        'RFC2024630205',
        'O-',
        'CURP2024630205',
        'mexicana',
        'Calle Caobas',
        '567',
        'n/a',
        '01253',
        'Colonia Algarín',
        'Delegacion Cuauhtémoc',
        'CDMX',
        '550205',
        '2024630205@ipn.mx',
        NULL,
        'activo',
        7.6,
        'Licenciatura en Ciencia de Datos'
    ),
    (
        '2024630206',
        '$2b$10$FVM7xU.TbCeLwfOmDq1QeeF0DCu6FlpuS8f.hqSL55HmZojG1ZbNG',
        'alumno',
        'Andrés',
        'Velázquez',
        'Montes',
        '2006-08-03',
        'RFC2024630206',
        'AB+',
        'CURP2024630206',
        'mexicana',
        'Calle Encinos',
        '890',
        'n/a',
        '01254',
        'Colonia Transito',
        'Delegacion Cuauhtémoc',
        'CDMX',
        '550206',
        '2024630206@ipn.mx',
        NULL,
        'activo',
        8.5,
        'Licenciatura en Ciencia de Datos'
    ),
    (
        '2024630207',
        '$2b$10$FVM7xU.TbCeLwfOmDq1QeeF0DCu6FlpuS8f.hqSL55HmZojG1ZbNG',
        'alumno',
        'Paulina',
        'Moreno',
        'Aguirre',
        '2006-03-27',
        'RFC2024630207',
        'A-',
        'CURP2024630207',
        'mexicana',
        'Calle Ahuehuetes',
        '123',
        'n/a',
        '01255',
        'Colonia Obrera',
        'Delegacion Cuauhtémoc',
        'CDMX',
        '550207',
        '2024630207@ipn.mx',
        NULL,
        'activo',
        9.0,
        'Licenciatura en Ciencia de Datos'
    ),
    (
        '2024630208',
        '$2b$10$FVM7xU.TbCeLwfOmDq1QeeF0DCu6FlpuS8f.hqSL55HmZojG1ZbNG',
        'alumno',
        'Leonardo',
        'Gil',
        'Coronado',
        '2006-05-19',
        'RFC2024630208',
        'B+',
        'CURP2024630208',
        'mexicana',
        'Calle Bambúes',
        '456',
        'n/a',
        '01256',
        'Colonia Asturias',
        'Delegacion Cuauhtémoc',
        'CDMX',
        '550208',
        '2024630208@ipn.mx',
        NULL,
        'activo',
        7.8,
        'Licenciatura en Ciencia de Datos'
    ),
    (
        '2024630209',
        '$2b$10$FVM7xU.TbCeLwfOmDq1QeeF0DCu6FlpuS8f.hqSL55HmZojG1ZbNG',
        'alumno',
        'Miranda',
        'Pacheco',
        'Domínguez',
        '2006-07-01',
        'RFC2024630209',
        'O+',
        'CURP2024630209',
        'mexicana',
        'Calle Tulipanes',
        '789',
        'n/a',
        '01257',
        'Colonia Ampliación Asturias',
        'Delegacion Cuauhtémoc',
        'CDMX',
        '550209',
        '2024630209@ipn.mx',
        NULL,
        'activo',
        8.2,
        'Licenciatura en Ciencia de Datos'
    ),
    (
        '2024630210',
        '$2b$10$FVM7xU.TbCeLwfOmDq1QeeF0DCu6FlpuS8f.hqSL55HmZojG1ZbNG',
        'alumno',
        'Emilio',
        'Ávila',
        'Cabrera',
        '2006-09-23',
        'RFC2024630210',
        'A+',
        'CURP2024630210',
        'mexicana',
        'Calle Gardenias',
        '234',
        'n/a',
        '01258',
        'Colonia Peralvillo',
        'Delegacion Cuauhtémoc',
        'CDMX',
        '550210',
        '2024630210@ipn.mx',
        NULL,
        'activo',
        8.7,
        'Licenciatura en Ciencia de Datos'
    ),
    -- ===== 10 Alumnos ISC =====
    (
        '2024630301',
        '$2b$10$FVM7xU.TbCeLwfOmDq1QeeF0DCu6FlpuS8f.hqSL55HmZojG1ZbNG',
        'alumno',
        'Roberto',
        'Ramírez',
        'Vargas',
        '2006-05-29',
        'RFC2024630301',
        'A-',
        'CURP2024630301',
        'mexicana',
        'Calle Jacarandas',
        '123',
        'n/a',
        '01234',
        'Colonia Central',
        'Delegacion Coyacán',
        'CDMX',
        '550301',
        '2024630301@ipn.mx',
        NULL,
        'activo',
        8.5,
        'Ingenieria en Sistemas Computacionales'
    ),
    (
        '2024630302',
        '$2b$10$FVM7xU.TbCeLwfOmDq1QeeF0DCu6FlpuS8f.hqSL55HmZojG1ZbNG',
        'alumno',
        'Ricardo',
        'Torres',
        'Pérez',
        '2005-12-01',
        'RFC2024630302',
        'AB+',
        'CURP2024630302',
        'mexicana',
        'Calle Comunicaciones',
        '123',
        'n/a',
        '01234',
        'Colonia Central',
        'Delegacion Buena Vista',
        'CDMX',
        '550302',
        '2024630302@ipn.mx',
        NULL,
        'activo',
        8.5,
        'Ingenieria en Sistemas Computacionales'
    ),
    (
        '2024630303',
        '$2b$10$FVM7xU.TbCeLwfOmDq1QeeF0DCu6FlpuS8f.hqSL55HmZojG1ZbNG',
        'alumno',
        'Nicolás',
        'Delgado',
        'Ponce',
        '2006-02-14',
        'RFC2024630303',
        'A+',
        'CURP2024630303',
        'mexicana',
        'Calle Bugambilias',
        '456',
        'n/a',
        '01262',
        'Colonia Buenavista',
        'Delegacion Cuauhtémoc',
        'CDMX',
        '550303',
        '2024630303@ipn.mx',
        NULL,
        'activo',
        8.9,
        'Ingenieria en Sistemas Computacionales'
    ),
    (
        '2024630304',
        '$2b$10$FVM7xU.TbCeLwfOmDq1QeeF0DCu6FlpuS8f.hqSL55HmZojG1ZbNG',
        'alumno',
        'Alexa',
        'Contreras',
        'Garza',
        '2006-04-07',
        'RFC2024630304',
        'O-',
        'CURP2024630304',
        'mexicana',
        'Calle Azaleas',
        '789',
        'n/a',
        '01263',
        'Colonia Santa María la Ribera',
        'Delegacion Cuauhtémoc',
        'CDMX',
        '550304',
        '2024630304@ipn.mx',
        NULL,
        'activo',
        7.5,
        'Ingenieria en Sistemas Computacionales'
    ),
    (
        '2024630305',
        '$2b$10$FVM7xU.TbCeLwfOmDq1QeeF0DCu6FlpuS8f.hqSL55HmZojG1ZbNG',
        'alumno',
        'Rodrigo',
        'Maldonado',
        'Chávez',
        '2006-06-24',
        'RFC2024630305',
        'B+',
        'CURP2024630305',
        'mexicana',
        'Calle Orquídeas',
        '234',
        'n/a',
        '01264',
        'Colonia San Simón Tolnáhuac',
        'Delegacion Cuauhtémoc',
        'CDMX',
        '550305',
        '2024630305@ipn.mx',
        NULL,
        'activo',
        8.3,
        'Ingenieria en Sistemas Computacionales'
    ),
    (
        '2024630306',
        '$2b$10$FVM7xU.TbCeLwfOmDq1QeeF0DCu6FlpuS8f.hqSL55HmZojG1ZbNG',
        'alumno',
        'Natalia',
        'Fuentes',
        'Rosales',
        '2006-08-18',
        'RFC2024630306',
        'AB+',
        'CURP2024630306',
        'mexicana',
        'Calle Claveles',
        '567',
        'n/a',
        '01265',
        'Colonia Ex Hipódromo de Peralvillo',
        'Delegacion Cuauhtémoc',
        'CDMX',
        '550306',
        '2024630306@ipn.mx',
        NULL,
        'activo',
        8.1,
        'Ingenieria en Sistemas Computacionales'
    ),
    (
        '2024630307',
        '$2b$10$FVM7xU.TbCeLwfOmDq1QeeF0DCu6FlpuS8f.hqSL55HmZojG1ZbNG',
        'alumno',
        'Ángel',
        'Zárate',
        'Guerrero',
        '2006-03-09',
        'RFC2024630307',
        'A-',
        'CURP2024630307',
        'mexicana',
        'Calle Hortensias',
        '890',
        'n/a',
        '01266',
        'Colonia Felipe Pescador',
        'Delegacion Cuauhtémoc',
        'CDMX',
        '550307',
        '2024630307@ipn.mx',
        NULL,
        'activo',
        8.7,
        'Ingenieria en Sistemas Computacionales'
    ),
    (
        '2024630308',
        '$2b$10$FVM7xU.TbCeLwfOmDq1QeeF0DCu6FlpuS8f.hqSL55HmZojG1ZbNG',
        'alumno',
        'Victoria',
        'Molina',
        'Pedraza',
        '2006-05-26',
        'RFC2024630308',
        'O+',
        'CURP2024630308',
        'mexicana',
        'Calle Dalias',
        '123',
        'n/a',
        '01267',
        'Colonia Moctezuma',
        'Delegacion Venustiano Carranza',
        'CDMX',
        '550308',
        '2024630308@ipn.mx',
        NULL,
        'activo',
        7.2,
        'Ingenieria en Sistemas Computacionales'
    ),
    (
        '2024630309',
        '$2b$10$FVM7xU.TbCeLwfOmDq1QeeF0DCu6FlpuS8f.hqSL55HmZojG1ZbNG',
        'alumno',
        'Ian',
        'Quintero',
        'Herrera',
        '2006-07-13',
        'RFC2024630309',
        'B-',
        'CURP2024630309',
        'mexicana',
        'Calle Camelias',
        '456',
        'n/a',
        '01268',
        'Colonia Peñón de los Baños',
        'Delegacion Venustiano Carranza',
        'CDMX',
        '550309',
        '2024630309@ipn.mx',
        NULL,
        'activo',
        8.4,
        'Ingenieria en Sistemas Computacionales'
    ),
    (
        '2024630310',
        '$2b$10$FVM7xU.TbCeLwfOmDq1QeeF0DCu6FlpuS8f.hqSL55HmZojG1ZbNG',
        'alumno',
        'Amanda',
        'Salinas',
        'Nava',
        '2006-09-29',
        'RFC2024630310',
        'A+',
        'CURP2024630310',
        'mexicana',
        'Calle Girasoles',
        '789',
        'n/a',
        '01269',
        'Colonia Jardín Balbuena',
        'Delegacion Venustiano Carranza',
        'CDMX',
        '550310',
        '2024630310@ipn.mx',
        NULL,
        'activo',
        9.2,
        'Ingenieria en Sistemas Computacionales'
    );

-- ==================================================================
-- 5. INSERCIÓN DE ESTUDIANTE Y KARDEX
-- ==================================================================
DELETE FROM estudiante;

INSERT INTO
    estudiante (
        id,
        id_usuario,
        promedio,
        creditos_disponibles,
        estado_academico
    )
VALUES
    -- IIA (10)
    (
        'EST2024630101',
        '2024630101',
        8.5,
        50,
        'Regular'
    ),
    (
        'EST2024630102',
        '2024630102',
        8.5,
        50.0,
        'Regular'
    ),
    (
        'EST2024630103',
        '2024630103',
        7.8,
        50.0,
        'Regular'
    ),
    (
        'EST2024630104',
        '2024630104',
        8.9,
        50.0,
        'Irregular'
    ),
    (
        'EST2024630105',
        '2024630105',
        8.2,
        50.0,
        'Regular'
    ),
    (
        'EST2024630106',
        '2024630106',
        7.5,
        50.0,
        'Regular'
    ),
    (
        'EST2024630107',
        '2024630107',
        8.6,
        50.0,
        'Regular'
    ),
    (
        'EST2024630108',
        '2024630108',
        9.1,
        50.0,
        'Regular'
    ),
    (
        'EST2024630109',
        '2024630109',
        7.9,
        50.0,
        'Regular'
    ),
    (
        'EST2024630110',
        '2024630110',
        8.4,
        50.0,
        'Regular'
    ),
    -- LCD (10)
    (
        'EST2024630201',
        '2024630201',
        9.2,
        50.0,
        'Regular'
    ),
    (
        'EST2024630202',
        '2024630202',
        6.5,
        50.0,
        'Irregular'
    ),
    (
        'EST2024630203',
        '2024630203',
        8.1,
        50.0,
        'Regular'
    ),
    (
        'EST2024630204',
        '2024630204',
        8.8,
        50.0,
        'Regular'
    ),
    (
        'EST2024630205',
        '2024630205',
        7.6,
        50.0,
        'Regular'
    ),
    (
        'EST2024630206',
        '2024630206',
        8.5,
        50.0,
        'Regular'
    ),
    (
        'EST2024630207',
        '2024630207',
        9.0,
        50.0,
        'Irregular'
    ),
    (
        'EST2024630208',
        '2024630208',
        7.8,
        50.0,
        'Regular'
    ),
    (
        'EST2024630209',
        '2024630209',
        8.2,
        50.0,
        'Regular'
    ),
    (
        'EST2024630210',
        '2024630210',
        8.7,
        50.0,
        'Regular'
    ),
    -- ISC (10)
    (
        'EST2024630301',
        '2024630301',
        8.5,
        50.0,
        'Regular'
    ),
    (
        'EST2024630302',
        '2024630302',
        8.5,
        50.0,
        'Regular'
    ),
    (
        'EST2024630303',
        '2024630303',
        8.9,
        50.0,
        'Regular'
    ),
    (
        'EST2024630304',
        '2024630304',
        7.5,
        50.0,
        'Irregular'
    ),
    (
        'EST2024630305',
        '2024630305',
        8.3,
        50.0,
        'Regular'
    ),
    (
        'EST2024630306',
        '2024630306',
        8.1,
        50.0,
        'Irregular'
    ),
    (
        'EST2024630307',
        '2024630307',
        8.7,
        50.0,
        'Regular'
    ),
    (
        'EST2024630308',
        '2024630308',
        7.2,
        50.0,
        'Regular'
    ),
    (
        'EST2024630309',
        '2024630309',
        8.4,
        50.0,
        'Regular'
    ),
    (
        'EST2024630310',
        '2024630310',
        9.2,
        50.0,
        'Regular'
    );

DELETE FROM kardex;

INSERT INTO
    kardex (
        id,
        id_alumno,
        promedio,
        situacion_academica,
        semestres_restantes,
        creditos_obtenidos
    )
VALUES
    -- IIA (10)
    (
        'K2024630101',
        '2024630101',
        8.5,
        'Regular',
        7,
        22.5
    ),
    (
        'K2024630102',
        '2024630102',
        8.5,
        'Regular',
        7,
        22.5
    ),
    (
        'K2024630103',
        '2024630103',
        7.8,
        'Regular',
        7,
        22.5
    ),
    (
        'K2024630104',
        '2024630104',
        8.9,
        'Irregular',
        7,
        22.5
    ),
    (
        'K2024630105',
        '2024630105',
        8.2,
        'Regular',
        7,
        22.5
    ),
    (
        'K2024630106',
        '2024630106',
        7.5,
        'Regular',
        7,
        22.5
    ),
    (
        'K2024630107',
        '2024630107',
        8.6,
        'Regular',
        7,
        22.5
    ),
    (
        'K2024630108',
        '2024630108',
        9.1,
        'Regular',
        7,
        22.5
    ),
    (
        'K2024630109',
        '2024630109',
        7.9,
        'Regular',
        7,
        22.5
    ),
    (
        'K2024630110',
        '2024630110',
        8.4,
        'Regular',
        7,
        22.5
    ),
    -- LCD (10)
    (
        'K2024630201',
        '2024630201',
        9.2,
        'Regular',
        7,
        22.5
    ),
    (
        'K2024630202',
        '2024630202',
        6.5,
        'Irregular',
        7,
        22.5
    ),
    (
        'K2024630203',
        '2024630203',
        8.1,
        'Regular',
        7,
        22.5
    ),
    (
        'K2024630204',
        '2024630204',
        8.8,
        'Regular',
        7,
        22.5
    ),
    (
        'K2024630205',
        '2024630205',
        7.6,
        'Regular',
        7,
        22.5
    ),
    (
        'K2024630206',
        '2024630206',
        8.5,
        'Regular',
        7,
        22.5
    ),
    (
        'K2024630207',
        '2024630207',
        9.0,
        'Irregular',
        7,
        22.5
    ),
    (
        'K2024630208',
        '2024630208',
        7.8,
        'Regular',
        7,
        22.5
    ),
    (
        'K2024630209',
        '2024630209',
        8.2,
        'Regular',
        7,
        22.5
    ),
    (
        'K2024630210',
        '2024630210',
        8.7,
        'Regular',
        7,
        22.5
    ),
    -- ISC (10)
    (
        'K2024630301',
        '2024630301',
        8.5,
        'Regular',
        7,
        22.5
    ),
    (
        'K2024630302',
        '2024630302',
        8.5,
        'Regular',
        7,
        22.5
    ),
    (
        'K2024630303',
        '2024630303',
        8.9,
        'Regular',
        7,
        22.5
    ),
    (
        'K2024630304',
        '2024630304',
        7.5,
        'Irregular',
        7,
        22.5
    ),
    (
        'K2024630305',
        '2024630305',
        8.3,
        'Regular',
        7,
        22.5
    ),
    (
        'K2024630306',
        '2024630306',
        8.1,
        'Irregular',
        7,
        22.5
    ),
    (
        'K2024630307',
        '2024630307',
        8.7,
        'Regular',
        7,
        22.5
    ),
    (
        'K2024630308',
        '2024630308',
        7.2,
        'Regular',
        7,
        22.5
    ),
    (
        'K2024630309',
        '2024630309',
        8.4,
        'Regular',
        7,
        22.5
    ),
    (
        'K2024630310',
        '2024630310',
        9.2,
        'Regular',
        7,
        22.5
    );

-- ==================================================================
-- 7. INSCRIPCIONES DEL SEMESTRE ACTUAL (HORARIOS Y MATRÍCULAS)
-- Los alumnos están inscritos en grupos según su asignación
-- ==================================================================
DELETE FROM horario;

INSERT INTO
    horario (id, id_alumno)
VALUES
    -- Alumnos IIA (15)
    ('H2024630101', '2024630101'),
    ('H2024630102', '2024630102'),
    ('H2024630103', '2024630103'),
    ('H2024630104', '2024630104'),
    ('H2024630105', '2024630105'),
    ('H2024630106', '2024630106'),
    ('H2024630107', '2024630107'),
    ('H2024630108', '2024630108'),
    ('H2024630109', '2024630109'),
    ('H2024630110', '2024630110'),
    ('H2024630111', '2024630111'),
    ('H2024630112', '2024630112'),
    ('H2024630113', '2024630113'),
    -- Alumnos LCD (15)
    ('H2024630201', '2024630201'),
    ('H2024630202', '2024630202'),
    ('H2024630203', '2024630203'),
    ('H2024630204', '2024630204'),
    ('H2024630205', '2024630205'),
    ('H2024630206', '2024630206'),
    ('H2024630207', '2024630207'),
    ('H2024630208', '2024630208'),
    ('H2024630209', '2024630209'),
    ('H2024630210', '2024630210'),
    ('H2024630211', '2024630211'),
    ('H2024630212', '2024630212'),
    ('H2024630213', '2024630213'),
    -- Alumnos ISC (15)
    ('H2024630301', '2024630301'),
    ('H2024630302', '2024630302'),
    ('H2024630303', '2024630303'),
    ('H2024630304', '2024630304'),
    ('H2024630305', '2024630305'),
    ('H2024630306', '2024630306'),
    ('H2024630307', '2024630307'),
    ('H2024630308', '2024630308'),
    ('H2024630309', '2024630309'),
    ('H2024630310', '2024630310'),
    ('H2024630311', '2024630311'),
    ('H2024630312', '2024630312'),
    ('H2024630313', '2024630313'),
    -- Horario Alumno Desfasado (cursando materias de 3ro, 4to y 5to)
    ('H2022630400', '2022630400'),
    -- Horario Alumno Sin Semestres (cursando materias pendientes)
    ('H2019630500', '2019630500'),
    -- Horario Alumno Regular 8vo Semestre IIA
    ('H2021630600', '2021630600'),
    -- Horario Alumno Regular 7mo Semestre IIA con Reprobadas
    ('H2022630700', '2022630700'),
    -- Horario Alumno Regular 6to Semestre IIA con Reprobadas Recuperadas
    ('H2023630800', '2023630800'),
    -- Horario Alumno Regular 5to Semestre IIA sin Reprobadas
    ('H2024630900', '2024630900'),
    -- Horario Alumno Regular 4to Semestre IIA con Materias Recuperadas
    ('H2025631000', '2025631000'),
    -- Horario Alumno Regular 3er Semestre ISC sin Reprobadas
    ('H2026631100', '2026631100'),
    -- Horario Alumno Regular 2do Semestre ISC con Reprobadas
    ('H2027631200', '2027631200');

DELETE FROM ua_aprobada;

INSERT INTO
    ua_aprobada (
        id,
        id_kardex,
        unidad_aprendizaje,
        calificacion_final,
        semestre,
        periodo,
        fecha,
        metodo_aprobado
    )
VALUES (
        'UAA0001',
        'K2024630101',
        'Fundamentos de Programación',
        8.9,
        1,
        '2024-1',
        '2024-06-20',
        'Extraordinario '
    ),
    (
        'UAA0002',
        'K2024630101',
        'Matemáticas Discretas',
        8.8,
        1,
        '2024-1',
        '2024-06-20',
        'Ordinario'
    ),
    (
        'UAA0003',
        'K2024630101',
        'Cálculo',
        7.9,
        1,
        '2024-1',
        '2024-06-20',
        'Ordinario'
    ),
    (
        'UAA0004',
        'K2024630102',
        'Fundamentos de Programación',
        8.5,
        1,
        '2024-1',
        '2024-06-20',
        'Ordinario'
    ),
    (
        'UAA0005',
        'K2024630102',
        'Matemáticas Discretas',
        8.2,
        1,
        '2024-1',
        '2024-06-20',
        'Ordinario'
    ),
    (
        'UAA0006',
        'K2024630102',
        'Cálculo',
        8.1,
        1,
        '2024-1',
        '2024-06-20',
        'Ordinario'
    ),
    (
        'UAA0007',
        'K2024630103',
        'Fundamentos de Programación',
        7.8,
        1,
        '2024-1',
        '2024-06-20',
        'Extraordinario '
    ),
    (
        'UAA0008',
        'K2024630103',
        'Matemáticas Discretas',
        7.5,
        1,
        '2024-1',
        '2024-06-20',
        'Ordinario'
    ),
    (
        'UAA0009',
        'K2024630103',
        'Cálculo',
        8.2,
        1,
        '2024-1',
        '2024-06-20',
        'Ordinario'
    ),
    (
        'UAA0010',
        'K2024630104',
        'Fundamentos de Programación',
        8.9,
        1,
        '2024-1',
        '2024-06-20',
        'Ordinario'
    ),
    (
        'UAA0011',
        'K2024630104',
        'Matemáticas Discretas',
        9.1,
        1,
        '2024-1',
        '2024-06-20',
        'Ordinario'
    ),
    (
        'UAA0012',
        'K2024630104',
        'Cálculo',
        8.7,
        1,
        '2024-1',
        '2024-06-20',
        'Extraordinario '
    ),
    (
        'UAA0013',
        'K2024630105',
        'Fundamentos de Programación',
        8.2,
        1,
        '2024-1',
        '2024-06-20',
        'Ordinario'
    ),
    (
        'UAA0014',
        'K2024630105',
        'Matemáticas Discretas',
        8.0,
        1,
        '2024-1',
        '2024-06-20',
        'Ordinario'
    ),
    (
        'UAA0015',
        'K2024630105',
        'Cálculo',
        8.4,
        1,
        '2024-1',
        '2024-06-20',
        'Extraordinario '
    ),
    (
        'UAA0016',
        'K2024630106',
        'Fundamentos de Programación',
        7.5,
        1,
        '2024-1',
        '2024-06-20',
        'Ordinario'
    ),
    (
        'UAA0017',
        'K2024630106',
        'Matemáticas Discretas',
        7.3,
        1,
        '2024-1',
        '2024-06-20',
        'Extraordinario en recurse'
    ),
    (
        'UAA0018',
        'K2024630106',
        'Cálculo',
        7.6,
        1,
        '2024-1',
        '2024-06-20',
        'Extraordinario en recurse'
    ),
    (
        'UAA0019',
        'K2024630107',
        'Fundamentos de Programación',
        8.6,
        1,
        '2024-1',
        '2024-06-20',
        'Recurse'
    ),
    (
        'UAA0020',
        'K2024630107',
        'Matemáticas Discretas',
        8.5,
        1,
        '2024-1',
        '2024-06-20',
        'Recurse'
    ),
    (
        'UAA0021',
        'K2024630107',
        'Cálculo',
        8.7,
        1,
        '2024-1',
        '2024-06-20',
        'Ordinario'
    ),
    (
        'UAA0022',
        'K2024630108',
        'Fundamentos de Programación',
        9.1,
        1,
        '2024-1',
        '2024-06-20',
        'Extraordinario en recurse'
    ),
    (
        'UAA0023',
        'K2024630108',
        'Matemáticas Discretas',
        9.0,
        1,
        '2024-1',
        '2024-06-20',
        'Extraordinario '
    ),
    (
        'UAA0024',
        'K2024630108',
        'Cálculo',
        9.3,
        1,
        '2024-1',
        '2024-06-20',
        'Recurse'
    ),
    (
        'UAA0025',
        'K2024630109',
        'Fundamentos de Programación',
        7.9,
        1,
        '2024-1',
        '2024-06-20',
        'Recurse'
    ),
    (
        'UAA0026',
        'K2024630109',
        'Matemáticas Discretas',
        7.8,
        1,
        '2024-1',
        '2024-06-20',
        'Ordinario'
    ),
    (
        'UAA0027',
        'K2024630109',
        'Cálculo',
        8.0,
        1,
        '2024-1',
        '2024-06-20',
        'Extraordinario '
    ),
    (
        'UAA0028',
        'K2024630110',
        'Fundamentos de Programación',
        8.4,
        1,
        '2024-1',
        '2024-06-20',
        'Ordinario'
    ),
    (
        'UAA0029',
        'K2024630110',
        'Matemáticas Discretas',
        8.5,
        1,
        '2024-1',
        '2024-06-20',
        'Extraordinario en recurse'
    ),
    (
        'UAA0030',
        'K2024630110',
        'Cálculo',
        8.2,
        1,
        '2024-1',
        '2024-06-20',
        'Recurse'
    ),
    -- LCD historial (10 x 3 materias)
    (
        'UAA0031',
        'K2024630201',
        'Fundamentos de Programación',
        9.2,
        1,
        '2024-1',
        '2024-06-20',
        'Extraordinario '
    ),
    (
        'UAA0032',
        'K2024630201',
        'Fundamentos de Programación',
        9.4,
        1,
        '2024-1',
        '2024-06-20',
        'Ordinario'
    ),
    (
        'UAA0033',
        'K2024630201',
        'Cálculo',
        8.9,
        1,
        '2024-1',
        '2024-06-20',
        'Ordinario'
    ),
    (
        'UAA0034',
        'K2024630202',
        'Fundamentos de Programación',
        6.5,
        1,
        '2024-1',
        '2024-06-20',
        'Ordinario'
    ),
    (
        'UAA0035',
        'K2024630202',
        'Matemáticas Discretas',
        6.8,
        1,
        '2024-1',
        '2024-06-20',
        'Recurse'
    ),
    (
        'UAA0036',
        'K2024630202',
        'Cálculo',
        6.0,
        1,
        '2024-1',
        '2024-06-20',
        'Recurse'
    ),
    (
        'UAA0037',
        'K2024630203',
        'Fundamentos de Programación',
        8.1,
        1,
        '2024-1',
        '2024-06-20',
        'Ordinario'
    ),
    (
        'UAA0038',
        'K2024630203',
        'Matemáticas Discretas',
        8.0,
        1,
        '2024-1',
        '2024-06-20',
        'Recurse'
    ),
    (
        'UAA0039',
        'K2024630203',
        'Cálculo',
        8.2,
        1,
        '2024-1',
        '2024-06-20',
        'Extraordinario '
    ),
    (
        'UAA0040',
        'K2024630204',
        'Fundamentos de Programación',
        8.8,
        1,
        '2024-1',
        '2024-06-20',
        'Extraordinario en recurse'
    ),
    (
        'UAA0041',
        'K2024630204',
        'Matemáticas Discretas',
        8.9,
        1,
        '2024-1',
        '2024-06-20',
        'Ordinario'
    ),
    (
        'UAA0042',
        'K2024630204',
        'Cálculo',
        8.7,
        1,
        '2024-1',
        '2024-06-20',
        'Extraordinario '
    ),
    (
        'UAA0043',
        'K2024630205',
        'Fundamentos de Programación',
        7.6,
        1,
        '2024-1',
        '2024-06-20',
        'Extraordinario '
    ),
    (
        'UAA0044',
        'K2024630205',
        'Matemáticas Discretas',
        7.5,
        1,
        '2024-1',
        '2024-06-20',
        'Ordinario'
    ),
    (
        'UAA0045',
        'K2024630205',
        'Cálculo',
        7.7,
        1,
        '2024-1',
        '2024-06-20',
        'Ordinario'
    ),
    (
        'UAA0046',
        'K2024630206',
        'Fundamentos de Programación',
        8.5,
        1,
        '2024-1',
        '2024-06-20',
        'Ordinario'
    ),
    (
        'UAA0047',
        'K2024630206',
        'Matemáticas Discretas',
        8.4,
        1,
        '2024-1',
        '2024-06-20',
        'Ordinario'
    ),
    (
        'UAA0048',
        'K2024630206',
        'Cálculo',
        8.6,
        1,
        '2024-1',
        '2024-06-20',
        'Ordinario'
    ),
    (
        'UAA0049',
        'K2024630207',
        'Fundamentos de Programación',
        9.0,
        1,
        '2024-1',
        '2024-06-20',
        'Ordinario'
    ),
    (
        'UAA0050',
        'K2024630207',
        'Matemáticas Discretas',
        9.1,
        1,
        '2024-1',
        '2024-06-20',
        'Recurse'
    ),
    (
        'UAA0051',
        'K2024630207',
        'Cálculo',
        8.9,
        1,
        '2024-1',
        '2024-06-20',
        'Ordinario'
    ),
    (
        'UAA0052',
        'K2024630208',
        'Fundamentos de Programación',
        7.8,
        1,
        '2024-1',
        '2024-06-20',
        'Ordinario'
    ),
    (
        'UAA0053',
        'K2024630208',
        'Matemáticas Discretas',
        7.7,
        1,
        '2024-1',
        '2024-06-20',
        'Ordinario'
    ),
    (
        'UAA0054',
        'K2024630208',
        'Cálculo',
        7.9,
        1,
        '2024-1',
        '2024-06-20',
        'Recurse'
    ),
    (
        'UAA0055',
        'K2024630209',
        'Fundamentos de Programación',
        8.2,
        1,
        '2024-1',
        '2024-06-20',
        'Ordinario'
    ),
    (
        'UAA0056',
        'K2024630209',
        'Matemáticas Discretas',
        8.1,
        1,
        '2024-1',
        '2024-06-20',
        'Ordinario'
    ),
    (
        'UAA0057',
        'K2024630209',
        'Cálculo',
        8.4,
        1,
        '2024-1',
        '2024-06-20',
        'Ordinario'
    ),
    (
        'UAA0058',
        'K2024630210',
        'Fundamentos de Programación',
        8.7,
        1,
        '2024-1',
        '2024-06-20',
        'Ordinario'
    ),
    (
        'UAA0059',
        'K2024630210',
        'Matemáticas Discretas',
        8.8,
        1,
        '2024-1',
        '2024-06-20',
        'Extraordinario en recurse'
    ),
    (
        'UAA0060',
        'K2024630210',
        'Cálculo',
        8.6,
        1,
        '2024-1',
        '2024-06-20',
        'Extraordinario en recurse'
    ),
    -- ISC historial (10 x 3 materias)
    (
        'UAA0061',
        'K2024630301',
        'Fundamentos de Programación',
        8.5,
        1,
        '2024-1',
        '2024-06-20',
        'Extraordinario '
    ),
    (
        'UAA0062',
        'K2024630301',
        'Matemáticas Discretas',
        8.6,
        1,
        '2024-1',
        '2024-06-20',
        'Ordinario'
    ),
    (
        'UAA0063',
        'K2024630301',
        'Cálculo',
        8.3,
        1,
        '2024-1',
        '2024-06-20',
        'Ordinario'
    ),
    (
        'UAA0064',
        'K2024630302',
        'Fundamentos de Programación',
        8.5,
        1,
        '2024-1',
        '2024-06-20',
        'Ordinario'
    ),
    (
        'UAA0065',
        'K2024630302',
        'Matemáticas Discretas',
        8.4,
        1,
        '2024-1',
        '2024-06-20',
        'Ordinario'
    ),
    (
        'UAA0066',
        'K2024630302',
        'Cálculo',
        8.6,
        1,
        '2024-1',
        '2024-06-20',
        'Ordinario'
    ),
    (
        'UAA0067',
        'K2024630303',
        'Fundamentos de Programación',
        8.9,
        1,
        '2024-1',
        '2024-06-20',
        'Ordinario'
    ),
    (
        'UAA0068',
        'K2024630303',
        'Matemáticas Discretas',
        9.0,
        1,
        '2024-1',
        '2024-06-20',
        'Extraordinario en recurse'
    ),
    (
        'UAA0069',
        'K2024630303',
        'Cálculo',
        8.8,
        1,
        '2024-1',
        '2024-06-20',
        'Recurse'
    ),
    (
        'UAA0070',
        'K2024630304',
        'Fundamentos de Programación',
        7.5,
        1,
        '2024-1',
        '2024-06-20',
        'Recurse'
    ),
    (
        'UAA0071',
        'K2024630304',
        'Matemáticas Discretas',
        7.4,
        1,
        '2024-1',
        '2024-06-20',
        'Ordinario'
    ),
    (
        'UAA0072',
        'K2024630304',
        'Cálculo',
        7.6,
        1,
        '2024-1',
        '2024-06-20',
        'Ordinario'
    ),
    (
        'UAA0073',
        'K2024630305',
        'Fundamentos de Programación',
        8.3,
        1,
        '2024-1',
        '2024-06-20',
        'Ordinario'
    ),
    (
        'UAA0074',
        'K2024630305',
        'Matemáticas Discretas',
        8.2,
        1,
        '2024-1',
        '2024-06-20',
        'Ordinario'
    ),
    (
        'UAA0075',
        'K2024630305',
        'Cálculo',
        8.5,
        1,
        '2024-1',
        '2024-06-20',
        'Extraordinario '
    ),
    (
        'UAA0076',
        'K2024630306',
        'Fundamentos de Programación',
        8.1,
        1,
        '2024-1',
        '2024-06-20',
        'Ordinario'
    ),
    (
        'UAA0077',
        'K2024630306',
        'Matemáticas Discretas',
        8.0,
        1,
        '2024-1',
        '2024-06-20',
        'ETS'
    ),
    (
        'UAA0078',
        'K2024630306',
        'Cálculo',
        8.3,
        1,
        '2024-1',
        '2024-06-20',
        'ETS'
    ),
    (
        'UAA0079',
        'K2024630307',
        'Fundamentos de Programación',
        8.7,
        1,
        '2024-1',
        '2024-06-20',
        'Ordinario'
    ),
    (
        'UAA0080',
        'K2024630307',
        'Matemáticas Discretas',
        8.8,
        1,
        '2024-1',
        '2024-06-20',
        'ETS'
    ),
    (
        'UAA0081',
        'K2024630307',
        'Cálculo',
        8.6,
        1,
        '2024-1',
        '2024-06-20',
        'ETS'
    ),
    (
        'UAA0082',
        'K2024630308',
        'Fundamentos de Programación',
        7.2,
        1,
        '2024-1',
        '2024-06-20',
        'Extraordinario '
    ),
    (
        'UAA0083',
        'K2024630308',
        'Matemáticas Discretas',
        7.1,
        1,
        '2024-1',
        '2024-06-20',
        'Ordinario'
    ),
    (
        'UAA0084',
        'K2024630308',
        'Cálculo',
        7.4,
        1,
        '2024-1',
        '2024-06-20',
        'Ordinario'
    ),
    (
        'UAA0085',
        'K2024630309',
        'Fundamentos de Programación',
        8.4,
        1,
        '2024-1',
        '2024-06-20',
        'Ordinario'
    ),
    (
        'UAA0086',
        'K2024630309',
        'Matemáticas Discretas',
        8.3,
        1,
        '2024-1',
        '2024-06-20',
        'Ordinario'
    ),
    (
        'UAA0087',
        'K2024630309',
        'Cálculo',
        8.6,
        1,
        '2024-1',
        '2024-06-20',
        'ETS'
    ),
    (
        'UAA0088',
        'K2024630310',
        'Fundamentos de Programación',
        9.2,
        1,
        '2024-1',
        '2024-06-20',
        'Extraordinario '
    ),
    (
        'UAA0089',
        'K2024630310',
        'Matemáticas Discretas',
        9.3,
        1,
        '2024-1',
        '2024-06-20',
        'ETS'
    ),
    (
        'UAA0090',
        'K2024630310',
        'Cálculo',
        9.1,
        1,
        '2024-1',
        '2024-06-20',
        'ETS'
    ),
    -- --------------------------------------------------
    -- ADICION: 10 UAs APROBADAS ADICIONALES POR ALUMNO
    -- Para cada `kardex` K2024630xxxx se agregan 10 registros
    -- Los nombres se eligieron para ser coherentes con la carrera
    -- y evitar duplicar los tres asuntos actuales en `mat_inscritos`.
    -- IDs generados de UAA0091 hasta UAA0390 (300 filas)
    -- ==================================================

-- IIA (K2024630101 .. K2024630110) 10 UAs por alumno
(
    'UAA0091',
    'K2024630101',
    'Programación Orientada a Objetos',
    8.6,
    2,
    '2023-2',
    '2023-12-15',
    'Ordinario'
),
(
    'UAA0092',
    'K2024630101',
    'Algoritmos y Estructuras de Datos',
    8.4,
    2,
    '2023-2',
    '2023-12-15',
    'Ordinario'
),
(
    'UAA0093',
    'K2024630101',
    'Ingeniería de Software',
    8.7,
    3,
    '2024-1',
    '2024-06-20',
    'Ordinario'
),
(
    'UAA0094',
    'K2024630101',
    'Sistemas Operativos',
    8.2,
    3,
    '2024-1',
    '2024-06-20',
    'ETS'
),
(
    'UAA0095',
    'K2024630101',
    'Bases de Datos',
    8.9,
    3,
    '2024-1',
    '2024-06-20',
    'ETS'
),
(
    'UAA0096',
    'K2024630101',
    'Álgebra Lineal',
    7.8,
    2,
    '2023-2',
    '2023-12-15',
    'Ordinario'
),
(
    'UAA0097',
    'K2024630101',
    'Álgebra Lineal',
    8.0,
    2,
    '2023-2',
    '2023-12-15',
    'Ordinario'
),
(
    'UAA0098',
    'K2024630101',
    'Probabilidad y Estadística',
    8.3,
    2,
    '2023-2',
    '2023-12-15',
    'Ordinario'
),
(
    'UAA0099',
    'K2024630101',
    'Teoría de la Computación',
    9.0,
    4,
    '2024-2',
    '2024-12-15',
    'Ordinario'
),
(
    'UAA0100',
    'K2024630101',
    'Matemáticas Avanzadas para la Ingeniería',
    9.1,
    4,
    '2024-2',
    '2024-12-15',
    'Ordinario'
),
(
    'UAA0101',
    'K2024630102',
    'Algoritmos y Estructuras de Datos',
    8.1,
    2,
    '2023-2',
    '2023-12-15',
    'Ordinario'
),
(
    'UAA0102',
    'K2024630102',
    'Álgebra Lineal',
    7.9,
    2,
    '2023-2',
    '2023-12-15',
    'ETS'
),
(
    'UAA0103',
    'K2024630102',
    'Ingeniería de Software',
    8.0,
    3,
    '2024-1',
    '2024-06-20',
    'Ordinario'
),
(
    'UAA0104',
    'K2024630102',
    'Sistemas Operativos',
    7.8,
    3,
    '2024-1',
    '2024-06-20',
    'Ordinario'
),
(
    'UAA0105',
    'K2024630102',
    'Bases de Datos',
    8.2,
    3,
    '2024-1',
    '2024-06-20',
    'Ordinario'
),
(
    'UAA0106',
    'K2024630102',
    'Mecánica y Electromagnetismo',
    7.5,
    2,
    '2023-2',
    '2023-12-15',
    'Ordinario'
),
(
    'UAA0107',
    'K2024630102',
    'Álgebra Lineal',
    7.7,
    2,
    '2023-2',
    '2023-12-15',
    'Ordinario'
),
(
    'UAA0108',
    'K2024630102',
    'Probabilidad y Estadística',
    8.0,
    2,
    '2023-2',
    '2023-12-15',
    'Ordinario'
),
(
    'UAA0109',
    'K2024630102',
    'Teoría de la Computación',
    8.6,
    4,
    '2024-2',
    '2024-12-15',
    'Ordinario'
),
(
    'UAA0110',
    'K2024630102',
    'Matemáticas Avanzadas para la Ingeniería',
    8.9,
    4,
    '2024-2',
    '2024-12-15',
    'Ordinario'
),
(
    'UAA0111',
    'K2024630103',
    'Algoritmos y Estructuras de Datos',
    8.3,
    2,
    '2023-2',
    '2023-12-15',
    'ETS'
),
(
    'UAA0112',
    'K2024630103',
    'Álgebra Lineal',
    8.0,
    2,
    '2023-2',
    '2023-12-15',
    'Ordinario'
),
(
    'UAA0113',
    'K2024630103',
    'Ingeniería de Software',
    8.4,
    3,
    '2024-1',
    '2024-06-20',
    'Ordinario'
),
(
    'UAA0114',
    'K2024630103',
    'Sistemas Operativos',
    7.9,
    3,
    '2024-1',
    '2024-06-20',
    'Ordinario'
),
(
    'UAA0115',
    'K2024630103',
    'Bases de Datos',
    8.5,
    3,
    '2024-1',
    '2024-06-20',
    'Ordinario'
),
(
    'UAA0116',
    'K2024630103',
    'Mecánica y Electromagnetismo',
    7.6,
    2,
    '2023-2',
    '2023-12-15',
    'Ordinario'
),
(
    'UAA0117',
    'K2024630103',
    'Álgebra Lineal',
    7.8,
    2,
    '2023-2',
    '2023-12-15',
    'Ordinario'
),
(
    'UAA0118',
    'K2024630103',
    'Probabilidad y Estadística',
    8.1,
    2,
    '2023-2',
    '2023-12-15',
    'Ordinario'
),
(
    'UAA0119',
    'K2024630103',
    'Teoría de la Computación',
    8.7,
    4,
    '2024-2',
    '2024-12-15',
    'Ordinario'
),
(
    'UAA0120',
    'K2024630103',
    'Matemáticas Avanzadas para la Ingeniería',
    8.8,
    4,
    '2024-2',
    '2024-12-15',
    'Ordinario'
),
(
    'UAA0121',
    'K2024630104',
    'Algoritmos y Estructuras de Datos',
    8.9,
    2,
    '2023-2',
    '2023-12-15',
    'Ordinario'
),
(
    'UAA0122',
    'K2024630104',
    'Álgebra Lineal',
    8.6,
    2,
    '2023-2',
    '2023-12-15',
    'Ordinario'
),
(
    'UAA0123',
    'K2024630104',
    'Ingeniería de Software',
    8.7,
    3,
    '2024-1',
    '2024-06-20',
    'Ordinario'
),
(
    'UAA0124',
    'K2024630104',
    'Sistemas Operativos',
    8.2,
    3,
    '2024-1',
    '2024-06-20',
    'Ordinario'
),
(
    'UAA0125',
    'K2024630104',
    'Bases de Datos',
    8.4,
    3,
    '2024-1',
    '2024-06-20',
    'ETS'
),
(
    'UAA0126',
    'K2024630104',
    'Mecánica y Electromagnetismo',
    8.0,
    2,
    '2023-2',
    '2023-12-15',
    'ETS'
),
(
    'UAA0127',
    'K2024630104',
    'Álgebra Lineal',
    8.1,
    2,
    '2023-2',
    '2023-12-15',
    'ETS'
),
(
    'UAA0128',
    'K2024630104',
    'Probabilidad y Estadística',
    8.3,
    2,
    '2023-2',
    '2023-12-15',
    'Ordinario'
),
(
    'UAA0129',
    'K2024630104',
    'Teoría de la Computación',
    9.0,
    4,
    '2024-2',
    '2024-12-15',
    'Ordinario'
),
(
    'UAA0130',
    'K2024630104',
    'Matemáticas Avanzadas para la Ingeniería',
    9.2,
    4,
    '2024-2',
    '2024-12-15',
    'Ordinario'
),
(
    'UAA0131',
    'K2024630105',
    'Algoritmos y Estructuras de Datos',
    7.9,
    2,
    '2023-2',
    '2023-12-15',
    'Ordinario'
),
(
    'UAA0132',
    'K2024630105',
    'Álgebra Lineal',
    7.7,
    2,
    '2023-2',
    '2023-12-15',
    'Ordinario'
),
(
    'UAA0133',
    'K2024630105',
    'Ingeniería de Software',
    8.0,
    3,
    '2024-1',
    '2024-06-20',
    'Ordinario'
),
(
    'UAA0134',
    'K2024630105',
    'Sistemas Operativos',
    7.6,
    3,
    '2024-1',
    '2024-06-20',
    'Extraordinario en recurse'
),
(
    'UAA0135',
    'K2024630105',
    'Bases de Datos',
    8.1,
    3,
    '2024-1',
    '2024-06-20',
    'ETS'
),
(
    'UAA0136',
    'K2024630105',
    'Mecánica y Electromagnetismo',
    7.4,
    2,
    '2023-2',
    '2023-12-15',
    'Ordinario'
),
(
    'UAA0137',
    'K2024630105',
    'Álgebra Lineal',
    7.5,
    2,
    '2023-2',
    '2023-12-15',
    'Ordinario'
),
(
    'UAA0138',
    'K2024630105',
    'Probabilidad y Estadística',
    7.8,
    2,
    '2023-2',
    '2023-12-15',
    'Ordinario'
),
(
    'UAA0139',
    'K2024630105',
    'Teoría de la Computación',
    8.4,
    4,
    '2024-2',
    '2024-12-15',
    'Ordinario'
),
(
    'UAA0140',
    'K2024630105',
    'Matemáticas Avanzadas para la Ingeniería',
    8.5,
    4,
    '2024-2',
    '2024-12-15',
    'Ordinario'
),
(
    'UAA0141',
    'K2024630106',
    'Algoritmos y Estructuras de Datos',
    8.0,
    2,
    '2023-2',
    '2023-12-15',
    'Ordinario'
),
(
    'UAA0142',
    'K2024630106',
    'Álgebra Lineal',
    7.8,
    2,
    '2023-2',
    '2023-12-15',
    'Ordinario'
),
(
    'UAA0143',
    'K2024630106',
    'Ingeniería de Software',
    8.2,
    3,
    '2024-1',
    '2024-06-20',
    'Ordinario'
),
(
    'UAA0144',
    'K2024630106',
    'Sistemas Operativos',
    7.9,
    3,
    '2024-1',
    '2024-06-20',
    'Ordinario'
),
(
    'UAA0145',
    'K2024630106',
    'Bases de Datos',
    8.3,
    3,
    '2024-1',
    '2024-06-20',
    'Ordinario'
),
(
    'UAA0146',
    'K2024630106',
    'Mecánica y Electromagnetismo',
    7.6,
    2,
    '2023-2',
    '2023-12-15',
    'Ordinario'
),
(
    'UAA0147',
    'K2024630106',
    'Álgebra Lineal',
    7.7,
    2,
    '2023-2',
    '2023-12-15',
    'Ordinario'
),
(
    'UAA0148',
    'K2024630106',
    'Probabilidad y Estadística',
    7.9,
    2,
    '2023-2',
    '2023-12-15',
    'Extraordinario en recurse'
),
(
    'UAA0149',
    'K2024630106',
    'Teoría de la Computación',
    8.6,
    4,
    '2024-2',
    '2024-12-15',
    'Ordinario'
),
(
    'UAA0150',
    'K2024630106',
    'Matemáticas Avanzadas para la Ingeniería',
    8.7,
    4,
    '2024-2',
    '2024-12-15',
    'Ordinario'
),
(
    'UAA0151',
    'K2024630107',
    'Algoritmos y Estructuras de Datos',
    8.4,
    2,
    '2023-2',
    '2023-12-15',
    'Extraordinario en recurse'
),
(
    'UAA0152',
    'K2024630107',
    'Álgebra Lineal',
    8.2,
    2,
    '2023-2',
    '2023-12-15',
    'Ordinario'
),
(
    'UAA0153',
    'K2024630107',
    'Ingeniería de Software',
    8.5,
    3,
    '2024-1',
    '2024-06-20',
    'Extraordinario en recurse'
),
(
    'UAA0154',
    'K2024630107',
    'Sistemas Operativos',
    8.0,
    3,
    '2024-1',
    '2024-06-20',
    'Ordinario'
),
(
    'UAA0155',
    'K2024630107',
    'Bases de Datos',
    8.6,
    3,
    '2024-1',
    '2024-06-20',
    'Ordinario'
),
(
    'UAA0156',
    'K2024630107',
    'Mecánica y Electromagnetismo',
    7.9,
    2,
    '2023-2',
    '2023-12-15',
    'Ordinario'
),
(
    'UAA0157',
    'K2024630107',
    'Álgebra Lineal',
    8.0,
    2,
    '2023-2',
    '2023-12-15',
    'Ordinario'
),
(
    'UAA0158',
    'K2024630107',
    'Probabilidad y Estadística',
    8.1,
    2,
    '2023-2',
    '2023-12-15',
    'Ordinario'
),
(
    'UAA0159',
    'K2024630107',
    'Teoría de la Computación',
    8.8,
    4,
    '2024-2',
    '2024-12-15',
    'Ordinario'
),
(
    'UAA0160',
    'K2024630107',
    'Matemáticas Avanzadas para la Ingeniería',
    8.9,
    4,
    '2024-2',
    '2024-12-15',
    'Ordinario'
),
(
    'UAA0161',
    'K2024630108',
    'Algoritmos y Estructuras de Datos',
    9.0,
    2,
    '2023-2',
    '2023-12-15',
    'Ordinario'
),
(
    'UAA0162',
    'K2024630108',
    'Álgebra Lineal',
    8.7,
    2,
    '2023-2',
    '2023-12-15',
    'Ordinario'
),
(
    'UAA0163',
    'K2024630108',
    'Ingeniería de Software',
    8.9,
    3,
    '2024-1',
    '2024-06-20',
    'Ordinario'
),
(
    'UAA0164',
    'K2024630108',
    'Sistemas Operativos',
    8.4,
    3,
    '2024-1',
    '2024-06-20',
    'Ordinario'
),
(
    'UAA0165',
    'K2024630108',
    'Bases de Datos',
    8.8,
    3,
    '2024-1',
    '2024-06-20',
    'Ordinario'
),
(
    'UAA0166',
    'K2024630108',
    'Mecánica y Electromagnetismo',
    8.1,
    2,
    '2023-2',
    '2023-12-15',
    'Ordinario'
),
(
    'UAA0167',
    'K2024630108',
    'Álgebra Lineal',
    8.2,
    2,
    '2023-2',
    '2023-12-15',
    'Ordinario'
),
(
    'UAA0168',
    'K2024630108',
    'Probabilidad y Estadística',
    8.5,
    2,
    '2023-2',
    '2023-12-15',
    'Ordinario'
),
(
    'UAA0169',
    'K2024630108',
    'Teoría de la Computación',
    9.1,
    4,
    '2024-2',
    '2024-12-15',
    'Ordinario'
),
(
    'UAA0170',
    'K2024630108',
    'Matemáticas Avanzadas para la Ingeniería',
    9.3,
    4,
    '2024-2',
    '2024-12-15',
    'Ordinario'
),
(
    'UAA0171',
    'K2024630109',
    'Algoritmos y Estructuras de Datos',
    7.7,
    2,
    '2023-2',
    '2023-12-15',
    'Ordinario'
),
(
    'UAA0172',
    'K2024630109',
    'Álgebra Lineal',
    7.5,
    2,
    '2023-2',
    '2023-12-15',
    'Ordinario'
),
(
    'UAA0173',
    'K2024630109',
    'Ingeniería de Software',
    7.9,
    3,
    '2024-1',
    '2024-06-20',
    'Ordinario'
),
(
    'UAA0174',
    'K2024630109',
    'Sistemas Operativos',
    7.4,
    3,
    '2024-1',
    '2024-06-20',
    'Extraordinario en recurse'
),
(
    'UAA0175',
    'K2024630109',
    'Bases de Datos',
    8.0,
    3,
    '2024-1',
    '2024-06-20',
    'Ordinario'
),
(
    'UAA0176',
    'K2024630109',
    'Mecánica y Electromagnetismo',
    7.2,
    2,
    '2023-2',
    '2023-12-15',
    'Ordinario'
),
(
    'UAA0177',
    'K2024630109',
    'Álgebra Lineal',
    7.3,
    2,
    '2023-2',
    '2023-12-15',
    'Ordinario'
),
(
    'UAA0178',
    'K2024630109',
    'Probabilidad y Estadística',
    7.6,
    2,
    '2023-2',
    '2023-12-15',
    'Ordinario'
),
(
    'UAA0179',
    'K2024630109',
    'Teoría de la Computación',
    8.2,
    4,
    '2024-2',
    '2024-12-15',
    'Ordinario'
),
(
    'UAA0180',
    'K2024630109',
    'Matemáticas Avanzadas para la Ingeniería',
    8.3,
    4,
    '2024-2',
    '2024-12-15',
    'Extraordinario en recurse'
),
(
    'UAA0181',
    'K2024630110',
    'Algoritmos y Estructuras de Datos',
    8.8,
    2,
    '2023-2',
    '2023-12-15',
    'Ordinario'
),
(
    'UAA0182',
    'K2024630110',
    'Álgebra Lineal',
    8.5,
    2,
    '2023-2',
    '2023-12-15',
    'Extraordinario en recurse'
),
(
    'UAA0183',
    'K2024630110',
    'Ingeniería de Software',
    8.7,
    3,
    '2024-1',
    '2024-06-20',
    'Ordinario'
),
(
    'UAA0184',
    'K2024630110',
    'Sistemas Operativos',
    8.1,
    3,
    '2024-1',
    '2024-06-20',
    'Ordinario'
),
(
    'UAA0185',
    'K2024630110',
    'Bases de Datos',
    8.6,
    3,
    '2024-1',
    '2024-06-20',
    'Ordinario'
),
(
    'UAA0186',
    'K2024630110',
    'Cálculo Multivariable',
    8.0,
    2,
    '2023-2',
    '2023-12-15',
    'Ordinario'
),
(
    'UAA0187',
    'K2024630110',
    'Álgebra Lineal',
    8.1,
    2,
    '2023-2',
    '2023-12-15',
    'Ordinario'
),
(
    'UAA0188',
    'K2024630110',
    'Probabilidad y Estadística',
    8.3,
    2,
    '2023-2',
    '2023-12-15',
    'Ordinario'
),
(
    'UAA0189',
    'K2024630110',
    'Desarrollo de Aplicaciones Web',
    9.0,
    4,
    '2024-2',
    '2024-12-15',
    'Ordinario'
),
(
    'UAA0190',
    'K2024630110',
    'Cómputo de Alto Desempeño',
    9.1,
    4,
    '2024-2',
    '2024-12-15',
    'Ordinario'
),

-- LCD (K2024630201 .. K2024630210)
(
    'UAA0191',
    'K2024630201',
    'Programación para Datos',
    9.0,
    2,
    '2023-2',
    '2023-12-15',
    'Ordinario'
),
(
    'UAA0192',
    'K2024630201',
    'Álgebra Lineal',
    9.2,
    2,
    '2023-2',
    '2023-12-15',
    'Ordinario'
),
(
    'UAA0193',
    'K2024630201',
    'Cálculo Aplicado',
    8.8,
    2,
    '2023-2',
    '2023-12-15',
    'Ordinario'
),
(
    'UAA0194',
    'K2024630201',
    'Ecuaciones Diferenciales',
    9.1,
    3,
    '2024-1',
    '2024-06-20',
    'Extraordinario en recurse'
),
(
    'UAA0195',
    'K2024630201',
    'Minería de Datos',
    9.3,
    4,
    '2024-2',
    '2024-12-15',
    'Ordinario'
),
(
    'UAA0196',
    'K2024630201',
    'Probabilidad y Estadística',
    9.0,
    4,
    '2024-2',
    '2024-12-15',
    'Ordinario'
),
(
    'UAA0197',
    'K2024630201',
    'Matemáticas Avanzadas para la Ingeniería',
    8.9,
    4,
    '2024-2',
    '2024-12-15',
    'Ordinario'
),
(
    'UAA0198',
    'K2024630201',
    'Electrónica Analógica',
    9.1,
    4,
    '2024-2',
    '2024-12-15',
    'Ordinario'
),
(
    'UAA0199',
    'K2024630201',
    'Mecánica y Electromagnetismo',
    8.4,
    2,
    '2023-2',
    '2023-12-15',
    'Ordinario'
),
(
    'UAA0200',
    'K2024630201',
    'Ingeniería, Ética y Sociedad',
    9.0,
    2,
    '2023-2',
    '2023-12-15',
    'Ordinario'
),
(
    'UAA0201',
    'K2024630202',
    'Algoritmos y Estructuras de Datos',
    6.8,
    2,
    '2023-2',
    '2023-12-15',
    'Ordinario'
),
(
    'UAA0202',
    'K2024630202',
    'Álgebra Lineal',
    6.9,
    2,
    '2023-2',
    '2023-12-15',
    'Ordinario'
),
(
    'UAA0203',
    'K2024630202',
    'Cálculo Multivariable',
    7.0,
    2,
    '2023-2',
    '2023-12-15',
    'Ordinario'
),
(
    'UAA0204',
    'K2024630202',
    'Análisis y Diseño de Algoritmos',
    7.2,
    3,
    '2024-1',
    '2024-06-20',
    'Extraordinario en recurse'
),
(
    'UAA0205',
    'K2024630202',
    'Minería de Datos',
    7.5,
    4,
    '2024-2',
    '2024-12-15',
    'Ordinario'
),
(
    'UAA0206',
    'K2024630202',
    'Desarrollo de Aplicaciones Web',
    7.3,
    4,
    '2024-2',
    '2024-12-15',
    'Ordinario'
),
(
    'UAA0207',
    'K2024630202',
    'Cómputo de Alto Desempeño',
    7.6,
    4,
    '2024-2',
    '2024-12-15',
    'Ordinario'
),
(
    'UAA0208',
    'K2024630202',
    'Estadística',
    7.8,
    4,
    '2024-2',
    '2024-12-15',
    'Ordinario'
),
(
    'UAA0209',
    'K2024630202',
    'Ética y Legalidad',
    6.5,
    2,
    '2023-2',
    '2023-12-15',
    'Ordinario'
),
(
    'UAA0210',
    'K2024630202',
    'Fundamentos Económicos',
    6.9,
    2,
    '2023-2',
    '2023-12-15',
    'Ordinario'
),
(
    'UAA0211',
    'K2024630203',
    'Algoritmos y Estructuras de Datos',
    8.2,
    2,
    '2023-2',
    '2023-12-15',
    'Extraordinario en recurse'
),
(
    'UAA0212',
    'K2024630203',
    'Álgebra Lineal',
    8.1,
    2,
    '2023-2',
    '2023-12-15',
    'Ordinario'
),
(
    'UAA0213',
    'K2024630203',
    'Cálculo Multivariable',
    8.0,
    2,
    '2023-2',
    '2023-12-15',
    'Extraordinario en recurse'
),
(
    'UAA0214',
    'K2024630203',
    'Análisis y Diseño de Algoritmos',
    8.4,
    3,
    '2024-1',
    '2024-06-20',
    'Ordinario'
),
(
    'UAA0215',
    'K2024630203',
    'Minería de Datos',
    8.6,
    4,
    '2024-2',
    '2024-12-15',
    'Ordinario'
),
(
    'UAA0216',
    'K2024630203',
    'Desarrollo de Aplicaciones Web',
    8.3,
    4,
    '2024-2',
    '2024-12-15',
    'Ordinario'
),
(
    'UAA0217',
    'K2024630203',
    'Cómputo de Alto Desempeño',
    8.5,
    4,
    '2024-2',
    '2024-12-15',
    'Extraordinario en recurse'
),
(
    'UAA0218',
    'K2024630203',
    'Estadística',
    8.7,
    4,
    '2024-2',
    '2024-12-15',
    'Ordinario'
),
(
    'UAA0219',
    'K2024630203',
    'Ética y Legalidad',
    8.0,
    2,
    '2023-2',
    '2023-12-15',
    'Ordinario'
),
(
    'UAA0220',
    'K2024630203',
    'Fundamentos Económicos',
    8.2,
    2,
    '2023-2',
    '2023-12-15',
    'Ordinario'
),
(
    'UAA0221',
    'K2024630204',
    'Algoritmos y Estructuras de Datos',
    8.9,
    2,
    '2023-2',
    '2023-12-15',
    'Ordinario'
),
(
    'UAA0222',
    'K2024630204',
    'Álgebra Lineal',
    8.7,
    2,
    '2023-2',
    '2023-12-15',
    'Ordinario'
),
(
    'UAA0223',
    'K2024630204',
    'Cálculo Multivariable',
    8.5,
    2,
    '2023-2',
    '2023-12-15',
    'Ordinario'
),
(
    'UAA0224',
    'K2024630204',
    'Análisis y Diseño de Algoritmos',
    8.8,
    3,
    '2024-1',
    '2024-06-20',
    'Extraordinario en recurse'
),
(
    'UAA0225',
    'K2024630204',
    'Minería de Datos',
    9.0,
    4,
    '2024-2',
    '2024-12-15',
    'Ordinario'
),
(
    'UAA0226',
    'K2024630204',
    'Desarrollo de Aplicaciones Web',
    8.6,
    4,
    '2024-2',
    '2024-12-15',
    'Ordinario'
),
(
    'UAA0227',
    'K2024630204',
    'Cómputo de Alto Desempeño',
    8.9,
    4,
    '2024-2',
    '2024-12-15',
    'Ordinario'
),
(
    'UAA0228',
    'K2024630204',
    'Estadística',
    9.1,
    4,
    '2024-2',
    '2024-12-15',
    'Ordinario'
),
(
    'UAA0229',
    'K2024630204',
    'Ética y Legalidad',
    8.3,
    2,
    '2023-2',
    '2023-12-15',
    'Ordinario'
),
(
    'UAA0230',
    'K2024630204',
    'Fundamentos Económicos',
    8.7,
    2,
    '2023-2',
    '2023-12-15',
    'Ordinario'
),
(
    'UAA0231',
    'K2024630205',
    'Algoritmos y Estructuras de Datos',
    7.5,
    2,
    '2023-2',
    '2023-12-15',
    'Ordinario'
),
(
    'UAA0232',
    'K2024630205',
    'Álgebra Lineal',
    7.3,
    2,
    '2023-2',
    '2023-12-15',
    'Ordinario'
),
(
    'UAA0233',
    'K2024630205',
    'Cálculo Multivariable',
    7.6,
    2,
    '2023-2',
    '2023-12-15',
    'Extraordinario en recurse'
),
(
    'UAA0234',
    'K2024630205',
    'Análisis y Diseño de Algoritmos',
    7.8,
    3,
    '2024-1',
    '2024-06-20',
    'Ordinario'
),
(
    'UAA0235',
    'K2024630205',
    'Minería de Datos',
    7.9,
    4,
    '2024-2',
    '2024-12-15',
    'Ordinario'
),
(
    'UAA0236',
    'K2024630205',
    'Desarrollo de Aplicaciones Web',
    7.7,
    4,
    '2024-2',
    '2024-12-15',
    'Ordinario'
),
(
    'UAA0237',
    'K2024630205',
    'Cómputo de Alto Desempeño',
    8.0,
    4,
    '2024-2',
    '2024-12-15',
    'Extraordinario en recurse'
),
(
    'UAA0238',
    'K2024630205',
    'Estadística',
    8.1,
    4,
    '2024-2',
    '2024-12-15',
    'Ordinario'
),
(
    'UAA0239',
    'K2024630205',
    'Ética y Legalidad',
    7.4,
    2,
    '2023-2',
    '2023-12-15',
    'Ordinario'
),
(
    'UAA0240',
    'K2024630205',
    'Fundamentos Económicos',
    7.8,
    2,
    '2023-2',
    '2023-12-15',
    'Ordinario'
),
(
    'UAA0241',
    'K2024630206',
    'Algoritmos y Estructuras de Datos',
    8.4,
    2,
    '2023-2',
    '2023-12-15',
    'Ordinario'
),
(
    'UAA0242',
    'K2024630206',
    'Álgebra Lineal',
    8.2,
    2,
    '2023-2',
    '2023-12-15',
    'Ordinario'
),
(
    'UAA0243',
    'K2024630206',
    'Cálculo Multivariable',
    8.0,
    2,
    '2023-2',
    '2023-12-15',
    'Ordinario'
),
(
    'UAA0244',
    'K2024630206',
    'Análisis y Diseño de Algoritmos',
    8.5,
    3,
    '2024-1',
    '2024-06-20',
    'Ordinario'
),
(
    'UAA0245',
    'K2024630206',
    'Minería de Datos',
    8.7,
    4,
    '2024-2',
    '2024-12-15',
    'Ordinario'
),
(
    'UAA0246',
    'K2024630206',
    'Desarrollo de Aplicaciones Web',
    8.3,
    4,
    '2024-2',
    '2024-12-15',
    'Ordinario'
),
(
    'UAA0247',
    'K2024630206',
    'Cómputo de Alto Desempeño',
    8.6,
    4,
    '2024-2',
    '2024-12-15',
    'Ordinario'
),
(
    'UAA0248',
    'K2024630206',
    'Estadística',
    8.8,
    4,
    '2024-2',
    '2024-12-15',
    'Ordinario'
),
(
    'UAA0249',
    'K2024630206',
    'Ética y Legalidad',
    8.1,
    2,
    '2023-2',
    '2023-12-15',
    'Ordinario'
),
(
    'UAA0250',
    'K2024630206',
    'Fundamentos Económicos',
    8.4,
    2,
    '2023-2',
    '2023-12-15',
    'Ordinario'
),
(
    'UAA0251',
    'K2024630207',
    'Algoritmos y Estructuras de Datos',
    9.1,
    2,
    '2023-2',
    '2023-12-15',
    'Extraordinario en recurse'
),
(
    'UAA0252',
    'K2024630207',
    'Álgebra Lineal',
    9.0,
    2,
    '2023-2',
    '2023-12-15',
    'Ordinario'
),
(
    'UAA0253',
    'K2024630207',
    'Cálculo Multivariable',
    8.9,
    2,
    '2023-2',
    '2023-12-15',
    'Ordinario'
),
(
    'UAA0254',
    'K2024630207',
    'Análisis y Diseño de Algoritmos',
    9.2,
    3,
    '2024-1',
    '2024-06-20',
    'Ordinario'
),
(
    'UAA0255',
    'K2024630207',
    'Minería de Datos',
    9.4,
    4,
    '2024-2',
    '2024-12-15',
    'Extraordinario'
),
(
    'UAA0256',
    'K2024630207',
    'Desarrollo de Aplicaciones Web',
    9.0,
    4,
    '2024-2',
    '2024-12-15',
    'Extraordinario'
),
(
    'UAA0257',
    'K2024630207',
    'Cómputo de Alto Desempeño',
    9.1,
    4,
    '2024-2',
    '2024-12-15',
    'Extraordinario en recurse'
),
(
    'UAA0258',
    'K2024630207',
    'Estadística',
    9.3,
    4,
    '2024-2',
    '2024-12-15',
    'Ordinario'
),
(
    'UAA0259',
    'K2024630207',
    'Ética y Legalidad',
    8.6,
    2,
    '2023-2',
    '2023-12-15',
    'Ordinario'
),
(
    'UAA0260',
    'K2024630207',
    'Fundamentos Económicos',
    9.0,
    2,
    '2023-2',
    '2023-12-15',
    'Ordinario'
),
(
    'UAA0261',
    'K2024630208',
    'Algoritmos y Estructuras de Datos',
    7.7,
    2,
    '2023-2',
    '2023-12-15',
    'Ordinario'
),
(
    'UAA0262',
    'K2024630208',
    'Álgebra Lineal',
    7.5,
    2,
    '2023-2',
    '2023-12-15',
    'Ordinario'
),
(
    'UAA0263',
    'K2024630208',
    'Cálculo Multivariable',
    7.6,
    2,
    '2023-2',
    '2023-12-15',
    'Ordinario'
),
(
    'UAA0264',
    'K2024630208',
    'Análisis y Diseño de Algoritmos',
    7.9,
    3,
    '2024-1',
    '2024-06-20',
    'Ordinario'
),
(
    'UAA0265',
    'K2024630208',
    'Minería de Datos',
    7.8,
    4,
    '2024-2',
    '2024-12-15',
    'Extraordinario'
),
(
    'UAA0266',
    'K2024630208',
    'Desarrollo de Aplicaciones Web',
    7.6,
    4,
    '2024-2',
    '2024-12-15',
    'Ordinario'
),
(
    'UAA0267',
    'K2024630208',
    'Cómputo de Alto Desempeño',
    7.9,
    4,
    '2024-2',
    '2024-12-15',
    'Ordinario'
),
(
    'UAA0268',
    'K2024630208',
    'Estadística',
    8.0,
    4,
    '2024-2',
    '2024-12-15',
    'Ordinario'
),
(
    'UAA0269',
    'K2024630208',
    'Ética y Legalidad',
    7.4,
    2,
    '2023-2',
    '2023-12-15',
    'Ordinario'
),
(
    'UAA0270',
    'K2024630208',
    'Fundamentos Económicos',
    7.8,
    2,
    '2023-2',
    '2023-12-15',
    'Ordinario'
),
(
    'UAA0271',
    'K2024630209',
    'Algoritmos y Estructuras de Datos',
    8.3,
    2,
    '2023-2',
    '2023-12-15',
    'Ordinario'
),
(
    'UAA0272',
    'K2024630209',
    'Álgebra Lineal',
    8.1,
    2,
    '2023-2',
    '2023-12-15',
    'Ordinario'
),
(
    'UAA0273',
    'K2024630209',
    'Cálculo Multivariable',
    8.0,
    2,
    '2023-2',
    '2023-12-15',
    'Ordinario'
),
(
    'UAA0274',
    'K2024630209',
    'Análisis y Diseño de Algoritmos',
    8.4,
    3,
    '2024-1',
    '2024-06-20',
    'Ordinario'
),
(
    'UAA0275',
    'K2024630209',
    'Minería de Datos',
    8.6,
    4,
    '2024-2',
    '2024-12-15',
    'Ordinario'
),
(
    'UAA0276',
    'K2024630209',
    'Desarrollo de Aplicaciones Web',
    8.2,
    4,
    '2024-2',
    '2024-12-15',
    'Ordinario'
),
(
    'UAA0277',
    'K2024630209',
    'Cómputo de Alto Desempeño',
    8.5,
    4,
    '2024-2',
    '2024-12-15',
    'Ordinario'
),
(
    'UAA0278',
    'K2024630209',
    'Estadística',
    8.7,
    4,
    '2024-2',
    '2024-12-15',
    'Ordinario'
),
(
    'UAA0279',
    'K2024630209',
    'Ética y Legalidad',
    8.0,
    2,
    '2023-2',
    '2023-12-15',
    'Extraordinario'
),
(
    'UAA0280',
    'K2024630209',
    'Fundamentos Económicos',
    8.3,
    2,
    '2023-2',
    '2023-12-15',
    'Ordinario'
),
(
    'UAA0281',
    'K2024630210',
    'Álgebra Lineal',
    8.6,
    2,
    '2023-2',
    '2023-12-15',
    'Ordinario'
),
(
    'UAA0282',
    'K2024630210',
    'Cálculo Aplicado',
    8.4,
    2,
    '2023-2',
    '2023-12-15',
    'Ordinario'
),
(
    'UAA0283',
    'K2024630210',
    'Mecánica y Electromagnetismo',
    8.2,
    2,
    '2023-2',
    '2023-12-15',
    'Ordinario'
),
(
    'UAA0284',
    'K2024630210',
    'Ecuaciones Diferenciales',
    8.7,
    3,
    '2024-1',
    '2024-06-20',
    'Ordinario'
),
(
    'UAA0285',
    'K2024630210',
    'Minería de Datos',
    8.9,
    4,
    '2024-2',
    '2024-12-15',
    'Ordinario'
),
(
    'UAA0286',
    'K2024630210',
    'Probabilidad y Estadística',
    8.5,
    4,
    '2024-2',
    '2024-12-15',
    'Ordinario'
),
(
    'UAA0287',
    'K2024630210',
    'Matemáticas Avanzadas para la Ingeniería',
    8.8,
    4,
    '2024-2',
    '2024-12-15',
    'Ordinario'
),
(
    'UAA0288',
    'K2024630210',
    'Electrónica Analógica',
    9.0,
    4,
    '2024-2',
    '2024-12-15',
    'Ordinario'
),
(
    'UAA0289',
    'K2024630210',
    'Ingeniería, Ética y Sociedad',
    8.1,
    2,
    '2023-2',
    '2023-12-15',
    'Ordinario'
),
(
    'UAA0290',
    'K2024630210',
    'Fundamentos Económicos',
    8.6,
    2,
    '2023-2',
    '2023-12-15',
    'Ordinario'
),

-- ISC (K2024630301 .. K2024630310)
(
    'UAA0291',
    'K2024630301',
    'Programación Orientada a Objetos',
    8.7,
    2,
    '2023-2',
    '2023-12-15',
    'Ordinario'
),
(
    'UAA0292',
    'K2024630301',
    'Álgebra Lineal',
    8.5,
    2,
    '2023-2',
    '2023-12-15',
    'Ordinario'
),
(
    'UAA0293',
    'K2024630301',
    'Sistemas Operativos',
    8.2,
    3,
    '2024-1',
    '2024-06-20',
    'Ordinario'
),
(
    'UAA0294',
    'K2024630301',
    'Redes de Computadoras',
    8.1,
    3,
    '2024-1',
    '2024-06-20',
    'Ordinario'
),
(
    'UAA0295',
    'K2024630301',
    'Bases de Datos',
    8.6,
    3,
    '2024-1',
    '2024-06-20',
    'Ordinario'
),
(
    'UAA0296',
    'K2024630301',
    'Ingeniería de Software',
    8.3,
    3,
    '2024-1',
    '2024-06-20',
    'Ordinario'
),
(
    'UAA0297',
    'K2024630301',
    'Cálculo Aplicado',
    7.9,
    2,
    '2023-2',
    '2023-12-15',
    'Ordinario'
),
(
    'UAA0298',
    'K2024630301',
    'Álgebra Lineal',
    8.0,
    2,
    '2023-2',
    '2023-12-15',
    'Ordinario'
),
(
    'UAA0299',
    'K2024630301',
    'Compiladores',
    8.4,
    4,
    '2024-2',
    '2024-12-15',
    'Ordinario'
),
(
    'UAA0300',
    'K2024630301',
    'Seguridad Informática',
    8.5,
    4,
    '2024-2',
    '2024-12-15',
    'Ordinario'
),
(
    'UAA0301',
    'K2024630302',
    'Álgebra Lineal',
    8.3,
    2,
    '2023-2',
    '2023-12-15',
    'Ordinario'
),
(
    'UAA0302',
    'K2024630302',
    'Cálculo Aplicado',
    8.0,
    2,
    '2023-2',
    '2023-12-15',
    'Ordinario'
),
(
    'UAA0303',
    'K2024630302',
    'Sistemas Operativos',
    7.8,
    3,
    '2024-1',
    '2024-06-20',
    'Ordinario'
),
(
    'UAA0304',
    'K2024630302',
    'Redes de Computadoras',
    7.6,
    3,
    '2024-1',
    '2024-06-20',
    'Ordinario'
),
(
    'UAA0305',
    'K2024630302',
    'Bases de Datos',
    8.1,
    3,
    '2024-1',
    '2024-06-20',
    'Ordinario'
),
(
    'UAA0306',
    'K2024630302',
    'Ingeniería de Software',
    7.9,
    3,
    '2024-1',
    '2024-06-20',
    'Ordinario'
),
(
    'UAA0307',
    'K2024630302',
    'Mecánica y Electromagnetismo',
    7.4,
    2,
    '2023-2',
    '2023-12-15',
    'Ordinario'
),
(
    'UAA0308',
    'K2024630302',
    'Álgebra Lineal',
    7.5,
    2,
    '2023-2',
    '2023-12-15',
    'Ordinario'
),
(
    'UAA0309',
    'K2024630302',
    'Compiladores',
    8.0,
    4,
    '2024-2',
    '2024-12-15',
    'Ordinario'
),
(
    'UAA0310',
    'K2024630302',
    'Seguridad Informática',
    8.2,
    4,
    '2024-2',
    '2024-12-15',
    'Ordinario'
),
(
    'UAA0311',
    'K2024630303',
    'Álgebra Lineal',
    8.9,
    2,
    '2023-2',
    '2023-12-15',
    'Ordinario'
),
(
    'UAA0312',
    'K2024630303',
    'Cálculo Aplicado',
    8.6,
    2,
    '2023-2',
    '2023-12-15',
    'Ordinario'
),
(
    'UAA0313',
    'K2024630303',
    'Sistemas Operativos',
    8.3,
    3,
    '2024-1',
    '2024-06-20',
    'Ordinario'
),
(
    'UAA0314',
    'K2024630303',
    'Redes de Computadoras',
    8.1,
    3,
    '2024-1',
    '2024-06-20',
    'Ordinario'
),
(
    'UAA0315',
    'K2024630303',
    'Bases de Datos',
    8.7,
    3,
    '2024-1',
    '2024-06-20',
    'Ordinario'
),
(
    'UAA0316',
    'K2024630303',
    'Ingeniería de Software',
    8.4,
    3,
    '2024-1',
    '2024-06-20',
    'Ordinario'
),
(
    'UAA0317',
    'K2024630303',
    'Mecánica y Electromagnetismo',
    8.0,
    2,
    '2023-2',
    '2023-12-15',
    'Ordinario'
),
(
    'UAA0318',
    'K2024630303',
    'Álgebra Lineal',
    8.1,
    2,
    '2023-2',
    '2023-12-15',
    'Ordinario'
),
(
    'UAA0319',
    'K2024630303',
    'Compiladores',
    8.5,
    4,
    '2024-2',
    '2024-12-15',
    'Ordinario'
),
(
    'UAA0320',
    'K2024630303',
    'Seguridad Informática',
    8.6,
    4,
    '2024-2',
    '2024-12-15',
    'Ordinario'
),
(
    'UAA0321',
    'K2024630304',
    'Álgebra Lineal',
    7.6,
    2,
    '2023-2',
    '2023-12-15',
    'Ordinario'
),
(
    'UAA0322',
    'K2024630304',
    'Cálculo Aplicado',
    7.4,
    2,
    '2023-2',
    '2023-12-15',
    'Ordinario'
),
(
    'UAA0323',
    'K2024630304',
    'Sistemas Operativos',
    7.2,
    3,
    '2024-1',
    '2024-06-20',
    'Ordinario'
),
(
    'UAA0324',
    'K2024630304',
    'Redes de Computadoras',
    7.0,
    3,
    '2024-1',
    '2024-06-20',
    'Ordinario'
),
(
    'UAA0325',
    'K2024630304',
    'Bases de Datos',
    7.8,
    3,
    '2024-1',
    '2024-06-20',
    'Ordinario'
),
(
    'UAA0326',
    'K2024630304',
    'Ingeniería de Software',
    7.5,
    3,
    '2024-1',
    '2024-06-20',
    'Ordinario'
),
(
    'UAA0327',
    'K2024630304',
    'Mecánica y Electromagnetismo',
    7.1,
    2,
    '2023-2',
    '2023-12-15',
    'Ordinario'
),
(
    'UAA0328',
    'K2024630304',
    'Álgebra Lineal',
    7.2,
    2,
    '2023-2',
    '2023-12-15',
    'Ordinario'
),
(
    'UAA0329',
    'K2024630304',
    'Compiladores',
    7.9,
    4,
    '2024-2',
    '2024-12-15',
    'Ordinario'
),
(
    'UAA0330',
    'K2024630304',
    'Seguridad Informática',
    8.0,
    4,
    '2024-2',
    '2024-12-15',
    'Ordinario'
),
(
    'UAA0331',
    'K2024630305',
    'Álgebra Lineal',
    8.2,
    2,
    '2023-2',
    '2023-12-15',
    'Ordinario'
),
(
    'UAA0332',
    'K2024630305',
    'Cálculo Aplicado',
    8.0,
    2,
    '2023-2',
    '2023-12-15',
    'Ordinario'
),
(
    'UAA0333',
    'K2024630305',
    'Sistemas Operativos',
    8.1,
    3,
    '2024-1',
    '2024-06-20',
    'Ordinario'
),
(
    'UAA0334',
    'K2024630305',
    'Redes de Computadoras',
    7.9,
    3,
    '2024-1',
    '2024-06-20',
    'Ordinario'
),
(
    'UAA0335',
    'K2024630305',
    'Bases de Datos',
    8.3,
    3,
    '2024-1',
    '2024-06-20',
    'Ordinario'
),
(
    'UAA0336',
    'K2024630305',
    'Ingeniería de Software',
    8.0,
    3,
    '2024-1',
    '2024-06-20',
    'Ordinario'
),
(
    'UAA0337',
    'K2024630305',
    'Mecánica y Electromagnetismo',
    7.8,
    2,
    '2023-2',
    '2023-12-15',
    'Ordinario'
),
(
    'UAA0338',
    'K2024630305',
    'Álgebra Lineal',
    7.9,
    2,
    '2023-2',
    '2023-12-15',
    'Ordinario'
),
(
    'UAA0339',
    'K2024630305',
    'Compiladores',
    8.2,
    4,
    '2024-2',
    '2024-12-15',
    'Ordinario'
),
(
    'UAA0340',
    'K2024630305',
    'Seguridad Informática',
    8.4,
    4,
    '2024-2',
    '2024-12-15',
    'Ordinario'
),
(
    'UAA0341',
    'K2024630306',
    'Álgebra Lineal',
    8.1,
    2,
    '2023-2',
    '2023-12-15',
    'Ordinario'
),
(
    'UAA0342',
    'K2024630306',
    'Cálculo Aplicado',
    7.9,
    2,
    '2023-2',
    '2023-12-15',
    'Ordinario'
),
(
    'UAA0343',
    'K2024630306',
    'Sistemas Operativos',
    8.0,
    3,
    '2024-1',
    '2024-06-20',
    'Ordinario'
),
(
    'UAA0344',
    'K2024630306',
    'Redes de Computadoras',
    7.8,
    3,
    '2024-1',
    '2024-06-20',
    'Ordinario'
),
(
    'UAA0345',
    'K2024630306',
    'Bases de Datos',
    8.2,
    3,
    '2024-1',
    '2024-06-20',
    'Ordinario'
),
(
    'UAA0346',
    'K2024630306',
    'Ingeniería de Software',
    8.0,
    3,
    '2024-1',
    '2024-06-20',
    'Ordinario'
),
(
    'UAA0347',
    'K2024630306',
    'Mecánica y Electromagnetismo',
    7.7,
    2,
    '2023-2',
    '2023-12-15',
    'Ordinario'
),
(
    'UAA0348',
    'K2024630306',
    'Álgebra Lineal',
    7.8,
    2,
    '2023-2',
    '2023-12-15',
    'Ordinario'
),
(
    'UAA0349',
    'K2024630306',
    'Compiladores',
    8.1,
    4,
    '2024-2',
    '2024-12-15',
    'Ordinario'
),
(
    'UAA0350',
    'K2024630306',
    'Seguridad Informática',
    8.3,
    4,
    '2024-2',
    '2024-12-15',
    'Ordinario'
),
(
    'UAA0351',
    'K2024630307',
    'Álgebra Lineal',
    8.5,
    2,
    '2023-2',
    '2023-12-15',
    'Ordinario'
),
(
    'UAA0352',
    'K2024630307',
    'Cálculo Aplicado',
    8.3,
    2,
    '2023-2',
    '2023-12-15',
    'Ordinario'
),
(
    'UAA0353',
    'K2024630307',
    'Sistemas Operativos',
    8.2,
    3,
    '2024-1',
    '2024-06-20',
    'Ordinario'
),
(
    'UAA0354',
    'K2024630307',
    'Redes de Computadoras',
    8.0,
    3,
    '2024-1',
    '2024-06-20',
    'Ordinario'
),
(
    'UAA0355',
    'K2024630307',
    'Bases de Datos',
    8.6,
    3,
    '2024-1',
    '2024-06-20',
    'Ordinario'
),
(
    'UAA0356',
    'K2024630307',
    'Ingeniería de Software',
    8.4,
    3,
    '2024-1',
    '2024-06-20',
    'Ordinario'
),
(
    'UAA0357',
    'K2024630307',
    'Mecánica y Electromagnetismo',
    8.0,
    2,
    '2023-2',
    '2023-12-15',
    'Ordinario'
),
(
    'UAA0358',
    'K2024630307',
    'Álgebra Lineal',
    8.1,
    2,
    '2023-2',
    '2023-12-15',
    'Ordinario'
),
(
    'UAA0359',
    'K2024630307',
    'Compiladores',
    8.5,
    4,
    '2024-2',
    '2024-12-15',
    'Ordinario'
),
(
    'UAA0360',
    'K2024630307',
    'Seguridad Informática',
    8.6,
    4,
    '2024-2',
    '2024-12-15',
    'Ordinario'
),
(
    'UAA0361',
    'K2024630308',
    'Álgebra Lineal',
    7.3,
    2,
    '2023-2',
    '2023-12-15',
    'Ordinario'
),
(
    'UAA0362',
    'K2024630308',
    'Cálculo Aplicado',
    7.1,
    2,
    '2023-2',
    '2023-12-15',
    'Ordinario'
),
(
    'UAA0363',
    'K2024630308',
    'Sistemas Operativos',
    7.0,
    3,
    '2024-1',
    '2024-06-20',
    'Ordinario'
),
(
    'UAA0364',
    'K2024630308',
    'Redes de Computadoras',
    6.9,
    3,
    '2024-1',
    '2024-06-20',
    'Ordinario'
),
(
    'UAA0365',
    'K2024630308',
    'Bases de Datos',
    7.6,
    3,
    '2024-1',
    '2024-06-20',
    'Ordinario'
),
(
    'UAA0366',
    'K2024630308',
    'Ingeniería de Software',
    7.4,
    3,
    '2024-1',
    '2024-06-20',
    'Ordinario'
),
(
    'UAA0367',
    'K2024630308',
    'Mecánica y Electromagnetismo',
    6.8,
    2,
    '2023-2',
    '2023-12-15',
    'Ordinario'
),
(
    'UAA0368',
    'K2024630308',
    'Álgebra Lineal',
    6.9,
    2,
    '2023-2',
    '2023-12-15',
    'Ordinario'
),
(
    'UAA0369',
    'K2024630308',
    'Compiladores',
    7.5,
    4,
    '2024-2',
    '2024-12-15',
    'Ordinario'
),
(
    'UAA0370',
    'K2024630308',
    'Seguridad Informática',
    7.7,
    4,
    '2024-2',
    '2024-12-15',
    'Ordinario'
),
(
    'UAA0371',
    'K2024630309',
    'Álgebra Lineal',
    8.4,
    2,
    '2023-2',
    '2023-12-15',
    'Ordinario'
),
(
    'UAA0372',
    'K2024630309',
    'Cálculo Aplicado',
    8.2,
    2,
    '2023-2',
    '2023-12-15',
    'Ordinario'
),
(
    'UAA0373',
    'K2024630309',
    'Sistemas Operativos',
    8.1,
    3,
    '2024-1',
    '2024-06-20',
    'Ordinario'
),
(
    'UAA0374',
    'K2024630309',
    'Redes de Computadoras',
    7.9,
    3,
    '2024-1',
    '2024-06-20',
    'Ordinario'
),
(
    'UAA0375',
    'K2024630309',
    'Bases de Datos',
    8.3,
    3,
    '2024-1',
    '2024-06-20',
    'Ordinario'
),
(
    'UAA0376',
    'K2024630309',
    'Ingeniería de Software',
    8.0,
    3,
    '2024-1',
    '2024-06-20',
    'Ordinario'
),
(
    'UAA0377',
    'K2024630309',
    'Mecánica y Electromagnetismo',
    7.8,
    2,
    '2023-2',
    '2023-12-15',
    'Ordinario'
),
(
    'UAA0378',
    'K2024630309',
    'Álgebra Lineal',
    7.9,
    2,
    '2023-2',
    '2023-12-15',
    'Ordinario'
),
(
    'UAA0379',
    'K2024630309',
    'Compiladores',
    8.2,
    4,
    '2024-2',
    '2024-12-15',
    'Ordinario'
),
(
    'UAA0380',
    'K2024630309',
    'Seguridad Informática',
    8.4,
    4,
    '2024-2',
    '2024-12-15',
    'Ordinario'
),
(
    'UAA0381',
    'K2024630310',
    'Álgebra Lineal',
    9.2,
    2,
    '2023-2',
    '2023-12-15',
    'Ordinario'
),
(
    'UAA0382',
    'K2024630310',
    'Cálculo Aplicado',
    9.0,
    2,
    '2023-2',
    '2023-12-15',
    'Ordinario'
),
(
    'UAA0383',
    'K2024630310',
    'Sistemas Operativos',
    8.8,
    3,
    '2024-1',
    '2024-06-20',
    'Ordinario'
),
(
    'UAA0384',
    'K2024630310',
    'Redes de Computadoras',
    8.6,
    3,
    '2024-1',
    '2024-06-20',
    'Ordinario'
),
(
    'UAA0385',
    'K2024630310',
    'Bases de Datos',
    9.1,
    3,
    '2024-1',
    '2024-06-20',
    'Ordinario'
),
(
    'UAA0386',
    'K2024630310',
    'Ingeniería de Software',
    8.9,
    3,
    '2024-1',
    '2024-06-20',
    'Ordinario'
),
(
    'UAA0387',
    'K2024630310',
    'Mecánica y Electromagnetismo',
    8.5,
    2,
    '2023-2',
    '2023-12-15',
    'Ordinario'
),
(
    'UAA0388',
    'K2024630310',
    'Álgebra Lineal',
    8.6,
    2,
    '2023-2',
    '2023-12-15',
    'Ordinario'
),
(
    'UAA0389',
    'K2024630310',
    'Compiladores',
    9.0,
    4,
    '2024-2',
    '2024-12-15',
    'Ordinario'
),
(
    'UAA0390',
    'K2024630310',
    'Seguridad Informática',
    9.1,
    4,
    '2024-2',
    '2024-12-15',
    'Ordinario'
);

DELETE from mat_inscritos where id_horario = "H2024630101";

DELETE from mat_inscritos where id_horario = "H2024630102";

DELETE d
FROM distribucion d
    JOIN grupo g ON d.id_grupo = g.id
WHERE
    g.id_prof = 'HIJKLMNO';

delete from grupo where id_prof = 'HIJKLMNO';

DELETE d
FROM distribucion d
    JOIN grupo g ON d.id_grupo = g.id
WHERE
    g.id_prof = 'P0027VWX';

delete from grupo where id_prof = 'P0027VWX';

DELETE d
FROM distribucion d
    JOIN grupo g ON d.id_grupo = g.id
WHERE
    g.id_prof = 'PROF0002';

delete from grupo where id_prof = 'PROF0002';

delete from grupo where id = '1';

DELETE from grupo where id = '2';

DELETE from grupo where id = '3';

DELETE FROM grupo where id = '4';

INSERT INTO
    grupo (
        id,
        nombre,
        id_ua,
        id_prof,
        turno,
        cupo,
        salon,
        reg_final,
        reg_extra
    )
VALUES (
        '1',
        '4BM3',
        'UA0070',
        'HIJKLMNO',
        'Matutino',
        0,
        '4001',
        0,
        0
    ),
    (
        '2',
        '4BM3',
        'UA0071',
        'HIJKLMNO',
        'Matutino',
        0,
        '4001',
        0,
        0
    ),
    (
        '3',
        '4BM3',
        'UA0072',
        'P0027VWX',
        'Matutino',
        0,
        '4002',
        0,
        0
    );

-- Agregar cuarto grupo para la misma materia/nombre
INSERT INTO
    grupo (
        id,
        nombre,
        id_ua,
        id_prof,
        turno,
        cupo,
        salon,
        reg_final,
        reg_extra
    )
VALUES (
        '4',
        '4BM3',
        'UA0073',
        'PROF0002',
        'Matutino',
        0,
        '4003',
        0,
        0
    );

INSERT INTO
    distribucion (
        id,
        id_grupo,
        hora_ini,
        hora_fin,
        dia
    )
VALUES (
        'D1',
        '1',
        '08:00',
        '09:30',
        'Lunes'
    ),
    (
        'D2',
        '1',
        '08:00',
        '09:30',
        'Miercoles'
    ),
    (
        'D3',
        '1',
        '08:00',
        '09:30',
        'Viernes'
    ),
    (
        'D4',
        '2',
        '10:00',
        '11:30',
        'Lunes'
    ),
    (
        'D5',
        '2',
        '10:00',
        '11:30',
        'Miercoles'
    ),
    (
        'D6',
        '2',
        '10:00',
        '11:30',
        'Viernes'
    ),
    (
        'D7',
        '3',
        '12:00',
        '13:30',
        'Martes'
    ),
    (
        'D8',
        '3',
        '12:00',
        '13:30',
        'Jueves'
    ),
    (
        'D9',
        '3',
        '12:00',
        '13:30',
        'Viernes'
    );

-- Distribucion para cuarto grupo adicional (id = '4')
INSERT INTO
    distribucion (
        id,
        id_grupo,
        hora_ini,
        hora_fin,
        dia
    )
VALUES (
        'D10',
        '4',
        '14:00',
        '15:30',
        'Lunes'
    ),
    (
        'D11',
        '4',
        '14:00',
        '15:30',
        'Miercoles'
    ),
    (
        'D12',
        '4',
        '14:00',
        '15:30',
        'Viernes'
    );

-- ==================================================================
-- 5. INSERCIÓN DE HORARIOS PARA ESTUDIANTES
-- ==================================================================
DELETE FROM mat_inscritos;

-- ===== INSCRIPCIONES A MATERIAS (mat_inscritos) =====
-- IIA - Fundamentos de Programación
INSERT INTO
    mat_inscritos (
        id,
        id_horario,
        id_grupo,
        calificacion_primer,
        calificacion_segundo,
        calificacion_tercer,
        calificacion_final,
        extra
    )
VALUES (
        'MAT20246301011',
        'H2024630101',
        '1',
        8.5,
        8.8,
        9.0,
        8.8,
        NULL
    ),
    (
        'MAT1000',
        'H2024630101',
        '4',
        8.5,
        8.8,
        9.0,
        8.8,
        NULL
    ),
    (
        'MAT20246308382',
        'H2024630102',
        '1',
        8.2,
        8.5,
        8.7,
        8.5,
        NULL
    ),
    (
        'MAT207347483',
        'H2024630102',
        '4',
        8.2,
        8.5,
        8.7,
        8.5,
        NULL
    ),
    (
        'MAT20246301031',
        'H2024630103',
        'G00001',
        7.8,
        8.0,
        8.2,
        8.0,
        NULL
    ),
    (
        'MAT20246301041',
        'H2024630104',
        'G00001',
        8.9,
        9.0,
        9.2,
        9.0,
        NULL
    ),
    (
        'MAT20246301051',
        'H2024630105',
        'G00001',
        8.0,
        8.3,
        8.4,
        8.2,
        NULL
    ),
    (
        'MAT20246301061',
        'H2024630106',
        'G00002',
        7.5,
        7.6,
        7.7,
        7.6,
        NULL
    ),
    (
        'MAT20246301071',
        'H2024630107',
        'G00002',
        8.5,
        8.7,
        8.8,
        8.7,
        NULL
    ),
    (
        'MAT20246301081',
        'H2024630108',
        'G00002',
        9.0,
        9.1,
        9.3,
        9.1,
        NULL
    ),
    (
        'MAT20246301091',
        'H2024630109',
        'G00002',
        7.8,
        8.0,
        8.1,
        8.0,
        NULL
    ),
    (
        'MAT20246301101',
        'H2024630110',
        'G00002',
        8.3,
        8.5,
        8.6,
        8.5,
        NULL
    );

-- IIA - Matemáticas Discretas
INSERT INTO
    mat_inscritos (
        id,
        id_horario,
        id_grupo,
        calificacion_primer,
        calificacion_segundo,
        calificacion_tercer,
        calificacion_final,
        extra
    )
VALUES (
        'MAT20246301012',
        'H2024630101',
        '2',
        NULL,
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        'MAT20246301022',
        'H2024630102',
        '2',
        NULL,
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        'MAT20246301032',
        'H2024630103',
        'G00003',
        7.3,
        7.6,
        7.8,
        7.5,
        NULL
    ),
    (
        'MAT20246301042',
        'H2024630104',
        'G00003',
        9.1,
        9.0,
        9.2,
        9.1,
        NULL
    ),
    (
        'MAT20246301052',
        'H2024630105',
        'G00003',
        7.9,
        8.1,
        8.2,
        8.0,
        NULL
    ),
    (
        'MAT20246301062',
        'H2024630106',
        'G00004',
        7.1,
        7.4,
        7.5,
        7.3,
        NULL
    ),
    (
        'MAT20246301072',
        'H2024630107',
        'G00004',
        8.4,
        8.6,
        8.7,
        8.5,
        NULL
    ),
    (
        'MAT20246301082',
        'H2024630108',
        'G00004',
        8.9,
        9.1,
        9.0,
        9.0,
        NULL
    ),
    (
        'MAT20246301092',
        'H2024630109',
        'G00004',
        7.6,
        7.9,
        8.0,
        7.8,
        NULL
    ),
    (
        'MAT20246301102',
        'H2024630110',
        'G00004',
        8.4,
        8.6,
        8.5,
        8.5,
        NULL
    );

-- IIA - Cálculo
INSERT INTO
    mat_inscritos (
        id,
        id_horario,
        id_grupo,
        calificacion_primer,
        calificacion_segundo,
        calificacion_tercer,
        calificacion_final,
        extra
    )
VALUES (
        'MAT20246301013',
        'H2024630101',
        '3',
        7.8,
        8.0,
        8.1,
        7.9,
        NULL
    ),
    (
        'MAT20246301023',
        'H2024630102',
        '3',
        8.0,
        8.2,
        8.3,
        8.1,
        NULL
    ),
    (
        'MAT20246301033',
        'H2024630103',
        'G00005',
        8.0,
        8.3,
        8.4,
        8.2,
        NULL
    ),
    (
        'MAT20246301043',
        'H2024630104',
        'G00005',
        8.5,
        8.8,
        8.9,
        8.7,
        NULL
    ),
    (
        'MAT20246301053',
        'H2024630105',
        'G00005',
        8.2,
        8.5,
        8.6,
        8.4,
        NULL
    ),
    (
        'MAT20246301063',
        'H2024630106',
        'G00006',
        7.4,
        7.6,
        7.8,
        7.6,
        NULL
    ),
    (
        'MAT20246301073',
        'H2024630107',
        'G00006',
        8.6,
        8.8,
        8.9,
        8.7,
        NULL
    ),
    (
        'MAT20246301083',
        'H2024630108',
        'G00006',
        9.1,
        9.3,
        9.4,
        9.3,
        NULL
    ),
    (
        'MAT20246301093',
        'H2024630109',
        'G00006',
        7.8,
        8.0,
        8.2,
        8.0,
        NULL
    ),
    (
        'MAT20246301103',
        'H2024630110',
        'G00006',
        8.1,
        8.3,
        8.4,
        8.2,
        NULL
    );

-- LCD - Fundamentos de Programación
INSERT INTO
    mat_inscritos (
        id,
        id_horario,
        id_grupo,
        calificacion_primer,
        calificacion_segundo,
        calificacion_tercer,
        calificacion_final,
        extra
    )
VALUES (
        'MAT20246302011',
        'H2024630201',
        'G00007',
        9.0,
        9.2,
        9.4,
        9.2,
        NULL
    ),
    (
        'MAT20246302021',
        'H2024630202',
        'G00007',
        6.5,
        6.7,
        6.8,
        6.7,
        NULL
    ),
    (
        'MAT20246302031',
        'H2024630203',
        'G00007',
        8.0,
        8.2,
        8.3,
        8.1,
        NULL
    ),
    (
        'MAT20246302041',
        'H2024630204',
        'G00007',
        8.6,
        8.8,
        9.0,
        8.8,
        NULL
    ),
    (
        'MAT20246302051',
        'H2024630205',
        'G00007',
        7.5,
        7.7,
        7.8,
        7.6,
        NULL
    ),
    (
        'MAT20246302061',
        'H2024630206',
        'G00008',
        8.4,
        8.6,
        8.7,
        8.5,
        NULL
    ),
    (
        'MAT20246302071',
        'H2024630207',
        'G00008',
        8.8,
        9.0,
        9.2,
        9.0,
        NULL
    ),
    (
        'MAT20246302081',
        'H2024630208',
        'G00008',
        7.6,
        7.8,
        8.0,
        7.8,
        NULL
    ),
    (
        'MAT20246302091',
        'H2024630209',
        'G00008',
        8.0,
        8.2,
        8.4,
        8.2,
        NULL
    ),
    (
        'MAT20246302101',
        'H2024630210',
        'G00008',
        8.5,
        8.7,
        8.9,
        8.7,
        NULL
    );

-- LCD - Introducción a Ciencia de Datos
INSERT INTO
    mat_inscritos (
        id,
        id_horario,
        id_grupo,
        calificacion_primer,
        calificacion_segundo,
        calificacion_tercer,
        calificacion_final,
        extra
    )
VALUES (
        'MAT20246302012',
        'H2024630201',
        'G00009',
        9.2,
        9.4,
        9.5,
        9.4,
        NULL
    ),
    (
        'MAT20246302022',
        'H2024630202',
        'G00009',
        6.6,
        6.8,
        7.0,
        6.8,
        NULL
    ),
    (
        'MAT20246302032',
        'H2024630203',
        'G00009',
        8.0,
        8.1,
        8.2,
        8.0,
        NULL
    ),
    (
        'MAT20246302042',
        'H2024630204',
        'G00009',
        8.8,
        8.9,
        9.1,
        8.9,
        NULL
    ),
    (
        'MAT20246302052',
        'H2024630205',
        'G00009',
        7.4,
        7.6,
        7.7,
        7.5,
        NULL
    ),
    (
        'MAT20246302062',
        'H2024630206',
        'G00010',
        8.3,
        8.5,
        8.6,
        8.4,
        NULL
    ),
    (
        'MAT20246302072',
        'H2024630207',
        'G00010',
        9.0,
        9.2,
        9.3,
        9.2,
        NULL
    ),
    (
        'MAT20246302082',
        'H2024630208',
        'G00010',
        7.7,
        7.9,
        8.1,
        7.9,
        NULL
    ),
    (
        'MAT20246302092',
        'H2024630209',
        'G00010',
        8.1,
        8.2,
        8.4,
        8.2,
        NULL
    ),
    (
        'MAT20246302102',
        'H2024630210',
        'G00010',
        8.6,
        8.8,
        9.0,
        8.8,
        NULL
    );

-- LCD - Cálculo
INSERT INTO
    mat_inscritos (
        id,
        id_horario,
        id_grupo,
        calificacion_primer,
        calificacion_segundo,
        calificacion_tercer,
        calificacion_final,
        extra
    )
VALUES (
        'MAT20246302013',
        'H2024630201',
        'G00011',
        8.8,
        9.0,
        9.1,
        8.9,
        NULL
    ),
    (
        'MAT20246302023',
        'H2024630202',
        'G00011',
        5.8,
        6.0,
        6.2,
        6.0,
        NULL
    ),
    (
        'MAT20246302033',
        'H2024630203',
        'G00011',
        8.0,
        8.2,
        8.4,
        8.2,
        NULL
    ),
    (
        'MAT20246302043',
        'H2024630204',
        'G00011',
        8.6,
        8.8,
        8.9,
        8.7,
        NULL
    ),
    (
        'MAT20246302053',
        'H2024630205',
        'G00011',
        7.5,
        7.7,
        7.9,
        7.7,
        NULL
    ),
    (
        'MAT20246302063',
        'H2024630206',
        'G00012',
        8.4,
        8.6,
        8.8,
        8.6,
        NULL
    ),
    (
        'MAT20246302073',
        'H2024630207',
        'G00012',
        8.7,
        8.9,
        9.1,
        8.9,
        NULL
    ),
    (
        'MAT20246302083',
        'H2024630208',
        'G00012',
        7.7,
        7.9,
        8.1,
        7.9,
        NULL
    ),
    (
        'MAT20246302093',
        'H2024630209',
        'G00012',
        8.2,
        8.4,
        8.6,
        8.4,
        NULL
    ),
    (
        'MAT20246302103',
        'H2024630210',
        'G00012',
        8.4,
        8.6,
        8.8,
        8.6,
        NULL
    );

-- ISC - Fundamentos de Programación
INSERT INTO
    mat_inscritos (
        id,
        id_horario,
        id_grupo,
        calificacion_primer,
        calificacion_segundo,
        calificacion_tercer,
        calificacion_final,
        extra
    )
VALUES (
        'MAT20246303011',
        'H2024630301',
        'G00013',
        8.4,
        8.6,
        8.7,
        8.5,
        NULL
    ),
    (
        'MAT20246303021',
        'H2024630302',
        'G00013',
        8.4,
        8.6,
        8.7,
        8.5,
        NULL
    ),
    (
        'MAT20246303031',
        'H2024630303',
        'G00013',
        8.8,
        9.0,
        9.1,
        8.9,
        NULL
    ),
    (
        'MAT20246303041',
        'H2024630304',
        'G00013',
        7.4,
        7.6,
        7.7,
        7.5,
        NULL
    ),
    (
        'MAT20246303051',
        'H2024630305',
        'G00013',
        8.2,
        8.3,
        8.5,
        8.3,
        NULL
    ),
    (
        'MAT20246303061',
        'H2024630306',
        'G00014',
        8.0,
        8.2,
        8.3,
        8.1,
        NULL
    ),
    (
        'MAT20246303071',
        'H2024630307',
        'G00014',
        8.6,
        8.8,
        8.9,
        8.7,
        NULL
    ),
    (
        'MAT20246303081',
        'H2024630308',
        'G00014',
        7.1,
        7.3,
        7.4,
        7.2,
        NULL
    ),
    (
        'MAT20246303091',
        'H2024630309',
        'G00014',
        8.3,
        8.5,
        8.6,
        8.4,
        NULL
    ),
    (
        'MAT20246303101',
        'H2024630310',
        'G00014',
        9.0,
        9.2,
        9.3,
        9.2,
        NULL
    );

-- ISC - Matemáticas Discretas
INSERT INTO
    mat_inscritos (
        id,
        id_horario,
        id_grupo,
        calificacion_primer,
        calificacion_segundo,
        calificacion_tercer,
        calificacion_final,
        extra
    )
VALUES (
        'MAT20246303012',
        'H2024630301',
        'G00015',
        8.5,
        8.7,
        8.8,
        8.6,
        NULL
    ),
    (
        'MAT20246303022',
        'H2024630302',
        'G00015',
        8.3,
        8.5,
        8.6,
        8.4,
        NULL
    ),
    (
        'MAT20246303032',
        'H2024630303',
        'G00015',
        8.9,
        9.1,
        9.2,
        9.0,
        NULL
    ),
    (
        'MAT20246303042',
        'H2024630304',
        'G00015',
        7.3,
        7.5,
        7.6,
        7.4,
        NULL
    ),
    (
        'MAT20246303052',
        'H2024630305',
        'G00015',
        8.1,
        8.3,
        8.4,
        8.2,
        NULL
    ),
    (
        'MAT20246303062',
        'H2024630306',
        'G00016',
        7.9,
        8.1,
        8.2,
        8.0,
        NULL
    ),
    (
        'MAT20246303072',
        'H2024630307',
        'G00016',
        8.7,
        8.9,
        9.0,
        8.8,
        NULL
    ),
    (
        'MAT20246303082',
        'H2024630308',
        'G00016',
        7.0,
        7.2,
        7.3,
        7.1,
        NULL
    ),
    (
        'MAT20246303092',
        'H2024630309',
        'G00016',
        8.2,
        8.4,
        8.5,
        8.3,
        NULL
    ),
    (
        'MAT20246303102',
        'H2024630310',
        'G00016',
        9.2,
        9.3,
        9.4,
        9.3,
        NULL
    );

-- ISC - Cálculo
INSERT INTO
    mat_inscritos (
        id,
        id_horario,
        id_grupo,
        calificacion_primer,
        calificacion_segundo,
        calificacion_tercer,
        calificacion_final,
        extra
    )
VALUES (
        'MAT20246303013',
        'H2024630301',
        'G00017',
        8.2,
        8.4,
        8.5,
        8.3,
        NULL
    ),
    (
        'MAT20246303023',
        'H2024630302',
        'G00017',
        8.5,
        8.7,
        8.8,
        8.6,
        NULL
    ),
    (
        'MAT20246303033',
        'H2024630303',
        'G00017',
        8.7,
        8.9,
        9.0,
        8.8,
        NULL
    ),
    (
        'MAT20246303043',
        'H2024630304',
        'G00017',
        7.5,
        7.7,
        7.8,
        7.6,
        NULL
    ),
    (
        'MAT20246303053',
        'H2024630305',
        'G00017',
        8.4,
        8.6,
        8.7,
        8.5,
        NULL
    ),
    (
        'MAT20246303063',
        'H2024630306',
        'G00018',
        8.2,
        8.4,
        8.5,
        8.3,
        NULL
    ),
    (
        'MAT20246303073',
        'H2024630307',
        'G00018',
        8.5,
        8.7,
        8.8,
        8.6,
        NULL
    ),
    (
        'MAT20246303083',
        'H2024630308',
        'G00018',
        7.3,
        7.5,
        7.6,
        7.5,
        NULL
    ),
    (
        'MAT20246303093',
        'H2024630309',
        'G00018',
        8.5,
        8.7,
        8.8,
        8.6,
        NULL
    ),
    (
        'MAT20246303103',
        'H2024630310',
        'G00018',
        9.0,
        9.2,
        9.3,
        9.1,
        NULL
    );

SET FOREIGN_KEY_CHECKS = 1;

DELETE FROM resena;

INSERT INTO
    resena (
        id,
        id_profesor,
        id_alumno,
        calificacion,
        comentarios,
        fecha,
        periodo
    )
VALUES (
        'RES001',
        'HIJKLMNO',
        '2024630101',
        9.0,
        'Excelente profesor, explica muy bien los conceptos',
        '2024-12-05',
        '2024-2'
    ),
    (
        'RES002',
        'HIJKLMNO',
        '2024630102',
        8.5,
        'Domina el tema y resuelve dudas eficientemente',
        '2024-12-05',
        '2024-2'
    ),
    (
        'RES003',
        'HIJKLMNO',
        '2024630103',
        8.0,
        'Buen profesor, aunque a veces va muy rápido',
        '2024-12-06',
        '2024-2'
    ),
    (
        'RES004',
        'HIJKLMNO',
        '2024630104',
        9.5,
        'El mejor profesor que he tenido, muy dedicado',
        '2024-12-06',
        '2024-2'
    ),
    (
        'RES005',
        'HIJKLMNO',
        '2024630105',
        8.8,
        'Excelente metodología de enseñanza',
        '2024-12-07',
        '2024-2'
    ),
    (
        'RES006',
        'PROF0001',
        '2024630106',
        7.5,
        'Buen profesor pero podría mejorar la organización',
        '2024-12-05',
        '2024-2'
    ),
    (
        'RES007',
        'PROF0001',
        '2024630107',
        8.5,
        'Clases dinámicas y ejemplos prácticos',
        '2024-12-06',
        '2024-2'
    ),
    (
        'RES008',
        'PROF0001',
        '2024630108',
        8.0,
        'Explica bien los temas complejos',
        '2024-12-06',
        '2024-2'
    ),
    (
        'RES009',
        'PROF0001',
        '2024630109',
        8.2,
        'Buen dominio de la materia',
        '2024-12-07',
        '2024-2'
    ),
    (
        'RES010',
        'PROF0002',
        '2024630110',
        9.0,
        'Excelente profesora, muy paciente',
        '2024-12-05',
        '2024-2'
    ),
    (
        'RES011',
        'PROF0002',
        '2024630201',
        9.2,
        'La mejor profesora, siempre disponible para dudas',
        '2024-12-06',
        '2024-2'
    ),
    (
        'RES012',
        'PROF0002',
        '2024630202',
        9.5,
        'Hace que el cálculo sea fácil de entender',
        '2024-12-06',
        '2024-2'
    ),
    (
        'RES013',
        'PROF0002',
        '2024630203',
        8.8,
        'Excelente didáctica y paciencia',
        '2024-12-07',
        '2024-2'
    ),
    (
        'RES014',
        'PROF0002',
        '2024630204',
        9.0,
        'Clases muy bien estructuradas',
        '2024-12-07',
        '2024-2'
    ),
    -- 20 reseñas adicionales para varios profesores
    (
        'RES015',
        'P0001RSV',
        '2024630205',
        8.7,
        'Profesor dedicado con buena pedagogía',
        '2024-12-08',
        '2024-2'
    ),
    (
        'RES016',
        'P0001RSV',
        '2024630206',
        8.4,
        'Enseña de manera clara y ordenada',
        '2024-12-08',
        '2024-2'
    ),
    (
        'RES017',
        'P0002KND',
        '2024630207',
        8.9,
        'Muy atento con los estudiantes',
        '2024-12-09',
        '2024-2'
    ),
    (
        'RES018',
        'P0002KND',
        '2024630208',
        8.3,
        'Buenas explicaciones pero poco tiempo en dudas',
        '2024-12-09',
        '2024-2'
    ),
    (
        'RES019',
        'P0003HGR',
        '2024630209',
        8.6,
        'Profesional y exigente de buena manera',
        '2024-12-10',
        '2024-2'
    ),
    (
        'RES020',
        'P0003HGR',
        '2024630210',
        8.1,
        'Clases interesantes aunque densas',
        '2024-12-10',
        '2024-2'
    ),
    (
        'RES021',
        'P0004ABC',
        '2024630301',
        8.8,
        'Muy comprensivo y accesible',
        '2024-12-11',
        '2024-2'
    ),
    (
        'RES022',
        'P0004ABC',
        '2024630302',
        8.5,
        'Propone actividades prácticas útiles',
        '2024-12-11',
        '2024-2'
    ),
    (
        'RES023',
        'P0005DEF',
        '2024630303',
        9.1,
        'Excelente comunicación con alumnos',
        '2024-12-12',
        '2024-2'
    ),
    (
        'RES024',
        'P0005DEF',
        '2024630304',
        8.9,
        'Domina completamente su materia',
        '2024-12-12',
        '2024-2'
    ),
    (
        'RES025',
        'HIJKLMNO',
        '2024630305',
        8.3,
        'Retroalimentación constructiva siempre',
        '2024-12-13',
        '2024-2'
    ),
    (
        'RES026',
        'HIJKLMNO',
        '2024630306',
        8.6,
        'Promueve el pensamiento crítico',
        '2024-12-13',
        '2024-2'
    ),
    (
        'RES027',
        'PROF0001',
        '2024630307',
        8.4,
        'Accesible fuera de horario de clase',
        '2024-12-14',
        '2024-2'
    ),
    (
        'RES028',
        'PROF0001',
        '2024630308',
        8.7,
        'Materiales de estudio muy completos',
        '2024-12-14',
        '2024-2'
    ),
    (
        'RES029',
        'PROF0002',
        '2024630309',
        8.9,
        'Crea un ambiente de respeto y confianza',
        '2024-12-15',
        '2024-2'
    ),
    (
        'RES030',
        'PROF0002',
        '2024630101',
        8.6,
        'Atiende a estudiantes con dificultades',
        '2024-12-15',
        '2024-2'
    ),
    (
        'RES031',
        'P0001RSV',
        '2024630102',
        8.8,
        'Experto en su área de conocimiento',
        '2024-12-16',
        '2024-2'
    ),
    (
        'RES032',
        'P0001RSV',
        '2024630103',
        8.2,
        'Clases algo monótonas pero informativas',
        '2024-12-16',
        '2024-2'
    ),
    (
        'RES033',
        'P0002KND',
        '2024630104',
        8.7,
        'Enseña con ejemplos del mundo real',
        '2024-12-17',
        '2024-2'
    ),
    (
        'RES034',
        'P0003HGR',
        '2024630105',
        8.4,
        'Evaluaciones justas y transparentes',
        '2024-12-17',
        '2024-2'
    );

DELETE FROM avisos;

INSERT INTO
    avisos (
        id,
        titulo,
        descripcion,
        imagen,
        objetivo,
        fecha_vencimiento
    )
VALUES (
        'AV001',
        'Inicio del Semestre 2025-1',
        'Les damos la bienvenida al semestre 2025-1. Las clases inician el 3 de febrero de 2025. Por favor revisen sus horarios y grupos asignados.',
        NULL,
        'Todos',
        '2025-02-10 23:59:59'
    ),
    (
        'AV002',
        'Registro de Calificaciones Primer Parcial',
        'Profesores: El periodo para registrar calificaciones del primer parcial es del 1 al 7 de diciembre de 2025. No olviden subir las calificaciones en tiempo y forma.',
        NULL,
        'Profesores',
        '2025-12-07 23:59:59'
    ),
    (
        'AV003',
        'Evaluación Docente',
        'Alumnos: Ya está disponible la evaluación docente. Tu opinión es muy importante para mejorar la calidad educativa. Periodo: del 1 al 15 de diciembre.',
        NULL,
        'Alumnos',
        '2025-12-15 23:59:59'
    ),
    (
        'AV004',
        'Examen a Título de Suficiencia (ETS)',
        'Se abre el periodo de inscripción para exámenes ETS. Si tienes materias reprobadas, esta es tu oportunidad. Periodo del 1 al 30 de diciembre de 2025.',
        NULL,
        'Alumnos',
        '2025-12-30 23:59:59'
    ),
    (
        'AV005',
        'Mantenimiento del Sistema',
        'El sistema SAES estará en mantenimiento el día 10 de diciembre de 2025 de 22:00 a 24:00 hrs. Disculpen las molestias.',
        NULL,
        'Todos',
        '2025-12-20 23:59:59'
    ),
    (
        'AV006',
        'Actualización de Datos Personales',
        'Recuerden mantener actualizados sus datos personales y de contacto en el sistema. Esto es importante para recibir notificaciones oficiales.',
        NULL,
        'Todos',
        '2025-12-20 23:59:59'
    );

DELETE FROM materia_reprobada;

INSERT INTO
    materia_reprobada (
        id,
        id_estudiante,
        id_ua,
        periodos_restantes,
        recurse,
        estado_actual
    )
VALUES
    -- Alumno LCD 2024630202 (EST2024630202): 2 materias reprobadas
    (
        '457',
        'EST2024630202',
        'UA0098',
        '2',
        '1',
        'Reprobada'
    ),
    (
        '458',
        'EST2024630202',
        'UA0101',
        '2',
        '0',
        'Reprobada'
    ),
    -- Alumno IIA 2024630104 (EST2024630104): 3 materias reprobadas
    (
        '459',
        'EST2024630104',
        'UA0071',
        '1',
        '0',
        'Reprobada'
    ),
    (
        '460',
        'EST2024630104',
        'UA0070',
        '2',
        '1',
        'Reprobada'
    ),
    -- Alumno ISC 2024630306 (EST2024630306): 2 materias reprobadas
    (
        '462',
        'EST2024630306',
        'UA0010',
        '2',
        '1',
        'Reprobada'
    ),
    (
        '463',
        'EST2024630306',
        'UA0015',
        '2',
        '0',
        'Reprobada'
    ),
    -- Alumno LCD 2024630207 (EST2024630207): 1 materia reprobada
    (
        '464',
        'EST2024630207',
        'UA0106',
        '3',
        '1',
        'Reprobada'
    ),
    -- Alumno IIA 2024630108 (EST2024630108): 2 materias recuperadas
    (
        '465',
        'EST2024630108',
        'UA0052',
        '1',
        '1',
        'Reprobada'
    ),
    (
        '466',
        'EST2024630108',
        'UA0057',
        '1',
        '0',
        'Reprobada'
    ),
    -- Alumno ISC 2024630304 (EST2024630304): 2 materias reprobadas
    (
        '467',
        'EST2024630304',
        'UA0020',
        '0',
        '0',
        'Reprobada'
    ),
    (
        '468',
        'EST2024630304',
        'UA0027',
        '2',
        '0',
        'Reprobada'
    );

DELETE FROM fechas_relevantes;

INSERT INTO
    fechas_relevantes (
        inicio_semestre,
        fin_semestre,
        registro_primer_parcial,
        fin_registro_primer_parcial,
        registro_segundo_parcial,
        fin_registro_segundo_parcial,
        registro_tercer_parcial,
        fin_registro_tercer_parcial,
        registro_extra,
        fin_registro_extra,
        evalu_profe,
        fin_evalu_profe,
        inscribir_ets,
        fin_inscribir_ets,
        subir_doc_ets,
        fin_subir_doc_ets,
        eval_ets,
        fin_evalu_ets,
        periodo
    )
VALUES (
        '2025-02-03 00:00:00', -- inicio_semestre
        '2025-06-20 23:59:59', -- fin_semestre
        '2025-12-01 00:00:00', -- registro_primer_parcial
        '2025-12-07 23:59:59', -- fin_registro_primer_parcial
        '2025-04-01 00:00:00', -- registro_segundo_parcial
        '2025-04-07 23:59:59', -- fin_registro_segundo_parcial
        '2025-05-01 00:00:00', -- registro_tercer_parcial
        '2025-05-07 23:59:59', -- fin_registro_tercer_parcial
        '2025-06-10 00:00:00', -- registro_extra
        '2025-06-12 23:59:59', -- fin_registro_extra
        '2025-12-01 00:00:00', -- evalu_profe
        '2025-12-15 23:59:59', -- fin_evalu_profe
        '2025-12-01 00:00:00', -- inscribir_ets
        '2025-12-30 23:59:59', -- fin_inscribir_ets
        '2025-12-01 00:00:00', -- subir_doc_ets
        '2025-12-03 23:59:59', -- fin_subir_doc_ets
        '2025-12-01 00:00:00', -- eval_ets
        '2025-12-30 23:59:59', -- fin_evalu_ets
        '2025-1' -- periodo
    );

DELETE FROM enfermedades;

DELETE FROM datos_medicos;

INSERT INTO
    datos_medicos (
        id,
        id_usuario,
        peso,
        altura,
        tipo_sangre,
        nss
    )
VALUES (
        'DM0001',
        '2024630101',
        70.5,
        1.75,
        'O+',
        '12345678901'
    ),
    (
        'DM0002',
        '2024630201',
        65.0,
        1.68,
        'A+',
        '12345678902'
    ),
    (
        'DM0003',
        '2024630301',
        80.0,
        1.80,
        'B+',
        '12345678903'
    ),
    (
        'DM0004',
        'HIJKLMNO',
        75.0,
        1.78,
        'O+',
        '98765432101'
    ),
    (
        'DM0005',
        'PROF0001',
        72.0,
        1.76,
        'AB+',
        '98765432102'
    );

-- ==================================================
-- ENFERMEDADES
-- ==================================================
INSERT INTO
    enfermedades (id, id_dat_med, descri)
VALUES (
        'ENF001',
        'DM0001',
        'Asma leve controlada'
    ),
    (
        'ENF002',
        'DM0002',
        'Ninguna enfermedad crónica'
    ),
    (
        'ENF003',
        'DM0003',
        'Hipertensión controlada con medicamento'
    );

DELETE FROM contador;

INSERT INTO
    contador (
        id_profesor,
        suma,
        registrados
    )
VALUES ('HIJKLMNO', 42, 5),
    ('PROF0001', 38, 4),
    ('PROF0002', 45, 5);

-- ==================================================================
-- PASE DE LISTA PARA GRUPOS 1, 2, 3, 4
-- ==================================================================
DELETE FROM lista;

-- GRUPO 1: 10 registros por alumno (MAT20246301011, MAT20246308382)
INSERT INTO
    lista (
        id,
        id_inscrito,
        fecha,
        asistencia
    )
VALUES (
        'LIS00101',
        'MAT20246301011',
        '2024-12-02',
        'Si'
    ),
    (
        'LIS00102',
        'MAT20246301011',
        '2024-12-04',
        'Si'
    ),
    (
        'LIS00103',
        'MAT20246301011',
        '2024-12-06',
        'No'
    ),
    (
        'LIS00104',
        'MAT20246301011',
        '2024-12-09',
        'Si'
    ),
    (
        'LIS00105',
        'MAT20246301011',
        '2024-12-11',
        'Si'
    ),
    (
        'LIS00106',
        'MAT20246301011',
        '2024-12-13',
        'Si'
    ),
    (
        'LIS00107',
        'MAT20246301011',
        '2024-12-16',
        'Si'
    ),
    (
        'LIS00108',
        'MAT20246301011',
        '2024-12-18',
        'No'
    ),
    (
        'LIS00109',
        'MAT20246301011',
        '2024-12-20',
        'Si'
    ),
    (
        'LIS00110',
        'MAT20246301011',
        '2024-12-23',
        'Si'
    ),
    (
        'LIS00201',
        'MAT20246308382',
        '2024-12-02',
        'Si'
    ),
    (
        'LIS00202',
        'MAT20246308382',
        '2024-12-04',
        'Si'
    ),
    (
        'LIS00203',
        'MAT20246308382',
        '2024-12-06',
        'Si'
    ),
    (
        'LIS00204',
        'MAT20246308382',
        '2024-12-09',
        'No'
    ),
    (
        'LIS00205',
        'MAT20246308382',
        '2024-12-11',
        'Si'
    ),
    (
        'LIS00206',
        'MAT20246308382',
        '2024-12-13',
        'Si'
    ),
    (
        'LIS00207',
        'MAT20246308382',
        '2024-12-16',
        'Si'
    ),
    (
        'LIS00208',
        'MAT20246308382',
        '2024-12-18',
        'Si'
    ),
    (
        'LIS00209',
        'MAT20246308382',
        '2024-12-20',
        'No'
    ),
    (
        'LIS00210',
        'MAT20246308382',
        '2024-12-23',
        'Si'
    );

-- GRUPO 2: 10 registros por alumno (MAT20246301012, MAT20246301022)
INSERT INTO
    lista (
        id,
        id_inscrito,
        fecha,
        asistencia
    )
VALUES (
        'LIS00301',
        'MAT20246301012',
        '2024-12-03',
        'No'
    ),
    (
        'LIS00302',
        'MAT20246301012',
        '2024-12-05',
        'No'
    ),
    (
        'LIS00303',
        'MAT20246301012',
        '2024-12-10',
        'No'
    ),
    (
        'LIS00304',
        'MAT20246301012',
        '2024-12-12',
        'No'
    ),
    (
        'LIS00305',
        'MAT20246301012',
        '2024-12-17',
        'Si'
    ),
    (
        'LIS00306',
        'MAT20246301012',
        '2024-12-19',
        'Si'
    ),
    (
        'LIS00307',
        'MAT20246301012',
        '2024-12-24',
        'Si'
    ),
    (
        'LIS00308',
        'MAT20246301012',
        '2024-12-26',
        'Si'
    ),
    (
        'LIS00309',
        'MAT20246301012',
        '2024-12-28',
        'No'
    ),
    (
        'LIS00310',
        'MAT20246301012',
        '2024-12-30',
        'Si'
    ),
    (
        'LIS00401',
        'MAT20246301022',
        '2024-12-03',
        'Si'
    ),
    (
        'LIS00402',
        'MAT20246301022',
        '2024-12-05',
        'Si'
    ),
    (
        'LIS00403',
        'MAT20246301022',
        '2024-12-10',
        'Si'
    ),
    (
        'LIS00404',
        'MAT20246301022',
        '2024-12-12',
        'Si'
    ),
    (
        'LIS00405',
        'MAT20246301022',
        '2024-12-17',
        'Si'
    ),
    (
        'LIS00406',
        'MAT20246301022',
        '2024-12-19',
        'Si'
    ),
    (
        'LIS00407',
        'MAT20246301022',
        '2024-12-24',
        'Si'
    ),
    (
        'LIS00408',
        'MAT20246301022',
        '2024-12-26',
        'Si'
    ),
    (
        'LIS00409',
        'MAT20246301022',
        '2024-12-28',
        'Si'
    ),
    (
        'LIS00410',
        'MAT20246301022',
        '2024-12-30',
        'Si'
    );

-- GRUPO 3: 10 registros por alumno (MAT20246301013, MAT20246301023)
INSERT INTO
    lista (
        id,
        id_inscrito,
        fecha,
        asistencia
    )
VALUES (
        'LIS00501',
        'MAT20246301013',
        '2024-12-02',
        'Si'
    ),
    (
        'LIS00502',
        'MAT20246301013',
        '2024-12-09',
        'Si'
    ),
    (
        'LIS00503',
        'MAT20246301013',
        '2024-12-16',
        'No'
    ),
    (
        'LIS00504',
        'MAT20246301013',
        '2024-12-23',
        'Si'
    ),
    (
        'LIS00505',
        'MAT20246301013',
        '2024-12-30',
        'Si'
    ),
    (
        'LIS00506',
        'MAT20246301013',
        '2024-12-06',
        'Si'
    ),
    (
        'LIS00507',
        'MAT20246301013',
        '2024-12-13',
        'Si'
    ),
    (
        'LIS00508',
        'MAT20246301013',
        '2024-12-20',
        'No'
    ),
    (
        'LIS00509',
        'MAT20246301013',
        '2024-12-27',
        'Si'
    ),
    (
        'LIS00510',
        'MAT20246301013',
        '2024-12-31',
        'Si'
    ),
    (
        'LIS00601',
        'MAT20246301023',
        '2024-12-02',
        'No'
    ),
    (
        'LIS00602',
        'MAT20246301023',
        '2024-12-09',
        'Si'
    ),
    (
        'LIS00603',
        'MAT20246301023',
        '2024-12-16',
        'Si'
    ),
    (
        'LIS00604',
        'MAT20246301023',
        '2024-12-23',
        'Si'
    ),
    (
        'LIS00605',
        'MAT20246301023',
        '2024-12-30',
        'No'
    ),
    (
        'LIS00606',
        'MAT20246301023',
        '2024-12-06',
        'Si'
    ),
    (
        'LIS00607',
        'MAT20246301023',
        '2024-12-13',
        'Si'
    ),
    (
        'LIS00608',
        'MAT20246301023',
        '2024-12-20',
        'Si'
    ),
    (
        'LIS00609',
        'MAT20246301023',
        '2024-12-27',
        'Si'
    ),
    (
        'LIS00610',
        'MAT20246301023',
        '2024-12-31',
        'No'
    );

-- GRUPO 4: 10 registros por alumno (MAT1000, MAT207347483 - primera materia)
INSERT INTO
    lista (
        id,
        id_inscrito,
        fecha,
        asistencia
    )
VALUES (
        'LIS00701',
        'MAT1000',
        '2024-12-02',
        'Si'
    ),
    (
        'LIS00702',
        'MAT1000',
        '2024-12-04',
        'Si'
    ),
    (
        'LIS00703',
        'MAT1000',
        '2024-12-06',
        'Si'
    ),
    (
        'LIS00704',
        'MAT1000',
        '2024-12-09',
        'No'
    ),
    (
        'LIS00705',
        'MAT1000',
        '2024-12-11',
        'Si'
    ),
    (
        'LIS00706',
        'MAT1000',
        '2024-12-13',
        'Si'
    ),
    (
        'LIS00707',
        'MAT1000',
        '2024-12-16',
        'Si'
    ),
    (
        'LIS00708',
        'MAT1000',
        '2024-12-18',
        'Si'
    ),
    (
        'LIS00709',
        'MAT1000',
        '2024-12-20',
        'No'
    ),
    (
        'LIS00710',
        'MAT1000',
        '2024-12-23',
        'Si'
    ),
    (
        'LIS00801',
        'MAT207347483',
        '2024-12-02',
        'Si'
    ),
    (
        'LIS00802',
        'MAT207347483',
        '2024-12-04',
        'No'
    ),
    (
        'LIS00803',
        'MAT207347483',
        '2024-12-06',
        'Si'
    ),
    (
        'LIS00804',
        'MAT207347483',
        '2024-12-09',
        'Si'
    ),
    (
        'LIS00805',
        'MAT207347483',
        '2024-12-11',
        'Si'
    ),
    (
        'LIS00806',
        'MAT207347483',
        '2024-12-13',
        'No'
    ),
    (
        'LIS00807',
        'MAT207347483',
        '2024-12-16',
        'Si'
    ),
    (
        'LIS00808',
        'MAT207347483',
        '2024-12-18',
        'Si'
    ),
    (
        'LIS00809',
        'MAT207347483',
        '2024-12-20',
        'Si'
    ),
    (
        'LIS00810',
        'MAT207347483',
        '2024-12-23',
        'Si'
    );

delete from inscripcion;

insert into
    inscripcion (
        id,
        id_alumno,
        fecha_hora_in,
        fecha_hora_cad
    )
values (
        'INS2025112401',
        '2024630101',
        '2025-12-16 07:00:00',
        '2025-12-16 22:00:00'
    );