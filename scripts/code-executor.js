// Code Execution Module
const CodeExecutor = (function() {
  
  // Piston API endpoint (free, no auth required)
  const PISTON_API = 'https://emkc.org/api/v2/piston';
  
  // Language mappings for Piston
  const languageMap = {
    javascript: { language: 'javascript', version: '18.15.0' },
    python: { language: 'python', version: '3.10.0' },
    java: { language: 'java', version: '15.0.2' },
    c_cpp: { language: 'c++', version: '10.2.0' },
    csharp: { language: 'csharp', version: '6.12.0' },
    php: { language: 'php', version: '8.2.3' },
    ruby: { language: 'ruby', version: '3.0.1' },
    go: { language: 'go', version: '1.16.2' },
    rust: { language: 'rust', version: '1.68.2' },
    typescript: { language: 'typescript', version: '5.0.3' },
    swift: { language: 'swift', version: '5.3.3' },
    kotlin: { language: 'kotlin', version: '1.8.20' },
    sql: { language: 'sqlite3', version: '3.36.0' }
  };

  // Get available runtimes
  async function getRuntimes() {
    try {
      const response = await fetch(`${PISTON_API}/runtimes`);
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch runtimes:', error);
      return [];
    }
  }

  // Execute code
  async function execute(language, code, input = '') {
    const langConfig = languageMap[language];
    
    if (!langConfig) {
      return {
        success: false,
        error: `Language ${language} is not supported for execution`,
        output: ''
      };
    }

    try {
      const response = await fetch(`${PISTON_API}/execute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          language: langConfig.language,
          version: langConfig.version,
          files: [
            {
              name: `main.${getFileExtension(language)}`,
              content: code
            }
          ],
          stdin: input,
          args: [],
          compile_timeout: 10000,
          run_timeout: 10000,
          compile_memory_limit: -1,
          run_memory_limit: -1
        })
      });

      const result = await response.json();
      
      if (result.run) {
        return {
          success: true,
          output: result.run.output || '',
          error: result.run.stderr || '',
          exitCode: result.run.code,
          executionTime: result.run.time || 0
        };
      } else if (result.compile && result.compile.stderr) {
        return {
          success: false,
          output: '',
          error: result.compile.stderr,
          exitCode: result.compile.code
        };
      } else {
        return {
          success: false,
          output: '',
          error: 'Execution failed',
          exitCode: -1
        };
      }
    } catch (error) {
      return {
        success: false,
        output: '',
        error: `Execution error: ${error.message}`,
        exitCode: -1
      };
    }
  }

  // Get file extension for language
  function getFileExtension(language) {
    const extensions = {
      javascript: 'js',
      python: 'py',
      java: 'java',
      c_cpp: 'cpp',
      csharp: 'cs',
      php: 'php',
      ruby: 'rb',
      go: 'go',
      rust: 'rs',
      typescript: 'ts',
      swift: 'swift',
      kotlin: 'kt',
      sql: 'sql'
    };
    return extensions[language] || 'txt';
  }

  // Public API
  return {
    execute,
    getRuntimes,
    isSupported: (language) => languageMap.hasOwnProperty(language)
  };
})();