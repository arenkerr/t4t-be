export const config =
  process.env.NODE_ENV === 'production'
    ? {
        origin: 'tbd',
        credentials: true,
      }
    : {
        origin: 'http://localhost:4000',
        credentials: true,
      };
