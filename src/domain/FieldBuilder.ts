import { Tag } from './index.js';
import type { Attributes, Template } from './index.js';

export interface InputOptions {
    as?: 'input' | 'textarea' | undefined;
    label?: string | undefined;
    labelHtml?: Attributes | undefined;
    [key: string]: string | number | boolean | Attributes | undefined;
}

function capitalize<T>(fieldName: keyof T & string) {
    return fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
}

export class FieldBuilder<T extends Template> {
    private template: T;
    private fields: Tag[] = [];

    constructor(template: T) {
        this.template = template;
    }

    public input(fieldName: keyof T & string, options: InputOptions = {}): void {

        if (!Object.prototype.hasOwnProperty.call(this.template, fieldName)) {
            throw new Error(`Field '${fieldName}' does not exist in the template.`);
        }

        const {
            as = 'input',
            label,
            labelHtml = {},
            ...rest
        } = options;

        const labelText = label ?? capitalize(fieldName);
        const labelTag = new Tag('label', { for: fieldName, ...labelHtml }, labelText);
        this.fields.push(labelTag);

        const restOptions: Attributes = {};
        for (const [key, val] of Object.entries(rest)) {
            if (typeof val !== 'object') {
                restOptions[key] = val;
            }
        }

        const value = String(this.template[fieldName] ?? '');

        if (as === 'textarea') {
            const { cols = 20, rows = 40, ...textareaAttrs } = restOptions;
            const textarea = new Tag('textarea', {
                cols,
                rows,
                name: fieldName,
                ...textareaAttrs,
            }, value);

            this.fields.push(textarea);
            return;
        }

        const { type = 'text', ...inputAttrs } = restOptions;
        const input = new Tag('input', {
            name: fieldName,
            type,
            value,
            ...inputAttrs,
        });

        this.fields.push(input);
    }

    public submit(value: string = "Save"): void {
        const sub = new Tag('input', {type: "submit", value});
        this.fields.push(sub);
    }

    public getFields(): Tag[] {
        return this.fields;
    }
}
