export interface Subcategory {
  id: string;
  name: string;
  selected: boolean;
  subcategories?: Subcategory[];
}

export interface Category {
  id: string;
  name: string;
  selected: boolean;
  expanded: boolean;
  subcategories: Subcategory[];
}

export interface TaxonomyData {
  categories: Category[];
}