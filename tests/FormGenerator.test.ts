import { describe, it, expect } from 'vitest';
import { FormGenerator } from '../src/domain/index.js';

describe('FormGenerator', () => {
    const template = { name: 'rob', job: 'hexlet', gender: 'm' };

    it('форма по умолчанию с method="post" и action="#"', () => {
        const form = FormGenerator.formFor(template, {}, () => {});
        expect(form).toBe('<form method="post" action="#"></form>');
    });

    it('корректный url в атрибут action', () => {
        const form = FormGenerator.formFor(template, { url: '/users' }, () => {});
        expect(form).toBe('<form method="post" action="/users"></form>');
    });

    it('options не переданы (или переданы пустыми)', () => {
        const form = FormGenerator.formFor(template);
        expect(form).toBe('<form method="post" action="#"></form>');
    });

    it('поля input и textarea на основе данных объекта', () => {
        const form = FormGenerator.formFor(template, { method: 'post' }, (f) => {
            f.input('name');
            f.input('job', { as: 'textarea' });
        });

        expect(form).toBe(
            '<form method="post" action="#">' +
            '<label for="name">Name</label>' +
            '<input name="name" type="text" value="rob">' +
            '<label for="job">Job</label>' +
            '<textarea cols="20" rows="40" name="job">hexlet</textarea>' +
            '</form>'
        );
    });

    it('дополнительные атрибуты для полей последним параметром', () => {
        const form = FormGenerator.formFor(template, {}, (f) => {
            f.input('name', { class: 'user-input' });
            f.input('job');
        });

        expect(form).toBe(
            '<form method="post" action="#">' +
            '<label for="name">Name</label>' +
            '<input name="name" type="text" value="rob" class="user-input">' +
            '<label for="job">Job</label>' +
            '<input name="job" type="text" value="hexlet">' +
            '</form>'
        );
    });

    it('поддержка кастомного текста label и атрибутов labelHtml', () => {
        const form = FormGenerator.formFor(template, {}, (f) => {
            f.input('name', {
                label: 'User',
                labelHtml: { class: 'form-label', id: 'name-label' },
            });
            f.submit('Ok');
        });

        expect(form).toBe(
            '<form method="post" action="#">' +
            '<label for="name" class="form-label" id="name-label">User</label>' +
            '<input name="name" type="text" value="rob">' +
            '<input type="submit" value="Ok">' +
            '</form>'
        );
    });

    it('дефолтные атрибуты для textarea и возможность их переопределять', () => {
        const defaultTextareaForm = FormGenerator.formFor(template, {}, (f) => {
            f.input('job', { as: 'textarea' });
        });

        expect(defaultTextareaForm).toBe(
            '<form method="post" action="#">' +
            '<label for="job">Job</label>' +
            '<textarea cols="20" rows="40" name="job">hexlet</textarea>' +
            '</form>'
        );

        const customTextareaForm = FormGenerator.formFor(template, { url: '#' }, (f) => {
            f.input('job', { as: 'textarea', rows: 50, cols: 50 });
        });

        expect(customTextareaForm).toBe(
            '<form method="post" action="#">' +
            '<label for="job">Job</label>' +
            '<textarea cols="50" rows="50" name="job">hexlet</textarea>' +
            '</form>'
        );
    });

    it('ошибка, если указанного поля нет в объекте', () => {
        expect(() => {
            FormGenerator.formFor(template, { url: '/users' }, (f) => {
                f.input('name');
                f.input('job', { as: 'textarea' });
                // @ts-expect-error Проверка рантайм-ошибки для несуществующего поля
                f.input('age');
            });
        }).toThrow("Field 'age' does not exist in the template.");
    });

    describe('Кнопка отправки (submit)', () => {
        it('submit со значением по умолчанию "Save"', () => {
            const form = FormGenerator.formFor(template, { method: 'post' }, (f) => {
                f.input('name');
                f.input('job', { as: 'textarea' });
                f.submit();
            });

            expect(form).toBe(
                '<form method="post" action="#">' +
                '<label for="name">Name</label>' +
                '<input name="name" type="text" value="rob">' +
                '<label for="job">Job</label>' +
                '<textarea cols="20" rows="40" name="job">hexlet</textarea>' +
                '<input type="submit" value="Save">' +
                '</form>'
            );
        });

        it('свой текст для кнопки submit', () => {
            const form = FormGenerator.formFor(template, { method: 'post' }, (f) => {
                f.input('name');
                f.input('job', { as: 'textarea' });
                f.submit('Wow');
            });

            expect(form).toBe(
                '<form method="post" action="#">' +
                '<label for="name">Name</label>' +
                '<input name="name" type="text" value="rob">' +
                '<label for="job">Job</label>' +
                '<textarea cols="20" rows="40" name="job">hexlet</textarea>' +
                '<input type="submit" value="Wow">' +
                '</form>'
            );
        });
    });
});
