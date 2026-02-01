import { ID } from "react-native-appwrite";
import { storage, tablesDB, validatedConfig } from "./appwrite";
import dummyData from "./data";

interface Category {
    name: string;
    description: string;
}

interface Customization {
    name: string;
    price: number;
    type: "topping" | "side" | "size" | "crust" | string; // extend as needed
}

interface MenuItem {
    name: string;
    description: string;
    image_url: string;
    price: number;
    rating: number;
    calories: number;
    protein: number;
    category_name: string;
    customizations: string[]; // list of customization names
}

interface DummyData {
    categories: Category[];
    customizations: Customization[];
    menu: MenuItem[];
}

// Ensure dummyData has correct shape
const data = dummyData as DummyData;

/**
 * Clear all records within a specified table
 * 
 */
async function clearAll(tableId: string): Promise<void> {
    
    const list = await tablesDB.listRows({
        databaseId: validatedConfig.databaseId,
        tableId: tableId,
        queries: [], // optional
        // transactionId: '<TRANSACTION_ID>', // optional
        total: false // optional
    });

    await Promise.all(
        list.rows.map((row) =>

            tablesDB.deleteRow({
                databaseId: validatedConfig.databaseId,
                tableId: tableId,
                rowId: row.$id,
                // transactionId: '<TRANSACTION_ID>' // optional
            })
        )
    );
}

/**
 * Clear all files within a storage bucket
 * 
 */
async function clearStorage(): Promise<void> {

    // Retrieve all files from this storage bucket
    const list = await storage.listFiles({ bucketId: validatedConfig.assetsBucketId});

    // Delete all files in parallel until they are deleted completely
    await Promise.all(
        list.files.map((file) =>
            
            storage.deleteFile({
                bucketId: validatedConfig.assetsBucketId,
                fileId: file.$id
            })
        )
    );
}

/**
 * Upload an image file to the bucket storage
 *  
 */
async function uploadImageToStorage(imageUrl: string) {

    // sends a network request to the server where the image is stored
    const response = await fetch(imageUrl);
    // reads the incoming stream of data and converts it into a Blob (Binary Large Object) for further processing
    const blob = await response.blob();

    // prepare the file image
    const fileObj = {
        name: imageUrl.split("/").pop() || `file-${Date.now()}.jpg`,
        type: blob.type,
        size: blob.size,
        uri: imageUrl,
    };

    // Store the image file in appwrite storage bucket
    const file = await storage.createFile({
        bucketId: validatedConfig.assetsBucketId,
        fileId: ID.unique(),
        file: fileObj
    });

    // Return image file for view
    return storage.getFileView({
        bucketId: validatedConfig.assetsBucketId,
        fileId: file.$id,
        // token: '<TOKEN>' // optional
    });
}

/**
 * Seed the database
 * 
 */
async function seed(): Promise<void> {

    // 1. Clear records in all database tables 
    await clearAll(validatedConfig.categoriesTableId);
    await clearAll(validatedConfig.customizationsTableId);
    await clearAll(validatedConfig.menuTableId);
    await clearAll(validatedConfig.menuCustomizationsTableId);
    await clearStorage();

    // 2. Create menu categories
    const categoryMap: Record<string, string> = {};

    for (const cat of data.categories) {

        const newRow = await tablesDB.createRow({
            databaseId: validatedConfig.databaseId,
            tableId: validatedConfig.categoriesTableId,
            rowId: ID.unique(),
            data: cat,
            // permissions: ["read("any")"], // optional
            // transactionId: '<TRANSACTION_ID>' // optional
        });

        // Add category ID and name to category mapping
        categoryMap[cat.name] = newRow.$id;
    }

    // 3. Create related customizations for menu
    const customizationMap: Record<string, string> = {};

    for (const cus of data.customizations) {

        const newRow = await tablesDB.createRow({
            databaseId: validatedConfig.databaseId,
            tableId: validatedConfig.customizationsTableId,
            rowId: ID.unique(),
            data: {
                name: cus.name,
                price: cus.price,
                type: cus.type,
            },
            // permissions: ["read("any")"], // optional
            // transactionId: '<TRANSACTION_ID>' // optional
        });

        // Add customization ID and name to customization mapping
        customizationMap[cus.name] = newRow.$id;
    }

    // 4. Create menu items
    const menuMap: Record<string, string> = {};
    
    for (const item of data.menu) {

        const uploadedImage = await uploadImageToStorage(item.image_url);

        const newRow = await tablesDB.createRow({
            databaseId: validatedConfig.databaseId,
            tableId: validatedConfig.menuTableId,
            rowId: ID.unique(),
            data: {
                name: item.name,
                description: item.description,
                image_url: uploadedImage,
                price: item.price,
                rating: item.rating,
                calories: item.calories,
                protein: item.protein,
                categories: categoryMap[item.category_name],
            },
            // permissions: ["read("any")"], // optional
            // transactionId: '<TRANSACTION_ID>' // optional
        });

        // Add menu ID and name to menu mapping
        menuMap[item.name] = newRow.$id;

        // 5. Create menu_customizations
        for (const cusName of item.customizations) {

            await tablesDB.createRow({
                databaseId: validatedConfig.databaseId,
                tableId: validatedConfig.menuCustomizationsTableId,
                rowId: ID.unique(),
                data: {
                    menu: newRow.$id,
                    customizations: customizationMap[cusName],
                },
                // permissions: ["read("any")"], // optional
                // transactionId: '<TRANSACTION_ID>' // optional
            });
        }
    }

    console.log("✅ Seeding complete.");
}

export default seed;