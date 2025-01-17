const api = [{
  url: 'api/v1/users/login',
  method: 'POST',
  name: 'userLogin',
  description: 'Login to the system',
  security: {
    accessToken: {
      type: 'apiKey',
      in: 'header',
      name: 'x-access-token'
    }
  },
  request: {
    body: {
      username: {
        type: 'string',
        required: true,
      },
      password: {
        type: 'string',
        required: true,
      }
    },
  },
}, {
  url: 'api/v1/users',
  method: 'GET',
  name: 'getAllUsers',
  description: 'Get all users',
  security: {
    accessToken: {
      type: 'apiKey',
      in: 'header',
      name: 'x-access-token'
    }
  },
  request: {
    query: {
      page: {
        type: 'number',
        required: false,
      },
      limit: {
        type: 'number',
        required: false,
      }
    },
  },
}]

export default api;
