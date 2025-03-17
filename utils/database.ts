import * as SQLite from "expo-sqlite";

export const initDatabase = async () => {
  const db = await SQLite.openDatabaseAsync("speciesDetector");
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS discoveries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        commonName TEXT,
        scientificName TEXT,
        habitat TEXT,
        additionalInfo TEXT,
        imageLink TEXT
    );
    `);
  return db;
};

interface Discovery {
  id: number;
  commonName: string;
  scientificName: string;
  habitat: string;
  additionalInfo: string;
  imageLink: string;
}

export const Discovery = {
  addDiscovery: async (
    db: SQLite.SQLiteDatabase,
    commonName: string,
    scientificName: string,
    habitat: string,
    additionalInfo: string,
    imageLink: string
  ): Promise<number | undefined> => {
    try {
      const result = await db.runAsync(
        "INSERT INTO discoveries (commonName, scientificName, habitat, additionalInfo, imageLink) VALUES (?, ?, ?, ?, ?)",
        [commonName, scientificName, habitat, additionalInfo, imageLink]
      );
      return result.lastInsertRowId;
    } catch (error) {
      console.error("Error adding discovery:", error);
      return undefined;
    }
  },
  getAllDiscovery: async (db: SQLite.SQLiteDatabase): Promise<Discovery[]> => {
    try {
      const results = await db.getAllAsync("SELECT * FROM discoveries");
      return results as Discovery[];
    } catch (error) {
      console.error("Error getting all discoveries:", error);
      return [];
    }
  },
  getByImageLink: async (
    db: SQLite.SQLiteDatabase,
    imageLink: string
  ): Promise<Discovery | undefined> => {
    try {
      const result = await db.getFirstAsync(
        "SELECT * FROM discoveries WHERE imageLink = ?",
        [imageLink]
      );
      return result ? (result as Discovery) : undefined;
    } catch (error) {
      console.error("Error in getting the discovery:", error);
      return undefined;
    }
  },
  deleteDiscovery: async (
    db: SQLite.SQLiteDatabase,
    id: number
  ): Promise<boolean> => {
    try {
      await db.runAsync("DELETE FROM discoveries WHERE id = ?", [id]);
      return true;
    } catch (error) {
      console.error(`Error deleting discovery with id ${id}:`, error);
      return false;
    }
  },
};
