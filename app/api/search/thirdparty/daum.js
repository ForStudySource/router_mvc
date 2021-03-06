const properties = require('../search.properties')['daum'];

module.exports = (() => {

    const parse = {};

    parse.params = function (params) {

        let keyword = params['search_keyword'];
        let type = params['search_group'];
        let page = params['page'];
        let sort = params['sort'];

        if (typeof(properties[type]) == 'undefined') {
            return {
                url: {
                    msg: 'invalid type of parameter'
                }
            };
        }

        const options = {
            sub: {
                page: page,
                sort: sort
            }
        }

        options['keyword'] = keyword;
        options['type'] = type;
        options['url'] = properties[type] + keyword;

        // sub Options
        if (page > 1) {
            if (!next(page, options)) {
                return {
                    url: {
                        msg: 'invalid page of parameter'
                    }
                };
            }
        }

        if (sort == 'date') {
            sortRequest(options);
        }

        return {
            url: options['url']
        }
    }

    parse.rename = function (obj) {
        const items = obj.channel['item'];
        const property = properties['property'];

        return items.map( (item) => {
            return (() => {
                const renewal = {};

                Object.keys(item).forEach( (key) => {

                    property.hasOwnProperty(key)
                        ? renewal[property[key]] = item[key]
                        : renewal[key] = item[key]

                })

                return renewal;
            })()
        })
    }

    function next (pageno, options) {
        // 1 ~ 3

        return pageno >= 4
            ? false
            : options['url'] += '&pageno=' + pageno;
    }

    function sortRequest (options) {
        options['url'] += '&sort=date';
    }

    return {
        params: parse.params,
        custermizing: parse.rename
    };

})()