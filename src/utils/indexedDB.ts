// src/utils/indexedDB.ts
export const saveRequestToIndexedDB = async (data: any) => {
    const dbName = 'offlineRequestsDB';
    const storeName = 'requests';
  
    return new Promise((resolve, reject) => {
      const openReq = indexedDB.open(dbName, 1);
  
      openReq.onupgradeneeded = () => {
        const db = openReq.result;
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName, { autoIncrement: true });
        }
      };
  
      openReq.onsuccess = () => {
        const db = openReq.result;
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        store.add(data);
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => reject(tx.error);
      };
  
      openReq.onerror = () => reject(openReq.error);
    });
  };
  
  // 保存されたリクエストをすべて取得
export const getAllRequestsFromIndexedDB = (): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open('offlineRequestsDB');
  
      req.onsuccess = () => {
        const db = req.result;
        const tx = db.transaction('requests', 'readonly');
        const store = tx.objectStore('requests');
        const getAllReq = store.getAll();
  
        getAllReq.onsuccess = () => resolve(getAllReq.result);
        getAllReq.onerror = () => reject(getAllReq.error);
      };
  
      req.onerror = () => reject(req.error);
    });
  };
  
  // 保存されたリクエストを削除
  export const clearAllRequestsFromIndexedDB = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open('offlineRequestsDB');
  
      req.onsuccess = () => {
        const db = req.result;
        const tx = db.transaction('requests', 'readwrite');
        const store = tx.objectStore('requests');
        const clearReq = store.clear();
  
        clearReq.onsuccess = () => resolve();
        clearReq.onerror = () => reject(clearReq.error);
      };
  
      req.onerror = () => reject(req.error);
    });
  };
  
  // indexedDB.ts
export const removeRequestsByIndexes = (indexes: number[]): Promise<void> => {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open('offlineRequestsDB');
  
      req.onsuccess = () => {
        const db = req.result;
        const tx = db.transaction('requests', 'readwrite');
        const store = tx.objectStore('requests');
  
        let completed = 0;
        indexes.forEach((key) => {
          const deleteReq = store.delete(key);
          deleteReq.onsuccess = () => {
            completed++;
            if (completed === indexes.length) resolve();
          };
          deleteReq.onerror = () => reject(deleteReq.error);
        });
      };
  
      req.onerror = () => reject(req.error);
    });
  };
  