export enum RoomType {
    Theory = "theory",
    Practice = "practice",
    Auditorium = "auditorium"
}

export interface Room {
    room_id: string;
    name: string;
    seats: number;
    type: RoomType;
    manager: string;
}
