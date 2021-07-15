import { resolve } from 'path';
import { addAlias } from 'module-alias'

addAlias('@', resolve('dist'))