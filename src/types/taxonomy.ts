export interface RecordType {
  id: string;       // String ID from API
  name: string;
  selected: boolean;
}

export interface Subcategory {
  id: string;       // String ID from API
  name: string;
  selected: boolean;
  expanded: boolean;
  subcategories: RecordType[];
}

export interface Category {
  id: string;       // String ID from API
  name: string;
  selected: boolean;
  expanded: boolean;
  subcategories: Subcategory[];
}

export interface TaxonomyData {
  categories: Category[];
}