import create from 'zustand';

type Store = {
    activePlant: any;
    setActivePlant: (plant: any) => void;
    activePlantCoordinates: number[];
    setActivePlantCoordinates: (coordinates: number[]) => void;
    isHealing: boolean;
    setIsHealing: (healing: boolean) => void;
}

export const useStore = create<Store>((set) => ({
    activePlant: null,
    setActivePlant: (plant) => set({ activePlant: plant }),
    isHealing: false,
    setIsHealing: (healing) => set({ isHealing: healing }),
    activePlantCoordinates: [],
    setActivePlantCoordinates: (coordinates) => set({ activePlantCoordinates: coordinates }),
}));