export const config =
  process.env.NODE_ENV === 'production'
    ? {
        origin: 'tbd',
        credentials: true,
      }
    : {
        origin: 'http://localhost:3000',
        credentials: true,
      };
