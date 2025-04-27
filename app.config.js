module.exports = () => {
  return {
    expo: {
      name: "my-app",
      slug: "my-app",
      version: "1.0.0",
      orientation: "portrait",
      icon: "./assets/images/icon.png",
      scheme: "myapp",
      userInterfaceStyle: "automatic",
      splash: {
        image: "./assets/images/splash.png",
        resizeMode: "contain",
        backgroundColor: "#ffffff",
      },
      ios: {
        supportsTablet: true,
      },
      android: {
        package: "com.julia_borraschi.myapp",
        permissions: ["INTERNET"],
        googleServicesFile: "./google-services.json",
        adaptiveIcon: {
          foregroundImage: "./assets/images/adaptive-icon.png",
          backgroundColor: "#ffffff",
        },
      },
      web: {
        bundler: "metro",
        output: "static",
        favicon: "./assets/images/favicon.png",
      },
      plugins: [
        "expo-router",
      ],
      experiments: {
        typedRoutes: true,
      },
      extra: {
        firebaseApiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
        firebaseAuthDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
        firebaseProjectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
        firebaseStorageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
        firebaseMessagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        firebaseAppId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
        expoRouterImportMode: process.env.EXPO_ROUTER_IMPORT_MODE || 'lazy',
        eas: {
          projectId: "5698d1cc-c7fb-49b8-a5ff-5bd18850d514", // Ensure projectId is included
        },
      },
    },
  };
};