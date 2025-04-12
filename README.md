# 🐾 ZooView 

**ZooView is a mobile application to identify animal species using a visual language model.** 

## 📱 Overview

**ZooView** is a mobile application developed with [Expo](https://expo.dev/) that enables users to identify animal species through image recognition. By leveraging machine learning models, the app provides quick and accurate species identification, making it a valuable tool for wildlife enthusiasts, researchers, and educators. 

## 🛠️ Features

- **Image-Based Identification**: Capture or upload images to identify animal species.
- **User-Friendly Interface**: Intuitive design for seamless user experience.
- **Cross-Platform Compatibility**: Built with Expo for both Android and iOS devices.
- **Low Internet Support**: View discovered species without an active internet connection.
- **Expandable Dataset**: Easily update or expand the species database.

## 📦 Tech Stack

- **Frontend**: React Native Expo with TypeScript 
- **Backend**: Node.js (for API services)
- **Visual Language Model**: Qwen 2.5-VL 
- **State Management**: Context API
- **Navigation**: React Navigation

## 📁 Project Structure

```plaintext
species-detector/
├── app/               # Main application components
├── assets/            # Images and other static assets
├── backend/           # Backend services and API routes
├── components/        # Reusable UI components
├── constants/         # Application constants
├── contexts/          # Context providers for state management
├── utils/             # Utility functions
├── app.json           # Expo configuration
├── package.json       # Project metadata and dependencies
├── tsconfig.json      # TypeScript configuration
└── README.md          # Project documentation
```

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) installed
- [Expo CLI](https://docs.expo.dev/get-started/installation/) installed globally
- A device or emulator to run the application

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/meowyboii/species-detector.git
   cd species-detector
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Start the development server**:

   ```bash
   expo start
   ```

4. **Run the app**:

   - Use the Expo Go app on your mobile device to scan the QR code.
   - Or, run on an emulator/simulator.

## ✅ Usage

1. **Launch the App**: Open the application on your device.
2. **Capture or Upload Image**: Use the camera or select an image from your gallery.
3. **Identify Species**: The app processes the image and displays the identified species along with relevant information.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**.
2. **Create a new branch**:

   ```bash
   git checkout -b feature/YourFeature
   ```

3. **Commit your changes**:

   ```bash
   git commit -m "Add your message"
   ```

4. **Push to the branch**:

   ```bash
   git push origin feature/YourFeature
   ```

5. **Open a Pull Request**.

## 📄 License

This project is licensed under the [MIT License](LICENSE).

