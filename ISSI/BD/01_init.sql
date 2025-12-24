-- ==================================================
-- Inicialización y Definición de Tablas - BD SAES

DROP DATABASE IF EXISTS SAES;

CREATE DATABASE SAES;

USE SAES;

-- Eliminar tablas en orden inverso a las dependencias
DROP TABLE IF EXISTS fechas_relevantes;
DROP TABLE IF EXISTS avisos;
DROP TABLE IF EXISTS ets_grupo;
DROP TABLE IF EXISTS ets;
DROP TABLE IF EXISTS materia_reprobada;
DROP TABLE IF EXISTS contador;
DROP TABLE IF EXISTS mensaje_chat;
DROP TABLE IF EXISTS borrador_horario;
DROP TABLE IF EXISTS ua_aprobada;
DROP TABLE IF EXISTS kardex;
DROP TABLE IF EXISTS resena;
DROP TABLE IF EXISTS inscripcion;
DROP TABLE IF EXISTS mat_inscritos;
DROP TABLE IF EXISTS horario;
DROP TABLE IF EXISTS distribucion;
DROP TABLE IF EXISTS grupo;
DROP TABLE IF EXISTS unidad_de_aprendizaje;
DROP TABLE IF EXISTS estudiante;
DROP TABLE IF EXISTS enfermedades;
DROP TABLE IF EXISTS datos_medicos;
DROP TABLE IF EXISTS datos_personales;
DROP TABLE IF EXISTS carrera;
DROP TABLE IF EXISTS lista;

-- ==================================================
-- TABLAS DE USUARIOS Y DATOS PERSONALES
-- ==================================================

CREATE TABLE datos_personales (
    id VARCHAR(15) NOT NULL,
    contrasena TEXT NOT NULL,
    tipo_usuario TEXT NOT NULL,
    nombre TEXT NOT NULL,
    ape_paterno TEXT NOT NULL,
    ape_materno TEXT NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    RFC TEXT,
    tipo_sangre TEXT NOT NULL,
    CURP TEXT NOT NULL,
    nacionalidad TEXT NOT NULL,
    calle TEXT NOT NULL,
    num_exterior TEXT NOT NULL,
    num_interior TEXT NOT NULL,
    codigo_postal TEXT NOT NULL,
    colonia TEXT NOT NULL,
    delegacion TEXT NOT NULL,
    ciudad TEXT NOT NULL,
    telefono TEXT NOT NULL,
    email TEXT NOT NULL,
    foto BLOB,
    grado TEXT,
    carrera TEXT,
    situacion TEXT,
    calificacion FLOAT,
    primera_vez INT,
    CONSTRAINT PK_USUARIOS PRIMARY KEY (id)
);

CREATE TABLE datos_medicos (
    id VARCHAR(15) NOT NULL,
    id_usuario VARCHAR(15) NOT NULL,
    peso FLOAT NOT NULL,
    altura FLOAT NOT NULL,
    tipo_sangre TEXT NOT NULL,
    nss TEXT NOT NULL,
    CONSTRAINT PK_DM PRIMARY KEY (id),
    CONSTRAINT FK_DM_DP FOREIGN KEY (id_usuario) REFERENCES datos_personales (id)
);

CREATE TABLE enfermedades (
    id VARCHAR(15) NOT NULL,
    id_dat_med VARCHAR(15) NOT NULL,
    descri TEXT NOT NULL,
    CONSTRAINT PK_E PRIMARY KEY (id),
    CONSTRAINT FK_E_DM FOREIGN KEY (id_dat_med) REFERENCES datos_medicos (id)
);

CREATE TABLE estudiante (
    id VARCHAR(15) NOT NULL,
    id_usuario VARCHAR(15) NOT NULL,
    promedio FLOAT NOT NULL,
    creditos_disponibles FLOAT NOT NULL,
    estado_academico TEXT NOT NULL,
    CONSTRAINT PK_ES PRIMARY KEY (id),
    CONSTRAINT FK_ES_DP FOREIGN KEY (id_usuario) REFERENCES datos_personales (id)
);

CREATE TABLE carrera (
    nombre VARCHAR(40) NOT NULL,
    creditos_iniciales INT NOT NULL,
    prefijo_grupo TEXT NOT NULL,
    duracion_max INT NOT NULL,
    CONSTRAINT PK_CAR PRIMARY KEY (nombre)
);

CREATE TABLE unidad_de_aprendizaje (
    id VARCHAR(15) NOT NULL,
    nombre TEXT NOT NULL,
    credito FLOAT NOT NULL,
    carrera VARCHAR(40),
    semestre INT NOT NULL,
    tipo TEXT NOT NULL,
    CONSTRAINT PK_UA PRIMARY KEY (id),
    CONSTRAINT FK_UA_CAR FOREIGN KEY (carrera) REFERENCES carrera (nombre)
);

