export interface SpaceEntry {
    spaceId: string,
    name: string,
    location: string,
    description?: string,
    photoURL?: String
}

export interface ReservationEntry {
    id: string,
    user: string,
    period: string,
    spaceId: string
}