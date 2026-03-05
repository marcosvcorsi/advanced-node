# Advanced Node

[![GitHub stars](https://img.shields.io/github/stars/marcosvcorsi/advanced-node)](https://github.com/marcosvcorsi/advanced-node/stargazers)

A production-ready Node.js API built with **Clean Architecture**, **TDD**, and advanced design patterns. This project demonstrates enterprise-level software engineering practices.

## [Link para o curso completo](https://www.udemy.com/course/nodejs-avancado/?referralCode=AF51096F87A7A9A81C5C)

Essa API faz parte do treinamento do professor Rodrigo Manguinho (Mango) na Udemy.

O objetivo do treinamento é mostrar como criar uma API com uma arquitetura bem definida e desacoplada, utilizando TDD (programação orientada a testes) como metodologia de trabalho, Clean Architecture para fazer a distribuição de responsabilidades em camadas, sempre seguindo os princípios do SOLID e, sempre que possível, aplicando Design Patterns para resolver alguns problemas comuns.

## 📋 About

Advanced Node is a comprehensive API that showcases modern Node.js development practices. It implements Clean Architecture principles, Test-Driven Development methodology, and follows SOLID principles throughout. The project integrates with multiple services including PostgreSQL, AWS S3, and external APIs.

## ✨ Features

- **Clean Architecture**: Decoupled, maintainable code structure
- **TDD Methodology**: Test-first development approach
- **TypeScript**: Type-safe development with modern syntax
- **PostgreSQL Integration**: TypeORM for database operations
- **AWS S3**: File storage and management
- **JWT Authentication**: Secure token-based auth
- **RESTful API**: Standardized endpoints
- **Input Validation**: Comprehensive request validation
- **Error Handling**: Centralized error management
- **Logging**: Structured logging with Pino
- **Testing**: Unit and integration tests
- **Code Quality**: ESLint, Prettier, Husky

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL (TypeORM)
- **File Storage**: AWS S3
- **HTTP Client**: Axios
- **Authentication**: JWT (jsonwebtoken)
- **File Upload**: Multer
- **UUID**: Unique identifier generation
- **Testing**: Jest, Supertest
- **Code Quality**: ESLint, Prettier, Husky

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/marcosvcorsi/advanced-node.git
cd advanced-node

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Create and migrate database
npx prisma migrate dev
```

## 🚀 Running the Application

```bash
# Development mode with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run integration tests
npm run test:integration

# Run tests for staged files
npm run test:staged

# Test specific scenarios
npm run test:fb-api     # Facebook API integration tests
npm run test:s3         # AWS S3 integration tests
```

## 🏗️ Architecture

### Clean Architecture Layers

```
┌─────────────────────────────────────┐
│      Presentation Layer              │  ← HTTP Controllers/DTOs
├─────────────────────────────────────┤
│      Application Layer              │  ← Use Cases (Business Logic)
├─────────────────────────────────────┤
│      Domain Layer                   │  ← Entities/Value Objects
├─────────────────────────────────────┤
│      Infrastructure Layer           │  ← External Services
└─────────────────────────────────────┘
```

### Directory Structure

```
src/
├── main/
│   └── server.ts              # Application entry point
├── presentation/
│   ├── controllers/           # HTTP controllers
│   └── protocols/             # Presentation protocols
├── application/
│   ├── usecases/              # Business logic
│   ├── protocols/             # Application protocols
│   └── errors/                # Application errors
├── domain/
│   ├── entities/              # Domain entities
│   ├── value-objects/         # Value objects
│   └── protocols/             # Domain protocols
├── infrastructure/
│   ├── database/              # Database implementations
│   ├── http/                  # HTTP client implementations
│   ├── s3/                    # AWS S3 implementations
│   └── logs/                  # Logging implementations
└── shared/
    └── helpers/               # Shared utilities
```

## 🔧 Environment Variables

Create a `.env` file based on `.env.example`:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_DATABASE=advanced_node

# AWS S3
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
S3_BUCKET_NAME=your_bucket_name

# JWT
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d
```

## 📚 API Endpoints

### Authentication

```bash
POST /api/signup
POST /api/login
```

### Example CRUD

```bash
GET /api/resource
POST /api/resource
GET /api/resource/:id
PUT /api/resource/:id
DELETE /api/resource/:id
```

## 🎯 Principles

### SOLID Principles

* **Single Responsibility**: Each module has one reason to change
* **Open Closed**: Open for extension, closed for modification
* **Liskov Substitution**: Subtypes must be substitutable for base types
* **Interface Segregation**: Clients shouldn't depend on unused interfaces
* **Dependency Inversion**: Depend on abstractions, not concretions

### Additional Principles

* **Separation of Concerns**: Clear boundaries between layers
* **Don't Repeat Yourself (DRY)**: Avoid code duplication
* **You Aren't Gonna Need It (YAGNI)**: Don't build what you don't need
* **Keep It Simple (KIS)**: Simplicity over complexity
* **Composition Over Inheritance**: Favor composition
* **Small Commits**: Frequent, focused commits

## 🎨 Design Patterns

* **Factory**: Object creation
* **Adapter**: Interface compatibility
* **Composite**: Tree structures
* **Decorator**: Behavior extension
* **Command**: Encapsulate requests
* **Dependency Injection**: Loose coupling
* **Abstract Server**: Server abstraction
* **Composition Root**: Dependency assembly
* **Builder**: Complex object construction
* **Template Method**: Algorithm skeleton
* **Singleton**: Single instance
* **Chain of Responsibility**: Request passing
* **Proxy**: Access control

## 🚫 Code Smells (Anti-Patterns)

* **Blank Lines**: Excessive whitespace
* **Comments**: Code that needs explaining
* **Data Clumps**: Related data that should be objects
* **Divergent Change**: Code changed for different reasons
* **Duplicate Code**: Repeated logic
* **Inappropriate Intimacy**: Tight coupling
* **Feature Envy**: Using another object's methods
* **Large Class**: Class doing too much
* **Long Method**: Method doing too much
* **Long Parameter List**: Too many parameters
* **Middle Man**: Delegating too much
* **Primitive Obsession**: Using primitives instead of objects
* **Refused Bequest**: Inheriting unused methods
* **Shotgun Surgery**: Changes scattered across files
* **Speculative Generality**: Unnecessary complexity

## 📖 Methodologies and Designs

* **TDD**: Test-Driven Development
* **Clean Architecture**: Layered architecture
* **DDD**: Domain-Driven Design
* **Refactoring**: Code improvement
* **GitFlow**: Branching strategy
* **Modular Design**: Module boundaries
* **Dependency Diagrams**: Visual dependencies
* **Use Cases**: Business scenarios
* **Spike (Agile)**: Technical exploration

## 🧰 Libraries and Tools

* **NPM**: Package management
* **TypeScript**: Typed JavaScript
* **Git**: Version control
* **Jest**: Testing framework
* **Jest-Mock-Extended**: Mock utilities
* **TypeORM**: Database ORM
* **AWS-SDK**: AWS integration
* **Multer**: File uploads
* **UUID**: Unique identifiers
* **Axios**: HTTP client
* **Postgres**: Database
* **Jwt**: Authentication
* **Express**: Web framework
* **Cors**: CORS support
* **Supertest**: HTTP testing
* **Husky**: Git hooks
* **Lint Staged**: Pre-commit linting
* **ESLint**: Linting
* **Standard**: Code style
* **Rimraf**: File removal
* **In-Memory Postgres**: Test database
* **Module-Alias**: Path aliases
* **Ts-Node-Dev**: Development server

## 🔬 TypeScript Features

* **POO Avançado**: Advanced OOP
* **Strict Mode**: Strict type checking
* **Interface**: Type definitions
* **TypeAlias**: Type aliases
* **Namespace**: Code organization
* **Utility Types**: Built-in type utilities
* **Modularização de Paths**: Path mapping
* **Configurações**: TypeScript configuration
* **Build**: Compilation and bundling

## 🧪 Testing Features

* **Testes Unitários**: Unit tests
* **Testes de Integração**: Integration tests
* **Cobertura de Testes**: Test coverage
* **Test Doubles**: Test substitutes
* **Mocks**: Mock objects
* **Stubs**: Stub implementations
* **Spies**: Function spies
* **Fakes**: Fake implementations

## 📝 Code Quality

```bash
# Build the project
npm run build

# Run linter
npm run lint

# Fix linting issues
npm run lint:fix
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Write tests for your changes
4. Implement the feature (make tests pass)
5. Commit your changes (`git commit -m 'feat: add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👤 Author

**Marcos Vinicius Corsi**

- GitHub: [@marcosvcorsi](https://github.com/marcosvcorsi)

## 🌟 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=marcosvcorsi/advanced-node&type=Date)](https://star-history.com/#marcosvcorsi/advanced-node&Date)

## 🙏 Acknowledgments

- Curso by [Rodrigo Manguinho (Mango)](https://www.udemy.com/user/rodrigo-branco-de-almeida-3/)
- Inspired by Clean Architecture principles
- Built with modern Node.js best practices
