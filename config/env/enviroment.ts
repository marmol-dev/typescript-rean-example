'use strict';

import BaseConfiguration from './base';

interface EnviromentConfiguration {
    applyConfiguration(configObject : BaseConfiguration) : void;
}

export default EnviromentConfiguration;
