export interface CategoryData {
  id: string;
  name: string;
  color: string;
}

export interface CreateCategoryData {
  name: string;
  color: string;
}

export type CategoryColor =
  | '#c333cc'
  | '#2196F3'
  | '#4CAF50'
  | '#FF9800'
  | '#F44336'
  | '#9C27B0'
  | '#00BCD4'
  | '#8BC34A'
  | '#FFC107'
  | '#E91E63';
