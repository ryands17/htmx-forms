import { app } from './index.jsx';

if (process.env.IS_LOCAL) {
  const PORT = 3000;
  app.listen(PORT, () =>
    console.log(`App running on http://localhost:${PORT}`),
  );
}
