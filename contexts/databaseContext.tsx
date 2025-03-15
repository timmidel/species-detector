import React, { createContext, useContext } from "react";
import * as SQLite from "expo-sqlite";

export const DatabaseContext = createContext<SQLite.SQLiteDatabase | null>(
  null
);

export const useDatabase = () => {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error("useDatabase must be used within a DatabaseProvider");
  }
  return context;
};
