require('dotenv').config({ path: '.env.development' });
const mongoose = require('mongoose');
const User = require('./models/User');

async function debug() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const email = 'testdebug@example.com';
    const password = 'password123';

    // 1. Clear existing user
    await User.deleteOne({ email });

    // 2. Register user
    console.log('Registering user...');
    const user = await User.create({
      name: 'Debug User',
      email,
      password
    });
    console.log('User created:', user.email, 'Hashed Password:', user.password);

    // 3. Find user
    const foundUser = await User.findOne({ email }).select('+password');
    console.log('Found user hashed password:', foundUser.password);

    // 4. Test matchPassword
    const isMatch = await foundUser.matchPassword(password);
    console.log('Does password match?', isMatch);

    if (!isMatch) {
      console.log('TESTING BCRYPT COMPARE MANUALLY');
      const bcrypt = require('bcryptjs');
      const manualMatch = await bcrypt.compare(password, foundUser.password);
      console.log('Manual bcrypt match:', manualMatch);
    }

    mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
    mongoose.connection.close();
  }
}

debug();
