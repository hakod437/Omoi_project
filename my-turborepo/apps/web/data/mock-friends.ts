import { Friend } from "@/types";

export const MOCK_FRIENDS: Friend[] = [
    {
        id: '1',
        name: 'Sarah',
        animes: [
            { id: '1', name: 'One Piece', rating: 6, animationRating: 5, description: 'Incroyable aventure avec des personnages attachants' },
            { id: '2', name: 'Attack on Titan', rating: 5, animationRating: 6, description: 'Animation époustouflante, histoire prenante' },
            { id: '3', name: 'Death Note', rating: 6, animationRating: 4, description: 'Le meilleur thriller psychologique que j\'ai vu' },
            { id: '4', name: 'Demon Slayer', rating: 4, animationRating: 6, description: 'Visuellement magnifique mais histoire classique' },
        ],
    },
    {
        id: '2',
        name: 'Lucas',
        animes: [
            { id: '1', name: 'Naruto', rating: 5, animationRating: 4, description: 'Mon anime d\'enfance, nostalgie assurée' },
            { id: '2', name: 'One Piece', rating: 5, animationRating: 4, description: 'Long mais ça vaut le coup' },
            { id: '3', name: 'My Hero Academia', rating: 4, animationRating: 5, description: 'Bon shonen moderne' },
            { id: '4', name: 'Jujutsu Kaisen', rating: 6, animationRating: 6, description: 'Le meilleur du genre actuellement' },
        ],
    },
    {
        id: '3',
        name: 'Emma',
        animes: [
            { id: '1', name: 'Death Note', rating: 5, animationRating: 4, description: 'Très intelligent mais la fin est faible' },
            { id: '2', name: 'Fullmetal Alchemist', rating: 6, animationRating: 5, description: 'Une œuvre d\'art complète' },
            { id: '3', name: 'Hunter x Hunter', rating: 6, animationRating: 5, description: 'Complexe et brillant' },
            { id: '4', name: 'Attack on Titan', rating: 4, animationRating: 5, description: 'Bon mais trop sombre à mon goût' },
        ],
    },
];
