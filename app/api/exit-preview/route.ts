import { draftMode } from "next/headers";

export async function GET() {
  (await draftMode()).disable();

  return new Response(
    `
    <html>
      <head>
        <title>Exiting Preview</title>
      </head>
      <body style="font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background-color: #f9fafb;">
        <div style="text-align: center; padding: 2rem; background: white; border-radius: 8px; box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);">
          <h1 style="font-size: 1.25rem; color: #111827; margin-bottom: 0.5rem;">Exiting Preview Mode...</h1>
          <script>
            setTimeout(() => {
              window.close();
              // Fallback if window.close() is blocked
              setTimeout(() => {
                window.location.href = "/";
              }, 1000);
            }, 500);
          </script>
        </div>
      </body>
    </html>
  `,
    {
      headers: {
        "Content-Type": "text/html",
      },
    },
  );
}
