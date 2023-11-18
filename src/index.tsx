import html from '@kitajs/html';
import express from 'express';

export const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/static', express.static('./public'));

app.get('/', (_req, res) => {
  res.send(
    <BaseHtml>
      <body>
        <h2 class="text-2xl">Hello World</h2>
        <button class="btn btn-primary">Click me</button>
      </body>
    </BaseHtml>,
  );
});

// components
export function BaseHtml({ children }: html.PropsWithChildren) {
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Express + HTMX</title>
    <link rel="stylesheet" href="/static/index.css" />
    <script src="/static/htmx@1.9.8.js"></script>
    <script src="/static/hyperscript@0.9.12.js"></script>
  </head>
  ${children}
  <script>
    htmx.config.globalViewTransitions = true;
    htmx.config.useTemplateFragments = true;
  </script>
  </html>
`;
}
