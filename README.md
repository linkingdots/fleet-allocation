# Fleet Allocation API

## Descripción

La API de Asignación de Flotas permite gestionar vehículos, flotas y usuarios. Proporciona endpoints para listar vehículos usando paginación, filtración y ordenación, así como endpoints para crear, autenticar y refrescar la sesión de un usuario.

## Local

Para ejecutar el proyecto localmente, sigue estos pasos:

1. Clona el repositorio:

   ```bash
   git clone https://github.com/linkingdots/fleet-allocation.git
   cd fleet-allocation
   ```

2. Instala las dependencias

   ```bash
   npm install
   ```

3. Crea un archivo .env en la raíz del proyecto con los valores de las variables de entorno específicadas en .env.example:

   ```bash
   PORT=3000
   MONGO_DB_CONNECTION_URI="mongodb+srv://tomas_batista:7jaAQf6gsTLn7blI@cluster0.cgjvt.mongodb.net/fleetallocationdb?retryWrites=true&w=majority&appName=Cluster0"
   MONGO_DB_REINITIALIZE=false
   JWT_ACCESS_SECRET=accesssecretkey
   JWT_REFRESH_SECRET=refreshsecretkey
   ```

##### MONGO_DB_CONNECTION_URI

    Usa el valor sugerido arriba para usar la DB desplegada en la nube. O cámbiala para usar tu propia DB.

##### MONGO_DB_REINITIALIZE

    true: Para ejecutar el seeder al levantar la API.
    false: Caso contrario.

    Importante: La DB desplegada en la nube contiene data.

4. Inicia el servidor:

```bash
npm start
```

5. La API estará disponible en:

URL Base: http://localhost:3000

URL Swagger: http://localhost:3000/api

## Prod

La API está desplegada en:

URL Base: https://fleet-allocation-api.onrender.com/

URL Swagger: https://fleet-allocation-api.onrender.com/api/

## Limitaciones

- Para agregar un vehículo es necesario que la marca y el modelo ya existan en la DB. Al levantar el API con MONGO_DB_REINITIALIZE=true se reinicializan solo marcas, modelos, y flotas.

## Ejemplos de peticiones

Colección de Postman: **fleet-allocation.postman_collection.json**

Algunos cURLS:

### SignUp

```bash
curl --location --request POST 'localhost:3000/auth/signup' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email": "user_4@email.com",
    "password": "123456"
}'
```

### SignIn

```bash
curl --location --request POST 'localhost:3000/auth/signin' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email": "user_1@email.com",
    "password": "123456"
}'
```

### GET vehicles

```bash
curl --location --request GET 'localhost:3000/vehicles?brand=Toyota&model=Hilux' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3Yzg2ZWQ2NTZlOWI2YmFhMjFkZjMwNSIsImVtYWlsIjoidXNlcl8xQGVtYWlsLmNvbSIsImlhdCI6MTc0MTIwMTE2NiwiZXhwIjoxNzQxMjA0NzY2fQ.zC1GIsI9EuYDNbM2fwTE8BpdyjUUxZJ7b2PLsh9QAJk'
```

### POST vehicle

```bash
curl --location --request POST 'localhost:3000/vehicles' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3Yzg2ZWQ2NTZlOWI2YmFhMjFkZjMwNSIsImVtYWlsIjoidXNlcl8xQGVtYWlsLmNvbSIsImlhdCI6MTc0MTIwMTE2NiwiZXhwIjoxNzQxMjA0NzY2fQ.zC1GIsI9EuYDNbM2fwTE8BpdyjUUxZJ7b2PLsh9QAJk' \
--header 'Content-Type: application/json' \
--data-raw '{
    "brand": "Chevrolet",
    "model": "Optra",
    "year": 2020
}'
```

## Puntos interesantes

Se usa un motor de reglas para implementar la lógica de asignación de flotas de manera descriptiva en vez de imperativa.

Ver el archivo: **src/vehicle/fleet-assignment.rules.json**

Se pudiera incluso desplegar las reglas aparte del API, en caso de que estas estén sujetas a cambios frecuentes y se desee evitar que cada cambio en las reglas implique un despliegue del API.

## Puntos a mejorar

- Es necesario mejorar el manejo de errores para indicar al usuario cuando haga una búsqueda por una marca x, que esta no existe. Actualmente, aunque se logea el error específico, se responde un 500 genérico.

- Existen muchos magic strings que deberían ser variables de entorno.

- Es necesario mejorar la lógica de los repositorios, debe haber una forma de modelar la data o realizar los queries de manera más eficiente y evitar los n+1 queries. Me encuentro investigando esto.
