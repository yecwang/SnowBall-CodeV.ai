// config to backend service

// jwt
export const JWT_TOKEN_KEY = process.env.NEXTAUTH_SECRET;
export const PLUGIN_APP_BASH_PATH = process.env.PLUGIN_APP_BASH_PATH || 'tisoul_app/plugin_app';

// server
export const SIMULATOR_CONTROLLER_NAMESPACE = process.env.SIMULATOR_CONTROLLER_NAMESPACE || 'default';

export const {OPENAI_API_KEY} = process.env;

export const SYSTEM_IMAGE_PATH = process.env.SYSTEM_IMAGE_PATH || 'tisoul_app/images';