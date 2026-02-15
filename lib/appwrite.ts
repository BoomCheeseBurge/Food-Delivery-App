import { CreateUserParams, GetMenuCategoryParams, GetMenuParams, SignInParams } from "@/type";
import { Account, Avatars, Client, ID, Query, Storage, TablesDB } from "react-native-appwrite";

export const config = {

    platform: 'com.expo.fooddelivery',
    endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
    projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
    databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID,
    assetsBucketId: process.env.EXPO_PUBLIC_APPWRITE_ASSETS_BUCKET_ID,
    usersTableId: process.env.EXPO_PUBLIC_APPWRITE_USERS_TABLE_ID,
    categoriesTableId: process.env.EXPO_PUBLIC_APPWRITE_CATEGORIES_TABLE_ID,
    menuTableId: process.env.EXPO_PUBLIC_APPWRITE_MENU_TABLE_ID,
    customizationsTableId: process.env.EXPO_PUBLIC_APPWRITE_CUSTOMIZATIONS_TABLE_ID,
    menuCustomizationsTableId: process.env.EXPO_PUBLIC_APPWRITE_MENU_CUSTOMIZATIONS_TABLE_ID,
}

const validateConfig = () => {

    // Create a copy to avoid mutating the original while checking
    const validatedConfig = {} as { [K in keyof typeof config]: string };

    for (const [key, value] of Object.entries(config)) {

        if (value === undefined || value === null || value === "") {
            throw new Error(
                `Configuration Error: The field "${key}" is missing. ` +
                `Please check your .env file.`
            );
        }
        // Type casting to string because we've verified it's not null/undefined
        validatedConfig[key as keyof typeof config] = value as string;
    }

    return validatedConfig;
};

// Validate all config fields at once
export const validatedConfig = validateConfig();

// Initialize AppWrite client
export const client = new Client()
                    .setEndpoint(validatedConfig.endpoint)
                    .setProject(validatedConfig.projectId)
                    .setPlatform(validatedConfig.platform);

// Initialize AppWrite bucket service
export const storage = new Storage(client);

/**
 * Define functionalities used from AppWrite
 */

// TO Generate an avatar image based on the first and last names
export const avatar = new Avatars(client);

// TO create new user account
export const account = new Account(client);

// TO access the tables database
export const tablesDB = new TablesDB(client);

// ------------------------------------------------------------------------------------

// --------------------------------------------------- USER-RELATED FUNCTIONS ---------------------------------------------------

/**
 * Creates a new user account in Appwrite
 * 
 */
export const createNewUser = async ({ name, email, password }: CreateUserParams) => {

    try {
        // Create a new user account in Appwrite
        const newAccount = await account.create({ 
                                                    userId: ID.unique(), 
                                                    name: name, 
                                                    email: email, 
                                                    password: password 
                                                });

        // Throw an error if the account failed to be created
        if(!newAccount) throw Error;

        // Automatically sign in the newly created user
        await signInUser({ email, password });

        // Generates avatar image using the username's initials and stores in database
        const avatarUrl = avatar.getInitialsURL(name);

        // Insert new user into Appwrite database and return the newly created user
        return await tablesDB.createRow({
            databaseId: validatedConfig.databaseId,
            tableId: validatedConfig.usersTableId,
            rowId: ID.unique(),
            data: {
                accountId: newAccount.$id,
                name,
                email,
                avatar: avatarUrl
            },
            // permissions: [Permission.write(Role.user(idea.userId))]
        });

    } catch (error) {
        throw new Error(error as string);
    }
}

/**
 * Sign in an user account
 * 
 */
export const signInUser = async ({ email, password }: SignInParams) => {

    try {
        // Create a new session for the user based on email and password inputs
        const session = await account.createEmailPasswordSession({ email, password });

    } catch (error) {
        throw new Error(error as string);
    }
}

/**
 * Retrieve logged-in user
 * 
 */
export const getCurrentUser = async () => {
    
    try {
        // Get current logged-in user
        const currentAccount = await account.get();

        // Check if user exists
        if(!currentAccount) throw Error;

        const users = await tablesDB.listRows({
            databaseId: validatedConfig.databaseId,
            tableId: validatedConfig.usersTableId,
            queries: [Query.equal('accountId', currentAccount.$id)], // optional
            // transactionId: '<TRANSACTION_ID>', // optional
            total: false // optional
        });

        // Check if query returns empty
        if(!users) throw Error;

        return users.rows[0];

    } catch (error: any) {
        // 401 means "Unauthorized" (i.e., No active session/Guest)
        // This is a normal state when the app first opens!
        if (error?.code === 401) {
            return null; 
        }

        // Only log actual unexpected errors (network issues, etc.)
        console.error("Unexpected error in getCurrentUser:", error);

        return null;

        // throw new Error(error as string);
    }
}

// --------------------------------------------------- MENU-RELATED FUNCTIONS ---------------------------------------------------

/**
 * Retrieve menu with optional filtering by category and search query
 */
export const getMenu = async ({ category, query, limit }: GetMenuParams) => {

    try {
        // Store queries
        const queries = [];
        
        // Returns row if the said column is equal to any category value
        if(category) queries.push(Query.equal('categories', category));

        // Searches string columns for provided keywords
        if(query) queries.push(Query.search('name', query));

        // Limit the number of returned menu items
        if(limit) queries.push(Query.limit(limit));

        // Perform the menu query
        const menu = await tablesDB.listRows({
            databaseId: validatedConfig.databaseId,
            tableId: validatedConfig.menuTableId,
            queries: queries
        });

        // Return menu items
        return menu.rows;

    } catch (error) {
        throw new Error(error as string);
    }
}

/**
 * Retrieve menu categories
 */
export const getMenuCategory = async ({ slug, limit, select = ["*"] }: GetMenuCategoryParams) => {

    try {
        // Store queries
        const queries = [];
        
        // Returns row if the said column is equal to any category value
        if(slug) queries.push(Query.equal('slug', slug));

        // Limit the number of returned menu items
        if(limit) queries.push(Query.limit(limit));

        // Limit the number of returned menu items
        if(select) queries.push(Query.select(select));

        // Perform the menu query
        const categories = await tablesDB.listRows({
            databaseId: validatedConfig.databaseId,
            tableId: validatedConfig.categoriesTableId,
            queries: queries
        });

        // Return categories
        return categories.rows;
        
    } catch (error) {
        throw new Error(error as string);
    }
}

/**
 * Retrieve menu item by slug
 */
export const getMenuItemBySlug = async ({ slug }: { slug: string }) => {

    try {

        // Perform the menu query
        const menuItem = await tablesDB.listRows({
            databaseId: validatedConfig.databaseId,
            tableId: validatedConfig.menuTableId,
            queries: [
                Query.equal('slug', slug),
                Query.select([
                    "*", 
                    "categories.*",
                    "menuCustomizations.*",
                    "menuCustomizations.customizations.*",
                ]),
                Query.limit(1)
            ]
        });

        // Return menu item
        return menuItem.rows[0];
        
    } catch (error) {
        throw new Error(error as string);
    }
}