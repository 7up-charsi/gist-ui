export class GistUiError extends Error {
  constructor(
    public component: string,
    public message: string,
  ) {
    super(message);

    this.name = `Gist-ui ${component[0].toUpperCase() + component.slice(1)}`;
  }
}

export const onlyChildError = "must have only one child";
export const validChildError = "child must be valid element";
