const fs = require('fs');

const newArticles = JSON.parse(fs.readFileSync('new_articles.json', 'utf8'));
let fileContent = fs.readFileSync('app/data/articles.ts', 'utf8');

// Remove the trailing ];
fileContent = fileContent.replace(/];\s*$/, '');

// Format the new articles properly
const newArticlesString = newArticles.map(a => {
  return `  {
    slug: "${a.slug}",
    title: "${a.title}",
    description: "${a.description}",
    date: "${a.date}",
    category: "${a.category}",
    content: \`
${a.content}
    \`
  }`;
}).join(',\n');

fileContent += ',\n' + newArticlesString + '\n];\n';

fs.writeFileSync('app/data/articles.ts', fileContent);
console.log('Successfully added 5 new articles!');
