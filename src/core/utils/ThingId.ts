import { v4 as uuidv4 } from 'uuid';

export class ThingId {
    static generate(): string {
        return uuidv4();
    }
}
