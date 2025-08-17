import React, { useEffect, useState } from 'react';
import { fetchTaxonomies } from '../services/taxonomyService';
import SearchTaxonomies from './SearchTaxonomies';
import { Category } from '../types/taxonomy';

interface SelectedItem {
  type: 'category' | 'subcategory' | 'nested';
  categoryId: string;
  categoryName: string;
  subcategoryId?: string;
  subcategoryName?: string;
  nestedId?: string;
  nestedName?: string;
}

const SearchTaxonomiesContainer: React.FC = () => {
  const [data, setData] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<SelectedItem | null>(null);
console.log(selectedItem);
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const taxonomies = await fetchTaxonomies();
      console.log('Fetched taxonomies:', taxonomies);
      setData(taxonomies);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching taxonomy data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <SearchTaxonomies
      data={data}
      isLoading={isLoading}
      error={error}
      onRefresh={fetchData}
      selectedItem={selectedItem}
      onSelectionChange={setSelectedItem}
    />
  );
};

export default SearchTaxonomiesContainer;
