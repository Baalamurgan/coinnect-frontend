export type Item = {
  id: string;
  category_id: string;
  name: string;
  description: string;
  year: number;
  sku: string;
  image_url: string;
  stock: number;
  sold: number;
  price: number;
  gst: number;
  details: [
    {
      id: string;
      ItemID: string;
      attribute: string;
      value: string;
      created_at: number;
      updated_at: number;
    }
  ];
  created_at: number;
  updated_at: number;
};

export type Category = {
  id: string;
  name: string;
  description: string;
  parent_category_id: string | null;
  items: Item[];
  created_at: number;
  updated_at: number;
};
