import { createContext, useContext as _useContext } from 'react';
import { GistUiError } from '@gist-ui/error';

export const createContextScope = <ContextValue extends object>(
  rootName: string,
  defaultContext?: ContextValue,
) => {
  const Context = createContext(defaultContext);

  const Provider = (props: ContextValue & { children?: React.ReactNode }) => {
    const { children, ...rest } = props;

    return (
      <Context.Provider value={rest as ContextValue}>
        {children}
      </Context.Provider>
    );
  };

  const useContext = (consumerName: string) => {
    const context = _useContext(Context);

    if (!context)
      throw new GistUiError(
        'createContextScope',
        `\`${consumerName}\` must be used within \`${rootName}\``,
      );

    return context;
  };

  Provider.displayName = `${rootName}Provider`;

  return [Provider, useContext] as const;
};
