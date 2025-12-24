-- ==================================================================
-- 4. INSERCION DE GRUPOS Y DISTRIBUCION DE HORARIOS (DINAMICO - VERSION DIRECTA)
-- Se crean grupos de forma dinamica para UAs OBLIGATORIAS y OPTATIVAS
-- Distribucion equitativa entre 30 profesores: 178 grupos / 30 = 6 grupos por profesor
-- ==================================================================

USE SAES;

SET FOREIGN_KEY_CHECKS = 0;

DELETE FROM mat_inscritos;

DELETE FROM distribucion;

DELETE FROM grupo;

SET FOREIGN_KEY_CHECKS = 1;

-- Variables globales para contadores
SET @grupo_id_counter = 0;

SET @dist_id_counter = 0;

SET @prof_index = 0;

-- Lista de 30 profesores para rotacion equitativa
SET
    @profesores = 'HIJKLMNO,PROF0001,PROF0002,P0001RSV,P0002KND,P0003HGR,P0004ABC,P0005DEF,P0006GHI,P0007JKL,P0008MNO,P0009PQR,P0010STU,P0011VWX,P0012YZA,P0013BCD,P0014EFG,P0015HIJ,P0016KLM,P0017NOP,P0018QRS,P0019TUV,P0020ABC,P0021DEF,P0022GHI,P0023JKL,P0024MNO,P0025PQR,P0026STU,P0027VWX,P0028YZA,P0029BCD';

SET @num_profesores = 30;

SET @last_nombre := '';

SET @salon_actual := '';

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
SELECT
    CONCAT(
        'G',
        LPAD(
            @grupo_id_counter := @grupo_id_counter + 1,
            5,
            '0'
        )
    ),
    CONCAT(
        ua.semestre,
        (
            SELECT prefijo_grupo
            FROM carrera
            WHERE
                nombre = ua.carrera
        ),
        IF(
            @grupo_id_counter % 2 = 0,
            'M',
            'V'
        ),
        '1'
    ) AS nombre,
    ua.id,
    SUBSTRING_INDEX(
        SUBSTRING_INDEX(
            @profesores,
            ',',
            (
                @prof_index := @prof_index + 1
            ) % @num_profesores + 1
        ),
        ',',
        -1
    ),
    IF(
        @grupo_id_counter % 2 = 0,
        'Matutino',
        'Vespertino'
    ),
    35,
    -- SALON: mismo para mismo nombre
    @salon_actual := IF(
        @last_nombre = CONCAT(
            ua.semestre,
            (
                SELECT prefijo_grupo
                FROM carrera
                WHERE
                    nombre = ua.carrera
            ),
            IF(
                @grupo_id_counter % 2 = 0,
                'M',
                'V'
            ),
            '1'
        ),
        @salon_actual,
        CONCAT(
            'SAL-',
            FLOOR(RAND() * 900 + 100)
        )
    ) AS salon,
    0,
    0
FROM unidad_de_aprendizaje ua
ORDER BY ua.carrera, ua.semestre, ua.id;

-- ===============================================================
-- INSERCION DE GRUPOS OPTATIVOS
-- ===============================================================
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
SELECT
    CONCAT(
        'G',
        LPAD(
            @grupo_id_counter := @grupo_id_counter + 1,
            5,
            '0'
        )
    ),
    CONCAT(
        ua.semestre,
        (
            SELECT prefijo_grupo
            FROM carrera
            WHERE
                nombre = ua.carrera
        ),
        IF(
            @grupo_id_counter % 2 = 0,
            'M',
            'V'
        ),
        '1'
    ) AS nombre,
    ua.id,
    SUBSTRING_INDEX(
        SUBSTRING_INDEX(
            @profesores,
            ',',
            (
                @prof_index := @prof_index + 1
            ) % @num_profesores + 1
        ),
        ',',
        -1
    ),
    IF(
        @grupo_id_counter % 2 = 0,
        'Matutino',
        'Vespertino'
    ),
    30,
    -- SALON: mismo para mismo nombre
    @salon_actual := IF(
        @last_nombre = CONCAT(
            ua.semestre,
            (
                SELECT prefijo_grupo
                FROM carrera
                WHERE
                    nombre = ua.carrera
            ),
            IF(
                @grupo_id_counter % 2 = 0,
                'M',
                'V'
            ),
            '1'
        ),
        @salon_actual,
        CONCAT(
            'SAL-',
            FLOOR(RAND() * 900 + 100)
        )
    ) AS salon,
    0,
    0
