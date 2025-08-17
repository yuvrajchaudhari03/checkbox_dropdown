import { Category } from '../types/taxonomy';

const API_URL = 'https://vitalretain-backend-stage-ckcpgceshzfzdgcf.eastus2-01.azurewebsites.net/api/v1/filerskeepers/taxonomy';

export const fetchTaxonomies = async (): Promise<Category[]> => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error('Failed to fetch taxonomy data');
    }
    const responseData = await response.json();
    console.log('API Response:', responseData);
    const data = responseData.data || responseData;
    console.log('Extracted data:', data);
    
    if (!Array.isArray(data)) {
      throw new Error('Invalid data format received from API');
    }
    
    return data.map((category: any) => ({
      id: category.id || category._id,
      name: category.name,
      selected: false,
      expanded: false,
      subcategories: (category.subcategories || []).map((sub: any) => ({
        id: sub.id || sub._id,
        name: sub.name,
        selected: false,
        expanded: false,
        subcategories: (sub.recordTypes || []).map((recordType: any) => ({
          id: recordType.id || recordType._id,
          name: recordType.name,
          selected: false
        }))
      }))
    }));
  } catch (error) {
    throw error;
  }
};
