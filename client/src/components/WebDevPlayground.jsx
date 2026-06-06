import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { FiCode, FiLayout, FiSave, FiCheckCircle } from 'react-icons/fi';

const WebDevPlayground = ({ topicId, boilerplate, editorTheme }) => {
  const [files, setFiles] = useState({
    'index.html': boilerplate?.html || '<!-- Write HTML here -->\n<h1>Hello World</h1>\n',
    'style.css': boilerplate?.css || '/* Write CSS here */\nh1 { color: #308D46; }\n',
    'script.js': boilerplate?.js || '// Write JS here\nconsole.log("Playground ready!");\n'
  });
  
  const [activeFile, setActiveFile] = useState('index.html');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  
  // Track if initial load is done to prevent overwriting with boilerplate
  const [isLoaded, setIsLoaded] = useState(false);

  // Debounce timer ref
  const saveTimer = useRef(null);

  // Fetch saved project on mount
  useEffect(() => {
    if (!topicId) return;
    
    const fetchProject = async () => {
      try {
        const res = await api.get(`/progress/webdev-project/${topicId}`);
        if (res.data?.data?.files) {
          setFiles({
            'index.html': res.data.data.files.html || boilerplate?.html || '',
            'style.css': res.data.data.files.css || boilerplate?.css || '',
            'script.js': res.data.data.files.js || boilerplate?.js || ''
          });
          setLastSaved(new Date(res.data.data.lastSavedAt));
        }
      } catch (err) {
        console.error("Failed to fetch web dev project state:", err);
      } finally {
        setIsLoaded(true);
      }
    };
    fetchProject();
  }, [topicId]);

  // Debounced Auto-Save
  useEffect(() => {
    if (!isLoaded || !topicId) return;

    if (saveTimer.current) {
      clearTimeout(saveTimer.current);
    }

    saveTimer.current = setTimeout(async () => {
      setIsSaving(true);
      try {
        await api.post('/progress/webdev-project', {
          topicId,
          files: {
            html: files['index.html'],
            css: files['style.css'],
            js: files['script.js']
          }
        });
        setLastSaved(new Date());
      } catch (err) {
        toast.error("Auto-save failed");
      } finally {
        setIsSaving(false);
      }
    }, 2500);

    return () => clearTimeout(saveTimer.current);
  }, [files, isLoaded, topicId]);

  const handleEditorChange = (val) => {
    setFiles(prev => ({ ...prev, [activeFile]: val || '' }));
  };

  const getLanguage = (filename) => {
    if (filename.endsWith('.html')) return 'html';
    if (filename.endsWith('.css')) return 'css';
    if (filename.endsWith('.js')) return 'javascript';
    return 'plaintext';
  };

  // Generate srcDoc for the iframe
  const srcDoc = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>${files['style.css']}</style>
    </head>
    <body>
      ${files['index.html']}
      <script>
        try {
          ${files['script.js']}
        } catch (e) {
          console.error(e);
        }
      </script>
    </body>
    </html>
  `;

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] border-t border-[var(--border)] overflow-hidden">
      
      {/* Top Header / Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#252526] border-b border-[#3e3e42] shrink-0">
        <div className="flex items-center gap-1">
          {Object.keys(files).map((filename) => (
            <button
              key={filename}
              onClick={() => setActiveFile(filename)}
              className={`px-3 py-1.5 text-xs font-bold font-mono rounded transition-colors ${
                activeFile === filename 
                  ? 'bg-[#1e1e1e] text-[var(--brand-green)] border-t-2 border-[var(--brand-green)]' 
                  : 'text-[#858585] hover:bg-[#2a2d2e] hover:text-[#cccccc]'
              }`}
            >
              {filename === 'index.html' && <span className="text-orange-500 mr-1.5">&lt;/&gt;</span>}
              {filename === 'style.css' && <span className="text-blue-400 mr-1.5">#</span>}
              {filename === 'script.js' && <span className="text-yellow-400 mr-1.5">JS</span>}
              {filename}
            </button>
          ))}
        </div>
        
        <div className="flex items-center gap-3">
          <div className="text-[10px] text-gray-400 font-medium flex items-center gap-1.5">
            {isSaving ? (
              <span className="animate-pulse flex items-center gap-1"><FiSave /> Saving...</span>
            ) : lastSaved ? (
              <span className="flex items-center gap-1 text-green-500"><FiCheckCircle /> Saved at {lastSaved.toLocaleTimeString()}</span>
            ) : null}
          </div>
        </div>
      </div>

      {/* Horizontal Split (Editor Left, Preview Right) */}
      <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
        
        {/* Monaco Editor Container */}
        <div className="flex-1 md:w-1/2 relative border-b md:border-b-0 md:border-r border-[#3e3e42]">
          {isLoaded ? (
            <Editor
              height="100%"
              language={getLanguage(activeFile)}
              value={files[activeFile]}
              onChange={handleEditorChange}
              theme={editorTheme}
              options={{
                fontSize: 13,
                fontFamily: 'Fira Code, monospace',
                minimap: { enabled: false },
                wordWrap: 'on',
                padding: { top: 16 },
                automaticLayout: true
              }}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400 text-sm">
              Loading workspace...
            </div>
          )}
        </div>

        {/* Live Preview Iframe */}
        <div className="flex-1 md:w-1/2 bg-white relative">
          <div className="absolute top-0 left-0 right-0 h-8 bg-gray-100 border-b border-gray-300 flex items-center px-3 z-10 shadow-sm">
            <FiLayout className="text-gray-500 mr-2" />
            <span className="text-xs font-bold text-gray-600 tracking-wider uppercase">Live Preview</span>
          </div>
          <iframe
            srcDoc={srcDoc}
            title="Live Preview"
            className="w-full h-full pt-8 border-none bg-white"
            sandbox="allow-scripts allow-modals"
          />
        </div>

      </div>
    </div>
  );
};

export default WebDevPlayground;
