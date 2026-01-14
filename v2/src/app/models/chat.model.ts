export const CHAT_ROLES = {
    USER: 'user' as const,
    ASSISTANT: 'assistant' as const,
};

export type ChatRole = typeof CHAT_ROLES[keyof typeof CHAT_ROLES];

export interface Message {
    role: ChatRole;
    content: string;
}
