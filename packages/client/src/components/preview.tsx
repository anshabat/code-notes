import './preview.css'
import { useRef, useEffect, FC } from "react";

interface PreviewProps {
  code: string;
}

const html = `
    <html style="background-color: white">
      <head></head>
      <body>
        <div id="root"></div>
        <script>
          const handleError = (error) => {
            const root = document.getElementById('root')
            root.innerHTML = '<div>'+error+'</div>'
            console.error(error)
          }
          
          window.addEventListener('error', (event) => {
            handleError(event.error)
          })

          window.addEventListener('message', (event) => {
            try{
              eval(event.data);
            } catch (error) {
              handleError(error)
            }
          }, false);
        </script>
      </body>
    </html>
  `;

interface PreviewProps {
  code: string;
  error: string;
}

const Preview: FC<PreviewProps> = ({ code, error }) => {
  const iframe = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (iframe.current) {
      iframe.current.srcdoc = html;
      setTimeout(() => {
        iframe.current?.contentWindow?.postMessage(code, "*");
      }, 50);
    }
  }, [code]);

  return (
    <div className="preview-wrapper">
      <iframe
        ref={iframe}
        srcDoc={html}
        title="Code"
        sandbox="allow-scripts"
      />
      {error && <div className="preview-error">{error}</div>}
    </div>
  );
};

export default Preview;