CREATE TABLE grupo (
    id VARCHAR(15) NOT NULL,
    nombre TEXT NOT NULL,
    id_ua VARCHAR(15) NOT NULL,
    id_prof VARCHAR(15) NOT NULL,
    turno TEXT NOT NULL,
    cupo INT NOT NULL,
    salon TEXT,
    reg_final INT,
    reg_extra INT,
    CONSTRAINT PK_GRU PRIMARY KEY (id),
    CONSTRAINT FK_GRU_DP FOREIGN KEY (id_prof) REFERENCES datos_personales (id),
    CONSTRAINT FK_GRU_UA FOREIGN KEY (id_ua) REFERENCES unidad_de_aprendizaje (id)
);

CREATE TABLE distribucion (
    id VARCHAR(15) NOT NULL,
    id_grupo VARCHAR(15) NOT NULL,
    hora_ini TEXT NOT NULL,
    hora_fin TEXT NOT NULL,
    dia TEXT NOT NULL,
    CONSTRAINT PK_DIS PRIMARY KEY (id),
    CONSTRAINT FK_DIS_GRU FOREIGN KEY (id_grupo) REFERENCES grupo (id)
);

CREATE TABLE horario (
    id VARCHAR(15) NOT NULL,
    id_alumno VARCHAR(15) NOT NULL,
    CONSTRAINT PK_HOR PRIMARY KEY (id),
    CONSTRAINT FK_HOR_DP FOREIGN KEY (id_alumno) REFERENCES datos_personales (id)
);

CREATE TABLE mat_inscritos (
    id VARCHAR(15) NOT NULL,
    id_horario VARCHAR(15) NOT NULL,
    id_grupo VARCHAR(15) NOT NULL,
    calificacion_primer FLOAT,
    calificacion_segundo FLOAT,
    calificacion_tercer FLOAT,
    calificacion_final FLOAT,
    extra FLOAT,
    CONSTRAINT PK_MAT PRIMARY KEY (id),
    CONSTRAINT FK_MAT_HOR FOREIGN KEY (id_horario) REFERENCES horario (id),
    CONSTRAINT FK_MAT_GRU FOREIGN KEY (id_grupo) REFERENCES grupo (id)
);

CREATE TABLE inscripcion (
    id VARCHAR(15) NOT NULL,
    id_alumno VARCHAR(15) NOT NULL,
    fecha_hora_in TIMESTAMP NOT NULL,
    fecha_hora_cad TIMESTAMP NOT NULL,
    CONSTRAINT PK_INS PRIMARY KEY (id),
    CONSTRAINT FK_INS_DP FOREIGN KEY (id_alumno) REFERENCES datos_personales (id)
);

CREATE TABLE resena (
    id VARCHAR(15) NOT NULL,
    id_profesor VARCHAR(15) NOT NULL,
    id_alumno VARCHAR(15) NOT NULL,
    calificacion FLOAT NOT NULL,
    comentarios TEXT,
    fecha DATE NOT NULL,
    periodo TEXT,
    CONSTRAINT PK_RE PRIMARY KEY (id),
    CONSTRAINT FK_RE_PRO FOREIGN KEY (id_profesor) REFERENCES datos_personales (id),
    CONSTRAINT FK_RE_ALU FOREIGN KEY (id_alumno) REFERENCES datos_personales (id)
);

CREATE TABLE kardex (
    id VARCHAR(15) NOT NULL,
    id_alumno VARCHAR(15) NOT NULL,
    promedio FLOAT NOT NULL,
    situacion_academica TEXT NOT NULL,
    semestres_restantes INT NOT NULL,
    creditos_obtenidos FLOAT NOT NULL,
    CONSTRAINT PK_KAR PRIMARY KEY (id),
    CONSTRAINT FK_KAR_DP FOREIGN KEY (id_alumno) REFERENCES datos_personales (id)
);

CREATE TABLE ua_aprobada (
    id VARCHAR(15) NOT NULL,
    id_kardex VARCHAR(15) NOT NULL,
    unidad_aprendizaje TEXT NOT NULL,
    calificacion_final FLOAT NOT NULL,
    semestre INT NOT NULL,
    periodo TEXT NOT NULL,
    fecha DATE NOT NULL,
    metodo_aprobado TEXT NOT NULL,
    CONSTRAINT PK_UAA PRIMARY KEY (id),
    CONSTRAINT FK_UAA_KAR FOREIGN KEY (id_kardex) REFERENCES kardex (id)
);

CREATE TABLE borrador_horario (
    id VARCHAR(15) NOT NULL,
    id_grupo VARCHAR(15) NOT NULL,
    id_alumno VARCHAR(15) NOT NULL,
    id_profesor VARCHAR(15) NOT NULL,
    calificacion TEXT NOT NULL,
    materia TEXT NOT NULL,
    horas_lun TEXT,
    horas_mar TEXT,
    horas_mie TEXT,
    horas_jue TEXT,
    horas_vie TEXT,
    creditos_necesarios FLOAT NOT NULL,
    valido TINYINT(1),
    CONSTRAINT PK_BOR PRIMARY KEY (id),
    CONSTRAINT FK_BOR_DP FOREIGN KEY (id_alumno) REFERENCES datos_personales (id),
    CONSTRAINT FK_BOR_PRO FOREIGN KEY (id_profesor) REFERENCES datos_personales (id),
    CONSTRAINT FK_BOR_GRU FOREIGN KEY (id_grupo) REFERENCES grupo (id)
);

