-- ==================================================================
-- 6. GRUPOS ETS (EXAMENES A TITULO DE SUFICIENCIA)
-- ==================================================================
-- Descripción: Grupos de ETS para materias reprobadas
-- Orden de ejecución: 6
-- Prerequisito: Ejecutar 02, 03, 04 y 05
-- ==================================================================

USE SAES;

DELETE FROM ets_grupo;

-- ==================================================================
-- INSERTAR 5 GRUPOS ETS
-- ==================================================================

INSERT INTO
    ets_grupo (
        id,
        id_ua,
        id_aplicante,
        turno,
        hora_inicio,
        hora_final,
        fecha,
        periodo,
        cupo
    )
VALUES
    -- Grupo ETS 1: Fundamentos de Programación (ISC - Semestre 1)
    (
        'ETSG001',
        'UA0071',
        'HIJKLMNO',
        'Matutino',
        '08:00',
        '10:00',
        '2025-12-20',
        '2025-1',
        30
    ),
    -- Grupo ETS 2: Matemáticas Discretas (IIA - Semestre 1)
    (
        'ETSG002',
        'UA0052',
        'PROF0001',
        'Vespertino',
        '15:00',
        '17:00',
        '2025-12-20',
        '2025-1',
        30
    ),
    -- Grupo ETS 3: Fundamentos de Programación (LCD - Semestre 1)
    (
        'ETSG003',
        'UA0096',
        'PROF0002',
        'Matutino',
        '10:00',
        '12:00',
        '2025-12-21',
        '2025-1',
        30
    ),
    -- Grupo ETS 4: Programación Orientada a Objetos (ISC - Semestre 2)
    (
        'ETSG004',
        'UA0007',
        'P0001RSV',
        'Vespertino',
        '16:00',
        '18:00',
        '2025-12-21',
        '2025-1',
        25
    ),
    -- Grupo ETS 5: Álgebra Lineal (LCD - Semestre 2)
    (
        'ETSG005',
        'UA0098',
        'P0002KND',
        'Matutino',
        '08:00',
        '10:00',
        '2025-12-22',
        '2025-1',
        25
    );

SELECT
    eg.id,
    eg.turno,
    eg.fecha,
    eg.hora_inicio,
    eg.hora_final,
    ua.nombre AS materia,
    ua.carrera,
    ua.semestre,
    dp.nombre AS profesor_aplicante,
    eg.cupo
FROM
    ets_grupo eg
    INNER JOIN unidad_de_aprendizaje ua ON ua.id = eg.id_ua
    INNER JOIN datos_personales dp ON dp.id = eg.id_aplicante
ORDER BY eg.fecha, eg.hora_inicio;

SELECT CONCAT(
        'Total de grupos ETS creados: ', COUNT(*)
    ) AS resultado
FROM ets_grupo;