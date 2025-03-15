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

export const Discovery = {
  addDiscovery: async (
    db: SQLite.SQLiteDatabase,
    commonName: string,
    scientificName: string,
    habitat: string,
    additionalInfo: string,
    imageLink: string
  ) => {
    const result = await db.runAsync(
      "INSERT INTO discoveries (commonName, scientificName, habitat, additionalInfo, imageLink) VALUES (?, ?, ?, ?, ?)",
      [commonName, scientificName, habitat, additionalInfo, imageLink]
    );
    return result.lastInsertRowId;
  },
  getAllDiscovery: async (db: SQLite.SQLiteDatabase) => {
    const results = await db.getAllAsync("SELECT * FROM discoveries");
    return results;
  },
  deleteDiscovery: async (db: SQLite.SQLiteDatabase, id: number) => {
    await db.runAsync("DELETE FROM discoveries WHERE id = ?", [id]);
  },
};
