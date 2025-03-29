import {Validation} from "./validation";
import {CustomHttp} from "../services/custom-http";
import config from "../config/config";

export class SubmitForm {
    constructor(form) {
        document.getElementById('button').addEventListener('click', this.sendMessage.bind(this));

        this.validation = new Validation();
        this.form = document.getElementById('form');
        this.loader = document.querySelector('.loader-main');
    }

    async sendMessage(e) {
        e.preventDefault();

        this.loader.style.display = 'flex';
        document.querySelectorAll('.error-input').forEach(element => {
            element.style.display = 'none';
        });

        if (this.validation.validateForm()) {
            const createData = {
                name: this.validation.nameInputElement.value,
                email: this.validation.emailInputElement.value,
                phone: this.validation.phoneInputElement.value,
                message: this.validation.messageInputElement.value,
            };

            try {
                const response = await CustomHttp.request(config.api + '/registration', "POST", createData);

                if (response.status === 'success') {
                    alert(response.msg);
                    this.form.reset();
                } else if (response.status === 'error') {
                    if (response.fields) {
                        this.displayErrors(response.fields);
                    } else if (response.message) {
                        alert(response.message);
                    }
                }
            } catch (error) {
                console.error('Ошибка при отправке формы:', error);
                alert('Произошла ошибка при отправке формы. Попробуйте еще раз.');
            }
        }
        this.loader.style.display = 'none';
    }

    displayErrors(fields) {
        const textInputArray = [this.validation.nameInputElement, this.validation.phoneInputElement,
            this.validation.messageInputElement, this.validation.emailInputElement];

        textInputArray.forEach(input => {
            const errorMessageElement = input.nextElementSibling;
            if (errorMessageElement) {
                errorMessageElement.style.display = 'none';
                input.classList.remove('error');
                input.style.borderColor = '';
            }

            const fieldError = fields[input.name];
            if (fieldError) {
                input.classList.add('error');
                input.style.borderColor = 'red';
                errorMessageElement.style.display = 'block';
                errorMessageElement.innerText = fieldError;
            }
        });
    }

}