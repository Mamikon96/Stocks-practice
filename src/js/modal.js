function modal(opts, model) {

    Element.prototype.appendAfter = function (element) {
        element.parentNode.insertBefore(this, element.nextSibling);
    }
    const _modal = _createModalByModel(opts, model);

    const modal = {
        open(data) {
            data && _fillForm(data);
            _modal.classList.add('open');
        },
        close() {
            // _clearForm();
            _modal.classList.remove('open');
        },
        getFormData() {
            const data = {};
            const inputs = [..._modal.querySelectorAll('.modal-content__item')];
            inputs.forEach(input => {
                data[input.name] = input.value;
            });
            return data;
        }
    };

    const closeListener = event => {
        if (event.target.dataset.close) {
            modal.close();
        }
    };
    _modal.addEventListener('click', closeListener);



    function _createModalByModel(opts, model) {
        const DEFAULT_WIDTH = '600px';
        let contentTemplate = '';
        for (let key in model) {
            if (model.hasOwnProperty(key)) {
                const input = `<input class="modal-content__item"
                                        name="${key}"
                                        type="text"
                                        required
                                        placeholder="Enter ${key}...">`;
                contentTemplate = contentTemplate.concat(input);
            }
        }

        const modal = document.createElement('div');
        modal.classList.add('custom-modal');
        modal.insertAdjacentHTML('afterbegin', `
            <div class="modal-overlay" data-close="true">
                <div class="modal-window" style="width: ${opts.width || DEFAULT_WIDTH}">
                    <form>
                        <div class="modal-header">
                            <span class="modal-title">${opts.title ? opts.title : 'Modal title'}</span>
                            <span class="modal-close" data-close="true">&times;</span>
                        </div>
                    </form>
                </div>
            </div>
        `);

        const content = _createContent();
        content.appendAfter(modal.querySelector('.modal-header'));

        const footer = _createFooter(opts.buttons);
        footer.appendAfter(modal.querySelector('.modal-content'));

        document.body.appendChild(modal);
        return modal;
    }

    function _checkParams() {
        const inputs = [..._modal.querySelectorAll('.modal-content__item')];

        let isValid = true;
        inputs.forEach(input => {
            isValid = isValid && input.value;
        });

        const submitBtn = [..._modal.querySelector('.modal-footer').children]
            .find(input => input.type === 'submit');
        if(isValid) {
            submitBtn.removeAttribute('disabled');
        } else {
            submitBtn.setAttribute('disabled', 'disabled');
        }
    }

    function _fillForm(data) {
        const inputs = [..._modal.querySelectorAll('.modal-content__item')];
        inputs.forEach(input => {
            input.value = data[input.name];
        });
        _checkParams();
    }

    function _clearForm() {
        const inputs = [..._modal.querySelectorAll('.modal-content__item')];
        inputs.forEach(input => {
            input.value = '';
        });
    }

    function _createContent() {

        const wrapDiv = document.createElement('div');
        wrapDiv.classList.add('modal-content');

        for (let key in model) {
            if (model.hasOwnProperty(key)) {

                const input = document.createElement('input');
                input.classList.add('modal-content__item');
                input.type = 'text';
                input.name = key;
                input.placeholder = `Enter ${key}...`;
                if (model[key] === 'hide') {
                    input.style.display = 'none';
                } else {
                    input.setAttribute('required', true);
                    input.onkeyup = _checkParams;
                }

                wrapDiv.appendChild(input);
            }
        }

        return wrapDiv;
    }

    function _createFooter(buttons = []) {
        const wrapDiv = document.createElement('div');
        if (buttons.length === 0) {
            return wrapDiv;
        }
        wrapDiv.classList.add('modal-footer');

        buttons.forEach(btn => {
            const _btn = document.createElement('button');
            _btn.textContent = btn.text;
            _btn.classList.add('btn');
            _btn.classList.add(`btn-${btn.style || 'primary'}`);
            _btn.onclick = btn.handler || function () {};
            _btn.type = btn.type || 'button';
            if (_btn.type === 'submit') {
                _btn.setAttribute('disabled', 'disabled');
            }

            wrapDiv.appendChild(_btn);
        });

        return wrapDiv;
    }


    return Object.assign(modal, {
        destroy() {
            _modal.parentNode.removeChild(_modal);
            _modal.removeEventListener('click', closeListener);
        }
    });
}
