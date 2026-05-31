# MyEconomy

Sistema de controle financeiro pessoal desenvolvido com **Spring Boot**, **PostgreSQL**, **React Native** e **Expo**.

## Tecnologias Utilizadas

### Backend

* Java 21
* Spring Boot
* Spring Security
* Spring Data JPA
* PostgreSQL
* JWT Authentication
* Maven

### Frontend

* React Native
* Expo
* React Navigation
* Axios
* React Hook Form
* Yup Validation
* AsyncStorage

---

# Pré-requisitos

Antes de iniciar, instale:

* Java JDK 21+
* Maven 3.9+
* PostgreSQL 15+
* Node.js 20+
* npm ou yarn
* Expo CLI

Verifique as instalações:

```bash
java -version
mvn -version
node -v
npm -v
```

---

# 1. Clonar o projeto

```bash
git clone https://github.com/Sanha258/MyEconomy.git
cd MyEconomy
```

---

# 2. Configurar o Banco de Dados

Acesse o PostgreSQL e crie o banco:

```sql
CREATE DATABASE myeconomy;
```

---

# 3. Configurar Backend

Abra o arquivo:

```properties
src/main/resources/application.properties
```

Configure:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/myeconomy
spring.datasource.username=postgres
spring.datasource.password=sua_senha

spring.datasource.driver-class-name=org.postgresql.Driver

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect

server.port=8080
```

---

# 4. Executar Backend

Na pasta do backend:

```bash
mvn clean install
mvn spring-boot:run
```

ou

```bash
./mvnw spring-boot:run
```

A API ficará disponível em:

```text
http://localhost:8080
```

---

# 5. Executar Frontend

Entre na pasta frontend:

```bash
cd frontend
```

Instale as dependências:

```bash
npm install
```

Inicie o Expo:

```bash
npx expo start
```

---

# 6. Configurar URL da API

Abra:

```javascript
src/services/api.js
```

### Web

```javascript
return 'http://localhost:8080';
```

### Android Emulator

```javascript
return 'http://10.0.2.2:8080';
```

### Dispositivo Físico

Substitua pelo IP do computador:

```javascript
const SEU_IP = '192.168.2.108';
```

Exemplo:

```javascript
return `http://${SEU_IP}:8080`;
```

O celular e o computador devem estar conectados na mesma rede Wi-Fi.

---

# 7. Executar com Docker

Na raiz do projeto:

Entre na pasta backend

```
cd backend
```

```
docker compose up --build
```

Para executar em segundo plano:

```
docker compose up -d --build
```

Para parar os containers:

```
docker compose down
```

---

# Estrutura do Projeto

```text
backend/
├── controller
├── service
├── repository
├── entity
├── dto
├── security

frontend/
├── components
├── screens
├── services
├── routes
├── hooks
├── contexts
├── validators
```

---

# Funcionalidades

* Cadastro de usuário
* Login com JWT
* Persistência de autenticação
* Perfil do usuário
* Controle financeiro
* Registro de receitas
* Registro de despesas
* Dashboard financeira
* Validação de formulários
* Toasts de sucesso e erro


