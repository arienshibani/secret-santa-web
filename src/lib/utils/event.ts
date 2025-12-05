/**
 * Generate a URL-safe event name from a string
 * Converts to lowercase, replaces spaces with hyphens, removes special chars
 */
export const slugifyEventName = (name: string): string => {
	return name
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9\s-]/g, '') // Remove special characters
		.replace(/\s+/g, '-') // Replace spaces with hyphens
		.replace(/-+/g, '-') // Replace multiple hyphens with single
		.replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
};

/**
 * Generate a unique event name if none provided
 */
export const generateEventName = (): string => {
	const timestamp = Date.now().toString(36);
	const random = Math.random().toString(36).substring(2, 8);
	return `event-${timestamp}-${random}`;
};

