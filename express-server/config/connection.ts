import mongoose from 'mongoose';

const { MONGO_URI } = process.env;

if (!MONGO_URI) {
	throw new Error('MONGO_URI is not defined');
}

mongoose.connect(MONGO_URI);

const db = mongoose.connection;

export default db
