// src/actions/menuActions.ts - versi yang direvisi
import { ref, onValue } from "firebase/database";
import { db } from "../DB";
export interface MenuMakanan {
  id: string;
  kode: string;
  nama: string;
  energi: string;
  protein: string;
  lemak: string;
  kh: string;
  [key: string]: any; // Tambahan supaya flexible
}

export const getMenuMakanan = (
  callback: (data: MenuMakanan[]) => void
): (() => void) => {
  const dataRef = ref(db, "menu_makanan");
  const unsubscribe = onValue(dataRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      // Cek apakah data adalah array atau memiliki index numerik
      if (Array.isArray(data)) {
        // Jika data adalah array, proses langsung
        const dataArray = data.map((item, index) => ({
          id: index.toString(),
          ...item,
        })) as MenuMakanan[];
        callback(dataArray);
      } else {
        // Jika data memiliki struktur berindeks numerik
        // misalnya: { "0": {...}, "1": {...} }
        const dataArray = Object.entries(data).map(([key, value]) => {
          // Jika value berupa objek dengan indeks numerik lagi (menu_makanan -> 0 -> datanya)
          if (key === "0" && typeof value === "object") {
            return Object.entries(value as object).map(([subKey, subValue]) => ({
              id: subKey,
              ...(subValue as object),
            }));
          }
          
          // Struktur normal
          return {
            id: key,
            ...(value as object),
          };
        }).flat() as MenuMakanan[];
        
        callback(dataArray);
      }
    } else {
      callback([]);
    }
  });

  return unsubscribe;
};