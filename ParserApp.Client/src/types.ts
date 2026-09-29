export interface Product {
  id: number
  name: string
  description: string
  imageUrl: string
}

export type ProductDraft = Omit<Product, 'id'>