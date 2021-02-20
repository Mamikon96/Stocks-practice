const myApp = app();

const addingModel = {
    date: '',
    price: ''
};
const editingModel = {
    id: 'hide',
    date: '',
    price: ''
};

const addModalOptions = {
    title: 'Add Data',
    action: 'add',
    width: '400px',
    buttons: [
        {
            text: 'Add',
            type: 'submit',
            style: 'primary',
            handler: function (event) {
                event.preventDefault();
                const data = addModal.getFormData();
                myApp.addData(data);
                addModal.close();
            }
        },
        {
            text: 'Cancel',
            type: 'button',
            style: 'dark',
            handler: function () {
                addModal.close();
            }
        }
    ]
};
const addModal = modal(addModalOptions, addingModel);

const editModalOptions = {
    title: 'Edit data',
    action: 'update',
    width: '400px',
    buttons: [
        {
            text: 'Update',
            type: 'submit',
            style: 'primary',
            handler: function (event) {
                event.preventDefault();
                const data = editModal.getFormData();
                myApp.updateData(data);
                editModal.close();
            }
        },
        {
            text: 'Cancel',
            type: 'button',
            style: 'dark',
            handler: function () {
                editModal.close();
            }
        }
    ]
};
const editModal = modal(editModalOptions, editingModel);

// document.addEventListener('DOMContentLoaded', myApp.initApp(_getData(), _getChart('myChart')));
document.addEventListener('DOMContentLoaded', myApp.run);
// document.addEventListener('DOMContentLoaded', myApp.selectStock);

