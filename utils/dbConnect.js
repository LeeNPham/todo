import mongoose from "mongoose";

const DB_URL = process.env.DB_URL;

mongoose.set('strictQuery', true); //uppress the warning and keep the current behavior where strictQuery is true

if (!DB_URL) {
	throw new Error(
		"Please define the DB_URL environment variable inside .env.local"
	);
}

let cached = global.mongoose; //saving global mongoose in a captured variable because we don't want to connect to the database repeatedly

if (!cached) {
	cached = global.mongoose = { conn: null, promise: null };
}

const dbConnect = async () => {
	if (cached.conn) {
		return cached.conn;
	}

	if (!cached.promise) {
		const options = {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		};

		cached.promise = mongoose.connect(DB_URL, options).then((mongoose) => {
			return mongoose;
		});
	}
	cached.conn = await cached.promise;
	return cached.conn;
};

export default dbConnect;
