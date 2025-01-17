"use client";

import React, { createContext, useState } from 'react';

export const SharedContext = createContext<{ variables: Variable[]; setVariables: React.Dispatch<React.SetStateAction<Variable[]>> } | undefined>(undefined);

export interface Variable {
  name: string;
  id: string;
  type?: string;
}

export default function VariablesProvider({ children }: { children: React.ReactNode }) {
  const [variables, setVariables] = useState<Variable[]>([]);
  const contextValue = React.useMemo(() => ({ variables, setVariables }), [variables]);

  return (
    <SharedContext.Provider value={contextValue}>
      {children}
    </SharedContext.Provider>
  );
};
