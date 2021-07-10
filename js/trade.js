function priceFilter(price) {
    if (price < 15) return '10'; // just a bit
    else if (price < 50) return '20'; // i'm serious
    else if (price < 100) return '30'; // the real deal
    else return '99'; // all-in
}

function rarityFilter(edition) {
    edition = parseInt(edition);
    if (edition < 5) return '10'; // exclusive
    else if (edition <= 10) return '20'; // very rare
    else if (edition <= 20) return '30'; // rare
    else if (edition <= 50) return '40'; // uncommon
    else return '99'; // common
}

function filterSales(type, level) {
    if (type == 'price') filterByPrice(level);
    else if (type == 'rarity') filterByRarity(level);
}

function filterByPrice(level) {
    if (level == 0) $('div.single').show();
    else {
        $.each(window.transactions, function(idx, tx) {
            let key = `.single[data-swap|=${tx.swap_id}]`
            if (tx.price_filter == level) $(key).show();
            else $(key).hide();
        });
    }
}

function filterByRarity(level) {
    if (level == 0) $('div.single').show();
    else {
        $.each(window.transactions, function(idx, tx) {
            let key = `.single[data-id|=${tx.token.id}]`
            if (tx.rarity_filter == level) $(key).show();
            else $(key).hide();
        });
    }
}

function sortTrades(sort) {
    if (empty(sort)) sort = 'date';
    if (sort == 'date') {
        window.transactions.sort(function(a, b) {
            return b.date - a.date;
        });
    } 
	if (sort == 'unsold') {
        window.transactions.sort(function(a, b) {
        	return (b.token.supply/Math.max(0.01,b.token.trades_aggregate.aggregate.count)) - (a.token.supply/Math.max(0.01,a.token.trades_aggregate.aggregate.count));
        });
    }
 
    $('#result').scrollTop(0);
    processTrades(window.transactions, false);
}

function processTrades(list, sales) {
    $('#loading').hide();
    $('#result').html('');
    $("#result").show();
    $("#total").html(list.length);
    $.each(list, function(idx, tx) {
        showToken(tx, sales)
    });
    observer.observe();
}

async function showToken(tx, sales) {
    if (window.collection_type == 'sold' || window.collection_type == 'onsale') sales = true;
    else if (empty(sales)) sales = false;

    objkt = tx.token;
    id = tx.type == 'swap' ? "obj_" + objkt.id : 'trade_' + tx.id;
    creator_name = empty(objkt.creator.name) ? objkt.creator.address : objkt.creator.name;
    if (empty(creator_name)) creator_name = "unknown";
    if (!sales) creator_name = shorten_wallet(creator_name).substring(0, 20);

    artist = wallet_link(objkt.creator);
    if (!empty(tx.creator_twitter)) artist += " &bull; <a href='https://twitter.com/" + tx.creator_twitter + "'  class='social_icon' target='_blank'><img src='/images/twitter.png'/></a>";
    tx.swap_id

    if (sales) {
        obj = operation_link(objkt.id, `#${objkt.id}`, tx.platform);
        html = "<b>" + artist + "</b><br/>";
        html += "<span class='title'>" + objkt.title + '</span>';

        if (window.collection_type == 'sold') {
            html += wallet_link(tx.buyer) + " - ";
            html += formattedDate(new Date(tx.timestamp)) + "<br/>";
        }
    } else {
        obj = objkt_link(objkt.id) + ' &bull; ' + bid_link(objkt.id);
        date = formattedDate(new Date(tx.timestamp));
        date = "<a href='/history?token_id=" + objkt.id + "' target='_blank'>" + date + "</a><br/>";
        html = "<b>" + artist + "</b> - " + obj + "<br/>";
        html += `${objkt.available}/${objkt.supply} (Held:${objkt.held}) - Min: ${objkt.min_price}tz<br/>`;
        if (objkt.offer_count == 0) html += "Avail: 0 - ";
        else html += "Avail: " + objkt.offer_count + 'x' + objkt.offer_price + "tz - ";
        if (objkt.resale_count == 0) html += "2nd: 0<br/>";
        else html += "2nd: " + objkt.resale_count + 'x' + objkt.resale_price + "tz<br/>";

        if (tx.price <= 0) html += '<b>Gift:</b> ' + tx.amount + "x" + tx.price + " tz"
        else html += 'Buy: ' + tx.amount + "x" + tx.price + " tz";
        html += " - Com: " + (objkt.royalties / 10).round(2) + "%<br/>";
        html += formattedDate(new Date(tx.timestamp)) + "<br/>";
    }

    content = preview(objkt);
    if (content != '') html += operation_link(objkt.id, content, sales ? tx.platform : 'hen');
    tx.price_filter = priceFilter(tx.price);
    tx.rarity_filter = rarityFilter(objkt.supply);
    if (objkt.id == 136574) console.log(tx);
    $("#result").append(`<div class="single" id="${id}" data-id="${tx.token.id}" data-swap="${tx.swap_id}">${html}</div>`);
}
