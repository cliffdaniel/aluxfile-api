# AluxFile API

## Descripción
AluxFile API es un sistema backend desarrollado con **NestJS** utilizando **Domain-Driven Design (DDD)** para la gestión de archivos en AWS S3, autenticación con JWT, cifrado de contraseñas con Bcrypt y envío de correos electrónicos con Nodemailer.

## Características Principales
### Arquitectura y Diseño
- **Domain-Driven Design (DDD):** La estructura del proyecto sigue la arquitectura DDD con separación de responsabilidades en **application (casos de uso), domain (entidades y repositorios) e infrastructure (controladores y servicios externos)**.
- **Uso de Use Cases:** Cada funcionalidad del sistema está encapsulada en casos de uso específicos para mantener una lógica de negocio limpia y reutilizable.

### Funcionalidades Implementadas
- **Autenticación y Seguridad:**
  - Registro de usuarios con contraseña encriptada (Bcrypt).
  - Inicio de sesión con generación de token JWT.
  - Recuperación de contraseña con envío de correo electrónico.
- **Gestión de Archivos con AWS S3:**
  - **Subida de archivos desde el dispositivo** a AWS S3.
  - **Subida de imágenes desde una URL externa** directamente a AWS S3.
  - **Descarga de archivos** desde AWS S3.
  - **Renombrar archivos** en AWS S3.
  - **Obtener enlace de un archivo** almacenado en AWS S3.
- **Búsqueda de Imágenes Online:**
  - Integración con la API de Unsplash para buscar imágenes en línea.

### Tecnologías Utilizadas
- **NestJS** – Framework de Node.js para el desarrollo de la API.
- **TypeScript** – Tipado estático para mayor robustez.
- **AWS S3** – Almacenamiento de archivos.
- **JWT** – Autenticación basada en tokens.
- **Bcrypt** – Cifrado de contraseñas.
- **Nodemailer** – Envío de correos electrónicos.
- **Axios** – Para realizar peticiones HTTP externas.
- **ESLint y Prettier** – Mantenimiento de estándares de código limpio.

## Pruebas Unitarias
Se implementaron pruebas unitarias con **Jest** para garantizar la fiabilidad de los casos de uso. Se validaron los siguientes escenarios:
- **Auth:**
  - Registro de usuario con validaciones de email en uso.
  - Inicio de sesión con credenciales válidas e inválidas.
  - Envío de correo para recuperación de contraseña.
- **Gestión de archivos:**
  - Subida de archivos locales y desde URL externa a AWS S3.
  - Generación de enlaces de descarga.
  - Renombrado de archivos en S3.
  - Manejo de errores cuando el archivo no existe.

## Problema con los Permisos en AWS S3
Actualmente, existe un problema de permisos en el **bucket de S3**, lo que impide la correcta ejecución de ciertas operaciones, como renombrar archivos. Se requiere la configuración de permisos adecuados para permitir la copia y eliminación de objetos dentro del bucket.

## Instalación y Configuración
### Requisitos Previos
- Node.js 18+
- AWS S3 Bucket con credenciales configuradas

### Instalación
```sh
npm install
```

### Configuración de Variables de Entorno
Crear un archivo `.env` con las siguientes variables:
```
PORT=3000
JWT_SECRET=your_jwt_secret
AWS_BUCKET_NAME=your_bucket_name
AWS_ACCESS_KEY=your_access_key
AWS_SECRET_KEY=your_secret_key
AWS_REGION=your_region
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
UNSPLASH_ACCESS_KEY=your_unsplash_api_key
```

### Ejecución en Desarrollo
```sh
npm run start:dev
```

### Ejecución de Pruebas
```sh
npm run test
```

## API Documentation
La documentación de la API está disponible en Swagger:
```
http://localhost:3000/api
```

## Contribución
Cualquier mejora o corrección es bienvenida mediante **Pull Requests**.