FROM unidad_de_aprendizaje ua
ORDER BY ua.carrera, ua.semestre, ua.id;

-- =====================================================
-- LIMPIEZA SOLO DISTRIBUCION
-- =====================================================
DELETE FROM distribucion;

-- =====================================================
-- CONTADOR
-- =====================================================
SET @dist_id_counter = 0;

-- =====================================================
-- PROCEDURE GENERAR DISTRIBUCION SIN TRASLAPES
-- =====================================================
USE SAES;

DELETE FROM distribucion;

SET @dist_id = 0;

DELIMITER $$

CREATE PROCEDURE generar_distribucion()
BEGIN
    DECLARE done INT DEFAULT 0;

    DECLARE v_grupo_id VARCHAR(15);
    DECLARE v_nombre TEXT;

    DECLARE v_day_offset INT;
    DECLARE v_day_iter INT;
    DECLARE v_dia_index INT;

    DECLARE v_slot INT;
    DECLARE v_insertados INT;

    DECLARE v_dia VARCHAR(15);
    DECLARE v_ini TIME;
    DECLARE v_fin TIME;

    DECLARE cur CURSOR FOR
        SELECT id, nombre
        FROM grupo
        ORDER BY id;

    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;

    OPEN cur;

    loop_grupos: LOOP
        FETCH cur INTO v_grupo_id, v_nombre;
        IF done THEN LEAVE loop_grupos; END IF;

        SET v_insertados = 0;

        -- offset pseudo-aleatorio por grupo (0..4)
        SET v_day_offset = FLOOR(RAND() * 5);
        SET v_day_iter = 0;

        -- recorrer dias rotados hasta insertar 3
        WHILE v_day_iter < 5 AND v_insertados < 3 DO
            SET v_dia_index = (v_day_offset + v_day_iter) % 5;

            SET v_dia = CASE v_dia_index
                WHEN 0 THEN 'Lunes'
                WHEN 1 THEN 'Martes'
                WHEN 2 THEN 'Miercoles'
                WHEN 3 THEN 'Jueves'
                WHEN 4 THEN 'Viernes'
            END;

            SET v_slot = 0;

            buscar_franja: LOOP
                SET v_ini = ADDTIME('07:00', SEC_TO_TIME(v_slot * 5400));
                SET v_fin = ADDTIME(v_ini, '01:30');

                IF v_fin > '22:00' THEN
                    LEAVE buscar_franja;
                END IF;

                IF NOT EXISTS (
                    SELECT 1
                    FROM distribucion d
                    JOIN grupo g ON g.id = d.id_grupo
                    WHERE g.nombre = v_nombre
                      AND d.dia = v_dia
                      AND NOT (
                          v_fin <= CAST(d.hora_ini AS TIME)
                          OR v_ini >= CAST(d.hora_fin AS TIME)
                      )
                ) THEN
                    INSERT INTO distribucion (
                        id,
                        id_grupo,
                        hora_ini,
                        hora_fin,
                        dia
                    ) VALUES (
                        CONCAT('D', LPAD(@dist_id := @dist_id + 1, 5, '0')),
                        v_grupo_id,
                        DATE_FORMAT(v_ini, '%H:%i'),
                        DATE_FORMAT(v_fin, '%H:%i'),
                        v_dia
                    );

                    SET v_insertados = v_insertados + 1;
                    LEAVE buscar_franja;
                END IF;

                SET v_slot = v_slot + 1;
            END LOOP;

            SET v_day_iter = v_day_iter + 1;
        END WHILE;
    END LOOP;

    CLOSE cur;
END$$

DELIMITER ;

CALL generar_distribucion ();

DROP PROCEDURE generar_distribucion;