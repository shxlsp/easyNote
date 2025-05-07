import Database from 'better-sqlite3';
import path from 'path';
import { app } from 'electron';

class DatabaseService {
  private db: Database.Database;

  constructor() {
    const dbPath = path.join(app.getPath('userData'), 'easyNote.sqlite');
    this.db = new Database(dbPath);
  }

  private run(sql: string, params: any[] = []): void {
    this.db.prepare(sql).run(params);
  }

  private get(sql: string, params: any[] = []): any {
    return this.db.prepare(sql).get(params);
  }

  private all(sql: string, params: any[] = []): any[] {
    return this.db.prepare(sql).all(params);
  }

  initializeTables(): void {
    this.run(`
      CREATE TABLE IF NOT EXISTS images (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        path TEXT NOT NULL,
        md5 TEXT NOT NULL UNIQUE
      )
    `);

    this.run(`
      CREATE TABLE IF NOT EXISTS notes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        is_pinned BOOLEAN DEFAULT 0
      )
    `);
  }

  // CRUD methods for notes
  createNote(title: string, content: string): number {
    const stmt = this.db.prepare('INSERT INTO notes (title, content) VALUES (?, ?)');
    const info = stmt.run(title, content);
    return info.lastInsertRowid as number;
  }

  readNote(id: number): any {
    return this.get('SELECT * FROM notes WHERE id = ?', [id]);
  }

  updateNote(id: number, title: string, content: string, isPinned: boolean): void {
    this.run(
      'UPDATE notes SET title = ?, content = ?, is_pinned = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [title, content, isPinned ? 1 : 0, id]
    );
  }

  deleteNote(id: number): void {
    this.run('DELETE FROM notes WHERE id = ?', [id]);
  }

  listNotes(): any[] {
    return this.all('SELECT * FROM notes ORDER BY is_pinned DESC, updated_at DESC');
  }

  // Image upload method
  uploadImage(path: string, md5: string): string {
    try {
      this.run('INSERT INTO images (path, md5) VALUES (?, ?)', [path, md5]);
      return path;
    } catch (error) {
      if (error.code === 'SQLITE_CONSTRAINT') {
        // If the md5 already exists, return the existing path
        const existingImage = this.get('SELECT path FROM images WHERE md5 = ?', [md5]);
        return existingImage.path;
      }
      throw error;
    }
  }
}

export const databaseService = new DatabaseService();
