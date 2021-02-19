export interface SpaceEntry {
    spaceId: string,
    name: string,
    location: string,
    description?: string,
    photoURL?: String
}

export type ReservationState = 'PENDING' | 'APPROVED' | 'CANCELED'
export interface ReservationEntry {
    reservationId: string,
    user: string,
    spaceId: string,
    state: ReservationState
}