CREATE TABLE lista (
    id VARCHAR(15) NOT NULL,
    id_inscrito VARCHAR(15) NOT NULL,
    fecha DATE NOT NULL,
    asistencia TEXT NOT NULL,
    CONSTRAINT PK_LIS PRIMARY KEY (id),
    CONSTRAINT FK_LIS_MAI FOREIGN KEY (id_inscrito) REFERENCES mat_inscritos (id)
);

CREATE TABLE mensaje_chat (
    id VARCHAR(15) NOT NULL,
    id_usuario VARCHAR(15) NOT NULL,
    fecha DATETIME NOT NULL,
    pregunta_realizada TEXT NOT NULL,
    respuesta_obtenida TEXT,
    CONSTRAINT PK_MEN PRIMARY KEY (id),
    CONSTRAINT FK_MEN_DP FOREIGN KEY (id_usuario) REFERENCES datos_personales (id)
);

CREATE TABLE contador (
    id_profesor VARCHAR(15) NOT NULL,
    suma INTEGER NOT NULL,
    registrados INTEGER NOT NULL,
    CONSTRAINT FK_CON_DP FOREIGN KEY (id_profesor) REFERENCES datos_personales (id)
);

create table materia_reprobada (
    id VARCHAR(15) NOT NULL,
    id_estudiante VARCHAR(15) NOT NULL,
    id_ua VARCHAR(15) NOT NULL,
    periodos_restantes integer not null,
    recurse integer not null,
    estado_actual TEXT NOT NULL,
    CONSTRAINT PK_MR PRIMARY KEY (id),
    CONSTRAINT FK_MR_ES FOREIGN KEY (id_estudiante) REFERENCES estudiante (id),
    CONSTRAINT FK_MR_UA FOREIGN KEY (id_ua) REFERENCES unidad_de_aprendizaje (id)
);

create table ets_grupo (
    id VARCHAR(15) NOT NULL,
    id_ua VARCHAR(15) NOT NULL,
    id_aplicante VARCHAR(15) NOT NULL,
    turno TEXT NOT NULL,
    hora_inicio TEXT NOT NULL,
    hora_final TEXT NOT NULL,
    fecha DATE NOT NULL,
    periodo TEXT NOT NULL,
    cupo int not null,
    CONSTRAINT PK_ETS_G PRIMARY KEY (id),
    CONSTRAINT FK_ETSG_UA FOREIGN KEY (id_ua) REFERENCES unidad_de_aprendizaje (id),
    CONSTRAINT FK_ETSG_DP FOREIGN KEY (id_aplicante) REFERENCES datos_personales (id)
);

create table ets (
    id VARCHAR(15) NOT NULL,
    id_mr VARCHAR(15) NOT NULL,
    id_grupo VARCHAR(15) NOT NULL,
    comprobante LONGBLOB,
    validado INTEGER NOT NULL,
    calificado FLOAT NOT NULL,
    CONSTRAINT PK_ETS PRIMARY KEY (id),

-- CASCADE para borrar ETS cuando se elimine la materia reprobada
CONSTRAINT FK_ETS_MR FOREIGN KEY (id_mr) REFERENCES materia_reprobada (id) ON DELETE CASCADE,

-- CASCADE para borrar ETS cuando se elimine el grupo del ETS
CONSTRAINT FK_ETS_AP 
        FOREIGN KEY (id_grupo) 
        REFERENCES ets_grupo (id)
        ON DELETE CASCADE
);

CREATE TABLE avisos (
    id VARCHAR(15) NOT NULL,
    titulo TEXT NOT NULL,
    descripcion TEXT NOT NULL,
    imagen LONGBLOB,
    objetivo TEXT NOT NULL,
    fecha_vencimiento DATETIME NOT NULL,
    CONSTRAINT PK_AVI PRIMARY KEY (id)
);

CREATE TABLE fechas_relevantes (
    inicio_semestre DATETIME NOT NULL,
    fin_semestre DATETIME NOT NULL,
    registro_primer_parcial DATETIME NOT NULL,
    fin_registro_primer_parcial DATETIME NOT NULL,
    registro_segundo_parcial DATETIME NOT NULL,
    fin_registro_segundo_parcial DATETIME NOT NULL,
    registro_tercer_parcial DATETIME NOT NULL,
    fin_registro_tercer_parcial DATETIME NOT NULL,
    registro_extra DATETIME NOT NULL,
    fin_registro_extra DATETIME NOT NULL,
    evalu_profe DATETIME NOT NULL,
    fin_evalu_profe DATETIME NOT NULL,
    inscribir_ets DATETIME NOT NULL,
    fin_inscribir_ets DATETIME NOT NULL,
    subir_doc_ets DATETIME NOT NULL,
    fin_subir_doc_ets DATETIME NOT NULL,
    eval_ets DATETIME NOT NULL,
    fin_evalu_ets DATETIME NOT NULL,
    periodo TEXT NOT NULL
);