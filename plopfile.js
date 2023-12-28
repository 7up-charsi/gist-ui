const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const camelCase = (str) => {
  return str.replace(/[-_](\w)/g, (_, c) => c.toUpperCase());
};

const generators = ['component', 'hook', 'package'];

const defaultOutDirs = {
  component: 'components',
  hook: 'hooks',
  package: 'utilities',
};

module.exports = function main(
  /** @type {import('plop').NodePlopAPI} */
  plop,
) {
  plop.setHelper('capitalize', (text) => {
    return capitalize(camelCase(text));
  });
  plop.setHelper('camelCase', camelCase);

  generators.forEach((gen) => {
    plop.setGenerator(gen, {
      description: `Generates a ${gen}`,
      prompts: [
        {
          type: 'input',
          name: 'name',
          message: `Enter ${gen} name :`,

          validate: (value) => {
            if (!value) return `${gen} name is required`;

            // check is has a valid hook name "use-something"
            if (gen === 'hook' && !value.startsWith('use-'))
              return "Hook name must start with 'use-'";

            // check is case is correct
            if (value !== value.toLowerCase())
              return `${gen} name must be in lowercase`;

            // cannot have spaces
            if (value.includes(' ')) return `${gen} name cannot have spaces`;

            return true;
          },
        },
        {
          type: 'input',
          name: 'description',
          message: `The description of this ${gen} :`,
        },
        {
          when: gen === 'package',
          type: 'list',
          name: 'outDir',
          message: `where should this ${gen} live? :`,
          default: defaultOutDirs[gen],
          choices: ['core', 'utilities'],
          validate: (value) => {
            if (!value) {
              return `outDir is required`;
            }

            return true;
          },
        },
      ],
      actions(answers) {
        const actions = [];

        if (!answers) return actions;

        const { description, outDir, name } = answers;

        const data = {
          name,
          description,
          outDir:
            gen === 'package'
              ? outDir
              : (gen === 'component' && 'components') ||
                (gen === 'hook' && 'hooks'),
        };

        actions.push({
          type: 'addMany',
          templateFiles: `plop/${gen}/**`,
          destination: `./packages/{{outDir}}/{{dashCase name}}`,
          base: `plop/${gen}`,
          data,
          abortOnFail: true,
        });

        return actions;
      },
    });
  });
};
