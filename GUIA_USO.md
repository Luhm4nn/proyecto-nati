# Manual de Administración — Alemán Para Vos

Este documento es la guía de uso del panel de administración, explicando qué hacer en cada situación: cómo crear, editar, eliminar y qué hacer cuando algo no funciona como se espera.

**Acceso al panel:** [alemanparavos.com/login](https://alemanparavos.com/login)

---

## Tabla de contenidos

1. [Acceso y sesión](#1-acceso-y-sesión)
2. [Estructura del panel](#2-estructura-del-panel)
3. [Inscripciones](#3-inscripciones)
4. [Cursos y Dictados](#4-cursos-y-dictados)
5. [Consultas](#5-consultas)
6. [Novedades](#6-novedades)
7. [Testimonios](#7-testimonios)
8. [Materiales](#8-materiales)
9. [Datos de cobro](#9-datos-de-cobro)
10. [Referencia de errores](#10-referencia-de-errores)

---

## 1. Acceso y sesión

### Iniciar sesión

1. Ingresar a [alemanparavos.com/login](https://alemanparavos.com/login).
2. Completar email y contraseña.
3. Hacer clic en **Ingresar**.

Al iniciar sesión correctamente serás redirigida automáticamente al panel.

---

### Cierre de sesión automático (por inactividad)

La sesión expira tras **30 minutos sin actividad**. Cuando eso ocurre:

- Si intentás hacer cualquier acción (guardar, eliminar, cambiar estado), el sistema muestra un aviso de sesión expirada.
- La página te redirige automáticamente al login.
- **No perdiste ningún dato** — simplemente tenés que volver a iniciar sesión.

Esto es una medida de seguridad, no un error del sistema.

---

### Cerrar sesión manualmente

Usar el botón **Cerrar sesión** en la parte superior del panel. Se recomienda hacerlo siempre al terminar, especialmente en una computadora compartida o pública.

---

### Problemas al iniciar sesión

| Qué ves | Qué pasó | Qué hacer |
|---|---|---|
| "Credenciales inválidas" | El email o la contraseña no coinciden | Verificar que no haya mayúsculas o espacios de más. Recordá que la contraseña distingue mayúsculas. |
| El botón de ingresar queda bloqueado o no responde | Se hicieron demasiados intentos fallidos en poco tiempo (límite: 5 por minuto) | Esperar 1 minuto y volver a intentar. |
| La página tarda mucho en cargar | El servidor puede estar iniciando tras un período inactivo | Esperar entre 30 y 60 segundos y recargar la página. Es normal. |
| "No autorizado" en el panel después de un rato | La sesión expiró por inactividad | Volver a iniciar sesión normalmente. |
| Olvidé la contraseña | — | Contactar al administrador técnico para que la restablezca. |

---

## 2. Estructura del panel

El panel está organizado en pestañas en la parte superior:

| Pestaña | Para qué sirve |
|---|---|
| **Inscripciones** | Ver y gestionar a los alumnos que se anotaron. Es la pestaña que aparece por defecto. |
| **Cursos** | Crear y modificar los cursos que aparecen en el sitio, con sus horarios y cupos. |
| **Consultas** | Mensajes recibidos desde el formulario de contacto del sitio. |
| **Novedades** | Publicar y editar noticias o anuncios que aparecen en la web. |
| **Testimonios** | Gestionar los comentarios de alumnos que se muestran en el sitio. |
| **Materiales** | Archivos y recursos que los alumnos pueden descargar o ver. |
| **Transferencia** | Los datos bancarios que se incluyen en los mails de confirmación de inscripción. |

---

## 3. Inscripciones

### Qué representa esta sección

Cada vez que alguien completa el formulario de inscripción en el sitio, aparece aquí como una inscripción con estado **Pendiente**. También podés registrar inscripciones manualmente para alumnos que se contactaron por WhatsApp, Instagram u otro medio.

---

### Estados de una inscripción

| Estado | Qué significa |
|---|---|
| **Pendiente** | El alumno completó el formulario. Está esperando revisión y confirmación de pago. |
| **Confirmada** | El alumno fue aceptado. Se le envió automáticamente un mail de confirmación con los datos del curso y la información bancaria para el pago. |

---

### Ver la lista de inscripciones

Al entrar a la pestaña Inscripciones verás todas las inscripciones ordenadas por fecha (las más recientes primero). Podés filtrar por estado usando los botones: **Todas / Pendientes / Confirmadas**.

Cada fila muestra: nombre, apellido, email, teléfono (si lo dejó), curso y dictado al que se anotó, fecha y estado actual.

---

### Confirmar una inscripción

1. Localizar al alumno en la lista (tip: filtrar por **Pendientes** para ver solo los que esperan confirmación).
2. Hacer clic en el ícono de **confirmar** (sobre o tilde según la vista).
3. El sistema:
   - Cambia el estado a **Confirmada**.
   - Envía automáticamente un mail al alumno con los detalles del curso y los datos para el pago.
   - Descuenta 1 cupo del dictado.

> Si el envío del mail falla por un corte de conexión, la inscripción **igual queda confirmada** en el sistema. El mail puede reenviarse manualmente si fuera necesario.

---

### Ver el comprobante de pago

Si el alumno adjuntó un comprobante al inscribirse, aparece un ícono para verlo. Hacerlo abre el archivo en una nueva pestaña del navegador (puede ser una imagen o un PDF).

Si no hay ícono de comprobante, el alumno no adjuntó ningún archivo al inscribirse.

---

### Registrar una inscripción manualmente

Para alumnos que se contactaron por fuera de la web:

1. Hacer clic en **+ Nueva Inscripción**.
2. Completar: nombre, apellido, email y opcionalmente teléfono.
3. Elegir el **Curso** del desplegable.
4. Una vez elegido el curso, elegir el **Dictado** (el horario específico con su grupo).
5. Hacer clic en **Guardar**.

Las inscripciones manuales se crean directamente con estado **Confirmada**. El cupo del dictado se descuenta automáticamente. Al guardar, se envía un mail de confirmación al alumno.

---

### Eliminar una inscripción

1. Hacer clic en el ícono de **eliminar** (tacho) sobre la inscripción.
2. Confirmar la acción en el aviso que aparece.

Si la inscripción eliminada estaba **Confirmada**, el cupo que ocupaba se libera y vuelve a estar disponible. Esta acción **no se puede deshacer**.

---

### Posibles errores en Inscripciones

| Qué ves | Qué pasó | Qué hacer |
|---|---|---|
| "No quedan cupos disponibles" | El dictado elegido ya está completo | Verificar los cupos en la pestaña **Cursos** y aumentarlos si corresponde, o seleccionar otro dictado. |
| "El dictado no existe o no está disponible" | El dictado fue eliminado previamente | Recargar la página y elegir un dictado activo. |
| "Inscripción no encontrada" | Alguien eliminó esa inscripción mientras la tenías abierta | Recargar la lista. |
| "Esta inscripción ya fue confirmada" | Se intentó confirmar una inscripción que ya estaba en estado Confirmada | No hace falta hacer nada, ya está en orden. |
| "No autorizado" al intentar cualquier acción | La sesión expiró (más de 30 min sin actividad) | Volver a iniciar sesión. Los cambios no guardados se pierden. |
| El mail de confirmación no llegó al alumno | Problema puntual de entrega | Verificar la carpeta de spam del alumno. Si persiste, contactar soporte técnico. |
| Error al guardar (genérico) | Problema de conexión momentáneo | Esperar unos segundos y volver a intentar. |

---

## 4. Cursos y Dictados

### Diferencia entre Curso y Dictado

Entender esta diferencia es clave para usar esta sección:

- **Curso**: Es el producto en sí. Define el nombre, la descripción, lo que incluye y los precios. Ejemplo: *Alemán Nivel A1*.
- **Dictado**: Es una instancia concreta en el tiempo de ese curso. Define cuándo se dicta: días, horario, fechas de inicio y fin, y cuántos cupos tiene. Un mismo curso puede tener varios dictados (por ejemplo, un grupo de mañana y uno de tarde).

---

### Crear un curso nuevo

1. Hacer clic en **+ Nuevo Curso**.
2. Completar los campos:
   - **Título**: nombre del curso tal como aparecerá en el sitio.
   - **Descripción**: texto explicativo para los interesados.
   - **Ítems incluidos**: hacer clic en _+ Agregar ítem_ para listar qué incluye el curso (ejemplo: _Material de estudio_, _Certificado_, etc.).
   - **Valor en pesos**: precio para alumnos en Argentina.
   - **Valor internacional**: precio para alumnos en el exterior (en pesos a tipo de cambio alternativo u otro acuerdo).
   - **Valor en dólares**: precio en dólares para alumnos internacionales.
3. Hacer clic en **Guardar**.

El curso queda **activo** por defecto, es decir, visible en el sitio.

---

### Editar un curso

1. Hacer clic en el ícono de **editar** (lápiz) sobre el curso.
2. Modificar los campos necesarios.
3. Hacer clic en **Guardar cambios**.

Editar un curso no afecta las inscripciones ya existentes ni los mails ya enviados.

---

### Activar o desactivar un curso

El toggle **Activo** controla si el curso aparece en el sitio público:

- **Activo (encendido)**: visible en el sitio, los alumnos pueden inscribirse.
- **Inactivo (apagado)**: oculto del sitio, los alumnos no lo ven ni pueden inscribirse.

Desactivar un curso **no borra nada** — es la forma correcta de ocultarlo temporalmente sin perder datos.

---

### Crear un dictado

Dentro de un curso, hacer clic en **+ Nuevo Dictado**:

1. Completar:
   - **Fecha de inicio y fecha de fin** del dictado.
   - **Horario de inicio y horario de fin** de cada clase.
   - **Días de la semana** en que se dicta (selección múltiple).
   - **Cupos**: cantidad máxima de alumnos. Poner **0** si no hay límite.
2. Hacer clic en **Guardar**.

El dictado queda **activo** por defecto y aparece como opción en el formulario de inscripción del sitio.

---

### ¿Cómo funciona el contador de cupos?

Cada dictado muestra algo como `3 / 8 alumnos`, que significa: 3 inscripciones confirmadas de un máximo de 8 cupos.

- Al confirmar una inscripción → el contador sube en 1.
- Al eliminar una inscripción confirmada → el contador baja en 1.
- Cuando el dictado llega al máximo de cupos → el formulario web bloquea automáticamente nuevas inscripciones para ese dictado.

---

### Eliminar un curso o un dictado

> ⚠️ Atención antes de eliminar:
> - Eliminar un **dictado** borra también **todas las inscripciones** de ese dictado.
> - Eliminar un **curso** borra todos sus dictados y todas sus inscripciones.
> - Estas acciones **no tienen vuelta atrás**.
>
> Si querés dejar de ofrecer un curso temporalmente, usá el toggle **Inactivo** en lugar de eliminarlo.

Para eliminar:
1. Hacer clic en el ícono de **eliminar** (tacho).
2. Confirmar en el aviso que aparece.

---

### Posibles errores en Cursos y Dictados

| Qué ves | Qué pasó | Qué hacer |
|---|---|---|
| "Curso no encontrado" | El curso fue eliminado mientras lo tenías abierto | Recargar la lista de cursos. |
| "Dictado no encontrado" | El dictado fue eliminado previamente | Recargar la lista de dictados del curso. |
| "No autorizado" | La sesión expiró | Volver a iniciar sesión. |
| El dictado no aparece en el formulario del sitio | El dictado o el curso están desactivados | Verificar el toggle **Activo** en el curso y en el dictado. |
| El formulario del sitio no permite inscribirse | El cupo del dictado está completo | Aumentar los cupos desde la edición del dictado. |

---

## 5. Consultas

### Qué son las consultas

Son los mensajes que los visitantes envían desde el formulario de contacto del sitio. Cada consulta contiene nombre, email, teléfono (opcional) y mensaje.

---

### Estados de una consulta

| Estado | Significado |
|---|---|
| **Pendiente** | Mensaje recibido, todavía no revisado. |
| **Revisada** | Fue leído pero aún no se respondió. |
| **Contactada** | Se respondió o se contactó al remitente. |

---

### Cambiar el estado de una consulta

En cada tarjeta hay un selector desplegable con los tres estados. Al elegir uno, el cambio se guarda automáticamente — no hace falta hacer clic en ningún botón de guardar.

---

### Filtrar consultas

Los botones en la parte superior (Todas / Pendientes / Revisadas / Contactadas) filtran la lista para facilitar el seguimiento.

---

### Reglas del formulario público (sitio web)

- El mismo email **no puede enviar más de una consulta cada 24 horas**. Si lo intenta, el sitio le muestra un mensaje informándole que ya envió una consulta recientemente.
- Hay un límite de **10 envíos por hora por IP** para prevenir spam. Si se supera, el sitio bloquea temporalmente nuevos envíos desde esa conexión.

Estas restricciones no afectan al panel de administración.

---

### Posibles errores en Consultas

| Qué ves | Qué pasó | Qué hacer |
|---|---|---|
| "Consulta no encontrada" | La consulta fue eliminada mientras la tenías abierta | Recargar la lista. |
| "No autorizado" | La sesión expiró | Volver a iniciar sesión. |
| La lista aparece vacía | No hay consultas con el filtro activo | Probar con el filtro **Todas**. |

---

## 6. Novedades

Las novedades son tarjetas con imagen, título y descripción que aparecen en la sección de novedades del sitio público. No tienen toggle activo/inactivo: si existen, se muestran. Para ocultarlas hay que eliminarlas.

---

### Crear una novedad

1. Hacer clic en **+ Nueva Novedad**.
2. Completar:
   - **Título**
   - **Descripción**
   - **Imagen** (obligatoria)
3. Hacer clic en **Guardar**.

La imagen se sube automáticamente a la nube. Una vez guardada, la novedad aparece en el sitio de inmediato.

**Requisitos de la imagen:**

| Formato | Tamaño máximo |
|---|---|
| JPEG, JPG, PNG, WebP | 5 MB |

> No se aceptan GIFs, PDFs ni videos.

---

### Editar una novedad

1. Hacer clic en el ícono de **editar** (lápiz).
2. Modificar el título, la descripción o subir una nueva imagen.
3. Guardar.

Si se sube una nueva imagen, la imagen anterior se elimina automáticamente de la nube. No quedan imágenes huérfanas.

---

### Eliminar una novedad

1. Hacer clic en el ícono de **eliminar** (tacho).
2. Confirmar.

Tanto la novedad como su imagen se eliminan permanentemente. **No se puede deshacer.**

---

### Posibles errores en Novedades

| Qué ves | Qué pasó | Qué hacer |
|---|---|---|
| "La imagen es requerida" | Se intentó guardar sin elegir un archivo | Seleccionar una imagen antes de guardar. |
| "Formato de imagen no válido" | Se usó un formato no aceptado (GIF, BMP, PDF, etc.) | Usar JPEG, PNG o WebP. |
| "La imagen es demasiado grande" | El archivo supera los 5 MB | Comprimir la imagen con una herramienta online (como squoosh.app) antes de subirla. |
| "Novedad no encontrada" | La novedad fue eliminada mientras la tenías abierta | Recargar la lista. |
| Error al subir imagen | Problema de conexión con el servicio de almacenamiento | Esperar unos segundos y reintentar. |
| "No autorizado" | La sesión expiró | Volver a iniciar sesión. |

---

## 7. Testimonios

Los testimonios activos aparecen en la sección de testimonios del sitio. Pueden activarse o desactivarse individualmente para controlar cuáles se muestran.

---

### Crear un testimonio

1. Hacer clic en **+ Nuevo Testimonio**.
2. Completar nombre completo del alumno y su texto.
3. Guardar.

El testimonio queda **activo** (visible en el sitio) por defecto.

---

### Activar o desactivar un testimonio

El toggle de visibilidad (activo/inactivo) muestra u oculta el testimonio en el sitio sin borrarlo. Útil para rotar cuáles se muestran en cada momento.

---

### Editar un testimonio

Permite corregir el nombre o el texto. Hacer clic en el ícono de editar, modificar y guardar.

---

### Eliminar un testimonio

Hacer clic en el ícono de eliminar y confirmar. El testimonio se borra permanentemente. **No se puede deshacer.**

---

### Posibles errores en Testimonios

| Qué ves | Qué pasó | Qué hacer |
|---|---|---|
| "Testimonio no encontrado" | El testimonio fue eliminado mientras lo tenías abierto | Recargar la lista. |
| "No autorizado" | La sesión expiró | Volver a iniciar sesión. |

---

## 8. Materiales

Los materiales son archivos (PDFs, imágenes, documentos) que los alumnos pueden ver o descargar desde el sitio. Se almacenan en la nube y quedan accesibles por un enlace público.

---

### Subir un material

1. Hacer clic en **+ Nuevo Material**.
2. Escribir un nombre descriptivo (es lo que verán los alumnos).
3. Seleccionar el archivo desde tu computadora.
4. Guardar.

El archivo se sube a la nube. Una vez guardado, aparece disponible en el sitio de inmediato.

---

### Eliminar un material

Hacer clic en el ícono de eliminar y confirmar. El archivo se elimina tanto del listado como del almacenamiento en la nube. **No se puede deshacer.**

---

### Posibles errores en Materiales

| Qué ves | Qué pasó | Qué hacer |
|---|---|---|
| "Error al subir el archivo" | Fallo de conexión con el servicio de almacenamiento o archivo demasiado grande | Verificar el tamaño del archivo y reintentar. Si persiste, contactar soporte. |
| "Material no encontrado" | El material fue eliminado mientras lo tenías abierto | Recargar la lista. |
| "No autorizado" | La sesión expiró | Volver a iniciar sesión. |

---

## 9. Datos de cobro

Estos son los datos bancarios que se incluyen automáticamente en el mail de confirmación que recibe el alumno al inscribirse. Tenerlos actualizados es importante para que los alumnos puedan realizar el pago sin problemas.

---

### Tipos de cuenta

| Tipo | Cuándo se usa |
|---|---|
| **Nacional** | Transferencia bancaria en Argentina (alias / CVU). |
| **Internacional** | Para alumnos del exterior u otros métodos de pago. |

---

### Editar los datos de cobro

1. Hacer clic en el ícono de **editar** sobre la cuenta que querés modificar.
2. Actualizar alias, CVU y/o nombre de la cuenta.
3. Guardar.

Los cambios se aplican a los mails enviados **a partir de ese momento**. Los mails ya enviados anteriormente no se modifican.

---

### Posibles errores en Datos de cobro

| Qué ves | Qué pasó | Qué hacer |
|---|---|---|
| "No autorizado" | La sesión expiró | Volver a iniciar sesión. |
| Registro no encontrado | El registro fue eliminado o hay un error de carga | Recargar la página. |

---

## 10. Referencia de errores

Esta sección agrupa los mensajes de error más comunes con su significado en términos simples.

---

### Errores de sesión

Estos errores aparecen cuando el sistema no puede verificar que seas vos quien está haciendo la acción.

| Qué ves | En lenguaje simple | Qué hacer |
|---|---|---|
| "No autorizado" | Tu sesión expiró o el acceso fue rechazado. | Volver a iniciar sesión. |
| Redirige automáticamente al login | El sistema detectó que la sesión está vencida (pasaron más de 30 min). | Iniciar sesión nuevamente. |
| "Demasiados intentos" (en el login) | Se superó el límite de intentos de acceso por minuto. | Esperar 1 minuto y volver a intentar. |

---

### Errores de elemento no encontrado

Aparecen cuando se intenta ver, editar o eliminar algo que ya no existe en el sistema.

| Qué ves | En lenguaje simple | Qué hacer |
|---|---|---|
| "Inscripción no encontrada" | La inscripción fue eliminada por otra acción. | Recargar la lista. |
| "Curso no encontrado" | El curso fue eliminado. | Recargar la lista. |
| "Dictado no encontrado" | El dictado fue eliminado. | Recargar la lista del curso. |
| "Consulta no encontrada" | La consulta fue eliminada. | Recargar la lista. |
| "Novedad no encontrada" | La novedad fue eliminada. | Recargar la lista. |
| "Testimonio no encontrado" | El testimonio fue eliminado. | Recargar la lista. |
| "Material no encontrado" | El material fue eliminado. | Recargar la lista. |

---

### Errores de validación

Aparecen cuando falta información o los datos no tienen el formato esperado.

| Qué ves | En lenguaje simple | Qué hacer |
|---|---|---|
| Campos marcados en rojo | Hay campos obligatorios vacíos o con formato incorrecto. | Completar o corregir los campos señalados. |
| "No quedan cupos disponibles" | El dictado está completo. | Aumentar los cupos desde **Cursos** o seleccionar otro dictado. |
| "Ya has enviado una consulta recientemente" | El mismo email envió una consulta hace menos de 24 horas. | Es un mensaje para el visitante del sitio. No requiere acción de administración. |
| "Esta inscripción ya fue confirmada" | Se intentó confirmar algo que ya estaba confirmado. | No requiere acción. |

---

### Errores de servidor o conectividad

Aparecen por problemas temporales de red o del servidor.

| Qué ves | En lenguaje simple | Qué hacer |
|---|---|---|
| La página tarda mucho en cargar | El servidor puede estar iniciando tras un período inactivo. | Esperar 30-60 segundos y recargar. |
| "Error inesperado del servidor" o Error 500 | Ocurrió un fallo interno en el servidor. | Recargar la página. Si el error persiste varias veces, contactar soporte técnico. |
| Las imágenes no cargan | El servicio de almacenamiento en la nube está lento o con problemas. | Recargar la página o intentar más tarde. |
| Cualquier acción falla sin mensaje claro | Problema de conexión a internet. | Verificar la conexión y reintentar. |

---

> Para soporte técnico, reseteo de contraseña o cualquier problema que no puedas resolver con esta guía, contactar al administrador del sistema.

---