import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RememberDbService {
  private readonly catalog = 'rebemberdb';
  private readonly version = 1;
  private db = {} as unknown as IDBDatabase;

  public createDb(): IDBDatabase {
    const keys = {
        posts: [{ name: 'id', unique: true }],
        projects: [{ name: 'id', unique: true }],
    };
    const request = indexedDB.open(this.catalog, this.version);
    request.onerror = (err) => console.error(`IndexedDB error: ${request.error}`, err);
    request.onsuccess = () => (this.db = request.result);
    request.onupgradeneeded = () => {
        const db = request.result;
        const postsStore = db.createObjectStore('postsStore', { keyPath: keys.posts[0].name });
        const projectsStore = db.createObjectStore('projectsStore', { keyPath: keys.projects[0].name});
        keys.posts.forEach((key) => postsStore.createIndex(key.name, key.name, { unique: key.unique }));
        keys.projects.forEach((key) => projectsStore.createIndex(key.name, key.name, { unique: key.unique }));
    };
    return this.db;
}

  public getElement = <T>(store: string, key: number | 'all') => {
      const open = indexedDB.open(this.catalog);
      return new Promise<T>((resolve, reject) => {
          open.onsuccess = () => {
              let request!: IDBRequest;
              this.db = open.result;
              if (this.db.objectStoreNames.contains(store)) {
                  const transaction = this.db.transaction(store);
                  const objectStore = transaction.objectStore(store);
                  if (key === 'all') request = objectStore.getAll();
                  else request = objectStore.get(key);
                  request.onerror = () => reject(request.error);
                  request.onsuccess = () => resolve(request.result);
                  transaction.oncomplete = () => this.db.close();
              } else {
                  indexedDB.deleteDatabase(this.catalog);
              }
          };
      });
  };

  public addElement = (store: string, payload: object) => {
      const open = indexedDB.open(this.catalog, this.version);
      open.onsuccess = (event: Event) => {
          this.db = open.result;
          if (this.db.objectStoreNames.contains(store)) {
              const transaction = this.db.transaction(store, 'readwrite');
              const objectStore = transaction.objectStore(store);
              const serialized = JSON.parse(JSON.stringify(payload));
              const request = objectStore.add(serialized);
              request.onerror = () => console.error(request.error);
              transaction.oncomplete = () => this.db.close();
          } else {
              indexedDB.deleteDatabase(this.catalog);
          }
      };
  };

  public editElement = <T>(store: string, key: number | 'all', payload: object) => {
      const open = indexedDB.open(this.catalog);
      return new Promise<T>((resolve, reject) => {
          open.onsuccess = () => {
              let request: IDBRequest;
              this.db = open.result;
              if ([...this.db.objectStoreNames.item.name].find((name) => name === store)) {
                  const transaction = this.db.transaction(store, 'readwrite');
                  const objectStore = transaction.objectStore(store);
                  if (key === 'all') request = objectStore.getAll();
                  else request = objectStore.get(key);
                  request.onerror = () => reject(request.error);
                  request.onsuccess = () => {
                      const serialized = JSON.parse(JSON.stringify(payload));
                      const updateRequest = objectStore.put(serialized);
                      updateRequest.onsuccess = () => resolve(request.result);
                  };
                  transaction.oncomplete = () => this.db.close();
              } else {
                  indexedDB.deleteDatabase(this.catalog);
              }
          };
      });
  };

  public removeElement = (store: string, key: number | 'all') => {
      const open = indexedDB.open(this.catalog);
      open.onsuccess = () => {
          let request: IDBRequest;
          this.db = open.result;
          if ([...this.db.objectStoreNames.item.name].find((name) => name === store)) {
              const transaction = this.db.transaction(store, 'readwrite');
              const objectStore = transaction.objectStore(store);
              if (key === 'all') request = objectStore.clear();
              else request = objectStore.delete(key);
              request.onerror = () => console.error(request.error);
              transaction.oncomplete = () => this.db.close();
          } else {
              indexedDB.deleteDatabase(this.catalog);
          }
      };
  };
}
