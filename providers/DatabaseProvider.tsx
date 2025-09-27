import React from 'react';
import { DatabaseProvider as WDBProvider } from '@nozbe/watermelondb/react';
import { database } from '../database';

interface DatabaseProviderProps {
  children: React.ReactNode;
}

export const DatabaseProvider: React.FC<DatabaseProviderProps> = ({
  children,
}) => {
  return <WDBProvider database={database}>{children}</WDBProvider>;
};
