function app() {

    const _server = server('http://localhost:3000/stocks');
    const _chart = chart();
    let _stock = 'Газпром';

    function _addDataToTable(position, object) {
        let tbody = document.querySelector('table tbody');
        let newRow = _rowTemplate(position, object);
        tbody.appendChild(newRow);
    }

    async function _updateChart() {
        const [labels, values] = await _getDataForChart(_stock);
        _chart.data.labels = labels;

        if (_chart.data.datasets[0]) {
            _chart.data.datasets[0].label = _stock;
            _chart.data.datasets[0].data = values;
        } else {
            _chart.data.datasets.push({
                label: _stock,
                data: values,
                lineTension: 0,
                backgroundColor: 'transparent',
                borderWidth: 3,
                borderColor: 'blue'
            });
        }

        _chart.options.scales.yAxes[0].ticks.min = Math.min(...values);
        _chart.options.scales.yAxes[0].ticks.max = Math.max(...values);

        _chart.update();
    }

    async function _getDataForChart(title) {
        const data = await _server.getByTitle(title);

        data.sort((a, b) => {
            return a.date < b.date ? -1 : 1;
        });

        const dates = data.map(item => item.date);
        const prices = data.map(item => item.price);
        return [dates, prices];
    }

    function getRandomColor() {
        let color = '#';
        for (let j = 0; j < 6; j++) {
            color += Math.floor(Math.random() * 9.9);
        }
        return color;
    }

    function _rowTemplate(position, object) {
        let newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${position}<span class="id_hidden"></span></td>
            <td>${object.date}</td>
            <td>${object.price}</td>
            <td><div class="crud-actions"></div></td>
        `;

        let editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.classList.add('btn', 'btn-primary');
        editButton.onclick = _editHandler;

        let removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.classList.add('btn', 'btn-danger');
        removeButton.onclick = _removeHandler;

        let tds = newRow.querySelectorAll('td');
        tds[0].querySelector('.id_hidden').textContent = object.id;
        tds[tds.length - 1].children[0].appendChild(editButton);
        tds[tds.length - 1].children[0].appendChild(removeButton);

        return newRow;
    }

    function _editHandler(event) {
        let currentRow = event.target.parentElement.parentElement.parentElement;
        let columns = [...currentRow.querySelectorAll('td')];

        const data = {
            id: columns[0].children[0].textContent,
            date: columns[1].textContent,
            title: _stock,
            price: columns[2].textContent,
        };

        editModal.open(data);
    }

    async function _removeHandler(event) {
        let currentRow = event.target.parentElement.parentElement.parentElement;
        let columns = currentRow.querySelectorAll('td');

        let id = columns[0].children[0].textContent;

        await _server.remove(+id);
        await update();
    }

    async function update() {
        let tbody = document.querySelector('table tbody');
        tbody.innerHTML = '';

        const data = await _server.getByTitle(_stock);
        data.forEach((item, index) => {
            _addDataToTable(index + 1, item);
        });

        await _updateChart();
    }

    function _addStock(stockValue) {
        let stocksDropdownElements = document.querySelector('.table-toolbar_block ul.table-toolbar_element');
        let newStockDropdownElement = document.createElement('li');

        let innerElement = document.createElement('a');
        innerElement.textContent = stockValue;
        innerElement.classList.add('dropdown-item');
        innerElement.onclick = myApp.selectStock(stockValue);

        newStockDropdownElement.appendChild(innerElement);
        stocksDropdownElements.appendChild(newStockDropdownElement);
    }


    return {
        addStock() {
            let input = document.querySelector('.table-toolbar_block input.table-toolbar_element');
            let newStockValue = input.value;

            _addStock(newStockValue);

            input.value = '';
        },
        async addData(object) {
            object.id = Math.floor(Math.random() * 1612);
            object.title = _stock;

            await _server.add(object)
            await update();
        },
        async updateData(object) {
            object.id = +object.id;
            object.price = +object.price;
            object.title = _stock;

            await _server.update(object);
            await update();
        },
        async run() {
            const stocks = await _server.getKeys();
            for (const stock of stocks) {
                _addStock(stock);
            }
            _stock = stocks[0];
            document.querySelector('#dropdownMenuButton1').textContent = _stock;
            update();
        },
        selectStock(event) {

            return () => {
                document.querySelector('#dropdownMenuButton1').textContent = event ? event : 'Select _stock';
                _stock = event;
                update();
            }
        }
    }
}
