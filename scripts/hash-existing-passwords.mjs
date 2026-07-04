import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, '..', 'src', 'lib', 'db.json');

function isAlreadyHashed(password) {
  return /^\$2[aby]\$/.test(password);
}

async function migrate() {
  const raw = fs.readFileSync(DB_PATH, 'utf8');
  const db = JSON.parse(raw);

  let updatedCount = 0;

  for (const user of db.users) {
    if (user.password && !isAlreadyHashed(user.password)) {
      const plain = user.password;
      user.password = await bcrypt.hash(plain, 10);
      updatedCount++;
      console.log(`Hashed password for: ${user.email}`);
    }
  }

  if (updatedCount === 0) {
    console.log('No plaintext passwords found. Nothing to do.');
    return;
  }

  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf8');
  console.log(`\nDone. Updated ${updatedCount} user(s). db.json has been saved.`);
}

migrate().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
