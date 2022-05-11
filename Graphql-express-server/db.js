import { Database } from 'fakebase';

const db = new Database('./data');

// The quiz questiion are imported from data and exported from here 
export const Questions = db.table('questions');
