function server(url) {

    return {
        getAll() {
            return fetch(url);
        },
        getByTitle(title) {
            return fetch(url)
                .then(response => response.json())
                .then(data => {
                    return data.filter(item => item.title.toLowerCase() === title.toLowerCase());
                });
        },
        getKeys() {
            return fetch(url)
                .then(response => response.json())
                .then(data => {
                    const keys = [];
                    data.reduce((acc, item) => {
                        if (!acc.includes(item.title)) {
                            acc.push(item.title);
                        }
                        return acc;
                    }, keys);
                    return keys;
                })
        },
        add(object) {
            return fetch(url, {
                method: 'post',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(object)
            })
                .then(response => response.json());
        },
        update(object) {
            if (!object.id) return;
            return fetch(`${url}/${object.id}`, {
                method: 'put',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(object)
            })
                .then(response => response.json());
        },
        remove(id) {
            if (!id) return;
            return fetch(`${url}/${id}`, {
                method: 'delete'
            });
        }
    }
}
