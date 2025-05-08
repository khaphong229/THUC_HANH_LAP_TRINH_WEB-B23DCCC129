export type DestinationType = "biển" | "núi" | "thành phố";

export interface Cost {
  food: number;
  transport: number;
  accommodation: number;
}

export interface Destination {
  id: string;
  name: string;
  image: string;
  location: string;
  type: DestinationType;
  rating: number;
  description: string;
  cost: Cost;
  visitDuration: string;
}
