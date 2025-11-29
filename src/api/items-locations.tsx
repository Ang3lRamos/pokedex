const BASE_URL = 'https://pokeapi.co/api/v2';

export interface Item {
  id: number;
  name: string;
  cost: number;
  imgSrc: string;
  category: string;
  effect: string;
}

export interface Region {
  id: number;
  name: string;
  locations: Array<{
    name: string;
    url: string;
  }>;
}

export interface Location {
  id: number;
  name: string;
  region: string;
  areas: Array<{
    name: string;
    url: string;
  }>;
}

// ========== ITEMS API ==========

export async function fetchItems(limit: number = 100, offset: number = 0): Promise<Item[]> {
  try {
    const response = await fetch(`${BASE_URL}/item?limit=${limit}&offset=${offset}`);
    
    if (!response.ok) {
      throw new Error("Failed to fetch items");
    }

    const data = await response.json();
    
    const itemPromises = data.results.map(async (result: any) => {
      try {
        const itemResponse = await fetch(result.url);
        const itemData = await itemResponse.json();
        
        // Obtener el efecto en inglés
        const effectEntry = itemData.effect_entries.find(
          (entry: any) => entry.language.name === 'en'
        );
        
        return {
          id: itemData.id,
          name: itemData.name,
          cost: itemData.cost,
          imgSrc: itemData.sprites.default || 
                  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${itemData.name}.png`,
          category: itemData.category?.name || 'other',
          effect: effectEntry?.short_effect || 'No effect description'
        };
      } catch (error) {
        console.error(`Error fetching item ${result.name}:`, error);
        return null;
      }
    });

    const items = await Promise.all(itemPromises);
    return items.filter((item): item is Item => item !== null);
  } catch (error) {
    console.error('Error fetching items:', error);
    throw error;
  }
}

export async function fetchItemsByCategory(category: string): Promise<Item[]> {
  try {
    const response = await fetch(`${BASE_URL}/item-category/${category}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch category ${category}`);
    }

    const data = await response.json();
    
    const itemPromises = data.items.map(async (item: any) => {
      try {
        const itemResponse = await fetch(item.url);
        const itemData = await itemResponse.json();
        
        const effectEntry = itemData.effect_entries.find(
          (entry: any) => entry.language.name === 'en'
        );
        
        return {
          id: itemData.id,
          name: itemData.name,
          cost: itemData.cost,
          imgSrc: itemData.sprites.default,
          category: category,
          effect: effectEntry?.short_effect || 'No effect description'
        };
      } catch (error) {
        console.error(`Error fetching item:`, error);
        return null;
      }
    });

    const items = await Promise.all(itemPromises);
    return items.filter((item): item is Item => item !== null);
  } catch (error) {
    console.error('Error fetching items by category:', error);
    throw error;
  }
}

export function searchItems(query: string, allItems: Item[]): Item[] {
  return allItems.filter(item => 
    item.name.toLowerCase().includes(query.toLowerCase())
  );
}

// ========== LOCATIONS API ==========

export async function fetchRegions(): Promise<Region[]> {
  try {
    const response = await fetch(`${BASE_URL}/region?limit=100`);
    
    if (!response.ok) {
      throw new Error("Failed to fetch regions");
    }

    const data = await response.json();
    
    const regionPromises = data.results.map(async (result: any) => {
      try {
        const regionResponse = await fetch(result.url);
        const regionData = await regionResponse.json();
        
        return {
          id: regionData.id,
          name: regionData.name,
          locations: regionData.locations
        };
      } catch (error) {
        console.error(`Error fetching region ${result.name}:`, error);
        return null;
      }
    });

    const regions = await Promise.all(regionPromises);
    return regions.filter((region): region is Region => region !== null);
  } catch (error) {
    console.error('Error fetching regions:', error);
    throw error;
  }
}

export async function fetchLocationsByRegion(regionName: string): Promise<Location[]> {
  try {
    const response = await fetch(`${BASE_URL}/region/${regionName}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch region ${regionName}`);
    }

    const regionData = await response.json();
    
    const locationPromises = regionData.locations.map(async (loc: any) => {
      try {
        const locationResponse = await fetch(loc.url);
        const locationData = await locationResponse.json();
        
        return {
          id: locationData.id,
          name: locationData.name,
          region: regionName,
          areas: locationData.areas
        };
      } catch (error) {
        console.error(`Error fetching location:`, error);
        return null;
      }
    });

    const locations = await Promise.all(locationPromises);
    return locations.filter((location): location is Location => location !== null);
  } catch (error) {
    console.error('Error fetching locations by region:', error);
    throw error;
  }
}

export async function fetchAllLocations(limit: number = 500): Promise<Location[]> {
  try {
    const response = await fetch(`${BASE_URL}/location?limit=${limit}`);
    
    if (!response.ok) {
      throw new Error("Failed to fetch locations");
    }

    const data = await response.json();
    
    const locationPromises = data.results.map(async (result: any) => {
      try {
        const locationResponse = await fetch(result.url);
        const locationData = await locationResponse.json();
        
        return {
          id: locationData.id,
          name: locationData.name,
          region: locationData.region?.name || 'unknown',
          areas: locationData.areas
        };
      } catch (error) {
        console.error(`Error fetching location ${result.name}:`, error);
        return null;
      }
    });

    const locations = await Promise.all(locationPromises);
    return locations.filter((location): location is Location => location !== null);
  } catch (error) {
    console.error('Error fetching all locations:', error);
    throw error;
  }
}