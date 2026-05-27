// Web Development Content Engine
// Aligned with progressive checkpoints and DOM-based test validations

export const getWebDevLanguageContent = (topicTitle, languageKey = 'html', difficulty = 'beginner', dbYoutubeLink = '') => {
  const t = (topicTitle || '').toLowerCase();
  const lang = (languageKey || 'html').toLowerCase();

  // Determine standard boilerplate code
  let editorBoilerplate = '';
  let testCases = [];
  
  if (lang === 'html') {
    if (t.includes('html')) {
      editorBoilerplate = `<!DOCTYPE html>
<html>
<head>
  <title>My Landpage</title>
</head>
<body>
  <!-- 1. Add a header element at the top -->
  <header>
    <h1>Welcome to My Website</h1>
  </header>

  <!-- 2. Add an About section with a heading (h2 or h3) and a paragraph -->
  <h2>About Me</h2>
  <p>I am learning HTML one-shot complete course!</p>

  <!-- 3. Add a contact form with an email input and a submit button -->
  <form>
    <input type="email" placeholder="Enter your email" />
    <button type="submit">Submit</button>
  </form>
</body>
</html>`;
      testCases = [
        { input: 'Header Tag', expected: 'exists', selector: 'header' },
        { input: 'About Subheading', expected: 'exists', selector: 'h2, h3' },
        { input: 'Contact Form Tag', expected: 'exists', selector: 'form' },
        { input: 'Email Input field', expected: 'exists', selector: 'form input[type="email"]' },
        { input: 'Submit Button Tag', expected: 'exists', selector: 'form button[type="submit"], form input[type="submit"]' }
      ];
    } else {
      editorBoilerplate = `<!DOCTYPE html>
<html>
<head>
  <title>HTML Playground</title>
</head>
<body>
  <h1>HTML Sandbox</h1>
  <p>Start writing your HTML structure here...</p>
</body>
</html>`;
    }
  } else if (lang === 'css') {
    if (t.includes('css')) {
      editorBoilerplate = `/* CSS Complete Course Synthesis Challenge */
/* 1. Style the body background color and text color */
body {
  background-color: #09090b;
  color: #fafafa;
}

/* 2. Configure flex container to center elements */
.container {
  display: flex;
  justify-content: center;
}

/* 3. Give margins and paddings to card boxes */
.box {
  margin: 10px;
  padding: 20px;
}`;
      testCases = [
        { input: 'Body Background Color', expected: 'matches pattern', regex: 'body\\s*\\{[^}]*background-color\\s*:\\s*(#09090b|black|rgb)' },
        { input: 'Container Flex Display', expected: 'matches pattern', regex: '\\.container\\s*\\{[^}]*display\\s*:\\s*flex' },
        { input: 'Container Justification', expected: 'matches pattern', regex: '\\.container\\s*\\{[^}]*justify-content\\s*:\\s*center' },
        { input: 'Box Padding', expected: 'matches pattern', regex: '\\.box\\s*\\{[^}]*padding\\s*:\\s*20px' },
        { input: 'Box Margin', expected: 'matches pattern', regex: '\\.box\\s*\\{[^}]*margin\\s*:\\s*10px' }
      ];
    } else {
      editorBoilerplate = `/* CSS Playground */
body {
  font-family: 'Outfit', sans-serif;
  background-color: #09090b;
  color: #fafafa;
  padding: 2rem;
}`;
    }
  } else {
    editorBoilerplate = `// JavaScript Playground
console.log("Hello from Web Dev Playground!");`;
  }

  return {
    editorBoilerplate,
    testCases,
    functionName: ''
  };
};

