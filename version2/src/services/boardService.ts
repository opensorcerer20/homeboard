import { z } from 'zod';

import {
  type BoardData,
  type BoardMessage,
  type Chore,
  loadData,
  saveBoardData,
  type User,
} from '../repository.js';

const CreateMessageInputSchema = z.object({
  userName: z.string().min(1, 'Name is required').max(100),
  text: z.string().min(1, 'Message is required').max(1000),
});

export type CreateMessageInput = z.infer<typeof CreateMessageInputSchema>;

const UpdateChoreInputSchema = z.object({
  index: z.number().int().min(0),
  userName: z.string().min(1, 'Name is required').max(100),
});

export type UpdateChoreInput = z.infer<typeof UpdateChoreInputSchema>;

export class BoardService {
  createMessage(rawInput: unknown): BoardMessage {
    const input = CreateMessageInputSchema.parse(rawInput);

    const data: BoardData = loadData();
    const users: User[] = data.users ?? [];

    const normalizedName = input.userName.trim().toLowerCase();
    const matchedUser = users.find((u) => u.name.trim().toLowerCase() === normalizedName);

    const userId = matchedUser ? matchedUser.id : 0;

    const newMessage: BoardMessage = {
      userId,
      text: input.text.trim(),
      at: new Date().toISOString(),
    };

    const updated: BoardData = {
      ...data,
      board: {
        ...data.board,
        messages: [...data.board.messages, newMessage],
      },
    };

    saveBoardData(updated);

    return newMessage;
  }

  updateChore(rawInput: unknown): Chore {
    const input = UpdateChoreInputSchema.parse(rawInput);

    const data: BoardData = loadData();
    const chores = data.board.chores;

    if (input.index < 0 || input.index >= chores.length) {
      throw new Error('ChoreNotFound');
    }

    const existing = chores[input.index];

    const updatedChore: Chore = {
      ...existing,
      completed: existing.completed === true ? false : true,
    };

    const updatedChores: Chore[] = chores.slice();
    updatedChores[input.index] = updatedChore;

    const updated: BoardData = {
      ...data,
      board: {
        ...data.board,
        chores: updatedChores,
      },
    };

    saveBoardData(updated);

    return updatedChore;
  }
}
