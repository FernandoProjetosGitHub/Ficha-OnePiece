import { mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';
import sqlite3 from 'sqlite3';
import { open, type Database } from 'sqlite';
import { env } from '../config/env';

export type AppDatabase = Database<sqlite3.Database, sqlite3.Statement>;

let database: AppDatabase | null = null;

export async function getDatabase() {
  if (database) {
    return database;
  }

  await mkdir(dirname(env.databasePath), { recursive: true });

  database = await open({
    filename: env.databasePath,
    driver: sqlite3.Database
  });

  await database.exec(`
    CREATE TABLE IF NOT EXISTS conversations (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS chat_messages (
      id TEXT PRIMARY KEY,
      conversation_id TEXT NOT NULL,
      role TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (conversation_id) REFERENCES conversations(id)
    );

    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      notes TEXT NOT NULL,
      history TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      project_id TEXT,
      title TEXT NOT NULL,
      description TEXT,
      priority TEXT NOT NULL,
      completed INTEGER NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS memory_items (
      id TEXT PRIMARY KEY,
      category TEXT NOT NULL,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);

  const projectColumns = await database.all<{ name: string }[]>('PRAGMA table_info(projects)');

  if (!projectColumns.some((column) => column.name === 'history')) {
    await database.exec("ALTER TABLE projects ADD COLUMN history TEXT NOT NULL DEFAULT ''");
  }

  return database;
}