export const getWebDevCheckpointContent = (checkpointId, lang = 'html') => {
  const checkpoints = {
    html_cp1: {
      title: 'HTML Skeleton',
      subtitle: 'Create a valid HTML skeleton boilerplate with a greeting header.',
      videoEmbedUrl: 'https://www.youtube.com/embed/HcOc7P5BMi4?start=0&rel=0&modestbranding=1',
      challenges: {
        html: {
          title: 'The HTML Skeleton',
          desc: `Every web page begins with a structural boilerplate. Let's build one!

Your task is to write a valid HTML document containing:
1. A \`<!DOCTYPE html>\` declaration.
2. An \`<html>\` element enclosing everything.
3. A \`<head>\` element.
4. A \`<body>\` element.
5. Inside the body, add a single \`<h1>\` heading element with the exact text \`Hello, Web!\`.

🎯 Make sure to follow the tags structure correctly. Browser preview will display your layout live!`,
          constraints: 'Must contain valid doctype, html, head, body, and h1 elements.',
          testCases: [
            { input: 'DOCTYPE Declaration', expected: 'matches pattern', regex: '<!DOCTYPE\\s+html>', selector: '' },
            { input: 'Body Tag Existence', expected: 'exists', selector: 'body' },
            { input: 'Heading 1 Tag Content', expected: 'hello, web!', expectedText: true, selector: 'h1' }
          ],
          hints: [
            'Use standard HTML5 doctype structure: <!DOCTYPE html>',
            'Make sure h1 text matches "Hello, Web!" exactly (case-insensitive).',
            'Ensure all tags open and close properly.'
          ],
          bp: `<!-- Write your HTML skeleton code here -->
<!DOCTYPE html>
<html>
<head>
  <title>My First Webpage</title>
</head>
<body>
  <!-- Add h1 with text "Hello, Web!" here -->
  
</body>
</html>`,
          sol: `<!DOCTYPE html>
<html>
<head>
  <title>My First Webpage</title>
</head>
<body>
  <h1>Hello, Web!</h1>
</body>
</html>`
        }
      }
    },
    html_cp2: {
      title: 'Headings & Paragraphs',
      subtitle: 'Create a semantic reading structure using multiple header tiers and paragraphs.',
      videoEmbedUrl: 'https://www.youtube.com/embed/HcOc7P5BMi4?start=720&rel=0&modestbranding=1',
      challenges: {
        html: {
          title: 'Headings & Paragraphs',
          desc: `Web pages use headers to structure content hierarchy. Let's add them!

Your task is to write HTML that contains:
1. A main heading \`<h1>\` tag containing the text \`My Portfolio\`.
2. A secondary subheading \`<h2>\` tag containing the text \`About Me\`.
3. A paragraph \`<p>\` tag containing the sentence \`I am learning web development.\`.

🎯 Check your spelling and case sensitivity. Keep headers clean and organized!`,
          constraints: 'Must contain h1, h2, and p elements with the specified texts.',
          testCases: [
            { input: 'H1 Portfolio title', expected: 'my portfolio', expectedText: true, selector: 'h1' },
            { input: 'H2 Section subtitle', expected: 'about me', expectedText: true, selector: 'h2' },
            { input: 'P About description', expected: 'learning web development', expectedText: true, selector: 'p' }
          ],
          hints: [
            'Create <h1>My Portfolio</h1>',
            'Create <h2>About Me</h2>',
            'Create <p>I am learning web development.</p>'
          ],
          bp: `<!-- Add headings and paragraph below -->
`,
          sol: `<h1>My Portfolio</h1>
<h2>About Me</h2>
<p>I am learning web development.</p>`
        }
      }
    },
    html_cp3: {
      title: 'Links & Images',
      subtitle: 'Add navigation links and embed interactive media elements.',
      videoEmbedUrl: 'https://www.youtube.com/embed/HcOc7P5BMi4?start=1500&rel=0&modestbranding=1',
      challenges: {
        html: {
          title: 'Links & Images',
          desc: `Websites are interconnected and visual. Let's insert links and images!

Your task is to write HTML that contains:
1. An anchor \`<a>\` element pointing to \`https://www.google.com\` containing the link text \`Go to Google\`.
2. An image \`<img>\` element with \`src="https://images.unsplash.com/photo-1531297484001-80022131f5a1"\` and an alt text \`Laptop\`.

🎯 Remember that image tags are self-closing and require both src and alt attributes for SEO and accessibility!`,
          constraints: 'Must contain an anchor pointing to Google and an image with the specified source and alt.',
          testCases: [
            { input: 'Anchor Href attribute', expected: 'google.com', attribute: 'href', selector: 'a' },
            { input: 'Anchor Link Text', expected: 'go to google', expectedText: true, selector: 'a' },
            { input: 'Image Src attribute', expected: 'photo-1531297484001-80022131f5a1', attribute: 'src', selector: 'img' },
            { input: 'Image Alt attribute', expected: 'laptop', attribute: 'alt', selector: 'img' }
          ],
          hints: [
            'Create <a href="https://www.google.com">Go to Google</a>',
            'Create <img src="https://images.unsplash.com/photo-1531297484001-80022131f5a1" alt="Laptop" />'
          ],
          bp: `<!-- Insert your anchor link and image elements here -->
`,
          sol: `<a href="https://www.google.com">Go to Google</a>\n<img src="https://images.unsplash.com/photo-1531297484001-80022131f5a1" alt="Laptop" />`
        }
      }
    },
    html_cp4: {
      title: 'Lists & Navigation',
      subtitle: 'Structure item collections using unordered lists.',
      videoEmbedUrl: 'https://www.youtube.com/embed/HcOc7P5BMi4?start=2700&rel=0&modestbranding=1',
      challenges: {
        html: {
          title: 'Lists & Navigation',
          desc: `Lists are perfect for navigation bars and bullet points.

Your task is to write HTML that contains:
An unordered list \`<ul>\` containing exactly three list items \`<li>\` with the following text contents in order:
1. \`HTML\`
2. \`CSS\`
3. \`JavaScript\`

🎯 Match the order of list items and case capitalization exactly.`,
          constraints: 'Must contain one ul containing 3 li items in the exact order.',
          testCases: [
            { input: 'Unordered List Wrapper', expected: 'exists', selector: 'ul' },
            { input: 'List Item 1 Content', expected: 'html', expectedText: true, selector: 'ul li:nth-child(1)' },
            { input: 'List Item 2 Content', expected: 'css', expectedText: true, selector: 'ul li:nth-child(2)' },
            { input: 'List Item 3 Content', expected: 'javascript', expectedText: true, selector: 'ul li:nth-child(3)' }
          ],
          hints: [
            'Create a <ul> tag.',
            'Inside, create three <li> tags: <li>HTML</li>, <li>CSS</li>, <li>JavaScript</li>.'
          ],
          bp: `<!-- Create your unordered list here -->
`,
          sol: `<ul>\n  <li>HTML</li>\n  <li>CSS</li>\n  <li>JavaScript</li>\n</ul>`
        }
      }
    },
    html_cp5: {
      title: 'Forms & Inputs',
      subtitle: 'Construct interactive input form collections to capture user data.',
      videoEmbedUrl: 'https://www.youtube.com/embed/HcOc7P5BMi4?start=4500&rel=0&modestbranding=1',
      challenges: {
        html: {
          title: 'HTML Forms & Inputs',
          desc: `Forms are crucial for user interactions like logging in or searching.

Your task is to build a form structure containing:
1. A \`<form>\` wrapper element.
2. Inside the form, an \`<input>\` element with attribute \`type="email"\` and attribute \`placeholder="Enter your email"\`.
3. A \`<button>\` element with attribute \`type="submit"\` containing the text \`Submit\`.

🎯 Verify element nesting and attribute values carefully.`,
          constraints: 'Must contain form element, email input with placeholder, and submit button.',
          testCases: [
            { input: 'Form Wrapper', expected: 'exists', selector: 'form' },
            { input: 'Email Input Tag', expected: 'exists', selector: 'form input[type="email"]' },
            { input: 'Email Placeholder', expected: 'enter your email', attribute: 'placeholder', selector: 'form input[type="email"]' },
            { input: 'Submit Button Tag', expected: 'exists', selector: 'form button[type="submit"]' },
            { input: 'Submit Button Text', expected: 'submit', expectedText: true, selector: 'form button[type="submit"]' }
          ],
          hints: [
            'Create a <form> tag.',
            'Inside, add <input type="email" placeholder="Enter your email" />.',
            'Then add <button type="submit">Submit</button>.'
          ],
          bp: `<!-- Construct your form here -->
`,
          sol: `<form>\n  <input type="email" placeholder="Enter your email" />\n  <button type="submit">Submit</button>\n</form>`
        }
      }
    },
    css_cp1: {
      title: 'CSS Selectors & Colors',
      subtitle: 'Learn inline, internal, external styling and class/ID selectors.',
      videoEmbedUrl: 'https://www.youtube.com/embed/Ww9UabWHnQo?start=0&rel=0&modestbranding=1',
      challenges: {
        css: {
          title: 'CSS Selectors & Colors',
          desc: `CSS (Cascading Style Sheets) is used to style and lay out web pages.
          
Your task is to write CSS rules that:
1. Style the \`body\` element to have a \`background-color\` of \`#09090b\`.
2. Style the \`h1\` elements to have a text \`color\` of \`#ff0000\` (red).`,
          constraints: 'Must style body background-color and h1 color.',
          testCases: [
            { input: 'Body Background Color', expected: 'matches pattern', regex: 'body\\s*\\{[^}]*background-color\\s*:\\s*(#09090b|black|rgb)' },
            { input: 'H1 Text Color', expected: 'matches pattern', regex: 'h1\\s*\\{[^}]*color\\s*:\\s*(#ff0000|red|rgb)' }
          ],
          hints: [
            'Use the selector "body" and set "background-color: #09090b;"',
            'Use the selector "h1" and set "color: #ff0000;"'
          ],
          bp: `/* Style the body and h1 selector below */
body {

}
h1 {

}`,
          sol: `body {\n  background-color: #09090b;\n}\nh1 {\n  color: #ff0000;\n}`
        }
      }
    },
    css_cp2: {
      title: 'The Box Model',
      subtitle: 'Learn width, height, padding, margin, borders, and content box layout.',
      videoEmbedUrl: 'https://www.youtube.com/embed/Ww9UabWHnQo?start=3600&rel=0&modestbranding=1',
      challenges: {
        css: {
          title: 'The Box Model',
          desc: `The CSS box model is essentially a box that wraps around every HTML element. It consists of: margins, borders, padding, and the actual content.

Your task is to create a class selector \`.box\` that sets:
1. \`padding\` to \`20px\`.
2. \`margin\` to \`15px\`.
3. \`border\` to \`2px solid\`.`,
          constraints: 'Must create a .box rule with padding, margin, and border properties.',
          testCases: [
            { input: 'Box Padding', expected: 'matches pattern', regex: '\\.box\\s*\\{[^}]*padding\\s*:\\s*20px' },
            { input: 'Box Margin', expected: 'matches pattern', regex: '\\.box\\s*\\{[^}]*margin\\s*:\\s*15px' },
            { input: 'Box Border', expected: 'matches pattern', regex: '\\.box\\s*\\{[^}]*border\\s*:\\s*2px' }
          ],
          hints: [
            'Use class selector syntax: .box { ... }',
            'Set padding: 20px;',
            'Set margin: 15px;',
            'Set border: 2px solid;'
          ],
          bp: `/* Add styling for .box class below */
`,
          sol: `.box {\n  padding: 20px;\n  margin: 15px;\n  border: 2px solid;\n}`
        }
      }
    },
    css_cp3: {
      title: 'Flexbox Magic',
      subtitle: 'Understand flexible layouts, row/column alignment, and spacing.',
      videoEmbedUrl: 'https://www.youtube.com/embed/Ww9UabWHnQo?start=7200&rel=0&modestbranding=1',
      challenges: {
        css: {
          title: 'Flexbox Magic',
          desc: `Flexbox is a one-dimensional layout method for arranging items in rows or columns.
          
Your task is to create a class selector \`.flex-container\` that sets:
1. \`display\` to \`flex\`.
2. \`justify-content\` to \`center\`.`,
          constraints: 'Must use display: flex and justify-content: center on .flex-container.',
          testCases: [
            { input: 'Flex Display', expected: 'matches pattern', regex: '\\.flex-container\\s*\\{[^}]*display\\s*:\\s*flex' },
            { input: 'Flex Justify Content Center', expected: 'matches pattern', regex: '\\.flex-container\\s*\\{[^}]*justify-content\\s*:\\s*center' }
          ],
          hints: [
            'Define class: .flex-container { ... }',
            'Add display: flex;',
            'Add justify-content: center;'
          ],
          bp: `/* Add styling for .flex-container class below */
`,
          sol: `.flex-container {\n  display: flex;\n  justify-content: center;\n}`
        }
      }
    },
    css_cp4: {
      title: 'CSS Grid Layout',
      subtitle: 'Build complex grid systems, templates, and grid gaps.',
      videoEmbedUrl: 'https://www.youtube.com/embed/Ww9UabWHnQo?start=10800&rel=0&modestbranding=1',
      challenges: {
        css: {
          title: 'CSS Grid Layout',
          desc: `CSS Grid Layout excels at dividing a page into major regions or defining the relationship in terms of size, position, and layer.
          
Your task is to create a class selector \`.grid-container\` that sets:
1. \`display\` to \`grid\`.
2. \`grid-template-columns\` to \`repeat(3, 1fr)\` or three equal-width columns.`,
          constraints: 'Must use display: grid and grid-template-columns on .grid-container.',
          testCases: [
            { input: 'Grid Display', expected: 'matches pattern', regex: '\\.grid-container\\s*\\{[^}]*display\\s*:\\s*grid' },
            { input: 'Grid Columns repeat(3, 1fr)', expected: 'matches pattern', regex: '\\.grid-container\\s*\\{[^}]*grid-template-columns\\s*:\\s*(repeat\\(3,\\s*1fr\\)|1fr\\s+1fr\\s+1fr)' }
          ],
          hints: [
            'Define class: .grid-container { ... }',
            'Set display: grid;',
            'Set grid-template-columns: repeat(3, 1fr);'
          ],
          bp: `/* Add styling for .grid-container class below */
`,
          sol: `.grid-container {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n}`
        }
      }
    },
    css_cp5: {
      title: 'Responsive Web Design',
      subtitle: 'Learn media queries, viewport setup, and mobile-first responsive design.',
      videoEmbedUrl: 'https://www.youtube.com/embed/Ww9UabWHnQo?start=14400&rel=0&modestbranding=1',
      challenges: {
        css: {
          title: 'Responsive Web Design',
          desc: `Responsive Web Design makes your web page look good on all devices.
          
Your task is to write a media query for screens with a maximum width of \`768px\` that hides the class \`.desktop-only\` by setting its \`display\` to \`none\`.`,
          constraints: 'Must define a media query for max-width: 768px and set .desktop-only to display: none.',
          testCases: [
            { input: 'Media Query for 768px', expected: 'matches pattern', regex: '@media\\s*\\([^)]*max-width\\s*:\\s*768px\\)' },
            { input: 'Hide desktop-only class', expected: 'matches pattern', regex: '\\.desktop-only\\s*\\{[^}]*display\\s*:\\s*none' }
          ],
          hints: [
            'Write @media (max-width: 768px) { ... }',
            'Inside, target the class: .desktop-only { display: none; }'
          ],
          bp: `/* Add media query for 768px below */
`,
          sol: `@media (max-width: 768px) {\n  .desktop-only {\n    display: none;\n  }\n}`
        }
      }
    }
  };

  const cp = checkpoints[checkpointId];
  if (!cp) return null;

  // Resolve active language challenge
  const challenge = cp.challenges[lang] || cp.challenges['html'];
  return {
    title: cp.title,
    subtitle: cp.subtitle,
    videoEmbedUrl: cp.videoEmbedUrl,
    challengeTitle: challenge.title,
    challengeDescription: challenge.desc,
    constraints: challenge.constraints,
    testCases: challenge.testCases,
    hints: challenge.hints,
    editorBoilerplate: challenge.bp,
    solutionCode: challenge.sol,
    functionName: challenge.functionName || ''
  };
};
