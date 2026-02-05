export const RATING_EMOJIS = ['😢', '😕', '😐', '🙂', '😊', '🤩'];

export const STATUS_COLORS: Record<string, string> = {
    'Currently Airing': 'bg-green-500/10 text-green-600 border-green-500/20',
    'Finished Airing': 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    'Not yet aired': 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
};

export const RATING_LABELS = [
    { emoji: '😢', value: 1, label: 'Très mauvais' },
    { emoji: '😕', value: 2, label: 'Mauvais' },
    { emoji: '😐', value: 3, label: 'Moyen' },
    { emoji: '🙂', value: 4, label: 'Bon' },
    { emoji: '😊', value: 5, label: 'Très bon' },
    { emoji: '🤩', value: 6, label: 'Excellent' },
];
