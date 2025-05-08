declare module LichTrinh {
  export type DestinationType = 'biển' | 'núi' | 'thành phố';

  export interface Destination {
    id: string;
    name: string;
    image: string;
    location: string;
    type: DestinationType;
    rating: number | string;
    description: string;
    visitDuration: number | string; 
    cost: {
      food: number | string;
      transport: number | string;
      accommodation: number | string;
    };
  }

  export interface ItineraryItem {
    destinationId: string;
    day: number;
    order: number;
  }

  export interface Itinerary {
    id: string;
    name: string;
    startDate: string;
    endDate?: string;
    items: ItineraryItem[];
    totalBudget?: number | string;
    user?: string;
    total_travel_time_minutes?: string;
  }

  export interface BudgetStats {
    food: number;
    transport: number;
    accommodation: number;
    others?: number;
    total: number;
  }
}

export type DestinationType = LichTrinh.DestinationType;
export type Destination = LichTrinh.Destination;
export type ItineraryItem = LichTrinh.ItineraryItem;
export type Itinerary = LichTrinh.Itinerary;
export type BudgetStats = LichTrinh.BudgetStats; 