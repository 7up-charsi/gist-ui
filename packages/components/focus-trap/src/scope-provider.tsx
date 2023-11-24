import { ReactNode, createContext, useState } from "react";

export interface FocusTrapScope {
  paused: boolean;
  pause(): void;
  resume(): void;
}

export const FocusTrapScopeContext = createContext<{
  add(scope: FocusTrapScope): void;
  remove(scope: FocusTrapScope): void;
} | null>(null);

export const FocusTrapScopeProvider = (props: { children?: ReactNode }) => {
  const { children } = props;

  const [, setScope] = useState<FocusTrapScope[]>([]);

  return (
    <FocusTrapScopeContext.Provider
      value={{
        add: (toAddScope: FocusTrapScope) => {
          setScope((p) => [
            toAddScope,
            ...p.filter((sc, i) => {
              if (i === 0 && sc !== toAddScope) {
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
