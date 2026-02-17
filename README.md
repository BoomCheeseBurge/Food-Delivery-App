<div align="center">
  <br />
    <a href="https://www.youtube.com/watch?v=BTfcnxXevm0" target="_blank">
      <img width="600" height="200" alt="Food-Delivery-App-Banner" src="https://github.com/user-attachments/assets/d1431b96-3980-4e1a-b747-151216ab8d19" />
    </a>
  <br />
  <div>
    <img src="https://img.shields.io/badge/-Expo-black?style=for-the-badge&logoColor=white&logo=expo&color=000020" alt="expo" />
    <img src="https://img.shields.io/badge/-TypeScript-black?style=for-the-badge&logoColor=white&logo=typescript&color=3178C6" alt="typescript" />
    <img src="https://img.shields.io/badge/-Appwrite-black?style=for-the-badge&logoColor=white&logo=appwrite&color=FD366E" alt="appwrite" />
    <img src="https://img.shields.io/badge/-Tailwind_CSS-black?style=for-the-badge&logoColor=white&logo=tailwindcss&color=06B6D4" alt="tailwindcss" />
  </div>

  <h3 align="center">A Food Delivery App</h3>

   <div align="center">
     Built this project step by step with the help of JavaScript Mastery on <a href="https://www.youtube.com/@javascriptmastery/videos" target="_blank"><b>JavaScript Mastery</b></a> YouTube.
   </div>

   <div align="center">
    The Figma design associated with this mobile app was kept private by the owner.
   </div>
</div>

## 📋 <a name="table">Table of Contents</a>

