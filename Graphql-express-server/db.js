import { Database } from 'fakebase';

const db = new Database('./data');

export const Questions = db.table('questions');

