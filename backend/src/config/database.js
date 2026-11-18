import mongoose from 'mongoose';

export async function connectDatabase() {
  const uri = process.env.MONGODB_URI?.trim();
  if (!uri) throw new Error('MONGODB_URI tanımlı değil');
  if (uri.includes('<db_username>')) throw new Error('MONGODB_URI için Atlas kullanıcı adı gerekli');

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
  } catch (error) {
    throw new Error(`MongoDB bağlantısı başarısız (${error.name})`, { cause: error });
  }

  const { host, name } = mongoose.connection;
  const source = uri.startsWith('mongodb+srv://') ? 'Atlas' : 'yerel';
  console.log(`MongoDB bağlandı (${source}): ${host}/${name}`);
}
