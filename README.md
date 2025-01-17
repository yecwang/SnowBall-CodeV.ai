
# SnowBall-CodeV.ai

**SnowBall-CodeV.ai** is an open-source, AI-driven visual application builder framework. Designed for developers and enthusiasts, it provides an intuitive interface for generating and editing applications with minimal coding effort.

## 🚀 Key Features
- **AI-Driven Development**: Automate repetitive tasks, generate code snippets, and optimize workflows with the power of artificial intelligence.
- **Visual Application Builder**: Create, edit, and manage applications through a drag-and-drop interface without diving deep into complex code.
- **Customizable Framework**: Extend and adapt the framework to suit your specific development needs.

## 🎯 Why SnowBall-CodeV.ai?
While this project may not aim to disrupt the industry, it serves as a great resource for exploring the potential of AI in software development. It’s a platform for learning, experimentation, and collaboration.

## 🛠️ Getting Started

Follow these steps to set up the project locally:

 **Clone the repository**:  
   ```bash
   git clone https://github.com/yecwang/snowball-codev.ai.git
   ```
**Install Database**:
      
   ```bash
   docker run --name some-mysql  -p 3306:3306 -e MYSQL_ROOT_PASSWORD=123456 -d mysql:8.0
   ```

### Editing .evn file

```
cp .env.example .env
vi .env

# DB_URL="mysql://root:123456@localhost:3306/tisoul_db"
```

### Run dev

```
yarn install
yarn initialize # Initialize the development environment for the first time
yarn dev
```



open link: http://localhost:8084



## 🤝 Contributing

Contributions are welcome! Feel free to:
- Open issues to report bugs or suggest features.
- Submit pull requests to improve the project.
- Share your ideas to make this framework better.

## 📄 License

This project is licensed under the [MIT License](LICENSE).

Thank you for checking out SnowBall-CodeV.ai! If you like this project, don’t forget to give it a ⭐ on GitHub!
