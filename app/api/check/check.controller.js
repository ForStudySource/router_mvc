const redis = require('../../redis')('search');

exports.init = (req, res) => {
    let user = req.user;

    if (!user) {
        return res.status(401).json({msg: 'You need login'});
    }

    const targets = {
        naver: 1,
        daum: 1,
        google: 1
    };

    redis.hmset(user, targets);

    return res.status(200).json({'msg': 'success'});
}

exports.search = (req, res) => {
    let user = req.user;
    let sns = req.params.sns;

    if (!user) {
        return res.status(401).json({msg: 'You need login'});
    }

    redis.exists(user, (err, reply) => {

        if (reply) {

            redis.hgetall(user, (err, obj) => {
                if (err) throw err;

                obj[sns] = obj[sns] == 1 ? 0 : 1;

                redis.hmset(user, obj, (err, reply) => {
                    if (err) throw err;
                });
            });
        }
    })

    return res.status(200).json({'msg': 'success'});
}