// Festive emojis for participants
const festiveEmojis = [
	'🎄', '🎁', '🎅', '❄️', '⭐', '🌟', '🎀', '🔔', '🕯️', '🎊',
	'🎉', '🎈', '🧦', '🍪', '🥛', '🦌', '⛄', '🎄', '🎁', '🎅',
	'❄️', '⭐', '🌟', '🎀', '🔔', '🕯️', '🎊', '🎉', '🎈', '🧦'
];

// Shuffle array using Fisher-Yates algorithm
const shuffleArray = <T>(array: T[]): T[] => {
	const shuffled = [...array];
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}
	return shuffled;
};

// Create a shuffled version of emojis for random assignment
let shuffledEmojis = shuffleArray(festiveEmojis);
let emojiIndex = 0;

/**
 * Assign a festive emoji to a participant
 * Uses a shuffled array to ensure randomization while avoiding duplicates
 */
export const getParticipantEmoji = (name: string, index: number): string => {
	// If we've used all emojis, reshuffle and start over
	if (emojiIndex >= shuffledEmojis.length) {
		shuffledEmojis = shuffleArray(festiveEmojis);
		emojiIndex = 0;
	}
	
	// Return the next emoji from the shuffled array
	return shuffledEmojis[emojiIndex++ % shuffledEmojis.length];
};

/**
 * Add emoji prefix to a name for storage
 */
export const addEmojiToName = (name: string, emoji: string): string => {
	return `${emoji} ${name}`;
};

/**
 * Remove emoji prefix from a name (for display/editing)
 */
export const removeEmojiFromName = (nameWithEmoji: string): string => {
	// Remove emoji and any leading/trailing spaces
	return nameWithEmoji.replace(/^[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]\s*/u, '').trim();
};

