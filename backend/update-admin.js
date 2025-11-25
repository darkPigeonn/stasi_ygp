const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');

async function updateAdmin() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'stasi_yohanes'
  });

  try {
    // Hash password
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Update admin user
    await connection.execute(
      'UPDATE users SET password = ?, role = ? WHERE username = ?',
      [hashedPassword, 'admin', 'admin']
    );

    console.log('Admin user updated successfully!');
    console.log('Username: admin');
    console.log('Password: admin123');
    console.log('Role: admin');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await connection.end();
  }
}

updateAdmin();
