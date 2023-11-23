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

  const [, setScope] = useState<FocusTrapScope[]>([]);

  return (
    <FocusTrapScopeContext.Provider
      value={{
        add: (toAddScope: FocusTrapScope) => {
          setScope((p) => [
            toAddScope,
            ...p.filter((sc, i) => {
              if (i === 0) {
                sc.pause();
              }

              return sc !== toAddScope;
            }),
          ]);
        },
        remove: (toRemoveScope) => {
          setScope((p) =>
            p.filter((sc, i) => {
              if (sc === toRemoveScope) p[i + 1]?.resume();

              return sc !== toRemoveScope;
            }),
          );
        },
      }}
    >
      {children}
    </FocusTrapScopeContext.Provider>
  );
};

export default FocusTrapScopeProvider;