1. ⚙️ [Tech Stack](#tech-stack)
2. 📲 [Features](#features)
3. 🤳 [Quick Start](#quick-start)
4. ✍️ [AppWrite Database Seeding](#db-seeding)
5. ⌚ [To Be Added](#to-be-added)

## <a name="tech-stack">⚙️ Tech Stack</a>

- **[Expo](https://expo.dev/)** is an open-source platform for building universal native apps (Android, iOS, web) using JavaScript/TypeScript and React Native. It features file-based routing via Expo Router, fast refresh, native modules for camera/maps/notifications, over-the-air updates (EAS), and streamlined app deployment.

- **[React Native](https://reactnative.dev/)** is a framework for building mobile UIs with React. It enables component‑based, cross-platform development with declarative UI, deep native API support, and is tightly integrated with Expo for navigation and native capabilities.

- **[Appwrite](https://jsm.dev/rn25-appwrite)** is an open-source backend-as-a-service platform offering secure authentication (email/password, OAuth, SMS, magic links), databases, file storage with compression/encryption, real-time messaging, serverless functions, and static site hosting via Appwrite Sites—all managed through a unified console and microservices architecture.

- **[TypeScript](https://www.typescriptlang.org/)** is a statically-typed superset of JavaScript providing type annotations, interfaces, enums, generics, and enhanced tooling. It improves error detection, code quality, and scalability—ideal for robust, maintainable projects.

- **[NativeWind](https://www.nativewind.dev/)** brings Tailwind CSS to React Native and Expo, allowing you to style mobile components using utility-first classes for fast, consistent, and responsive UI design.

- **[Tailwind CSS](https://tailwindcss.com/)** is a utility-first CSS framework enabling rapid UI design via low-level classes. In React Native/Expo, it’s commonly used with NativeWind to apply Tailwind-style utilities to mobile components.

## <a name="features">📲 Features</a>

👉 **Appwrite Authentication**: Secure user sign-ins using Appwrite’s authentication service (with email and password) and a sign-up!

👉 **Home Page**: Displays the menu combos and favorite menu categories.

👉 **Search Page**: Allows users to browse all menu items with powerful search and filter functionality.

👉 **Menu Details Page**: Provides basic information about the menu itself as well as pricing, customizations, and add-to-cart option.

👉 **Cart Page**: View cart items to checkout.

👉 **Profile Page**: Customizable user profile management.

👉 **Centralized Data Fetching**: Custom-built solution inspired by TanStack’s useQuery for efficient API calls (see useAppwrite.ts).

👉 **Choose your Toppings and Sides**: Allow to choose toppings and side options for menu customizations.

👉 **Pull-to-Refresh Menu Items in Search Page**: Pull gesture from the very top of the screen downwards to refresh displayed menu items in the search page.

and many more, including code architecture and reusability

## <a name="quick-start">🤳 Quick Start</a>

Follow these steps to set up the project locally on your machine.

**Prerequisites**

Make sure you have the following installed on your machine:

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/en)
- [npm](https://www.npmjs.com/) (Node Package Manager)
- [Expo Go](https://expo.dev/go) (on your mobile phone, of course)

1. Install dependencies

   ```bash
   npm install
   ```

2. **Set Up Environment Variables**

   1. Create a new project in the [AppWrite Console](https://cloud.appwrite.io/console/)
   2. Setup the Google OAuth2 authentication by following the documentation [here](https://appwrite.io/docs/products/auth/oauth2)
   3. Replace <PROJECT_ID> in the app.json file after Google OAuth2 has been setup:
   ```
   {
     "expo": {
       "scheme": "appwrite-callback-<PROJECT_ID>"
     }
   }
   ```
   4. Create a new database in your Appwrite console (Ex: 'development' or 'real-estate-db')
   5. Create the following tables along with their respective attributes:
      - 'users' table
        - 'name' ( Type: String, Size: 100, Required )
        - 'email' ( Type: Email, Required )
        - 'accountId' ( Type: String, Size: 2200, Required )
        - 'avatar' ( Type: URL, Required )
      - 'categories' table
        - 'name' ( Type: String, Size: 100, Required )
        - 'description' ( Type: String, Size: 100, Required )
        - 'avatar' ( Type: URL, Required )
        - In the 'Settings' tab, add a role of type 'Any', select all available permissions, and update it.
      - 'menu' table
        - 'name' ( Type: String, Size: 200, Required )
        - 'slug' ( Type: Varchar, Size: 255, Required )
        - 'description' ( Type: String, Size: 2000, Required )
        - 'image_url' ( Type: URL, Required )
        - 'price' ( Type: Float, Min: 1, Max: 10000, Required )
        - 'rating' ( Type: Float, Min: 0, Max: 5, Required )
        - 'calories' ( Type: Integer, Min: 0, Max: 10000, Required )
        - 'protein' ( Type: Integer, Min: 0, Max: 1000, Required )
      - 'customizations' table
        - 'name' ( Type: String, Size: 100, Required )
        - 'imageKey' ( Type: Varchar, Size: 255, Required )
        - 'price' ( Type: Float, Min: 0.1, Max: 10000, Required )
        - 'type' ( Type: Enum, Elements: [topping, side, size, crust, bread, spice, base, sauce], Required )
        - In the 'Settings' tab, add a role of type 'Any', select all available permissions, and update it.
   6. Create table called 'menu_customizations' as a joint table with the following relationships made:
      - 'menu' table
         - Type: Two-way, Attribute key: menu, Attribute key (related collection): menuCustomizations, Relation: Many to one, On deleting a row: Cascade
      - 'customizations' table
         - Type: Two-way, Attribute key: customizations, Attribute key (related collection): menuCustomizations, Relation: Many to one, On deleting a row: Cascade
   6. Create the following relationships.
      - 'menu' table
        - 'categories' table ( Type: Two-way, Attribute key: categories, Attribute key (related collection): menu, Relation: Many to one, On deleting a row: Cascade )
   7. Create a bucket storage for storing property images.
      - Go to the 'Storage' section in the AppWrite console
        - Click on the 'Create bucket' button
        - Name it any way you want (perhaps a suggested one can be 'assets')
        - For testing purposes, go to the 'Settings' tab of the newly created bucket
        - Scroll down to 'Permissions' and add a new role with all CRUD permissions ticked
        - Update the changes
      - Added the newly created bucket ID into your .env file

Another bucket storage for storing profile images should have been created. However, since AppWrite only allows one bucket storage to be created in a free tier, profile images are only simulated but the necessary code is already provided.

Duplicate `.env.local.example` and rename into `.env.local`. Next, fill in the necessary information within `.env.local` in the root of your project and add the following content:

```env
EXPO_PUBLIC_APPWRITE_PROJECT_ID=
EXPO_PUBLIC_APPWRITE_PROJECT_NAME=""
EXPO_PUBLIC_APPWRITE_ENDPOINT=https://fra.cloud.appwrite.io/v1
EXPO_PUBLIC_APPWRITE_DATABASE_ID=
EXPO_PUBLIC_APPWRITE_USERS_TABLE_ID=
EXPO_PUBLIC_APPWRITE_CATEGORIES_TABLE_ID=
EXPO_PUBLIC_APPWRITE_MENU_TABLE_ID=
EXPO_PUBLIC_APPWRITE_CUSTOMIZATIONS_TABLE_ID=
EXPO_PUBLIC_APPWRITE_MENU_CUSTOMIZATIONS_TABLE_ID=
EXPO_PUBLIC_APPWRITE_ASSETS_BUCKET_ID=
```

Replace the values with your actual Appwrite credentials. You can obtain these credentials by signing up & creating a new project on the [**Appwrite Dashboard**](https://jsm.dev/rn25-appwrite).

3. Start the app

   ```bash
   npx expo start
   ```
   > If by chance, any of you guys stumble upon this error just as the user logged in with oauth as follows: "Uncaught error java.io.IOException failed to download remote update". Use this command to start the app (ngrok is already installed as well)

      ```bash
      npx expo start --tunnel
      ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

4. Bundling stuck at 100%?

If you ever get stuck with bundling at 100%, just do the following steps:

- Run this command: `npx expo start --clear`
- Restart expo server

## <a name="db-seeding">✍️ AppWrite Database Seeding</a>

Just in case you guys need to seed the database with dummy data, a special button can perform it.

All you have to do is place this component right under the <SafeAreaView> tag.
```
<Button title="Seed DB" onPress={() => seed().catch((error) => console.error('Failed to seed the database.', error))} />
```
Press the button once to seed the database with dummy data and reload the app.

## <a name="to-be-added">⌚ To Be Added</a>

Plans for the future are to implement the following features:

- [ ] Implement default address 1 & 2 and custom address configuration to where the food will be delivered
- [ ] Implement efficient profile update
- [ ] Implement Stripe payment integration for cart checkout
