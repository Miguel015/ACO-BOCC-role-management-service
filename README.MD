Este es un archivo `README.md` profesional y estructurado, diseñado específicamente para una arquitectura hexagonal en Node.js 24 con TypeScript.

---

# IAM Management Lambda (Roles & Users)

Esta función Lambda de AWS está diseñada para gestionar la creación de **Roles** y **Usuarios**, siguiendo los principios de **Clean Architecture** y **Arquitectura Hexagonal**. El objetivo es mantener el núcleo del negocio (dominio) aislado de las implementaciones técnicas y de infraestructura.

## 🚀 Tecnologías Principales

- **Runtime:** Node.js 24.x
- **Lenguaje:** TypeScript 5.x
- **Base de Datos:** PostgreSQL
- **Infraestructura:** AWS Lambda

---

## 📂 Estructura del Proyecto

El proyecto se organiza bajo el patrón de arquitectura por capas para garantizar escalabilidad y testeabilidad:

```text
src/
├── application/      # Orquestación de lógica de negocio (Casos de Uso)
│   └── use-cases/    # Ej: CreateUserUseCase.ts, CreateRoleUseCase.ts
├── domain/           # El "corazón" de la app (Reglas de negocio puras)
│   ├── entities/     # Modelos de dominio (User, Role)
│   ├── repositories/ # Interfaces/Contratos para persistencia
│   └── services/     # Lógica compleja que no cabe en una entidad
├── infrastructure/   # Detalles de implementación y herramientas externas
│   ├── persistence/  # Configuración de DB y Repositorios (TypeORM/Prisma/Kysely)
│   └── services/     # Clientes AWS, APIs de terceros, etc.
├── interfaces/       # Adaptadores de entrada
│   └── handlers/     # Handlers de AWS Lambda (Punto de entrada)
└── shared/           # Código común, Errores personalizados y DTOs
```

---

## 🛠️ Instalación y Configuración

1.  **Instalar dependencias:**

    ```bash
    npm install
    ```

2.  **Variables de Entorno (`.env`):**
    Crea un archivo en la raíz con los siguientes parámetros:
    - `DB_HOST`: Host de PostgreSQL.
    - `DB_PORT`: Puerto (por defecto 5432).
    - `DB_USER`: Usuario de base de datos.
    - `DB_PASSWORD`: Contraseña.
    - `DB_NAME`: Nombre de la base de datos.

3.  **Compilación:**
    ```bash
    npm run build
    ```

---

## 🧪 Flujo de Ejecución

1.  **Handler:** Recibe el evento de AWS (API Gateway, EventBridge, etc.).
2.  **Application Layer:** El Handler llama a un Caso de Uso específico.
3.  **Domain Layer:** El Caso de Uso ejecuta la lógica utilizando entidades y llama a la interfaz del repositorio.
4.  **Infrastructure Layer:** La implementación concreta del repositorio realiza la operación en PostgreSQL.

---

## 📝 Scripts Disponibles

- `npm run build`: Compila el código TypeScript a JavaScript en la carpeta `dist/`.
- `npm run watch`: Compila en modo observación para desarrollo.
- `npm run test`: Ejecuta las pruebas unitarias (recomendado Jest).
- `npm run lint`: Ejecuta el linter para asegurar la calidad del código.

---

## 🔐 Seguridad y Mejores Prácticas

- **Validación de entrada:** Se recomienda usar librerías como `Zod` o `Joi` en la capa de `interfaces` para validar los payloads antes de que lleguen al dominio.
- **Inyección de Dependencias:** Las implementaciones de `infrastructure` se inyectan en los `use-cases` a través de sus constructores utilizando las interfaces definidas en `domain`.
- **Manejo de Errores:** Utiliza la carpeta `shared/` para definir excepciones globales que el handler pueda capturar y transformar en respuestas HTTP adecuadas.

---

> **Nota:** Asegúrate de que el Role de IAM de la Lambda tenga los permisos necesarios para conectarse a la VPC de la base de datos y para gestionar identidades si se requiere integración con AWS IAM.
