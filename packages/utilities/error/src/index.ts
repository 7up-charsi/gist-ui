export class GistUiError extends Error {
  constructor(
    public component: string,
    public message: string,
  ) {
    super(message);

    this.name = `Gist-ui ${component[0].toUpperCase() + component.slice(1)}`;
  }
}
