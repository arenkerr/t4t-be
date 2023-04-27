import { Sequelize } from 'sequelize';
import {SequelizeStorage, Umzug} from 'umzug';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const umzug = (sequelize: Sequelize) => new Umzug({
    migrations: {
      glob: ['*.{js,cjs,mjs}', { cwd: __dirname, ignore: 'umzug.js'}],
      resolve: (params) => {
        if (params.path) {
            if (params.path.endsWith('.mjs') || params.path.endsWith('.js')) {
                const getModule = () => import(`file:///${params.path && params.path.replace(/\\/g, '/')}`)
                return {
                    name: params.name,
                    path: params.path,
                    up: async upParams => (await getModule()).up(upParams),
                    down: async downParams => (await getModule()).down(downParams),
                }
            }
        }
        const getDefaultModule = async () => await import(params.path || '')
  
        return  {
            name: params.name,
            path: params.path,
            up: async upParams => (await getDefaultModule()).up(upParams),
            down: async downParams => (await getDefaultModule()).down(downParams),
          };
      }
    },
    context: sequelize.getQueryInterface(),
    storage: new SequelizeStorage({ sequelize }),
    logger: console,
  });


export default umzug;
export type Migration = unknown;
