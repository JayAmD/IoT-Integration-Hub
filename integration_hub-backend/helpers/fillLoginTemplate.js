import createTemplate from 'json-templates';

export function fillLoginTemplate(loginTemplate, variables) {
    let templateObject;
    try {
        // Only whole-value placeholders are supported; the library handles substitution.
        templateObject = JSON.parse(loginTemplate, (key, value) => {
            if (key === '__proto__' || key.includes('{{') || key.includes('}}')) throw new Error();
            if (typeof value === 'string' && (value.includes('{{') || value.includes('}}'))
                && value !== '{{clientId}}' && value !== '{{clientSecret}}') throw new Error();
            return value;
        });
    } catch {
        throw new Error('Invalid JSON template. Use clientId or clientSecret placeholders as whole values only.');
    }
    if (!templateObject || typeof templateObject !== 'object' || Array.isArray(templateObject)) {
        throw new Error('loginTemplate must be a JSON object.');
    }

    // Main tamplating
    const fillTemplate = createTemplate(templateObject);

    const loginBody = fillTemplate(variables);
    return JSON.stringify(loginBody);
}

