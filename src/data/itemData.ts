// Sample data structure - Replace this with your converted Parquet data
// To convert: Use pandas in Python: df.to_json('itemData.json', orient='records')

export interface ItemData {
  location: string;
  unit: string;
  name: string;
  price: number;
}

// Sample data for demonstration
export const itemData: ItemData[] = [
    { "location": "W.P. Kuala Lumpur", "unit": "", "name": "Cream", "price": 28.02 }, 
    { "location": "W.P. Kuala Lumpur", "unit": "", "name": "Tissue", "price": 28.02 }, 
    { "location": "W.P. Kuala Lumpur", "unit": "", "name": "Vinegar", "price": 28.02 }, 
    { "location": "W.P. Kuala Lumpur", "unit": "1.75l", "name": "Wine", "price": 28.02 }, 
    { "location": "W.P. Kuala Lumpur", "unit": "1.8l", "name": "Wine", "price": 28.02 }, 
    { "location": "W.P. Kuala Lumpur", "unit": "175g", "name": "Cream", "price": 28.02 }, 
    { "location": "W.P. Kuala Lumpur", "unit": "1l", "name": "Wine", "price": 28.02 }, 
    { "location": "W.P. Kuala Lumpur", "unit": "200ml", "name": "Wine", "price": 28.02 }, 
    { "location": "W.P. Kuala Lumpur", "unit": "250g", "name": "Cream", "price": 28.02 }, 
    { "location": "W.P. Kuala Lumpur", "unit": "300ml", "name": "Wine", "price": 28.02 }, 
    { "location": "W.P. Kuala Lumpur", "unit": "315ml", "name": "Wine", "price": 28.02 }, 
    { "location": "W.P. Kuala Lumpur", "unit": "320ml", "name": "Wine", "price": 28.02 }, 
    { "location": "W.P. Kuala Lumpur", "unit": "330ml", "name": "Wine", "price": 28.02 }, 
    { "location": "W.P. Kuala Lumpur", "unit": "350ml", "name": "Wine", "price": 28.02 }, 
    { "location": "W.P. Kuala Lumpur", "unit": "355ml", "name": "Wine", "price": 28.02 }, 
    { "location": "W.P. Kuala Lumpur", "unit": "360ml", "name": "Wine", "price": 28.02 }, 
    { "location": "W.P. Kuala Lumpur", "unit": "375ml", "name": "Wine", "price": 28.02 }, 
    { "location": "W.P. Kuala Lumpur", "unit": "400ml", "name": "Wine", "price": 28.02 }, 
    { "location": "W.P. Kuala Lumpur", "unit": "450g", "name": "Wine", "price": 28.02 }, 
    { "location": "W.P. Kuala Lumpur", "unit": "470ml", "name": "Wine", "price": 28.02 }, 
    { "location": "W.P. Kuala Lumpur", "unit": "500ml", "name": "Wine", "price": 28.02 }, 
    { "location": "W.P. Kuala Lumpur", "unit": "50pc", "name": "Tissue", "price": 28.02 }, 
    { "location": "W.P. Kuala Lumpur", "unit": "58pc", "name": "Tissue", "price": 28.02 }, 
    { "location": "W.P. Kuala Lumpur", "unit": "60pc", "name": "Tissue", "price": 28.02 }, 
    { "location": "W.P. Kuala Lumpur", "unit": "630ml", "name": "Wine", "price": 28.02 }, 
    { "location": "W.P. Kuala Lumpur", "unit": "640ml", "name": "Wine", "price": 28.02 }, 
    { "location": "W.P. Kuala Lumpur", "unit": "650ml", "name": "Wine", "price": 28.02 }, 
    { "location": "W.P. Kuala Lumpur", "unit": "700ml", "name": "Wine", "price": 28.02 }, 
    { "location": "W.P. Kuala Lumpur", "unit": "720ml", "name": "Wine", "price": 28.02 }, 
    { "location": "W.P. Kuala Lumpur", "unit": "750ml", "name": "Wine", "price": 28.02 }, 
    { "location": "W.P. Kuala Lumpur", "unit": "900ml", "name": "Wine", "price": 28.02 }
];

// Get unique locations
export const getUniqueLocations = (): string[] => {
  return [...new Set(itemData.map(item => item.location))].sort();
};

// Get unique units
export const getUniqueUnits = (): string[] => {
  return [...new Set(itemData.map(item => item.unit))].sort();
};

// Filter items by location and unit
export const filterItems = (location: string, unit: string): ItemData[] => {
  return itemData.filter(
    item => item.location === location && item.unit === unit
  );
};
