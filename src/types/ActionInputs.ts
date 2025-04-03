export interface ActionInputs {
    /** GitHub token for API access */
    token: string;
    
    /** Path to the label configuration file */
    configPath: string;
    
    /** Whether to use default configuration if no config file is found */
    useDefaultConfig: boolean;
  }