export const generateToken = (): string => {
	return crypto.randomUUID();
};

export const getAssignmentUrl = (token: string, baseUrl: string = ''): string => {
	const url = baseUrl || (typeof window !== 'undefined' ? window.location.origin : '');
	return `${url}/assignment?token=${token}`;
};

