/**
 * Utility function to clean and format HTML description content
 * Removes nested <p> tags inside <li> elements and normalizes HTML structure
 * @param {string} htmlString - Raw HTML string from backend
 * @returns {string} - Cleaned HTML string ready for rendering
 */
export const cleanHtmlDescription = (htmlString) => {
    if (!htmlString || typeof htmlString !== 'string') {
        return htmlString || '';
    }

    // Create a temporary DOM element to parse and manipulate HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlString;

    // Remove <p> tags inside <li> elements but keep their content
    const listItems = tempDiv.querySelectorAll('li p');
    listItems.forEach(pTag => {
        const parent = pTag.parentElement;
        // Move all child nodes (including text) from <p> to <li>
        while (pTag.firstChild) {
            parent.insertBefore(pTag.firstChild, pTag);
        }
        // Remove the empty <p> tag
        pTag.remove();
    });

    // Remove empty <p> tags (those with only whitespace or <br>)
    const paragraphs = tempDiv.querySelectorAll('p');
    paragraphs.forEach(pTag => {
        const content = pTag.textContent.trim();
        const hasOnlyBr = pTag.children.length === 0 && pTag.innerHTML.trim() === '<br>' || pTag.innerHTML.trim() === '<br></br>';
        if (!content && !hasOnlyBr) {
            pTag.remove();
        } else if (hasOnlyBr) {
            // Replace <p><br></p> with just a line break
            pTag.outerHTML = '<br>';
        }
    });

    // Clean up multiple consecutive <br> tags (keep only one)
    let cleanedHtml = tempDiv.innerHTML;
    cleanedHtml = cleanedHtml.replace(/(<br\s*\/?>){2,}/gi, '<br>');
    
    // Remove <br> tags at the start and end of elements
    cleanedHtml = cleanedHtml.replace(/^(<br\s*\/?>)+/gi, '');
    cleanedHtml = cleanedHtml.replace(/(<br\s*\/?>)+$/gi, '');

    return cleanedHtml;
};

/**
 * Alternative server-side safe version using regex (for SSR compatibility)
 * @param {string} htmlString - Raw HTML string from backend
 * @returns {string} - Cleaned HTML string
 */
export const cleanHtmlDescriptionRegex = (htmlString) => {
    if (!htmlString || typeof htmlString !== 'string') {
        return htmlString || '';
    }

    let cleaned = htmlString;

    // First, handle nested <p> tags inside <li> elements
    // Pattern: <li><p>content</p></li> -> <li>content</li>
    // This handles both simple and complex cases
    cleaned = cleaned.replace(/<li>\s*<p[^>]*>(.*?)<\/p>\s*<\/li>/gis, (match, content) => {
        // Trim whitespace but preserve the content
        const trimmedContent = content.trim();
        return `<li>${trimmedContent}</li>`;
    });

    // Also handle cases where <li> might have attributes
    cleaned = cleaned.replace(/<li[^>]*>\s*<p[^>]*>(.*?)<\/p>\s*<\/li>/gis, (match, content) => {
        // Extract the li attributes
        const liMatch = match.match(/<li([^>]*)>/);
        const liAttrs = liMatch ? liMatch[1] : '';
        const trimmedContent = content.trim();
        return `<li${liAttrs}>${trimmedContent}</li>`;
    });

    // Remove empty <p> tags (those with only whitespace or nothing)
    cleaned = cleaned.replace(/<p[^>]*>\s*<\/p>/gi, '');
    
    // Replace <p><br></p> or <p><br/></p> or <p><br></br></p> with just <br>
    cleaned = cleaned.replace(/<p[^>]*>\s*<br\s*\/?>\s*<\/p>/gi, '<br>');
    cleaned = cleaned.replace(/<p[^>]*>\s*<br><\/br>\s*<\/p>/gi, '<br>');
    
    // Replace <p><br><br></p> patterns (multiple br tags)
    cleaned = cleaned.replace(/<p[^>]*>\s*(<br\s*\/?>\s*)+<\/p>/gi, '<br>');

    // Clean up multiple consecutive <br> tags (keep only one)
    cleaned = cleaned.replace(/(<br\s*\/?>){2,}/gi, '<br>');
    
    // Remove <br> tags at the very start and end of the entire string
    cleaned = cleaned.replace(/^(<br\s*\/?>)+/gi, '');
    cleaned = cleaned.replace(/(<br\s*\/?>)+$/gi, '');

    // Clean up any remaining empty paragraphs
    cleaned = cleaned.replace(/<p[^>]*>\s*<\/p>/gi, '');

    return cleaned;
};
