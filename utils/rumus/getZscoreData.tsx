export const getZScoreData = (data: any[], age: number) => {
    // Cari data berdasarkan usia (Day)
    const entry = data.find((item) => item.Day === age);
    
    if (!entry) return null;
  
    // Konversi nilai string dengan koma ke angka
    const parseNumber = (str: string) => parseFloat(str.replace(",", "."));
  
    return {
      L: parseNumber(entry.L),
      M: parseNumber(entry.M),
      S: parseNumber(entry.S),
    };
  };
  