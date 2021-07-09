var transactions;
var observer = null;
try {
    observer = lozad(); // lazy loads elements with default selector as '.lozad'
    observer.observe();
} catch (e) { console.log('lazy load not available') }

/* 

function getExtraInfos(transaction) {
    if (empty(transaction.objkt) || empty(transaction.price)) {
        url = internal_api + "transfers/" + transaction.hash + '/infos.json';
        data = apiSyncRequest(url);
        transaction.objkt = data.objkt;
        transaction.price = empty(data.price) ? '??' : data.price;
        if (empty(transaction.swap_id)) transaction.swap_id = data.swap_id;
    }
    return setExtraInfos(transaction);
};

function setExtraInfos(transaction) {
    data = transaction.objkt;
    if (empty(data)) return;
    if (!empty(data.name)) transaction.name = data.name;
    if (!empty(data.creator_twitter)) transaction.creator_twitter = data.creator_twitter;
    if (!empty(data.creator)) {
        if (transaction.type == 'swap' && data.creator != transaction.artist) {
            // artist resell something
            transaction.type = 'secondary';
        }
        transaction.creator = proper_value(data.creator);
        if (transaction.creator != transaction.artist) {
            if (!empty(data.creator_name)) {
                // we check if creator_name is a wallet instead of real name
                transaction.creator_name = proper_value(window.artists[transaction.creator_name]) || data.creator_name;
                if (empty(window.artists[transaction.creator])) window.artists[transaction.creator] = transaction.creator_name;
            } else transaction.creator_name = getArtistName(transaction.creator);
        } else if (!empty(data.creator) && (empty(transaction.artist_name) || transaction.artist_name == transaction.artist)) {
            transaction.artist_name = proper_value(data.creator_name);
            if (empty(window.artists[transaction.artist])) window.artists[transaction.artist] = transaction.artist_name;
        }
    } else if (transaction.type == 'swap' && transaction.quantity == 1) {
        // let's assume its a resale whenno creator as it only occur on old nft
        transaction.type = 'secondary';
    }
    return transaction;
};*/