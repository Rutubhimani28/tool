const fs = require('fs');
const path = require('path');

const leftAdsOld = /\{\/\*\s*Left Ads \(Sticky\)\s*\*\/\}[\s\S]*?(<div className="hidden xl:flex flex-col w-\[300px\] shrink-0 sticky top-24 gap-6">)[\s\S]*?(<div className="w-\[300px\] min-h-\[250px\] flex items-center justify-center relative">[\s\S]*?<iframe src="\/ad1\.html"[\s\S]*?<\/div>)[\s\S]*?(<div className="w-\[300px\] min-h-\[250px\] flex items-center justify-center relative">[\s\S]*?<iframe src="\/ad2\.html"[\s\S]*?<\/div>)[\s\S]*?(<div className="w-\[300px\] min-h-\[250px\] flex items-center justify-center relative">)[\s\S]*?<iframe src="\/ad1\.html"[\s\S]*?(<\/div>)[\s\S]*?(<\/div>)/;

const leftAdsNew = `{/* Left Ads (Sticky) */}
                <div className="hidden xl:flex flex-col w-[300px] shrink-0 sticky top-24 gap-6">
                    <div className="w-[300px] min-h-[250px] flex items-center justify-center relative">
                        <iframe src="/ad1.html" width="300" height="250" style={{ border: 'none', overflow: 'hidden' }} scrolling="no" title="Advertisement" />
                    </div>
                    <div className="w-[300px] min-h-[250px] flex items-center justify-center relative">
                        <iframe src="/ad2.html" width="300" height="250" style={{ border: 'none', overflow: 'hidden' }} scrolling="no" title="Advertisement" />
                    </div>
                    <div className="w-[300px] min-h-[250px] flex items-center justify-center relative">
                        <iframe src="/ad3.html" width="300" height="250" style={{ border: 'none', overflow: 'hidden' }} scrolling="no" title="Advertisement" />
                    </div>
                </div>`;


const rightAdsOld = /\{\/\*\s*Right Ads \(Sticky\)\s*\*\/\}[\s\S]*?(<div className="hidden xl:flex flex-col w-\[300px\] shrink-0 sticky top-24 gap-6">)[\s\S]*?(<div className="w-\[300px\] min-h-\[250px\] flex items-center justify-center relative">)[\s\S]*?<iframe src="\/ad2\.html"[\s\S]*?(<\/div>)[\s\S]*?(<div className="w-\[300px\] min-h-\[250px\] flex items-center justify-center relative">[\s\S]*?<iframe src="\/ad1\.html"[\s\S]*?<\/div>)[\s\S]*?(<div className="w-\[300px\] min-h-\[250px\] flex items-center justify-center relative">)[\s\S]*?<iframe src="\/ad2\.html"[\s\S]*?(<\/div>)[\s\S]*?(<\/div>)/;

const rightAdsNew = `{/* Right Ads (Sticky) */}
                <div className="hidden xl:flex flex-col w-[300px] shrink-0 sticky top-24 gap-6">
                    <div className="w-[300px] min-h-[250px] flex items-center justify-center relative">
                        <iframe src="/ad3.html" width="300" height="250" style={{ border: 'none', overflow: 'hidden' }} scrolling="no" title="Advertisement" />
                    </div>
                    <div className="w-[300px] min-h-[250px] flex items-center justify-center relative">
                        <iframe src="/ad1.html" width="300" height="250" style={{ border: 'none', overflow: 'hidden' }} scrolling="no" title="Advertisement" />
                    </div>
                    <div className="w-[300px] min-h-[250px] flex items-center justify-center relative">
                        <iframe src="/ad3.html" width="300" height="250" style={{ border: 'none', overflow: 'hidden' }} scrolling="no" title="Advertisement" />
                    </div>
                </div>`;


const toolsDir = path.join(__dirname, 'app', 'tools');
if (fs.existsSync(toolsDir)) {
    const toolDirs = fs.readdirSync(toolsDir);
    toolDirs.forEach(dir => {
        const filePath = path.join(toolsDir, dir, 'page.tsx');
        if (fs.existsSync(filePath)) {
            let content = fs.readFileSync(filePath, 'utf8');
            
            let newContent = content.replace(leftAdsOld, leftAdsNew);
            newContent = newContent.replace(rightAdsOld, rightAdsNew);
            
            if (content !== newContent) {
                fs.writeFileSync(filePath, newContent);
                console.log(`Applied ad3 to ${dir}`);
            } else {
                console.log(`Failed regex on ${dir}`);
            }
        }
    });
}
