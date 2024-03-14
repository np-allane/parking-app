// UserContext.tsx
import React from 'react';
import { User } from 'firebase/auth'; // Import the User type from Firebase

const UserContext = React.createContext<User | null>(null);

export default UserContext;