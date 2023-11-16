import { ReactNode, createContext, useState } from "react";

export interface FocusTrapScope {
  paused: boolean;
  pause(): void;
  resume(): void;
}

interface Context {
  add(scope: FocusTrapScope): void;
  remove(scope: FocusTrapScope): void;
}

export const FocusTrapScopeContext = createContext<Context | null>(null);

const FocusTrapScopeProvider = (props: { children?: ReactNode }) => {
  const { children } = props;

  const [scope, setScope] = useState<FocusTrapScope[]>([]);

  return (
    <FocusTrapScopeContext.Provider
      value={{
        add: (toAddScope: FocusTrapScope) => {
          const activeScope = scope[0];

          if (toAddScope !== activeScope) {
            activeScope.pause();
          }

          setScope((p) => [toAddScope, ...p.filter((sc) => sc !== toAddScope)]);
        },
        remove: (toRemoveScope) => {
          setScope((p) => p.filter((sc) => sc !== toRemoveScope));
        },
      }}
    >
      {children}
    </FocusTrapScopeContext.Provider>
  );
};

export default FocusTrapScopeProvider;
